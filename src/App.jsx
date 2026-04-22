import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="bot-typing-status">
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
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startApp = () => {
    setIsStarted(true);
    // Munculkan pesan sambutan otomatis
    setTimeout(() => {
      setMessages([{ text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu?`, sender: 'bot' }]);
    }, 600);
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
      setMessages(prev => [...prev, { text: "Gagal memuat balasan.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      {!isStarted ? (
        <div className="welcome-screen anim-in">
          <img src={botLogo} alt="Logo" className="w-logo" />
          <h1 className="w-title">{APP_NAME}</h1>
          <p className="w-subtitle">{APP_TAGLINE}</p>
          <button className="start-btn" onClick={startApp}>Mulai Percakapan</button>
        </div>
      ) : (
        <div className="chat-interface">
          {/* HEADER TERKUNCI */}
          <header className="fixed-header">
            <div className="header-inner">
              <img src={botLogo} alt="Logo" className="h-logo" />
              <div className="h-meta">
                <h3>{APP_NAME}</h3>
                <div className="h-online">
                  <span className="glow-dot"></span> Online
                </div>
              </div>
            </div>
          </header>

          {/* AREA CHAT INDEPENDEN */}
          <main className="scrollable-chat">
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.sender} anim-pop`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg-row bot anim-pop">
                <div className="bubble"><TypingAnimation /></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          {/* FOOTER TERKUNCI DENGAN IKON DI DALAM BOX */}
          <footer className="fixed-footer">
            <div className="input-box-container">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Tulis pesan..." 
              />
              <button 
                className={`send-action-btn ${input.trim() ? 'active' : ''}`} 
                onClick={handleSend}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
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
