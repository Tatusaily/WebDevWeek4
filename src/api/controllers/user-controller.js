import { addUser, findUserById, listAllUsers } from "../models/user-model";

const getUser = async (req, res) => {
  res.json(await listAllUsers());
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  const result = await addUser(req.body);
  if (result.user_id) {
    res.status(201);
    res.json({ message: "New user added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  // PLACEHOLDER
  // DOES NOT WORK
  res.sendStatus(200);
  res.json({ message: "User item updated.", result });
}

const deleteUser = async (req, res) => {
  // PLACEHOLDER
  // DOES NOT WORK
  res.sendStatus(200);
    res.json({ message: "User item deleted.", result });
}

export { getUser, getUserById, postUser, putUser, deleteUser };