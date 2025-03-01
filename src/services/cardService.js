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

const update = async (cardId, reqBody, cardCoverFile) => {
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
  } else {
    updatedCard = await cardModel.update(cardId, updateData)
  }

  return updatedCard
}

export const cardService = {
  createNew, update
}