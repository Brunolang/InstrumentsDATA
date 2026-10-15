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
                  style={{ display: 'block', marginTop: '0.25rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ padding: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'wait' : 'pointer' }}
              >
                {loading ? 'Guardando...' : 'Guardar Instrumento'}
              </button>
              {mensaje && <p role="status">{mensaje}</p>}
            </form>
          </div>

          <section style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Instrumentos registrados</h2>
            {instrumentos.length === 0 ? (
              <p>No hay instrumentos registrados.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Instrumento</th>
                      <th>Nro. de Parte</th>
                      <th>Nro. de Serie</th>
                      <th>Foto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instrumentos.map((item) => (
                      <tr key={item.id}>
                        <td>{item.usuario}</td>
                        <td>{item.instrumento}</td>
                        <td>{item.nro_parte}</td>
                        <td>{item.nro_serie}</td>
                        <td>{item.foto_url && <a href={item.foto_url} target="_blank" rel="noreferrer">Ver foto</a>}</td>
                        <td>{item.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}