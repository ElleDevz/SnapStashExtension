# SnapStash Quick Reference

## 🔗 Important Links

**Your Landing Page**: https://YOUR_USERNAME.github.io/SnapStashExtension

**Your Repository**: https://github.com/YOUR_USERNAME/SnapStashExtension

**Chrome Extensions Page**: chrome://extensions

---

## 📂 File Directory

```
SnapStashExtension/
├── Extension Files (run in Chrome)
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── Landing Page (GitHub Pages)
│   ├── index.html
│   ├── index.css
│   └── index.js
├── Documentation
│   ├── README_NEW.md (read this first!)
│   ├── GITHUB_SETUP.md (setup guide)
│   └── SETUP_SUMMARY.md (this is here!)
└── Config
    ├── manifest.json
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Git Commands Cheat Sheet

### First Time Setup
```bash
cd /Users/ellec/Downloads/SnapStashExtension
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SnapStashExtension.git
git push -u origin main
```

### Push Updates
```bash
git add .
git commit -m "Your message here"
git push
```

### Check Status
```bash
git status
```

---

## 🔴 Landing Page Won't Show?

1. Wait 2 minutes (GitHub takes time)
2. Check: Settings → Pages → Shows "✓ Your site is live"
3. Try hard refresh: Cmd+Shift+R
4. Clear browser cache

---

## 🔴 Extension Won't Load?

1. Go to `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select `/Users/ellec/Downloads/SnapStashExtension`
5. Should appear with icon in your toolbar

---

## 🔴 Demo Items Won't Save?

1. Open DevTools: F12
2. Check Console for errors
3. Clear browser cache
4. Try in Incognito mode
5. Check localStorage is enabled

---

## 🟢 How to Update Your Code

### Update Extension Code
1. Edit `popup.html`, `popup.js`, or `popup.css`
2. Go to `chrome://extensions`
3. Click refresh icon on SnapStash card
4. Changes apply immediately

### Update Landing Page
1. Edit `index.html`, `index.css`, or `index.js`
2. Run:
   ```bash
   git add .
   git commit -m "Update landing page"
   git push
   ```
3. Wait 1 minute, refresh your landing page
4. Changes appear live!

---

## 🎨 Customization Tips

### Change Extension Title Color
Edit `popup.css`:
```css
h1 {
    color: #NEW_COLOR_HERE;
}
```

### Change Extension Background
Edit `popup.css`:
```css
.container {
    background: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
}
```

### Add New Category
Edit `popup.html`:
```html
<option value="NewCategory">New Category</option>
```

### Change Landing Page Title
Edit `index.html`:
```html
<h1 class="hero-title">
    <span class="diamond">◆</span> NEW TITLE <span class="diamond">◆</span>
</h1>
```

---

## 📊 What's Using What Storage?

| Storage | Purpose | Persistence | Scope |
|---------|---------|-------------|-------|
| `chrome.storage.local` | Real extension data | ✅ Persists forever | 🔒 Extension only |
| `localStorage` | Landing page demo | ✅ Persists until cleared | 🌍 Website only |

---

## 🆘 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Extension won't install" | Enable Developer mode in chrome://extensions |
| "Demo items disappear" | Clear cache or use Incognito mode |
| "Landing page blank" | Wait 2 minutes, then refresh |
| "Color changed to dark" | Hard refresh (Cmd+Shift+R) |
| "GitHub says 403 error" | Check repo is Public, not Private |

---

## 💡 Pro Tips

1. **Test in Incognito**: chrome://extensions → Click "Allow in Incognito"
2. **Use DevTools**: F12 in popup to debug extension
3. **Check Manifest**: If extension breaks, check manifest.json syntax
4. **Branch Before Big Changes**: `git checkout -b feature-name`
5. **Share Your Work**: GitHub link is perfect for portfolios!

---

## 📱 GitHub Pages for Portfolio

This is a great portfolio piece because:
- ✅ Shows UI/UX design (landing page)
- ✅ Shows JavaScript skills (extension + demo)
- ✅ Shows Git/GitHub skills (version control)
- ✅ Shows Chrome API knowledge (manifest v3)
- ✅ Shows problem-solving (color matching, storage)

**Share the GitHub Pages link** in your portfolio! 🚀

---

Last Updated: January 8, 2026
