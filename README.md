# VIALUMEN
Vialumen is a platform designed to map the pathways of human knowledge and needs. Inspired by Maslow's hierarchy of needs, the application allows users to explore concepts across core themes: Physiology, Safety, Belonging, Esteem, and Actualization.

By utilizing a force-directed node graph, users can visually navigate through interconnected "Subthemes", dive deep into official, version-controlled content, and engage in community-driven discussions.

## 🏗 Architecture & Tech Stack
Vialumen uses a decoupled client-server architecture:

### Frontend (`/vialumen-frontend`)
* **Framework:** Next.js 16 (App Router) & React 19
* **Styling:** Tailwind CSS v4 & custom CSS variables for dynamic theming
* **UI Components:** Shadcn UI (Radix UI)
* **Graph Rendering:** Custom implementation using `d3-force` and `d3-zoom`
* **Data Fetching:** SWR & native Next.js Server Components
* **Authentication:** Better-Auth (Passkey, OAuth for Google, GitHub, GitLab)

### Backend (`/vialumen-backend`)
* **Language:** Go (1.26.0)
* **Routing:** Standard library `net/http` (ServeMux)
* **Database:** PostgreSQL (hosted on Neon)
* **Driver:** `pgx` (PostgreSQL driver and toolkit for Go)

## ✨ Current Features
* **Interactive Knowledge Graph:** A custom-built, physics-based 2D graph that renders subthemes and their connections using `d3-force`. Users can switch between a visual node map and a nested encyclopedia view.
* **Community Hub & Discussions:** Users can create posts, engage in nested, heavily-threaded comment sections, and cast upvotes/downvotes. Includes dynamically weighted discovery (Home) and trending feeds.
* **Authentication & Profiles:** Seamless login utilizing Better-Auth with Passkey support and OAuth providers. Users have public profiles and account management capabilities.
* **Dynamic Theming Engine:** The UI seamlessly shifts color palettes (backgrounds, primary, accents) based on the active hierarchy level you are browsing. Users can also lock in their preferred theme to override the dynamic switching.
* **Typography Control:** Users can customize their reading experience by adjusting base font sizes and toggling between multiple font families (Sans, Serif, Mono, Poppins, Playfair, Nunito).
* **Official Content Versioning:** A robust content delivery system that renders different content blocks (e.g., Overview, Pitfalls, Practices) and supports lazy-loading historical revisions of content with source citations and contributor credits.
* **Admin Workspace:** Dedicated portal for users with admin clearance to draft, format, and deploy official content payloads directly to the knowledge graph.

## 🚀 Upcoming Roadmap
* **Global Search Engine Integration**
* **Content Requests:** User-submitted drafts for official induction.
* **Expanded Subtheme Mapping**

## 🛠 Local Development Setup
To run Vialumen locally, you will need to start both the Go backend and the Next.js frontend.
### 1. Database Setup
Ensure you have a PostgreSQL database running (or a connection string from a provider). The database must have the Vialumen schema applied.
### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd vialumen-backend

```
Create a .env file in the root of the backend directory:
```env
DATABASE_URL=postgres://user:password@localhost:5432/vialumen
CORS_ALLOWED_ORIGIN=http://localhost:3000

```
Install dependencies and run the Go server:
```bash
go mod tidy
go run ./cmd/api/main.go

```
*The backend will start running on http://localhost:8080.*
### 3. Frontend Setup
Open a second terminal window and navigate to the frontend directory:
```bash
cd vialumen-frontend

```
Create a .env.local file in the root of the frontend directory:
```env
NEXT_PUBLIC_API=http://localhost:8080/api

```
Install the dependencies and start the development server:
```bash
npm install
npm run dev

```
*The frontend will start running on http://localhost:3000.*
