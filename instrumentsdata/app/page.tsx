'use client';
import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Guardando instrumento...');
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/instruments', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setStatus('¡Instrumento guardado con éxito!');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('Error al guardar el instrumento.');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Registro InstrumentsData</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Usuario / Persona que carga:</label>
          <input name="usuario" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Instrumento:</label>
          <input name="instrumento" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Nro de Parte:</label>
          <input name="nroParte" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Nro de Serie:</label>
          <input name="nroSerie" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>Foto del instrumento:</label>
          <input name="foto" type="file" accept="image/*" required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Guardar Instrumento
        </button>
      </form>
      {status && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</p>}
    </main>
  );
}