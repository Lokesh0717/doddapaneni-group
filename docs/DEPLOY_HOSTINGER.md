# Deploy to Hostinger

This guide covers two ways to deploy the Doddapaneni Group app on Hostinger.

---

## Required environment variables (all options)

Set these in your Hostinger app settings or in `.env.local` on the server. See `.env.example` in the project root.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | **Yes** | MongoDB connection string. Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) — Hostinger does not include MongoDB. |
| `AUTH_SECRET` | **Yes** | NextAuth secret. Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | **Yes** | Your site URL, e.g. `https://yourdomain.com` |
| `EMAIL_USER` | Recommended | Gmail for contact form and login emails |
| `EMAIL_PASS` | Recommended | Gmail App Password |
| `SUPER_ADMIN_EMAIL` | For first user | Used when creating the first Super Admin (see below) |
| `SUPER_ADMIN_PASSWORD` | For first user | Min 6 characters |
| `SUPER_ADMIN_NAME` | For first user | Display name |

**Creating the first Super Admin:** This app has no built-in sign-up. After deployment, you must create the first user once by running `node scripts/reset-and-seed.mjs` with the same `DATABASE_URL`. You can run it **on your local machine** (with `.env.local` pointing to your production MongoDB Atlas URL) so it creates the user in the production database.

---

# Option A — Node.js Web App (Business or Cloud hosting)

**Best for:** Easiest setup. No server management.

**Plans:** Business Web Hosting, Cloud Startup, Cloud Professional, Cloud Enterprise.

**Limitation:** You need MongoDB elsewhere (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas) free tier). Hostinger Node.js does not include a database.

---

## Step 1 — Push code to GitHub

Ensure your project is on GitHub (same as any Hostinger deploy from Git). Hostinger will clone from the repo.

---

## Step 2 — Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas), create an account, create a **free** cluster.
2. Create a database user (username + password). Note them.
3. In **Network Access**, add `0.0.0.0/0` (allow from anywhere) so Hostinger’s servers can connect.
4. Get the **connection string**: Cluster → Connect → Connect your application → copy the URI. It looks like:
   ```text
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
   ```
5. Replace `USER`, `PASSWORD`, and optionally `DATABASE_NAME` (e.g. `doddapaneni_group`). This is your `DATABASE_URL`.

---

## Step 3 — Add Node.js app in Hostinger

1. Log in to **Hostinger hPanel**.
2. Go to **Websites** → **Add Website**.
3. Select **Node.js Apps**.
4. Choose **Import Git Repository** and authorize GitHub.
5. Select the **doddapaneni-group** repository (or your fork).
6. In **Build settings**, set or confirm:
   - **Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Node.js version:** 20.x (or 18.x / 22.x if 20 is not available).
7. Add **Environment variables** in the Hostinger UI (look for “Environment”, “Env vars”, or “App configuration” in the Node.js app settings). Add at least:
   - `DATABASE_URL` = your Atlas connection string
   - `AUTH_SECRET` = output of `openssl rand -base64 32`
   - `NEXTAUTH_URL` = your site URL (Hostinger will give you a temporary URL first; use that, then update when you attach your domain).
   - Optionally: `EMAIL_USER`, `EMAIL_PASS`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME`.
8. Click **Deploy**.

Your app will be built and started. It will get a temporary URL (e.g. `https://something.hostinger.site`).

---

## Step 4 — Set NEXTAUTH_URL and attach domain

1. In the Node.js app settings, set **NEXTAUTH_URL** to the exact URL where the app is served (the temporary URL or your custom domain).
2. To use your own domain: In hPanel, use “Connect domain” or “Point domain” to attach your domain to this website. Then set **NEXTAUTH_URL** to `https://yourdomain.com`.

---

## Step 5 — Create the first Super Admin user

Hostinger Node.js apps usually do not let you run arbitrary scripts on the server. So create the first user **from your computer** using the **same** MongoDB database:

1. On your **local machine**, in the project folder, create or edit `.env.local` and set **only** the variables needed for the script and for connecting to **production** MongoDB:
   ```text
   DATABASE_URL=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/doddapaneni_group?retryWrites=true&w=majority
   SUPER_ADMIN_EMAIL=your-admin@example.com
   SUPER_ADMIN_PASSWORD=your-secure-password
   SUPER_ADMIN_NAME=Your Name
   ```
2. Run once:
   ```bash
   node scripts/reset-and-seed.mjs
   ```
   This clears the production DB and creates one Super Admin. **Do this only once** (or when you intentionally want to reset and recreate that user).
3. Log in at **https://your-site-url/en/login** (or `/te/login`, etc.) with the email and password you set.

---

## Updating the app (Option A)

Push changes to GitHub. In hPanel, open your Node.js app and use **Redeploy** or **Deploy** so Hostinger runs a new build and restart.

---

# Option B — Hostinger VPS (manual setup)

**Best for:** Full control, or if you are on a VPS plan and not using the managed Node.js app.


**Short version:**

1. **Get a Hostinger VPS** (e.g. KVM1 — 4 GB RAM). Choose **Ubuntu 22.04 or 24.04**. Note the IP and root password.
2. **Point your domain** to the VPS IP with an **A record**.
3. **Connect via SSH:** `ssh root@YOUR_VPS_IP`
4. **Install Node.js 20 and PM2:**
   ```bash
   apt update && apt install -y curl git nginx
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   npm install -g pm2
   ```
5. **Clone, install, build:**
   ```bash
   cd /var/www
   git clone https://github.com/YOUR_USERNAME/doddapaneni-group.git
   cd doddapaneni-group
   npm ci
   npm run build
   ```
6. **Create `.env.local`** with `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`, `EMAIL_*`, `SUPER_ADMIN_*` (see table at the top).
7. **Create first user:** `node scripts/reset-and-seed.mjs`
8. **Start with PM2:** `pm2 start ecosystem.config.cjs` then `pm2 save` and `pm2 startup`.
9. **Configure Nginx** as reverse proxy to `http://127.0.0.1:3000` (see Nginx config in this repo’s docs if needed).
10. **HTTPS:** `apt install -y certbot python3-certbot-nginx` then `certbot --nginx -d yourdomain.com -d www.yourdomain.com`.


---

## Summary

| Step | Option A (Node.js app) | Option B (VPS) |
|------|------------------------|----------------|
| Where | hPanel → Websites → Add → Node.js Apps | SSH into VPS |
| Code | GitHub (or upload ZIP) | git clone |
| DB | MongoDB Atlas only | Atlas or MongoDB on same VPS |
| Env vars | In Hostinger Node.js app settings | `.env.local` on server |
| First user | Run `reset-and-seed.mjs` locally with prod `DATABASE_URL` | Run on server: `node scripts/reset-and-seed.mjs` |
| Process manager | Managed by Hostinger | PM2 |
| HTTPS | Usually automatic with Hostinger | Certbot + Nginx |

After deployment, open **https://your-site/en/login** and sign in with the Super Admin account you created.
