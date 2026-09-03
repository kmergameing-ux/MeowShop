# Diamond TopUp Shop

A starter Cambodia game-top-up storefront with:
- Mobile Legends / Free Fire / PUBG product catalog
- Khmer TopUp reseller API integration
- Server-side API key handling
- Order creation + status polling
- Customer checkout UI
- Admin-ready structure
- KHQR payment placeholder for your chosen payment provider

## Supplier
This project is wired for the Khmer TopUp reseller API:
`https://khmer-topup.com/api/v1`

Create a reseller account and put the API key in `.env.local`.
Never put the API key in browser/client code.

## Run
1. Install Node.js 20+
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your supplier API key
5. `npm run dev`

Then open http://localhost:3000

## Important
The supplier API is prepaid-wallet based. Your supplier wallet must have funds before live orders can be fulfilled. The website cannot legitimately create diamonds by itself; it must use an authorized supplier/API account.
