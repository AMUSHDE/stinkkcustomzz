GitHub Pages deployment

Option A — Quick manual (recommended if you don't have git locally):
- Create a new GitHub repository via the web UI.
- In the repository, use "Add file → Upload files" and upload the site files (index.html, styles.css, script.js, 404.html, sitemap.xml, robots.txt, settings.html, login.html, signup.html, etc.).
- In the repository Settings → Pages, set the source to the `main` branch (or `gh-pages` branch if you uploaded there) and root folder `/`.
- Wait a few minutes for the site to be published at `https://<your-username>.github.io/<repo-name>/`.

Option B — Automated via GitHub Actions (recommended for continuous deploy):
- Ensure your site files are pushed to the `main` branch.
- The provided workflow `.github/workflows/deploy.yml` will publish the repository root to GitHub Pages on every push to `main`.

Notes:
- If you use the manual upload method, re-upload updated files to publish new changes.
- The repository must be public for GitHub Pages free hosting unless you use an organizational setup.
- Make sure `sitemap.xml` and `robots.txt` point to your published URL.

Troubleshooting:
- If the site returns the repository index instead of your site, check Pages settings and that `index.html` is at the repository root.
- If `404.html` doesn't appear for missing pages, ensure it's present at the root of the published site.
