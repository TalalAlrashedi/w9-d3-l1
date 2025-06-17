import { List } from "../models/list.model";
import { generateId } from "../utils/generate-id";

// In-memory store for lists using a Map (key = list ID)
const lists: Map<string, List> = new Map();

// Create a new list and add it to the store
const create = (data: Omit<List, 'id' | 'createdAt' | 'updatedAt'>): List => {
  const id = generateId();     
  const now = new Date();      
  const list: List = {
    id,
    ...data,                   
    createdAt: now,
    updatedAt: now,
  };
   // Store the list in the Map
  lists.set(id, list);       
  return list;
};

// Retrieve all lists from the store
const findAll = (): List[] => {
  return Array.from(lists.values());
};

// Find a specific list by its ID
const findById = (id: string): List | undefined => {
  return lists.get(id);
};

// Update a list with new data title
const update = (id: string, data: Partial<Omit<List, 'id' | 'createdAt'>>): List | undefined => {
  const list = lists.get(id);
  if (!list) return undefined;

  // Create updated list object
  const updatedList: List = {
    ...list,
    ...data,
    updatedAt: new Date(),
  };

  lists.set(id, updatedList);   
};

// Delete a list by its ID
const deleteList = (id: string): boolean => {
  return lists.delete(id);
};

// Export all list-related operations as listStore
export const listStore = {
  create,
  findAll,
  findById,
  update,
  delete: deleteList,
};