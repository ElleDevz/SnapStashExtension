# SnapStash Extension 🛍️

A smart shopping list Chrome extension that helps you organize and save shopping links by category.

**🌐 [Live Demo & Landing Page](https://yourusername.github.io/SnapStashExtension)**

## Features

✨ **6 Smart Categories**: Books • Clothes • Shoes • Electronics • Pets • Health

⚡ **One-Click Save**: Save any URL instantly while browsing

💾 **Persistent Storage**: Your shopping list syncs across browser sessions

🎨 **Beautiful UI**: Modern, futuristic design with salmon + cyan color scheme

🗂️ **Easy Management**: Delete individual items or clear your entire list

## Installation

### Option 1: Load Locally (Recommended)

1. **Clone or Download** this repository
2. Go to `chrome://extensions` in your browser
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `SnapStashExtension` folder
6. Click the SnapStash icon in your toolbar to start using!

### Option 2: From GitHub

1. Visit the [GitHub Repository](https://github.com/yourusername/SnapStashExtension)
2. Click the green **Code** button
3. Select **Download ZIP**
4. Extract the folder
5. Follow Option 1 steps 2-6

## Project Structure

```
SnapStashExtension/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.css              # Extension styles
├── popup.js               # Extension functionality
├── index.html             # Landing page
├── index.css              # Landing page styles
├── index.js               # Landing page demo
├── images/
│   └── icon128.png        # Extension icon
├── README.md              # This file
└── prompts.md             # Original specifications
```

## How It Works

1. **While browsing** any website, click the SnapStash icon in your toolbar
2. **Select a category** from the dropdown (Books, Clothes, Shoes, etc.)
3. **Click "Save Item"** to add the current page to your shopping list
4. Your list is **automatically saved** in your browser
5. **View, manage, or delete** items anytime
6. Use **"Clear All"** to reset your list

## Technologies

- **Manifest v3** Chrome Extension API
- **Chrome Storage API** for persistent data
- **Vanilla JavaScript** (no frameworks)
- **HTML5 + CSS3** with modern design
- **Orbitron Font** for futuristic styling

## Customization

### Change Colors

Edit `popup.css`:
- Salmon gradient: `#ff7f7f` to `#ff6b6b`
- Cyan title: `#65ecf1`
- Light salmon: `#ff9a9a`

### Add More Categories

Edit `popup.html` in the `<select>` element:
```html
<option value="YourCategory">Your Category</option>
```

### Modify the Icon

Replace `images/icon128.png` with your own 128x128 PNG file.

## Landing Page

Visit the GitHub Pages landing page to:
- See an interactive demo of the extension
- Read features and installation instructions
- View the project code

The landing page is automatically served from the `index.html`, `index.css`, and `index.js` files when GitHub Pages is enabled.

## Storage

All items are stored in `chrome.storage.local` with the following structure:

```json
{
  "snapstashItems": [
    {
      "id": 1704000000000,
      "category": "Books",
      "url": "https://example.com",
      "title": "Product Page",
      "savedAt": "1/1/2024, 12:00:00 PM"
    }
  ]
}
```

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

MIT License - feel free to use this project however you'd like!

---

Made with ❤️ for smart shoppers
