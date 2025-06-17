import { Item } from "../models/item.model";
import { generateId } from "../utils/generate-id";


const items: Map<string, Item> = new Map();

// Create a new item and add it to the store
const create = (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item => {
  // Generate unique ID
  const id = generateId(); 
  // Current timestamp
  const now = new Date();  

  const item: Item = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
// Add item to the Map
  items.set(id, item); 
  return item;
};

// Return all items from the store
const findAll = (): Item[] => {
  return Array.from(items.values());
};

// Find a single item by its ID
const findById = (id: string): Item | undefined => {
  return items.get(id);
};


const findByListId = (listId: string): Item[] => {
  return findAll().filter(item => item.listId === listId);
};


const update = (id: string, data: Partial<Omit<Item, 'id' | 'listId' | 'createdAt'>>): Item | undefined => {
  const item = items.get(id);
  if (!item) return undefined;

  // Create updated item object
  const updatedItem: Item = {
    ...item,
    ...data,
    updatedAt: new Date(),
  };

  items.set(id, updatedItem); 
  return updatedItem;
};

// Delete a single item by its ID
const deleteItem = (id: string): boolean => {
  return items.delete(id);
};

// Delete all items associated with a specific list
const deleteByListId = (listId: string): void => {
  const itemsToDelete = findByListId(listId);
  itemsToDelete.forEach(item => items.delete(item.id));
};


export const itemStore = {
  create,
  findAll,
  findById,
  findByListId,
  update,
  delete: deleteItem,
  deleteByListId,
};