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

  console.log('invitation data in model: ', newInvitation)

  const createdInvitation = await getDb().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitation)
  return createdInvitation
}

const findOneById = async (invitationId) => {
  const result = await getDb().collection(INVITATION_COLLECTION_NAME).findOne({ _id: invitationId })
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
    { _id: invitationId },
    { $set: updateData },
    { returnDocument: 'after' }
  )
  return result
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  update
}