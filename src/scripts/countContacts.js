import * as fs from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';

export const countContacts = async () => {
  const contacts = JSON.parse(await fs.readFile(PATH_DB, 'utf-8'));
  return contacts.length;
};

console.log(await countContacts());
