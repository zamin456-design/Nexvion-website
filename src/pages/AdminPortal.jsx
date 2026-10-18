import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { servicesCatalog } from '../lib/servicesData';
import {
  BOOKING_STATUSES,
  getBookingStatusLabel,
  getBookingStatusValue,
} from '../lib/bookingStatus';
import { 
  fetchAllBookings, 
  updateBookingStatus, 
  fetchBookingMessages, 
  sendBookingMessage 
} from '../lib/supabase';

const TABS = ['Bookings', 'Services & prices', 'Projects', 'Clients'];

export default function AdminPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All statuses');

  // Chat State
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [messageError, setMessageError] = useState('');

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
    setMessages([]);
    setMessageError('');

    const loadChat = async () => {
      try {
        const msgs = await fetchBookingMessages(activeBooking.id);
        setMessages(msgs || []);
      } catch (e) {
        setMessageError(`Could not load messages: ${e.message}`);
      }
    };

    loadChat();
    timer = setInterval(loadChat, 3000);
    return () => clearInterval(timer);
  }, [activeBooking?.id]);

  const handleStatusChange = async (newStatus) => {
    if (!activeBooking || statusUpdating) return;
    setStatusUpdating(true);
    setStatusError('');
    try {
      const { booking } = await updateBookingStatus(activeBooking.id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? booking : b))
      );
    } catch (e) {
      setStatusError(`Could not update project status: ${e.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeBooking) return;

    setReplyError('');
    setSendingReply(true);
    try {
      if (!user?.id) throw new Error('Your admin session is missing. Please sign in again.');
      await sendBookingMessage({
        bookingId: activeBooking.id,
        senderId: user.id,
        senderName: user.full_name || 'NexVion Admin',
        senderRole: 'admin',
        message: replyText.trim(),
      });
      setReplyText('');
      const msgs = await fetchBookingMessages(activeBooking.id);
      setMessages(msgs || []);
    } catch (e) {
      setReplyError(`Could not send reply: ${e.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.project_title?.toLowerCase().includes(search.toLowerCase()) ||
      b.user_email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === 'All statuses' ||
      getBookingStatusValue(b.status) === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = (statuses) =>
    bookings.filter((booking) =>
      statuses.includes(getBookingStatusValue(booking.status))
    ).length;

  const getStatusBadge = (status) => {
    const value = getBookingStatusValue(status);
    if (value === 'reviewing') return 'bg-[#4f46e5]/20 text-[#a5b4fc] border border-[#4f46e5]/30';
    if (value === 'pending') return 'bg-[#b45309]/20 text-[#fde047] border border-[#b45309]/30';
    if (value === 'in_development' || value === 'testing') return 'bg-[#0e7490]/20 text-[#67e8f9] border border-[#0e7490]/30';
    if (value === 'completed') return 'bg-[#065f46]/20 text-[#6ee7b7] border border-[#065f46]/30';
    return 'bg-white/10 text-white/90 border border-white/10';
  };

  const clientMap = new Map();
  bookings.forEach((booking) => {
    const key = booking.user_id || booking.user_email;
    const client = clientMap.get(key);
    if (client) {
      client.bookingCount += 1;
      if (booking.created_at > client.lastBookingAt) client.lastBookingAt = booking.created_at;
    } else {
      clientMap.set(key, {
        id: key,
        name: booking.user_name,
        email: booking.user_email,
        company: booking.user_company,
        bookingCount: 1,
        lastBookingAt: booking.created_at,
      });
    }
  });
  const clients = [...clientMap.values()];

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
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              {activeTab}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-muted">
              {activeTab === 'Bookings'
                ? 'Review client bookings, update project status, and reply to clients.'
                : activeTab === 'Services & prices'
                  ? 'Review the service catalog and current pricing.'
                  : activeTab === 'Projects'
                    ? 'Review projects submitted by clients.'
                    : 'Review clients who have submitted a project booking.'}
            </p>
          </div>
          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            className="px-4 py-2 rounded-full border border-white/10 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Refreshing...' : 'Refresh data'}
          </button>
        </div>

        {/* Main 3-Column Layout (Page 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sub-Nav Sidebar (Page 11) */}
          <div className="lg:col-span-2 space-y-1 text-xs font-medium">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
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

          {activeTab === 'Bookings' ? (
          <>
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
                <div className="text-2xl font-bold text-white font-sans">{countByStatus(['in_development', 'testing'])}</div>
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
                  <option value="All statuses" className="bg-bg text-white">All statuses</option>
                  {BOOKING_STATUSES.map(({ value, label }) => (
                    <option key={value} value={value} className="bg-bg text-white">
                      {label}
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
                          {b.project_title || b.user_name}
                        </span>
                        <span className="text-xs text-muted block">
                          {b.user_name} · {b.service_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-white font-mono">
                          ${Number(b.price).toFixed(2)}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md ${getStatusBadge(b.status)}`}>
                          {getBookingStatusLabel(b.status)}
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
                    value={getBookingStatusValue(activeBooking.status)}
                    disabled={statusUpdating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080a14] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {BOOKING_STATUSES.map(({ value, label }) => (
                      <option key={value} value={value} className="bg-bg text-white">
                        {label}
                      </option>
                    ))}
                  </select>
                  {statusError && <p role="alert" className="mt-2 text-xs text-pink-300">{statusError}</p>}
                  {statusUpdating && <p className="mt-2 text-xs text-muted">Saving status...</p>}
                </div>

                {/* Chat History with Client (Page 11) */}
                <div className="py-4 space-y-3 max-h-[220px] overflow-y-auto">
                  {messageError ? (
                    <p role="alert" className="text-xs text-pink-300">{messageError}</p>
                  ) : messages.length === 0 ? (
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
              {replyError && <p role="alert" className="mt-2 text-xs text-pink-300">{replyError}</p>}
            </div>
          )}
          </>
          ) : (
            <section className="lg:col-span-10 space-y-5">
              {loading && <p className="text-sm text-muted">Loading admin data...</p>}
              {!loading && loadError && <p role="alert" className="text-sm text-pink-300">{loadError}</p>}

              {activeTab === 'Services & prices' && !loading && !loadError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesCatalog.map((service) => {
                    const ServiceIcon = service.icon;
                    return (
                      <article key={service.id} className="rounded-2xl bg-[#0b0f1d] border border-white/5 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <ServiceIcon className="w-5 h-5 shrink-0 text-cyan-300" aria-hidden="true" />
                            <div>
                              <h2 className="text-sm font-bold text-white">{service.name}</h2>
                              <p className="mt-1 text-xs text-muted">{service.category} · {service.turnaround}</p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-[#fde047]">
                            ${service.discountPrice.toFixed(2)} {service.pricingUnit}
                          </span>
                        </div>
                        <p className="mt-4 text-xs leading-relaxed text-muted">{service.description}</p>
                      </article>
                    );
                  })}
                </div>
              )}

              {activeTab === 'Projects' && !loading && !loadError && (
                <div className="rounded-3xl bg-[#0b0f1d] border border-white/5 divide-y divide-white/5">
                  {bookings.length === 0 ? (
                    <p className="p-6 text-sm text-muted">No projects have been submitted yet.</p>
                  ) : bookings.map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setActiveTab('Bookings');
                      }}
                      className="w-full p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left hover:bg-white/[0.03] transition-colors"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-white">{booking.project_title || booking.service_name}</span>
                        <span className="block mt-1 text-xs text-muted">{booking.user_name} · {booking.service_name}</span>
                      </span>
                      <span className={`self-start sm:self-auto text-[10px] px-2.5 py-1 rounded-md ${getStatusBadge(booking.status)}`}>
                        {getBookingStatusLabel(booking.status)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'Clients' && !loading && !loadError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.length === 0 ? (
                    <p className="text-sm text-muted">No clients have submitted a project booking yet.</p>
                  ) : clients.map((client) => (
                    <article key={client.id} className="rounded-2xl bg-[#0b0f1d] border border-white/5 p-5">
                      <h2 className="text-sm font-bold text-white">{client.name}</h2>
                      <a href={`mailto:${client.email}`} className="mt-1 block text-xs text-cyan-300 hover:text-white transition-colors">
                        {client.email}
                      </a>
                      {client.company && <p className="mt-1 text-xs text-muted">{client.company}</p>}
                      <p className="mt-4 text-xs text-muted">
                        {client.bookingCount} {client.bookingCount === 1 ? 'project' : 'projects'}
                        {client.lastBookingAt && ` · Latest ${new Date(client.lastBookingAt).toLocaleDateString()}`}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
