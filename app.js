import express from 'express';
import { createHomepageTemplate, createLoginForm } from './views/index.js';
import createAssetListTemplate from './views/AssetList.js';
import createUserListTemplate from './views/userList.js';
import editAssetHomeTemplate from './views/editAsset.js';
import editUserHomeTemplate from './views/editUser.js';
import createAssetHomeTemplate from './views/assetHome.js';
import createUserHomeTemplate from './views/userHome.js';
import errorHandlingTemplate from './views/errorPage.js';
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
import mysql from 'mysql2'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
// import session from 'express-session';
import bcrypt from 'bcrypt';

// import BOOKS_DATA from './data/data.js';
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()


import {getAllAssets, 
  // getAsset, 
  createAsset, getAssetBySearchIndex, getAllUsers, getUserBySearchIndex} from './database.js'

const app = express();

app.set('views', path.join(process.cwd(), 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

// app.use(session({
//   secret: 'yourSecret',
//   resave: false,
//   saveUninitialized: false
// }));

// app.get('/assets/:assetTag', async (req,res)=>{
//   const {assetTag} = req.params;
//   const asset = await getAsset(assetTag)
//   res.send(createBookTemplate(asset));
// })

app.get('/', (req, res) => {
   res.send(createHomepageTemplate());
});

app.get('/home', (req, res) => {
  res.send(createHomepageTemplate());
});


     function generateAccessToken(user) {
  // return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
}

async function verifyToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    console.warn("No token provided");
    // return res.sendStatus(401);
    return res.send(createLoginForm('Please Login.'));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.sendStatus(403);
  }
}

app.post('/login', async (req, res) => {
  const { userEmail, userPassword } = req.body;


    const [rows] = await pool.query('SELECT * FROM users WHERE userEmail = ? AND userPassword = ?', [userEmail, userPassword]);
    const user = rows;
    const success = rows.length > 0;
     console.log(rows.length)
     
    if(success){

      const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'Strict',
    secure: false, // set to true with HTTPS
  });
        // res.setHeader('HX-Redirect', '/assetHome');
         res.send(createAssetHomeTemplate());
    return res.status(200).end(); // <-- important return
    }
       res.send(createLoginForm('Invalid email or password.'));
});

app.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Strict',
    secure: false, // should match what you used in login
  });
  res.setHeader('HX-Redirect', '/home'); // redirect to login or homepage
  res.status(200).end();
});

// app.get('/home', (req, res) => {
//   // if (!req.session.userEmail) {
//   //   return res.redirect('/');
//   // }
//   // res.render('home', { userEmail: req.session.userEmail });
  
// });

app.get('/assetHome',verifyToken, (req, res) => {
  res.send(createAssetHomeTemplate());
});

app.get('/editAssetForm/:id', async (req, res) => {
  const [result] = await pool.query("select * from assets a LEFT JOIN users u on a.userId = u.userId where a.assetId =?",[req.params.id] )

  res.send(editAssetHomeTemplate(result[0]));
});

app.get('/assets', async (req, res) => {
  const assets = await getAllAssets()
    // const users = await getAllUsers()
  res.send(createAssetListTemplate(assets));
 
});

app.post('/assets/search', async (req, res) => {
  const query = req.body.search.toLowerCase();
  const assets = await getAssetBySearchIndex(query)
  res.send(createAssetListTemplate(assets));
});

app.post('/assets', async (req, res) => {
  
  const {
    assetType,
    assetTag,
    serialNo,
    assetStatus,
    assetBrand,
    assetModel,
    userId
    } = req.body;

  const [result] = await pool.query('SELECT assetTag FROM assets WHERE assetTag LIKE ?', [assetTag]);
         console.log(result.length)
 if (result.length > 0) {
  res.send(errorHandlingTemplate(assetTag));

  }else{
     createAsset({
     assetType,
    assetTag,
    serialNo,
    assetStatus,
    assetBrand,
    assetModel,
    userId
    });
    res.send(createAssetHomeTemplate());
  }
   
   
  // res.redirect('/assets/' + id)

});

app.delete('/asset/:id', async (req, res) => {
const [rows] = await pool.query('delete from assets WHERE assetId = ?',[req.params.id] )
 res.send(createAssetHomeTemplate())
});
// app.get('/assets/:id', (req, res) => {
//   const {id} = req.params;
//   const asset = BOOKS_DATA.find(b => b.id === id);

//   res.send(createBookTemplate(asset));
// });

// app.delete('/assets/:id', (req, res) => {
//   const idx = BOOKS_DATA.findIndex(b => b.id === req.params.id);
//   BOOKS_DATA.splice(idx, 1);

//   res.send();
// });

// app.put('/assets/:id', (req, res) => {
//   const {title, author} = req.body;
//   const {id} = req.params;

//   const newBook = {title, author, id};

//   const idx = BOOKS_DATA.findIndex(b => b.id === id);
//   BOOKS_DATA[idx] = newBook

//   res.send(createBookTemplate(newBook));
// })

app.put('/asset/edit/:id', async (req,res)=>{
  const {assetStatus, assetAssignedTo} = req.body;
  const assetId = req.params.id;
  const [rows] = await pool.query('UPDATE assets SET assetStatus = ?, userId = ? WHERE assetId= ?',[assetStatus,assetAssignedTo,assetId] )
   res.send(createAssetHomeTemplate())
})
// app.get('/assets/edit/:id', (req, res) => {
//   const asset = BOOKS_DATA.find(b => b.id === req.params.id);

//   res.send(createEditFormTemplate(asset));
// });

// app.post('/assets/search', (req, res) => {
//   const text = req.body.search.toLowerCase();
//   const assets = BOOKS_DATA.filter(b => b.title.toLowerCase().includes(text));
//   res.send(createListTemplate(assets));
// });

//users
app.get('/users', async (req, res) => {
  const users = await getAllUsers()
  res.send(createUserListTemplate(users));
});

app.get('/user-list/:id', async (req, res) => {
const defaultUserId = req.params.id;
const [rows] = await pool.query('select userId, userName from users ORDER BY(userId = ?) ASC, userName ASC',[defaultUserId])
 const optionsHtml = rows.map(user => 
    `<option selected="${req.params.id}" value="${user.userId}">${user.userName}</option>`
  ).join('');
  res.send(optionsHtml);
});

app.get('/userHome',verifyToken, async (req, res) => {
  //  const users = await getAllUsers()
    res.send(createUserHomeTemplate());
    
});

app.get('/editUserForm/:id',verifyToken, async (req, res) => {
  const [result] = await pool.query("select * from users where userId =?",[req.params.id] )

  res.send(editUserHomeTemplate(result[0]));
});

app.post('/users/search', async (req, res) => {
  const query = req.body.search.toLowerCase();
  const users = await getUserBySearchIndex(query)
  res.send(createUserListTemplate(users));
});

app.post('/users', async (req, res) => {
  
  const {
    userName,
    userEmail,
    userBu,
    userStatus,
    userType,
    userLocation,
    } = req.body;

  const [result] = await pool.query('SELECT userEmail FROM users WHERE userEmail LIKE ?', [userEmail]);
         console.log("create user query:"+result.length)
 if (result.length > 0) {
  res.send(errorHandlingTemplate(userEmail));

  }else{
   const [result] = await pool.query(
      `INSERT INTO users (
      userName,
      userEmail,
      userBu,
      userStatus,
      userType,
      userLocation
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
      userName,
      userEmail,
      userBu,
      userStatus,
      userType,
      userLocation,
      ]
    );
    res.send(createUserHomeTemplate());
  }
});

app.put('/user/edit/:id', async (req,res)=>{
  const {userName, userBu, userStatus, userLocation} = req.body;
  const userId = req.params.id;
  const [rows] = await pool.query('UPDATE users SET userName =?, userBu = ?, userStatus = ?, userLocation= ? WHERE userId = ?',[userName,userBu,userStatus,userLocation, userId] )
   res.send(createUserHomeTemplate())
})

// listen to port
app.listen(3000, () => {
  console.log('App listening on port 3000');
});