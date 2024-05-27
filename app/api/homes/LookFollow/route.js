import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";

export async function POST(req) { 
  const { nickURL } =  await req.json(); 
    const client = new db.Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false,
        },
    });
    try {
        await client.connect();
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('auth_token');
        const jwtres = jwt.verify(refreshToken.value, process.env.JWT_SECRET);
        const id = jwtres.data[1];

        const result = await client.query('SELECT u_subscribe FROM public.users WHERE id = $1;', [id]);
        const u_subscribe = result.rows[0].u_subscribe;

        const resultURL = await client.query('SELECT id FROM public.users WHERE id_user = $1;', [nickURL]);
        const id_url = resultURL.rows[0].id;
        if (u_subscribe.includes(String(id_url))) {
          return NextResponse.json({ message: 'You are already subscribed' }, { status: 200 });
        } else if(!u_subscribe.includes(String(id_url))){
          return NextResponse.json({ message: 'You are NOT subscribed' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
    } finally {
        await client.end();
  }
}