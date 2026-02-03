# J-NODE Digital Solutions

Corporate website for **J-NODE Digital Solutions**, software development agency and digital solutions.

## Services

- Software development (web, apps, APIs)
- Maintenance and support
- Technical consulting
- Domain registration
- Web hosting
- Frontend and layout
- UI/UX design
- Graphic design and branding

## Stack

- [Next.js](https://nextjs.org) 14 (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- TypeScript

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and production

```bash
npm run build
npm start
```

## Project structure

```
src/
├── app/              # App Router (layout, home page, styles)
├── components/       # React components (navigation, UI)
└── lib/             # Utilities and hooks
```

## Stripe integration (future)

The site is ready for Stripe integration:

- Content focused on billable services (quotes, contact).
- Contact section with clear CTAs to request a quote.
- Footer with links to legal pages (Terms, Privacy) when online payments are enabled.
- Brand structure and professional messaging for payment trust.

When integrating Stripe, consider:

1. The routes `/terminos` and `/privacidad` already include legal text.
2. Replace or complement the contact CTA with a checkout flow or form that creates payment sessions.
3. Use your real email and contact details in `#contact` and in the footer.

## Contact on the site

- **Sample email:** `contacto@jnode.digital` (replace in `src/app/page.tsx` and footer with your real email).
- **WhatsApp:** the link uses a placeholder number; update it in `src/app/page.tsx` with your number including country code (without `+`).

## License

Private — J-NODE Digital Solutions.
