import nodemailer from 'nodemailer'
import { logger } from '../utils/logger.js'
import { MAIL_PASS, MAIL_USER } from '../config/config.js'

export const sendEmail = async (email, url) => {
  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,

      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    })

    await transport.sendMail({
      from: `Ecommerce <brunogperez@gmail.com>`,
      to: `${email}`,
      subject: 'Cambiar contraseña',
      html: templateHtmlEmail(email, url)
    });

  } catch (error) {
    logger.error(error);
  }
}

const templateHtmlEmail = (email, url) => {
  const titulo = 'Cambio de contraseña';
  const link = url;
  return (
      `<div>
        <h2>Hi ${email},</h2> 
        <hr>    
        <h3>${titulo}</h3>
        <hr>
        <p>Si deseas cambiar tu contraseña haz click en el siguiente link</p>
        <a href="${link}">Haz click aquí</a>
      </div>`
  )
}
