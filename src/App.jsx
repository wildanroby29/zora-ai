import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="typing-dots">
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
        setMessages([{ text: `Halo Wildan, ada yang bisa saya bantu?`, sender: 'bot' }]);
      }, 500);
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
      setMessages(prev => [...prev, { text: "Gagal terhubung ke server.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="init-loader">
        <div className="loader-ring"></div>
        <p>Memuat {APP_NAME}...</p>
      </div>
    );
  }

  return (
    <div className="main-viewport">
      {!isStarted ? (
        <div className="landing-screen anim-fade">
          <img src={botLogo} alt="Logo" className="landing-logo" />
          <h1 className="anim-up">{APP_NAME}</h1>
          <p className="anim-up delay-1">{APP_TAGLINE}</p>
          <button className="start-btn anim-up delay-2" onClick={startApp}>Mulai</button>
        </div>
      ) : (
        <div className="chat-layer">
          <header className="fixed-top">
            <div className="header-box">
              <img src={botLogo} alt="Bot" className="bot-icon" />
              <div className="bot-status-wrapper">
                <h3>{APP_NAME}</h3>
                <div className="status-badge">
                  <span className="lamp-glow"></span>
                  Online
                </div>
              </div>
            </div>
          </header>

          <main className="fixed-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-row ${m.sender} anim-pop`}>
                <div className="bubble-text">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-row bot anim-pop">
                <div className="bubble-text"><TypingAnimation /></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          <footer className="fixed-bottom">
            <div className="input-group-custom">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Ketik pesan..." 
              />
              <button 
                className={`btn-send-custom ${input.trim() ? 'active' : ''}`} 
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
