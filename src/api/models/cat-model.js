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

const addCat = async (cat, file) => {
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
};

const modifyCat = async (cat, id) => {
   const sql = promisePool.format(`UPDATE cats SET ? WHERE cat_id = ?`, [cat, id]);
   const rows = await promisePool.execute(sql);
   console.log('rows', rows);
   if (rows[0].affectedRows === 0) {
      return false;
   }
   return {message: 'success'};
};

const removeCat = async (id) => {
   const [rows] = await promisePool.execute('DELETE FROM cats WHERE cat_id = ?', [id]);
   console.log('rows', rows);
   if (rows.affectedRows === 0) {
      return false;
   }
   return {message: 'success'};
};

export {listAllCats, findCatById, addCat, modifyCat, removeCat};