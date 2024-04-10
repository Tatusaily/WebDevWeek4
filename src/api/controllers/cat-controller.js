import {addCat, findCatById, listAllCats} from "../models/cat-model.js";

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  console.log("REQ BODY: "); console.log(req.body);
  console.log("REQ FILE: "); console.log(req.file);
  const result = addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  res.sendStatus(200);
  res.json({message: 'Cat item updated.', result});
};

const deleteCat = (req, res) => {
  res.sendStatus(200);
  res.json({message: 'Cat item deleted.', result});
};

export {getCat, getCatById, postCat, putCat, deleteCat};