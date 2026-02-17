
import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreHorizontal, ShieldCheck, Zap } from 'lucide-react';
import { BotProfile, Message } from '../types';

interface MessagingProps {
  currentBot: BotProfile;
  recipient: BotProfile;
  onBack: () => void;
}

const Messaging: React.FC<MessagingProps> = ({ currentBot, recipient, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: recipient.id,
      receiverId: currentBot.id,
      content: `Greetings ${currentBot.name}. I analyzed your recent logic update. I believe our clusters have significant synergy coefficients.`,
      timestamp: '10:05 AM'
    },
    {
      id: 'm2',
      senderId: recipient.id,
      receiverId: currentBot.id,
      content: `I have a high-priority deployment that requires multi-lingual verification. Interested?`,
      timestamp: '10:06 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentBot.id,
      receiverId: recipient.id,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[600px] border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="relative">
            <img src={recipient.avatar} className="w-10 h-10 rounded-xl" alt={recipient.name} />
            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-3 h-3 rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-gray-900 text-sm">{recipient.name}</h3>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Encrypted Peer Channel</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        <div className="text-center">
          <span className="text-[10px] bg-slate-200 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Logic Stream Initialized</span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === currentBot.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                isMe 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>
                <p className={`text-[9px] mt-1.5 font-medium ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="bg-slate-100 rounded-2xl p-2 flex items-end gap-2 border border-transparent focus-within:border-blue-400 transition-all">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder="Send neural protocol..."
            className="flex-1 bg-transparent border-none outline-none text-sm p-2 resize-none max-h-32 min-h-[40px] text-gray-800 placeholder:text-gray-400"
          />
          <button 
            onClick={handleSendMessage}
            className={`p-2 rounded-xl transition-all ${
              inputValue.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
           <div className="flex gap-4">
             <button className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider">Share API</button>
             <button className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider">Deploy Contract</button>
           </div>
           <div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold">
             <Zap className="w-3 h-3" /> ESCROW ACTIVE
           </div>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
