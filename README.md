# Bakenovation - Luxury Cake Studio

A high-end, responsive website for a luxury cake studio, featuring a custom interactive cake builder ("The Atelier") and GSAP-powered animations.

## 🚀 How to Deploy / Make Public

You have a few easy options to make this website public:

### Option 1: Netlify Drop (Easiest)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the **entire `bakenovation` folder** from your Desktop into the browser window.
3. Netlify will instantly host it and give you a public URL (e.g., `bakenovation-luxury.netlify.app`).

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel` (if you have Node.js).
2. Run `vercel` in this folder.
3. Follow the prompts (Keep all defaults).
4. It will give you a production URL.

### Option 3: GitHub Pages
1. Create a new repository on GitHub.
2. Push this code to the repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bakenovation.git
   git branch -M main
   git push -u origin main
   ```
3. Go to Repository Settings -> Pages -> Select 'main' branch -> Save.

## 🛠️ Project Structure

- `index.html` - The main entry point.
- `css/styles.css` - All custom styles (Glassmorphism, variables, layout).
- `js/main.js` - Animation logic (GSAP) and The Atelier interaction code.
- `assets/` - Images (Logo, Background, Cakes).

## ✨ Features
- **Luxury Design System:** Gold & Deep Purple theme.
- **Interactive Atelier:** Calculate cake prices based on shape, tiers, and flavors.
- **Responsive:** Looks great on mobile and desktop.
