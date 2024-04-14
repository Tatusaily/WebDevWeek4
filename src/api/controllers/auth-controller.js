import {authenticateUser} from '../models/user-model.js'; 
import jwt from 'jsonwebtoken';


const login = async (req, res) => {
    const user = await authenticateUser(req.body);
    if (!user) {
        res.sendStatus(401);
        return;
    }
    const userForToken = {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
    };
    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.json({user: userForToken, token: token});
};

const getMe = async (req, res) => {
    console.log('getMe', res.locals.user);
    if ( res.locals.user) {
      res.json({message: 'token ok', user:  res.locals.user});
    } else {
      res.sendStatus(401);
    }
  };

export {login, getMe};