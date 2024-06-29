const contacts = require('../services/contactsServices');
const ctrl = require('../helpers/ctrl');
const HttpError = require('../helpers/HttpError');

const getAllContacts = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
};
const getOneContact = async (req, res) => {
  console.log(req);
  const { id } = req.params;
  console.log(id);
  const result = await contacts.getContactById(id);
  if (!result) {
    throw HttpError(404, 'not found');
  }
  res.json(result);
};
const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.removeContact(id);
};
const createContact = async (req, res) => {
  console.log('reqbodu', req.body);
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};
const updateContact = async (req, res) => {
  const result = await contacts.updateContact(req.body);
  res.status(201).json(result);
};

module.exports = {
  createContact: ctrl(createContact),
  deleteContact: ctrl(deleteContact),
  getAllContacts: ctrl(getAllContacts),
  getOneContact: ctrl(getOneContact),
  updateContact: ctrl(updateContact),
};
