import React, { useState } from 'react';
import { X, Send, Bot, AlertTriangle, ShieldCheck, Camera, HelpCircle } from 'lucide-react';
import { useInspections } from '../../context/InspectionContext';

export const SafetyAssistantDrawer = () => {
  const { isAssistantOpen, setIsAssistantOpen, askSafetyAssistant } = useInspections();
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      text: 'Hello. I am the VisionGuard Safety Assistant. Ask me anything about current site hazards, active CCTV cameras, or open incident statuses.',
    },
  ]);

  if (!isAssistantOpen) return null;

  const handleSend = (textToSend) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMessage = { sender: 'user', text: q };
    const response = askSafetyAssistant(q);
    const botMessage = { sender: 'assistant', text: response.answer };

    setChatHistory((prev) => [...prev, userMessage, botMessage]);
    setQuery('');
  };

  const quickPrompts = [
    "What are today's critical risks?",
    "Show unresolved incidents",
    "Which camera has the most alerts?",
    "What are the most common hazards this week?",
    "Summarize today's safety status",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">AI Safety Assistant</h3>
              <p className="text-[11px] text-slate-500">Connected to active site telemetry</p>
            </div>
          </div>
          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Quick Inquiries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] px-2 py-1 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 rounded transition text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 px-1">
                {msg.sender === 'user' ? 'You' : 'VisionGuard Engine'}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about risks, cameras, compliance..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="vg-btn-primary disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
