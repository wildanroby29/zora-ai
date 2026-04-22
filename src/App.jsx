import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

const TypingAnimation = () => (
  <div className="typing-box">
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
        setMessages([{ text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu hari ini?`, sender: 'bot' }]);
      }, 600);
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
      setMessages(prev => [...prev, { text: "Koneksi terputus.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="gate-loader">
        <div className="spin"></div>
        <p>Initializing {APP_NAME}...</p>
      </div>
    );
  }

  return (
    <div className="app-frame">
      {!isStarted ? (
        <div className="hero-screen zoom-in">
          <img src={botLogo} alt="Logo" className="hero-logo" />
          <h1 className="slide-up">{APP_NAME}</h1>
          <p className="slide-up d-1">{APP_TAGLINE}</p>
          <button className="hero-btn slide-up d-2" onClick={startApp}>Mulai</button>
        </div>
      ) : (
        <div className="app-container">
          <header className="app-header">
            <div className="header-inner">
              <img src={botLogo} alt="Logo" className="header-icon" />
              <div className="header-meta">
                <h3>{APP_NAME} {APP_MODE.toUpperCase()}</h3>
                <div className="online-badge">
                  <span className="glow-point"></span> Online
                </div>
              </div>
            </div>
          </header>

          <main className="chat-scrollarea">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender} anim-pop`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble bot anim-pop">
                <TypingAnimation />
              </div>
            )}
            <div ref={chatEndRef} />
          </main>

          <footer className="app-footer">
            <div className="chat-input-wrapper">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="Tanya apapun..." 
              />
              <button 
                className={`send-action ${input.trim() ? 'can-send' : ''}`} 
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
