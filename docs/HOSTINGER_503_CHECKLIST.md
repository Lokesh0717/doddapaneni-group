# Hostinger 503 — What to check and how to get logs

## 1. No red line? Build may be OK — check these instead

- **Two kinds of logs:** Build log = output of `npm run build`. If there's no red line, the build is probably succeeding. The 503 is often because the **app process** isn't running. Look for a **second** log section: **"Application"**, **"Runtime"**, **"Process"**, or **"Server"** logs (after the build). That's where startup errors appear.
- **Paste what you see:** Copy the **last 20–30 lines** of the build log and paste them here (even if there's no error). Also paste any text from an Application/Runtime/Process log if you have one.
- **Start command (very important):** In the same Deployments / Node.js app settings, check if there is a **"Start command"** or **"Run command"** or **"Command"** field (separate from "Build command"). If it's empty or says `npm run dev`, set it to **`npm start`**, save, and redeploy. If Hostinger never runs `npm start`, the site will 503 with no error in the build log.

## 2. Where to find "Start command" (and if you don't see it)

- **During first setup:** When you add the Node.js app (GitHub or upload), **Step 6** is **"Configure Build Settings"**. Look for a **Build settings** dropdown or form. Some panels show only **Build command** (e.g. `npm run build`); others also show **Start command** or **Run command**. If you see a start/run field, set it to **`npm start`**.
- **After deployment:** Open the website → **Settings & Redeploy** (or **Deployments** → **Settings & Redeploy**). Check every section (Build, Run, Advanced, etc.). If there is a **Start** / **Run** / **Command** field, set it to **`npm start`** and redeploy.
- **If there is no Start command anywhere:** Hostinger's Node.js flow may not expose it. They often **auto-detect** Next.js and run `npm start` after the build. In that case the 503 is likely from the **app crashing at runtime** (e.g. missing env, MongoDB, or port). Check **Application / Runtime / Process** logs (see section 1), and ensure **Build command** is exactly **`npm run build`** and that all env vars (especially `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`) are set. If you still can't find runtime logs, ask Hostinger support: "After a successful build, what command do you run to start the app, and where can I see runtime/application logs?"

## 3. Verify deployment settings

| Setting | Correct value |
|--------|----------------|
| **Build command** | `npm run build` |
| **Start / Run command** | `npm start` (only if Hostinger shows this field) |
| **Output directory** | `.next` (or leave default for Next.js) |
| **Node version** | 20.x |

## 4. Environment variables (must be set in Hostinger)

⚠️ **Critical formatting rules:**
- **No quotes** around values (Hostinger may read quotes as part of the value)
- **No trailing slashes** in URLs
- **Exact match** — copy these values exactly

- **DATABASE_URL** = `mongodb+srv://lokeshreddykusam_db_user:iybUfjhzTE4vmqou@doddapanenigroup.veteuqk.mongodb.net/doddapaneni_group?retryWrites=true&w=majority&appName=doddapanenigroup`
- **AUTH_SECRET** = `3VihJiE6wlWfl5O7Ri2YkXGeqm/haJ1e/A/6selABTk=` (lowercase `l` in `Wfl5`, no quotes)
- **NEXTAUTH_URL** = `https://lightblue-mule-433546.hostingersite.com` (or your domain `https://doddapanenigroup.net` - no trailing slash, no quotes, must start with `https://`)
- **AUTH_TRUST_HOST** = `true` (required on some hosts/proxies; fixes Auth.js ClientFetchError / config errors)

## 5. After changing anything

Click **Save and redeploy**, wait for the deployment to finish, then try the preview URL again.

## 6. Everything set correctly, still 503?

- **Redeploy with the latest code** – The project's `start` script is now `next start -H 0.0.0.0` so the server listens on all interfaces (required on many cloud hosts). Pull the latest changes, then redeploy on Hostinger.
- **Test `/api/health`** – After redeploy, open `https://your-preview-url.hostingersite.com/api/health`. If you see `{"status":"ok"}`, the app is running and the 503 may be only on the homepage (routing). If `/api/health` also returns 503, the Node process is not staying up.
- **MongoDB Atlas** – In Atlas → your cluster → **Network Access**, ensure **0.0.0.0/0** (allow from anywhere) is there so Hostinger's IPs can connect. Without it, the app can crash when the first request hits a page that uses the DB.
- **Ask Hostinger for runtime logs** – Request "application" or "runtime" logs (not just build logs) for your Node.js app. A crash message there (e.g. MongoDB timeout, ECONNREFUSED, out of memory) will tell us the exact fix.

## 7. Getting 500 errors (app is running but APIs fail)

If you see 500 errors on `/api/auth/session`, `/api/visit`, `/api/content/*`, etc.:

- **Check env var formatting in Hostinger:**
  - `AUTH_SECRET` must be **exactly** `3VihJiE6wlWfl5O7Ri2YkXGeqm/haJ1e/A/6selABTk=` (no quotes, no spaces)
  - `NEXTAUTH_URL` must be **exactly** `https://lightblue-mule-433546.hostingersite.com` (no trailing slash `/`, no quotes)
  - `DATABASE_URL` should match the MongoDB Atlas URI exactly (no quotes)

- **MongoDB Atlas Network Access:**
  - Go to Atlas → your cluster → **Network Access**
  - Ensure there is an entry for **0.0.0.0/0** (allow from anywhere) so Hostinger's servers can connect
  - If missing, click **Add IP Address** → **Allow Access from Anywhere** → **Confirm**

- **After fixing env vars:** Click **Save and redeploy** in Hostinger. The app will restart with the corrected values.

- **If still 500:** Check Hostinger's **application/runtime logs** for specific error messages (e.g. "AUTH_SECRET is required", MongoDB connection errors, etc.).

## 8. Fixing ClientFetchError / "There was a problem with the server configuration"

If you see `ClientFetchError` in the browser console (especially when trying to log in):

**Root cause:** NextAuth can't fetch `/api/auth/session` because the server configuration is incorrect (usually behind a reverse proxy like Hostinger).

**Solution:**

1. ✅ **Code fix already applied:** `trustHost: true` is set in `auth.ts` (line 38). Make sure this code is deployed.

2. **Verify environment variables in Hostinger** (Settings & Redeploy → Environment Variables):
   - `AUTH_SECRET` = `3VihJiE6wlWfl5O7Ri2YkXGeqm/haJ1e/A/6selABTk=` (no quotes, no spaces)
   - `NEXTAUTH_URL` = `https://lightblue-mule-433546.hostingersite.com` (exact URL, no trailing slash, must start with `https://`)
   - `DATABASE_URL` = your MongoDB Atlas URI (no quotes)

3. **Redeploy** after verifying/setting env vars correctly.

4. **Test the session endpoint directly:**
   - Open `https://lightblue-mule-433546.hostingersite.com/api/auth/session` in your browser
   - Should return `{}` (empty object) if not logged in, or `{"user":...}` if logged in
   - If you see 500, check Hostinger's **runtime/application logs** for the exact error

5. **If error persists after redeploy:**
   - Check Hostinger logs for: "AUTH_SECRET is required", "Invalid NEXTAUTH_URL", or MongoDB connection errors
   - Verify MongoDB Atlas → Network Access has `0.0.0.0/0` (allow from anywhere)
   - Contact Hostinger support: "My NextAuth `/api/auth/session` endpoint returns 500. Where can I see application/runtime logs?"

**Note:** The `trustHost: true` setting tells NextAuth to trust the Host header from Hostinger's reverse proxy. This is required for NextAuth to work correctly behind proxies.
