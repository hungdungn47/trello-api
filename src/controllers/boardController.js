/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getAllBoards = async (req, res, next) => {
  try {
    const listBoards = await boardService.getAllBoards()
    res.status(StatusCodes.OK).json(listBoards)
  } catch (error) {
    next(error)
  }
} 

const getDetails = async (req, res, next) => {
  try {
    const board = await boardService.getDetails(req.params.id)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updateBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getAllBoards
}