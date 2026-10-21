# CodeCraftHub

CodeCraftHub is a small REST API for tracking courses in a personal learning plan. It is built with Node.js and Express, and stores its data locally in a JSON file rather than a database.

## Features

- Create, list, retrieve, update, and delete courses.
- Assign each course a target date and learning status.
- Persist course data in `src/courses.json`; no database setup is needed.
- Return JSON responses for API routes.

## Requirements

- Node.js and npm.

## Installation

Clone or download this repository, open a terminal in the project directory, and install the dependencies:

```bash
npm install
```

## Run the application

Start the API:

```bash
npm start
```

The server listens at `http://localhost:5000`. On its first run, it creates `src/courses.json` if the file does not exist. The development script restarts the server when files change:

```bash
npm run dev
```

The development command uses the included `nodemon` development dependency.

## API

All endpoints are served from `http://localhost:5000`. Requests and responses use JSON. Course statuses must be `Not Started`, `In Progress`, or `Completed`. Dates must use the `YYYY-MM-DD` format.

### `GET /`

Returns a welcome message and a list of available endpoints.

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/"
```

### `GET /api/courses`

Returns all courses as a JSON array. An empty collection is returned as `[]`.

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/courses"
```

### `GET /api/courses/:id`

Returns the course with the specified numeric ID. Returns `404` if it does not exist.

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/courses/1"
```

### `POST /api/courses`

Creates a course. All fields shown below are required. The server assigns `id` and `created_at`.

```powershell
$body = @{
  name = "Learn Express"
  description = "Build REST APIs with Node.js and Express"
  target_date = "2026-12-15"
  status = "Not Started"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:5000/api/courses" `
  -ContentType "application/json" `
  -Body $body
```

Example request body:

```json
{
  "name": "Learn Express",
  "description": "Build REST APIs with Node.js and Express",
  "target_date": "2026-12-15",
  "status": "Not Started"
}
```

### `PUT /api/courses/:id`

Replaces the editable fields of an existing course. This endpoint requires all four fields: `name`, `description`, `target_date`, and `status`. Returns `404` if the ID does not exist.

```powershell
$body = @{
  name = "Learn Express"
  description = "Build REST APIs with Node.js and Express"
  target_date = "2026-12-15"
  status = "In Progress"
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "http://localhost:5000/api/courses/1" `
  -ContentType "application/json" `
  -Body $body
```

### `DELETE /api/courses/:id`

Deletes the course with the specified numeric ID and returns the deleted course. Returns `404` if the ID does not exist.

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:5000/api/courses/1"
```

### Course response shape

```json
{
  "id": 1,
  "name": "Learn Express",
  "description": "Build REST APIs with Node.js and Express",
  "target_date": "2026-12-15",
  "status": "In Progress",
  "created_at": "2026-10-21T11:47:55.561Z"
}
```

Create, update, and delete responses include a `message` and a `course`. Validation errors return `400` with a JSON `message`; missing courses or routes return `404`.

## Troubleshooting

- **Connection refused or cannot reach `localhost:5000`:** Start the server with `npm start` and check its terminal for the listening message. Confirm that the request uses port `5000`.
- **`npm` or `node` is not recognized:** Install Node.js, which includes npm, then open a new terminal and check with `node --version` and `npm --version`.
- **`Cannot find module 'express'`:** Run `npm install` from the project directory.
- **A request returns `404`:** Check the path and numeric course ID. The API paths begin with `/api/courses`.
- **A create or update request returns `400`:** Send valid JSON with all required fields. Use the exact key `target_date`, a `YYYY-MM-DD` date, and one of the supported statuses.
- **Course data is missing or malformed:** The file `src/courses.json` contains the stored records. Keep it valid JSON; back it up before manually editing it. The app initializes it to an empty array only when the file is absent.