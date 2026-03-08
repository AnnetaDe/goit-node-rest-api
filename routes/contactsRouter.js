import express from 'express';
import {add, getAll, getById, remove, update} from '../controllers/contactsControllers.js';
import {validateBody} from '../helpers/validateBody.js';
import {createContactSchema, updateContactSchema} from '../schemas/contactsSchemas.js';


const contactsRouter = express.Router();

contactsRouter.get('/', getAll);

contactsRouter.get('/:id', getById);

contactsRouter.delete('/:id', remove);

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  add
);


contactsRouter.patch(
  '/:id',
  validateBody(updateContactSchema),
  update
);

export default contactsRouter;
