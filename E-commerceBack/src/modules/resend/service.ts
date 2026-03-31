import { AbstractNotificationProviderService } from "@medusajs/framework/utils"
import { Resend } from "resend"
import path from 'path';
import fs from 'fs';

type InjectedDependencies = {
  logger: any
}

type Options = {
  api_key: string
  from: string
}

const logoPath = path.join(process.cwd(), "static/logo.png");
const logoBuffer = fs.readFileSync(logoPath);

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "resend"

  protected resend: Resend
  protected options_: Options
  protected logger_

  constructor(
    { logger }: InjectedDependencies,
    options: Options
  ) {
    super()

    this.logger_ = logger
    this.options_ = options

    this.resend = new Resend(this.options_.api_key)
  }

  async send(notification) {
    const { to, data, template } = notification

    if (template === "password-reset") {
      const resetLink = `${process.env.STORE_URL}/auth/reset-password?email=${data.email}&token=${data.token}`

      await this.resend.emails.send({
        from: this.options_.from,
        to,
        subject: "Restablecer tu contraseña",
        html: `
<body style="
    margin:0;
    padding:60px 20px;
    background-color:#f3f2ef;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; margin:0 auto;">
    <tr>
      <td>

        <table width="100%" cellpadding="0" cellspacing="0" style="
            background:#ffffff;
            border-radius:16px;
            padding:45px 35px;
            box-shadow:0 10px 30px rgba(0,0,0,0.04);
            text-align:center;
        ">

          <!-- LÍNEA NEGRA SUPERIOR -->
          <tr>
            <td align="center">
              <div style="
                  width:60px;
                  height:3px;
                  background:#111111;
                  margin:0 auto 30px auto;
                  border-radius:2px;
              "></div>
            </td>
          </tr>

          <!-- LOGO -->
          <tr>
            <td style="padding-bottom:30px;">
              <img 
                src="cid:logo@ladynails"
                alt="LadyNails"
                width="170"
                style="display:block; margin:0 auto;"
              />
            </td>
          </tr>

          <!-- TÍTULO -->
          <tr>
            <td>
              <h2 style="
                  font-size:22px;
                  font-weight:500;
                  color:#111111;
                  margin-bottom:18px;
                  letter-spacing:0.8px;
              ">
                Restablecer tu contraseña
              </h2>

              <p style="
                  font-size:14px;
                  color:#666666;
                  margin-bottom:14px;
                  line-height:1.6;
              ">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
              </p>

              <p style="
                  font-size:14px;
                  color:#666666;
                  margin-bottom:32px;
                  line-height:1.6;
              ">
                Haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
            </td>
          </tr>

          <!-- BOTÓN -->
          <tr>
            <td align="center" style="padding:10px 0 35px 0;">
              <a href="${resetLink}" 
                 style="
                    background-color:#111111;
                    color:#ffffff;
                    padding:16px 32px;
                    text-decoration:none;
                    border-radius:10px;
                    font-weight:500;
                    font-size:14px;
                    display:inline-block;
                    letter-spacing:0.5px;
                 ">
                Restablecer contraseña
              </a>
            </td>
          </tr>

          <!-- LÍNEA NEGRA INFERIOR -->
          <tr>
            <td align="center">
              <div style="
                  width:40px;
                  height:2px;
                  background:#111111;
                  margin:30px auto;
                  border-radius:2px;
              "></div>
            </td>
          </tr>

          <!-- TEXTO SECUNDARIO -->
          <tr>
            <td>
              <p style="
                  font-size:13px;
                  color:#888888;
                  margin-bottom:14px;
                  line-height:1.6;
              ">
                Este enlace expirará pronto por motivos de seguridad.
              </p>

              <p style="
                  font-size:12px;
                  color:#aaaaaa;
                  margin-bottom:25px;
                  line-height:1.6;
              ">
                Si no solicitaste este cambio, puedes ignorar este correo.
              </p>
            </td>
          </tr>

          <!-- FALLBACK LINK -->
          <tr>
            <td style="padding-bottom:25px;">
              <p style="
                  font-size:12px;
                  color:#999999;
                  margin-bottom:8px;
              ">
                Si el botón no funciona, copia y pega este enlace:
              </p>

              <p style="
                  font-size:12px;
                  color:#111111;
                  word-break:break-all;
              ">
                ${resetLink}
              </p>
            </td>
          </tr>

          <!-- REDES SOCIALES -->
          <tr>
            <td align="center" style="padding-top:10px;">
              <a href="https://facebook.com/TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" style="opacity:0.7;">
              </a>

              <a href="https://instagram.com/TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" style="opacity:0.7;">
              </a>

              <a href="https://tiktok.com/@TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" style="opacity:0.7;">
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:40px;">
              <p style="
                  font-size:11px;
                  color:#cccccc;
                  letter-spacing:1px;
              ">
                © 2026 LadyNails
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
`,
        attachments: [
          {
            filename: 'logo.png',
            content: logoBuffer.toString('base64'),
            contentType: 'image/png',
            contentId: 'logo@ladynails'
          }
        ]
      })
    } else if (template === "order-fulfillment") {
      const { order, fulfillment } = data

      let trackingLinkHTML = ""
      const labels = fulfillment.labels || []
      const label = labels.length > 0 ? labels[0] : null
      
      if (label && ((label.tracking_url && label.tracking_url !== "#") || (label.label_url && label.label_url !== "#"))) {
        const urlToUse = (label.tracking_url && label.tracking_url !== "#") ? label.tracking_url : label.label_url;
        const trackingNumStr = label.tracking_number ? `<p style="font-size:14px; color:#666666; margin-bottom:15px;">Guía / Rastreo: <b>${label.tracking_number}</b></p>` : '';
        
        trackingLinkHTML = `
          <div style="margin: 25px 0;">
            ${trackingNumStr}
            <a href="${urlToUse}" style="background-color:#111111; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:10px; font-weight:500; font-size:14px; display:inline-block; letter-spacing:0.5px;">Rastrear Pedido</a>
          </div>
        `
      } else {
        trackingLinkHTML = `
          <div style="margin: 25px 0;">
            <p style="font-size:14px; color:#666666; line-height:1.6;">
              Tu pedido ha sido preparado y despachado. En breve recibirás más actualizaciones.
            </p>
          </div>
        `
      }

      await this.resend.emails.send({
        from: this.options_.from,
        to,
        subject: `Actualización de tu pedido #${order.display_id} - ¡Yupi! Va en camino`,
        html: `
<body style="margin:0; padding:60px 20px; background-color:#f3f2ef; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; margin:0 auto;">
    <tr>
      <td>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; padding:45px 35px; box-shadow:0 10px 30px rgba(0,0,0,0.04); text-align:center;">
          <!-- LÍNEA NEGRA SUPERIOR -->
          <tr>
            <td align="center">
              <div style="width:60px; height:3px; background:#111111; margin:0 auto 30px auto; border-radius:2px;"></div>
            </td>
          </tr>
          <!-- LOGO -->
          <tr>
            <td style="padding-bottom:30px;">
              <img src="cid:logo@ladynails" alt="LadyNails" width="170" style="display:block; margin:0 auto;" />
            </td>
          </tr>
          <!-- TÍTULO -->
          <tr>
            <td>
              <h2 style="font-size:22px; font-weight:500; color:#111111; margin-bottom:18px; letter-spacing:0.8px;">
                ¡Tu pedido está en camino!
              </h2>
              <p style="font-size:15px; color:#444444; margin-bottom:14px; line-height:1.6;">
                Hola ${order.shipping_address?.first_name || 'cliente'}. ¡Qué emocionante! Hemos preparado tu pedido y ya se encuentra en camino.
              </p>
              <p style="font-size:14px; color:#666666; margin-bottom:10px; line-height:1.6;">
                Orden: <b>#${order.display_id}</b>
              </p>
            </td>
          </tr>
          
          <!-- BOTÓN DE ENLACE -->
          <tr>
            <td align="center">
              ${trackingLinkHTML}
            </td>
          </tr>

          <!-- LÍNEA NEGRA INFERIOR -->
          <tr>
            <td align="center">
              <div style="width:40px; height:2px; background:#111111; margin:30px auto; border-radius:2px;"></div>
            </td>
          </tr>
          
          <!-- TEXTO SECUNDARIO -->
          <tr>
            <td>
              <p style="font-size:13px; color:#888888; margin-bottom:14px; line-height:1.6;">
                Si tienes alguna duda o inconveniente, contáctanos respondiendo a este correo o mediante nuestras redes sociales.
              </p>
            </td>
          </tr>
          
          <!-- REDES SOCIALES -->
          <tr>
            <td align="center" style="padding-top:10px;">
              <a href="https://facebook.com/TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" style="opacity:0.7;">
              </a>
              <a href="https://instagram.com/TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" style="opacity:0.7;">
              </a>
              <a href="https://tiktok.com/@TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" style="opacity:0.7;">
              </a>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:40px;">
              <p style="font-size:11px; color:#cccccc; letter-spacing:1px;">
                © 2026 LadyNails
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`,
        attachments: [
          {
            filename: 'logo.png',
            content: logoBuffer.toString('base64'),
            contentType: 'image/png',
            contentId: 'logo@ladynails'
          }
        ]
      })
    }

    return {}
  }
}

export default ResendNotificationProviderService
