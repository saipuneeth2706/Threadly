"use client";

import { useState } from "react";

interface EmailHeader {
  name: string;
  value: string;
}

interface EmailPayload {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers: EmailHeader[];
  body?: {
    size: number;
    data: string; // Base64 encoded body
  };
  parts?: EmailPayload[]; // Nested parts for multipart messages
}

interface EmailMessage {
  id: string; // Message ID
  threadId: string; // Thread ID
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: EmailPayload;
  sizeEstimate: number;
  raw: string; // Raw base64-encoded email
}

interface Chat {
  domain: string;
  messages: EmailMessage[];
}

export default function Home() {
  const [accessToken, setAccessToken] = useState<string>("");
  const [chats, setChats] = useState<Map<string, Chat>>(new Map());
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/gmail/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: EmailMessage[] = await response.json();
      groupEmailsByDomain(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const extractDomainFromEmail = (fromHeader: string): string | null => {
    const emailMatch = fromHeader.match(/<([^>]+)>/);
    const email = emailMatch ? emailMatch[1] : fromHeader;
    const domainMatch = email.match(/@([^\s>]+)/);
    return domainMatch ? domainMatch[1] : null;
  };

  const groupEmailsByDomain = (emails: EmailMessage[]) => {
    const groupedChats = new Map<string, Chat>();

    emails.forEach((email) => {
      const fromHeader = email.payload.headers.find(
        (header) => header.name === "From"
      )?.value;

      if (fromHeader) {
        const domain = extractDomainFromEmail(fromHeader);
        if (domain) {
          if (!groupedChats.has(domain)) {
            groupedChats.set(domain, {
              domain: domain,
              messages: [],
            });
          }
          groupedChats.get(domain)?.messages.push(email);
        }
      }
    });

    // Sort messages within each chat by internalDate
    groupedChats.forEach((chat) => {
      chat.messages.sort(
        (a, b) =>
          new Date(a.internalDate).getTime() -
          new Date(b.internalDate).getTime()
      );
    });

    setChats(groupedChats);
  };

  const getEmailBody = (payload: EmailPayload): string => {
    // Helper to find body part by MIME type
    const findBodyPart = (
      parts: EmailPayload[] | undefined,
      mimeType: string
    ): string | null => {
      if (!parts) return null;
      for (const part of parts) {
        if (part.mimeType === mimeType && part.body?.data) {
          return decodeBase64(part.body.data);
        }
        if (part.parts) {
          const found = findBodyPart(part.parts, mimeType);
          if (found) return found;
        }
      }
      return null;
    };

    // Prioritize HTML part
    const htmlBody = findBodyPart(payload.parts, "text/html");
    if (htmlBody) {
      return htmlBody;
    }

    // Fallback to plain text if no HTML part
    const plainTextBody = findBodyPart(payload.parts, "text/plain");
    if (plainTextBody) {
      return plainTextBody;
    }

    // Last resort: check the main payload body if it's not multipart
    if (payload.body && payload.body.data && payload.mimeType === "text/html") {
      return decodeBase64(payload.body.data);
    }
    if (
      payload.body &&
      payload.body.data &&
      payload.mimeType === "text/plain"
    ) {
      return decodeBase64(payload.body.data);
    }

    return "No body content";
  };

  const decodeBase64 = (base64: string): string => {
    try {
      // Decode base64 to a UTF-8 string
      const decoded = Buffer.from(
        base64.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf-8");
      return decoded;
    } catch (e) {
      console.error("Error decoding base64:", e);
      return "[Unable to decode content]";
    }
  };

  const selectedChat = selectedDomain ? chats.get(selectedDomain) : null;

  return (
    <div className="flex h-screen bg-gray-dark text-white">
      {/* Icon Sidebar */}
      <div className="w-16 bg-gray-medium p-4 flex flex-col items-center">
        <div className="text-2xl font-bold mb-8">T</div>
        <div className="space-y-4">
          <div className="w-10 h-10 bg-gray-light rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-light rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-light rounded-lg"></div>
          <div className="w-10 h-10 bg-gray-light rounded-lg"></div>
        </div>
      </div>

      {/* Chats List */}
      <div className="w-1/4 bg-gray-medium p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Threadly</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for previous mails..."
            className="w-full bg-gray-light rounded-lg p-2"
          />
        </div>
        <ul>
          {Array.from(chats.values()).map((chat) => (
            <li
              key={chat.domain}
              onClick={() => setSelectedDomain(chat.domain)}
              className={`p-4 rounded-lg cursor-pointer ${
                selectedDomain === chat.domain ? "bg-gray-very-light" : ""
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-light rounded-full flex items-center justify-center mr-4">
                  {chat.domain.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold">{chat.domain}</div>
                  <div className="text-sm text-gray-400">
                    {chat.messages.length} messages
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Message Details */}
      <div className="w-3/4 p-4">
        {selectedChat ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-light rounded-full flex items-center justify-center mr-4">
                  {selectedChat.domain.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold">{selectedChat.domain}</h2>
              </div>
              <div className="text-gray-400">...</div>
            </div>
            <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
              {selectedChat.messages.map((message) => (
                <div key={message.id} className="bg-gray-medium p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <strong>From:</strong>{" "}
                      {
                        message.payload.headers.find((h) => h.name === "From")
                          ?.value
                      }
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(message.internalDate).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <strong>To:</strong>{" "}
                    {
                      message.payload.headers.find((h) => h.name === "To")?.value
                    }
                  </div>
                  <div className="font-bold mt-2">
                    {
                      message.payload.headers.find((h) => h.name === "Subject")
                        ?.value
                    }
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getEmailBody(message.payload),
                    }}
                    className="mt-4 prose prose-invert"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full bg-gray-light rounded-lg p-2"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome to Threadly</h2>
              <p className="text-gray-400">Select a chat to start messaging</p>
              <div className="mt-8">
                <label htmlFor="accessToken">Access Token:</label>
                <input
                  type="text"
                  id="accessToken"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full bg-gray-light rounded-lg p-2 mt-2"
                  placeholder="Paste your Gmail API access token here"
                />
                <button
                  onClick={fetchEmails}
                  disabled={loading || !accessToken}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                >
                  {loading ? "Fetching..." : "Fetch Emails"}
                </button>
                {error && <p className="text-red-500 mt-4">Error: {error}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
