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

  // ✅ Auto scroll (dibikin lebih stabil, tanpa smooth biar nggak loncat)
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView();
    }
  }, [messages, loading]);

  const startApp = () => {
    setAppLoading(true);

    setTimeout(() => {
      setAppLoading(false);
      setIsStarted(true);

      setTimeout(() => {
        setMessages([
          {
            text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu hari ini?`,
            sender: 'bot',
          },
        ]);
      }, 600);
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input;

    setMessages(prev => [
      ...prev,
      { text: currentInput, sender: 'user' },
    ]);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch(
        "https://wildanrobians29-chat-backend.hf.space/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: currentInput,
            category: APP_MODE,
          }),
        }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { text: data.reply, sender: 'bot' },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          text: "Maaf Wildan, koneksi saya sedang terputus.",
          sender: 'bot',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING SCREEN =================
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
        // ================= WELCOME =================
        <div className="welcome-page">
          <div className="welcome-content">
            <img src={botLogo} alt="Logo" className="bot-welcome-img" />
            <h1>{APP_NAME}</h1>
            <p>{APP_TAGLINE}</p>
            <button className="start-btn" onClick={startApp}>
              Mulai Percakapan
            </button>
          </div>
        </div>
      ) : (
        // ================= CHAT =================
        <div className="main-chat-layout">
          
          {/* HEADER */}
          <header className="chat-header">
            <img src={botLogo} alt="Icon" className="bot-header-img" />
            <div className="info">
              <h2>
                {APP_NAME}{' '}
                {APP_MODE.charAt(0).toUpperCase() + APP_MODE.slice(1)}
              </h2>
              <div className="status">
                <span className="dot"></span> Online
              </div>
            </div>
          </header>

          {/* CHAT WINDOW */}
          <div className="chat-window">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`msg ${m.sender === 'user' ? 'user' : 'bot'}`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="msg bot">
                <TypingAnimation />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* FOOTER */}
          <footer className="footer">
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
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
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
