# Aanur Textile — Mermaid Diagram Style Guide

When generating diagrams for architecture reports, design specs, or pull requests, use these consistent styles and dark-mode color tokens.

---

## Color Tokens

| Layer | Stroke Color | Hex Code | Fill (Dark) | Label Accent |
|---|---|---|---|---|
| **Frontend / Client** | Blue | `#58a6ff` | `#0d1117` | React 19, Vite, GSAP |
| **Server / Middleware** | Green | `#3fb950` | `#0d1117` | Express / Vite Middleware |
| **Database / MongoDB** | Emerald | `#10b981` | `#0d1117` | MongoDB Atlas, Mongoose |
| **Email / Notification** | Orange | `#f97316` | `#0d1117` | Resend API, Gmail |
| **Agent / MCP Server** | Purple | `#a855f7` | `#0d1117` | Resend MCP Tools |
| **Error / Alert** | Red | `#ef4444` | `#0d1117` | Failure Fallbacks |

---

## Standard Flowchart Template

```mermaid
graph TB
    subgraph UI["💻 Frontend"]
        A["Checkout"]
    end
    subgraph API["⚙️ Middleware"]
        B["/api/orders"]
    end
    subgraph DB["🍃 MongoDB Atlas"]
        C[("Order.create()")]
    end
    subgraph Mail["✉️ Resend"]
        D["sendOrderEmail()"]
    end

    A -->|"POST JSON"| B
    B -->|"Mongoose Insert"| C
    B -->|"Trigger Email"| D

    style UI fill:#0d1117,stroke:#58a6ff,color:#c9d1d9
    style API fill:#0d1117,stroke:#3fb950,color:#c9d1d9
    style DB fill:#0d1117,stroke:#10b981,color:#c9d1d9
    style Mail fill:#0d1117,stroke:#f97316,color:#c9d1d9
```

---

## Sequence Diagram Guidelines

Use sequence diagrams to depict data flow:

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser as React App (Checkout)
    participant API as Express Server (/api/orders)
    participant DB as MongoDB Atlas
    participant Email as Resend API

    User->>Browser: Clicks "Place Order"
    Browser->>API: POST /api/orders (JSON)
    API->>DB: Order.create(...)
    DB-->>API: Returning saved order doc
    API->>Email: sendOrderEmail(order)
    Email-->>API: 200 OK (id: re_xxx)
    API-->>Browser: { success: true, orderRef: "..." }
    Browser-->>User: Displays Order Confirmation Screen
```
