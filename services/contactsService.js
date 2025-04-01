import Contact from "../models/Contact.js";

export function listContacts(query) {
  return Contact.findAll({
    where: query,
  });
}

export async function getContact(query) {
  return Contact.findOne({ where: query });
}

export async function removeContact(contactId) {
  return Contact.destroy({ where: { id: contactId } });
}

export function addContact(contact) {
  return Contact.create({
    ...contact,
  });
}

export async function putContact(query, data) {
  const contact = await getContact(query);

  if (!contact) return null;

  const updatedContact = {
    ...contact,
    ...data,
  };

  return contact.update(updatedContact, { returning: true });
}

export async function updateFavoriteContact(query, favorite) {
  const contact = await getContact(query);

  if (!contact) return null;

  const updatedContact = {
    ...contact,
    favorite,
  };

  return contact.update(updatedContact, { returning: true });
}
