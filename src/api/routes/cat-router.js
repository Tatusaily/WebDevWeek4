import express from 'express';
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
import multer from 'multer';

const catRouter = express.Router();

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

catRouter.route('/')
  .get(getCat)
  .post(upload.single("file"), postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(putCat)
  .delete(deleteCat);

export default catRouter;