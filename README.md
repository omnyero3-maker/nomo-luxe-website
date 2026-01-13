# Nomo Luxe Car Rental Website (GitHub-ready)

## Booking submissions without showing Google Form (Option A)
This site submits booking requests directly to your **Google Form** endpoint (`formResponse`) while keeping users on your website:
- the `<form>` posts to Google
- `target="hidden_iframe"` prevents navigation
- your linked Google Sheet still receives a new row

## Run locally
```bash
npm install
npm run dev
```

## Deploy on Vercel
- Import the repo from GitHub
- Build: `npm run build`
- Output: `dist`
