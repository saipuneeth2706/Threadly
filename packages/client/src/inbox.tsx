import React, { useState, useEffect } from 'react';
import './index.css'; 

interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  body: string;
}

const Inbox: React.FC = () => {
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:3001/emails')
      .then(response => response.json())
      .then((data: Email[]) => {
        setEmails(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching emails:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="loading">Loading emails...</div>;
  }

  return (
    <div className="inbox-container">
      <h1>Your Inbox</h1>
      <div className="email-list">
        {emails.map((email) => ( 
          <div key={email.id} className="email-item">
            <p className="email-from">{email.from}</p>
            <p className="email-subject">{email.subject}</p>
            <p className="email-snippet">{email.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;