import express from 'express';
import { createHomepageTemplate, createLoginForm } from './views/index.js';
import createAssetListTemplate from './views/AssetList.js';
import createUserListTemplate from './views/userList.js';
import editAssetHomeTemplate from './views/editAsset.js';
import createDisposalListTemplate from './views/disposalHome.js';
import editUserHomeTemplate from './views/editUser.js';
import {createAssetLogHomeTemplate,createAssetLogListTemplate} from './views/assetlogHome.js';
import {createUserLogHomeTemplate,createUserLogListTemplate} from './views/userlogHome.js';
import { createAssetModelHomeTemplate, createAssetModelListTemplate } from './views/amodelHome.js';
import  createBuListTemplate from './views/buHome.js';
import {createAssetHomeTemplate,createAssetFormTemplate} from './views/assetHome.js';
import {createUserHomeTemplate, createUserFormTemplate} from './views/userHome.js';
import errorHandlingTemplate from './views/errorPage.js';
import faqHomeTemplate from './views/faqHome.js';
import {inquiryHomeTemplate,createInquiryListTemplate}  from './views/inquiryHome.js';
import jwt from "jsonwebtoken";
import mysql from 'mysql2'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()


import {getAllAssets,getAllDisposedAssets,getAssetBySearchIndex, getAllUsers, getUserBySearchIndex, getUserLogBySearchIndex,getAssetLogBySearchIndex,getAllBu,getAllAmodels} from './database.js'

const app = express();
app.set('views', path.join(process.cwd(), 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/',(req, res) => {
   res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Strict',
    secure: false, // should match what you used in login
  });
   res.send(createHomepageTemplate());
});

function generateAccessToken(userLoggedIn) {
  // return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      return jwt.sign({ userId: userLoggedIn.userId, userEmail: userLoggedIn.userEmail, userType: userLoggedIn.userType }, process.env.JWT_SECRET, {
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

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE userEmail = ?', [userEmail]);
    const user = rows[0];
    const userName = user.userName;
    if (!user || user.userPassword == null) {
      return res.send(createLoginForm('Invalid email or password.'));
    }
    const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);

    if (!passwordMatch) {
      return res.send(createLoginForm('Invalid email or password.'));
    }

    const accessToken = generateAccessToken(user);
    const amodels = await getAllAmodels();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'Strict',
      secure: false, // set to true in production
    });

    return res.send(`${createAssetHomeTemplate(amodels)}
      <div hx-get="/headerUserName?name=${encodeURIComponent(userName)}" hx-target="#user-name" hx-swap="outerHTML" hx-trigger="load"></div>`);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Server error');
  }
});

app.get('/headerUserName', (req, res) => {
  const { name } = req.query;
  res.send(`<a id="user-name">${name}</a>`);
});
app.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'Strict',
    secure: false, // should match what you used in login
  });
  res.setHeader('HX-Redirect', '/'); // redirect to login or homepage
  res.status(200).end();
});

app.get('/assetHome',verifyToken, async (req, res) => {
  const amodels = await getAllAmodels();
  res.send(createAssetHomeTemplate(amodels));
});

app.get('/dassetHome',verifyToken, async (req, res) => {
  const assets = await getAllDisposedAssets()
  res.send(createDisposalListTemplate(assets));
});


app.get('/editAssetForm/:id', async (req, res) => {
  const [result] = await pool.query("select * from assets a LEFT JOIN users u on a.userId = u.userId where a.assetId =?",[req.params.id] )
const amodels = await getAllAmodels();
  res.send(editAssetHomeTemplate(result[0],amodels));
});

app.get('/assets', async (req, res) => {
  const assets = await getAllAssets()
  res.send(createAssetListTemplate(assets));
 
});

app.post('/assets/search', async (req, res) => {
  const query = req.body.search.toLowerCase();
  const assets = await getAssetBySearchIndex(query)
  res.send(createAssetListTemplate(assets));
});

app.post('/assets', verifyToken, async (req, res) => {
  
  const {
    assetType,
    assetTag,
    serialNo,
    assetStatus,
    assetModel,
    userId
    } = req.body;

  const [result] = await pool.query('SELECT assetTag FROM assets WHERE assetTag LIKE ?', [assetTag]);
         console.log(result.length)
 if (result.length > 0) {
  res.send(errorHandlingTemplate(assetTag));

  }else{
      const assets = await getAllAssets()
    const [result] = await pool.query(
         `INSERT INTO assets (
           assetType,
           assetTag,
           serialNo,
           assetStatus,
           assetModel,
           userId
         ) VALUES (?, ?, ?, ?, ?, ?)`,
         [
           assetType,
           assetTag.trim(),
           serialNo.trim(),
           'Created',
           assetModel,
           userId
         ]
       );
       const [assetCreateLog] = await pool.query('INSERT INTO assetlogs (performedBy,action, logAssetTag, logAssetStatus, logAssetUserId) VALUES(?,?,?,?,?)',[req.user.userId,'Insert',assetTag,'Created',userId])
    res.send(createAssetHomeTemplate(assets));
  }
});

app.delete('/asset/:id', async (req, res) => {
const [rows] = await pool.query('delete from assets WHERE assetId = ?',[req.params.id] )
const amodels = await getAllAmodels();
 res.send(createAssetHomeTemplate(amodels))
});

app.put('/asset/edit/:id', verifyToken, async (req, res) => {
  const { assetTag, assetStatus, logAssetAssignFrom, assetAssignedTo, assetModel, signatureData } = req.body;
  const assetId = req.params.id;
  const amodels = await getAllAmodels();

  let signaturePath = null;

  if (signatureData && signatureData.startsWith('data:image/png;base64,')) {
    const base64Data = signatureData.replace(/^data:image\/png;base64,/, '');
    const fileName = `signature-${assetId}-${Date.now()}.png`;
    const filePath = path.join('public', 'signatures', fileName);
    const absolutePath = path.resolve(filePath);

    try {
      // Ensure the folder exists
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

      // Write the image file
      fs.writeFileSync(absolutePath, base64Data, 'base64');
      signaturePath = `/signatures/${fileName}`; // Public path for front-end
      console.log("Signature saved:", signaturePath);
    } catch (err) {
      console.error("Failed to save signature:", err);
    }
  }

  // Update asset
  await pool.query(
    'UPDATE assets SET assetStatus = ?, userId = ?, assetModel = ? WHERE assetId = ?',
    [assetStatus, assetAssignedTo, assetModel, assetId]
  );

  // Log asset update
  await pool.query(
    `INSERT INTO assetlogs 
     (performedBy, action, logAssetTag, logAssetStatus, logAssetAssignFrom, logAssetUserId, signatureData) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.userId, 'Update', assetTag, assetStatus, logAssetAssignFrom, assetAssignedTo, signaturePath]
  );

  res.send(createAssetHomeTemplate(amodels));
});

//users
app.get('/users', async (req, res) => {
  const users = await getAllUsers()
  res.send(createUserListTemplate(users));
});

app.get('/user-list/:id', async (req, res) => {
const defaultUserId = req.params.id;
const [rows] = await pool.query('select userId, userName from users ORDER BY(userId = ?) DESC, userName ASC',[defaultUserId])
 const optionsHtml = rows.map(user => 
    `<option value="${user.userId}" ${user.userId == defaultUserId ? 'selected':''}>${user.userName}</option>`
  ).join('');
  res.send(optionsHtml);
});

app.get('/userHome', verifyToken, async (req, res) => {
  try {
     const bunits = await getAllBu()
    res.send(createUserHomeTemplate(bunits));
  } catch (error) {
    console.error('Error loading /userHome:', error);
    res.status(500).send('Server error');
  }
});

app.get('/editUserForm/:id',verifyToken, async (req, res) => {
  const [result] = await pool.query("select * from users where userId =?",[req.params.id] )
  const bunits = await getAllBu()
  res.send(editUserHomeTemplate(result[0],bunits,req.user));
});

app.post('/users/search', async (req, res) => {
   const query = req.body.search?.toLowerCase().trim();
  const users = await getUserBySearchIndex(query)
  res.send(createUserListTemplate(users));
});

app.post('/users', verifyToken, async (req, res) => {
  let {
    userName,
    userEmail,
    userEmailDomain,
    userBu,
    userStatus,
    userType,
    userLocation,
  } = req.body;

  userEmail = `${userEmail.trim()}${userEmailDomain.trim()}`;
  
  const [existing] = await pool.query('SELECT userEmail FROM users WHERE userEmail = ?', [userEmail]);

  if (existing.length > 0) {
    return res.send(errorHandlingTemplate(userEmail));
  }
  let hashedPassword = null;
  // const hashedPassword = await bcrypt.hash(userPassword, 10);

  await pool.query(`
    INSERT INTO users (
      userName, userEmail, userPassword, userBu, userStatus, userType, userLocation
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userName.trimStart(), userEmail, hashedPassword, userBu, userStatus, userType || 'Staff', userLocation]
  );

  const [log] = await pool.query(
    'INSERT INTO userLogs (performedBy,action, logUserEmail, logUserBu, logUserStatus, logUserLocation) VALUES(?,?,?,?,?,?)',
    [req.user.userId, 'Insert', userEmail, userBu, userStatus, userLocation]
  );

  const bunits = await getAllBu();
  res.send(createUserHomeTemplate(bunits));
});

app.put('/user/edit/:id',verifyToken, async (req,res)=>{
  const {userEmail, userName, userBu, userStatus, userLocation} = req.body;
  const userId = req.params.id;

  const [rows] = await pool.query('UPDATE users SET userName =?, userBu = ?, userStatus = ?, userLocation= ? WHERE userId = ?',[userName.trimStart(),userBu,userStatus,userLocation, userId] )

   const [userUpdateLog] = await pool.query('INSERT INTO userLogs (performedBy,action, logUserEmail, logUserBu, logUserStatus, logUserLocation) VALUES(?,?,?,?,?,?)',[req.user.userId,'Update',userEmail,userBu,userStatus,userLocation])
   const bunits = await getAllBu()
   res.send(createUserHomeTemplate(bunits))
})

app.put('/user/editPassword/:id',verifyToken, async (req,res)=>{
  const {userPassword} = req.body;
  console.log(userPassword)
  const saltRounds = 15;
  const userId = req.params.id;
  const hash = await bcrypt.hash(userPassword, saltRounds);
  await pool.query('UPDATE users SET userPassword =? WHERE userId = ?',[hash, userId])
  const bunits = await getAllBu()
   res.send(createUserHomeTemplate(bunits))
})

app.delete('/user/:id', async (req, res) => {
const [rows] = await pool.query('delete from users WHERE userId = ?',[req.params.id] )
 const bunits = await getAllBu()
 res.send(createUserHomeTemplate(bunits))
});

// Log
app.get('/userlogHome',verifyToken, async (req, res) => {
  const [rows] = await pool.query("select a.*, u.userName, u.createdAt AS userCreatedAt from userLogs a LEFT JOIN users u on a.performedBy = u.userId ORDER BY a.createdAt DESC" )
  res.send(createUserLogHomeTemplate(rows));
});

app.get('/assetlogHome',verifyToken, async (req, res) => {
  const [rows] = await pool.query(`select a.*,
    performedByUser.userName AS performedByName,
    assignedTo.userName AS assignedToName,
    assignedFrom.userName AS assignedFromName
    from assetlogs a 
    LEFT JOIN users performedByUser on a.performedBy = performedByUser.userId 
    LEFT JOIN users assignedTo on a.logAssetUserId = assignedTo.userId
    LEFT JOIN users assignedFrom on a.logAssetAssignFrom = assignedFrom.userId
    ORDER BY a.createdAt DESC`)
  res.send(createAssetLogHomeTemplate(rows));
});

//printAssetLog
app.get('/printAssetLog/:id', verifyToken, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT a.*,
      performedByUser.userName AS performedByName,
      assignedTo.userName AS assignedToName,
      assignedFrom.userName AS assignedFromName
    FROM assetlogs a 
    LEFT JOIN users performedByUser ON a.performedBy = performedByUser.userId 
    LEFT JOIN users assignedTo ON a.logAssetUserId = assignedTo.userId
    LEFT JOIN users assignedFrom ON a.logAssetAssignFrom = assignedFrom.userId
    WHERE a.assetLogId = ?
  `, [req.params.id]);

  const data = rows[0];

  if (!data) return res.send('<p>Asset log not found</p>');

  const signatureImage = data.signatureData ? data.signatureData : '/signatures/NoSignature.png';

  const html = `
    <div class="print-preview">
      <h2>Asset Log Print Preview</h2>
      <p><strong>Performed By:</strong> ${data.performedByName || ''}</p>
      <p><strong>Assigned From:</strong> ${data.assignedFromName || ''}</p>
      <p><strong>Assigned To:</strong> ${data.assignedToName || ''}</p>
      <p><strong>Action:</strong> ${data.action || ''}</p>
      <p><strong>Assets Tag:</strong> ${data.logAssetTag || ''}</p>
      <p><strong>Date:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
      <div>
        <h4>Signed By:</h4>
        <p><strong>${data.assignedToName || ''}</strong></p>
        <img src="${signatureImage}" alt="Signature" style="max-width:300px; border:1px solid #ccc;">
      </div>
      <br>
      <button onclick="window.print()">Print</button>
      <button hx-get="/assetlogHome" hx-target='.main'>Close</button>
    </div>
  `;

  res.send(html);
});

app.post('/userlog/search', async (req, res) => {
  const query = req.body.search?.toLowerCase().trim();
  const userlogs = await getUserLogBySearchIndex(query)
  res.send(createUserLogListTemplate(userlogs));
});

app.post('/assetlog/search', async (req, res) => {
  const query = req.body.search?.toLowerCase().trim();
  const assetlogs = await getAssetLogBySearchIndex(query)
  res.send(createAssetLogListTemplate(assetlogs));
});


//Business Unit / bunit
app.get('/bunitHome',verifyToken, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM bunits ORDER BY bunitDesc ASC '); 
  res.send(createBuListTemplate(rows));
});

//Asset Model / amodel
app.get('/amodelHome',verifyToken, async (req, res) => {
  const [amodels] = await pool.query('SELECT * FROM amodels ORDER BY amodelDesc ASC '); 
  res.send(createAssetModelHomeTemplate(amodels));
});

app.post('/amodels',verifyToken, async (req, res) => {
  
  let {amodelName, amodelDesc} = req.body;
  
   await pool.query(`INSERT INTO amodels ( amodelName, amodelDesc) VALUES (?,?)`, [amodelName,amodelDesc]);
     const amodels = await getAllAmodels();
    res.send(createAssetModelListTemplate(amodels));
  
});

app.get('/faqHome', async (req, res) => {
    res.send(faqHomeTemplate());
});

app.get('/inquiry',verifyToken, async (req, res) => {
    const [inquiries] =await pool.query('SELECT userName, inquiryType, inquiryDesc FROM inquiries i inner join users u where i.inquiryBy = u.userId ORDER BY i.createdAt DESC'); 
    res.send(inquiryHomeTemplate(inquiries));
});

app.post('/inquiry',verifyToken, async (req, res) => {
 let inquiryBy = req.user.userId;
let {inquiryType, inquiryDesc} = req.body;

   await pool.query(`INSERT INTO inquiries (inquiryBy,inquiryType, inquiryDesc) VALUES (?,?,?)`, [inquiryBy,inquiryType,inquiryDesc]);
     const [inquiries] =await pool.query('SELECT userName,inquiryType, inquiryDesc FROM inquiries i inner join users u where i.inquiryBy = u.userId ORDER BY i.createdAt DESC ');
    res.send(createInquiryListTemplate(inquiries));
});

// listen to port

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Allow all interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});