const express = require("express");
const pg = require("../../cone");
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(express.json());
router.use(cookieParser())


router.post('/', async (req, res) => {
    const { nickURL } =  await req.body; 
    let client;
    try {
        client = await pg.connect();
        const refreshToken = req.cookies['auth_token'];
        if (refreshToken) {
            const one = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const jwtres = jwt.verify(one.data, process.env.JWT_SECRET);
            if (typeof jwtres === 'object' && jwtres !== null) {
                const id = jwtres.data[1];
                const result = await client.query('SELECT u_subscribe FROM public.users WHERE id = $1;', [id]);
                const u_subscribe = result.rows[0].u_subscribe;
        
                const resultURL = await client.query('SELECT id FROM public.users WHERE id_user = $1;', [nickURL]);
                const id_url = resultURL.rows[0].id;
                if (u_subscribe.includes(String(id_url))) {
                  return res.status(200).json({ message: 'You are already subscribed' });
                } else if(!u_subscribe.includes(String(id_url))){
                  return res.status(401).json({ message: 'You are NOT subscribed' });
                }
            }
        }
        return res.status(401).json({ message: 'JWT token not provided' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});


module.exports = router;
