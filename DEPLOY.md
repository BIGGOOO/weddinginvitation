
# 🚀 Deployment Guide: Vercel

This project is optimized for deployment on Vercel using Vite and Native ESM.

## Prerequisites
- A [GitHub](https://github.com) account.
- A [Vercel](https://vercel.com) account.
- Your Google Gemini API Key.

## Step 1: Initialize Git
If you haven't already, initialize your repository and commit your code:
```bash
git init
git add .
git commit -m "Initial commit: Wedding Invitation AI"
```

## Step 2: Push to GitHub
1. Create a new repository on GitHub (keep it public or private).
2. Follow the instructions to push your local code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. Vercel will auto-detect **Vite** as the Framework Preset.
5. **CRITICAL STEP**: Expand the **Environment Variables** section.
   - **Key**: `API_KEY`
   - **Value**: `[Paste your Gemini API Key here]`
6. Click **Deploy**.

## Step 4: Verification
Once the deployment is complete, Vercel will provide a production URL (e.g., `wedding-invitation.vercel.app`). Open it to verify the loading animation and the AI-generated story functionality.

---
**Note for Engineers**: The project uses `process.env.API_KEY`. Vercel injects this during the build phase via the `vite.config.ts` definition, ensuring the Gemini SDK can access it securely.
