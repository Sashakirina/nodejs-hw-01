import * as fs from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';
import { getAllContacts } from '../scripts/getAllContacts.js';

const generateContacts = async (number) => {
  const contacts = await getAllContacts();
  const newContactsList = Array(number).fill(0).map(createFakeContact);
  contacts.push(...newContactsList);
  await fs.writeFile(PATH_DB, JSON.stringify(contacts, null, 2));
};

generateContacts(5);
