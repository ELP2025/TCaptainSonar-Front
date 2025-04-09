import React from 'react';
import './ChatHistory.css';

type ChatMessage = {
  text: string;
  isSystem?: boolean;
};

interface ChatHistoryProps {
  messages: ChatMessage[];
  maxMessages?: number;
  title?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  messages, 
  maxMessages = 5, 
  title = "Historique" 
}) => {
  const displayedMessages = messages.slice(-maxMessages);

  return (
    <div className="chat-container">
      <div className="chat-header">{title}</div>
      <div className="chat-messages">
        {displayedMessages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.isSystem ? "system" : ""}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;