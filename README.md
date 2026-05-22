# Enchuman Portfolio Project

## Structure

- `project.html` - frontend portfolio page
- `my.js` - frontend script that loads project cards from the backend
- `backend/` - backend API folder
  - `backend/api.php` - returns JSON from `backend/data.json`
  - `backend/data.json` - project data source

## How to run

1. Start XAMPP Apache.
2. Open the portfolio page via:
   `http://localhost/enchuman/project.html`
3. Do not open `project.html` using `file://`.

## Why this matters

`api.php` must be executed by PHP through Apache. If the page is opened directly from the filesystem, the browser may load raw PHP text and fail to parse JSON.

## Troubleshooting

- If `http://localhost/enchuman/backend/api.php` returns PHP source, Apache is not processing `.php` files.
- If `project.html` still fails, confirm the browser URL begins with `http://`, not `file://`.
