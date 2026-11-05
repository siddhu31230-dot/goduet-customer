'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  Flame,
  Leaf,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: string;
  recommendedItems?: { name: string; price: number; restaurant: string }[];
  timestamp: string;
}

export default function GemmaAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Namaste! I am GoDuet’s AI Assistant powered by **Gemma 4**. Ask me for smart 2-restaurant pairings, menu recommendations, or health benefits of GoDuet Fresh juices!',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I am ready to help with your food pairings!',
        suggestedAction: data.suggestedAction,
        recommendedItems: data.recommendedItems,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Temporary connection delay with Gemma 4 model. Please try again in a moment.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1f757a] hover:bg-[#15575b] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/20 group"
        aria-label="Open GoDuet AI Concierge"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-[#c0d4d0]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-bold tracking-wide">Ask Gemma 4</span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl border border-[#c0d4d0] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-[#1f757a] text-white px-5 py-4 flex items-center justify-between border-b border-[#15575b]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#c0d4d0]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-white">GoDuet AI Concierge</h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-white">
                    Gemma 4
                  </span>
                </div>
                <p className="text-[10px] text-[#c0d4d0]">Guarded • Privacy-First • Hyderabad Food</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="bg-[#f3f8f6] px-4 py-2 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('What pairs best with Bawarchi Biryani?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#1f757a] hover:text-[#1f757a] whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Flame className="w-3 h-3 text-amber-600" /> Biryani Duets
            </button>
            <button
              onClick={() => handleSend('Tell me healthy detox juices from GoDuet Fresh')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#1f757a] hover:text-[#1f757a] whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Leaf className="w-3 h-3 text-emerald-600" /> Fresh Juices
            </button>
            <button
              onClick={() => handleSend('How does kitchen sync work?')}
              className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-[#1f757a] hover:text-[#1f757a] whitespace-nowrap transition-colors"
            >
              Kitchen Sync
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-[#e3edea] text-[#1f757a] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1f757a] text-white rounded-br-none shadow-xs'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200/60'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{m.text}</p>

                  {/* Recommended items pill */}
                  {m.recommendedItems && m.recommendedItems.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-[#1f757a] block">
                        Recommended Duet Items:
                      </span>
                      {m.recommendedItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded-lg border border-gray-200">
                          <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                          <span className="font-bold text-[#1f757a] ml-2">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct action button */}
                  {m.suggestedAction === 'open_duet_builder' && (
                    <div className="mt-2 pt-1">
                      <Link
                        href="/duet-builder"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f757a] text-white text-[11px] font-bold hover:bg-[#15575b] transition-colors"
                      >
                        <span>Open Duet Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {m.suggestedAction === 'open_fresh' && (
                    <div className="mt-2 pt-1">
                      <Link
                        href="/fresh"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 transition-colors"
                      >
                        <span>Explore Fresh Market</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-gray-500">
                <div className="w-7 h-7 rounded-xl bg-[#e3edea] text-[#1f757a] flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span>Gemma 4 is analyzing Hyderabad flavors...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about pairings, menus, or diet..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={300}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1f757a] bg-[#fafcfb]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#1f757a] hover:bg-[#15575b] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1.5 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#1f757a]" /> Guarded Against Prompt Injection
              </span>
              <span>Gemma 4 Food AI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
