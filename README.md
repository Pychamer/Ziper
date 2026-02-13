# Medication Reminder - OC Maker Project Website

A website showcasing the Medication Reminder invention project by Ranish Sapkota and Andrew Noda.

## Overview

This website presents an innovative medication reminder solution designed to help people who need assistance remembering to take their medication. The project is particularly beneficial for elderly people and anyone taking multiple medications.

## Website Sections

1. **About Us** - Team member profiles (Ranish Sapkota and Andrew Noda)
2. **Our Story** - The motivation and vision behind the project
3. **Parts List** - Component details (pending updates)
4. **Design Process** - Development stages, prototypes, and design materials

## How to View the Website

### Option 1: Direct File Access
Simply open `index.html` in your web browser.

### Option 2: Using a Local Server
```bash
# Using Python 3
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## How to Update the Website

### Adding More Content

#### Update Team Member Information
Edit `index.html` and find the "About Us" section. To add Andrew Noda's bio, replace the placeholder text in his member card:
```html
<div class="member-card">
    <h3>Andrew Noda</h3>
    <p class="role">Co-Creator</p>
    <p class="bio">Your bio text here...</p>
</div>
```

#### Add Parts to the Parts List
Edit `index.html` and find the "Parts List" section. Replace the placeholder with actual parts:
```html
<div class="parts-content">
    <ul>
        <li>Part 1 name - description</li>
        <li>Part 2 name - description</li>
        <!-- Add more parts here -->
    </ul>
</div>
```

#### Add Images, GIFs, and Videos
In the "Design Process" section, you can add more media items:
```html
<div class="media-item">
    <h4>Your Image Title</h4>
    <img src="YOUR_IMAGE_URL_HERE" alt="Description">
</div>
```

For GIFs, use the same format as images. Just provide the URL from your image hosting service (ImgBB, Imgur, etc.).

#### Getting Direct Image URLs from ImgBB

If you have an ImgBB link like `https://ibb.co/7xv6g56c`, you need to get the direct image URL to display it on your website:

**Method 1: Right-click the image**
1. Go to the ImgBB link in your browser
2. Right-click on the image
3. Select "Copy Image Address" or "Copy Image Link"
4. Paste this URL in your HTML `<img src="...">` tag

**Method 2: View the embed code**
1. Go to the ImgBB link
2. Click on "Get share links"
3. Copy the "Direct link" or "HTML full linked" code
4. Use the URL from there

**Example:**
- ImgBB page: `https://ibb.co/7xv6g56c`
- Direct image URL: `https://i.ibb.co/xxxxxx/image.jpg` (get this by right-clicking)

#### Add OnShape Links
Add links to your OnShape designs:
```html
<a href="YOUR_ONSHAPE_URL" target="_blank" class="button">View OnShape Design</a>
```

### Customizing Styles

Edit `styles.css` to change:
- Colors: Modify the gradient colors in `.hero` and `header`
- Fonts: Change the `font-family` in the `body` selector
- Spacing: Adjust `padding` and `margin` values
- Layout: Modify grid template columns in responsive sections

## Links to Design Materials

- **Concept Image**: https://ibb.co/7xv6g56c
- **Prototype Builds**: https://drive.google.com/drive/folders/12crWSnZ6jHS_htUK4NIm90SLdPYHeeqs?usp=drive_link

## Features

- ✅ Responsive design (works on desktop, tablet, and mobile)
- ✅ Modern gradient styling
- ✅ Smooth navigation with anchor links
- ✅ Card-based layout for team members
- ✅ Organized sections for easy content updates
- ✅ External links to images and prototypes
- ✅ Placeholder sections for future content

## Project Goals

This invention aims to:
- Help people remember to take their medication consistently
- Accommodate various medication types (pills, sprays, liquids)
- Serve all age groups, especially elderly individuals
- Simplify medication management by storing whole medication boxes

## Future Updates

The website is designed to be easily updated. Planned additions include:
- Complete parts list with technical specifications
- Additional images and GIFs of the design process
- Hand-drawn sketches
- OnShape 3D model files
- More detailed prototype documentation
- Andrew Noda's bio

## Contact

For questions or contributions, please contact:
- Ranish Sapkota
- Andrew Noda

---
© 2024 Medication Reminder Project by Ranish Sapkota & Andrew Noda
