"use client";

import { useState, useEffect } from "react";

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
    } catch (err: any) {
      setError(err.message);
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
    if (payload.body && payload.body.data) {
      return decodeBase64(payload.body.data);
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        const body = getEmailBody(part);
        if (body) return body;
      }
    }
    return "";
  };

  const decodeBase64 = (base64: string): string => {
    try {
      // Decode base64 to a UTF-8 string
      let decoded = Buffer.from(base64, "base64").toString("utf-8");
      // Clean up common issues with Gmail's base64 encoding (e.g., URL-safe characters)
      decoded = decoded.replace(/-/g, "+").replace(/_/g, "/");
      return decoded;
    } catch (e) {
      console.error("Error decoding base64:", e);
      return "[Undecodable Content]";
    }
  };

  const selectedChat = selectedDomain ? chats.get(selectedDomain) : null;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Threadly Frontend Demo (Chat View)</h1>

      <div>
        <label htmlFor="accessToken">Access Token:</label>
        <input
          type="text"
          id="accessToken"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          style={{ width: "400px", padding: "8px", margin: "10px 0" }}
          placeholder="Paste your Gmail API access token here"
        />
        <button
          onClick={fetchEmails}
          disabled={loading || !accessToken}
          style={{ padding: "8px 15px", marginLeft: "10px", cursor: "pointer" }}
        >
          {loading ? "Fetching..." : "Fetch Emails"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ display: "flex", marginTop: "20px" }}>
        {/* Chats List */}
        <div style={{ width: "30%", borderRight: "1px solid #ccc", paddingRight: "20px" }}>
          <h2>Chats ({chats.size})</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Array.from(chats.values()).map((chat) => (
              <li
                key={chat.domain}
                onClick={() => setSelectedDomain(chat.domain)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    selectedDomain === chat.domain ? "#e6f7ff" : "white",
                  cursor: "pointer",
                }}
              >
                <strong>{chat.domain}</strong> (
                {chat.messages.length} messages)
                <p style={{ fontSize: "0.8em", color: "#666" }}>
                  {chat.messages[chat.messages.length - 1]?.snippet.substring(0, 100)}...
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Message Details */}
        <div style={{ width: "70%", paddingLeft: "20px" }}>
          {selectedChat ? (
            <div>
              <h2>Chat: {selectedChat.domain}</h2>
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      borderBottom: "1px dashed #eee",
                      marginBottom: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    <strong>Message ID:</strong> {message.id}
                    <br />
                    <strong>From:</strong>{" "}
                    {
                      message.payload.headers.find(
                        (h) => h.name === "From"
                      )?.value
                    }
                    <br />
                    <strong>To:</strong>{" "}
                    {
                      message.payload.headers.find((h) => h.name === "To")
                        ?.value
                    }
                    <br />
                    <strong>Date:</strong> {new Date(message.internalDate).toLocaleString()}
                    <br />
                    <p>
                        <strong>Subject:</strong> {message.payload.headers.find(h => h.name === 'Subject')?.value}
                    </p>
                    <p>
                        <strong>Snippet:</strong> {message.snippet}
                    </p>
                    <div style={{backgroundColor: "#f9f9f9", padding: "10px", border: "1px solid #eee", whiteSpace: "pre-wrap"}}>
                        {getEmailBody(message.payload) || "No body content"}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Select a chat to view its messages.</p>
          )}
        </div>
      </div>
    </div>
  );
}