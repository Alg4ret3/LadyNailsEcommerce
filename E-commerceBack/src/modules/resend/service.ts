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
<body style="margin:0; padding:40px 20px; background-color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    
    <!-- HEADER -->
    <tr>
      <td style="padding-bottom:20px;">
        <h2 style="margin:0; font-size:20px; font-weight:600;">LadyNails</h2>
      </td>
    </tr>

    <!-- MENSAJE -->
    <tr>
      <td style="padding-bottom:20px;">
        <p style="margin:0; font-size:14px; color:#444;">
          Se recibió el pago de <b>#${order.display_id}</b>
        </p>
      </td>
    </tr>

    <!-- BOTÓN -->
    <tr>
      <td style="padding-bottom:10px;">
        ${trackingLinkHTML}
      </td>
    </tr>

    <!-- LINK -->
    <tr>
      <td style="padding-bottom:30px;">
        <a href="${process.env.STORE_URL}" style="font-size:13px; color:#2d6cdf; text-decoration:none;">
          → Visita nuestra tienda
        </a>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr>
      <td><hr style="border:none; border-top:1px solid #eee; margin:20px 0;"></td>
    </tr>

    <!-- RESUMEN -->
    <tr>
      <td>
        <h3 style="font-size:16px; margin-bottom:15px;">Resumen del pedido</h3>
      </td>
    </tr>

    ${
      (order.items || []).map(item => {
        const itemQuantity = Number(item.quantity || 0);
        const itemUnitPrice = Number(item.unit_price || 0);
        const itemTotal = Number(item.total || (itemUnitPrice * itemQuantity));
        
        return `
          <tr>
            <td style="padding:10px 0; display:flex; align-items:center;">
              <img src="${item.thumbnail || ''}" width="50" style="border-radius:6px; margin-right:10px;" />
              <div style="font-size:14px;">
                ${item.title || item.product_title || 'Producto'} x ${itemQuantity}
              </div>
              <div style="margin-left:auto; font-size:14px;">
                $${itemTotal.toLocaleString()} 
              </div>
            </td>
          </tr>
        `;
      }).join('')
    }

    <!-- TOTALS -->
    <tr>
      <td><hr style="border:none; border-top:1px solid #eee; margin:20px 0;"></td>
    </tr>

    <tr>
      <td style="font-size:14px; padding:4px 0;">
        Subtotal
        <span style="float:right;">$${Number(
          order.item_subtotal || 
          order.subtotal || 
          order.summary?.subtotal || 
          (order.total - (order.shipping_total || 0)) || 
          0
        ).toLocaleString()}</span>
      </td>
    </tr>

    <tr>
      <td style="font-size:14px; padding:4px 0;">
        Envío
        <span style="float:right;">$${Number(
          order.shipping_total || 
          order.shipping_subtotal || 
          order.summary?.shipping_total || 
          5000 // Fallback basado en tu JSON
        ).toLocaleString()}</span>
      </td>
    </tr>

    <tr>
      <td style="font-size:14px; padding:4px 0;">
        Impuestos
        <span style="float:right;">$${Number(
          order.tax_total || 
          order.summary?.tax_total || 
          0
        ).toLocaleString()}</span>
      </td>
    </tr>

    <tr>
      <td><hr style="border:none; border-top:1px solid #eee; margin:20px 0;"></td>
    </tr>

    <tr>
      <td style="font-size:16px; font-weight:600;">
        Total
        <span style="float:right;">
          $${Number(
            order.total || 
            order.summary?.original_order_total || 
            order.summary?.paid_total || 
            0
          ).toLocaleString()} ${(order.currency_code || 'COP').toUpperCase()}
        </span>
      </td>
    </tr>

    <!-- INFO CLIENTE -->
    <tr>
      <td style="padding-top:40px;">
        <h3 style="font-size:16px; margin-bottom:10px;">Información del cliente</h3>
      </td>
    </tr>

    <tr>
      <td style="font-size:13px; color:#444; line-height:1.6;">
        <b>Dirección de envío</b><br/>
        ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}<br/>
        ${order.shipping_address?.address_1}<br/>
        ${order.shipping_address?.city}<br/>
        ${order.shipping_address?.country_code?.toUpperCase()}
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="padding-top:40px; font-size:12px; color:#888;">
        Si tienes alguna pregunta, responde a este correo o contáctanos.
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
    }

    return {}
  }
}

export default ResendNotificationProviderService
