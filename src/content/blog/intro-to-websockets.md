---
title: 'Real-Time Web: An Introduction to WebSockets'
date: '2024-07-31' # Use a recent date
category: 'Web Development'
readTime: '5 min read'
image: '/images/blog/websockets-hero.png' # Placeholder frontmatter image
---

Traditional web communication primarily relies on the request-response model of HTTP. The client sends a request, and the server sends a response. This works well for fetching documents but becomes inefficient for applications requiring real-time, bidirectional communication, like chat apps, live notifications, or online games.

This is where **WebSockets** come in.

## What are WebSockets?

The WebSocket protocol ([RFC 6455](https://tools.ietf.org/html/rfc6455)) provides a way to establish a **persistent, full-duplex communication channel** over a single TCP connection between a client (usually a web browser) and a server.

*   **Persistent:** Unlike HTTP, the connection stays open after the initial handshake, allowing either the client or the server to send data at any time without initiating a new request.
*   **Full-Duplex:** Data can flow in both directions simultaneously.

![WebSocket vs HTTP Polling Diagram](/images/blog/websocket-vs-http.png)

## The WebSocket Handshake

A WebSocket connection starts with an HTTP-like handshake. The client sends an HTTP request with specific headers (`Upgrade: websocket`, `Connection: Upgrade`). If the server supports WebSockets and agrees to upgrade, it responds with a special `101 Switching Protocols` status code. After this handshake, the underlying TCP connection transitions from HTTP to the WebSocket protocol, enabling bidirectional message passing.

## Use Cases

WebSockets are ideal for applications requiring low-latency, real-time updates:

*   **Chat Applications:** Instant messaging between users.
*   **Real-time Notifications:** Pushing updates from the server to clients (e.g., social media feeds, alerts).
*   **Live Data Dashboards:** Displaying rapidly changing data (e.g., stock tickers, analytics).
*   **Multiplayer Online Games:** Synchronizing game state between players.
*   **Collaborative Editing Tools:** Real-time updates in shared documents (like Google Docs).

## How to Use WebSockets

**Client-Side (Browser JavaScript):**

Browsers provide a native [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

```javascript
// Establish connection (use wss:// for secure connection)
const socket = new WebSocket('ws://example.com/socketserver');

// Connection opened
socket.addEventListener('open', (event) => {
  console.log('WebSocket connection opened');
  socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data);
});

// Connection closed
socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});

// Handle errors
socket.addEventListener('error', (event) => {
  console.error('WebSocket error: ', event);
});
```

**Server-Side:**

Implementing a WebSocket server requires specific libraries depending on your backend language/framework (e.g., [Socket.IO](https://socket.io/) for Node.js, `websockets` library for Python, SignalR for .NET).

## Alternatives

While powerful, WebSockets aren't the only solution for real-time features:

*   **Server-Sent Events (SSE):** Simpler, one-way communication *from* server *to* client over HTTP.
*   **Long Polling:** Client repeatedly polls the server, which holds the connection open until it has data to send (less efficient than WebSockets).

WebSockets offer a robust and efficient standard for building interactive, real-time web applications by enabling persistent, bidirectional communication channels. 