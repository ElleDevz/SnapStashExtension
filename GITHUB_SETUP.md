# GitHub Setup Guide for SnapStash

Follow these steps to push your SnapStash extension to GitHub and enable GitHub Pages.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named **`SnapStashExtension`**
3. Choose **Public** (to enable GitHub Pages)
4. Do NOT initialize with README (we have one)
5. Click **Create Repository**

## Step 2: Initialize Git Locally

Open Terminal in your project directory (`/Users/ellec/Downloads/SnapStashExtension`) and run:

```bash
git init
git add .
git commit -m "Initial commit: SnapStash Chrome Extension"
git branch -M main
git remote add origin https://github.com/yourusername/SnapStashExtension.git
git push -u origin main
```

Replace `yourusername` with your actual GitHub username.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Select **Pages** from left sidebar
4. Under "Source", select **Deploy from a branch**
5. Select **main** branch
6. Select **/ (root)** folder
7. Click **Save**

GitHub will automatically deploy `index.html` as your landing page!

## Step 4: Update Links

Replace `yourusername` in these files with your actual GitHub username:

1. **index.html** - Line with `href="https://github.com/yourusername/SnapStashExtension"`
2. **README_NEW.md** - Two links with your username

## Step 5: Access Your Landing Page

Your SnapStash landing page will be live at:
```
https://yourusername.github.io/SnapStashExtension
```

Wait 1-2 minutes for GitHub Pages to build and deploy.

## Step 6: Test Everything

1. Visit your landing page URL
2. Try the interactive demo (save, delete, clear items)
3. Follow the installation instructions to load the real extension
4. Test the extension in Chrome

## Troubleshooting GitHub Pages

**Page not showing?**
- Wait 2-3 minutes (GitHub Pages takes time to build)
- Check "Actions" tab to see build status
- Verify Settings > Pages shows "✓ Your site is live"

**Demo not working?**
- Check browser console (F12) for errors
- Clear browser cache
- Hard refresh (Cmd+Shift+R on Mac)

**Wrong username in links?**
- Edit the files and commit/push again
- Changes should appear within 1 minute

## Future Updates

To push updates to GitHub:

```bash
git add .
git commit -m "Your commit message"
git push
```

Changes to landing page appear within 1 minute.
Changes to extension code require reinstalling in Chrome (chrome://extensions).

---

Need help? Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
