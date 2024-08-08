# Project Name

This project is a full-stack application built with Node.js for the backend and Next.js for the frontend. It uses Shadcn for component styling and Tailwind CSS for additional styling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Backend](#backend)
- [Frontend](#frontend)
- [Formatting and Linting](#formatting-and-linting)

## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher) or yarn

### Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```

## Usage

### Running the Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Start the backend server:
    ```bash
    node app.js
    ```

### Running the Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Start the frontend development server:
    ```bash
    npm run dev
    ```

## Scripts

### Backend

- `node app.js`: Start the backend server.

### Frontend

- `npm run dev`: Start the frontend development server.
- `npm run build`: Build the frontend for production.
- `npm start`: Start the production server.
- `npm run format`: Format all documents using Prettier.
- `npm run lint`: Run ESLint for linting the code.

## Backend

The backend is built with Node.js and runs on port `8080` by default. The main entry point is `app.js`.

### Available API Endpoints

- `POST /user/signup`: Endpoint for user signup.

## Frontend

The frontend is built with Next.js and styled using Shadcn components and Tailwind CSS. It runs on port `3000` by default when using `npm run dev`.

### Key Features

- Responsive UI components.
- Dynamic HTML content injection using `dangerouslySetInnerHTML`.

## Formatting and Linting

### Formatting

To format all documents in the project, run:
npm run format

### Linting
To lint the code, run:
```bash
npm run lint