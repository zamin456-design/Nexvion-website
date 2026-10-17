import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchAllBookings, 
  updateBookingStatus, 
  fetchBookingMessages, 
  sendBookingMessage 
} from '../lib/supabase';

const STATUSES = ['All statuses', 'New', 'In discussion', 'Accepted', 'In progress', 'Completed'];

export default function AdminPortal() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All statuses');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchAllBookings();
      setBookings(data);
      setSelectedBookingId((currentId) =>
        data.some((booking) => booking.id === currentId) ? currentId : data[0]?.id ?? null
      );
    } catch (err) {
      console.error('Error loading bookings:', err);
      setBookings([]);
      setSelectedBookingId(null);
      setLoadError(`Could not load live bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0] || null;

  // Sync messages
  useEffect(() => {
    if (!activeBooking) return;
    let timer;

    const loadChat = async () => {
      try {
        const msgs = await fetchBookingMessages(activeBooking.id);
        setMessages(msgs || []);
      } catch (e) {
        console.warn('Error loading messages:', e);
      }
    };

    loadChat();
    timer = setInterval(loadChat, 3000);
    return () => clearInterval(timer);
  }, [activeBooking?.id]);

  const handleStatusChange = async (newStatus) => {
    if (!activeBooking) return;
    const formatted = newStatus.toLowerCase().replace(/\s+/g, '_');
    try {
      await updateBookingStatus(activeBooking.id, formatted);
      setBookings((prev) =>
        prev.map((b) => (b.id === activeBooking.id ? { ...b, status: formatted } : b))
      );
    } catch (e) {
      console.warn('Error updating status:', e);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeBooking) return;

    setSendingReply(true);
    try {
      await sendBookingMessage({
        bookingId: activeBooking.id,
        senderId: user?.id || 'admin',
        senderName: 'NexVion Lead Architect',
        senderRole: 'admin',
        message: replyText.trim(),
      });
      setReplyText('');
      const msgs = await fetchBookingMessages(activeBooking.id);
      setMessages(msgs || []);
    } catch (e) {
      console.warn('Error sending reply:', e);
    } finally {
      setSendingReply(false);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service_name?.toLowerCase().includes(search.toLowerCase());

    const formattedFilter = filterStatus.toLowerCase().replace(/\s+/g, '_');
    const matchesStatus =
      filterStatus === 'All statuses' ||
      b.status?.toLowerCase().replace(/\s+/g, '_') === formattedFilter;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = (statuses) =>
    bookings.filter((booking) =>
      statuses.includes(booking.status?.toLowerCase().replace(/\s+/g, '_'))
    ).length;

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase().replace(/\s+/g, '_');
    if (s === 'in_discussion') return 'bg-[#4f46e5]/20 text-[#a5b4fc] border border-[#4f46e5]/30';
    if (s === 'new' || s === 'pending') return 'bg-[#b45309]/20 text-[#fde047] border border-[#b45309]/30';
    if (s === 'in_progress') return 'bg-[#0e7490]/20 text-[#67e8f9] border border-[#0e7490]/30';
    if (s === 'accepted' || s === 'completed') return 'bg-[#065f46]/20 text-[#6ee7b7] border border-[#065f46]/30';
    return 'bg-white/10 text-white/90 border border-white/10';
  };

  const getStatusLabel = (status) => {
    const s = status?.toLowerCase().replace(/\s+/g, '_');
    if (s === 'in_discussion') return 'In discussion';
    if (s === 'in_progress') return 'In progress';
    if (s === 'new' || s === 'pending') return 'New';
    if (s === 'accepted') return 'Accepted';
    if (s === 'completed') return 'Completed';
    return status;
  };

  return (
    <>
      <Helmet>
        <title>Client Bookings — NexVion Admin Portal</title>
        <meta 
          name="description" 
          content="New bookings appear here the moment a client confirms." 
        />
      </Helmet>

      <div className="pt-32 pb-24 max-w-content mx-auto px-6 md:px-12 text-left">
        {/* Header (Page 11) */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Client bookings
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            New bookings appear here the moment a client confirms.
          </p>
        </div>

        {/* Main 3-Column Layout (Page 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sub-Nav Sidebar (Page 11) */}
          <div className="lg:col-span-2 space-y-1 text-xs font-medium">
            {['Bookings', 'Services & prices', 'Projects', 'Clients'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full py-2.5 px-4 rounded-xl text-left transition-colors ${
                  activeTab === tab
                    ? 'bg-[#181c30] text-[#fde047] font-semibold border border-[#fde047]/30'
                    : 'text-muted hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Center Column: Stat Counters, Filter & Bookings Table (Page 11) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Live booking counts */}
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-2xl bg-[#0b0f1d] border border-white/5 p-4 text-left">
                <div className="text-2xl font-bold text-white font-sans">{countByStatus(['new', 'pending'])}</div>
                <div className="text-[11px] text-muted mt-0.5">New</div>
              </div>

              <div className="rounded-2xl bg-[#0b0f1d] border border-white/5 p-4 text-left">
                <div className="text-2xl font-bold text-white font-sans">{countByStatus(['in_discussion', 'reviewing'])}</div>
                <div className="text-[11px] text-muted mt-0.5 leading-snug">In discussion</div>
              </div>

              <div className="rounded-2xl bg-[#0b0f1d] border border-white/5 p-4 text-left">
                <div className="text-2xl font-bold text-white font-sans">{countByStatus(['in_progress', 'in_development', 'testing'])}</div>
                <div className="text-[11px] text-muted mt-0.5 leading-snug">In progress</div>
              </div>

              <div className="rounded-2xl bg-[#0b0f1d] border border-white/5 p-4 text-left">
                <div className="text-2xl font-bold text-white font-sans">{countByStatus(['completed'])}</div>
                <div className="text-[11px] text-muted mt-0.5">Completed</div>
              </div>
            </div>

            {/* Filter and Search Bar (Page 11) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f1d] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-bg text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-8 relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search client or service"
                  className="w-full px-3 py-2 rounded-xl bg-[#0b0f1d] border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Bookings Table / List (Page 11) */}
            <div className="rounded-3xl bg-[#0b0f1d] border border-white/5 overflow-hidden shadow-xl">
              <div className="divide-y divide-white/5">
                {loading && (
                  <p className="p-6 text-sm text-muted">Loading live bookings...</p>
                )}
                {!loading && loadError && (
                  <p role="alert" className="p-6 text-sm text-pink-300">{loadError}</p>
                )}
                {!loading && !loadError && filteredBookings.length === 0 && (
                  <p className="p-6 text-sm text-muted">
                    {bookings.length === 0
                      ? 'No client orders yet. New service bookings will appear here.'
                      : 'No bookings match your current search or status filter.'}
                  </p>
                )}
                {filteredBookings.map((b) => {
                  const isSelected = activeBooking?.id === b.id;

                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBookingId(b.id)}
                      className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                        isSelected ? 'bg-[#181c30]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-white block">
                          {b.user_name}
                        </span>
                        <span className="text-xs text-muted block">
                          {b.service_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-white font-mono">
                          ${Number(b.price).toFixed(2)}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md ${getStatusBadge(b.status)}`}>
                          {getStatusLabel(b.status)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Selected Client Detail & Live Chat Console (Page 11) */}
          {activeBooking && (
            <div className="lg:col-span-4 rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 shadow-xl flex flex-col justify-between min-h-[580px]">
              <div>
                {/* Client Header */}
                <div className="pb-4 border-b border-white/5">
                  <h3 className="text-lg font-bold text-white">
                    {activeBooking.service_name}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {activeBooking.user_name} · {activeBooking.user_email} · {activeBooking.phone || '03XX XXXXXXX'}
                  </p>
                  <p className="text-xs text-white/90 mt-3 leading-relaxed">
                    {activeBooking.project_details}
                  </p>
                </div>

                {/* Status Dropdown (Page 11) */}
                <div className="py-4 border-b border-white/5">
                  <label className="block text-[11px] text-muted mb-1.5 font-medium">Status</label>
                  <select
                    value={getStatusLabel(activeBooking.status)}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080a14] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {STATUSES.filter((s) => s !== 'All statuses').map((s) => (
                      <option key={s} value={s} className="bg-bg text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chat History with Client (Page 11) */}
                <div className="py-4 space-y-3 max-h-[220px] overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted">
                      No communication records yet.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isAdminMsg = m.sender_role === 'admin';

                      return (
                        <div
                          key={m.id}
                          className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                              isAdminMsg
                                ? 'bg-[#181c30] text-white/90 border border-white/5 rounded-tr-none'
                                : 'bg-[#fde047] text-[#08060d] font-medium rounded-tl-none'
                            }`}
                          >
                            {m.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Reply Input (Page 11) */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to client"
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="px-5 py-2 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 disabled:opacity-40 transition-all shrink-0"
                >
                  Send
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
