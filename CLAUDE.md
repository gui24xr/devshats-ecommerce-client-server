# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (with Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Project Architecture

This is a Next.js 15 e-commerce application with TypeScript and Tailwind CSS, built around a customizable store template system.

### Core Architecture

- **Next.js App Router**: Uses the new app directory structure with server components
- **State Management**: Zustand stores for client-side state (cart, products, checkout)
- **Styling**: Tailwind CSS with custom configurations
- **UI Components**: Ant Design, Headless UI, and Lucide React icons
- **Data Layer**: Mock JSON data with a service layer abstraction

### Key Directories

- `src/app/`: Next.js app router pages and API routes
- `src/components/`: Reusable React components
- `src/stores/`: Zustand state management stores
- `src/lib/`: Service layer and utilities (DataService for data fetching)
- `src/data/`: Mock JSON data files for different store types
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions

### Data Structure

The application uses a template-based store configuration system:

- **DataService**: Central service for data fetching (`src/lib/DataService.ts`)
- **Mock Data**: Three store templates (restaurant, pizzeria, tiendaropa) in `src/data/`
- **Store Configuration**: Each mock file contains complete store setup including:
  - Business content and branding
  - Products with variants and customization options
  - UI configuration (navbar, portrait, etc.)
  - Branch information

### State Management (Zustand Stores)

- **useCartStore**: Shopping cart functionality with item management
- **useProductsStore**: Product catalog and filtering
- **useStoreCheckout**: Checkout process management
- **useProductBuilderStore**: Product customization logic
- **useBranchesStore**: Store location management

### Image Configuration

Next.js image optimization is configured for external domains in `next.config.ts`:
- cdn.pixabay.com
- media.istockphoto.com
- images.pexels.com
- images.unsplash.com

### Path Aliases

TypeScript is configured with `@/*` alias pointing to `src/*` for cleaner imports.

### Key Components

- **Layout**: Global layout with cart and product customizer containers
- **ClientWrapper**: Wraps components requiring client-side rendering
- **ProductsContainer**: Main product display with template-based rendering
- **Cart System**: FloatingCardWidget, CartDetail, CartCheckout components
- **Checkout Flow**: Multi-step checkout with form validation

The application is designed to be easily customizable for different business types by switching the mock data file in DataService.