import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="typing-container">
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
  </div>
);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startApp = () => {
    setAppLoading(true);
    setTimeout(() => {
      setAppLoading(false);
      setIsStarted(true);
      setTimeout(() => {
        setMessages([{ text: `Halo Wildan, ada yang bisa saya bantu?`, sender: 'bot' }]);
      }, 500);
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("https://wildanrobians29-chat-backend.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, category: APP_MODE })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Gagal terhubung.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="loading-page">
        <div className="spinner-orbit"></div>
        <p>Loading {APP_NAME}...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {!isStarted ? (
        <div className="welcome-gate">
          <img src={botLogo} alt="Logo" className="w-logo-small" />
          <div className="w-hero">
            <h1>{APP_NAME}</h1>
            <p>{APP_TAGLINE}</p>
          </div>
          <button className="start-button" onClick={startApp}>Mulai Percakapan</button>
        </div>
      ) : (
        <div className="chat-canvas">
          <header className="header-fixed">
            <div className="header-brand">
              <img src={botLogo} alt="Logo" className="h-icon" />
              <div className="h-labels">
                <h3>{APP_NAME}</h3>
                <div className="h-status">
                  <span className="dot-pulse"></span>
                  <span className="status-text">Online</span>
                </div>
              </div>
            </div>
          </header>

          <main className="chat-scroller">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender} slide-in-bottom`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="msg bot slide-in-bottom">
                <TypingAnimation />
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          <footer className="footer-fixed">
            <div className="input-row">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Tulis pesan..." 
              />
              <button 
                className={`action-btn ${input.trim() ? 'ready' : ''}`} 
                onClick={handleSend}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
