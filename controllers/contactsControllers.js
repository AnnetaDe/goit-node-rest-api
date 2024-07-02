const contacts = require('../services/contactsServices');
const ctrl = require('../helpers/ctrl.js');
const HttpError = require('../helpers/HttpError.js');

const getAllContacts = async (req, res) => {
  const result = await contacts.listContacts();
  res.json(result);
  console.log('result', result);
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
  res.json({
    status: 'success',
    code: 201,
    data: { result },
  });
};
const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contacts.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
  console.log('result', result);
};

module.exports = {
  createContact: ctrl(createContact),
  deleteContact: ctrl(deleteContact),
  getAllContacts: ctrl(getAllContacts),
  getOneContact: ctrl(getOneContact),
  updateContact: ctrl(updateContact),
};
