import { pipeline } from "nodemailer/lib/xoauth2"
import { userModel } from "./userModel"
import { boardModel } from "./boardModel"

const Joi = require("joi")
const { ObjectId } = require("mongodb")
const { getDb } = require("~/config/mongodb")
const { INVITATION_TYPES, BOARD_INVITATION_STATUS } = require("~/utils/constants")
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require("~/utils/validators")

const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  invitorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required().valid(...Object.values(INVITATION_TYPES)),

  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid(...Object.values(BOARD_INVITATION_STATUS)),
  }),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'invitorId', 'inviteeId', 'type', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNewBoardInvitation = async (data) => {
  const validData = await validateBeforeCreate(data)
  let newInvitation = {
    ...validData,
    invitorId: new ObjectId(validData.invitorId),
    inviteeId: new ObjectId(validData.inviteeId)
  }

  if (validData.boardInvitation) {
    newInvitation.boardInvitation = {
      ...validData.boardInvitation,
      boardId: new ObjectId(validData.boardInvitation.boardId)
    }
  }

  const createdInvitation = await getDb().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitation)
  return createdInvitation
}

const findOneById = async (invitationId) => {
  const result = await getDb().collection(INVITATION_COLLECTION_NAME).findOne({ _id: new ObjectId(invitationId) })
  return result
}

const update = async (invitationId, updateData) => {
  Object.keys(updateData).forEach(key => {
    if (INVALID_UPDATE_FIELDS.includes(key)) {
      delete updateData[key]
    }
  })

  if (updateData.boardInvitation) {
    updateData.boardInvitation = {
      ...updateData.boardInvitation,
      boardId: new ObjectId(updateData.boardInvitation.boardId)
    }
  }

  const result = await getDb().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(invitationId) },
    { $set: updateData },
    { returnDocument: 'after' }
  )
  return result
}

const findByUser = async (userId) => {
  const queryConditions = [
    { inviteeId: new ObjectId(userId) },
    { _destroy: false }
  ]

  const results = await getDb().collection(INVITATION_COLLECTION_NAME).aggregate([
    { $match: { $and: queryConditions } },
    {
      $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'invitorId',
        foreignField: '_id',
        as: 'invitor',
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      }
    },
    {
      $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'inviteeId',
        foreignField: '_id',
        as: 'invitee',
        pipeline: [{ $project: { 'password': 0, 'verifyToken': 0 } }]
      }
    },
    {
      $lookup: {
        from: boardModel.BOARD_COLLECTION_NAME,
        localField: 'boardInvitation.boardId',
        foreignField: '_id',
        as: 'board'
      }
    },
  ]).toArray()

  return results
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  findByUser,
  update
}