import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const usuario = formData.get('usuario');
    const instrumento = formData.get('instrumento');
    const nroParte = formData.get('nroParte');
    const nroSerie = formData.get('nroSerie');
    const file = formData.get('foto');

    // 1. Guardar la foto en Vercel Blob
    const blob = await put(file.name, file, { access: 'public' });

    // 2. Insertar los datos en la base de datos Postgres
    await sql`
      INSERT INTO instrumentos (usuario, instrumento, nro_parte, nro_serie, foto_url)
      VALUES (${usuario}, ${instrumento}, ${nroParte}, ${nroSerie}, ${blob.url})
    `;

    return NextResponse.json({ message: 'Guardado correctamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}