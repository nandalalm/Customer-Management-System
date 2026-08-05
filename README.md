# Customer Management System

An advanced CRM dashboard built with Next.js 16, React Query, and shadcn/ui. Supports full CRUD, real-time filtering, drag-and-drop reordering, bulk actions, and CSV export — all backed by an in-memory mock API.

---

## Architecture

Data flows in one direction through four layers:

```
API Routes (Next.js)
    ↓  NextResponse.json(PaginatedResponse<Customer>)
Service Layer  (src/services/customer.service.ts)
    ↓  axios, typed with generics
React Query Hooks  (src/hooks/)
    ↓  useQuery / useMutation + cache invalidation
Components  (src/components/)
    ↓  props + URL state via nuqs
```

### URL as State

Filter state, search, sort field/direction, page, and page size are all stored in the URL via `nuqs`. Every view is fully bookmarkable and shareable.

---

## Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── customers/
│   │       ├── data.ts          # In-memory Map store + seed data (50 customers)
│   │       ├── route.ts         # GET /api/customers, POST /api/customers
│   │       └── [id]/route.ts    # GET / PUT / DELETE /api/customers/:id
│   ├── globals.css              # Tailwind base + CSS custom properties
│   ├── layout.tsx               # Root layout: ThemeProvider → QueryProvider → NuqsAdapter
│   └── page.tsx                 # App shell: orchestrates table, drawer, toolbar
│
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.tsx    # Reusable confirm/cancel modal
│   │   ├── CustomerAvatar.tsx   # Avatar with initials + deterministic colour
│   │   ├── EmptyState.tsx       # Icon + title + description + optional action
│   │   ├── ErrorState.tsx       # Error icon + message + retry button
│   │   ├── LoadingSkeleton.tsx  # Shimmer rows for loading states
│   │   └── Pagination.tsx       # Prev/next, page indicator, page-size selector
│   ├── customers/
│   │   ├── BulkActionToolbar.tsx    # Set Active / Set Inactive / Delete / Export CSV
│   │   ├── CustomerDetails.tsx      # Read-only field grid + Edit + Update Last Contact
│   │   ├── CustomerDrawer.tsx       # Sheet with view / edit / create modes
│   │   ├── CustomerForm.tsx         # Unified create & edit form (RHF + Zod)
│   │   ├── CustomerNotes.tsx        # Standalone notes textarea with Save
│   │   ├── CustomerRow.tsx          # Desktop <tr> + mobile card, drag handle, checkbox
│   │   ├── CustomerTable.tsx        # Table with sort headers, DnD context, state sync
│   │   ├── DeleteConfirmDialog.tsx  # Single-customer delete confirmation
│   │   └── DraggableCustomerList.tsx# SortableContext wrapper for tbody
│   ├── filters/
│   │   ├── CompanyFilter.tsx    # Multi-select dropdown with search
│   │   ├── DateRangeFilter.tsx  # From/To date pickers (shadcn Calendar + Popover)
│   │   ├── FilterSidebar.tsx    # Sidebar container with active count badge
│   │   ├── FilterTemplates.tsx  # One-click presets (Active, Inactive, Recent)
│   │   ├── SavedFilters.tsx     # Named filter presets with DnD reorder
│   │   ├── StatusFilter.tsx     # Active / Inactive checkbox group
│   │   └── TextFilter.tsx       # Reusable labelled text input
│   └── layout/
│       ├── Header.tsx           # Logo, global search, theme toggle, Add Customer
│       └── PageLayout.tsx       # Desktop sidebar + mobile Sheet toggle
│
├── hooks/
│   ├── useBulkActions.ts        # Promise.allSettled bulk delete/status + summary toast
│   ├── useCreateCustomer.ts     # useMutation → POST + cache invalidation
│   ├── useCustomer.ts           # useQuery → GET /customers/:id
│   ├── useCustomers.ts          # useQuery → GET /customers with params
│   ├── useDebounce.ts           # Generic value debounce hook
│   ├── useDeleteCustomer.ts     # useMutation → DELETE + cache invalidation
│   ├── useFilters.ts            # All FilterState fields read/written to URL via nuqs
│   ├── useSavedFilters.ts       # Named filter presets persisted to localStorage
│   └── useUpdateCustomer.ts     # useMutation → PUT with optimistic update + rollback
│
├── lib/
│   └── axios.ts                 # Axios instance: baseURL /api, response error interceptor
│
├── providers/
│   ├── QueryProvider.tsx        # QueryClientProvider (staleTime: 30s)
│   └── ThemeProvider.tsx        # next-themes wrapper (defaultTheme: dark)
│
├── schemas/
│   └── customer.schema.ts       # Zod schemas: customerSchema, filterSchema
│
├── services/
│   └── customer.service.ts      # Sole axios caller — getCustomers, CRUD functions
│
├── types/
│   └── index.ts                 # All shared interfaces and union types
│
└── utils/
    └── format.utils.ts          # formatDate(iso), formatPhone(phone)
```

---

## Tech Stack

| Library | Why |
|---|---|
| **Next.js 16 (App Router)** | File-based routing, React Server Components, serverless API routes |
| **React Query (`@tanstack/react-query`)** | Server state management, cache invalidation, optimistic updates |
| **shadcn/ui** | Accessible, unstyled-by-default component primitives on top of Radix UI |
| **Tailwind CSS** | Utility-first styling with `dark:` variants — no runtime overhead |
| **nuqs** | Type-safe URL search param state — makes every filter/sort/page bookmarkable |
| **react-hook-form + Zod** | Performant uncontrolled forms with schema-driven validation |
| **@dnd-kit** | Accessible drag-and-drop with keyboard support and `activationConstraint` |
| **axios** | HTTP client with typed interceptors; isolated to the service layer |
| **next-themes** | Dark/light mode with `defaultTheme="dark"` and SSR flicker prevention |
| **sonner** | Toast notifications with `richColors` |
| **date-fns** | Lightweight date formatting without locale bloat |

---

## Running Locally

```bash
# 1. Clone
git clone https://github.com/nandalalm/Customer-Management-System.git
cd Customer-Management-System

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

No environment variables required — the app uses an in-memory data store seeded on first request.

### Other Commands

```bash
npm run build      # Production build (must pass before deploy)
npm run lint       # ESLint across src/
npx tsc --noEmit   # TypeScript type-check without emitting files
```

---

## Trade-offs

| Decision | What was simplified | Why |
|---|---|---|
| **In-memory data store** | A `Map<string, Customer>` in `data.ts` replaces a real database | Keeps the project zero-dependency on external services; data resets on server restart |
| **Local-only DnD order** | Row reorder is `useState` only — not persisted to the API | A real app would store order per-user in a DB; that complexity is out of scope here |
| **Client-side CSV** | CSV is built in the browser from a single large API fetch (`pageSize: 10_000`) | Avoids a dedicated export endpoint; sufficient for the mock data set size |
| **No authentication** | All routes are open | Auth (NextAuth, Clerk, etc.) would be the first production addition |
| **No optimistic update on bulk** | Bulk actions wait for `Promise.allSettled` before invalidating | Individual optimistic patches across many records are complex to roll back reliably |

---

## Future Improvements

- **Authentication** — NextAuth.js or Clerk for per-user sessions and route protection
- **Real database** — Replace the in-memory Map with PostgreSQL via Prisma or Drizzle
- **E2E tests** — Playwright or Cypress covering the full CRUD + filter + bulk action flows
- **Internationalisation** — `next-intl` for multi-language support
- **Real-time updates** — Server-Sent Events or WebSockets to push new customers to connected clients
- **Persistent DnD order** — Store per-user row order in the database
- **Advanced CSV** — Streaming export endpoint for very large datasets
- **Role-based access** — Read-only vs. admin permissions per user
