# Deployment — Ready for Hosting

This app is set up for production deployment.

## Build and run

```bash
npm ci
npm run build
npm start
```

## Required environment variables

Copy `.env.example` and set values. **Production requires:**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas) or your server) |
| `AUTH_SECRET` | NextAuth secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your public URL (e.g. `https://yourdomain.com`) |

Optional: `EMAIL_USER`, `EMAIL_PASS` (contact form and login emails).  
For the seed script: `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME`.

## First-time setup (create Super Admin)

After deploying, create the first user (once):

```bash
node scripts/reset-and-seed.mjs
```

Requires `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME` in `.env.local`.

## Health check

Platforms can use **GET /api/health** — returns `200` with `{ "status": "ok" }`.

## Hosting options

- **Hostinger:** See [docs/DEPLOY_HOSTINGER.md](docs/DEPLOY_HOSTINGER.md) — **Node.js Web App** (Business/Cloud) from GitHub, or **VPS** manual setup with PM2 and Nginx. Use MongoDB Atlas for the database.
- **Vercel:** Connect repo, set env vars (use MongoDB Atlas for `DATABASE_URL`), deploy. Set **Health Check** to `/api/health` if available.
- **Railway / Render / Fly.io:** Connect repo, add MongoDB (or Atlas), set env vars, build command `npm run build`, start command `npm start`.

## Post-deploy

- Use HTTPS (e.g. Let’s Encrypt on VPS; automatic on Vercel/Railway).
- Keep `AUTH_SECRET` and `DATABASE_URL` secret; never commit them.
