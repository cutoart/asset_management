import dotenv from 'dotenv'
import mysql from 'mysql2'
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

// export async function getAsset(assetTag) {
//     const [rows] = await pool.query(`
//     SELECT * 
//     FROM assets
//     WHERE assetTag = ?
//     `,[assetTag])
//     return rows[0]
//   }
  
//   const note = await getNote(3)
//   console.log(note)

export async function getAllAssets(){
const [rows] = await pool.query("select * from assets a LEFT JOIN users u on a.userId = u.userId ORDER BY a.createdAt DESC" )
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

    const [result] = await pool.query(
      `INSERT INTO assets (
        assetType,
        assetTag,
        serialNo,
        assetStatus,
        assetBrand,
        assetModel,
        userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        assetType,
        assetTag,
        serialNo,
        assetStatus,
        assetBrand,
        assetModel,
        userId
      ]
    );
    return { insertId: result.insertId };
}

export async function getAssetBySearchIndex(query) {
  const likeQuery = `%${query}%`; // Add wildcards here
  const [rows] = await pool.query(
    `SELECT * 
     FROM assets a LEFT JOIN users u on a.userId = u.userId
     WHERE a.assetTag LIKE ? OR a.assetModel LIKE ? OR a.serialNo LIKE ? OR a.assetBrand LIKE ? OR a.assetStatus LIKE ? OR a.assetType LIKE ? OR u.userName LIKE ? ORDER BY a.createdAt DESC` ,
    [likeQuery, likeQuery,likeQuery, ,likeQuery,likeQuery, likeQuery, likeQuery]
  );
  return rows;
}
// USERS MODULE

export async function getAllUsers(){
const [rows] = await pool.query("select * from users ORDER BY createdAt DESC")
// console.log(rows[4])
return rows
}


export async function getUserBySearchIndex(query) {
  const likeQuery = `%${query}%`; // Add wildcards here
  const [rows] = await pool.query(
    `SELECT * 
     FROM users
     WHERE userName LIKE ? OR userEmail LIKE ? OR userBU LIKE ? OR userStatus LIKE ? OR userLocation LIKE ?`,
    [likeQuery, likeQuery,likeQuery, ,likeQuery,likeQuery]
  );
  return rows;
}

// BOOKS_DATA.filter(b => b.title.toLowerCase().includes(text));