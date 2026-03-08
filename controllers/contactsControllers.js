import {ctrl} from '../helpers/ctrl.js';
import * as contactsService from '../services/contactsServices.js';
import {HttpError} from '../helpers/HttpError.js';

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({ message: "Contact deleted" });
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.json(result);
};

export const getAll = ctrl(getAllContacts);
export const getById = ctrl(getOneContact);
export const remove = ctrl(deleteContact);
export const add = ctrl(createContact);
export const update = ctrl(updateContact);
