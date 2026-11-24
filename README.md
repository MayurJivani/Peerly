<div align="center">

# Peerly

**Send a file between two browser tabs. No upload.**

[Try it](https://mayurjivani.github.io/Peerly/) · [Futile Studio](https://futile.studio)

![React](https://img.shields.io/badge/React-19-0b0b0b?style=flat-square&logo=react&labelColor=0b0b0b) ![Vite](https://img.shields.io/badge/Vite-6-0b0b0b?style=flat-square&logo=vite&labelColor=0b0b0b) ![PeerJS](https://img.shields.io/badge/PeerJS-1.5-0b0b0b?style=flat-square&labelColor=0b0b0b) ![Last commit](https://img.shields.io/github/last-commit/MayurJivani/Peerly?style=flat-square&labelColor=0b0b0b&color=c6ff00)

</div>

> **Archive** · browser file transfer over WebRTC, 2026 · last commit Sep 2026

## Overview

Peerly sends a file between two browsers. One person copies the peer id shown
on their screen. The other pastes it in and clicks Connect. After that the file
goes straight into the other tab over WebRTC.

[PeerJS](https://peerjs.com) handles the connection. Its default signalling
server only helps the two browsers find each other. The file goes between the
browsers, not through an app server. The app has no backend.

## Features

- A peer id, generated when the page loads, shown on screen
- Connect by typing the other person's id
- Send any file with the file picker. The other tab downloads it under the original name
- A status line that shows who you are connected to

## How a transfer goes

1. Both people open the page. Each tab gets a peer id.
2. One person types the other's id and clicks Connect.
3. When the connection opens, both tabs show "Connected to" with the other id.
4. Pick a file. The browser reads it and sends it as one message.
5. The other tab turns the data into a file and starts a download.

## Limits

- Both tabs must stay open until the transfer finishes.
- The whole file is read into memory before it is sent. I have not tested large files.
- No progress bar. No sending several files at once. No resume after a drop.
- The app sets no TURN server, so some networks may block the connection. Not tested.
- Choosing a file does nothing until the connection is open.

## Stack

- React 19 with Vite 6
- PeerJS 1.5 for the WebRTC connection
- ESLint 9 for linting

## Running it locally

```bash
npm install
npm run dev       # Vite dev server, prints the local URL
npm run build     # production build into dist/
npm run preview   # serve the built dist/
npm run lint      # eslint .
```

To try a transfer, open the dev server in two tabs (or two browsers) and connect
one tab to the other using its peer id.

## Configuration

There are no environment variables and no `.env` file. `src/App.jsx` calls
`new Peer()` with no options, so PeerJS uses its default signalling server.

## Deploying

`.github/workflows/deploy.yml` runs when you push to a branch called `Deploy`.
It runs `npm install` and `npm run build` on Node 18, then publishes `dist/` to
the `gh-pages` branch with `peaceiris/actions-gh-pages`.

`vite.config.js` sets no `base` path. A site served under `/Peerly/` needs
`base: "/Peerly/"` in that file, or the asset paths will point at the domain root.

## Project structure

```
src/App.jsx          the whole app: connection, sending and receiving
src/main.jsx         React entry point
src/App.css          app styles
src/index.css        global styles
index.html           page shell
vite.config.js       Vite config (React plugin only)
.github/workflows/   deploy.yml, GitHub Pages deploy
```

## Licence

No licence file yet, all rights reserved.

---

<p align="center">
  <a href="https://futile.studio"><img src="https://raw.githubusercontent.com/MayurJivani/MayurJivani/main/assets/futile-studio.png" alt="futile.studio" width="180"></a>
  <br>
  <sub>Built by <a href="https://github.com/MayurJivani">Mayur Jivani</a>. Everything is futile. Do it anyway.</sub>
</p>
