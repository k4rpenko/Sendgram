import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import connectM from "../../../libs/mongodb_M";
import Topic from "../../../models/t";


export async function POST(req) {
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
    console.log(id);
    const result = await client.query('SELECT id, id_user, email, password, name, avatar FROM public.users WHERE id = $1;', [id]);
    if(result.rows.length > 0) {
      const id_global = id
      const name = result.rows[0].name;
      const nick = result.rows[0].id_user;
      const avatar = result.rows[0].avatar;
      const { content, image } = await req.json();
      await connectM();
      await Topic.create({ id_global, content, nick, name, avatar, image });
      return NextResponse.json({ message: "Topic Created" }, { status: 201 });
    }
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
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
        const result = await client.query('SELECT id, id_user, email, password, name, avatar FROM public.users WHERE id = $1;', [id]);
        if(result.rows.length > 0) {
          const NamePort = result.rows[0].name;
          const id_user = result.rows[0].id_user;
          const UserLogo = result.rows[0].avatar;
          const currentDate = new Date();
          const oneMonthAgo = new Date(currentDate.getTime());
          oneMonthAgo.setMonth(currentDate.getMonth() - 1);
          const topics = await Topic.aggregate([
            { $sample: { size: 10 } }
          ]);
          return NextResponse.json({ topics, NamePort, id_user, UserLogo }, { status: 200 });
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