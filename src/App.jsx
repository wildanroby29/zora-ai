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

  // ✅ FIX HEADER HILANG (WAJIB)
useEffect(() => {
  const updateHeight = () => {
    const vh = window.visualViewport?.height || window.innerHeight;
    const offsetTop = window.visualViewport?.offsetTop || 0;

    document.documentElement.style.setProperty('--app-height', `${vh}px`);
    document.documentElement.style.setProperty('--app-offset-top', `${offsetTop}px`);
  };

  updateHeight();
  window.visualViewport?.addEventListener('resize', updateHeight);
  window.visualViewport?.addEventListener('scroll', updateHeight);

  return () => {
    window.visualViewport?.removeEventListener('resize', updateHeight);
    window.visualViewport?.removeEventListener('scroll', updateHeight);
  };
}, []);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startApp = () => {
    setAppLoading(true);
    setTimeout(() => {
      setAppLoading(false);
      setIsStarted(true);
      setTimeout(() => {
        setMessages([{ 
          text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu hari ini?`, 
          sender: 'bot' 
        }]);
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
      setMessages(prev => [...prev, { text: "Maaf Wildan, koneksi saya sedang terputus.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p className="loading-text">Menyiapkan {APP_NAME}...</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {!isStarted ? (
        <div className="welcome-page">
          <div className="welcome-content zoom-in">
            <img src={botLogo} alt="Logo" className="bot-welcome-img" />
            <h1 className="slide-up">{APP_NAME}</h1>
            <p className="slide-up delay-1">{APP_TAGLINE}</p>
            <button className="start-btn slide-up delay-2" onClick={startApp}>
              Mulai Percakapan
            </button>
          </div>
        </div>
      ) : (
        <div className="main-chat-layout fade-in">

          {/* HEADER */}
          <header className="chat-header">
            <img src={botLogo} alt="Icon" className="bot-header-img" />
            <div className="info">
              <h2 className="slide-right">
                {APP_NAME} {APP_MODE.charAt(0).toUpperCase() + APP_MODE.slice(1)}
              </h2>
              <div className="status slide-right delay-1">
                <span className="dot pulse"></span> Online
              </div>
            </div>
          </header>

          {/* CHAT */}
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender === 'user' ? 'user' : 'bot'} slide-up`}>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="msg bot slide-up">
                <TypingAnimation />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* FOOTER */}
          <footer className="footer slide-up">
            <div className="input-box">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Tanya sesuatu ke Zora..." 
              />
              <button 
                className={`send-btn ${input.trim() ? 'active' : ''}`} 
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
