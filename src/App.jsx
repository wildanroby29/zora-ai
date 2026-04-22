import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="bot-typing">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
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
        setMessages([{ text: `Halo Wildan, ada yang bisa saya bantu hari ini?`, sender: 'bot' }]);
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
      setMessages(prev => [...prev, { text: "Koneksi terputus.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="entry-loader">
        <div className="circle-loader"></div>
        <p>Menyiapkan Aksara AI...</p>
      </div>
    );
  }

  return (
    <div className="app-viewport">
      {!isStarted ? (
        <div className="welcome-screen anim-zoom">
          <img src={botLogo} alt="Logo" className="welcome-logo" />
          <h1 className="anim-slide-up">{APP_NAME}</h1>
          <p className="anim-slide-up delay-1">{APP_TAGLINE}</p>
          <button className="start-btn anim-slide-up delay-2" onClick={startApp}>Mulai</button>
        </div>
      ) : (
        <div className="chat-layout">
          <header className="header-bar">
            <div className="header-inner">
              <img src={botLogo} alt="Logo" className="header-icon" />
              <div className="header-meta">
                <h3>{APP_NAME}</h3>
                <div className="online-status">
                  <span className="glow-indicator"></span> Online
                </div>
              </div>
            </div>
          </header>

          <main className="chat-area">
            {messages.map((m, i) => (
              <div key={i} className={`message-row ${m.sender} anim-pop`}>
                <div className="message-text">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="message-row bot anim-pop">
                <div className="message-text"><TypingAnimation /></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          <footer className="footer-bar">
            <div className="input-container">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Tulis pesan..." 
              />
              <button 
                className={`send-button ${input.trim() ? 'ready' : ''}`} 
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
