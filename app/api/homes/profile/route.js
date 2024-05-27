import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";

export async function POST(req) {
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const { nickURL } =  await req.json(); 
  try {
    await client.connect();
    const resultURL = await client.query('SELECT name, avatar, backgroundimg, bio, u_subscribe, on_subscribe, u_followers_count, followers_count FROM public.users WHERE id_user = $1;', [nickURL]);
    if(resultURL.rows.length > 0) {
      const NamePort = resultURL.rows[0].name;
      const UserLogo = resultURL.rows[0].avatar;
      const backgroundimg = resultURL.rows[0].backgroundimg;
      const Bio = resultURL.rows[0].bio;
      const u_subscribe = resultURL.rows[0].u_subscribe;
      const on_subscribe = resultURL.rows[0].on_subscribe;
      const u_followers_count = resultURL.rows[0].u_followers_count;
      const followers_count = resultURL.rows[0].followers_count;
      return NextResponse.json({ NamePort, UserLogo, backgroundimg, Bio, u_subscribe, on_subscribe, u_followers_count, followers_count }, { status: 200 });
    }
    return NextResponse.json({ error: 'such a user does not exist' }, { status: 404  });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}


export async function GET(req, { params }) { 
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
    if (refreshToken) {
      const jwtres = jwt.verify(refreshToken.value, process.env.JWT_SECRET);
      const id = jwtres.data[1];
      if (typeof jwtres === 'object' && jwtres !== null) {
        const result = await client.query('SELECT id_user FROM public.users WHERE id = $1;', [id]);
        if(result.rows.length > 0) {
          const id_user = result.rows[0].id_user;
          return NextResponse.json({ id_user }, { status: 200 });
        }
        return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'None coockie' }, { status: 400 });
    }
    return NextResponse.json({ error: 'None coockie' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
  } finally {
    await client.end();
  }
}