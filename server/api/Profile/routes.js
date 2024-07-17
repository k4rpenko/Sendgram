const express = require("express");
const pg = require("../cone");
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

const router = express.Router();

router.use(express.json());
router.use(cookieParser())


router.post('/', async (req, res) => {
    const { nickURL } =  await req.body; 
    let client;
    try {
        client = await pg.connect();
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
            return res.status(200).json({ NamePort, UserLogo, backgroundimg, Bio, u_subscribe, on_subscribe, u_followers_count, followers_count });
          }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});

router.get('/', async (req, res) => {
    let client;
    try {
        client = await pg.connect();
        const refreshToken = req.cookies['auth_token'];
        if (refreshToken) {
            const jwtres = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const id = jwtres.data[1];
            if (typeof jwtres === 'object' && jwtres !== null) {
                const result = await client.query('SELECT id_user FROM public.users WHERE id = $1;', [id]);
                if(result.rows.length > 0) {
                    const id_user = result.rows[0].id_user;
                    return res.status(200).json({ id_user });
                }
            }
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
