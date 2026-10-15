export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { sql } from '@vercel/postgres';
import { put, getDownloadUrl } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM instruments ORDER BY created_at DESC;`;

    // Generamos enlaces de acceso firmados para el store privado y mapeamos los campos a español
    const instrumentosFormat = await Promise.all(
      rows.map(async (item) => {
        let signedUrl = item.image_url;

        if (item.image_url) {
          try {
            signedUrl = await getDownloadUrl(item.image_url);
          } catch (e) {
            console.error('Error generando download URL:', e);
          }
        }

        return {
          id: item.id,
          usuario: item.user_name,
          instrumento: item.instrument,
          nro_parte: item.part_number,
          nro_serie: item.serial_number,
          foto_url: signedUrl,
          fecha: item.created_at,
        };
      })
    );

    return NextResponse.json(instrumentosFormat, { status: 200 });
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

    // Usamos access: 'private' alineado al Store y agregamos sufijo aleatorio
    const blob = await put(foto.name, foto, { 
      access: 'private',
      addRandomSuffix: true 
    });

    await sql`
      INSERT INTO instruments (user_name, instrument, part_number, serial_number, image_url)
      VALUES (${usuario}, ${instrumento}, ${nro_parte}, ${nro_serie}, ${blob.url});
    `;

    return NextResponse.json({ message: 'Instrumento registrado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}