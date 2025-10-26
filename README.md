# Datum

An elegant, minimalist application for tracking the expiration dates of your important documents.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ypk471/Datum-generated-app-20251012-081822)

## About The Project

Datum is a visually-driven web application designed to help users track the validity and expiration dates of their important documents like passports, visas, and IDs. The application provides at-a-glance status updates using a color-coded system to signify urgency.

Built with a 'less is more' philosophy, Datum features a clean layout, ample whitespace, and a calming color palette to ensure a serene and focused user experience. All interactions are designed to be smooth and intuitive, utilizing modern UI components and subtle animations for a polished feel.

### Key Features

*   **Document Tracking:** Add, view, and manage important documents with start and end dates.
*   **Visual Expiry Indicators:** A color-coded system (green, yellow, red) provides an immediate understanding of a document's status.
*   **Minimalist UI:** A clean, uncluttered interface that is easy to navigate and pleasing to the eye.
*   **Responsive Design:** Flawless user experience across desktops, tablets, and mobile devices.
*   **Smooth Interactions:** Built with modern components and animations for a delightful user experience.
*   **Persistent Storage:** Your data is securely stored using Cloudflare's Durable Objects.

## Technology Stack

This project is built with a modern, full-stack TypeScript architecture.

*   **Frontend:**
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    *   [Framer Motion](https://www.framer.com/motion/) for animations
*   **Backend:**
    *   [Cloudflare Workers](https://workers.cloudflare.com/)
    *   [Hono](https://hono.dev/)
*   **Storage:**
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
*   **Language:**
    *   [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/datum_document_tracker.git
    cd datum_document_tracker
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite frontend and the Hono backend concurrently.
    ```sh
    bun dev
    ```
    The application will be available at `http://localhost:3000`.

## Project Structure

The project is organized into three main directories:

*   `src/`: Contains the React frontend application code.
    *   `pages/`: Main application pages.
    *   `components/`: Reusable React components, including shadcn/ui components.
    *   `hooks/`: Custom React hooks for state and logic.
    *   `lib/`: Utility functions and API client.
*   `worker/`: Contains the Cloudflare Worker backend code (Hono API).
    *   `user-routes.ts`: API route definitions.
    *   `entities.ts`: Durable Object entity definitions for data persistence.
*   `shared/`: Contains TypeScript types and interfaces shared between the frontend and backend.

## Development

The frontend and backend are tightly integrated but developed in separate directories (`src` and `worker`).

*   **Frontend Development:** Modify files within the `src` directory. Vite provides Hot Module Replacement (HMR) for a fast development experience.
*   **Backend Development:** API endpoints are defined in `worker/user-routes.ts`. The underlying data logic is handled by entities in `worker/entities.ts`, which abstract the interaction with a single global Durable Object.
*   **Shared Types:** To maintain type safety between the client and server, define all data structures in `shared/types.ts`.

## Deployment

This application is designed for easy deployment to the Cloudflare network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate with your Cloudflare account.
    ```sh
    wrangler login
    ```

2.  **Build and Deploy:**
    Run the deploy script, which will build the Vite application and deploy the worker.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ypk471/Datum-generated-app-20251012-081822)