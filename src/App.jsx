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
      setMessages(prev => [...prev, { text: "Error: Gagal koneksi.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="gate-screen">
        <img src={botLogo} alt="Logo" />
        <h1>{APP_NAME}</h1>
        <p>{APP_TAGLINE}</p>
        <button onClick={handleStart}>Mulai</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      <div className="layout-wrapper">
        <main className="chat-area">
          {messages.map((m, i) => (
            <div key={i} className={`msg-row ${m.sender}`}>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="msg-row bot">
              <div className="msg-bubble">Mengetik...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        <footer className="footer-area">
          <div className="input-pill">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
              placeholder="Tulis pesan..." 
            />
            <button 
              className={input.trim() ? 'send-btn active' : 'send-btn'} 
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
