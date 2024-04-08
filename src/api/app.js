import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.get('/api/v1/cats', (req, res) => {
  const cat = {
    cat_id: 1,
    name: 'Fluffy',
    birthdate: '2015-05-20',
    weight: 8.9,
    owner: "John Doe",
    image: "https://loremflickr.com/320/240/cat)"
  };
  res.json(cat);
});

app.use('/public', express.static('public'));

export default app;