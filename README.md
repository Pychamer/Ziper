# TimeMed - Medication Reminder Website

A modern, clean website showcasing the TimeMed medication reminder invention project by Ranish Sapkota and Andrew Noda.

## 🌐 Live Website

**View the website online:** `https://pychamer.github.io/Ziper/`

The website is automatically deployed to GitHub Pages whenever changes are pushed to the repository.

## 🎨 Design Features

- **Simple Black & Gray Theme**: Clean, professional design with solid colors
- **Multiple Pages**: Separate pages for better navigation (Home, About, Story, Parts, Design)
- **Smooth Animations**: Fade-ins, slide-ins, hover effects, and transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Card-based layouts and interactive elements
- **Fullscreen Image Gallery**: Click any image to view it fullscreen

## 📁 Project Structure

```
/
├── index.html          # Home page
├── about.html          # About Us page
├── story.html          # Our Story page
├── parts.html          # Parts List page
├── design.html         # Design Process page
├── assets/
│   ├── css/
│   │   └── styles.css  # Main stylesheet
│   ├── js/
│   │   └── main.js     # JavaScript for interactions
│   └── images/         # Project images and GIFs
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment workflow
```

## 🚀 GitHub Pages Deployment

This website is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings > Pages
   - Source: GitHub Actions
   
2. **Push changes** to trigger deployment:
   ```bash
   git add .
   git commit -m "Update website"
   git push
   ```

3. **View your site** at:
   - `https://[username].github.io/[repository-name]/`
   - For this repo: `https://pychamer.github.io/Ziper/`

### Deployment Status

The deployment workflow runs automatically on:
- Push to `main` branch
- Push to `copilot/create-website-for-oc-maker` branch
- Manual workflow dispatch

Check the "Actions" tab in your GitHub repository to see deployment status.

## 🖼️ Adding Your Images

### Method 1: Add to GitHub

1. Place your images/GIFs in the `assets/images/` folder
2. Update the HTML to reference your images

Example in `design.html`:
```html
<div class="image-box">
    <img src="assets/images/your-image.jpg" alt="Description" class="gallery-image">
</div>
```

### Supported Image Formats
- `.jpg` / `.jpeg`
- `.png`
- `.gif` (for animations)
- `.svg`
- `.webp`

## 🎯 Pages Overview

### 1. Home Page (`index.html`)
- Hero section with call-to-action buttons
- Key features grid
- CTA section

### 2. About Us (`about.html`)
- Team member profiles (Ranish Sapkota & Andrew Noda)
- Mission statement

### 3. Our Story (`story.html`)
- Project origin story
- Timeline of development
- Project motivation

### 4. Parts List (`parts.html`)
- Component categories
- Technical specifications

### 5. Design Process (`design.html`)
- Development stages
- Prototype gallery with fullscreen modal
- Tools & software used
- Link to Google Drive prototypes

## 🎨 Color Scheme

Simple black and gray palette for a clean, professional look:

```css
:root {
    --primary: #333333;          /* Medium gray */
    --dark: #1a1a1a;             /* Dark gray */
    --light: #666666;            /* Light gray */
    --accent: #4a4a4a;           /* Accent gray */
    --dark-bg: #000000;          /* Pure black */
    --darker-bg: #0a0a0a;        /* Near black */
    --card-bg: #1a1a1a;          /* Card background */
}
```

## ✨ Interactive Features

- **Mobile Menu**: Hamburger menu for mobile devices
- **Smooth Scrolling**: Animated scroll between sections
- **Hover Effects**: Cards lift on hover
- **Page Transitions**: Fade-in animations on load
- **Fullscreen Image Modal**: Click any gallery image to view fullscreen
- **Keyboard Support**: Press Escape to close fullscreen modal

## 🖥️ Local Development

### Option 1: Direct File Access
Simply open any `.html` file in your web browser.

### Option 2: Local Server
```bash
# Using Python 3
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click any HTML file
3. Select "Open with Live Server"

## 📱 Responsive Breakpoints

- Desktop: 1200px and above
- Tablet: 768px - 1199px
- Mobile: Below 768px

## 🎬 Adding GIFs

GIFs work the same as images:

```html
<img src="assets/images/your-animation.gif" alt="Animation" class="gallery-image">
```

For optimal performance:
- Keep GIF file sizes under 5MB
- Use compressed GIFs when possible
- Consider using video formats (.mp4) for longer animations

## 🛠️ Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 To-Do

- [x] Set up GitHub Pages deployment
- [x] Add fullscreen image modal
- [x] Create responsive design
- [x] Add all prototype images
- [ ] Add more design process images (as needed)

## 👥 Team

- **Ranish Sapkota** - Co-Creator & Developer
- **Andrew Noda** - Co-Creator

## 📄 License

See LICENSE file for details.

---

**Making medication management easier for everyone** 💊

