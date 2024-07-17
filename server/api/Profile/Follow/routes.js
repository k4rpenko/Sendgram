const express = require("express");
const pg = require("../../cone");
var cookieParser = require('cookie-parser')

const router = express.Router();

router.use(express.json());
router.use(cookieParser())


router.post('/', async (req, res) => {
    const { nickURL, ProfileNick } =  await req.body; 
    let client;
    try {
        client = await pg.connect();
        const result = await client.query('SELECT id FROM public.users WHERE id_user = $1;', [ProfileNick]);
        const resultURL = await client.query('SELECT id FROM public.users WHERE id_user = $1;', [nickURL]);
        if (result.rows.length > 0) {
            const id = result.rows[0].id;
            const id_URL = resultURL.rows[0].id;
            await client.query('UPDATE public.users SET followers_count =  followers_count + 1, on_subscribe = array_remove(on_subscribe, $2) WHERE id = $1;', [id_URL, id]);
            await client.query('UPDATE public.users SET u_followers_count = u_followers_count + 1, u_subscribe = array_remove(u_subscribe, $2) WHERE id = $1;', [id, id_URL]);
            return res.status(200).json({message: 'You are following' });
        }
        return res.status(404).json({ error: 'User not found' + error.message });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error ' + error.message });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});


module.exports = router;
