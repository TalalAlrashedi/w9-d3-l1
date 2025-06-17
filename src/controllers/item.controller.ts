import { Request, Response } from 'express';
import { itemStore } from '../store/item.store';
import { listStore } from '../store/list.store';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

// Create a new item in a specific list
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const { title, description = '', completed = false } = req.body;

    // Validate required title field
    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: 'Title is required',
      });
      return;
    }

    // Check if the list exists
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Create the new item in the store
    const item = itemStore.create({ listId, title, description, completed });

    // Return success response with the created item
    res.status(CREATED).json({
      success: true,
      data: item,
    });
  } catch (error) {
    // Handle any unexpected error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create item',
    });
  }
};

// Get all items belonging to a specific list
export const getListItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;

    // Ensure the list exists
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Fetch all items related to the list
    const items = itemStore.findByListId(listId);

    // Return items
    res.status(OK).json({
      success: true,
      data: items,
    });
  } catch (error) {
    // Handle error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch items',
    });
  }
};

// Get a specific item by ID within a list
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;

    // Check if the list exists
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Find item by ID and validate it's in the same list
    const item = itemStore.findById(id);
    if (!item || item.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    // Return item
    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    // Handle error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch item',
    });
  }
};

// Update an existing item in a list
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;

    // Ensure list exists
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Check if item exists and belongs to the correct list
    const existingItem = itemStore.findById(id);
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    // Update item with new data
    const item = itemStore.update(id, req.body);

    // Return updated item
    res.status(OK).json({
      success: true,
      data: item,
    });
  } catch (error) {
    // Handle error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item',
    });
  }
};

// Delete an item from a list
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId, id } = req.params;

    // Ensure list exists
    const list = listStore.findById(listId);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }


    const existingItem = itemStore.findById(id);
    if (!existingItem || existingItem.listId !== listId) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'Item not found in this list',
      });
      return;
    }

    // Delete the item
    itemStore.delete(id);


    res.status(OK).json({
      success: true,
      data: {},
    });
  } catch (error) {

    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete item',
    });
  }
};