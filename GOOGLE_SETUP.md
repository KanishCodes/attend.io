# 🌐 How to Setup Google Login for attend.io

Follow these steps to get your Google Client ID and Secret.

### 1. Create a Project in Google Cloud
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the **Project Dropdown** (top left) and select **New Project**.
3. Name it `attend-io` and click **Create**.

### 2. Configure OAuth Consent Screen
1. In the left sidebar, go to **APIs & Services** > **OAuth consent screen**.
2. Select **User Type: External** and click **Create**.
3. **App Information:**
   - App name: `attend.io`
   - User support email: (Your email)
   - Developer contact info: (Your email)
4. Click **Save and Continue** (you can skip the Scopes and Test Users sections for now).

### 3. Create OAuth 2.0 Credentials
1. In the left sidebar, go to **APIs & Services** > **Credentials**.
2. Click **+ Create Credentials** at the top and select **OAuth client ID**.
3. **Application type:** Select `Web application`.
4. **Name:** `attend-io-web-client`.
5. **Authorized JavaScript origins:**
   - Click **+ Add URI** and enter: `http://localhost:3000`
6. **Authorized redirect URIs:**
   - Click **+ Add URI** and enter: `http://localhost:3000/auth/google/callback`
7. Click **Create**.

### 4. Update your .env file
Google will show you a popup with your **Client ID** and **Client Secret**. Copy them and paste them into your `.env` file in the project:

```env
GOOGLE_CLIENT_ID=your_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret_here
```

### 5. Test it!
1. Restart your server (`npm run dev`).
2. Go to `http://localhost:3000/login`.
3. Click **Continue with Google**.
4. It should log you in and redirect you to your dashboard!
