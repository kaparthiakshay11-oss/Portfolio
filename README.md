# Akshay Kaparthi — Portfolio

A static, multi-page portfolio site. No build step, no dependencies — just HTML, CSS, and vanilla JS.

## Files
```
index.html      Home
smart-ac.html   Case study — Smart Sleep-Based AC Control
safepark.html   Case study — Safe Park
space.html      Case study — Space Saver
lumora.html     Case study — LUMORA (placeholder, see note below)
404.html        Not-found page
style.css       Shared design system
script.js       Shared behavior (starfield, reveals, tilt/magnetic effects)
favicon.svg     Site icon
robots.txt      Search engine crawl rules
sitemap.xml     Search engine page listing
```

## ⚠️ Before you go live
1. **LUMORA is a placeholder.** The original site only ever listed the project title — no real screens or details were available, so `lumora.html` is an honest best-guess concept page, clearly labeled as such on the page itself. Swap in your real project write-up before this goes live for job applications.
2. **Replace the placeholder domain.** `robots.txt`, `sitemap.xml`, and the `<link rel="canonical">` / Open Graph tags in every page currently point to `https://akshaykaparthi-portfolio.example.com/`. Once you have a real domain, find-and-replace that string across all files.
3. **Résumé link** currently points to your Google Drive file. Swap it if that link ever changes.

## Deploy it (pick one — all free)

### Option A: Netlify (easiest, no account needed to try)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the whole folder onto the page.
3. Done — you get a live URL immediately. Add a custom domain later from the Netlify dashboard if you want.

### Option B: Vercel
1. Install the CLI: `npm i -g vercel`
2. From inside this folder, run: `vercel`
3. Follow the prompts — it deploys and gives you a URL.

### Option C: GitHub Pages
1. Create a new GitHub repo and push these files to it.
2. In the repo, go to **Settings → Pages**.
3. Under "Source," pick the `main` branch and `/ (root)`.
4. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

### Option D: Keep using Framer
Your current site (akshaykaparthiportfolio.framer.website) runs on Framer, which doesn't accept raw HTML/CSS/JS deploys the way the options above do. To use this design there, either:
- Rebuild each section natively in the Framer editor using this as your visual spec, or
- Embed pieces of it via Framer's Embed / Code block (works for self-contained widgets, not full-page layouts).

## Browser support
Built with standard CSS (grid, custom properties, `backdrop-filter`) and vanilla JS (`IntersectionObserver`, canvas). Works in all current versions of Chrome, Safari, Firefox, and Edge. All motion respects `prefers-reduced-motion`.
