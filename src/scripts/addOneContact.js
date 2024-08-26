import * as fs from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';
import { getAllContacts } from '../scripts/getAllContacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';

export const addOneContact = async () => {
  const contacts = await getAllContacts();
  const newContact = createFakeContact();
  contacts.push(newContact);
  await fs.writeFile(PATH_DB, JSON.stringify(contacts, null, 2));
};

addOneContact();
