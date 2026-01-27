# Project Technology Stack

## Core Architecture
**Type**: Full-Stack Web Application (PERN-adjacent)
**Architecture Style**: Client-Server with Real-time capabilities

## Frontend (Client)
*   **Framework**: React 19 (Latest)
*   **Build Tool**: Vite (Ultra-fast HMR & Build)
*   **Language**: JavaScript (ES6+ Modules)
*   **Styling**: TailwindCSS 4 (Utility-first)
*   **Maps**: Leaflet + React-Leaflet
*   **State/Data**: Native React Hooks (`useState`, `useEffect`) + Axios Service Layer

## Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Module System**: CommonJS (`require`) with Modern Syntax (`async/await`)
*   **Real-time**: Socket.io (Bi-directional communication)

## Database & Auth (Infrastructure)
*   **Platform**: Supabase
*   **Database**: PostgreSQL
*   **Features**:
    *   Row Level Security (RLS)
    *   Real-time Subscriptions
    *   PostGIS (for Geospatial queries)
*   **Authentication**:
    *   JWT (JSON Web Tokens)
    *   Supabase Auth (Users table)

## External APIs
*   **LocationIQ**: Geocoding, Reverse Geocoding, and Tiles

## Security & "10/10" Features
*   **Authentication**: Bearer Token (JWT) attached via Axios Interceptors.
*   **Resilience**: Centralized API Service with Error Normalization.
*   **Type Safety**: Runtime checks (Manual validation, moving towards robust schemas).
