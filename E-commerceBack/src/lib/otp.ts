import { Resend } from 'resend';
import Redis from 'ioredis';
import path from 'path';
import fs from 'fs';

// TODO: Inject config properly or use environment variables directly
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const resendApiKey = process.env.RESEND_API_KEY;

// Use a singleton pattern or export functions to avoid multiple connections if not using DI
const redis = new Redis(redisUrl);
const resend = new Resend(resendApiKey);

const logoPath = path.join(process.cwd(), "static/logo.png");
const logoBuffer = fs.readFileSync(logoPath);

export const OtpService = {
    async generate(email: string): Promise<string> {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const key = `otp:${email}`;
        await redis.set(key, code, 'EX', 600); // 10 minutes

        // Send email
        try {
            if (!resendApiKey) {
                console.warn('RESEND_API_KEY is not set. OTP will be logged only.');
                console.log(`[OTP] For ${email}: ${code}`);
                return code;
            }

            await resend.emails.send({
                from: 'NariñoTex <no-reply@visiontreepasto.com>',
                to: email,
                subject: 'Tú código de verificación para activar tu cuenta en NariñoTex',
                html: `
                <div style="
                    max-width: 480px;
                    margin: 0 auto;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    color: #111827;
                    background-color: #dddbdbff;
                    border-radius: 10px;
                    padding: 24px;
                ">

                    <!-- LOGO -->
                    <div style="text-align:center; margin-bottom: 20px;">
                        <img 
                            src="cid:logo@narino"
                            alt="NariñoTex"
                            width="225"
                            style="display:block; margin:0 auto;"
                        />
                    </div>

                    <h2 style="margin-bottom: 16px; font-size: 22px;">
                    Verifica tu correo electrónico
                    </h2>

                    <p style="margin-bottom: 16px; font-size: 14px; color: #374151;">
                    Utilice el código de verificación a continuación para continuar:
                    </p>

                    <div style="
                    text-align: center;
                    margin: 24px 0;
                    ">
                    <span style="
                        display: inline-block;
                        font-size: 32px;
                        letter-spacing: 6px;
                        font-weight: 700;
                        padding: 12px 20px;
                        background-color: #f3f4f6;
                        border-radius: 8px;
                    ">
                        ${code}
                    </span>
                    </div>

                    <p style="font-size: 13px; color: #6b7280;">
                    Este código caduca en <strong>10 minutos</strong>.
                    </p>

                    <hr style="
                    margin: 24px 0;
                    border: none;
                    border-top: 1px solid #e5e7eb;
                    " />

                    <p style="font-size: 12px; color: #9ca3af;">
                    Si no solicitó este correo electrónico, puede ignorarlo con seguridad.
                    </p>
                </div>
                `,
                attachments: [
                    {
                        filename: 'logo.png',
                        content: logoBuffer.toString('base64'),
                        contentType: 'image/png',
                        contentId: 'logo@narino'
                    }
                ]
            });
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new Error('Failed to send verification email');
        }

        return code;
    },

    async verify(email: string, code: string): Promise<boolean> {
        const key = `otp:${email}`;
        const stored = await redis.get(key);
        if (stored === code) {
            await redis.del(key);
            return true;
        }
        return false;
    }
};
