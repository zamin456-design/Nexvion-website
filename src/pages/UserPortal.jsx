import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { X, Plus, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { servicesCatalog } from '../lib/servicesData';
import {
  getBookingStatusLabel,
  getBookingStatusStep,
  getBookingStatusValue,
} from '../lib/bookingStatus';
import { 
  fetchUserBookings, 
  createServiceBooking, 
  fetchBookingMessages, 
  sendBookingMessage 
} from '../lib/supabase';
import confetti from 'canvas-confetti';

const MILESTONES = ['New', 'In discussion', 'In progress', 'Testing', 'Completed'];

export default function UserPortal() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(0);

  // New Booking Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(servicesCatalog[3].id); // AI Chatbot default
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const activeBooking = bookings[selectedBookingIndex] || null;
  const chosenService = servicesCatalog.find((s) => s.id === selectedServiceId) || servicesCatalog[0];

  useEffect(() => {
    const requestedService = servicesCatalog.find(
      (service) => service.id === location.state?.serviceId
    );
    if (requestedService) {
      setSelectedServiceId(requestedService.id);
      setIsModalOpen(true);
    }
  }, [location.key, location.state]);

  const loadBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchUserBookings(user.id);
      setBookings(data || []);
    } catch (err) {
      console.warn('Error loading client bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  // Load chat messages for the active booking
  useEffect(() => {
    if (!activeBooking) return;
    let timer;

    const loadChat = async () => {
      try {
        const msgs = await fetchBookingMessages(activeBooking.id);
        setMessages(msgs || []);
      } catch (e) {
        console.warn('Error loading chat:', e);
      }
    };

    loadChat();
    timer = setInterval(loadChat, 3000);
    return () => clearInterval(timer);
  }, [activeBooking?.id]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    setSubmitting(true);
    try {
      const discountSaved = chosenService.marketPrice - chosenService.discountPrice;
      const res = await createServiceBooking({
        user_id: user.id,
        user_name: user.full_name || user.email.split('@')[0],
        user_email: user.email,
        user_company: user.company || '',
        service_id: chosenService.id,
        service_name: chosenService.name,
        package_tier: 'Production Tier',
        price: chosenService.discountPrice,
        discount_saved: discountSaved,
        project_title: projectTitle,
        project_details: projectDetails || chosenService.description,
        deadline: chosenService.turnaround,
      });

      if (res.success) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fde047', '#06b6d4', '#ec4899'],
        });
        setIsModalOpen(false);
        setProjectTitle('');
        setProjectDetails('');
        await loadBookings();
        setSelectedBookingIndex(0);
      }
    } catch (err) {
      alert(err.message || 'Error booking service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeBooking) return;

    setSendingMsg(true);
    try {
      await sendBookingMessage({
        bookingId: activeBooking.id,
        senderId: user.id,
        senderName: user.full_name || 'Client',
        senderRole: 'client',
        message: newMessage.trim(),
      });
      setNewMessage('');
      const msgs = await fetchBookingMessages(activeBooking.id);
      setMessages(msgs || []);
    } catch (err) {
      console.warn('Error sending message:', err);
    } finally {
      setSendingMsg(false);
    }
  };

  const getStatusBadge = (status) => {
    const value = getBookingStatusValue(status);
    if (value === 'reviewing') {
      return 'bg-[#4f46e5]/20 text-[#a5b4fc] border border-[#4f46e5]/30';
    }
    if (value === 'pending') {
      return 'bg-[#b45309]/20 text-[#fde047] border border-[#b45309]/30';
    }
    if (value === 'in_development' || value === 'testing') {
      return 'bg-[#0e7490]/20 text-[#67e8f9] border border-[#0e7490]/30';
    }
    if (value === 'completed') {
      return 'bg-[#065f46]/20 text-[#6ee7b7] border border-[#065f46]/30';
    }
    return 'bg-white/10 text-white/90 border border-white/10';
  };

  const getStatusLabel = getBookingStatusLabel;

  const currentMilestoneIdx = activeBooking ? getBookingStatusStep(activeBooking.status) : -1;

  return (
    <>
      <Helmet>
        <title>My Bookings — NexVion Client Portal</title>
        <meta 
          name="description" 
          content="Track every service you booked and message our team in one place." 
        />
      </Helmet>

      <div className="pt-32 pb-24 max-w-content mx-auto px-6 md:px-12 text-left">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            My bookings
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            Track every service you booked and message our team in one place.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-muted">
            Loading your commissioned services...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0b0f1d] border border-white/5 text-center space-y-4 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-white">No active bookings yet</h3>
            <p className="text-xs text-muted">
              Choose from our 10 services and commission your custom AI or full-stack software.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-[#fde047]"
            >
              Book your first service
            </button>
          </div>
        ) : (
          /* Main 2-Column Portal Interface (Page 10) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Bookings Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              {bookings.map((b, idx) => {
                const isSelected = selectedBookingIndex === idx;

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBookingIndex(idx)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#12162a] border-[#fde047]/40 shadow-lg'
                        : 'bg-[#0b0f1d] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white">{b.service_name}</h4>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${getStatusBadge(b.status)}`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </div>

                    <p className="text-xs text-muted">
                      ${Number(b.price).toFixed(2)} starting quote
                    </p>
                  </button>
                );
              })}

              {/* Book Another Service Button (Page 10) */}
              <div className="pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md shadow-yellow-950/20"
                >
                  Book another service
                </button>
              </div>
            </div>

            {/* Right Column: Active Booking Details, Progress Stepper & Chat (Page 10) */}
            {activeBooking && (
              <div className="lg:col-span-8 rounded-3xl bg-[#0b0f1d] border border-white/5 p-6 md:p-8 shadow-xl flex flex-col justify-between min-h-[580px]">
                <div>
                  {/* Top Header: Service Title & Price */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/5">
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {activeBooking.service_name}
                      </h3>
                      <p className="text-xs text-muted mt-1 max-w-md">
                        {activeBooking.project_details || activeBooking.project_title}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-3xl font-extrabold text-white font-sans">
                        ${Number(activeBooking.price).toFixed(2)}
                      </div>
                      <p className="text-[11px] text-[#fde047] mt-0.5">
                        Starting quote, 15% off, locked at booking
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Milestone Stepper (Page 10) */}
                  <div className="py-6 border-b border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-muted mb-2 px-1">
                      {MILESTONES.map((m, idx) => {
                        const isReached = currentMilestoneIdx >= idx;
                        const isCurrent = currentMilestoneIdx === idx;

                        return (
                          <div
                            key={m}
                            className={`flex flex-col items-center gap-1.5 ${
                              isCurrent ? 'text-white font-bold' : isReached ? 'text-white/80' : 'text-muted-dark'
                            }`}
                          >
                            <span className="truncate max-w-[80px] sm:max-w-none text-center">
                              {m}
                            </span>
                            <span
                              className={`w-2.5 h-2.5 rounded-full transition-all ${
                                isCurrent
                                  ? 'bg-[#f43f5e] shadow-md shadow-rose-500/80 scale-125'
                                  : isReached
                                  ? 'bg-white/80'
                                  : 'bg-white/10'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chat Message Thread (Page 10) */}
                  <div className="py-6 space-y-4 max-h-[280px] overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-xs text-muted">
                        No messages yet. Send a note to the lead architect below.
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isClient = msg.sender_role === 'client';

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                                isClient
                                  ? 'bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] text-[#08060d] font-medium rounded-tr-none'
                                  : 'bg-[#181c30] text-white/90 border border-white/5 rounded-tl-none'
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Chat Input Bar (Page 10) */}
                <form onSubmit={handleSendMessage} className="pt-4 border-t border-white/5 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !newMessage.trim()}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 disabled:opacity-40 transition-all shrink-0"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

        {/* Modal: Book Another Service */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl rounded-3xl bg-[#0b0f1d] border border-white/15 p-6 md:p-8 shadow-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-white tracking-tight">Book a Service</h2>
              <p className="text-xs text-muted mt-1">
                Select your service. Locked at discounted starting quote.
              </p>

              <form onSubmit={handleCreateBooking} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white mb-1">Select Service</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080a14] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {servicesCatalog.map((s) => (
                      <option key={s.id} value={s.id} className="bg-bg text-white">
                        {s.name} — ${s.discountPrice} ({s.pricingUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-muted">Starting Quote (Discounted):</span>
                  <span className="text-sm font-bold text-[#fde047]">
                    ${chosenService.discountPrice} ({chosenService.discountPercent}% Off)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Chatbot for a cafe: answer menu questions on website"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1">Notes / Channels / Details</label>
                  <textarea
                    rows={3}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="Specify any channels (WhatsApp, website), links, or preferred features..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-muted-dark text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full text-xs font-bold text-[#08060d] bg-gradient-to-r from-[#fef08a] via-[#fde047] to-[#facc15] hover:opacity-95 transition-all shadow-md"
                >
                  {submitting ? 'Confirming...' : 'Confirm and Book'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
