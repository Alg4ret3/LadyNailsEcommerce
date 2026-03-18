import { AbstractPaymentProvider, PaymentSessionStatus } from "@medusajs/framework/utils"
import {
  ProviderWebhookPayload,
  WebhookActionResult,
  CapturePaymentInput,
  CapturePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
} from "@medusajs/framework/types"
import crypto from "crypto"

export interface WompiOptions {
  public_key: string
  private_key: string
  integrity_key: string
  environment: "test" | "production"
}

export class WompiPaymentProvider extends AbstractPaymentProvider<WompiOptions> {
  static identifier = "wompi"
  protected options_: WompiOptions

  constructor(container: any, options: WompiOptions) {
    super(container, options)
    this.options_ = options
  }

  private generateIntegritySignature(reference: string, amount: number, currency: string) {
    const stringToHash = `${reference}${amount}${currency}${this.options_.integrity_key}`
    const encripted = crypto.createHash("sha256").update(stringToHash).digest("hex")
    return encripted
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input
    const reference = context?.idempotency_key || `txn_${Date.now()}` 
    
    // Convert BigNumberInput to number
    const numericAmount = Number(amount)
    const amountInCents = Math.round(numericAmount * 100)
    const signature = this.generateIntegritySignature(reference, amountInCents, currency_code.toUpperCase())

    return {
      id: reference,
      status: PaymentSessionStatus.PENDING,
      data: {
        reference,
        amount_in_cents: amountInCents,
        currency: currency_code.toUpperCase(),
        signature,
        public_key: this.options_.public_key,
        status: "PENDING"
      }
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const statusData = await this.getPaymentStatus({ data: input.data })
    
    return {
      status: statusData.status,
      data: input.data
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...(input.data || {}),
        status: "CANCELED"
      }
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...(input.data || {}),
        status: "APPROVED"
      }
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: {
        ...(input.data || {}),
        status: "CANCELED"
      }
    }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const reference = input.data?.reference as string;
    let status = (input.data?.status as string) || "PENDING";

    // Proactively verify against Wompi API
    if (reference) {
      try {
        const isTest = this.options_.environment === "test";
        const env = isTest ? "sandbox" : "production";
        const baseUrl = isTest ? "https://sandbox.wompi.co/v1" : "https://production.wompi.co/v1";
        
        const response = await fetch(`${baseUrl}/transactions?reference=${reference}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${this.options_.private_key}`
          }
        });

        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            // Wompi returns an array of transactions for the reference
            const tx = json.data[0];
            status = tx.status;
            if (input.data) {
              const dataObj = input.data as Record<string, unknown>;
              dataObj.transaction_id = tx.id;
              dataObj.status = status;
            }
          }
        }
      } catch (e) {
        console.error("Wompi Verification Error:", e);
      }
    }

    switch (status) {
      case "APPROVED":
        return { status: PaymentSessionStatus.AUTHORIZED }
      case "DECLINED":
      case "VOIDED":
      case "ERROR":
        return { status: PaymentSessionStatus.ERROR }
      case "PENDING":
        return { status: PaymentSessionStatus.PENDING }
      default:
        return { status: PaymentSessionStatus.PENDING }
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return {
      data: input.data
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return {
      data: input.data
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return {
      data: input.data || {}
    }
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    const event = payload.data as any
    const transaction = event.transaction

    let action: any = "not_supported"
    if (transaction.status === "APPROVED") action = "authorized"
    else if (transaction.status === "DECLINED" || transaction.status === "ERROR") action = "failed"

    return {
      action,
      data: {
        session_id: transaction.reference,
        amount: transaction.amount_in_cents / 100
      }
    }
  }
}
