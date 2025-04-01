import {
  listContacts,
  getContact,
  removeContact,
  addContact,
  putContact,
  updateFavoriteContact,
} from "../services/contactsService.js";

import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const { id: owner } = req.user;
  const contacts = await listContacts({ owner });

  res.json({ status: "success", code: 200, data: { contacts } });
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;

  const contact = await getContact({ id, owner });

  if (!contact) {
    throw HttpError(404, "Not found");
  }

  res.json({ status: "success", code: 200, data: { contact } });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await getContact({ id, owner });

  if (contact) {
    await removeContact(id);

    res.json({ status: "success", code: 200, data: { contact } });
  } else {
    throw HttpError(404, "Not found");
  }
};

export const createContact = async (req, res) => {
  const { id: owner } = req.user;
  const contact = await addContact({ ...req.body, owner });

  res.status(201).json({
    status: "success",
    code: 201,
    data: { contact },
  });
};

export const updateContact = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name && !email && !phone) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await putContact({ id, owner }, req.body);

  if (contact) {
    res.json({ status: "success", code: 200, data: { contact } });
  } else {
    throw HttpError(404, "Not found");
  }
};

export const updateStatusContact = async (req, res) => {
  const { favorite } = req.body;
  const { id } = req.params;
  const { id: owner } = req.user;
  const contact = await updateFavoriteContact({ id, owner }, favorite);

  if (contact) {
    res.json({ status: "success", code: 200, data: { contact } });
  } else {
    throw HttpError(404, "Not found");
  }
};
