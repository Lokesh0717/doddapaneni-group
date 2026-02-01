# Deploy to Vultr — Step-by-Step (What to Do, Where to Do It)

---

## START FROM ZERO — One Clear Path

Follow these steps **in order**. Do not skip. Each step tells you **where** you are and **what** to do.

---

### Step 1 — On your computer: Put your project on GitHub

**Where:** Your computer. Open **Terminal** (Mac) or **Command Prompt / PowerShell** (Windows).

**What:** Your website code must be on GitHub so the server can download it later.

1. Go to https://github.com and sign in (or create an account).
2. Click the **+** at the top right → **New repository**.
3. Repository name: `doddapaneni-group`. Leave other options default. Click **Create repository**.
4. On your computer, open Terminal and go to your project folder:
   ```bash
   cd /Users/lokesh/Downloads/doddapaneni-group
   ```
5. Run these (replace `YOUR_GITHUB_USERNAME` with your real GitHub username):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/doddapaneni-group.git
   git push -u origin main
   ```
6. If it asks for username/password, use your GitHub username and a **Personal Access Token** (not your normal password). You can create a token in GitHub → Settings → Developer settings → Personal access tokens.

**Done when:** You see your code on GitHub when you open `https://github.com/YOUR_GITHUB_USERNAME/doddapaneni-group`.

---

### Step 2 — On your computer: Get Gmail App Password (for contact form)

**Where:** Your computer, in a browser.

**What:** The contact form sends email. Gmail needs a special “App Password,” not your normal password.

1. Go to https://myaccount.google.com and sign in.
2. Go to **Security** → **2-Step Verification** (turn it on if it’s off).
3. Then go to **Security** → **App passwords** (or search “App passwords” in Google account).
4. Create an app password for “Mail.” Copy the 16-character password and keep it somewhere safe (you will use it in Step 9).

**Done when:** You have a 16-character App Password saved.

---

### Step 3 — In the browser: Create a Vultr account and a server

**Where:** Your computer, in a browser.

**What:** You need a Vultr account and one server (a small cloud computer) where the website will run.

1. Go to https://www.vultr.com.
2. Sign up or log in.
3. Click **Deploy New Server** (or **+ Deploy**).
4. Choose:
   - **Server type:** Cloud Compute.
   - **Location:** Any city (e.g. New York, London, Bangalore).
   - **Image:** Ubuntu 22.04 LTS.
   - **Plan:** $6/month (1 GB RAM) or $12/month (2 GB RAM — better for building).
5. Leave the rest as default. Click **Deploy Now**.
6. Wait 1–2 minutes until the server status is **Running**.
7. Click on the server. You will see **IP Address** and **Password**. Copy the **IP Address** (e.g. `123.45.67.89`) and the **Password**. Save them — you need them in the next steps.

**Done when:** You have a server IP (e.g. `123.45.67.89`) and the root password.

---

### Step 4 — On your computer: Connect to the server

**Where:** Your computer. Open **Terminal** (or PowerShell).

**What:** You will “SSH” into the server — that means your Terminal will run commands on the server instead of on your computer.

1. Run this (replace `123.45.67.89` with your real server IP from Step 3):
   ```bash
   ssh root@123.45.67.89
   ```
2. If it says “Are you sure you want to continue connecting?” type `yes` and press Enter.
3. When it asks for a password, paste the **root password** from Step 3 (right-click to paste in Terminal). Press Enter. You won’t see the password as you type — that’s normal.

**Done when:** You see a prompt like `root@localhost:~#`. From now on, you are typing **on the server**.

---

### Step 5 — On the server: Install required software

**Where:** Same Terminal window — you are still connected to the server (you see `root@...`).

**What:** Install Node.js (to run the app), Git (to download your code), and Nginx (to serve the website to the internet).

Copy and paste each block below, one at a time. Press Enter after each block.

**Block 1 — Update system and install Git and Nginx:**
```bash
apt update && apt upgrade -y
apt install -y curl git nginx
```

**Block 2 — Install Node.js 20:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

**Block 3 — Check versions (you should see numbers like v20.x and 10.x):**
```bash
node -v
npm -v
```

**Done when:** `node -v` and `npm -v` show version numbers with no errors.

---

### Step 6 — On the server: Download your code and build the app

**Where:** Same Terminal, still on the server.

**What:** Get your code from GitHub and build the Next.js app.

Replace `YOUR_GITHUB_USERNAME` with your real GitHub username, then run:

**Block 1 — Go to a folder and clone your repo:**
```bash
cd /var/www
git clone https://github.com/YOUR_GITHUB_USERNAME/doddapaneni-group.git
cd doddapaneni-group
```

**Block 2 — Install dependencies and build (this may take 1–2 minutes):**
```bash
npm ci
npm run build
```

**Done when:** The build finishes without errors (you see “Compiled successfully” or similar).

---

### Step 7 — On the server: Add your email settings

**Where:** Same Terminal, on the server. You must be in the project folder (`/var/www/doddapaneni-group`).

**What:** Create a file `.env.local` with your Gmail so the contact form can send email.

1. Run:
   ```bash
   nano .env.local
   ```
2. Type or paste these two lines (use your real Gmail and the 16-character App Password from Step 2):
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```
   (Remove spaces in the App Password if you paste it with spaces.)
3. Save and exit: press **Ctrl+O**, then **Enter**, then **Ctrl+X**.

**Done when:** The file is saved and you are back at the command prompt.

---

### Step 8 — On the server: Start the app with PM2

**Where:** Same Terminal, on the server, in the folder `/var/www/doddapaneni-group`.

**What:** PM2 keeps your app running. Without it, the app would stop when you close the Terminal.

Run these one by one:

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

If `pm2 startup` prints a long line starting with `sudo env PATH=...`, copy that **entire** line, run it, then run `pm2 save` again.

Check that it’s running:
```bash
pm2 status
```
You should see `doddapaneni-group` with status **online**.

**Done when:** `pm2 status` shows the app as **online**.

---

### Step 9 — On the server: Configure Nginx (so people can open your site in a browser)

**Where:** Same Terminal, on the server.

**What:** Nginx will receive requests from the internet and forward them to your app (which runs on port 3000).

**9a — Create the config file:**
```bash
nano /etc/nginx/sites-available/doddapaneni-group
```

**9b — Paste this whole block** (if you have a domain, change `yourdomain.com` to your domain; if you only have the server IP, change the second line to `server_name 123.45.67.89;` with your real IP):

```
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save and exit: **Ctrl+O**, **Enter**, **Ctrl+X**.

**9c — Enable the site and reload Nginx:**
```bash
ln -s /etc/nginx/sites-available/doddapaneni-group /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

**Done when:** `nginx -t` says “syntax is ok” and there are no errors.

---

### Step 10 — On your computer: Open your website in a browser

**Where:** Your computer. Open **Chrome, Safari, or any browser**.

**What:** Visit your site.

- If you used a **domain** in Step 9: open `http://yourdomain.com`
- If you used only the **server IP**: open `http://123.45.67.89` (use your real IP)

**Done when:** You see your Doddapaneni Group website. Deployment is complete.

---

### Step 11 — Optional: Add HTTPS (padlock) if you use a domain

**Where:** On the server (same SSH session). Only do this if you have a real domain pointing to your server.

**What:** Get a free SSL certificate so your site uses `https://` and shows a padlock.

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts (enter email, agree to terms). Then open `https://yourdomain.com` in the browser.

---

### When you change the code later

**Where:** On the server, in Terminal (SSH in first with `ssh root@YOUR_SERVER_IP`).

**What:** Update the app with the latest code from GitHub.

```bash
cd /var/www/doddapaneni-group
git pull
npm ci
npm run build
pm2 restart doddapaneni-group
```

---

## Summary: What You Did

| Step | Where        | What you did |
|------|--------------|--------------|
| 1    | Your computer | Put code on GitHub |
| 2    | Your computer | Got Gmail App Password |
| 3    | Browser (Vultr) | Created server, got IP and password |
| 4    | Your computer | Connected to server with SSH |
| 5    | Server        | Installed Node, Git, Nginx |
| 6    | Server        | Cloned repo, ran npm ci and npm run build |
| 7    | Server        | Created .env.local with email |
| 8    | Server        | Started app with PM2 |
| 9    | Server        | Configured Nginx |
| 10   | Browser       | Opened your site |

---

## PART A: Before You Start (detailed)

**WHERE:** Your computer (this project folder)

**WHAT TO DO:**

1. Push your code to GitHub (or GitLab):
   - If you haven’t already: create a repo on GitHub, then in your project folder run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/doddapaneni-group.git
   git push -u origin main
   ```
   - Replace `YOUR_USERNAME` with your GitHub username. Use your repo URL if it’s different.

2. Have these ready:
   - Your **Gmail address** and a **Gmail App Password** (for the contact form).
   - Your **domain name** (e.g. `doddapaneni-group.com`), or you can use the server IP first.

---

## PART B: Create the Server on Vultr

**WHERE:** Your browser → https://www.vultr.com

**WHAT TO DO:**

1. Log in to Vultr.
2. Click **“Deploy New Server”** (or “+” / “Add Server”).
3. Choose:
   - **Server type:** Cloud Compute.
   - **Location:** Pick a city (e.g. closest to you or your users).
   - **Image:** Ubuntu 22.04 LTS (or 24.04).
   - **Plan:** At least **1 GB RAM** (2 GB is better for building the app).
4. Leave other options as default (or add SSH key if you use one).
5. Click **“Deploy”**.
6. Wait until the server status is **“Running”**.
7. Copy the **IP address** shown (e.g. `123.45.67.89`). You will use this as “YOUR_SERVER_IP”.

---

## PART C: Point Your Domain to the Server (Only If You Use a Domain)

**WHERE:** Your domain registrar (where you bought the domain, e.g. GoDaddy, Namecheap, Cloudflare).

**WHAT TO DO:**

1. Open DNS settings for your domain.
2. Add (or edit) an **A record**:
   - **Name/Host:** `@` (or leave blank for root domain).
   - **Value/Points to:** YOUR_SERVER_IP (the Vultr server IP from Part B).
   - **TTL:** 300 or default.
3. Optionally add another A record for `www`:
   - **Name/Host:** `www`
   - **Value:** YOUR_SERVER_IP.
4. Save. Wait 5–30 minutes for DNS to update. You can skip this and use only the IP for now.

---

## PART D: Connect to the Server and Install Software

**WHERE:** Your computer — open **Terminal** (Mac/Linux) or **PowerShell / Command Prompt** (Windows). You will run commands that connect to the Vultr server.

**WHAT TO DO:**

1. Connect to the server (replace `YOUR_SERVER_IP` with the real IP):
   ```bash
   ssh root@YOUR_SERVER_IP
   ```
   - If it asks “Are you sure you want to continue connecting?” type `yes` and press Enter.
   - Enter the root password (Vultr shows it in the server details; copy it).

2. You are now **on the Vultr server**. Run these commands **one by one** (copy-paste each block, press Enter):

   **Update the system and install Git and Nginx:**
   ```bash
   apt update && apt upgrade -y
   apt install -y curl git nginx
   ```

   **Install Node.js 20:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   ```

   **Check it worked (you should see version numbers):**
   ```bash
   node -v
   npm -v
   ```

---

## PART E: Put Your Code on the Server and Build

**WHERE:** Still on the Vultr server (same SSH session as Part D).

**WHAT TO DO:**

1. Go to a folder where you want the app (e.g. `/var/www`):
   ```bash
   cd /var/www
   ```

2. Clone your repo (replace `YOUR_GITHUB_USERNAME` and repo name if different):
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/doddapaneni-group.git
   cd doddapaneni-group
   ```

3. Install dependencies and build the app:
   ```bash
   npm ci
   npm run build
   ```
   - This can take 1–2 minutes. If it finishes without errors, the build is done.

---

## PART F: Add Email Settings on the Server

**WHERE:** Still on the Vultr server. You must be in the project folder: `cd /var/www/doddapaneni-group` if you’re not.

**WHAT TO DO:**

1. Create the env file:
   ```bash
   nano .env.local
   ```

2. Type or paste these two lines (use your real Gmail and App Password):
   ```text
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

3. Save and exit:
   - Press `Ctrl + O`, then Enter (save).
   - Press `Ctrl + X` (exit).

4. Do **not** share this file or commit it to Git. It stays only on the server.

---

## PART G: Run the App with PM2

**WHERE:** Still on the Vultr server, in the project folder (`/var/www/doddapaneni-group`).

**WHAT TO DO:**

1. Install PM2 (process manager so the app keeps running):
   ```bash
   npm install -g pm2
   ```

2. Start the app:
   ```bash
   pm2 start ecosystem.config.cjs
   ```

3. Save the process list and enable PM2 on reboot:
   ```bash
   pm2 save
   pm2 startup
   ```
   - For `pm2 startup`, it may print a command like `sudo env PATH=... pm2 startup ...`. Copy that whole line, run it, then run `pm2 save` again.

4. Check that it’s running:
   ```bash
   pm2 status
   ```
   - You should see `doddapaneni-group` with status “online”.

---

## PART H: Set Up Nginx So the World Can Access Your Site

**WHERE:** Still on the Vultr server.

**WHAT TO DO:**

1. Create the Nginx config file:
   ```bash
   nano /etc/nginx/sites-available/doddapaneni-group
   ```

2. Paste this entire block (then change `yourdomain.com` to your real domain, or use your server IP as below):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   - If you don’t have a domain yet, change the second line to:
     `server_name YOUR_SERVER_IP;` (use your real Vultr IP).

3. Save and exit: `Ctrl + O`, Enter, then `Ctrl + X`.

4. Enable the site and reload Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/doddapaneni-group /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```
   - If `nginx -t` says “syntax is ok”, you’re good.

---

## PART I: Open Your Site in the Browser

**WHERE:** Your computer — open a **browser** (Chrome, Safari, etc.).

**WHAT TO DO:**

1. In the address bar type:
   - **If you use a domain:** `http://yourdomain.com`
   - **If you use only the server IP:** `http://YOUR_SERVER_IP`

2. You should see your Doddapaneni Group website. If you see it, deployment is done.

---

## PART J: Add HTTPS (Optional but Recommended)

**WHERE:** On the Vultr server (SSH). Do this only if you use a real domain (not just IP) and DNS already points to the server.

**WHAT TO DO:**

1. Install Certbot:
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. Get a free SSL certificate (replace with your domain):
   ```bash
   certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. Follow the prompts (email, agree to terms). Certbot will configure HTTPS and renewal.

4. In the browser, open `https://yourdomain.com` — it should show a padlock.

---

## Full Terminal Commands (Copy-Paste Reference)

Replace before running:
- `YOUR_GITHUB_USERNAME` → your GitHub username (or full repo URL)
- `YOUR_SERVER_IP` → Vultr server IP (e.g. 123.45.67.89)
- `yourdomain.com` → your domain (or use YOUR_SERVER_IP in Nginx)
- `your-email@gmail.com` and `your-app-password` → real Gmail and App Password

---

### 1) ON YOUR COMPUTER — Push code to GitHub (if not done yet)

```bash
cd /Users/lokesh/Downloads/doddapaneni-group
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/doddapaneni-group.git
git branch -M main
git push -u origin main
```

---

### 2) ON YOUR COMPUTER — Connect to Vultr server

```bash
ssh root@YOUR_SERVER_IP
```

(Enter the root password when asked. You are now on the server.)

---

### 3) ON VULTR SERVER — Update system and install Git, Nginx

```bash
apt update && apt upgrade -y
apt install -y curl git nginx
```

---

### 4) ON VULTR SERVER — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

---

### 5) ON VULTR SERVER — Check Node and npm

```bash
node -v
npm -v
```

---

### 6) ON VULTR SERVER — Go to web folder and clone repo

```bash
cd /var/www
git clone https://github.com/YOUR_GITHUB_USERNAME/doddapaneni-group.git
cd doddapaneni-group
```

---

### 7) ON VULTR SERVER — Install dependencies and build

```bash
npm ci
npm run build
```

---

### 8) ON VULTR SERVER — Create .env.local (contact form email)

```bash
nano .env.local
```

In the editor, type or paste these two lines (use your real email and Gmail App Password):

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Save and exit: press `Ctrl+O`, Enter, then `Ctrl+X`.

---

### 9) ON VULTR SERVER — Install PM2 and start the app

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

If `pm2 startup` prints a command starting with `sudo env PATH=...`, copy that full line, run it, then run `pm2 save` again.

---

### 10) ON VULTR SERVER — Check app is running

```bash
pm2 status
```

---

### 11) ON VULTR SERVER — Create Nginx config file

```bash
nano /etc/nginx/sites-available/doddapaneni-group
```

Paste this entire block (change `yourdomain.com` to your domain, or use your server IP):

```
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

If you have no domain yet, change the second line to:

```
    server_name YOUR_SERVER_IP;
```

Save and exit: `Ctrl+O`, Enter, then `Ctrl+X`.

---

### 12) ON VULTR SERVER — Enable site and reload Nginx

```bash
ln -s /etc/nginx/sites-available/doddapaneni-group /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### 13) Optional — ON VULTR SERVER — HTTPS with Let’s Encrypt (only if you use a domain)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### 14) Later — ON VULTR SERVER — Update app after code changes

```bash
cd /var/www/doddapaneni-group
git pull
npm ci
npm run build
pm2 restart doddapaneni-group
```

---

## Quick Reference: Where Each Step Happens

| Step | Where | What |
|------|--------|------|
| A | Your computer | Push code to GitHub, have Gmail App Password and domain ready |
| B | Browser → Vultr | Create server, note IP |
| C | Domain registrar | Point domain A record to server IP (optional) |
| D | Your Terminal → SSH to server | Connect to server, install Node, Git, Nginx |
| E | On server (SSH) | Clone repo, `npm ci`, `npm run build` |
| F | On server (SSH) | Create `.env.local` with EMAIL_USER, EMAIL_PASS |
| G | On server (SSH) | `pm2 start ecosystem.config.cjs`, `pm2 save`, `pm2 startup` |
| H | On server (SSH) | Create Nginx config, enable site, `nginx -t`, `systemctl reload nginx` |
| I | Your browser | Open http://YOUR_SERVER_IP or http://yourdomain.com |
| J | On server (SSH) | Optional: `certbot --nginx` for HTTPS |

---

## When You Update the Code Later

**WHERE:** On the Vultr server, in the project folder.

**WHAT TO DO:**

```bash
cd /var/www/doddapaneni-group
git pull
npm ci
npm run build
pm2 restart doddapaneni-group
```

---

## Troubleshooting

- **502 Bad Gateway:** App not running. On server run: `pm2 status` and `pm2 restart doddapaneni-group`.
- **Contact form doesn’t send email:** On server, check `.env.local` has correct `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password).
- **Can’t connect with SSH:** Check the server is “Running” in Vultr and you’re using the correct IP and root password.
