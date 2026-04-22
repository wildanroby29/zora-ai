import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Header from './Header';
import { APP_MODE, APP_NAME, APP_TAGLINE } from './config';
import botLogo from './assets/bot ai.svg';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleStart = () => {
    setIsStarted(true);
    setTimeout(() => {
      setMessages([{ text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu?`, sender: 'bot' }]);
    }, 500);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("https://wildanrobians29-chat-backend.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, category: APP_MODE })
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
      <div className="gate-screen">
        <img src={botLogo} alt="Logo" className="gate-logo" />
        <h1 className="gate-title">{APP_NAME}</h1>
        <p className="gate-tagline">{APP_TAGLINE}</p>
        <button className="gate-btn" onClick={handleStart}>Mulai Percakapan</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="layout-root">
        <main className="chat-scroll-layer">
          {messages.map((m, i) => (
            <div key={i} className={`bubble-row ${m.sender} anim-up`}>
              <div className="bubble-text">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="bubble-row bot anim-up">
              <div className="bubble-text typing">Mengetik...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        <footer className="footer-fixed-layer">
          <div className="input-container">
            <input 
              type="text"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="Tulis pesan..." 
            />
            <button 
              className={`send-btn ${input.trim() && !loading ? 'active' : ''}`} 
              onClick={handleSend}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
