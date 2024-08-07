const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');
const schema = require('../schemas/contactsSchemas');

const contactsPath = path.join('db/contacts.json');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8');
  // console.log(data);
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  console.log('id', contactId);
  const result = contacts.find(contact => contact.id === contactId);
  console.log('byid', result);
  return result || null;
};

const removeContact = async id => {
  const contacts = await listContacts();

  const index = await contacts.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async data => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name: data.name,
    email: data.email,
    phone: data.phone,
  };
  console.log(newContact);
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};
const updateContact = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  console.log('update', contacts[index]);

  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
