import {addCat, findCatById, listAllCats} from "../models/cat-model.js";

const getCat = async (req, res) => {
  res.json(await listAllCats());
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  const result = await addCat(req.body, req.file, res.locals.user);
  if (result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const result = await modifyCat(req.body, req.params.id, res.locals.user);

  res.sendStatus(200);
  res.json({message: 'Cat item updated.', result});
};

const deleteCat = async (req, res) => {
  const result = await removeCat(req.params.id, res.locals.user);

  res.sendStatus(200);
  res.json({message: 'Cat item deleted.', result});
};

export {getCat, getCatById, postCat, putCat, deleteCat};