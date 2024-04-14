import sharp from 'sharp';

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

export default createThumbnail;