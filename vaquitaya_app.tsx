import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Smartphone, 
  Upload, 
  Users, 
  Ticket, 
  TrendingUp, 
  X, 
  Check, 
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

// Sample initial mock data for VaquitaYa
const initialEvents = [
  {
    id: 'evt-1',
    type: 'vaquita', // 'vaquita' or 'rifa'
    title: 'Cumpleaños de Carlos 🍻',
    organizer: 'Juan Pérez',
    phone: '987654321',
    goal: 300,
    ticketPrice: 0,
    totalTickets: 0,
    description: 'Juntemos para la torta, la carne y las chelas del sábado!',
    createdAt: '2026-10-20',
    participants: [
      { id: 'p-1', name: 'María López', amount: 50, ticketNum: null, status: 'validado', timestamp: '10:30 AM', voucher: 'voucher_sample_1.jpg' },
      { id: 'p-2', name: 'Renzo Díaz', amount: 30, ticketNum: null, status: 'validado', timestamp: '11:15 AM', voucher: 'voucher_sample_2.jpg' },
      { id: 'p-3', name: 'Andrea Quispe', amount: 50, ticketNum: null, status: 'pendiente', timestamp: '01:45 PM', voucher: 'voucher_sample_3.jpg' }
    ]
  },
  {
    id: 'evt-2',
    type: 'rifa',
    title: 'Rifa Pro-Fondos Viaje de Promo 🎟️',
    organizer: 'Lucía Torres',
    phone: '912345678',
    goal: 500,
    ticketPrice: 10,
    totalTickets: 50,
    description: 'Premio: Parrilla Eléctrica + Cesta de Licores. S/ 10 por número.',
    createdAt: '2026-10-18',
    participants: [
      { id: 'p-4', name: 'Carlos Mendoza', amount: 20, ticketNum: 7, status: 'validado', timestamp: 'Ayer', voucher: 'v1.jpg' },
      { id: 'p-5', name: 'Carlos Mendoza', amount: 20, ticketNum: 8, status: 'validado', timestamp: 'Ayer', voucher: 'v1.jpg' },
      { id: 'p-6', name: 'Sofía Benitez', amount: 10, ticketNum: 15, status: 'pendiente', timestamp: 'Hoy 09:00 AM', voucher: 'v2.jpg' },
      { id: 'p-7', name: 'Diego Silva', amount: 10, ticketNum: 23, status: 'validado', timestamp: 'Hoy 10:12 AM', voucher: 'v3.jpg' }
    ]
  }
];

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [activeTab, setActiveTab] = useState('vaquita'); // 'vaquita' | 'rifa'
  const [selectedEventId, setSelectedEventId] = useState('evt-1');
  const [isOrganizerMode, setIsOrganizerMode] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Participant Form State
  const [participantName, setParticipantName] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedRaffleTickets, setSelectedRaffleTickets] = useState([]);
  const [simulatedVoucher, setSimulatedVoucher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Event Form State
  const [newType, setNewType] = useState('vaquita');
  const [newTitle, setNewTitle] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newTicketPrice, setNewTicketPrice] = useState('');
  const [newTotalTickets, setNewTotalTickets] = useState('50');
  const [newDescription, setNewDescription] = useState('');

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Helper Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Calculate stats
  const totalCollected = selectedEvent ? selectedEvent.participants
    .filter(p => p.status === 'validado')
    .reduce((sum, p) => sum + Number(p.amount), 0) : 0;

  const pendingAmount = selectedEvent ? selectedEvent.participants
    .filter(p => p.status === 'pendiente')
    .reduce((sum, p) => sum + Number(p.amount), 0) : 0;

  const percentage = selectedEvent?.goal > 0 
    ? Math.min(Math.round((totalCollected / selectedEvent.goal) * 100), 100)
    : 0;

  // Handle Copy / Yape Link
  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    showToast(`📱 ¡Número ${phone} copiado! Abre Yape o Plin`);
  };

  const handleOpenYape = (phone, amount) => {
    handleCopyPhone(phone);
    // Deep-link trigger attempt for mobile app, falls back cleanly
    window.location.href = `yape://pay?phone=${phone}&amount=${amount || 0}`;
  };

  // Ticket selection for Raffles
  const toggleTicketSelection = (num) => {
    const isTaken = selectedEvent.participants.some(p => p.ticketNum === num && p.status === 'validado');
    if (isTaken) {
      showToast(`⚠️ El número #${num} ya fue pagado y verificado`);
      return;
    }

    if (selectedRaffleTickets.includes(num)) {
      setSelectedRaffleTickets(selectedRaffleTickets.filter(n => n !== num));
    } else {
      setSelectedRaffleTickets([...selectedRaffleTickets, num]);
    }
  };

  // Handle Submitting Aport / Ticket Buy
  const handleAddContribution = (e) => {
    e.preventDefault();
    if (!participantName.trim()) {
      showToast('⚠️ Ingresa tu nombre por favor');
      return;
    }

    let finalAmount = 0;
    if (selectedEvent.type === 'vaquita') {
      finalAmount = Number(contributionAmount);
      if (!finalAmount || finalAmount <= 0) {
        showToast('⚠️ Ingresa un monto válido');
        return;
      }
    } else {
      if (selectedRaffleTickets.length === 0) {
        showToast('⚠️ Elige al menos 1 número de la rifa');
        return;
      }
      finalAmount = selectedRaffleTickets.length * selectedEvent.ticketPrice;
    }

    if (!simulatedVoucher) {
      showToast('⚠️ Por favor sube la captura de tu Yape/Plin');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newParticipants = [];

      if (selectedEvent.type === 'vaquita') {
        newParticipants.push({
          id: 'p-' + Date.now(),
          name: participantName,
          amount: finalAmount,
          ticketNum: null,
          status: 'pendiente',
          timestamp: 'Justo ahora',
          voucher: simulatedVoucher.name || 'voucher.jpg'
        });
      } else {
        selectedRaffleTickets.forEach((tNum, idx) => {
          newParticipants.push({
            id: 'p-' + Date.now() + '-' + idx,
            name: participantName,
            amount: selectedEvent.ticketPrice,
            ticketNum: tNum,
            status: 'pendiente',
            timestamp: 'Justo ahora',
            voucher: simulatedVoucher.name || 'voucher.jpg'
          });
        });
      }

      setEvents(events.map(evt => {
        if (evt.id === selectedEvent.id) {
          return {
            ...evt,
            participants: [...evt.participants, ...newParticipants]
          };
        }
        return evt;
      }));

      setIsSubmitting(false);
      setParticipantName('');
      setContributionAmount('');
      setSelectedRaffleTickets([]);
      setSimulatedVoucher(null);
      showToast('✅ ¡Aporte registrado! En espera de validación del organizador.');
    }, 600);
  };

  // Toggle Participant Status (Organizer control)
  const toggleParticipantStatus = (participantId) => {
    setEvents(events.map(evt => {
      if (evt.id === selectedEvent.id) {
        return {
          ...evt,
          participants: evt.participants.map(p => {
            if (p.id === participantId) {
              const nextStatus = p.status === 'validado' ? 'pendiente' : 'validado';
              return { ...p, status: nextStatus };
            }
            return p;
          })
        };
      }
      return evt;
    }));
    showToast('🔄 Estado de pago actualizado');
  };

  // Handle Create New Event
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newTitle || !newOrganizer || !newPhone) {
      showToast('⚠️ Completa los campos obligatorios');
      return;
    }

    const createdEvent = {
      id: 'evt-' + Date.now(),
      type: newType,
      title: newTitle,
      organizer: newOrganizer,
      phone: newPhone,
      goal: Number(newGoal) || (newType === 'rifa' ? (Number(newTicketPrice) * Number(newTotalTickets)) : 100),
      ticketPrice: newType === 'rifa' ? Number(newTicketPrice) : 0,
      totalTickets: newType === 'rifa' ? Number(newTotalTickets) : 0,
      description: newDescription || '¡Súmate al evento y yapea directo!',
      createdAt: 'Hoy',
      participants: []
    };

    setEvents([createdEvent, ...events]);
    setSelectedEventId(createdEvent.id);
    setActiveTab(newType);
    setShowCreateModal(false);
    
    // Reset form
    setNewTitle('');
    setNewOrganizer('');
    setNewPhone('');
    setNewGoal('');
    setNewTicketPrice('');
    setNewDescription('');
    showToast('🎉 ¡Evento creado con éxito! Comparte el enlace por WhatsApp');
  };

  // WhatsApp Share Message
  const shareWhatsApp = () => {
    const message = `👋 ¡Hola! Te invito a unirte a "${selectedEvent.title}".\n\n📌 Organizado por: ${selectedEvent.organizer}\n📲 Yape/Plin al: ${selectedEvent.phone}\n${selectedEvent.type === 'rifa' ? `🎟️ Valor por número: S/ ${selectedEvent.ticketPrice}` : `🎯 Meta: S/ ${selectedEvent.goal}`}\n\n👉 Entra, elige tu aporte y sube tu comprobante aquí:\nhttps://vaquitaya.pe/e/${selectedEvent.id}`;
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12 antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs md:text-sm font-semibold px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-700 animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-purple-900 text-white shadow-md">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-fuchsia-500 to-purple-400 p-2 rounded-xl shadow-inner">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-purple-100 to-fuchsia-200 bg-clip-text text-transparent">
                Vaquita<span className="text-fuchsia-400">Ya</span>
              </h1>
              <p className="text-[10px] text-purple-300 font-medium tracking-wide">COLECTAS & RIFAS YAPE/PLIN</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1 bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-fuchsia-500/30 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Crear</span>
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="max-w-xl mx-auto px-4 flex border-t border-purple-800/60 bg-purple-950/40">
          <button
            onClick={() => {
              setActiveTab('vaquita');
              const firstVaquita = events.find(e => e.type === 'vaquita');
              if (firstVaquita) setSelectedEventId(firstVaquita.id);
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center space-x-1.5 border-b-2 transition ${
              activeTab === 'vaquita'
                ? 'border-fuchsia-400 text-fuchsia-300 bg-purple-900/40'
                : 'border-transparent text-purple-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Vaquitas & Cuentas</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rifa');
              const firstRifa = events.find(e => e.type === 'rifa');
              if (firstRifa) setSelectedEventId(firstRifa.id);
            }}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center space-x-1.5 border-b-2 transition ${
              activeTab === 'rifa'
                ? 'border-fuchsia-400 text-fuchsia-300 bg-purple-900/40'
                : 'border-transparent text-purple-300 hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Rifas & Pollas</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">

        {/* Organizer Mode Switcher Banner */}
        <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-purple-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            <span>Modo Organizador (Validar vouchers)</span>
          </div>
          <button
            onClick={() => setIsOrganizerMode(!isOrganizerMode)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isOrganizerMode ? 'bg-purple-700' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                isOrganizerMode ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Event Selector Horizontal Scroll */}
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {events.filter(e => e.type === activeTab).map((evt) => (
            <button
              key={evt.id}
              onClick={() => setSelectedEventId(evt.id)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 shrink-0 ${
                selectedEventId === evt.id
                  ? 'bg-purple-900 text-white border-purple-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
              }`}
            >
              <span>{evt.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Event Main Card */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-purple-800 via-purple-900 to-indigo-950 text-white p-5 relative">
            <div className="flex justify-between items-start">
              <span className="inline-block bg-fuchsia-500/30 backdrop-blur-md border border-fuchsia-400/40 text-fuchsia-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                {selectedEvent.type === 'vaquita' ? '💰 Vaquita Grupal' : '🎟️ Rifa Digital'}
              </span>
              <button
                onClick={shareWhatsApp}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
            </div>

            <h2 className="text-xl font-black mt-3 leading-tight">{selectedEvent.title}</h2>
            <p className="text-purple-200 text-xs mt-1 leading-relaxed">{selectedEvent.description}</p>

            <div className="mt-4 pt-3 border-t border-purple-700/50 flex items-center justify-between text-xs text-purple-200">
              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center font-bold text-white text-[10px]">
                  {selectedEvent.organizer.charAt(0)}
                </div>
                <span>Organiza: <strong>{selectedEvent.organizer}</strong></span>
              </div>
              <div className="flex items-center space-x-1 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-700/60">
                <Smartphone className="w-3.5 h-3.5 text-fuchsia-300" />
                <span className="font-mono font-bold text-white">{selectedEvent.phone}</span>
              </div>
            </div>

            {/* Progress Meter */}
            <div className="mt-5 bg-purple-950/50 p-3 rounded-2xl border border-purple-800/60">
              <div className="flex justify-between items-baseline text-xs mb-1.5">
                <span className="text-purple-300 font-medium">Recaudado verificado:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  S/ {totalCollected} <span className="text-purple-400 text-xs font-normal">/ S/ {selectedEvent.goal}</span>
                </span>
              </div>
              <div className="w-full bg-purple-950 h-3 rounded-full overflow-hidden border border-purple-800/40 p-0.5">
                <div
                  className="bg-gradient-to-r from-fuchsia-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-purple-300 mt-1.5">
                <span>{percentage}% completado</span>
                {pendingAmount > 0 && (
                  <span className="text-amber-300 font-semibold">S/ {pendingAmount} por validar</span>
                )}
              </div>
            </div>
          </div>

          {/* Direct Yape / Plin Quick Pay Box */}
          <div className="p-4 bg-fuchsia-50/60 border-b border-fuchsia-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-purple-900 flex items-center justify-center text-white shrink-0 font-black text-xs shadow-md">
                Y/P
              </div>
              <div>
                <p className="text-xs font-bold text-purple-950">Pago Directo Yape o Plin</p>
                <p className="text-[11px] text-purple-700">A nombre de: {selectedEvent.organizer}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleCopyPhone(selectedEvent.phone)}
                className="flex-1 sm:flex-none px-3 py-2 bg-white border border-purple-200 text-purple-900 rounded-xl text-xs font-bold hover:bg-purple-100 transition flex items-center justify-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Número</span>
              </button>
              <button
                onClick={() => handleOpenYape(selectedEvent.phone, contributionAmount || selectedEvent.ticketPrice)}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-purple-800 text-white rounded-xl text-xs font-bold hover:bg-purple-900 transition flex items-center justify-center space-x-1 shadow-md shadow-purple-900/20 active:scale-95"
              >
                <Smartphone className="w-3.5 h-3.5 text-fuchsia-300" />
                <span>Abrir Yape</span>
              </button>
            </div>
          </div>

          {/* Interactive Form: Participar */}
          <div className="p-5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-fuchsia-600" />
              <span>Regístrate y sube tu Yape</span>
            </h3>

            <form onSubmit={handleAddContribution} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tu Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Pedro Castillo / Luciana Fernández"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                  required
                />
              </div>

              {/* Conditional UI based on event type */}
              {selectedEvent.type === 'vaquita' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">¿Cuánto vas a yapear? (S/)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">S/</span>
                    <input
                      type="number"
                      placeholder="Ej. 20.00"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                      required
                    />
                  </div>
                  {/* Quick amount chips */}
                  <div className="flex space-x-2 mt-2">
                    {[10, 20, 30, 50].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setContributionAmount(amt.toString())}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-800 rounded-lg text-[11px] font-bold transition border border-slate-200"
                      >
                        +S/ {amt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      Elige tus números de rifa (S/ {selectedEvent.ticketPrice} c/u):
                    </label>
                    <span className="text-xs font-bold text-fuchsia-600">
                      Total: S/ {selectedRaffleTickets.length * selectedEvent.ticketPrice}
                    </span>
                  </div>

                  {/* Raffle Numbers Grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                    {Array.from({ length: selectedEvent.totalTickets }, (_, i) => i + 1).map((num) => {
                      const isTaken = selectedEvent.participants.some(
                        p => p.ticketNum === num && p.status === 'validado'
                      );
                      const isPending = selectedEvent.participants.some(
                        p => p.ticketNum === num && p.status === 'pendiente'
                      );
                      const isSelected = selectedRaffleTickets.includes(num);

                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => toggleTicketSelection(num)}
                          disabled={isTaken}
                          className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                            isTaken
                              ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed line-through'
                              : isPending
                              ? 'bg-amber-100 text-amber-700 border border-amber-300'
                              : isSelected
                              ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/30 scale-105'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-fuchsia-400'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center space-x-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-slate-300" /> <span>Ocupado</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400" /> <span>Por validar</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-600" /> <span>Tu Selección</span>
                  </p>
                </div>
              )}

              {/* Voucher Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Adjunta Comprobante / Voucher Yape</label>
                <div className="relative border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/40 p-3 rounded-2xl text-center transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSimulatedVoucher(e.target.files[0] || { name: 'voucher_pago.png' })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center space-x-2 text-purple-800">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold">
                      {simulatedVoucher ? `📸 ${simulatedVoucher.name}` : 'Toca para subir foto del Yape'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-900 hover:bg-purple-950 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-purple-900/20 transition active:scale-[0.99] flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <span>Registrando aporte...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
                    <span>Enviar Aporte para Validación</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Live Participants List Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Participantes ({selectedEvent.participants.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {isOrganizerMode ? '🔧 Toca para validar' : 'Vista pública'}
            </span>
          </div>

          {selectedEvent.participants.length === 0 ? (
            <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xs">Aún no hay aportes registrados en este evento.</p>
              <p className="text-[11px] text-slate-400 mt-1">¡Sé el primero en yapear y registrarte arriba!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedEvent.participants.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                    p.status === 'validado'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        p.status === 'validado'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {p.ticketNum ? `#${p.ticketNum}` : p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {p.timestamp} • Voucher adjunto
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-800">S/ {p.amount}</span>

                    {/* Organizer Toggle Button */}
                    {isOrganizerMode ? (
                      <button
                        onClick={() => toggleParticipantStatus(p.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1 transition shadow-sm ${
                          p.status === 'validado'
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse'
                        }`}
                      >
                        {p.status === 'validado' ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Validado</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Aprobar</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          p.status === 'validado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status === 'validado' ? 'VALIDADO' : 'PENDIENTE'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal: Crear Nuevo Evento */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-100 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-fuchsia-600" />
                <span>Crear Nuevo Evento</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setNewType('vaquita')}
                  className={`py-2 rounded-xl transition ${
                    newType === 'vaquita' ? 'bg-purple-900 text-white shadow-md' : 'text-slate-600'
                  }`}
                >
                  💰 Vaquita / Cuentas
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('rifa')}
                  className={`py-2 rounded-xl transition ${
                    newType === 'rifa' ? 'bg-purple-900 text-white shadow-md' : 'text-slate-600'
                  }`}
                >
                  🎟️ Rifa / Polla
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Título del Evento *</label>
                <input
                  type="text"
                  placeholder={newType === 'vaquita' ? 'Ej. Parrillada con la Mancha 🍖' : 'Ej. Rifa Pro-Salud Don Pedro 🎟️'}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tu Nombre *</label>
                  <input
                    type="text"
                    placeholder="Ej. Mateo Vega"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Número Yape/Plin *</label>
                  <input
                    type="tel"
                    placeholder="9XXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
              </div>

              {newType === 'vaquita' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Meta de Recaudación (S/)</label>
                  <input
                    type="number"
                    placeholder="Ej. 250"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Precio por Número (S/)</label>
                    <input
                      type="number"
                      placeholder="Ej. 10"
                      value={newTicketPrice}
                      onChange={(e) => setNewTicketPrice(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Total de Números</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={newTotalTickets}
                      onChange={(e) => setNewTotalTickets(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Descripción corta o reglas</label>
                <textarea
                  rows="2"
                  placeholder="Ej. Detalla aquí para qué es la colecta o cuáles son los premios."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-900 hover:bg-purple-950 text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-purple-900/20 transition active:scale-[0.99] text-xs uppercase tracking-wider"
              >
                Publicar Evento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}