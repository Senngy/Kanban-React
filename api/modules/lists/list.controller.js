import { listService } from './list.service.js';
import { StatusCodes } from 'http-status-codes';

export async function getAll(req, res) {
  try {
    const lists = await listService.getLists(req.query, req.userId);
    res.status(StatusCodes.OK).json(lists);
  } catch (error) {
    throw error;
  }
}

export async function create(req, res) {
  try {
    const list = await listService.createList(req.body, req.userId);
    res.status(StatusCodes.CREATED).json(list);
  } catch (error) {
    throw error;
  }
}

export async function getById(req, res) {
  try {
    const list = await listService.getListDetails(req.params.id, req.userId);
    res.status(StatusCodes.OK).json(list);
  } catch (error) {
    throw error;
  }
}

export async function deleteById(req, res) {
  try {
    await listService.removeList(req.params.id, req.userId);
    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    throw error;
  }
}

export async function update(req, res) {
  try {
    const list = await listService.updateList(req.params.id, req.body, req.userId);
    res.status(StatusCodes.OK).json(list);
  } catch (error) {
    throw error;
  }
}

export async function copy(req, res) {
  try {
    const newList = await listService.copyList(req.params.id, req.userId);
    res.status(StatusCodes.CREATED).json(newList);
  } catch (error) {
    throw error;
  }
}
