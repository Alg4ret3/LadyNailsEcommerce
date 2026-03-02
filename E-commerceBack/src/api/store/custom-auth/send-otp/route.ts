import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { OtpService } from "../../../../lib/otp";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
    const { email } = req.body as { email: string };

    if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
    }

    const customerModule = req.scope.resolve(Modules.CUSTOMER);

    // Check if customer exists
    const customers = await customerModule.listCustomers({ email: email }, { take: 1 });

    if (customers.length > 0) {
        // Check if they have an account (if applicable schema) or just exist.
        // For now, if email is taken, we block registration to avoid complexity.
        // In a real app, we might handle guest-to-account upgrades here.
        if (customers[0].has_account) {
            res.status(409).json({ message: "Customer already exists" });
            return;
        }
    }

    try {
        await OtpService.generate(email);
        res.json({ message: "OTP sent successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
}
