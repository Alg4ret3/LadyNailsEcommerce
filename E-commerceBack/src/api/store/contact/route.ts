import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import { Resend } from "resend"
import path from "path"
import fs from "fs"

const resendApiKey = process.env.RESEND_API_KEY
const resend = new Resend(resendApiKey)

// Validation schema for incoming payload
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const validatedData = contactSchema.parse(req.body)

    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not set. Contact email will only be logged.')
      console.log('Contact form data:', validatedData)
      return res.status(200).json({ success: true, message: "Logged out without sending" })
    }

    const { name, email, subject, message } = validatedData

    const logoPath = path.join(process.cwd(), "static/logo.png")
    let attachments: any[] = []
    
    try {
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath)
        attachments.push({
          filename: 'logo.png',
          content: logoBuffer.toString('base64'),
          contentType: 'image/png',
          contentId: 'logo@ladynails'
        })
      }
    } catch (e) {
      console.error("Could not load logo for email attachment", e)
    }

    const CONTACT_EMAIL_DESTINATION = "tuplacore@gmail.com" // You can change this to your preferred inbox

    await resend.emails.send({
      from: "LadyNails Web <no-reply@visiontreepasto.com>",
      to: CONTACT_EMAIL_DESTINATION,
      replyTo: email,
      subject: `Nuevo mensaje de ${name}: ${subject}`,
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
                ">
                  <!-- LOGO -->
                  ${attachments.length > 0 ? `
                  <tr>
                    <td align="center" style="padding-bottom:30px;">
                      <img 
                        src="cid:logo@ladynails"
                        alt="LadyNails"
                        width="170"
                        style="display:block; margin:0 auto;"
                      />
                    </td>
                  </tr>` : ''}

                  <!-- TITLE -->
                  <tr>
                    <td>
                      <h2 style="
                          font-size:20px;
                          font-weight:600;
                          color:#111111;
                          margin-bottom:20px;
                          text-align:center;
                      ">
                        Nueva Solicitud de Contacto
                      </h2>
                      
                      <p style="font-size:14px; color:#444444; margin-bottom:10px;">
                        <strong>Nombre/Empresa:</strong> ${name}
                      </p>
                      
                      <p style="font-size:14px; color:#444444; margin-bottom:10px;">
                        <strong>Correo:</strong> ${email}
                      </p>
                      
                      <p style="font-size:14px; color:#444444; margin-bottom:20px;">
                        <strong>Asunto:</strong> ${subject}
                      </p>

                      <div style="background-color:#fafafa; padding:20px; border-radius:8px; border:1px solid #eeeeee;">
                          <p style="font-size:14px; color:#333333; line-height:1.6; margin:0; white-space:pre-wrap;">${message}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td align="center" style="padding-top:40px;">
                      <p style="font-size:12px; color:#888888; margin-bottom:0;">
                        Este mensaje fue enviado desde el formulario de contacto web.
                      </p>
                      <p style="
                          font-size:11px;
                          color:#cccccc;
                          letter-spacing:1px;
                          margin-top:10px;
                      ">
                        © ${new Date().getFullYear()} LadyNails
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,
      attachments
    })

    return res.status(200).json({ success: true, message: "Mensaje enviado con éxito." })

  } catch (error: any) {
    console.error("Error processing contact form:", error)
    if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.issues })
    }
    return res.status(500).json({ message: "Error enviando el mensaje." })
  }
}
