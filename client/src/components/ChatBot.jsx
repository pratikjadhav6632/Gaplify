import React, { useState, useRef } from 'react';
import { SiChatbot } from "react-icons/si";
const initialMessages = [
  {
    sender: 'bot',
    text: 'Hi! I am your education guide and motivator. Ask me anything about learning, motivation, or advice!'
  }
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Call backend chatbot API
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const botText = data?.text || "Sorry, I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { sender: 'bot', text: botText }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to chat server.' }]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen(true)}
        aria-label="Open chat bot"
      >
      <SiChatbot/>
      </button>

      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          <div className="bg-black bg-opacity-30 absolute inset-0" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm m-6 bg-white rounded-lg shadow-xl flex flex-col h-[70vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-lg text-blue-700">EduBot</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 disabled:opacity-50"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 