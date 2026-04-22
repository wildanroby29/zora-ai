import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="typing-indicator">
    <span></span><span></span><span></span>
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
        setMessages([{ text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu hari ini?`, sender: 'bot' }]);
      }, 500);
    }, 1200);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const currentInput = input;
    setMessages(prev => [...prev, { text: currentInput, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("https://wildanrobians29-chat-backend.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, category: APP_MODE })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Gagal memuat pesan.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Memuat {APP_NAME}...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!isStarted ? (
        <div className="welcome-screen zoom-in">
          <img src={botLogo} alt="Logo" className="w-logo" />
          <div className="w-text">
            <h1>{APP_NAME}</h1>
            <p>{APP_TAGLINE}</p>
          </div>
          <button className="w-btn" onClick={startApp}>Mulai Percakapan</button>
        </div>
      ) : (
        <div className="chat-layout fade-in">
          <header className="fixed-header">
            <div className="header-content">
              <img src={botLogo} alt="Icon" className="h-logo" />
              <div className="h-info">
                <h3>{APP_NAME} {APP_MODE.toUpperCase()}</h3>
                <div className="h-status">
                  <span className="glow-dot"></span> Online
                </div>
              </div>
            </div>
          </header>

          <main className="chat-area">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.sender} message-anim`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="bubble bot message-anim"><TypingAnimation /></div>}
            <div ref={chatEndRef} />
          </main>

          <footer className="fixed-footer">
            <div className="input-group">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Ketik pesan..." 
              />
              <button className={`s-btn ${input.trim() ? 'active' : ''}`} onClick={handleSend}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
