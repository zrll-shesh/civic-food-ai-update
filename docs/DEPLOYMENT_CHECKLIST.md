# Deployment checklist

1. Upload the project folder to GitHub.
2. Import the repository in Vercel.
3. Framework: Next.js.
4. Build command: `next build`.
5. Install command: `npm install`.
6. No environment variables are required for the static analysis dashboard.
7. The map uses OpenStreetMap tiles from the browser; attribution is included.
8. The complete source artifacts are preserved under `public/source-data`.
9. The dashboard does not retrain models in the browser; it presents the saved analysis run.
10. Before judging, open Command Center, Spatial Intelligence, Predictive Analytics, Public Voice, and Decision Support once so all visual layers are cached by the browser.
