import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken";
import fs from "fs";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};


export async function POST(req, res) {
  const formData = await req.formData();
  const avatarFile = formData.get('avatar');
  const backgroundImageFile = formData.get('background');
  const nick = formData.get('nick');
  const name = formData.get('name');
  const bio = formData.get('bio');
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try{
    await client.connect();
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('auth_token');
    if (refreshToken) {
      const jwtres = jwt.verify(refreshToken.value, process.env.JWT_SECRET);
      const id = jwtres.data[1];
      if (typeof jwtres === 'object' && jwtres !== null) {
        const result = await client.query('SELECT id_user FROM public.users WHERE id = $1;', [id]);
        if(result.rows.length > 0) {
          let query = 'UPDATE public.users SET';
          const values = [];
          const avatarBlob = new Blob([avatarFile]);
          const backgroundBlob = new Blob([backgroundImageFile]);

          if (avatarFile) {
            const res_avatar = await put('avatar/' + avatarFile.name, avatarBlob, { access: 'public' });
            let url_avatar  = res_avatar.url
            query += ' avatar = $' + (values.length + 1) + ",";
            values.push(url_avatar);
          }
          
          if (backgroundImageFile) {
            const res_background = await put('Backgroundimg/' + backgroundImageFile.name, backgroundBlob, { access: 'public' });
            let url_background = res_background.url;
            console.log(url_background);
            query += ' backgroundimg = $' + (values.length + 1) + ",";
            values.push(url_background);
          }
          if (nick) {
            query += ' id_user = $' + (values.length + 1) + ",";
            values.push(nick);
          }
          if (name) {
            query += ' name = $' + (values.length + 1) + ",";
            values.push(name);
          }
          if (bio) {
            query += ' bio = $' + (values.length + 1) + ",";
            values.push(bio);
          }
          query = query.slice(0, -1) + " WHERE id = $" + (values.length + 1) + ";";
          values.push(id);
          console.log(query);
          await client.query(query, values);
          return NextResponse.json({ status: 200 });
        }
        return NextResponse.json({ status: 404 });
      }
      return NextResponse.json({ status: 404 });
    }
  }catch (error){
    return NextResponse.json({ error: 'Internal Server Error ' + error.message }, { status: 500 });
  }finally {
    await client.end();
}
}