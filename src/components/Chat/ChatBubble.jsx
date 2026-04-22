import React from 'react';

const ChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px'
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '14px 18px',
        borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
        backgroundColor: isUser ? '#1F2937' : 'white',
        color: isUser ? 'white' : '#1F2937',
        fontWeight: isUser ? '400' : '600',
        fontSize: '15px',
        lineHeight: '1.5',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        border: isUser ? 'none' : '1px solid #E5E7EB'
      }}>
        {message.text}
      </div>
    </div>
  );
};

export default ChatBubble;
