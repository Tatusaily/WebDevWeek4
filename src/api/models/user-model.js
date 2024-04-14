import promisePool from "../../utils/database.js";
import bcrypt from 'bcrypt';

const listAllUsers = async () => {
    const [rows] = await promisePool.query('SELECT * FROM users');
    console.log('rows', rows);
    return rows;
};

const authenticateUser = async (data) => {
    console.log('Authenticating:')
    const {username, password} = data;
    const user = await findUserByUsername(username);
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return false;
    }
    return user;
};

const findUserByUsername = async (username) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await promisePool.execute(sql, [username]);
    if (rows.length === 0) {
        console.log('User not found');
        return false;
    }
    return rows[0];
};

const findUserById = async (id) => {
    const [rows] = await promisePool.execute('SELECT * FROM users WHERE user_id = ?', [id]);
    console.log('rows', rows);
    if (rows.length === 0) {
        return false;
    }
    return rows[0];
};

const addUser = async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
    const {name, username, email, role, password} = user;
    const sql = `INSERT INTO users (name, username, email, role, password)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [name, username, email, role, password];
    const rows = await promisePool.execute(sql, params);
    console.log('rows', rows);
    if (rows[0].affectedRows === 0) {
        return false;
    }
    return {user_id: rows[0].insertId};
};

const modifyUser = async (user, id, authuser) => {
    // Only admin can modify other users
    if (authuser.role !== 'admin' && authuser.user_id !== id) {
        return {message: 'Unauthorized'};
    }
    const sql = promisePool.format(`UPDATE users SET ? WHERE user_id = ? AND user_id = =`, [user, id, authuser.user_id]);
    const rows = await promisePool.execute(sql);
    console.log('rows', rows);
    if (rows[0].affectedRows === 0) {
        return false;
    }
    return {message: 'success'};
}

const removeUser = async (id, authuser) => {
    const connection = await promisePool.getConnection();
    if (authuser.role !== 'admin' && authuser.user_id !== id) {
        return {message: 'Unauthorized'};
    }
    try{
        // Remove user's cats before removing the user
        await connection.beginTransaction();
        await connection.execute('DELETE FROM cats WHERE owner = ?', [id]);
        const sql = connection.format('DELETE FROM users WHERE user_id = ?', [id]);
        const [rows] = await connection.execute(sql);
        console.log('rows', rows);
        if (rows.affectedRows === 0) {
            return {message: 'User not found'};
        }
        await connection.commit();
        return {message: 'success'};

    } catch (e) {
        await connection.rollback();
        console.error('ROLLBACK', e.message);
        return false;
        
    } finally {
        connection.release();
    }
}

const findCatsByUserID = async (id) => {
    const [rows] = await promisePool.execute('SELECT * FROM cats WHERE owner = ?', [id]);
    console.log('rows', rows);
    return rows;
};

export {listAllUsers, findUserById, addUser, modifyUser, removeUser, findCatsByUserID, authenticateUser};
