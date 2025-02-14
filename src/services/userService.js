import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { pickUser } from '~/utils/formatters'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

const createNew = async (reqBody) => {
  // Check if user is already in database
  const checkUser = await userModel.findOneByEmail(reqBody.email)
  if (checkUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'This email is already registered!')
  }

  // Create data to save
  const usernameFromEmail = reqBody.email.split('@')[0]
  const newUser = {
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 8),
    username: usernameFromEmail,
    displayName: usernameFromEmail,
    verifyToken: uuidv4()
  }

  // Save data into database
  await userModel.createNew(newUser)
  const getCreatedUser = await userModel.findOneByEmail(reqBody.email)

  const transporter = nodemailer.createTransport({
    host: 'smpt.gmail.com',
    port: 587,
    service: 'gmail',
    auth: {
      user: process.env.SERVER_EMAIL,
      pass: process.env.SERVER_EMAIL_PASSWORD
    }
  });

  const verificationLink = `${process.env.FRONTEND_DOMAIN}/account/verification?email=${getCreatedUser.email}&token=${getCreatedUser.verifyToken}`
  const customSubject = 'Trello App clone: Please verify your account!'
  const htmlContent = `
    <h3>This is your verification link: </h3>
    <h3>${verificationLink}</h3>
    <h3>Sincerely, <br/> Nguyen Hung Dung </h3>
  `

  var mailOptions = {
    from: process.env.SERVER_EMAIL,
    to: getCreatedUser.email,
    subject: customSubject,
    // text: 'That was easy!',
    html: htmlContent
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  return pickUser(getCreatedUser)
}

export const userService = {
  createNew
}