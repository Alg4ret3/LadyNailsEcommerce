import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { OtpService } from "../../../../lib/otp";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, code } = req.body as {
    email: string;
    code: string;
  };

  if (!email || !code) {
    return res.status(400).json({
      message: "Email and code are required",
    });
  }

  try {
    const isValid = await OtpService.verify(email, code);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid or expired code",
      });
    }

    return res.status(200).json({
      message: "Email verified successfully",
      verified: true,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Verification failed",
      error: error.message,
    });
  }
}
