import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // 🔥 Fix viewport seperti ChatGPT
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    updateHeight();
    window.visualViewport?.addEventListener('resize', updateHeight);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Auto scroll ke bawah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [messages, loading]);

  // Auto resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);

    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;

    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInput('');
    setLoading(true);

    // reset tinggi textarea
    if (inputRef.current) inputRef.current.style.height = "auto";

    // simulasi bot
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Ini respon dari bot 🤖", sender: 'bot' }]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-shell">
      <div className="main-chat-layout">

        {/* HEADER */}
        <header className="chat-header">
          <h2>ChatGPT Clone</h2>
          <span className="status">Online</span>
        </header>

        {/* CHAT */}
        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.sender}`}>
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="msg bot">Typing...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="input-box">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              rows={1}
            />
            <button
              className={`send-btn ${input.trim() ? 'active' : ''}`}
              onClick={handleSend}
            >
              ➤
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
