# Secure Chat API

A real-time secure chat application using **Node.js**, **Express**, **Redis**, and **AES encryption** for message confidentiality.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Setup and Run](#setup-and-run)
* [Design Choices](#design-choices)
* [Encryption Details](#encryption-details)
* [Usage](#usage)

---

## Overview

This application allows users to register, login, and send encrypted messages in real-time using **Server-Sent Events (SSE)**. All messages are stored encrypted in the database and transmitted securely over Redis pub/sub channels.

---

## Features

* User registration and login with **JWT authentication**
* Real-time messaging using **SSE**
* Message encryption using **AES-256-CBC**
* Redis pub/sub integration for scalable messaging
* HTTP-only cookies for secure JWT storage

---

## Tech Stack

* **Node.js & Express** – Backend framework
* **MongoDB** – Database for storing users and messages
* **Redis** – Pub/Sub for real-time message broadcasting
* **bcryptjs** – Password hashing
* **jsonwebtoken** – JWT generation and verification
* **crypto** – AES message encryption
* **dotenv** – Environment variable management

---

## Setup and Run

1. **Clone the repository:**

```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set environment variables in `.env`:**

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret
AES_KEY=<64-hex-character-key>
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```


> `AES_KEY` should be a 32-byte key encoded in hexadecimal (64 hex characters).

4. **Run the application:**

```bash
npm start
```

5. **Run Redis locally** (if not running already):

```bash
redis-server
```

6. **Access the API** on `https://localhost:4000`.

---

## Design Choices

* **Service Layer:** Handles business logic separately from controllers for maintainability.
* **SSE for real-time updates:** Chosen for simplicity over WebSockets for broadcasting messages to multiple clients.
* **Redis Pub/Sub:** Enables horizontal scalability and decouples message broadcasting from API servers.
* **JWT in HTTP-only cookie:** Protects tokens from XSS attacks.

---

## Encryption Details

* **Algorithm:** AES-256-CBC (symmetric encryption)
* **Message Encryption:** Each message is encrypted on the server using a random IV and the session `AES_KEY`.
* **Message Decryption:** Clients or subscribers can decrypt messages using the same `AES_KEY` and the provided IV.
* **Security:**

  * IV ensures that the same message text encrypts differently every time.
  * AES-256-CBC provides strong confidentiality for stored and transmitted messages.


---
## Trade-offs or Limitations

* Currently, AES_KEY is hardcoded in both the client and server via         environment variables. There is no secure HTTPS-based key exchange implemented.

* Due to time constraints, dynamic session-based AES key generation and secure transmission to the client were not implemented.

* This means that while messages are encrypted in transit and storage, the static AES_KEY could be a security risk if the environment is compromised.


## Usage

1. **Register a user:**

```http
POST /api/auth/register
Body: { "username": "user1", "password": "secret", "publicKey": "..." }
```

2. **Login a user:**

```http
POST /api/auth/login
Body: { "username": "user1", "password": "secret" }
```

3. **Connect to SSE for live messages:**

```http
GET /api/messages/stream
Headers: { Cookie: token=<JWT> }
```

4. **Send a message:**

```http
POST /api/messages/send
Body: { "text": "<encrypted_text>", "iv": "<iv>" }
```

---

This setup ensures end-to-end message security while allowing real-time updates to multiple clients efficiently.
