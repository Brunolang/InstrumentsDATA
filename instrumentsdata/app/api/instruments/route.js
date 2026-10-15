export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM instruments ORDER BY created_at DESC;`;
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const usuario = formData.get('usuario');
    const instrumento = formData.get('instrumento');
    const nro_parte = formData.get('nro_parte');
    const nro_serie = formData.get('nro_serie');
    const foto = formData.get('foto');

    if (!usuario || !instrumento || !nro_parte || !nro_serie || !foto) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Guardado privado y con sufijo aleatorio para evitar colisiones
    const blob = await put(foto.name, foto, { 
      access: 'private',
      addRandomSuffix: true 
    });

    // Mapeo exacto a las columnas de la tabla en Postgres
    await sql`
      INSERT INTO instruments (user_name, instrument, part_number, serial_number, image_url)
      VALUES (${usuario}, ${instrumento}, ${nro_parte}, ${nro_serie}, ${blob.url});
    `;

    return NextResponse.json({ message: 'Instrumento registrado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}