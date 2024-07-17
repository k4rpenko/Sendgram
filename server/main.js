const express = require("express");
require('dotenv').config();
const Home = require('./api/Home/routes');
var cors = require('cors')
const Regists = require('./api/auth/SignUp/routes');
const LookFollow = require('./api/Profile/LookFollow/routes');
const Profile = require('./api/Profile/routes')
const Follow = require('./api/Profile/Follow/routes');
const UnFollow = require('./api/Profile/UnFollow/routes');
const Login = require('./api/auth/Login/routes');
const Settings = require('./api/Settings/ChangeProfile/routes');
const helmet = require('helmet');
const csp = require('helmet-csp');

const app = express();
app.use(helmet());
const PORT = 3001;


app.use(cors({ credentials: true, origin: 'https://sendgram-private.vercel.app' }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());

app.use(
    csp({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://sendgram-private.vercel.app/"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://sendgram-private.vercel.app/"],
        imgSrc: ["'self'", "data:", "https://sendgram-private.vercel.app/"],
        connectSrc: ["'self'", "https://sendgram-private.vercel.app/"],
        fontSrc: ["'self'", "https://sendgram-private.vercel.app/"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"]
      },
    })
);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    next();
});

app.use((req, res, next) => {
    res.removeHeader('Pragma');
    next();
});


app.use(express.json());
app.use("/api/Home", Home);
app.use("/api/Profile", Profile);
app.use("/api/auth/Regists", Regists);
app.use("/api/LookFollow", LookFollow);
app.use("/api/Follow", Follow);
app.use("/api/UnFollow", UnFollow);
app.use("/api/auth/Login", Login);
app.use("/api/Settings", Settings);


app.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
