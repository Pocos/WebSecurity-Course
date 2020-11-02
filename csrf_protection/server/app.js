const express = require('express');
const path = require('path');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const csurf = require('csurf');

const app = express();
const user = { name: 'John', money: '4000' };

const HMAC_KEY = '0NVASTRKC5M6BP8ZQI52';


const isAuth = (req, res, next) => {
  console.log(req.cookies);
  if (!req.cookies.authorization) {
    res.status(401).end();
  } else {
    let decoded_jwt;
    try {
      decoded_jwt = jwt.verify(req.cookies.authorization, HMAC_KEY);
    } catch (err) {
      res.status(401).end();
    }
    //Checks passed. Go to next filter and attach decoded jwt
    req.headers.decoded_jwt = JSON.stringify(decoded_jwt);
    next();
  }
};

// Add all common middlewares
app.use(express.json());
app.use(cookieparser());
app.use(csurf({ cookie: true }));

app.use(express.urlencoded({ extended: false }));


// Routes
app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken(), { secure: false, httpOnly: false });
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.post('/auth/login', async (req, res) => {
  try {
    const token = jwt.sign(user, HMAC_KEY, { expiresIn: '3h' });;
    if (token) {
      const options = {
        maxAge: 1000 * 240 * 15, // would expire after 15 minutes
        httpOnly: false, // The cookie only accessible by the web server
        signed: false, // Indicates if the cookie should be signed
      };
      res.cookie('authorization', token, options).end();
    } else {
      res.status(401).end();
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
});

app.get('/money', isAuth, async (req, res, next) => {
  res.send(user.money);
});

app.post('/money', isAuth, async (req, res, next) => {
  user.money = req.body.money;
  res.end();
});

app.listen(3000, () => {
  console.log(`listening on port 3000...`);
});