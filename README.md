# Nomo Luxe Car Rental Website

This is a simple React (Vite) + Tailwind website for **Nomo Luxe Car Rental**, including a booking form that submits directly to Google Forms.

## What you need installed
- Node.js (LTS recommended)

## Run locally
1. Download this project and unzip it
2. Open the folder
3. Run:

```bash
npm install
npm run dev
```

Vite will print a local URL (usually http://localhost:5173).

## Deploy (easy)
- Upload this folder to GitHub
- Deploy with Vercel (Import GitHub repo)

## Google Forms
This site posts form submissions to:

- https://docs.google.com/forms/d/e/1FAIpQLSdWV8ATUPXi3eTqj5xSAKyK8H5h5__8wS0zUpcfsG6xn8MSEA/formResponse

If you add a **Message / Notes** question in your Google Form, update the entry id in `src/App.jsx`:

`GOOGLE_FORM.entry.message = "entry.XXXXXXXXX"`
