import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';


export async function POST(req, { params }) { 
  const { nickURL, ProfileNick } =  await req.json(); 
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
      await client.connect();
      const result = await client.query('SELECT id FROM public.users WHERE id_user = $1;', [ProfileNick]);
      const resultURL = await client.query('SELECT id FROM public.users WHERE id_user = $1;', [nickURL]);
      if (result.rows.length > 0) {
          const id = result.rows[0].id;
          const id_URL = resultURL.rows[0].id;
          await client.query('UPDATE public.users SET followers_count =  followers_count + 1, on_subscribe = array_append(on_subscribe, $2) WHERE id = $1;', [id_URL, id]);
          await client.query('UPDATE public.users SET u_followers_count = u_followers_count + 1, u_subscribe = array_append(u_subscribe, $2) WHERE id = $1;', [id, id_URL]);
          return NextResponse.json({ status: 200 });
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
  } finally {
      await client.end();
  }
}
