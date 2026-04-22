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
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      setMessages(prev => [...prev, { text: "Koneksi bermasalah.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-viewport">
      {!isStarted ? (
        <div className="start-screen">
          <img src={botLogo} alt="Logo" className="start-logo" />
          <h1>{APP_NAME}</h1>
          <p>{APP_TAGLINE}</p>
          <button onClick={() => setIsStarted(true)}>Mulai Percakapan</button>
        </div>
      ) : (
        <div className="app-layout">
          {/* HEADER TETAP DI ATAS */}
          <header className="main-header">
            <div className="header-flex">
              <img src={botLogo} alt="Logo" className="h-logo" />
              <div className="h-info">
                <h3>{APP_NAME}</h3>
                <div className="online-tag">
                  <span className="dot-glow"></span> Online
                </div>
              </div>
            </div>
          </header>

          {/* AREA CHAT YANG BISA DI-SCROLL */}
          <main className="chat-container">
            {messages.map((m, i) => (
              <div key={i} className={`msg-wrapper ${m.sender} anim-up`}>
                <div className="msg-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="msg-wrapper bot anim-up">
                <div className="msg-bubble"><TypingAnimation /></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          {/* FOOTER INPUT DI BAWAH */}
          <footer className="main-footer">
            <div className="input-box-wrapper">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Ketik pesan..." 
              />
              <button 
                className={`send-button ${input.trim() ? 'active' : ''}`} 
                onClick={handleSend}
                type="button"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
