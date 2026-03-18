import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const payload = req.body as any
    const integritySecret = process.env.WOMPI_INTEGRITY_SV_KEY // Event integrity secret

    if (!payload?.signature?.properties) {
      return res.status(400).json({ message: "Invalid payload format" })
    }

    // Validate Signature
    const signature = Object.keys(payload.signature.properties)
      .map(key => payload.data.transaction[payload.signature.properties[key].split('.')[1]])
      .join("") + payload.data.transaction.created_at.split('.')[0] + integritySecret
      
    const hash = crypto.createHash('sha256').update(signature).digest('hex')

    if (hash !== payload.signature.checksum) {
      return res.status(400).json({ message: "Invalid signature" })
    }

    // Success response for webhook
    return res.status(200).send("OK")
  } catch (err) {
    return res.status(500).send("Webhook Error")
  }
}
