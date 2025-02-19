const Joi = require("joi")
const { getDb } = require("~/config/mongodb")
import { ObjectId } from "mongodb"
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "~/utils/validators"

const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN).default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELD = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const createdUser = await getDb().collection(USER_COLLECTION_NAME).insertOne(validData)
  return createdUser
}

const findOneById = async (userId) => {
  const user = await getDb().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
  return user
}

const findOneByEmail = async (email) => {
  const user = await getDb().collection(USER_COLLECTION_NAME).findOne({ email: email })
  return user
}

const update = async (userId, updateData) => {
  Object.keys(updateData).forEach(field => {
    if (INVALID_UPDATE_FIELD.includes(field)) {
      delete (updateData[field])
    }
  })
  const updatedUser = await getDb().collection(USER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updateData },
    { returnDocument: 'after' }
  )
  return updatedUser
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  createNew,
  findOneById,
  findOneByEmail,
  update
}