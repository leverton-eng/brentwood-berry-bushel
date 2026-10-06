# Brentwood U-Pick Connect

Brentwood U-Pick Connect is a responsive, mobile-friendly web application designed to provide a centralized resource for discovering participating U-pick farms in Brentwood, California and planning farm visits.

The application brings together farm information, produce and harvest availability, operating information, events, mapping, and visit-planning resources. The Minimum Viable Product (MVP) was developed from the project's approved requirements, user stories, and acceptance criteria and includes functionality for Visitors, Farmers, and Administrators.

## Live Application

Brentwood U-Pick Connect can be accessed at:

https://lovable.dev/preview/ApueEoF0I4tFWVSjfBzO4swrHKVorRJg

## Key Functional Modules

### 1. Visitor Experience

The visitor experience supports the primary farm-discovery and visit-planning workflows.

**Farm Discovery and Profiles**
- Browse participating Brentwood U-pick farms
- Search and filter farms by produce
- Open individual farm profiles
- View available farm descriptions, locations, contact information, operating hours, produce, harvest information, events, and visitor guidance

**Produce and Harvest Information**
- View produce availability and harvest information for participating farms
- View seasonal produce information through the Harvest Calendar

**Farm Map**
- View participating farms on the Farm Map
- Access corresponding farm information
- Open external directions for a selected farm

**Saved Farms and Visit Planning**
- Save participating farms for later
- View and reopen saved farm profiles
- Select farms for a planned visit
- Choose a visit date and party size
- Add visit notes
- View expected crowd information when planning a visit

**Events and Visit Preparation**
- Browse farm and community events
- View available event dates, locations, schedules, and descriptions
- Access visitor preparation guidance and other visit considerations
- Share supported visit information

**Visitor Assistant**
- Ask questions about farms, produce, seasons, operating information, locations, and visit preparation
- Receive responses based on information available within the application

### 2. Farmer Workspace

The Farmer workspace demonstrates the application's planned farm-management workflows.

Farmers can:

- Update farm operating information
- Update operating status and hours
- Manage produce and harvest availability
- Manage farm event information
- View when farm information was last updated

Changes made through the demonstration workspace are maintained through client-side application storage and reflected in applicable visitor-facing features.

### 3. Administrator Workspace

The Administrator workspace demonstrates application-level content-management functions.

Administrators can:

- Manage participating farm information
- Manage produce and harvest information
- Manage event information
- Review and manage application content
- Review information that may need updating
- View basic application reporting and analytics

## Technology Stack & Architecture

Brentwood U-Pick Connect uses a React and TypeScript application architecture designed for responsive desktop and mobile use.

### Frontend

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS 4
- Radix UI

### Application Libraries and Validation

- TanStack React Query
- Zod

### Testing

- Vitest
- React Testing Library

### Data and Application State

The current MVP uses application data included within the project along with client-side storage for saved farms, planned visits, and demonstration updates.

The current prototype does not require an external database or external authentication service to run locally.

## Farm Map

The Farm Map is rendered within the application using React, SVG, and CSS. Latitude and longitude values stored with participating farm records are used to position farm markers within a predefined Brentwood geographic area.

The internal Farm Map does not depend on an external mapping SDK or map-tile provider. Google Maps is used only when a visitor selects the option to obtain external directions.

## Project Directory Structure

```text
brentwood-berry-bushel/
│
├── public/                 # Public application assets
│
├── src/                    # Application source code
│   ├── components/         # Reusable interface components
│   ├── data/               # Farm, produce, harvest, event, and related data
│   ├── lib/                # Shared application logic, state, and utilities
│   ├── routes/             # Application pages and route-level functionality
│   └── test/               # Application tests
│
├── package.json            # Project dependencies and npm scripts
├── package-lock.json       # Dependency lock file
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

Key areas of the application include:

- `src/routes/` – Visitor, Farmer, and Administrator pages and workflows
- `src/components/` – reusable interface and application components
- `src/data/` – farm, produce, harvest, event, and supporting application data
- `src/lib/` – shared application logic, state management, and utilities
- `src/test/` – automated application tests
- `public/` – public application assets

## Local Installation & Setup

### Prerequisites

Install Node.js and npm before running the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/leverton-eng/brentwood-berry-bushel.git
```

### 2. Open the Project Directory

```bash
cd brentwood-berry-bushel
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local address displayed in the terminal to view the application.

### 5. Create a Production Build

```bash
npm run build
```

### Additional Commands

Preview the production build:

```bash
npm run preview
```

Run the linter:

```bash
npm run lint
```

Run automated tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Format the project:

```bash
npm run format
```

## Testing and Requirements Validation

Application testing is based on the project's documented requirements, user stories, and acceptance criteria.

Testing covers the primary Visitor, Farmer, and Administrator workflows, including:

- Farm browsing and farm profiles
- Produce search and filtering
- Produce and harvest information
- Farm Map and directions
- Harvest Calendar
- Saved farms
- Visit planning
- Expected visitor levels
- Events
- Visit-preparation information
- Sharing functionality
- Visitor assistance
- Farmer workspace
- Administrator workspace
- Responsive desktop and mobile behavior

Automated tests included in the project can be run with:

```bash
npm run test
```

## Data and Setup Assumptions

The current application uses sample data for farms, produce, harvest seasons, events, operating information, and other application features.

Sample information is used for demonstration purposes and should not be considered verified real-time information from individual Brentwood farms.

The current MVP does not require:

- An external database
- External user authentication
- An external map SDK or map-tile service for the internal Farm Map

## Current Limitations and Future Improvements

The current application is an MVP and has several limitations:

- Farm and harvest information is demonstration data rather than verified real-time farm data.
- Saved farms, planned visits, and demonstration updates are maintained through client-side storage rather than a persistent backend database.
- The current prototype does not implement production user authentication and authorization.
- Farmer and Administrator workspaces demonstrate the intended role-based management workflows but do not connect to a production backend.
- External directions depend on Google Maps when the directions option is selected.

Future development could include persistent backend storage, secure user authentication and role-based authorization, verified real-time farm information, and production-ready Farmer and Administrator data management.

## Team Members

- Lorraine Everton
- Fei Teng
- Sheila Olewe
- Rohan Sehgal

## Project Information

**University:** Boston University  
**Course:** MET CS 632 – IT Project Management  
**Milestone:** Milestone 2  
**Project:** Brentwood U-Pick Connect
