# Zaki Commerce

A zero-budget South African e-commerce operations dashboard prototype. This project is separate from **Zakie Trader**.

## Current prototype

- Product catalogue with selling price, unit cost and stock quantity
- Order recording with paid/pending status
- Sales, recorded product-cost and estimated gross-profit summaries
- Local JSON data export
- General action approval queue for product, supplier, customer, fulfilment, marketing and purchase proposals
- Spending request log with local approve/reject controls

## Run locally

No build step or third-party dependency is required.

1. Clone or download this repository.
2. Open `index.html` in a modern browser.

Data is stored in that browser's local storage. Use **Export data** to download a JSON backup.

## Important limitations

- This is a front-end prototype, not a production store.
- It does not connect to suppliers, marketplaces, couriers, banks or payment gateways.
- It does not process payments, place orders, send marketing, or purchase services.
- Approval queues only record local decisions; approval does **not** publish a product, contact anyone, place an order, start a service, authorize an external action or trigger a payment.
- Product catalogue entries are local records only; there is no public product catalogue or checkout.
- Do not enter sensitive customer, payment-card or identity information.

## Approval-first workflow

Add proposals to the action queue and review them before taking any real-world step. An approval in this demo is a decision record only. There is no server-side user authentication or durable shared queue, so it cannot enforce permissions for other people or systems.

## Durable approval queue foundation

A Supabase Postgres schema is prepared in `supabase/schema.sql`. It creates an authenticated, row-level-secured queue: each signed-in user can access only their own proposals. Approvals remain records only and have no external side effects.

This schema is not connected to the static dashboard yet. To activate it, the owner must create a Supabase project, review and accept the provider's terms, apply the SQL, and configure the app with the project URL and public/publishable key. Never place a Supabase secret or service-role key in browser code. Authentication and queue UI wiring are still required before the browser-local queue becomes durable.

Supabase currently advertises a $0 Free plan with database and Auth quotas. Free projects may pause after one week of inactivity, and automatic backups are not included. Quotas and terms can change; remain on Free and keep spending at R0 unless the owner explicitly approves a paid plan. See [Supabase pricing](https://supabase.com/pricing) and [Row Level Security guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Zero-budget / approval-first rule

No paid hosting, domain, subscription, advertising, supplier order or other expenditure may be initiated without the owner's explicit approval. Prefer free tiers and local development until the owner chooses otherwise.

## Roadmap

1. Validate the dashboard and workflows.
2. Deploy a static demo using a suitable free hosting tier, after checking terms and any usage limits.
3. Connect the prepared approval queue schema to authenticated Supabase storage before real customer/order data.
4. Evaluate South African suppliers, payment providers and delivery integrations.
5. Add AI-assisted product research, listing drafts and marketing tools with human review.
6. Keep all purchases, paid plans, advertising and supplier payments behind explicit owner approval.

## Project separation

This repository contains Zaki Commerce only. It must not be merged with or configured to trade through the Zakie Trader project.