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

          <!-- NOMBRE DE LA MARCA -->
          <tr>
            <td style="padding-bottom:30px;">
              <h1 style="
                  font-size:32px;
                  font-weight:700;
                  color:#111111;
                  margin:0;
                  letter-spacing:2px;
              ">
                LadyNails
              </h1>
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
                    padding:16px 16px;
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
                  margin:10px auto;
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
            <td style="padding-bottom:15px;">
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
          <div style="text-align:center; margin:25px 0;">

              <a href="https://facebook.com/ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
                  <img src="https://s.magecdn.com/social/32w/mb-facebook.png"
                      width="28" height="28" alt="Facebook" style="display:block; border:0;"/>
              </a>

              <a href="https://instagram.com/ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
                  <img src="https://s.magecdn.com/social/32w/mb-instagram.png"
                      width="28" height="28" alt="Instagram" style="display:block; border:0;"/>
              </a>

              <a href="https://tiktok.com/@ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
                  <img src="https://s.magecdn.com/social/32w/mb-tiktok.png"
                      width="28" height="28" alt="TikTok" style="display:block; border:0;"/>
              </a>

          </div>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="padding-top:10px;">
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
`
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
        <h1 style="margin:0; font-size:28px; font-weight:700; color:#111111; letter-spacing:1px;">LadyNails</h1>
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
        <h3 style="font-size:16px; margin-bottom:10px;">Detalle del envío</h3>
      </td>
    </tr>

    <tr>
      <td style="font-size:13px; color:#444; line-height:1.6;">
        ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}<br/>
        ${order.shipping_address?.address_1}<br/>
        ${order.shipping_address?.city}<br/>
        ${order.shipping_address?.country_code?.toUpperCase()}
      </td>
    </tr>

    <!-- REDES SOCIALES -->
    <div style="text-align:center; margin:25px 0;">

      <a href="https://facebook.com/ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
        <img src="https://s.magecdn.com/social/32w/mb-facebook.png"
          width="28" height="28" alt="Facebook" style="display:block; border:0;"/>
      </a>

      <a href="https://instagram.com/ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
        <img src="https://s.magecdn.com/social/32w/mb-instagram.png"
          width="28" height="28" alt="Instagram" style="display:block; border:0;"/>
      </a>

      <a href="https://tiktok.com/@ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
        <img src="https://s.magecdn.com/social/32w/mb-tiktok.png"
          width="28" height="28" alt="TikTok" style="display:block; border:0;"/>
      </a>

    </div>

    <!-- FOOTER -->
    <tr>
      <td style="padding-top:20px; font-size:12px; color:#888;">
        Si tienes alguna pregunta, responde a este correo o contáctanos.
      </td>
    </tr>

  </table>
</body>
`
      })
    } else if (template === "payment-pending") {
      const { order } = data

      await this.resend.emails.send({
        from: this.options_.from,
        to,
        subject: `¡Gracias! Tu pago está siendo verificado - Pedido #${order.display_id}`,
        html: `
<body style="margin:0; padding:40px 20px; background:#ffffff; border-radius:12px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    
    <!-- HEADER -->
    <tr>
      <td style="padding-bottom:25px;">
        <h1 style="margin:0; font-size:32px; font-weight:700; color:#111111; letter-spacing:2px; text-align:center;">LadyNails</h1>
      </td>
    </tr>

    <!-- MENSAJE PRINCIPAL -->
    <tr>
      <td style="padding:30px 25px; text-align:center;">
        <div style="width:60px; height:3px; background:#111111; margin:0 auto 25px auto; border-radius:2px;"></div>
        
        <h2 style="font-size:22px; font-weight:600; color:#111111; margin:0 0 15px 0;">
          ¡Gracias por tu compra!
        </h2>
        
        <p style="font-size:15px; color:#555555; line-height:1.6; margin:0 0 20px 0;">
          Tu pago ha sido recibido y está siendo <strong>verificado</strong> por nuestro equipo.
        </p>
        
        <p style="font-size:14px; color:#666666; line-height:1.6; margin:0;">
          En pocos minutos recibirás la confirmación de tu pago. Una vez aprobado, te enviaremos los detalles de envío de tu pedido.
        </p>
      </td>
    </tr>

    <!-- LINK A LA TIENDA -->
    <tr>
      <td style="padding:25px 0; text-align:center;">
        <a href="${process.env.STORE_URL}" style="font-size:14px; color:#2d6cdf; text-decoration:none;">
          → Visitar nuestra tienda
        </a>
      </td>
    </tr>

    <!-- DIVIDER -->
    <tr>
      <td><hr style="border:none; border-top:1px solid #e0e0e0; margin:15px 0;"></td>
    </tr>

    <!-- RESUMEN DEL PEDIDO -->
    <tr>
      <td style="padding:10px 0;">
        <h3 style="font-size:16px; font-weight:600; margin-bottom:15px; color:#111111;">Resumen del pedido #${order.display_id}</h3>
      </td>
    </tr>

    ${
      (order.items || []).map(item => {
        const itemQuantity = Number(item.quantity || 0);
        const itemUnitPrice = Number(item.unit_price || 0);
        const itemTotal = Number(item.total || (itemUnitPrice * itemQuantity));
        
        return `
          <tr>
            <td style="padding:8px 0; display:flex; align-items:center; border-bottom:1px solid #f0f0f0;">
              ${item.thumbnail ? `<img src="${item.thumbnail}" width="45" style="border-radius:6px; margin-right:12px;" />` : '<div style="width:45px; height:45px; background:#eee; border-radius:6px; margin-right:12px;"></div>'}
              <div style="font-size:14px; color:#333;">
                ${item.title || item.product_title || 'Producto'} x ${itemQuantity}
              </div>
              <div style="margin-left:auto; font-size:14px; font-weight:500; color:#333;">
                $${itemTotal.toLocaleString()} 
              </div>
            </td>
          </tr>
        `;
      }).join('')
    }

    <!-- TOTALS -->
    <tr>
      <td style="padding-top:15px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:14px; padding:6px 0; color:#555;">Subtotal</td>
            <td style="font-size:14px; padding:6px 0; text-align:right; color:#333;">$${Number(
              order.item_subtotal || 
              order.subtotal || 
              order.summary?.subtotal || 
              (order.total - (order.shipping_total || 0)) || 
              0
            ).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:14px; padding:6px 0; color:#555;">Envío</td>
            <td style="font-size:14px; padding:6px 0; text-align:right; color:#333;">$${Number(
              order.shipping_total || 
              order.shipping_subtotal || 
              order.summary?.shipping_total || 
              5000
            ).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:14px; padding:6px 0; color:#555;">Impuestos</td>
            <td style="font-size:14px; padding:6px 0; text-align:right; color:#333;">$${Number(
              order.tax_total || 
              order.summary?.tax_total || 
              0
            ).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="font-size:16px; font-weight:700; padding:10px 0; color:#111;">Total</td>
            <td style="font-size:16px; font-weight:700; padding:10px 0; text-align:right; color:#111;">$${Number(
              order.total || 
              order.summary?.original_order_total || 
              order.summary?.paid_total || 
              0
            ).toLocaleString()} ${(order.currency_code || 'COP').toUpperCase()}</td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- NOTA DE PAGO PENDIENTE -->
    <tr>
      <td style="padding:25px 0;">
        <div style="background:#fff8e1; border:1px solid #ffe082; border-radius:8px; padding:20px; text-align:center;">
          <p style="font-size:13px; color:#795548; margin:0;">
            <strong>Estado:</strong> Pago en verificación
          </p>
        </div>
      </td>
    </tr>

    <!-- REDES SOCIALES -->
    <div style="text-align:center; margin:25px 0;">

        <a href="https://facebook.com/ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
            <img src="https://s.magecdn.com/social/32w/mb-facebook.png"
                width="28" height="28" alt="Facebook" style="display:block; border:0;"/>
        </a>

        <a href="https://instagram.com/ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
            <img src="https://s.magecdn.com/social/32w/mb-instagram.png"
                width="28" height="28" alt="Instagram" style="display:block; border:0;"/>
        </a>

        <a href="https://tiktok.com/@ladynails" style="display:inline-block; margin:0 8px; text-decoration:none;">
            <img src="https://s.magecdn.com/social/32w/mb-tiktok.png"
                width="28" height="28" alt="TikTok" style="display:block; border:0;"/>
        </a>

    </div>

    <!-- FOOTER -->
    <tr>
      <td style="padding-top:15px; text-align:center;">
        <p style="font-size:11px; color:#999999; letter-spacing:1px; margin:0;">
          © 2026 LadyNails
        </p>
      </td>
    </tr>

  </table>
</body>
`
      })
    }

    return {}
  }
}

export default ResendNotificationProviderService
