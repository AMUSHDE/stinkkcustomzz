# STINKK CUSTOMZ — Static Site

Simple static website for STINKK CUSTOMZ.

Files:

- `index.html` — main page
- `styles.css` — styles
- `script.js` — basic interactivity (modal, contact form, auth demo)
- `login.html`, `signup.html` — demo auth pages

## Local development

Recommended: use VS Code Live Server extension. Or run a local server in PowerShell:

Python (if installed):
```powershell
cd C:\Users\Admin\jewellery_site
python -m http.server 8000
# then open http://127.0.0.1:8000
```

Node (if installed):
```powershell
cd C:\Users\Admin\jewellery_site
npx http-server -p 8000
# then open http://127.0.0.1:8000
```

## Deploy to GitHub Pages

1. Create a GitHub repository (public) and push the contents:
```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/stinkk-site.git
git push -u origin main
```
2. On GitHub: Settings → Pages → Source: `main` branch, folder `/ (root)`.

## Deploy to Netlify or Vercel

- Netlify: drag-and-drop the folder or connect the GitHub repo.
- Vercel: connect the repo; static site requires no build step.

## SEO / Search

- Replace `https://your-site-url/` in `index.html`, `sitemap.xml`, and `robots.txt` with your real URL.
- Submit the site through Google Search Console to request indexing.

## Note on authentication

- Current login/signup uses `localStorage` for demo only. For real auth, integrate a backend (Firebase/Auth0) or server.
