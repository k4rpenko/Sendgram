const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const pg = require("../../cone");
const TokenService =  require("../tokenService");
const { sha256 } = require('js-sha256');

router.use(express.json());
router.use(cookieParser());

router.get('/', async (req, res) => {
    try {
        const accessToken = req.cookies['auth_token'];
        if (accessToken) {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            const jwtres = jwt.verify(one.data, process.env.JWT_SECRET);
            const currentTime = Math.floor(Date.now() / 1000);
            const id = jwtres.data[1];
            if(decodedToken.exp < currentTime){
                const accessToken = await TokenService.generateAccessToken(decodedToken.data);
                return res.status(200).json({ id, accessToken });
            }
            else if (typeof decodedToken === 'object' && decodedToken !== null) {
                return res.status(200).json({ id });
            }
        }
        return res.status(400).json({ error: 'None coockie' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    }
});


router.post('/', async (req, res) => {
    const { email, password } =  await req.body;
    let client;
    try {
        client = await pg.connect();
        const result = await client.query('SELECT id, id_user, email, password, name FROM public.users WHERE email = $1;', [email]);
        if (result.rows.length > 0) {
            const dbPassword = result.rows[0].password;
            const passwordMatch = sha256(password)
            if (dbPassword != passwordMatch) {
              return res.status(401).json({ message: "Error" });
            }
            const id_global = result.rows[0].id;
            const refreshresult = await client.query('SELECT * FROM public.token_refresh WHERE user_id = $1;', [id_global]);
            const refreshToken = refreshresult.rows[0].token;    
            return res.status(200).json({ refreshToken, userPreferences: { theme: 'dark', language: 'ua' } });
        } 
        else if(result.rows.length < 0){
          return res.status(405).json({ status: 404 });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});

module.exports = router;