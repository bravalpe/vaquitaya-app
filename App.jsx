import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('list'); // 'list' | 'create' | 'detail'
  const [campaigns, setCampaigns] = useState([
    {
      id: '1',
      title: 'Parrillada de Cumpleaños de Carlos',
      description: 'Cuota para la carne, bebidas y carbón este fin de semana.',
      targetAmount: 300,
      currentAmount: 180,
      phone: '987654321',
      type: 'colecta',
      organizer: 'Carlos'
    }
  ]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('colecta');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title || !targetAmount || !phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const newCampaign = {
      id: Date.now().toString(),
      title,
      description,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      phone,
      type,
      organizer: 'Tú'
    };

    setCampaigns([newCampaign, ...campaigns]);
    setSelectedCampaign(newCampaign);
    setView('detail');

    // Resetear formulario
    setTitle('');
    setDescription('');
    setTargetAmount('');
    setPhone('');
  };

  const shareOnWhatsApp = (campaign) => {
    const text = `¡Hola! 👋 Estoy organizando una ${campaign.type === 'colecta' ? 'colecta' : 'rifa'} en VaquitaYa: "${campaign.title}".\n\n📌 Meta: S/ ${campaign.targetAmount}\n📱 Yape/Plin: ${campaign.phone}\n\n¡Apóyanos y participa aquí! 👇\n${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl flex flex-col justify-between">
      {/* Header */}
      <header className="bg-purple-700 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
          <span className="text-2xl">🐮</span>
          <h1 className="text-xl font-black tracking-tight">VaquitaYa</h1>
        </div>
        {view !== 'create' && (
          <button
            onClick={() => setView('create')}
            className="bg-white text-purple-700 font-bold px-3 py-1.5 rounded-lg text-sm shadow hover:bg-purple-50 transition"
          >
            + Crear
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 flex-1">
        {view === 'list' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">Colectas Activas</h2>
            {campaigns.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No hay colectas creadas aún.</p>
            ) : (
              campaigns.map((c) => {
                const progress = Math.min(Math.round((c.currentAmount / c.targetAmount) * 100), 100);
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCampaign(c);
                      setView('detail');
                    }}
                    className="border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-purple-300 transition cursor-pointer bg-slate-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${c.type === 'colecta' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.type}
                      </span>
                      <span className="text-xs text-slate-400">Por {c.organizer}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{c.title}</h3>
                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">{c.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Recaudado: S/ {c.currentAmount}</span>
                      <span>Meta: S/ {c.targetAmount} ({progress}%)</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {view === 'create' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => setView('list')} className="text-slate-500 text-sm">← Volver</button>
              <h2 className="text-lg font-bold text-slate-800">Nueva Vaquita</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de evento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('colecta')}
                    className={`py-2 text-xs font-bold rounded-xl border ${type === 'colecta' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                  >
                    Colecta
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('rifa')}
                    className={`py-2 text-xs font-bold rounded-xl border ${type === 'rifa' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                  >
                    Rifa
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la colecta *</label>
                <input
                  type="text"
                  placeholder="Ej. Regalo de Cumpleaños para Ana"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  placeholder="Detalles sobre para qué es el dinero..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-purple-600 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meta (S/) *</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.value ? Math.max(0, parseFloat(e.target.value)) : e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Número Yape/Plin *</label>
                  <input
                    type="tel"
                    placeholder="987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm focus:outline-purple-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition mt-4"
              >
                Publicar Colecta
              </button>
            </form>
          </div>
        )}

        {view === 'detail' && selectedCampaign && (
          <div className="space-y-4">
            <button onClick={() => setView('list')} className="text-slate-500 text-sm mb-2">← Volver al listado</button>
            
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-600 text-white rounded-full uppercase">
                {selectedCampaign.type}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-2">{selectedCampaign.title}</h2>
              <p className="text-xs text-slate-600 mt-1">{selectedCampaign.description}</p>
              
              <div className="mt-4 p-3 bg-white rounded-xl shadow-sm border border-purple-100">
                <p className="text-xs text-slate-500">Monto Recaudado</p>
                <p className="text-2xl font-black text-purple-700">S/ {selectedCampaign.currentAmount} <span className="text-xs font-normal text-slate-400">/ S/ {selectedCampaign.targetAmount}</span></p>
              </div>

              <div className="mt-4 text-left bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <p className="text-xs font-bold text-slate-700">📱 Datos para aportar:</p>
                <p className="text-sm font-mono text-slate-800 font-bold">Yape / Plin: {selectedCampaign.phone}</p>
              </div>
            </div>

            <button
              onClick={() => shareOnWhatsApp(selectedCampaign)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
            >
              <span>📲 Compartir por WhatsApp</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-3 text-center text-[10px] text-slate-400 border-t border-slate-200">
        VaquitaYa Perú © 2026 • Colectas rápidas con Yape y Plin
      </footer>
    </div>
  );
}
