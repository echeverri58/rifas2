# Raffle Management Application

## Overview

This application provides a platform for managing and participating in raffles. It features separate interfaces for administrators to create and manage raffles, and for users to view and reserve tickets. The application is built using React, TypeScript, and Vite.

## Features

### Raffle Management (Admin)
*   **Create & Update Raffles:** Define raffle details including title, description, item image, ticket price, raffle date, and lottery name.
*   **Clear Raffle Data:** Reset the application by clearing all current raffle information from `localStorage` after confirmation.
*   **View Raffle Statistics:** See an overview of ticket status (available, reserved, paid).
*   **Manage Tickets:**
    *   View a visual grid of all tickets and their current status.
    *   Mark reserved tickets as "Paid".
    *   Download a PDF receipt for any ticket that has participant details (typically after being marked as paid or if details were captured at reservation).
*   **Grid Screenshot:** Generate and download a PNG image of the current ticket grid view.

### Participant Interaction (User)
*   **View Active Raffle:** See details of the ongoing raffle, including the prize image and description.
*   **Select & Reserve Tickets:** Choose available tickets from an interactive grid and reserve them by providing name, phone number, and email.
*   **Download Ticket PDF:** After reserving a ticket, download a PDF confirmation.
*   **Real-time Ticket Status:** Observe the status of all tickets (Available, Reserved, Paid) on the grid.

### General
*   **Responsive Design:** Adapts to various screen sizes for usability on desktops and mobile devices.
*   **User-Friendly Interface:** Clear visual indicators for ticket statuses and intuitive navigation.
*   **Toast Notifications:** Provides feedback for actions (e.g., successful reservation, raffle creation, errors) using non-intrusive toast messages.
*   **Client-Side Operation:** Runs entirely in the browser without a backend server (data persistence is handled by `localStorage`).

## Data Persistence

This application uses the browser's `localStorage` to store the data for the currently active raffle. This includes all raffle details (title, description, image, price, etc.) and the state of all tickets (number, status, participant information).

**Important Considerations:**

*   **Browser Specific:** Data saved in `localStorage` is specific to the web browser and the user profile on which the application is accessed. It will not be shared across different browsers on the same device, different user profiles, or across different devices.
*   **No User Accounts:** The application does not implement user accounts. The distinction between "Admin" and "User" views is based on URL navigation (`/admin` vs. `/`) and provides access to different sets of functionalities rather than securing or segregating data based on user identity.
*   **Risk of Data Loss:** Clearing browser data (e.g., cache, cookies, site data for this application's domain) will permanently delete all active raffle information.
*   **Single Raffle at a Time:** The application is designed to manage only one raffle at any given time. Creating a new raffle or using the "Clear Raffle" functionality will overwrite or remove any existing raffle data stored in `localStorage`.

## Run Locally

**Prerequisites:** Node.js (version 18.x or higher recommended)

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables (GEMINI_API_KEY):**
    The `vite.config.ts` file is set up to load an environment variable named `GEMINI_API_KEY` from an `.env` file (e.g., `.env.local`) at the root of the project. It then makes this available as `process.env.GEMINI_API_KEY` and `process.env.API_KEY` within the Vite build process.

    *   **Current Usage:** As of the latest review, this `GEMINI_API_KEY` (and its alias `API_KEY`) **does not appear to be actively used by any core features** of the application. It might be a remnant of a planned feature or a template.
    *   **If you intend to use it for a new feature:**
        *   Create a file named `.env.local` in the project root.
        *   Add the following line:
            ```
            GEMINI_API_KEY=your_actual_api_key_here
            ```
    *   If it's not needed, you can potentially remove its setup from `vite.config.ts` to avoid confusion. For now, running the application does not strictly require this key to be set for existing features to work.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:5173`.

## Building for Production

To create a production build:
```bash
npm run build
```
The output files will be in the `dist` directory. You can then deploy this directory to any static hosting service.

---

This README aims to provide a comprehensive guide for developers and users of the Raffle Management Application.
