import {authenticateUser} from '../models/user-model.js'; 
const login = async (req, res) => {
    const user = await authenticateUser(req.body);
    if (user) {
        res.json(user);
    } else {
        res.sendStatus(401);
    }
};

export {login};