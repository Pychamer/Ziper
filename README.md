# 🌲 Ziper v1.1.0 RELEASE

A powerful client-side JavaScript bookmarklet that injects a floating control panel into any webpage. Features include page manipulation tools, AI chat assistance, games, screen effects, and custom JavaScript execution.

## ✨ Features

### 📌 Basic Features
- **🌈 Rainbow Mode** - Cycles page background through vibrant colors
- **📜 History Flooder** - Floods browser history with entries
- **✏️ Edit Page Mode** - Makes any page editable
- **🌐 Translate Page** - Opens page in Google Translate
- **🎥 Video Speed Toggle** - Controls video playback speed

### 🛠️ Advanced Tools
- **🖱️ AutoClicker** - Automatic clicking at custom CPS (1-1000)
- **🎭 Tab Disguise** - Disguises tab as Google Drive
- **🎮 Blooket GUI** - Zip-On's working Blooket hacks implementation
- **⏱️ Timer Controller** - Advanced video speed control (0.1-16x)

### 🎉 Fun Features (NEW!)
- **🌀 Spin Spin** - Rotates the entire page continuously
- **🧱 Minecraft Mode** - Transforms page into pixelated Minecraft-style
- **🖐️ Move Anything** - Click and drag any element on the page

### 🖥️ Screen Effects (NEW!)
- **💫 Blur Screen** - Applies blur filter to entire page
- **⚫ Grayscale** - Converts page to black and white
- **🟤 Sepia Tone** - Vintage sepia filter effect
- **🌈 Hue Rotate** - Animated rainbow color shift
- **☀️ Brightness** - Increases page brightness
- **🔆 High Contrast** - Enhances contrast for better visibility

### 🎮 Built-in Games (NEW!)
- **🧱 Breakout** - Classic brick-breaking game with arrow key controls
- **🐍 Snake Game** - Collect food and grow your snake
- **🏓 Pong** - Play against AI opponent (W/S controls)
- **🟦 Tetris** - Classic falling blocks puzzle game
- **🚀 Space Shooter** - Shoot enemies and dodge attacks

### ⚡ Custom JS Runner (NEW!)
- **Custom Code Execution** - Run your own JavaScript code
- **Safety Warning** - Built-in warning about code execution risks
- **Example Templates** - Pre-filled code examples to get started
- **Error Handling** - Clear error messages when code fails

### 💬 AI Chat Assistant
- **Powered by Hugging Face** - SmolLM2-360M-Instruct model
- **Free to Use** - No API costs
- **Smart Error Handling** - Clear feedback for all scenarios
- **30-Second Timeout** - Prevents hanging requests

### ⚙️ Theme Customization (NEW!)
- **5 Color Themes** - Choose from Matrix Green, Ocean Blue, Royal Purple, Fire Red, or Sunset Orange
- **Persistent Selection** - Your theme choice is saved and restored on reload
- **Full Widget Styling** - All colors update including buttons, borders, and backgrounds
- **Minimized State Support** - Themes respect the stealth blue minimized appearance

## 🎨 UI Design

- **Customizable Themes** - Choose from 5 color schemes in Settings tab
- **Matrix Green Theme** - Default inspired by classic terminal aesthetics
- **Tabbed Interface** - Organized navigation (Chat, Features, Custom, Settings)
- **Sub-Tab Organization** - Basic, Tools, Fun, Screen, and Games sections
- **Responsive Design** - Adapts to different screen sizes
- **Modern Animations** - Smooth transitions and hover effects
- **Scrollable Content** - Handles many features gracefully

## 🚀 Installation

### Bookmarklet Method (Recommended)
1. Open `bookmarklet.txt` in this repository
2. Copy the GitHub loader code (starts with `javascript:`)
3. Create a new bookmark in your browser
4. Paste the code as the URL of the bookmark
5. Click the bookmark on any webpage to activate Ziper

**Note:** Use the PR branch version for testing latest features, or main branch for stability.

### Browser Console Method
1. Open Developer Tools (F12)
2. Go to Console tab
3. Copy and paste the contents of `Ziper.js`
4. Press Enter

## 📋 Usage

1. Click the Ziper bookmark/button
2. A green widget appears in the bottom-right corner
3. Navigate through tabs:
   - **💬 Chat** - AI conversation interface
   - **🔧 Features** - Organized into sub-tabs:
     - **📌 Basic** - Core page manipulation
     - **🛠️ Tools** - Advanced utilities
     - **🎉 Fun** - Page effects and transformations
     - **🖥️ Screen** - Visual filters and effects
     - **🎮 Games** - Built-in mini-games
   - **⚡ Custom** - Custom JavaScript code runner
   - **⚙️ Settings** - Configuration, version info, and theme customization

### ⌨️ Keyboard Shortcuts & Controls
- **Ctrl+R** - Minimize/Maximize Ziper widget
- **Minimize Button (−/+)** - Click in header to toggle minimize/maximize
- **Minimized Mode**: 
  - Shows only "ZP" text (no "Ziper" or BETA badge)
  - Dark blue theme (barely noticeable)
  - Reduced opacity (70%)
  - Compact size for minimal screen space

## 🎮 Game Controls

- **Breakout**: Arrow keys to move paddle, ESC to close
- **Snake**: Arrow keys to control direction, ESC to close
- **Pong**: W/S keys to move paddle, ESC to close
- **Tetris**: Arrow keys to move, Space to drop, ESC to close
- **Space Shooter**: Arrow keys to move, Space to shoot, ESC to close

## 🙏 Credits & Attributions

This project incorporates features from several amazing open-source projects:

### Bookmarklet Features
- **AutoClicker & Tab Disguise** - From [TheRealMrGamz/Bookmarklets](https://github.com/TheRealMrGamz/Bookmarklets)
  - Thank you for the collection of useful school and fun bookmarklets!
- **Screen Effects** - Inspired by [DevBubba/Bookmarklets](https://github.com/DevBubba/Bookmarklets)
  - CSS filter effects for creative page manipulation

### Game Hacks
- **Blooket GUI** - From [Zip-On/Zips-Blooket-Hacks-And-Cheats-GUI](https://github.com/Zip-On/Zips-Blooket-Hacks-And-Cheats-GUI)
  - Working implementation by Zip-On
  - Comprehensive Blooket game hacks and cheats
  - Works in both console and bookmarklet

### Fun Features
- **Spin Spin, Minecraft Mode, Move Anything** - From FLameHub HTML bookmarklet collection
  - Creative page transformation effects

### Inspiration
- **UI Design** - Inspired by [pickle69420/picklebox](https://github.com/pickle69420/picklebox)
  - The tabbed interface and modern design aesthetic
- **Timer Controller** - Inspired by Greasyfork video speed control scripts
  - Advanced video manipulation and ad-skipping functionality
- **AI Integration** - Powered by Hugging Face SmolLM2-360M-Instruct
  - Free AI inference API for chat assistance

## ⚠️ Disclaimer

This tool is for **educational purposes only**. Use responsibly and in accordance with your school/organization's policies. Game hacks should only be used in educational contexts to understand web security. The authors are not responsible for any misuse of this software.

**Important Notes:**
- Some features only work on specific websites (e.g., Blooket hacks only work on blooket.com)
- Using game hacks may violate terms of service
- Fun effects and screen filters are harmless and reversible
- AI chat requires internet connection and may take 20-30 seconds on first request
- Custom JS runner can execute arbitrary code - use with caution!

## 🔒 Security

- ✅ XSS protection implemented
- ✅ Safe DOM manipulation
- ✅ No external data collection
- ✅ Runs entirely client-side
- ✅ CodeQL security scan passed
- ⚠️ Custom JS runner allows arbitrary code execution (by design)

## 📝 License

This project is released into the public domain under the Unlicense.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Version:** v1.1.0 RELEASE  
**Last Updated:** January 2026  
**Maintained by:** Pychamer & Contributors
