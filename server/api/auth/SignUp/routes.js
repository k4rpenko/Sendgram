const express = require("express");
const router = express.Router();
var cookieParser = require('cookie-parser')
const pg = require("../../cone");
const TokenService =  require("../tokenService");
const { sha256 } = require('js-sha256');

router.use(express.json());
router.use(cookieParser())


router.post('/', async (req, res) => {
    const { email, password } =  await req.body;
    const hashedPassword = sha256(password);
    let client;
    try {
        client = await pg.connect();
        const result = await client.query('SELECT email FROM public.users WHERE email = $1;', [email]);
        if (result.rows.length > 0) {
          return res.status(401).json({ message: "This account already exists" });
        }
        else {
            const avatar = "https://54hmmo3zqtgtsusj.public.blob.vercel-storage.com/avatar/Logo-yEeh50niFEmvdLeI2KrIUGzMc6VuWd-a48mfVnSsnjXMEaIOnYOTWIBFOJiB2.jpg"
            const private_status = "false"
            await client.query('INSERT INTO public.users (email, password, avatar, private_status) VALUES ($1, $2, $3, $4);', [email, hashedPassword, avatar, private_status]);
            const result = await client.query('SELECT id FROM public.users WHERE email = $1;', [email]);
            if(result.rows.length > 0){
              const id_global = result.rows[0].id;
              const values = [email, id_global];
              const refreshToken = await TokenService.generateRefreshToken(values);
              const accessToken = await TokenService.generateAccessToken(refreshToken);
              if (refreshToken) {
                await client.query('UPDATE public.users SET refresh_token = $1 WHERE id = $2;', [refreshToken, id_global]);
              } else {
                console.error('Refresh token is null or undefined.');
              }
              return res.status(200).json({accessToken, userPreferences: { theme: 'dark', language: 'ua' }});
            }
            return res.status(404).json({ message: "Error" });
          }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    } finally {
        await client.end();
    }
});

module.exports = router;