import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, RefreshCw } from 'lucide-react';
import axios from 'axios';

const HEALTH_FAQS = [
  {
    keywords: ['fever', 'paracetamol', 'temperature', 'flu'],
    response: "For mild fever (under 101°F/38.3°C), stay hydrated and take paracetamol (650mg) every 6 hours if needed. Avoid heavy blankets. If the fever exceeds 102°F or persists past 3 days, consult a clinic immediately to check for malaria, dengue, or infection."
  },
  {
    keywords: ['dengue', 'mosquito', 'malaria'],
    response: "Dengue and Malaria are mosquito-borne. Symptoms include high fever, joint pain, and rashes. Prevent stagnant water in coolers/pots. If you have fever with extreme joint pain, get a blood test at our Apex Community Health Centre immediately."
  },
  {
    keywords: ['vaccine', 'polio', 'bcg', 'dose', 'immunization'],
    response: "Vaccinations are scheduled every Monday at all primary government health centres. Check your 'Health Profile' tab for upcoming vaccination dates. Keep your vaccine card handy."
  },
  {
    keywords: ['emergency', 'sos', 'ambulance', 'pain'],
    response: "If this is a severe medical emergency (chest pain, breathing issues, heavy bleeding), immediately click the red floating 🔴 SOS button in the bottom right corner of this screen. It will dispatch your exact coordinates to responders."
  },
  {
    keywords: ['water', 'diarrhea', 'stomach', 'ors'],
    response: "Stomach pain and watery stools can indicate contaminated water. Drink boiled water or prepare an Oral Rehydration Salt (ORS) solution: mix 6 teaspoons of sugar and 1/2 teaspoon of salt in 1 litre of clean water. Drink slowly."
  }
];

export default function AIHealthAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am your AI Health Assistant. Ask me about first aid, vaccination drives, water sanitation tips, or nearby hospitals."
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const triggerFallback = (userMsg) => {
    let matchedResponse = "I'm sorry, I couldn't understand that query. For general consultation, please book a routine slot at the Apex Community Health Centre, or describe symptoms like fever, dengue, vaccine schedules, or water contamination.";
    
    const lowercaseInput = userMsg.text.toLowerCase();
    for (const faq of HEALTH_FAQS) {
      if (faq.keywords.some(kw => lowercaseInput.includes(kw))) {
        matchedResponse = faq.response;
        break;
      }
    }
    setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: matchedResponse }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const apiKey = import.meta.env.VITE_GROK_API_KEY;

    if (apiKey && apiKey !== 'your_grok_api_key_here' && apiKey.trim() !== '') {
      try {
        // Detect if key is a Groq Cloud key starting with gsk_
        const isGroq = apiKey.trim().startsWith('gsk_');
        const apiUrl = isGroq 
          ? 'https://api.groq.com/openai/v1/chat/completions' 
          : 'https://api.x.ai/v1/chat/completions';
        const apiModel = isGroq 
          ? 'llama3-8b-8192' 
          : 'grok-2';

        const response = await axios.post(
          apiUrl,
          {
            model: apiModel,
            messages: [
              {
                role: 'system',
                content: 'You are the AI Health Assistant for the HealthConnect Community System. Provide helpful medical, first-aid, immunization, and water sanitation guidance for local and rural citizens. Keep answers highly concise, clear, and easy to read. Always include a disclaimer stating that the user should consult with sister Sunita Sharma (ANM) or Dr. Ramesh Kumar at our community health center for severe issues.'
              },
              ...messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
              })),
              {
                role: 'user',
                content: userMsg.text
              }
            ],
            temperature: 0.2
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );

        const botReply = response.data?.choices?.[0]?.message?.content || "No reply received from assistant.";
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
      } catch (err) {
        console.error('API error, falling back to local FAQs:', err);
        triggerFallback(userMsg);
      } finally {
        setTyping(false);
      }
    } else {
      // Local fallback
      setTimeout(() => {
        triggerFallback(userMsg);
        setTyping(false);
      }, 600);
    }
  };

  return (
    <div className="flex flex-col h-[400px] rounded-2xl border border-slate-200 bg-white shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
      {/* Bot Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-health-600 to-cyan-500 p-4 rounded-t-2xl text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold flex items-center gap-1">
              AI Health Assistant
              <Sparkles className="h-3 w-3 text-amber-300 fill-amber-300" />
            </h3>
            <span className="text-[9px] text-cyan-100">Futuristic Health Guidance</span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                msg.sender === 'user' 
                  ? 'bg-health-500 text-white' 
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-health-500 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-xs">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/60 rounded-tl-none flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
                <span className="text-slate-400">Typing advice...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask e.g. What to do in fever?"
          className="flex-1 rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
        />
        <button
          type="submit"
          className="rounded-xl bg-health-600 px-3 py-2 text-white hover:bg-health-500 transition-colors shadow-glow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
