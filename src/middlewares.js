import sharp from 'sharp';
import jwt from 'jsonwebtoken';

const createThumbnail = (req, res, next) => {
  // Create a thumbnail with sharp
  // See if it is a file at all
  console.log('CREATETHUMBNAIL');

  if (!req.file) {
    console.log('DB: No file :(');
    next();
    return;
  }
  console.log('thumbfile:', req.file);
  const [filename, ext] = req.file.filename.split('.');
  const path = req.file.path;
  console.log('filename:', filename);
  console.log('path:', path);
  console.log('ext:', ext);
  sharp(path)
    .resize(200, 200)
    .toFormat('png')
    .toFile(`uploads/${filename}-thumb.${ext}`)
    .then(next());
};

const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == null) {
    return res.sendStatus(401);
  }
  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send({message: 'invalid token'});
  }
};



export {createThumbnail, authenticateToken};