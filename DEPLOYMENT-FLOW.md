# 🚀 GitHub Pages Deployment Flow

This document explains how your website gets deployed to GitHub Pages.

## Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PROCESS                        │
└─────────────────────────────────────────────────────────────┘

1. CODE CHANGE
   ├─ You push code to GitHub
   │  ├─ Update HTML/CSS/JS
   │  ├─ Add new images
   │  └─ Modify content
   │
   ▼

2. TRIGGER WORKFLOW
   ├─ GitHub Actions detects push
   │  ├─ Branch: main OR copilot/create-website-for-oc-maker
   │  └─ Workflow: .github/workflows/deploy.yml
   │
   ▼

3. BUILD & PREPARE
   ├─ Checkout repository
   │  └─ Get all files from GitHub
   ├─ Setup Pages
   │  └─ Configure GitHub Pages environment
   └─ Create artifact
      └─ Package all website files
   │
   ▼

4. DEPLOY TO PAGES
   ├─ Upload to GitHub Pages
   │  ├─ HTML files
   │  ├─ CSS/JavaScript
   │  ├─ Images
   │  └─ Other assets
   │
   ▼

5. WEBSITE LIVE! 🎉
   └─ Available at: https://pychamer.github.io/Ziper/
```

## What Gets Deployed

```
Repository Root (/)
│
├── index.html          ──▶  Home page
├── about.html          ──▶  About Us page
├── story.html          ──▶  Our Story page
├── parts.html          ──▶  Parts List page
├── design.html         ──▶  Design Process page
│
└── assets/
    ├── css/
    │   └── styles.css  ──▶  All styling
    ├── js/
    │   └── main.js     ──▶  Interactive features
    └── images/         ──▶  All images & GIFs
```

## Deployment Triggers

### Automatic Triggers
- ✅ Push to `main` branch
- ✅ Push to `copilot/create-website-for-oc-maker` branch

### Manual Trigger
- ✅ Run workflow from Actions tab
  1. Go to Actions
  2. Select "Deploy to GitHub Pages"
  3. Click "Run workflow"

## Deployment Timeline

```
Push Code → Workflow Starts → Build (30s) → Deploy (30s) → Live!
                                                              │
                                                              └─ Total: ~1-2 minutes
```

## Monitoring Deployment

### Check Status
1. **Actions Tab**
   - See workflow runs
   - View logs
   - Check for errors

2. **Pages Settings**
   - View last deployment
   - See live URL
   - Check deployment history

### Status Indicators
- 🟡 Yellow dot: In progress
- ✅ Green check: Success!
- ❌ Red X: Failed (check logs)

## After Deployment

Your website will be available at:
```
https://pychamer.github.io/Ziper/
```

All pages will work:
- `/` or `/index.html` → Home
- `/about.html` → About Us
- `/story.html` → Our Story
- `/parts.html` → Parts List
- `/design.html` → Design Process

## Making Updates

To update your live website:

```bash
# 1. Make changes to your files
git add .

# 2. Commit your changes
git commit -m "Update website content"

# 3. Push to GitHub
git push

# 4. Wait ~1-2 minutes
# Your changes are now live!
```

## Security & Permissions

The workflow has these permissions:
- ✅ Read repository contents
- ✅ Write to GitHub Pages
- ✅ Manage deployments

These are required for the deployment to work.

## Troubleshooting

### Deployment Fails
1. Check Actions tab for error logs
2. Verify Pages is enabled (Settings > Pages)
3. Ensure Source is set to "GitHub Actions"

### Website Not Updating
1. Check if workflow ran successfully
2. Clear browser cache
3. Wait full 2 minutes for propagation

### 404 Error
1. Verify repository name in URL
2. Check that Pages is enabled
3. Ensure deployment completed successfully

---

**Need Help?** Check the Actions tab for detailed logs of each deployment.
