import { useState } from 'react';

export const useChat = (mode) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { text: text.trim(), sender: 'user' }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pesan: text, tipe_bisnis: mode })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply || "Mesin sedang optimasi.", sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Gagal terhubung ke backend.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};
