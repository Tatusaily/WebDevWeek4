import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  getCatByUserID,
} from '../controllers/user-controller.js';
import multer from 'multer';

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E5);
        const uniquePrefix = (req.body.name).replaceAll(/,|-|_|'/gi, '').toLowerCase();
        let extension = file.originalname.split('.').pop(); // Or mimetype?
        if (extension !== ('jpg' || 'jpeg' || 'png' || 'gif')) {
        extension = 'jpg';
        }
    
        const filename = `${uniquePrefix}-${uniqueSuffix}.${extension}`;
        cb(null, filename);
    },
});

const upload = multer({dest: 'uploads/'});

userRouter.route('/')
    .get(getUser)
    .post(upload.single("file"), postUser);

userRouter.route('/:id')
    .get(getUserById)
    .put(putUser)
    .delete(deleteUser);

userRouter.route('/:id/cats')
    .get(getCatByUserID);

export default userRouter;