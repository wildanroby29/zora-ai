import React from 'react';

const TypingIndicator = () => (
  <div className="flex space-x-2 p-4 bg-white rounded-2xl w-16 shadow-sm border border-purple-100">
    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
  </div>
);

export default TypingIndicator;
