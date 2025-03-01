import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId.toString())

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (userInfo, cardId, reqBody, cardCoverFile) => {
  const updateData = {
    ...reqBody,
    updatedAt: Date.now()
  }

  let updatedCard = {}

  if (cardCoverFile) {
    const uploadResult = await cloudinaryProvider.streamUpload(cardCoverFile.buffer, 'cardCovers')
    console.log('Upload result:', uploadResult)

    updatedCard = await cardModel.update(cardId, {
      cover: uploadResult.secure_url
    })
  } else if (reqBody.newComment) {
    const commentData = {
      ...reqBody.newComment,
      userId: userInfo._id,
      userEmail: userInfo.email,
      commentedAt: Date.now()
    }
    updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
  } else {
    updatedCard = await cardModel.update(cardId, updateData)
  }

  return updatedCard
}

export const cardService = {
  createNew, update
}