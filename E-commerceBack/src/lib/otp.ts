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
                from: 'LadyNails register <no-reply@visiontreepasto.com>',
                to: email,
                subject: 'Tú código de verificación para activar tu cuenta en LadyNails',
                html: `
                <div style="
    margin:0;
    padding:60px 20px;
    background-color:#f3f2ef;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
">

    <div style="
        max-width:500px;
        margin:0 auto;
        position:relative;
    ">

        <!-- TARJETA -->
        <div style="
            background:#ffffff;
            border-radius:16px;
            padding:45px 35px;
            box-shadow:0 10px 30px rgba(0,0,0,0.04);
            text-align:center;
            position:relative;
            z-index:1;
        ">

            <!-- LÍNEA NEGRA SUPERIOR -->
            <div style="
                width:60px;
                height:3px;
                background:linear-gradient(90deg,#111111,#111111,#111111);
                margin:0 auto 30px auto;
                border-radius:2px;
            "></div>

            <!-- LOGO -->
            <div style="margin-bottom:30px;">
                <img 
                    src="cid:logo@ladynails"
                    alt="LadyNails"
                    width="170"
                    style="display:block; margin:0 auto;"
                />
            </div>

            <h2 style="
                font-size:22px;
                font-weight:500;
                color:#111111;
                margin-bottom:18px;
                letter-spacing:0.8px;
            ">
                Verifica tu correo electrónico
            </h2>

            <p style="
                font-size:14px;
                color:#666666;
                margin-bottom:32px;
            ">
                Ingresa el siguiente código para continuar
            </p>

            <!-- CÓDIGO -->
            <div style="margin:35px 0;">
                <div style="
                    display:inline-block;
                    font-size:30px;
                    letter-spacing:12px;
                    font-weight:600;
                    padding:18px 30px;
                    border:1px solid #ececec;
                    border-radius:12px;
                    background:#fafafa;
                    color:#111111;
                ">
                    ${code}
                </div>
            </div>

            <p style="
                font-size:13px;
                color:#888888;
                margin-bottom:35px;
            ">
                Este código caduca en <strong>10 minutos</strong>
            </p>

            <!-- LÍNEA NEGRA INFERIOR -->
            <div style="
                width:40px;
                height:2px;
                background:linear-gradient(90deg,#111111,#111111,#111111);
                margin:30px auto;
                border-radius:2px;
            "></div>

            <p style="
                font-size:12px;
                color:#aaaaaa;
                margin-bottom:25px;
            ">
                Si no solicitaste este correo, puedes ignorarlo con seguridad.
            </p>

            <!-- REDES SOCIALES -->
            <div style="margin-top:10px;">

                <a href="https://facebook.com/TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" style="opacity:0.7;">
                </a>

                <a href="https://instagram.com/TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" style="opacity:0.7;">
                </a>

                <a href="https://tiktok.com/@TU_USUARIO" style="margin:0 12px; text-decoration:none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" style="opacity:0.7;">
                </a>

            </div>

            <p style="
                font-size:11px;
                color:#cccccc;
                margin-top:40px;
                letter-spacing:1px;
            ">
                © 2026 LadyNails
            </p>

        </div>
    </div>
</div>
                `,
                attachments: [
                    {
                        filename: 'logo.png',
                        content: logoBuffer.toString('base64'),
                        contentType: 'image/png',
                        contentId: 'logo@ladynails'
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
