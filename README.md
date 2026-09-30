# Enchuman Portfolio Project

## Structure

- `frontend/` - HTML pages, styles, images, and browser JavaScript
- `backend/` - Node server, API routes, project data, and legacy PHP handlers
- `package.json` - backend startup and dependency configuration

## How to run

1. Install dependencies with `npm install`.
2. Start the application with `npm start`.
3. Open `http://localhost:3000`.

The Node server serves only the `frontend/` directory and provides:

- `GET /api/projects` - project data
- `POST /api/contact` - contact form submission

Do not open the HTML files directly with `file://`; use the Node server so frontend assets and API requests resolve correctly.
