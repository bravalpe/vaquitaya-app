import React from 'react';

export default function App() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg flex flex-col justify-between p-6">
      <div className="space-y-6 text-center mt-10">
        <div className="inline-block p-4 bg-purple-100 rounded-full text-purple-600 font-bold text-3xl">
          🐮
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">VaquitaYa</h1>
        <p className="text-slate-600 text-sm">
          Organiza colectas y rifas al toque. Vinculado directo con Yape y Plin.
        </p>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-left space-y-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded font-bold uppercase">Estado</span>
          <p className="text-xs text-purple-900 font-medium">App desplegada correctamente en Vercel.</p>
        </div>

        <div className="space-y-3 pt-4">
          <button onClick={() => alert('¡Función de crear colecta!')} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition">
            + Crear nueva colecta
          </button>
          <button onClick={() => alert('¡Función de crear rifa!')} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl transition">
            🎟️ Crear Rifa
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-100">
        VaquitaYa Perú © 2026 • Modo PWA Activo
      </div>
    </div>
  );
}
