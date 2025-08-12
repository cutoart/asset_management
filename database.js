import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

export async function getAllAssets(req){
const [rows] = await pool.query("select * from assets a LEFT JOIN users u on a.userId = u.userId WHERE a.assetStatus NOT IN ('Disposed') ORDER BY a.updatedAt DESC" )
return rows
}

export async function getAllDisposedAssets(req){
const [rows] = await pool.query("select * from assets a LEFT JOIN users u on a.userId = u.userId WHERE a.assetStatus IN ('Disposed') ORDER BY a.updatedAt DESC" )
return rows
}


export async function createAsset({ 
  assetType,
  assetTag,
  serialNo,
  assetStatus,
  assetBrand,
  assetModel,
  userId
}) {

   
    return { insertId: result.insertId };
}

export async function getAssetBySearchIndex(query) {
  const likeQuery = `%${query}%`; // Add wildcards here
  const [rows] = await pool.query(
    `SELECT * 
     FROM assets a LEFT JOIN users u on a.userId = u.userId
     WHERE (a.assetTag LIKE ? OR a.assetModel LIKE ? OR a.serialNo LIKE ? OR a.assetStatus LIKE ? OR a.assetType LIKE ? OR u.userName LIKE ?)
     AND a.assetStatus NOT IN ('Disposed')
     ORDER BY a.updatedAt DESC`,
    [likeQuery, likeQuery,likeQuery,likeQuery,likeQuery, likeQuery]
  );
  return rows;
}
// USERS MODULE

export async function getAllUsers(){
const [rows] = await pool.query(`
  SELECT u.userId,
  u.userName,
  u.userEmail,
  u.userBu,
  u.userStatus,
  u.userLocation,
  GROUP_CONCAT(a.assetTag SEPARATOR ', ') AS assetTags
FROM users u
LEFT JOIN assets a ON u.userId = a.userId
GROUP BY u.userId
ORDER BY u.updatedAt DESC`)
// console.log(rows[4])
return rows
}


export async function getUserBySearchIndex(query) {
  const likeQuery = `%${query}%`; // Add wildcards here
  const [rows] = await pool.query(
    `SELECT u.userId,
  u.userName,
  u.userEmail,
  u.userBu,
  u.userStatus,
  u.userLocation,
  GROUP_CONCAT(a.assetTag SEPARATOR ', ') AS assetTags
FROM users u LEFT JOIN assets a ON u.userId = a.userId
 WHERE u.userName LIKE ? OR u.userEmail LIKE ? OR u.userBU LIKE ? OR u.userStatus LIKE ? OR u.userLocation LIKE ? 
GROUP BY u.userId ORDER BY u.updatedAt DESC`,
[likeQuery, likeQuery,likeQuery,likeQuery,likeQuery]
  );
  return rows;
}

export async function getAssetLogBySearchIndex(query) {
  const likeQuery = `%${query}%`; // Add wildcards here
  const [rows] = await pool.query(
    `SELECT a.*,
     assignedTo.userName AS assignedToName,
     performedByUser.userName As performedByName,
     assignedFrom.userName AS assignedFromName,
     assignedTo.createdAt AS userCreatedAt
     FROM 
     assetlogs a 
     LEFT JOIN users assignedFrom on a.logAssetAssignFrom = assignedFrom.userId
     LEFT JOIN users assignedTo on a.logAssetUserId = assignedTo.userId
     LEFT JOIN users performedByUser on a.performedBy = performedByUser.userId
     
     WHERE performedByUser.userName LIKE ? OR a.action LIKE ? OR a.logAssetTag LIKE ? OR a.logAssetStatus LIKE ? OR assignedTo.userName LIKE ? OR a.createdAt LIKE ? ORDER BY a.createdAt DESC`,
    [likeQuery, likeQuery,likeQuery,likeQuery,likeQuery,likeQuery]
  );
  return rows;
}

export async function getUserLogBySearchIndex(query) {
  
  const likeQuery = `%${query}%`; // Add wildcards here
  const [rows] = await pool.query(
    `select a.*, u.userName, u.createdAt as userCreatedAt from userlogs a inner join users u on a.performedBy = u.userId
     WHERE u.userName LIKE ? OR a.action LIKE ? OR a.logUserEmail LIKE ? OR a.logUserBu LIKE ? OR a.logUserStatus LIKE ? OR a.logUserLocation LIKE ? OR a.createdAt LIKE ? ORDER BY a.createdAt DESC`,
    [likeQuery, likeQuery,likeQuery,likeQuery,likeQuery,likeQuery,likeQuery]
  );
  return rows;
}

export async function getAllBu() {
  const [bunits] = await pool.query('SELECT bunitId, bunitName FROM bunits');
  return bunits;
}

export async function getAllAmodels() {
  const [amodels] = await pool.query('SELECT * FROM amodels ORDER BY amodelDesc ASC');
  return amodels;
}

export function formatDateTime(dt) {
  const date = new Date(dt);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // force 24-hour format
  });
  return formatter.format(date).replace(',', '');
}

export const shortenEmail = (email) => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const domainParts = domain.split(".");
  const shortDomain = domainParts.slice(0,1).join(".");
  return `${local}@${shortDomain}`;
};

// BOOKS_DATA.filter(b => b.title.toLowerCase().includes(text));