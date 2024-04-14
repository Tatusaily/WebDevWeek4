// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
   const [rows] = await promisePool.query('SELECT * FROM cats');
   rows.forEach( async (row) => {
      console.log("Getting cat owner")
      let owner = await promisePool.query('SELECT * FROM users where user_id = ?', [row.owner]);
      owner = owner[0][0].name;
      console.log(`${row.cat_name} owner is ${owner}`);
   });
   return rows;
};

const findCatById = async (id) => {
   const [rows] = await promisePool.execute('SELECT * FROM cats WHERE cat_id = ?', [id]);
   if (rows.length === 0) {
      return false;
   }
   const owner = await promisePool.query('SELECT * FROM users where user_id = ?', [rows[0].owner]);
   rows[0].owner = owner[0][0].name;
   console.log('rows', rows);
   return rows[0];
};

const addCat = async (cat, file, user) => {
   if (user.role === 'admin' || user.user_id === cat.owner) {
   const {cat_name, weight, owner,birthdate} = cat;
   const filename = file.filename;
   const sql = `INSERT INTO cats (cat_name, weight, owner, filename, birthdate)
                  VALUES (?, ?, ?, ?, ?)`;   
   const params = [cat_name, weight, owner, filename, birthdate];
   const rows = await promisePool.execute(sql, params);
   if (rows[0].affectedRows === 0) {
      return false;
   }
   return {cat_id: rows[0].insertId};
   } else {
      return {message: 'Unauthorized'};
   }
};

const modifyCat = async (cat, id, user) => {
   // user = userid
   // cat = new incomin cat data
   // auth
   const owner_id = await promisePool.execute(`SELECT owner FROM cats WHERE cat_id = ?`, [id]);
   console.log('owner_id', owner_id);
   if (user.role !== 'admin' && user.user_id !== owner_id){
      return {message: 'Unauthorized'};
   }
   let sql = promisePool.format(`UPDATE cats SET ? WHERE cat_id = ? AND owner = ?`, [cat, id, user.user_id]);
   if (user.role === 'admin') {
      sql = promisePool.format(`UPDATE cats SET ? WHERE cat_id = ?`, [cat, id]);
   }
   const rows = await promisePool.execute(sql);
   // console.log('rows', rows);
   if (rows[0].affectedRows === 0) {
      return false;
   }
   return {message: 'success'};
};

const removeCat = async (id, user) => {
   const owner_id = await promisePool.execute(`SELECT owner FROM cats WHERE cat_id = ?`, [id]);
   console.log('owner_id', owner_id);
   if (user.role !== 'admin' && user.user_id !== owner_id){
      return {message: 'Unauthorized'};
   }
   let sql = promisePool.format('DELETE FROM cats WHERE cat_id = ? AND owner = ?', [id, user.user_id]);
   if (user.role === 'admin') {
      sql = promisePool.format('DELETE FROM cats WHERE cat_id = ?', [id]);
   }
   const rows = await promisePool.execute(sql);
   // console.log('rows', rows);
   if (rows.affectedRows === 0) {
      return false;
   }
   return {message: 'success'};
};

export {listAllCats, findCatById, addCat, modifyCat, removeCat};