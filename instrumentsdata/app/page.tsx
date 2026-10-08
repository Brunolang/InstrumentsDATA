'use client';

import { useState, useEffect } from 'react';

interface Instrumento {
  id: number;
  usuario: string;
  instrumento: string;
  nro_parte: string;
  nro_serie: string;
  foto_url: string;
  fecha: string;
}

export default function Home() {
  const [formData, setFormData] = useState({
    usuario: '',
    instrumento: '',
    nro_parte: '',
    nro_serie: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);

  const fetchInstrumentos = async () => {
    try {
      const res = await fetch('/api/instruments');
      if (res.ok) {
        const data = await res.json();
        setInstrumentos(data);
      }
    } catch (err) {
      console.error('Error al cargar instrumentos:', err);
    }
  };

  useEffect(() => {
    fetchInstrumentos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto) {
      setMensaje('Por favor, selecciona una foto.');
      return;
    }

    setLoading(true);
    setMensaje('');

    const data = new FormData();
    data.append('usuario', formData.usuario);
    data.append('instrumento', formData.instrumento);
    data.append('nro_parte', formData.nro_parte);
    data.append('nro_serie', formData.nro_serie);
    data.append('foto', foto);

    try {
      const res = await fetch('/api/instruments', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        setMensaje('¡Instrumento guardado con éxito!');
        setFormData({ usuario: '', instrumento: '', nro_parte: '', nro_serie: '' });
        setFoto(null);
        fetchInstrumentos();
      } else {
        const errData = await res.json();
        setMensaje(`Error: ${errData.error || 'Ocurrió un problema'}`);
      }
    } catch (err) {
      setMensaje('Error de red al intentar guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', color: '#18181b', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Gestión de InstrumentsData</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Formulario */}
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Nuevo Registro</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold' }}>Usuario:</label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold' }}>Instrumento:</label>
                <input
                  type="text"
                  name="instrumento"
                  value={formData.instrumento}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold' }}>Nro. de Parte:</label>
                <input
                  type="text"
                  name="nro_parte"
                  value={formData.nro_parte}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold' }}>Nro. de Serie:</label>
                <input
                  type="text"
                  name="nro_serie"
                  value={formData.nro_serie}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold' }}>Foto:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  style={{ marginTop: '0.25rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  padding: '0.6rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Instrumento'}
              </button>

              {mensaje && (
                <p style={{ marginTop: '0.5rem', color: mensaje.includes('éxito') ? '#16a34a' : '#dc2626', fontSize: '0.875rem' }}>
                  {mensaje}
                </p>
              )}
            </form>
          </div>

          {/* Tabla de registros */}
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Instrumentos Registrados</h2>
            {instrumentos.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No hay registros cargados aún.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                    <th style={{ padding: '0.5rem' }}>Usuario</th>
                    <th style={{ padding: '0.5rem' }}>Instrumento</th>
                    <th style={{ padding: '0.5rem' }}>Nro. Parte</th>
                    <th style={{ padding: '0.5rem' }}>Nro. Serie</th>
                    <th style={{ padding: '0.5rem' }}>Imagen</th>
                  </tr>
                </thead>
                <tbody>
                  {instrumentos.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.5rem' }}>{item.usuario}</td>
                      <td style={{ padding: '0.5rem' }}>{item.instrumento}</td>
                      <td style={{ padding: '0.5rem' }}>{item.nro_parte}</td>
                      <td style={{ padding: '0.5rem' }}>{item.nro_serie}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <a href={item.foto_url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                          Ver Foto
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}