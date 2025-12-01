---
description: How to deploy the Wedding Planner app to Netlify
---

# Deploy to Netlify

Since this is a full-stack application (React Frontend + Express Backend), deploying to Netlify requires a specific approach or separating the services.

**Option 1: Deploy Client Only (Easiest for Demo)**
If you only want to show the frontend (with mock data if backend isn't reachable), follow these steps. Note that without the backend running on a public URL, the API calls will fail unless you mock them in the client or deploy the backend to a service like Render/Heroku.

1.  **Build the Client**
    Open your terminal in the `client` directory:
    ```bash
    cd client
    npm run build
    ```

2.  **Deploy with Netlify CLI**
    If you have `netlify-cli` installed:
    ```bash
    npm install -g netlify-cli
    netlify deploy --prod --dir=dist
    ```
    
    **OR Manual Upload:**
    1.  Go to [app.netlify.com](https://app.netlify.com)
    2.  Drag and drop the `client/dist` folder into the "Sites" area.

**Option 2: Full Stack Deployment**
Netlify is primarily for static sites and serverless functions. To deploy the Express backend, you would typically use **Render**, **Heroku**, or **Railway**.

**Recommended Full Stack Setup:**
1.  **Backend**: Deploy the `server` folder to **Render.com** (Web Service).
    - Build Command: `npm install`
    - Start Command: `node index.js`
2.  **Frontend**: Deploy the `client` folder to **Netlify**.
    - Build Command: `npm run build`
    - Publish Directory: `dist`
    - **Environment Variable**: Set `VITE_API_URL` in Netlify to your Render backend URL.
    - **Update Code**: You'll need to update `vite.config.ts` to use this env var instead of the hardcoded proxy for production.

## Quick Fix for Local Demo
To simply restart your local development server as requested:

1.  **Stop** any running servers (Ctrl+C).
2.  **Start Server**:
    ```bash
    cd server
    npm run dev
    ```
3.  **Start Client** (in a new terminal):
    ```bash
    cd client
    npm run dev
    ```
