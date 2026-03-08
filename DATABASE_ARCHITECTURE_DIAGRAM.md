# Fitosys Database Architecture - Phase 1 Complete

## Entity Relationship Diagram

```mermaid
erDiagram
    coaches ||--o{ programs : "owns"
    coaches ||--o{ clients : "manages"
    coaches ||--o{ enrollments : "tracks"
    coaches ||--o{ checkins : "reviews"
    coaches ||--o{ ai_summaries : "receives"
    coaches ||--o{ payments : "processes"
    coaches ||--o{ whatsapp_log : "monitors"
    
    programs ||--o{ enrollments : "contains"
    clients ||--o{ enrollments : "participates in"
    
    enrollments ||--o{ checkins : "generates"
    enrollments ||--o{ payments : "creates"
    
    clients ||--o{ whatsapp_log : "receives"
    
    coaches {
        uuid id PK
        text email UK
        text full_name
        text whatsapp_number
        text slug UK
        integer checkin_day
        text checkin_time
        timestamptz created_at
        timestamptz updated_at
    }
    
    programs {
        uuid id PK
        uuid coach_id FK
        text name
        text description
        integer duration_weeks
        decimal price
        boolean is_active
    }
    
    clients {
        uuid id PK
        uuid coach_id FK
        text full_name
        text whatsapp_number
        text email
        integer age
        text primary_goal
        text status
    }
    
    enrollments {
        uuid id PK
        uuid coach_id FK
        uuid client_id FK
        uuid program_id FK
        date start_date
        date end_date
        decimal amount_paid
        text status
        boolean renewal_reminder_1_sent
        boolean renewal_reminder_2_sent
    }
    
    checkins {
        uuid id PK
        uuid coach_id FK
        uuid client_id FK
        uuid enrollment_id FK
        integer week_number
        date check_date
        decimal weight_kg
        integer sessions_completed
        integer energy_score
        text notes
        timestamptz responded_at
    }
    
    ai_summaries {
        uuid id PK
        uuid coach_id FK
        date week_start_date
        date week_end_date
        text summary_text
        integer total_clients
        integer responded_count
        decimal avg_energy_score
        boolean delivered_to_coach
    }
    
    payments {
        uuid id PK
        uuid coach_id FK
        uuid client_id FK
        uuid enrollment_id FK
        decimal amount
        text currency
        text payment_type
        text gateway_payment_id
        text gateway_order_id
        text payment_gateway
    }
    
    whatsapp_log {
        uuid id PK
        uuid coach_id FK
        uuid client_id FK
        text direction
        text message_type
        text message_content
        text status
        timestamptz sent_at
    }
```

## Multi-Tenancy Architecture

```mermaid
graph TB
    subgraph "Authentication Layer"
        A[Supabase Auth] -->|auth.uid()| B[RLS Policies]
    end
    
    subgraph "Row Level Security"
        B -->|coach_id = auth.uid()| C[Programs]
        B -->|coach_id = auth.uid()| D[Clients]
        B -->|coach_id = auth.uid()| E[Enrollments]
        B -->|coach_id = auth.uid()| F[Checkins]
        B -->|coach_id = auth.uid| G[AI Summaries]
        B -->|coach_id = auth.uid()| H[Payments]
        B -->|coach_id = auth.uid()| I[WhatsApp Log]
    end
    
    subgraph "Service Role Bypass"
        J[Cron Jobs] -->|Service Key| K[Bypasses RLS]
        L[Webhooks] -->|Service Key| K
        M[Admin Tasks] -->|Service Key| K
    end
    
    style A fill:#E8001D,color:#fff
    style B fill:#E8001D,color:#fff
    style J fill:#0A0A0A,color:#fff
    style L fill:#0A0A0A,color:#fff
    style M fill:#0A0A0A,color:#fff
```

## Data Flow Architecture

### Weekly Check-In Cycle

```mermaid
sequenceDiagram
    participant Cron as Cron Job<br/>(Sunday 6:30 PM)
    participant DB as Database
    participant WA as WhatsApp API
    participant Client as Client
    participant Coach as Coach
    
    Cron->>DB: Query active enrollments
    DB-->>Cron: Return client list
    loop Each client
        Cron->>WA: Send check-in message
        WA->>Client: WhatsApp notification
        Client->>WA: Reply with data
        WA->>DB: Update checkins table
    end
    
    Note over DB: Week passes...
    
    Cron->>DB: Query all check-ins
    DB-->>Cron: Return weekly data
    Cron->>AI: Generate summary (OpenRouter)
    AI-->>Cron: Return summary text
    Cron->>DB: Save to ai_summaries
    Cron->>WA: Send to coach
    WA->>Coach: Weekly report
```

### Enrollment & Payment Flow

```mermaid
sequenceDiagram
    participant Coach
    participant System
    participant DB as Database
    participant Razorpay
    participant WA as WhatsApp
    
    Coach->>System: Create enrollment
    System->>DB: Insert pending enrollment
    System->>Razorpay: Create payment order
    Razorpay-->>System: Order ID
    System->>Coach: Show payment modal
    
    Coach->>Razorpay: Complete payment
    Razorpay->>DB: Webhook: payment captured
    DB->>DB: Update enrollment status = 'active'
    DB->>DB: Insert payment record
    
    Razorpay-->>System: Success callback
    System->>WA: Send welcome message
    WA->>Client: Welcome notification
```

## Index Strategy

### Query Patterns & Supporting Indexes

```mermaid
graph LR
    subgraph "Client Queries"
        A1[Find clients by coach] --> A2[idx_clients_coach]
        A3[Filter by status] --> A4[idx_clients_status]
        A5[Search by name] --> A6[idx_clients_full_name_trgm]
    end
    
    subgraph "Enrollment Queries"
        B1[Find by coach] --> B2[idx_enrollments_coach]
        B3[Date range queries] --> B4[idx_enrollments_dates]
        B5[Client enrollments] --> B6[idx_enrollments_client_status]
        B7[Upcoming renewals] --> B4
    end
    
    subgraph "Check-in Queries"
        C1[Timeline by coach+date] --> C2[idx_checkins_coach_date]
        C3[Client history] --> C4[idx_checkins_client_date]
        C5[By enrollment] --> C6[idx_checkins_enrollment]
    end
    
    subgraph "Payment Queries"
        D1[Coach payment history] --> D2[idx_payments_coach]
        D3[By enrollment] --> D4[idx_payments_enrollment]
        D5[Revenue by date] --> D6[idx_payments_paid_at]
    end
```

## RLS Policy Matrix

```
┌─────────────┬──────────┬─────────┬─────────┬──────────┐
│ Table       │ SELECT   │ INSERT  │ UPDATE  │ DELETE   │
├─────────────┼──────────┼─────────┼─────────┼──────────┤
│ coaches     │ ✅ Own   │ ❌      │ ✅ Own  │ ❌       │
│ programs    │ ✅ Own   │ ✅ Own  │ ✅ Own  │ ✅ Own   │
│ clients     │ ✅ Own   │ ✅ Own  │ ✅ Own  │ ✅ Own   │
│ enrollments │ ✅ Own   │ ✅ Own  │ ✅ Own  │ ✅ Own   │
│ checkins    │ ✅ Own   │ ✅ Own  │ ✅ Own  │ ✅ Own   │
│ ai_summaries│ ✅ Own   │ ✅ Own  │ ✅ Own  │ ✅ Own   │
│ payments    │ ✅ Own   │ ✅ Own  │ ✅ Own  │ ✅ Own   │
│ whatsapp_log│ ✅ Own   │ ✅ Own  │ ❌      │ ❌       │
└─────────────┴──────────┴─────────┴─────────┴──────────┘

Legend: ✅ = Allowed | ❌ = Not Allowed | Own = coach_id = auth.uid()
```

## Function Dependencies

```mermaid
graph TD
    subgraph "Application Layer"
        A[Signup Flow]
        B[Check-in System]
        C[Dashboard Stats]
    end
    
    subgraph "Database Functions"
        D[generate_unique_slug]
        E[calculate_enrollment_week]
        F[get_program_active_enrollments]
    end
    
    subgraph "Database Views"
        G[active_clients_view]
        H[upcoming_renewals_view]
        I[weekly_response_rates_view]
    end
    
    A --> D
    B --> E
    C --> F
    C --> G
    C --> H
    C --> I
```

## Performance Optimization Layers

```mermaid
graph TB
    subgraph "Layer 1: Application"
        A[Next.js App]
    end
    
    subgraph "Layer 2: Supabase Client"
        B[Browser Client<br/>Anon Key + RLS]
        C[Server Client<br/>Service Key]
    end
    
    subgraph "Layer 3: Database"
        D[Tables + RLS]
        E[Functions]
        F[Views]
    end
    
    subgraph "Layer 4: Optimization"
        G[Indexes<br/>24 Total]
        H[Triggers<br/>Auto-update]
        I[Constraints<br/>Data Quality]
    end
    
    A --> B
    A --> C
    B --> D
    C --> D
    C --> E
    C --> F
    D --> G
    D --> H
    D --> I
```

## Security Layers

```mermaid
graph TB
    subgraph "Layer 1: Authentication"
        A[Supabase Auth<br/>Email/Password]
    end
    
    subgraph "Layer 2: Authorization"
        B[RLS Policies<br/>coach_id = auth.uid()]
    end
    
    subgraph "Layer 3: Network"
        C[API Routes<br/>CRON_SECRET]
        D[Webhooks<br/>Signature Verification]
    end
    
    subgraph "Layer 4: Data"
        E[Constraints<br/>Validation]
        F[Cascade Deletes<br/>Referential Integrity]
    end
    
    A --> B
    B --> C
    B --> D
    C --> E
    D --> F
```

## Migration Version History

```
┌─────────────────────────────────────────────────────────┐
│ Migration 001: Initial Schema                           │
│ - 8 Tables Created                                      │
│ - Basic RLS (SELECT only)                               │
│ - 7 Basic Indexes                                       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Migration 002: Razorpay Integration                     │
│ - Gateway-agnostic columns                              │
│ - Pending enrollment support                            │
│ - Payment workflow updates                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Migration 003: Phase 1 Completion                       │
│ - Complete RLS (24 policies, full CRUD)                 │
│ - Auto-update triggers                                  │
│ - 3 Database functions                                  │
│ - 3 Analytical views                                    │
│ - 17 Additional indexes                                 │
│ - Cascade delete fixes                                  │
│ - Data validation constraints                           │
│ - Comprehensive documentation                           │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack Integration

```mermaid
graph TB
    subgraph "Frontend"
        A[Next.js 16<br/>App Router]
        B[React 19]
        C[Tailwind CSS v4]
        D[shadcn/ui]
    end
    
    subgraph "Backend Services"
        E[Supabase Auth]
        F[PostgreSQL]
        G[OpenRouter API<br/>Qwen 2.5 72B]
        H[Razorpay]
        I[Interakt WhatsApp]
    end
    
    subgraph "Infrastructure"
        J[Vercel Hosting]
        K[Vercel Cron]
        L[Hostinger DNS]
    end
    
    A --> E
    A --> F
    A --> G
    A --> H
    A --> I
    J --> A
    K --> A
    L --> J
```

---

**Document Version:** 1.0  
**Last Updated:** March 7, 2026  
**Phase:** 1 Complete ✅
