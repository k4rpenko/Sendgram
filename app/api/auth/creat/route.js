import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'

export async function POST(req) {
  const { email, password } =  await req.json();
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT id, id_user, email, password, name FROM public.users WHERE email = $1;', [email]);
    if (result.rows.length > 0) { 
      const dbPassword = result.rows[0].password;
      const passwordMatch = await bcrypt.compare(password, dbPassword);
      if (!passwordMatch) {
        return NextResponse.json({ message: "Error" }, { status: 401 });
      }
      const id_global = result.rows[0].id;
      const refreshresult = await client.query('SELECT * FROM public.token_refresh WHERE user_id = $1;', [id_global]);
      const refreshToken = refreshresult.rows[0].token;      
      cookies().set("auth_token", refreshToken, { httpOnly: true, path: '/', maxAge: 2592000 });
      cookies().set("userPreferences", { theme: 'dark', language: 'ua' }, { httpOnly: true, path: '/', maxAge: 2592000 });
      return NextResponse.json({ message: "Login",  status: 200 });
    } 
    else if(result.rows.length < 0){
      return NextResponse.json({ status: 404  });
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}

export async function GET(req) {
    const { id } =  await req.json();
    const client = new db.Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    try {
        const email = decodeUserId(id);
        const result = await client.query('SELECT email FROM public.users WHERE email = $1;', [email]);
        if (result.rows.length > 0) { 
            return NextResponse.json({ message: 'Creat' }, { status: 200 });
        }
        return NextResponse.json({ error: 'None coockie' }, { status: 400 });
  } catch (error) {
  } 
}