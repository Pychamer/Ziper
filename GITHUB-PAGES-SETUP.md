# 🌐 GitHub Pages Setup Guide

This guide will help you get your TimeMed website live on GitHub Pages!

## 📋 Quick Setup Steps

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/Pychamer/Ziper`
2. Click on **Settings** (gear icon in the top menu)
3. In the left sidebar, click on **Pages**
4. Under "Build and deployment":
   - **Source**: Select "**GitHub Actions**"
   
That's it! The workflow is already configured and ready to go.

### Step 2: Merge This Pull Request

1. Go to the **Pull Requests** tab
2. Find the PR titled "Add GitHub Pages deployment workflow and update README"
3. Click **Merge pull request**
4. Confirm the merge

### Step 3: Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, you'll see a green checkmark ✅

### Step 4: Access Your Website

Your website will be live at:
```
https://pychamer.github.io/Ziper/
```

## 🔄 How Automatic Deployment Works

The workflow will automatically deploy your website whenever you:
- Push changes to the `main` branch
- Push changes to the `copilot/create-website-for-oc-maker` branch
- Manually trigger the workflow from the Actions tab

## 🛠️ Manual Deployment

If you ever need to manually trigger a deployment:

1. Go to the **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click the **Run workflow** button
4. Select the branch you want to deploy
5. Click **Run workflow**

## 📁 What Gets Deployed

Everything in your repository is deployed as-is:
- ✅ All HTML pages (index, about, story, parts, design)
- ✅ All CSS and JavaScript files
- ✅ All images in the `assets/images/` folder
- ✅ All other assets

## 🔍 Checking Deployment Status

### In the Actions Tab:
- **Running** (yellow dot): Deployment in progress
- **Success** (green checkmark): Website is live!
- **Failed** (red X): Something went wrong (check the logs)

### In the Pages Settings:
After first deployment, you'll see:
- Your site URL
- Last deployment time
- Deployment status

## 🚨 Troubleshooting

### Issue: "Pages" option not visible in Settings
**Solution**: You may need admin access to the repository. Contact the repository owner.

### Issue: Workflow fails
**Solution**: 
1. Check the Actions tab for error messages
2. Ensure GitHub Pages is enabled (Source: GitHub Actions)
3. Check repository permissions

### Issue: Website shows 404
**Solution**: 
1. Wait a few minutes after first deployment
2. Clear your browser cache
3. Make sure the URL is correct: `https://pychamer.github.io/Ziper/`

### Issue: Images not loading
**Solution**: 
1. Check that images are in the `assets/images/` folder
2. Verify image paths in HTML are relative (e.g., `assets/images/photo.jpg`)
3. Ensure image files are committed to the repository

## 🎯 Updating Your Website

To update your website after it's live:

1. Make changes to your HTML, CSS, or add images
2. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```
3. The workflow will automatically run
4. Changes will be live in 1-2 minutes!

## 📱 Sharing Your Website

Once live, share your website URL:
```
https://pychamer.github.io/Ziper/
```

You can:
- Add it to your GitHub repository description
- Share it on social media
- Include it in presentations
- Send it to teachers or judges

## 🎉 Success!

Once you see your website live, you're all set! The website will automatically update whenever you push changes to GitHub.

---

**Need Help?** Check the Actions tab in your repository for deployment logs and status.
