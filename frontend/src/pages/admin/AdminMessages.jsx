import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiTrash2, FiRefreshCw, FiInbox, FiCheck, FiUser } from 'react-icons/fi';
import API from '../../utils/api';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All'); // All | Unread | Read

  const loadMessages = () => {
    setLoading(true);
    API.get('/messages')
      .then(r => { setMessages(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadMessages(); }, []);

  const markRead = async (id) => {
    await API.put(`/messages/${id}/read`);
    setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return;
    await API.delete(`/messages/${id}`);
    setMessages(prev => prev.filter(m => m._id !== id));
    toast.success('Message deleted');
  };

  const unreadCount = messages.filter(m => !m.read).length;

  const filtered = filter === 'Unread' ? messages.filter(m => !m.read)
                 : filter === 'Read'   ? messages.filter(m => m.read)
                 : messages;

  return (
    <div className="max-w-3xl w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-dark tracking-tight">Messages</h1>
          <p className="text-muted text-sm mt-1">
            {messages.length} total
            {unreadCount > 0 && <span className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-white bg-brand-500 px-2 py-0.5 rounded-full">{unreadCount} new</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-muted">Live</span>
          <button onClick={loadMessages}
            className="ml-1 p-2 rounded-xl hover:bg-gray-100 text-muted hover:text-dark transition-colors">
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Unread', 'Read'].map(tab => {
          const count = tab === 'All' ? messages.length : tab === 'Unread' ? unreadCount : messages.length - unreadCount;
          return (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                filter === tab
                  ? 'bg-dark text-white border-dark shadow-md'
                  : 'bg-white text-muted border-gray-200 hover:border-gray-300 hover:text-dark'
              }`}>
              {tab}
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                filter === tab ? 'bg-white/20 text-white' : 'bg-gray-100 text-muted'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gray-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded-lg w-32" />
                  <div className="h-3 bg-gray-100 rounded-lg w-48" />
                </div>
              </div>
              <div className="h-14 bg-gray-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
            <FiInbox size={24} className="text-gray-300" />
          </div>
          <p className="font-semibold text-dark mb-1">No messages</p>
          <p className="text-muted text-sm">
            {filter !== 'All' ? `No ${filter.toLowerCase()} messages` : 'Messages from your contact form will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((msg, i) => (
              <motion.div key={msg._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04, duration: 0.28 }}
                className={`relative bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(28,16,8,0.09)] ${
                  msg.read ? 'border-gray-100' : 'border-brand-200 shadow-[0_0_0_3px_rgba(212,130,26,0.08)]'
                }`}
              >
                {/* Unread indicator bar */}
                {!msg.read && <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-brand-400 to-brand-600 rounded-l-2xl" />}

                <div className="p-5 sm:p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 select-none ${
                        msg.read ? 'bg-gray-100 text-gray-500' : 'bg-brand-100 text-brand-700'
                      }`}>
                        {msg.name?.charAt(0).toUpperCase() || <FiUser size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-dark text-[15px] leading-tight truncate">{msg.name}</p>
                          {!msg.read && (
                            <span className="flex-shrink-0 text-[10px] font-bold text-white bg-brand-500 px-1.5 py-0.5 rounded-full">NEW</span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted font-mono mt-0.5">{timeAgo(msg.createdAt)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!msg.read && (
                        <motion.button whileTap={{ scale: 0.93 }} onClick={() => markRead(msg._id)}
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition-all">
                          <FiCheck size={11} /> Mark Read
                        </motion.button>
                      )}
                      <motion.button whileTap={{ scale: 0.93 }} onClick={() => deleteMsg(msg._id)}
                        className="p-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all">
                        <FiTrash2 size={13} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Contact chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {msg.email && (
                      <a href={`mailto:${msg.email}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg hover:border-brand-200 hover:text-brand-600 transition-colors">
                        <FiMail size={10} className="text-brand-400" /> {msg.email}
                      </a>
                    )}
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg hover:border-brand-200 hover:text-brand-600 transition-colors">
                        <FiPhone size={10} className="text-brand-400" /> {msg.phone}
                      </a>
                    )}
                  </div>

                  {/* Message body */}
                  <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed text-dark/80 border ${
                    msg.read ? 'bg-gray-50/60 border-gray-100' : 'bg-brand-50/50 border-brand-100'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
