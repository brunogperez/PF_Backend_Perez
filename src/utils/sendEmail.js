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

export const sendEmailTicket = async (email, codigo, cliente, items, totalCompra) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Ecommerce <brunogperez@gmail.com>`,
      to: `${email}`,
      subject: 'Ticket de compra',
      html: templateHtmlEmailCompra(codigo, cliente, items, totalCompra)
    });

  } catch (error) {
    logger.error(error)
  }
}

const templateHtmlEmailCompra = (codigo, cliente, items, totalCompra) => {
  console.log({ items });
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Ticket de Compra</h2>
          <h3>Código: ${codigo}</h3>
          <p>Estimado(a) ${cliente},</p>
          <p>¡Gracias por tu compra!</p>
          <h3>Detalles de la compra:</h3>
          <ul>
              ${items.map(item => `
                  <li>
                      <strong>${item.title}</strong> - ${item.quantity} x $${item.price}
                  </li>
              `).join('')}
          </ul>
          <p>Total de la compra: $${totalCompra}</p>
          <p>¡Esperamos verte pronto de nuevo!</p>
          <p>Saludos,</p>
          <p>Tu Tienda Online</p>
      </div>
  `;
}

const templateHtmlEmail = (email, url) => {

  const titulo = 'Cambiar la contraseña en la cuenta de Ecommerce';
  const link = url;
  return (
    `
  <div style="margin:0;padding:0" dir="ltr" bgcolor="#ffffff">
      <table border="0" cellspacing="0" cellpadding="0" align="center" id="m_-7650884979018722939email_table"
          style="border-collapse:collapse">
          <tbody>
              <tr>
                  <td id="m_-7650884979018722939email_content"
                      style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff">
                      <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                          <tbody>
                              <tr>
                                  <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
                              </tr>
                              <tr>
                                  <td height="1" colspan="3" style="line-height:1px"></td>
                              </tr>
                              <tr>
                                  <td>
                                      <table border="0" width="100%" cellspacing="0" cellpadding="0"
                                          style="border-collapse:collapse;text-align:center;width:100%">
                                          <tbody>
                                              <tr>
                                                  <td width="15px" style="width:15px"></td>
                                                  <td style="line-height:0px;max-width:600px;padding:0 0 15px 0">
                                                  </td>
                                                  <td width="15px" style="width:15px"></td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <table border="0" width="430" cellspacing="0" cellpadding="0"
                                          style="border-collapse:collapse;margin:0 auto 0 auto">
                                          <tbody>
                                              <tr>
                                                  <td>
                                                      <table border="0" width="430px" cellspacing="0" cellpadding="0"
                                                          style="border-collapse:collapse;margin:0 auto 0 auto;width:430px">
                                                          <tbody>
                                                              <tr>
                                                                  <td width="15" style="display:block;width:15px">
                                                                      &nbsp;&nbsp;&nbsp;</td>
                                                              </tr>
                                                              <tr>
                                                                  <td width="12" style="display:block;width:12px">
                                                                      &nbsp;&nbsp;&nbsp;</td>
                                                                  <td>
                                                                      <table border="0" width="100%" cellspacing="0"
                                                                          cellpadding="0"
                                                                          style="border-collapse:collapse">
                                                                          <tbody>
                                                                              <tr>
                                                                                  <td></td>
                                                                                  <td
                                                                                      style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                      <p
                                                                                          style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                          Hola,</p>
                                                                                      <p
                                                                                          style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                          Alguien esta intentando ${titulo} con <a
                                                                                              href="mailto:${email}"
                                                                                              target="_blank">${email}</a>.
                                                                                          Omitir email en caso de que no fuiste vos
                                                                                      </p>
                                                                                  </td>
                                                                              </tr>
                                                                              <tr>
                                                                                  <td></td>
                                                                                  <td style="padding:10px;color:#565a5c;font-size:32px;font-weight:500;text-align:center;padding-bottom:25px">
          <a href="${link}" style="text-decoration: none; color: #007bff;">Haz clic aquí para restablecer tu contraseña</a>
      </td>
                                                                              </tr>
                                                                          </tbody>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </tbody>
                                                      </table>
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <table border="0" cellspacing="0" cellpadding="0"
                                          style="border-collapse:collapse;margin:0 auto 0 auto;width:100%;max-width:600px">
                                          <tbody>
                                              <tr>
                                                  <td height="4" style="line-height:4px" colspan="3">&nbsp;</td>
                                              </tr>
                                              <tr>
                                                  <td width="15px" style="width:15px"></td>
                                                  <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                                                  <td style="text-align:center">
                                                      <div style="height:10px"></div>
                                                  </td>
                                                  <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                                                  <td width="15px" style="width:15px"></td>
                                              </tr>
                                              <tr>
                                                  <td height="32" style="line-height:32px" colspan="3">&nbsp;</td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </td>
                              </tr>
                              <tr>
                                  <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
  `);
}