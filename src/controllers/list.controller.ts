import { Request, Response } from 'express';
import { listStore } from '../store/list.store';
import { itemStore } from '../store/item.store';
import { OK, CREATED, BAD_REQUEST, NOT_FOUND } from '../utils/http-status';

// Create a new list
export const createList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description = '' } = req.body;

    // Validate that title is provided
    if (!title) {
      res.status(BAD_REQUEST).json({
        success: false,
        error: 'Title is required',
      });
      return;
    }

    // Create the new list
    const list = listStore.create({ title, description });

    // Respond with the created list
    res.status(CREATED).json({
      success: true,
      data: list,
    });
  } catch (error) {

    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create list',
    });
  }
};


export const getLists = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get all lists from the store
    const lists = listStore.findAll();

    // Respond with the list data
    res.status(OK).json({
      success: true,
      data: lists,
    });
  } catch (error) {

    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch lists',
    });
  }
};


export const getList = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find list by ID
    const list = listStore.findById(req.params.id);
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }


    const items = itemStore.findByListId(list.id);

    // Respond with the list and its items
    res.status(OK).json({
      success: true,
      data: {
        ...list,
        items,
      },
    });
  } catch (error) {
    // Handle fetch error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch list',
    });
  }
};

// Update an existing list by ID
export const updateList = async (req: Request, res: Response): Promise<void> => {
  try {

    const list = listStore.update(req.params.id, req.body);

    // If not found, return error
    if (!list) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // Respond with updated list
    res.status(OK).json({
      success: true,
      data: list,
    });
  } catch (error) {
    // Handle update error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update list',
    });
  }
};

// Delete a list and its associated items
export const deleteList = async (req: Request, res: Response): Promise<void> => {
  try {

    const deleted = listStore.delete(req.params.id);
    if (!deleted) {
      res.status(NOT_FOUND).json({
        success: false,
        error: 'List not found',
      });
      return;
    }

    // If list deleted successfully, delete all its items
    itemStore.deleteByListId(req.params.id);

    // Return success with empty data
    res.status(OK).json({
      success: true,
      data: {},
    });
  } catch (error) {
    // Handle delete error
    res.status(BAD_REQUEST).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete list',
    });
  }
};