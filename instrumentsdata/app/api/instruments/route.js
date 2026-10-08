export const runtime = 'nodejs';

import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// GET: Obtener todos los instrumentos guardados
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM instrumentos ORDER BY fecha DESC;`;
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Guardar un nuevo instrumento
export async function POST(request) {
  try {
    const formData = await request.formData();
    const usuario = formData.get('usuario');
    const instrumento = formData.get('instrumento');
    const nroParte = formData.get('nroParte');
    const nroSerie = formData.get('nroSerie');
    const foto = formData.get('foto');

    if (!usuario || !instrumento || !nroParte || !nroSerie || !foto) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Subir imagen a Vercel Blob
    const blob = await put(foto.name, foto, { access: 'public' });

    // Insertar en Vercel Postgres
    await sql`
      INSERT INTO instrumentos (usuario, instrumento, nro_parte, nro_serie, foto_url)
      VALUES (${usuario}, ${instrumento}, ${nroParte}, ${nroSerie}, ${blob.url});
    `;

    return NextResponse.json({ message: 'Instrumento registrado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}