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
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:40px;">
          
          <!-- LOGO -->
          <div style="text-align:center; margin-bottom: 20px;">
              <img 
                src="cid:logo@narino"
                alt="NariñoTex"
                width="225"
                style="display:block; margin:0 auto;"
              />
          </div>

          <!-- Título -->
          <tr>
            <td>
              <h2 style="color:#111827;">Restablecer tu contraseña</h2>
              <p style="color:#4b5563; font-size:15px; line-height:1.6;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta.
              </p>
              <p style="color:#4b5563; font-size:15px; line-height:1.6;">
                Haz clic en el botón de abajo para crear una nueva contraseña.
              </p>
            </td>
          </tr>

          <!-- Botón -->
          <tr>
            <td align="center" style="padding:30px 0;">
              <a href="${resetLink}" 
                 style="background-color:#111827; 
                        color:#ffffff; 
                        padding:14px 28px; 
                        text-decoration:none; 
                        border-radius:6px; 
                        font-weight:bold;
                        display:inline-block;">
                Restablecer contraseña
              </a>
            </td>
          </tr>

          <!-- Expiración -->
          <tr>
            <td>
              <p style="color:#6b7280; font-size:13px; line-height:1.6;">
                Este enlace expirará pronto por motivos de seguridad.
              </p>
              <p style="color:#6b7280; font-size:13px; line-height:1.6;">
                Si no solicitaste este cambio, puedes ignorar este correo.
              </p>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding-top:20px;">
              <p style="color:#9ca3af; font-size:12px;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="color:#2563eb; font-size:12px; word-break:break-all;">
                ${resetLink}
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top:20px;">
          <tr>
            <td align="center">
              <p style="color:#9ca3af; font-size:12px;">
                © ${new Date().getFullYear()} NariñoTex. Todos los derechos reservados.
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
            contentId: 'logo@narino'
          }
        ]
      })
    }

    return {}
  }
}

export default ResendNotificationProviderService
