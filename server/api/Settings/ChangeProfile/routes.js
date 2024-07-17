const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { put } = require('@vercel/blob');
const pg = require("../../cone");
const multer = require('multer');
const path = require('path');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.fields([{ name: 'avatar' }, { name: 'background' }]), async (req, res) => {
  const avatarFile = req.files['avatar'] ? req.files['avatar'][0] : null;
  const backgroundImageFile = req.files['background'] ? req.files['background'][0] : null;
  const { nick, name, bio } = req.body;
  try {
    const refreshToken = req.cookies['auth_token'];
    if (!refreshToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const one = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const jwtres = jwt.verify(one.data, process.env.JWT_SECRET);
    const id = jwtres.data[1];
    
    const client = await pg.connect();
    const userResult = await client.query('SELECT id_user FROM public.users WHERE id = $1;', [id]);
    if (userResult.rows.length === 0) {
      await client.release();
      return res.status(404).json({ error: 'User not found' });
    }

    let query = 'UPDATE public.users SET';
    const values = [];
    
    if (avatarFile) {
      const res_avatar = await put('avatar/' + avatarFile.originalname, avatarFile.buffer, { access: 'public' });
      const url_avatar = res_avatar.url;
      query += ' avatar = $' + (values.length + 1) + ",";
      values.push(url_avatar);
    }

    if (backgroundImageFile) {
      const res_background = await put('background/' + backgroundImageFile.originalname, backgroundImageFile.buffer, { access: 'public' });
      const url_background = res_background.url;
      query += ' backgroundimg = $' + (values.length + 1) + ",";
      values.push(url_background);
    }

    if (nick) {
      query += ' nick = $' + (values.length + 1) + ",";
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

    await client.query(query, values);
    await client.release();
    
    return res.status(200).json({ message: 'User settings updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
