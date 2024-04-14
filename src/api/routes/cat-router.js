import express from 'express';
import {createThumbnail} from '../../middlewares.js';
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
import multer from 'multer';

const catRouter = express.Router();

const myStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    console.log("DEBUG:  FILENAME FUNCTION")
    console.log('FILE: ', file)
    const name = file.originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E5);
    console.log('UNIQUESUFFIX: ', uniqueSuffix)
    // take name and remove symbols after last ".".
    const alteredname = file.originalname.split('.')
      .slice(0, -1)
      .join('.')
      .replace(/,|-|_|'/gi, '')
      .toLowerCase();
    console.log('ALTEREDNAME: ', alteredname)
    let extension = file.mimetype.split('/').pop(); // Or mimetype?
    console.log('EXTENSION: ', extension)
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      extension = 'jpg';
    }
    const filename = `${alteredname}-${uniqueSuffix}.${extension}`;
    console.log('FILENAME: ', filename)
    cb(null, filename);
  },
});

const upload = multer({dest: 'uploads/', storage: myStorage});

catRouter.route('/')
  .get(getCat)
  .post(upload.single("filename"), createThumbnail, postCat);

catRouter.route('/:id')
  .get(getCatById)
  .put(putCat)
  .delete(deleteCat);

export default catRouter;