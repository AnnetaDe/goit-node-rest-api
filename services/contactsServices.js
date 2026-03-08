import {Contact} from '../models/contact.js';

export const listContacts = async () => {
  return await Contact.findAll();
};


export const getContactById = async (contactId) => {
  return (await Contact.findByPk(contactId)) || null;
};

export const removeContact = async (id) => {
  const contact = await Contact.findByPk(id);
  if (!contact) return null;

  await Contact.destroy({where: {id}});
  return contact;
};

export const addContact = async (data) => {
  return await Contact.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    favorite: data.favorite || false,
    owner: data.owner || 1,
  });
};

export const updateContact = async (id, data) => {
  const [affectedCount] = await Contact.update(data, {
    where: {id},
  });

  if (affectedCount === 0) return null;

  return await Contact.findByPk(id);
};
