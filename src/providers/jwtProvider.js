import jwt from 'jsonwebtoken'

const generateToken = async (payload, secretKey, tokenLife) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: tokenLife })
  return token
}

const verifyToken = async (token, secretKey) => {
  const result = jwt.verify(token, secretKey)
  return result
}

export const jwtProvider = {
  generateToken,
  verifyToken
}