
# LaunchDarkly Demo Project

## Table of Contents
*   [Overview](#overview)
*   [Prerequisites](#prerequisites)
*   [Setup Instructions](#setup-instructions)
*   [Running the Project](#running-the-project)
*   [Feature Flag Configuration](#feature-flag-configuration)
*   [Custom Attributes for Targeting](#custom-attributes-for-targeting)
*   [Security Precautions](#security-precautions)
*   [Project Structure](#project-structure)
*   [Troubleshooting](#troubleshooting)

## Overview
This project uses the **LaunchDarkly JavaScript Client-Side SDK** to dynamically control UI elements based on feature flags. It includes:
1.  A **default greeting** controlled by the `show_greeting` flag.
2.  A **special greeting** for users in the "dev" group, controlled by the `special_greeting` flag.
3.  Real-time updates to the UI when feature flags are toggled in the LaunchDarkly dashboard.

## Prerequisites
Before setting up and running this project, ensure the following:
1.  **Node.js and npm**:
    *   Install **Node.js** (**version 18 or higher is recommended**) 
    *   **npm** is included with Node.js.
2.  **LaunchDarkly Account**:
    *   Create a free account at [LaunchDarkly](https://www.launchdarkly.com/).
    *   Set up a **client-side environment** in your LaunchDarkly project.
3.  **Client-Side SDK Key**:
    *   Obtain your **client-side ID** from the LaunchDarkly dashboard. This will be used to initialize the SDK.
4.  **Basic Knowledge**:
    *   Familiarity with running commands in the terminal.
    *   Basic understanding of **JavaScript** and **HTML**.

## Setup Instructions
Follow these steps to set up the project:

1.  **Clone the Repository**:
    *   **Clone** this repository to your local machine:
        ```bash
        git clone https://github.com/boxing-bee/ldproject.git
        cd ldproject
        ```

2.  **Install Dependencies**:
    *   **Install** the required dependencies using npm:
        ```bash
        npm install
        ```

3.  **Configure the Client-Side SDK Key**:
    *   **Replace** `YOUR_CLIENT_SIDE_ID` in the `src/main.js` file with your actual **LaunchDarkly client-side ID**:
        ```javascript
        const ldClient = LaunchDarkly.initialize('YOUR_CLIENT_SIDE_ID', context);
        ```

4.  **Verify Project Structure**:
    *   **Ensure** your project structure matches the following:
        ```
        ldproject/
        ├── index.html             # Main HTML file for the application
        ├── src/
        │   └── main.js          # JavaScript file containing the LaunchDarkly implementation
        ├── package.json         # Project metadata and dependencies
        ├── node_modules/        # Installed npm packages
        └── vite.config.js       # Vite configuration file
        ```

## Running the Project
1.  **Start the Development Server**:
    *   Run the following command to start the Vite development server:
        ```bash
        npm run dev
        ```
2.  **Open the Application**:
    *   Once the server is running, Vite will provide a local development URL (e.g., http://localhost:3000). Open this URL in your browser.

## Feature Flag Configuration
Feature flags are configured within the **LaunchDarkly dashboard** 

1.  **Navigate to the Feature Flags Section**: Within your LaunchDarkly account, go to the section for managing feature flags.

2.  **Create Feature Flags**: Create the following feature flags:
    *   `show_greeting`: Controls whether the default greeting is shown.
    *   `special_greeting`: Controls whether a special greeting is shown for users in the "dev" group.

3.  **Add Targeting Rules (for specific scenarios)**: For the `special_greeting` flag, add a targeting rule :
    *   **If `custom.group` is `dev`, return `true`** 

4.  **Set the Default Value (for all other users)**: For the `show_greeting` flag, set the default value to `true` to show the greeting for all users.

## Custom Attributes for Targeting
The project uses the following custom attributes in the user context for targeting:

*   **`key`**: A **unique identifier** for the user (e.g., `'user-123'`)
*   **`name`**: The **user's name** (e.g., `'John Doe'`) [
*   **`email`**: The **user's email address** (e.g., `'john.doe@example.com'`) 
*   **`custom.group`**: A **custom attribute** to identify the user's group (e.g., `'dev'`)

Example context object:
```javascript
const context = {
  key: 'user-123',          // Unique user identifier
  name: 'John Doe',          // User's name
  email: 'john.doe@example.com', // User's email
  custom: {
    group: 'dev',           // Custom attribute to identify the target group
  },
};
```

## Security Precautions
*   **Do Not Expose Server-Side SDK Keys**: This project uses the client-side SDK, which is safe to use in the browser. Never use server-side SDK keys in a browser environment, as they can expose sensitive data.
*   **Environment-Specific Client-Side IDs**: Use different client-side IDs for development, staging, and production environments to avoid unintended behavior.
*   **Validate User Input**: Ensure proper validation for any user input to prevent security vulnerabilities like XSS.

## Project Structure
```
ldproject/
├── index.html             # Main HTML file for the application
├── src/
│   └── main.js          # JavaScript file containing the LaunchDarkly implementation
├── package.json         # Project metadata and dependencies
├── node_modules/        # Installed npm packages
└── vite.config.js       # Vite configuration file
```

## Troubleshooting
*   **Missing vite Script**: If you encounter the error `Missing script: "dev"`, ensure your `package.json` includes the following:
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "serve": "vite preview"
    }
    ```
*   **Feature Flags Not Working**: Ensure the `show_greeting` and `special_greeting` flags are created in the LaunchDarkly dashboard. Verify that the targeting rules are correctly configured.
*   **Network Issues**: If the application cannot connect to LaunchDarkly, ensure your network allows requests to LaunchDarkly's endpoints (e.g., `https://app.launchdarkly.com`).
*   **Debugging Flag Values**: Add debugging logs to verify the flag values:
    ```javascript
    console.log('show_greeting:', ldClient.variation('show_greeting', false));
    console.log('special_greeting:', ldClient.variation('special_greeting', false));
    ```
```