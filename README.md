# Zaki Commerce

A zero-budget South African e-commerce operations dashboard prototype. This project is separate from **Zakie Trader**.

## Current prototype

- Product catalogue with selling price, unit cost and stock quantity
- Order recording with paid/pending status
- Sales, recorded product-cost and estimated gross-profit summaries
- Local JSON data export
- Spending request queue with explicit owner approval/rejection controls

## Run locally

No build step or third-party dependency is required.

1. Clone or download this repository.
2. Open `index.html` in a modern browser.

Data is stored in that browser's local storage. Use **Export data** to download a JSON backup.

## Important limitations

- This is a front-end prototype, not a production store.
- It does not connect to suppliers, marketplaces, couriers, banks or payment gateways.
- It does not process payments, place orders, send marketing, or purchase services.
- The spending approval interface only records a local decision; approval does **not** trigger a payment or external action.
- Do not enter sensitive customer, payment-card or identity information.

## Zero-budget / approval-first rule

No paid hosting, domain, subscription, advertising, supplier order or other expenditure may be initiated without the owner's explicit approval. Prefer free tiers and local development until the owner chooses otherwise.

## Roadmap

1. Validate the dashboard and workflows.
2. Deploy a static demo using a suitable free hosting tier, after checking terms and any usage limits.
3. Add secure server-side storage and authentication before real customer/order data.
4. Evaluate South African suppliers, payment providers and delivery integrations.
5. Add AI-assisted product research, listing drafts and marketing tools with human review.
6. Keep all purchases, paid plans, advertising and supplier payments behind explicit owner approval.

## Project separation

This repository contains Zaki Commerce only. It must not be merged with or configured to trade through the Zakie Trader project.