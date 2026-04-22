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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [messages, loading]);

  const startApp = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setIsStarted(true);
      setIsTransitioning(false);

      setTimeout(() => {
        setMessages([{ 
          text: `Halo Wildan, ada yang bisa ${APP_NAME} bantu hari ini?`, 
          sender: 'bot' 
        }]);
      }, 400);

    }, 500);
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

    } catch {
      setMessages(prev => [...prev, { text: "Maaf, koneksi terputus.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">

      {!isStarted && (
        <div className={`welcome-page ${isTransitioning ? 'exit' : 'enter'}`}>
          <div className="welcome-content">
            <img src={botLogo} alt="Logo" className="bot-welcome-img" />
            <h1>{APP_NAME}</h1>
            <p>{APP_TAGLINE}</p>
            <button className="start-btn" onClick={startApp}>
              Mulai Percakapan
            </button>
          </div>
        </div>
      )}

      {isStarted && (
        <div className="main-chat-layout enter">

          <header className="chat-header">
            <img src={botLogo} alt="Icon" className="bot-header-img" />
            <div>
              <h2>{APP_NAME}</h2>
              <div className="status">
                <span className="dot"></span> Online
              </div>
            </div>
          </header>

          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender}`}>
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

          <footer className="footer">
            <div className="input-box">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Tanya sesuatu..."
              />
              <button
                className={`send-btn ${input.trim() ? 'active' : ''}`}
                onClick={handleSend}
              >
                ➤
              </button>
            </div>
          </footer>

        </div>
      )}

    </div>
  );
}

export default App;
