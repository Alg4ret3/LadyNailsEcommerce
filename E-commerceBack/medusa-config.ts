import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  modules: {
    brand: {
      resolve: "./src/modules/brand",
    },
    warranty: {
      resolve: "./src/modules/warranty",
    },
    usage: {
      resolve: "./src/modules/usage",
    },
    shipping: {
      resolve: "./src/modules/shipping",
    },
    review: {
      resolve: "./src/modules/review",
    },
    auth: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },

    notification: {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              api_key: process.env.RESEND_API_KEY,
              from: "LadyNails <no-reply@visiontreepasto.com>",
              channels: ["email"],
            },
          },
        ],
      },
    },

    payment: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/wompi",
            id: "wompi",
            options: {
              public_key: process.env.WOMPI_PUBLIC_KEY,
              private_key: process.env.WOMPI_PRIVATE_KEY,
              integrity_key: process.env.WOMPI_INTEGRITY_KEY,
              environment: "test",
            },
          },
        ],
      },
    },
  },
});
