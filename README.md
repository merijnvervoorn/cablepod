# 🎧 CablePod

CablePod is a sleek, privacy-focused podcast player designed to live entirely in your browser. It acts as a progressive web app (PWA) that respects your data: there are no accounts, no trackers, and no middleman servers mining your listening habits. The website is inspired by the AntennaPod Android app, which I wanted to be able to use on my computer.

Your data stays in your browser's `localStorage`, and if you want to sync across devices, CablePod uses **End-to-End Encryption (E2EE)** to securely pass your data through a free Cloudflare Worker, a private GitHub Gist, or your own custom (cloudflare/webDAV) server.

### ✨ Features

* **100% Local-First:** Runs entirely client-side on GitHub Pages (or any static host).
* **E2EE Auto-Sync:** Sync your queue, subscriptions, and progress between your laptop and phone using a secure 8-word passphrase (256-bit AES-GCM encryption).
* **Ambient Fullscreen Player:** A beautiful, distraction-free fullscreen UI featuring a blurred background, perfect for leaving open on a second monitor.
* **Smart Inbox & Queue:** Automatically hides episodes from your inbox once they are queued or started.
* **Rich Import/Export:** Easily migrate from other apps by importing an `OPML` file or an AntennaPod `.db` database backup.
* **Apple Podcasts Directory:** Search the massive iTunes directory to find and add new podcasts instantly, or paste a custom RSS feed link.
* **Light/Dark Mode:** Built-in theme toggling to match your system or preference.

---

## 🚀 Visit and start listening

[https://cablepod.merijn.cc]

---

## 🔒 How the Sync Works (Bring Your Own Backend)

CablePod never forces you to use a centralized server. Instead, it offers a "Bring Your Own Backend" (BYOB) approach to syncing. 

When you generate a sync passphrase, CablePod derives an AES encryption key directly in your browser. It encrypts your entire database into an unreadable blob, hashes your passphrase to create a random file identifier, and pushes that blob to a storage provider. **The server never sees your passphrase and cannot read your podcasts.**

You can choose your storage provider in the Settings tab:
1. **Cloudflare Edge (Default):** A lightning-fast, free, and already set-up Cloudflare Worker KV setup.
2. **GitHub Gist:** Uses a Personal Access Token to save your encrypted state to a hidden, private Gist on your GitHub account.
3. **Custom REST / WebDAV:** Point CablePod to your own self-hosted endpoint (Choose this to use your own Cloudflare worker).

---

## 🛠️ Deployment & Setup

Because CablePod is purely static HTML/JS/CSS, you can simply clone this repository and host it on GitHub Pages, Vercel, Netlify, or a basic Apache/Nginx server. 

### Setting up the Cloudflare Sync Worker (Optional)
If you want to host your own Cloudflare Worker to act as the sync relay, it takes about 2 minutes and is completely free:

1. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Storage & Databases > Workers KV**.
2. Click **Create instance**. Name it `CABLEPOD_KV`.
3. Go to **Compute > Workers & Pages** and click **Create application**. Name it `cablepod-sync`.
4. Go to the Worker's **Settings > Bindings**, and add a KV Namespace Binding. Set the variable name to `CABLEPOD_KV` and select the namespace you just created.
5. Edit the Worker's code and copy-paste the contents of the [cablepod-sync-worker.js](cablepod-sync-worker.js) file included in this repository.
6. Deploy the worker, copy your new Worker URL, and paste it into the "Custom Server" input in CablePod's settings!

---

## 🏗️ Tech Stack
* Pure HTML5, CSS3, Vanilla JavaScript (No build steps, no React, no NPM dependencies)
* Web Crypto API (AES-GCM for End-to-End Encryption)
* `sql-wasm.js` (For parsing AntennaPod SQLite database backups entirely in the browser)

## 📄 License
**GNU GPL v3**. This project is open-source and free to use, modify, and distribute. See [LICENSE] for more details.
