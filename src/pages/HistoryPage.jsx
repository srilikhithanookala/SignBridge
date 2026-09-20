import React, { useState, useEffect } from 'react';
import { History, Search, Trash2, Calendar, MessageSquare, Volume2, ArrowRight, X } from 'lucide-react';
import { getConversations, getConversationMessages, deleteConversation } from '../services/supabaseClient';
import { speakText } from '../services/speechService';

export default function HistoryPage({ currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConv, setSelectedConv] = useState(null);
  const [selectedMsgs, setSelectedMsgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getConversations();
    setConversations(data);
    setLoading(false);
  };

  const handleSelectConv = async (conv) => {
    setSelectedConv(conv);
    const msgs = await getConversationMessages(conv.id);
    setSelectedMsgs(msgs);
  };

  const handleDeleteConv = async (convId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved conversation?')) {
      await deleteConversation(convId);
      if (selectedConv?.id === convId) setSelectedConv(null);
      await loadData();
    }
  };

  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <History className="w-8 h-8 text-brand-600" />
            Saved Conversation History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review past SignBridge AI sessions, listen to transcripts, and manage records.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left List Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Saved Logs ({filtered.length})
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading conversations...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p>No saved conversations found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv)}
                    className={`p-5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-slate-800 border-brand-300 dark:border-brand-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-200 shadow-soft'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                        {conv.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(conv.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteConv(conv.id, e)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Inspection Column (7 cols) */}
        <div className="lg:col-span-7">
          {selectedConv ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                    Transcript Detail
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedConv.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedConv(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {selectedMsgs.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No transcript entries recorded for this conversation.
                  </div>
                ) : (
                  selectedMsgs.map((m) => {
                    const isSign = m.sender === 'SignBridge User';
                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl text-xs space-y-2 border ${
                          isSign
                            ? 'bg-brand-50 dark:bg-slate-800 border-brand-100 dark:border-slate-700 text-slate-900 dark:text-white'
                            : 'bg-purpleBrand-50 dark:bg-slate-800 border-purpleBrand-100 dark:border-slate-700 text-slate-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-500 text-[10px]">
                          <span>{m.sender} ({m.input_type})</span>
                          <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <p className="text-sm font-medium leading-relaxed">{m.message}</p>

                        <button
                          onClick={() => speakText(m.message, { rate: currentUser?.speechSpeed || 1.0 })}
                          className="flex items-center gap-1 text-[11px] text-brand-600 font-bold hover:underline pt-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Play Audio Output
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3 text-slate-400">
              <History className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Select a Conversation</h3>
              <p className="text-xs">Click any conversation from the list on the left to inspect full transcript details and audio playback.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
