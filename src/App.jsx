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

  // ✅ FIX VIEWPORT (Sama seperti kode Anda)
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };
    updateHeight();
    window.visualViewport?.addEventListener('resize', updateHeight);
    return () => window.visualViewport?.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ✅ START APP: Sekarang memicu "start" dari flow.json
  const startApp = () => {
    setAppLoading(true);
    setTimeout(() => {
      setAppLoading(false);
      setIsStarted(true);
      // Panggil fungsi handleSend tapi dengan step_key 'start'
      handleSend(null, 'start');
    }, 1500);
  };

  // ✅ HANDLE SEND: Mendukung pesan teks biasa DAN klik tombol (step_key)
  const handleSend = async (userText = null, stepKey = null) => {
    const messageToSend = userText || input;
    if (!messageToSend.trim() && !stepKey) return;

    if (!stepKey) {
      setMessages(prev => [...prev, { text: messageToSend, sender: 'user' }]);
      setInput('');
    }
    
    setLoading(true);

    try {
      const res = await fetch("https://wildanrobians29-chat-backend.hf.space/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageToSend, 
          category: APP_MODE,
          step_key: stepKey // Kirim step_key jika ada
        })
      });

      const data = await res.json();

      // Tambahkan pesan bot dan simpan options jika ada
      setMessages(prev => [...prev, { 
        text: data.reply, 
        sender: 'bot', 
        options: data.options || [] // Simpan tombol pilihan dari backend
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Koneksi sedang bermasalah.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  // Rendering Helper untuk Bold (Sama seperti kode Anda)
  const renderText = (text) => {
    return (text || "").split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.replace(/\*\*/g, '')}</strong>;
      }
      return part;
    });
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
            <div className="robot-wrapper">
              <img src={botLogo} alt="Logo" className="bot-welcome-img" />
            </div>
            <h1 className="slide-up">{APP_NAME}</h1>
            <p className="slide-up delay-1">{APP_TAGLINE}</p>
            <button className="start-btn slide-up delay-2" onClick={startApp}>
              Mulai Percakapan
            </button>
          </div>
        </div>
      ) : (
        <div className="main-chat-layout fade-in">
          <header className="chat-header">
            <img src={botLogo} alt="Icon" className="bot-header-img" />
            <div className="info">
              <h2 className="slide-right">{APP_NAME}</h2>
              <div className="status slide-right delay-1">
                <span className="dot pulse"></span> Online
              </div>
            </div>
          </header>

          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className="msg-group">
                <div className={`msg ${m.sender === 'user' ? 'user' : 'bot'} slide-up`}>
                  {renderText(m.text)}
                </div>
                
                {/* ✅ RENDER TOMBOL PILIHAN JIKA ADA */}
                {m.sender === 'bot' && m.options && m.options.length > 0 && (
                  <div className="options-wrapper slide-up">
                    {m.options.map((opt, idx) => (
                      <button 
                        key={idx} 
                        className="option-btn" 
                        onClick={() => handleSend(opt.label, opt.next)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="msg bot slide-up">
                <TypingAnimation />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <footer className="footer slide-up">
            <div className="input-box">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ketik pesan..."
              />
              <button 
                className={`send-btn ${input.trim() ? 'active' : ''}`} 
                onClick={() => handleSend()}
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
