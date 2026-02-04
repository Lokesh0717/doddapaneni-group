# Login and dashboards

The app uses **MongoDB** (suggested database name: `doddapaneni_group`). Set `DATABASE_URL` or `MONGODB_URI` in `.env.local` before running `db:reset` or logging in.

**Important:** Login emails must be **unique across all roles**. Each user (Super Admin, Admin, Developer, Digital Marketer) must have a different email. The API and database enforce this.

## Reset database and start from scratch

Run this once to clear all users and login logs, and create one user per role (4 distinct emails):

```bash
npm run db:reset
```

## Test logins (stored in database)

After running `npm run db:reset`, you have 4 users—one per role, each with a **different email**:

| Role             | Email                            | Password |
|------------------|----------------------------------|----------|
| **Super Admin**  | `superadmin@doddapaneni-group.com` | `123`    |
| **Admin**        | `admin@doddapaneni-group.com`      | `123`    |
| **Developer**    | `developer@doddapaneni-group.com`  | `123`    |
| **Digital Marketer** | `marketer@doddapaneni-group.com` | `123`    |

1. Open **http://localhost:3000/en/login** (or your locale, e.g. `/te/login`).
2. Sign in with the email and password for the role you want.
3. You will be redirected to that role’s dashboard (Super Admin, Admin, Developer, or Digital Marketer).

Super Admin can create Admin, Developer, and Digital Marketer users (each must use a **new, unique email**), and see visit stats and employees.

## Website visits (stored in database)

- **Recording:** Each time someone opens a public page (home, about, services, etc.), a visit is stored in the **Visit** collection in MongoDB (`visitedAt`).
- **Who can see stats:** Only **Super Admin** and **Admin** (when logged in) can view visit statistics.
- **Where it appears:** The **Website visits** block on both the Super Admin and Admin dashboards.
- **What is shown:**
  - **Total (from start)** – total visits since the first recorded visit
  - **Average per month** – visits per month over the period since the first visit
  - **Average per year** – visits per year over the same period
  - **First visit** – date of the first recorded visit
  - **By year** and **By month** – breakdown of visits by year and by month

All visit data is stored in the database and the dashboards load it from the API (`/api/visits/stats`).

## Test Admin / Developer / Digital Marketer login

After `npm run db:reset`, use the table above to sign in as Admin, Developer, or Digital Marketer with their distinct email and password `123`. Or run `npm run db:seed` to add any missing role users (each with a different email). When creating users from the dashboard, **each new user must have an email that is not already used** by any other user.

## Create Developer / Digital Marketer (or Admin, if Super Admin)

1. As Super Admin or Admin, go to **Dashboard** and click **Manage employees**.
2. Click **Add employee**.
3. Enter:
   - **Email** (must be **unique**—not used by any other user, e.g. `developer@example.com`)
   - **Password** (at least 6 characters)
   - **Name** (optional)
   - **Role**: Admin / Developer / Digital Marketer (Super Admin only can create Admin)
4. Click **Create**.

The new user is stored with a unique email. If you use an email that already exists for another role, the API returns: *"This email is already in use. Each login must use a different email across all roles."*

## Developer: how to change the code

After logging in as **Developer**, open the Developer dashboard. You change the site by editing the code in your editor (Cursor/VS Code), not from the browser. See **docs/DEVELOPER_GUIDE.md** for step-by-step: clone/run, which files to edit (Home, About, Services, Contact, translations), and how to test and deploy.

## Log in as Developer or Digital Marketer

1. Sign out (or use a different browser/incognito).
2. Go to **/en/login**.
3. Enter the **email** and **password** you set when creating the user.
4. You will be redirected to:
   - **Developer dashboard** if the role is Developer
   - **Digital Marketer dashboard** if the role is Digital Marketer

## If login still fails

1. Run `npm run db:reset` again to get the 4 default users (each with a different email, password `123`).
2. Use the table above to sign in as the role you need.
3. When creating new users, always use an **email that is not already used** by any other user.
4. Sign out and log in with that new email and password.
