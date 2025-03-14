/* eslint-disable no-useless-catch */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { cloneDeep, parseInt } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
const createNew = async (userId, reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    const createdBoard = await boardModel.createNew(userId, newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId.toString())

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getAllBoards = async (userId, page = DEFAULT_PAGE, itemsPerPage = DEFAULT_ITEMS_PER_PAGE, queryFilters) => {
  try {
    const listBoards = await boardModel.getAllBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilters
    )
    return listBoards
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'There is no board with this ID')
    }
    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => {
        return card.columnId.toString() === column._id.toString()
      })
    })
    delete resBoard.cards
    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.oldColumnId, {
      cardOrderIds: reqBody.oldCardOrderIds,
      updatedAt: Date.now()
    })
    await columnModel.update(reqBody.newColumnId, {
      cardOrderIds: reqBody.newCardOrderIds,
      updatedAt: Date.now()
    })
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.newColumnId,
      updatedAt: Date.now()
    })
    return { updateResult: 'Updated successfully!' }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getAllBoards
}