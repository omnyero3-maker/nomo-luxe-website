# Nomo Luxe Car Rental Website (GitHub-ready)

This is a React (Vite) + Tailwind site for **Nomo Luxe Car Rental**.

## ✅ Booking / Google Sheet columns filling
This version uses a **prefilled Google Form** link for the booking flow (most reliable).
When customers click **Continue to Google Form**, it opens your form in a new tab with fields prefilled.
They press **Submit** and your Google Sheet columns fill correctly (Request type, preferred vehicle, dates, area, acknowledgment).

## Optional: Save “Additional message / note” to your Google Sheet
1. In your Google Form, add a **Paragraph** question named **Additional message / note**
2. Use the Form prefill feature once and copy the `entry.#########` id for that question
3. Paste it into `src/App.jsx` at `GOOGLE_FORM.entry.message`

## Run locally
```bash
npm install
npm run dev
```

## Deploy
Upload to GitHub and deploy with Vercel (Import GitHub repo).
