import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

// 1. KOMPONEN HEADER (TERPISAH)
const Header = () => (
  <header className="fixed-header-layer">
    <div className="h-content">
      <img src={botLogo} alt="Logo" />
      <div className="h-info">
        <h3>{APP_NAME}</h3>
        <p><span className="dot"></span> Online</p>
      </div>
    </div>
  </header>
);

// 2. KOMPONEN FOOTER (TERPISAH)
const Footer = ({ input, setInput, handleSend, loading }) => (
  <footer className="fixed-footer-layer">
    <div className="input-group">
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
        placeholder="Ketik pesan..." 
      />
      <button 
        className={input.trim() && !loading ? 'send-active' : ''} 
        onClick={handleSend}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>
  </footer>
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
    setTimeout(() => {
      setMessages([{ text: `Halo Wildan, selamat datang di ${APP_NAME}. Ada yang bisa dibantu?`, sender: 'bot' }]);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const currentMsg = input;
    setMessages(prev => [...prev, { text: currentMsg, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("https://wildanrobians29-chat-backend.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMsg, category: APP_MODE })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (e) {
      setMessages(prev => [...prev, { text: "Koneksi terputus.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="welcome-screen">
        <img src={botLogo} alt="Logo" className="gate-logo" />
        <h1>{APP_NAME}</h1>
        <p>{APP_TAGLINE}</p>
        <button onClick={startApp}>Mulai</button>
      </div>
    );
  }

  return (
    // FRAGMENT AGAR TIDAK ADA PEMBUNGKUS EXTRA YANG BISA TERDORONG
    <>
      <Header />
      
      <main className="chat-body-layer">
        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.sender}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg-row bot">
            <div className="bubble typing">...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <Footer 
        input={input} 
        setInput={setInput} 
        handleSend={handleSend} 
        loading={loading} 
      />
    </>
  );
}

export default App;
