# Medication Reminder - Website

A modern, dark red themed multi-page website showcasing the Medication Reminder invention project by Ranish Sapkota and Andrew Noda.

## 🎨 Design Features

- **Dark Red Theme**: Professional dark theme with red accents (#8B0000, #DC143C)
- **Multiple Pages**: Separate pages for better navigation (Home, About, Story, Parts, Design)
- **Smooth Animations**: Fade-ins, slide-ins, hover effects, and transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Card-based layouts, gradient effects, and interactive elements

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
│   │   └── styles.css  # Main stylesheet with dark red theme
│   ├── js/
│   │   └── main.js     # JavaScript for interactions
│   └── images/         # Place your images and GIFs here
```

## 🖼️ Adding Your Images

### Method 1: Add to GitHub

1. Place your images/GIFs in the `assets/images/` folder
2. Update the HTML to reference your images

Example in `design.html`:
```html
<!-- Replace the placeholder -->
<div class="image-box">
    <img src="assets/images/your-image.jpg" alt="Description">
</div>
```

### Method 2: Use Direct Links

If your images are already hosted somewhere (like Google Drive after making them public), you can use direct URLs:

```html
<img src="YOUR_IMAGE_URL_HERE" alt="Description">
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
- Team member profiles
- Mission statement
- Animated team cards

### 3. Our Story (`story.html`)
- Project origin story
- Timeline of development
- Project motivation

### 4. Parts List (`parts.html`)
- Component categories
- Placeholder for parts information
- Coming soon sections

### 5. Design Process (`design.html`)
- Development stages
- Prototype gallery (ready for your images)
- Tools & software used
- Link to Google Drive prototypes

## 🚀 How to View

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

## 🎨 Customizing Colors

The dark red theme uses CSS variables in `assets/css/styles.css`:

```css
:root {
    --primary-red: #8B0000;      /* Dark red */
    --dark-red: #660000;         /* Darker red */
    --light-red: #A52A2A;        /* Brown-red */
    --accent-red: #DC143C;       /* Crimson accent */
    --dark-bg: #0a0a0a;          /* Dark background */
    --darker-bg: #050505;        /* Darker background */
    --card-bg: #1a1a1a;          /* Card background */
}
```

Change these values to customize the color scheme.

## ✨ Interactive Features

- **Mobile Menu**: Hamburger menu for mobile devices
- **Smooth Scrolling**: Animated scroll between sections
- **Hover Effects**: Cards lift and glow on hover
- **Page Transitions**: Fade-in animations on load
- **Parallax Hero**: Subtle parallax effect on home page
- **Button Ripples**: Material Design-style ripple effects

## 📱 Responsive Breakpoints

- Desktop: 1200px and above
- Tablet: 768px - 1199px
- Mobile: Below 768px

## 🔗 External Links

- **Google Drive Prototypes**: Already linked in the Design page
- Can add more external links as needed

## 🎬 Adding GIFs

GIFs work the same as images:

```html
<img src="assets/images/your-animation.gif" alt="Animation">
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

- [ ] Add team member photos
- [ ] Add prototype images/GIFs
- [ ] Complete parts list
- [ ] Add Andrew Noda's bio
- [ ] Add more design process images

## 👥 Team

- **Ranish Sapkota** - Co-Creator & Developer
- **Andrew Noda** - Co-Creator

## 📄 License

See LICENSE file for details.

---

**Making medication management easier for everyone** 💊
