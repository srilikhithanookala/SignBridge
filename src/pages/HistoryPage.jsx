import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, Calendar, MessageSquare, Volume2, X } from 'lucide-react';
import { getConversations, getConversationMessages, deleteConversation } from '../services/supabaseClient';
import { speakText } from '../services/speechService';

export default function HistoryPage({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [selectedMsgs, setSelectedMsgs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getConversations();
    setConversations(data || []);
  };

  const handleSelectConv = async (conv) => {
    setSelectedConv(conv);
    const msgs = await getConversationMessages(conv.id);
    setSelectedMsgs(msgs);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 text-slate-900 dark:text-white">
          <History className="w-8 h-8 text-brand-600" />
          Saved Conversation History
        </h1>
      </div>

      {conversations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border p-12 text-center max-w-2xl mx-auto space-y-4">
          <History className="w-12 h-12 mx-auto text-slate-300" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Saved History Yet</h2>
          <p className="text-xs text-slate-500">
            Your saved conversations will appear here automatically when you use the Live Translator or Conversation Mode.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv)}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border cursor-pointer hover:border-brand-300"
              >
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{conv.title}</h4>
                <span className="text-xs text-slate-400">{new Date(conv.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
