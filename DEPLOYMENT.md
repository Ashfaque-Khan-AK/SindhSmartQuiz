# Deployment Guide — Netlify + Back4App + MongoDB Atlas

This project is deployed as two services:

```
Browser
  │
  ├── React frontend  ──►  Netlify
  │                         https://<site>.netlify.app
  │
  └── /api/v1 requests ──►  Express API on Back4App Containers
                            https://<app>.b4a.run/api/v1
                                      │
                                      └──►  MongoDB Atlas
```

The repository already contains:

- `server/Dockerfile` — builds the API for Back4App.
- `server/.dockerignore` — keeps `.env` and `node_modules` out of the image.
- `netlify.toml` — builds the React app from `client/` and adds the SPA redirect.

---

## 1. Create the MongoDB Atlas database

1. Sign in to <https://cloud.mongodb.com>.
2. Create a project, then create a free **M0** cluster.
3. Create a database user:
   - **Database Access → Add New Database User**
   - Use a strong password.
   - Give the user **Read and write to any database** for this project (or restrict it to `sindh_smart_quiz`).
4. Allow network access:
   - **Network Access → Add IP Address**
   - For Back4App Containers, add `0.0.0.0/0` because container egress IPs are not fixed.
   - This is acceptable for a small demo if the database password is strong. For stricter security, use a private endpoint or a fixed-IP proxy.
5. Get the connection string:
   - **Database → Connect → Drivers**
   - Choose Node.js.
   - Copy the `mongodb+srv://...` string.
6. Add the database name before the `?`:

```text
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/sindh_smart_quiz?retryWrites=true&w=majority
```

If your password contains `@`, `:`, `/`, `?`, `#` or `%`, URL-encode it. For example, `@` becomes `%40`.

### Seed Atlas

The seed script reads `MONGODB_URI` from `server/.env`.

1. Back up your local `server/.env`.
2. Temporarily set:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/sindh_smart_quiz?retryWrites=true&w=majority
```

3. From the project root, run:

```bash
npm run seed
```

This creates the grades, subjects, topics, 200 questions, achievements, admin account and demo students in Atlas.

4. If you only need the admin account:

```bash
npm run seed:admin
```

5. Restore your local `server/.env` afterward if you still use local MongoDB.

> `npm run seed:fresh` deletes all application data first. Do not use it against a database you want to keep.

---

## 2. Deploy the Express API to Back4App Containers

### 2.1 Prepare Back4App

1. Create a free account at <https://www.back4app.com>.
2. Install the **Back4App Containers** GitHub App and grant it access to:
   `https://github.com/Ashfaque-Khan-AK/SindhSmartQuiz`
3. In the Back4App dashboard, choose **Create New App → Containers as a Service**.

### 2.2 Configure the deployment

Use these values:

| Setting | Value |
|---|---|
| Repository | `Ashfaque-Khan-AK/SindhSmartQuiz` |
| Branch | `main` |
| Root | `server` |
| App name | e.g. `sindh-smart-quiz-api` |
| Auto deployment | ON |

The **Root** must be `server`, because that folder contains `Dockerfile` and `package.json`.

### 2.3 Add environment variables

Add these in the Back4App environment-variable form:

```env
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/sindh_smart_quiz?retryWrites=true&w=majority
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-SITE.netlify.app
```

Generate a JWT secret locally with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Important:

- Do **not** add `server/.env` to Git. It is already ignored.
- `CLIENT_URL` must be the exact frontend origin, including `https://`, with **no trailing slash**.
- You can allow more than one frontend origin with a comma-separated value:

```env
CLIENT_URL=https://sindhsmartquiz.netlify.app,https://www.yourdomain.com
```

- If you do not know the Netlify URL yet, use a temporary value such as `https://example.com`, then update it after Netlify creates the site and redeploy the backend.

### 2.4 Deploy

1. Click **Create App**.
2. Watch **Deployments → Logs** until the status is **Ready**.
3. Open the app URL from the dashboard. It looks like:

```text
https://<app-name>-<username>.b4a.run
```

4. Test the API:

```text
https://<app-name>-<username>.b4a.run/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is healthy",
  "data": { "status": "healthy" }
}
```

The API root should also return a small JSON response:

```text
https://<app-name>-<username>.b4a.run/
```

### 2.5 Back4App troubleshooting

- **Health check failed / 502:** check the deployment logs.
- **Port error:** the app must listen on `PORT`. The included Dockerfile sets `PORT=8080` and exposes `8080`; keep `PORT=8080` in Back4App as well.
- **MongoDB connection error:** check the Atlas connection string, the database user password, and Atlas Network Access.
- **CORS error in the browser:** set `CLIENT_URL` to the exact Netlify URL and redeploy.
- **Out of memory on free tier:** the free plan has limited RAM; the API itself is lightweight, but check logs if the container restarts.

---

## 3. Deploy the React frontend to Netlify

### 3.1 Create the Netlify site

1. Sign in to <https://app.netlify.com>.
2. Choose **Add new site → Import an existing project**.
3. Connect GitHub and select `Ashfaque-Khan-AK/SindhSmartQuiz`.
4. Netlify should read `netlify.toml` automatically.

If it does not, set:

| Setting | Value |
|---|---|
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `dist` (relative to `client`) |
| Node version | `20` |

The repository's `netlify.toml` already sets the base to `client`, the publish directory to `dist`, and adds the React Router redirect.

### 3.2 Add the API URL

In **Site configuration → Environment variables**, add:

```env
VITE_API_URL=https://<app-name>-<username>.b4a.run/api/v1
```

Use the Back4App URL from step 2.4, and include `/api/v1`.

`VITE_API_URL` is read at **build time**. After changing it, trigger a new deploy:

**Deploys → Trigger deploy → Clear cache and deploy site.**

### 3.3 Deploy

1. Click **Deploy site**.
2. Wait for the build to finish.
3. Open the generated URL, for example:

```text
https://sindhsmartquiz.netlify.app
```

### 3.4 Update CORS

After Netlify gives you the final site URL:

1. Go back to the Back4App app.
2. Set:

```env
CLIENT_URL=https://sindhsmartquiz.netlify.app
```

3. Redeploy/restart the Back4App app.
4. Hard-refresh the Netlify site.

Without this step, the browser will block API requests with a CORS error.

### 3.5 Netlify troubleshooting

- **404 after refreshing `/student/dashboard`:** the SPA redirect is missing. Keep the `[[redirects]]` rule in `netlify.toml` or add `/* → /index.html` with status `200`.
- **API calls go to the Netlify domain:** `VITE_API_URL` is missing or was not present during the build. Add it and redeploy with cache cleared.
- **Login works but API returns CORS error:** update Back4App `CLIENT_URL` to the exact Netlify URL.
- **Old build still visible:** clear the Netlify cache and redeploy.

---

## 4. Verify the complete deployment

Run these checks in order:

1. `https://<backend>.b4a.run/api/v1/health` returns `healthy`.
2. `https://<netlify-site>.netlify.app` loads the landing page.
3. Student login works with a seeded student.
4. Admin login works at `/admin/login`:

```text
Email:    admin@sindhsmartquiz.pk
Password: Admin@12345
```

5. Start a quiz, submit it, and confirm the result page loads.
6. Open **Admin → Dashboard** and confirm counts and charts load.
7. Refresh a student route such as `/student/leaderboard` and confirm it still loads (SPA redirect check).
8. Check the browser DevTools **Network** tab: API requests should go to `b4a.run`, not `netlify.app`.

---

## 5. Custom domains (optional)

### Netlify

1. **Domain management → Add a domain**.
2. Follow the DNS instructions.
3. After the custom domain works, add it to Back4App:

```env
CLIENT_URL=https://yourdomain.com,https://www.yourdomain.com
```

4. Redeploy Back4App.

### Back4App

1. Open the app → **Settings → Domain**.
2. Add your API domain, for example `api.yourdomain.com`.
3. Add the DNS records Back4App shows.
4. In Netlify, change:

```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

5. Redeploy Netlify.

---

## 6. Deployment checklist

- [ ] Atlas cluster created
- [ ] Atlas database user created
- [ ] Atlas network access allows Back4App
- [ ] Atlas seeded with `npm run seed`
- [ ] Back4App GitHub app installed
- [ ] Back4App Root set to `server`
- [ ] Back4App environment variables added
- [ ] Back4App deployment ready
- [ ] Backend health endpoint works
- [ ] Netlify site connected to GitHub
- [ ] `VITE_API_URL` added in Netlify
- [ ] Netlify deploy successful
- [ ] Back4App `CLIENT_URL` updated to Netlify URL
- [ ] Student login tested
- [ ] Admin login tested
- [ ] Quiz submission tested
- [ ] Admin dashboard tested
- [ ] Direct route refresh tested
- [ ] `.env` never committed
