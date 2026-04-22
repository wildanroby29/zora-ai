import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="bot-typing-indicator">
    <span className="dot"></span>
    <span className="dot"></span>
    <span className="dot"></span>
  </div>
);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
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
      }, 600);
    }, 1500);
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
      setMessages(prev => [...prev, { text: "Koneksi ke server bermasalah.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="fullscreen-loader">
        <div className="loader-spinner"></div>
        <p>Menyiapkan Sistem...</p>
      </div>
    );
  }

  return (
    <div className="app-main-container">
      {!isStarted ? (
        <div className="welcome-gate anim-fade-in">
          <img src={botLogo} alt="Logo" className="w-logo-large" />
          <h1 className="w-title">{APP_NAME}</h1>
          <p className="w-subtitle">{APP_TAGLINE}</p>
          <button className="w-btn" onClick={startApp}>Mulai Percakapan</button>
        </div>
      ) : (
        <div className="chat-interface-wrapper">
          {/* HEADER: MATI DI ATAS */}
          <header className="app-header">
            <div className="header-content">
              <img src={botLogo} alt="Logo" className="header-logo" />
              <div className="header-meta">
                <span className="brand-name">{APP_NAME}</span>
                <div className="status-container">
                  <span className="status-glow"></span>
                  <span className="status-text">Online</span>
                </div>
              </div>
            </div>
          </header>

          {/* AREA CHAT: HANYA INI YANG BISA SCROLL */}
          <main className="chat-scroll-area">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.sender} anim-pop-up`}>
                <div className="bubble">
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-row bot anim-pop-up">
                <div className="bubble">
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          {/* FOOTER: MATI DI BAWAH (INPUT) */}
          <footer className="app-footer">
            <div className="input-group">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Ketik pesan..." 
              />
              <button 
                className={`send-btn ${input.trim() ? 'active' : ''}`} 
                onClick={handleSend}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
