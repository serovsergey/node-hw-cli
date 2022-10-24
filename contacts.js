import { promises as fs } from 'fs';
import { resolve } from 'path';
import { nanoid } from 'nanoid';

const contactsPath = resolve('./db/contacts.json');

async function readContacts() {
  const contactsJson = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(contactsJson);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
}

/**
 * Lists the table with contacts
 */
export async function listContacts() {
  try {
    const contacts = await readContacts();
    console.table(contacts);
  } catch (error) {
    console.error(error);
  }
}

/**
 *  Prints specified contact as a table
 * @param {string} contactId Contact Id to retrieve
 * @returns {Object | null} Found contact object if successful, otherwise null
 */
export async function getContactById(contactId) {
  try {
    const contacts = await readContacts();
    const foundContact = contacts.find(({ id }) => id === contactId);
    if (foundContact) {
      console.table(foundContact);
      return foundContact;
    } else {
      console.error(`\x1B[31mContact with Id \x1b[4m${contactId}\x1b[0m\x1B[31m not found!`);
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Removes contact by id
 * @param {string} contactId Contact Id to remove
 * @returns {Boolean} true if successfully removed
 */
export async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const foundContactIndex = contacts.findIndex(({ id }) => id === contactId);
    if (~foundContactIndex) {
      contacts.splice(foundContactIndex, 1);
      await writeContacts(contacts);
      console.log(`\x1b[1mContact with Id \x1b[4m${contactId}\x1b[0m\x1b[1m removed successfully!`);
      return true;
    } else {
      console.error(`\x1B[31mContact with Id \x1b[4m${contactId}\x1b[0m\x1B[31m not found!`);
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Adds new contact in database
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {Object | null} Added contact object, otherwise null
 */
export async function addContact(name, email, phone) {
  try {
    const contacts = await readContacts();
    const newContact = {
      id: nanoid(4), // size reduced for debug
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await writeContacts(contacts);
    console.log(`\x1b[1mContact added successfully:`);
    console.table(newContact);
    return newContact;
  } catch (error) {
    console.error(error);
    return null;
  }
}
