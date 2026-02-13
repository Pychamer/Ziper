# How to Add Your Images and GIFs

This guide will help you add your images, GIFs, and other media to the website.

## 📁 Where to Put Your Files

All images and GIFs should go in the `assets/images/` folder.

```
assets/
└── images/
    ├── photo1.jpg
    ├── animation.gif
    ├── prototype.png
    └── ... (your other files)
```

## 🖼️ Adding Images to the Design Page

The Design page has 4 placeholder image boxes. Here's how to add your images:

### Step 1: Copy Your Images
Copy your image files into `assets/images/`

### Step 2: Update the HTML
Open `design.html` and find the gallery section (around line 50). Replace the placeholders:

**BEFORE:**
```html
<div class="gallery-item fade-in-up">
    <div class="image-box">
        <div class="image-placeholder">
            <span>📷</span>
            <p>Add your images to<br>assets/images/</p>
        </div>
    </div>
    <p class="image-caption">Concept Design</p>
</div>
```

**AFTER:**
```html
<div class="gallery-item fade-in-up">
    <div class="image-box">
        <img src="assets/images/your-image.jpg" alt="Concept Design">
    </div>
    <p class="image-caption">Concept Design</p>
</div>
```

### Example with Real Images

Replace all 4 placeholders with your actual images:

```html
<!-- Image 1 -->
<div class="gallery-item fade-in-up">
    <div class="image-box">
        <img src="assets/images/concept.jpg" alt="Concept Design">
    </div>
    <p class="image-caption">Concept Design</p>
</div>

<!-- Image 2 -->
<div class="gallery-item fade-in-up" style="animation-delay: 0.2s;">
    <div class="image-box">
        <img src="assets/images/3d-model.gif" alt="3D Model">
    </div>
    <p class="image-caption">3D Model</p>
</div>

<!-- Image 3 -->
<div class="gallery-item fade-in-up" style="animation-delay: 0.4s;">
    <div class="image-box">
        <img src="assets/images/prototype.png" alt="Prototype">
    </div>
    <p class="image-caption">Prototype Build</p>
</div>

<!-- Image 4 -->
<div class="gallery-item fade-in-up" style="animation-delay: 0.6s;">
    <div class="image-box">
        <img src="assets/images/testing.jpg" alt="Testing">
    </div>
    <p class="image-caption">Testing Phase</p>
</div>
```

## 🎬 Adding GIFs

GIFs work exactly the same as images! Just use the `.gif` extension:

```html
<img src="assets/images/animation.gif" alt="Animation">
```

## 🖼️ Adding Images to Other Pages

### Home Page
You can add a background image or hero image by editing `index.html`

### About Page
To add team member photos, edit `about.html` and replace the placeholder circles:

**BEFORE:**
```html
<div class="image-placeholder">RS</div>
```

**AFTER:**
```html
<img src="assets/images/ranish.jpg" alt="Ranish Sapkota" style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover;">
```

## 💡 Tips

1. **Optimize Your Images**
   - Keep file sizes under 2MB for fast loading
   - Use JPG for photos
   - Use PNG for graphics with transparency
   - Use GIF for short animations

2. **Naming Convention**
   - Use lowercase
   - Use hyphens instead of spaces
   - Be descriptive: `prototype-front-view.jpg` not `img1.jpg`

3. **Supported Formats**
   - `.jpg` / `.jpeg` - Photos
   - `.png` - Graphics with transparency
   - `.gif` - Animations
   - `.svg` - Scalable vector graphics
   - `.webp` - Modern format (smaller files)

## 🔄 Adding More Image Galleries

Want to add more images? Copy this template:

```html
<div class="gallery-grid">
    <div class="gallery-item fade-in-up">
        <div class="image-box">
            <img src="assets/images/your-image.jpg" alt="Description">
        </div>
        <p class="image-caption">Your Caption</p>
    </div>
    <!-- Add more items as needed -->
</div>
```

## 📝 Quick Checklist

- [ ] Copy images to `assets/images/` folder
- [ ] Open the HTML file you want to edit
- [ ] Find the image placeholder
- [ ] Replace with `<img src="assets/images/filename.jpg" alt="description">`
- [ ] Save the file
- [ ] Refresh your browser to see changes

## 🎨 Styling Your Images

Images automatically get these styles:
- Rounded corners
- Hover effects
- Responsive sizing
- Shadow effects

To customize, add inline styles or update `assets/css/styles.css`

## 🚀 Quick Start

1. Add all your images to `assets/images/`
2. Edit `design.html` (the main page with image placeholders)
3. Replace the 4 placeholder `<div class="image-placeholder">` sections with actual `<img>` tags
4. Save and refresh!

## ❓ Need Help?

Check the existing code in `design.html` for examples, or refer to the README.md for more information.

---

**Happy designing!** 🎨
