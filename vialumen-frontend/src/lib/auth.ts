import { betterAuth } from "better-auth";
import { passkey } from "@better-auth/passkey";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: pool,
  logger: {
    disabled: false,
    level: "debug",
  },
  emailAndPassword: {
    enabled: false,
  },

  user: {
    modelName: "users",
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    additionalFields: {
      username: {
        type: "string",
        required: false,
      }
    }
  },
  session: {
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    gitlab: {
      clientId: process.env.GITLAB_CLIENT_ID!,
      clientSecret: process.env.GITLAB_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Create the clean base slug: "Mateus Diális" -> "mateus-dialis"
          const baseSlug = user.name
            .normalize("NFD")                   // Separate letters from their accents (e.g., Á -> A + ´)
            .replace(/[\u0300-\u036f]/g, "")    // Remove all those separated accent marks
            .toLowerCase()                      // Convert everything to lowercase
            .trim()                             // Remove outer spaces
            .replace(/[^a-z0-9]/g, "-")         // Replace remaining spaces/symbols with hyphens
            .replace(/-+/g, "-")                // Remove multiple consecutive hyphens
            .replace(/^-|-$/g, "");             // Strip leading/trailing hyphens

          let finalUsername = baseSlug;
          let isAvailable = false;

          // Check if the clean base slug is already taken
          const { rows } = await pool.query(
            "SELECT 1 FROM users WHERE username = $1",
            [finalUsername],
          );

          if (rows.length === 0) {
            // It's free! We can skip the loop.
            isAvailable = true;
          } else {
            // It's taken. Enter the safeguard loop to find a unique number.
            while (!isAvailable) {
              // Generate a random 5-digit number (10000 to 99999)
              const randomNum = Math.floor(10000 + Math.random() * 90000);
              finalUsername = `${baseSlug}-${randomNum}`;

              // Query the database again to see if this new combo exists
              const { rows: checkRows } = await pool.query(
                "SELECT 1 FROM users WHERE username = $1",
                [finalUsername],
              );

              // If it returns 0 rows, break the loop
              if (checkRows.length === 0) {
                isAvailable = true;
              }
            }
          }

          // Inject the unique username into the user object
          return {
            data: {
              ...user,
              username: finalUsername,
            },
          };
        },
      },
    },
  },
  plugins: [passkey()],
});
