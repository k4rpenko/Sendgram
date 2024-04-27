import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import TokenService from "../../tokenService";


export async function POST(req) {
  const { email, password } =  await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    const result = await client.query('SELECT email FROM public.users WHERE email = $1;', [email]);
    if (result.rows.length > 0) {
      return NextResponse.json({ message: "Error" }, { status: 401 });
    }
    else {
      const avatar = "https://54hmmo3zqtgtsusj.public.blob.vercel-storage.com/Logo-yEeh50niFEmvdLeI2KrIUGzMc6VuWd.jpg"
      const private_status = "false"
      await client.query('INSERT INTO public.users (email, password, avatar, private_status) VALUES ($1, $2, $3, $4);', [email, hashedPassword, avatar, private_status]);
      const result = await client.query('SELECT id, id_user, email, password, name FROM public.users WHERE email = $1;', [email]);
      if(result.rows.length > 0){
        const id_global = result.rows[0].id;
        const values = [email, id_global];
        //const accessToken = await TokenService.generateAccessToken(values);
        const refreshToken = await TokenService.generateRefreshToken(values);
        await client.query('INSERT INTO token_refresh (user_id, token) VALUES ($1, $2);', [id_global, refreshToken]);
        cookies().set("auth_token", refreshToken, { httpOnly: true, path: '/', maxAge: 2592000 });
        cookies().set("userPreferences", { theme: 'dark', language: 'ua' }, { httpOnly: true, path: '/', maxAge: 2592000 });
        return NextResponse.json({ message: "Created",  status: 200 });
      }
      //localStorage.setItem('accessToken', accessToken);

      return NextResponse.json({ message: "Error" }, { status: 404 });
    }
  } 
  catch (error) {
    console.error('Error in server code:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('auth_token');
    if (refreshToken) {
      const jwtres = jwt.verify(refreshToken.value, process.env.JWT_SECRET);
      if (typeof jwtres === 'object' && jwtres !== null) {
        return NextResponse.json({ status: 200 });
      }
    }
    return NextResponse.json({ error: 'None coockie' }, { status: 400 });
  } catch (error) {
  }
}