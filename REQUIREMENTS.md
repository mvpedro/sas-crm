# CRM System - Requirements & Features Specification

## Overview

This document outlines the complete requirements and features for a Customer Relationship Management (CRM) system built with Next.js and SST.dev, leveraging AWS serverless services.

## Technology Stack

- **Frontend Framework**: Next.js 16+ (App Router)
- **Infrastructure**: SST.dev (Serverless Stack)
- **Cloud Provider**: AWS
- **Authentication**: NextAuth.js (NextAuth)
- **Database**: AWS DynamoDB (via SST)
- **API**: AWS Lambda Functions (via SST)
- **Storage**: AWS S3 (for file attachments)

## Architecture Principles

1. **Serverless-First**: Maximize use of AWS serverless services
2. **Protected Routes**: All routes except home/login are protected
3. **Multi-tenancy Ready**: Architecture should support future multi-tenant features
4. **Scalable**: Design for horizontal scaling
5. **Cost-Effective**: Leverage serverless pay-per-use model

---

## 1. Authentication & Authorization

### 1.1 Authentication Requirements

- **Public Route**: Only the home/login page is publicly accessible
- **Protected Routes**: All other routes require authentication
- **Authentication Method**: 
  - Email/Password authentication via NextAuth.js
  - Session management using NextAuth sessions
  - Secure session storage (httpOnly cookies)
  - User data stored in DynamoDB

### 1.2 Authorization Requirements

- **User Model**: Internal users only - all authenticated users have full access
- **No Role-Based Access Control**: All authenticated users can perform all operations
- **Row-Level Security**: Users can only access their own data (data isolation by userId)
- **API Authorization**: All API endpoints must verify user authentication via NextAuth session

### 1.3 Authentication Features

- User registration (stored in DynamoDB)
- User login via NextAuth
- Password reset/forgot password
- Email verification (optional)
- Session management via NextAuth
- Logout functionality
- Protected route middleware using NextAuth

---

## 2. Core Entities

### 2.1 People Entity

**Purpose**: Represents individuals who can be:
- Deal owners (assigned to manage deals)
- Client stakeholders (contacts associated with clients)

**Properties**:
- `id` (UUID, Primary Key)
- `firstName` (String, Required)
- `lastName` (String, Required)
- `email` (String, Required, Unique)
- `phone` (String, Optional)
- `jobTitle` (String, Optional)
- `company` (String, Optional)
- `avatar` (String, Optional - S3 URL)
- `notes` (String, Optional)
- `createdAt` (DateTime, Required)
- `updatedAt` (DateTime, Required)
- `createdBy` (User ID, Required)
- `tags` (Array of Strings, Optional)

**Relationships**:
- Can be assigned as owner to multiple Deals
- Can be associated as stakeholder to multiple Clients
- Belongs to a User (creator)

**Features**:
- Create, Read, Update, Delete (CRUD) operations
- Search and filter people
- Assign people to deals and clients
- View all deals owned by a person
- View all clients where person is a stakeholder

---

### 2.2 Clients Entity

**Purpose**: Represents companies or organizations that can have multiple deals

**Properties**:
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `companyType` (String, Optional - e.g., "Corporation", "LLC", "Partnership")
- `industry` (String, Optional)
- `website` (String, Optional, URL)
- `address` (Object, Optional)
  - `street` (String)
  - `city` (String)
  - `state` (String)
  - `zipCode` (String)
  - `country` (String)
- `phone` (String, Optional)
- `email` (String, Optional)
- `description` (String, Optional)
- `status` (Enum, Required - "Active", "Inactive", "Prospect")
- `annualRevenue` (Number, Optional)
- `employeeCount` (Number, Optional)
- `tags` (Array of Strings, Optional)
- `createdAt` (DateTime, Required)
- `updatedAt` (DateTime, Required)
- `createdBy` (User ID, Required)

**Relationships**:
- Has many Deals (one-to-many)
- Has many People as stakeholders (many-to-many)
- Belongs to a User (creator)

**Features**:
- CRUD operations
- Search and filter clients
- View all deals associated with a client
- View all stakeholders (people) associated with a client
- Add/remove stakeholders
- Client activity timeline
- Notes and interactions tracking

---

### 2.3 Deals Entity

**Purpose**: Represents sales opportunities and transactions

**Properties**:
- `id` (UUID, Primary Key)
- `title` (String, Required) - "Título do Negócio"
- `value` (Number, Required) - "Valor do negócio"
- `currency` (Enum, Required) - "BRL" or "USD" - "BRL USD"
- `pipeline` (String, Required) - "Funil" (e.g., "Sales Pipeline", "Marketing Pipeline")
- `stage` (String, Required) - "Etapa" (e.g., "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost")
- `ownerId` (UUID, Foreign Key to People, Required) - "Dono"
- `expectedClosingDate` (Date, Optional) - "Data de fechamento prevista"
- `description` (String, Optional) - "Descrição do negócio"
- `clientId` (UUID, Foreign Key to Clients, Required)
- `probability` (Number, Optional, 0-100) - Percentage chance of closing
- `actualClosingDate` (Date, Optional) - Set when deal is closed
- `status` (Enum, Required) - "Open", "Won", "Lost", "Abandoned"
- `tags` (Array of Strings, Optional)
- `notes` (Array of Objects, Optional) - Activity notes
- `createdAt` (DateTime, Required)
- `updatedAt` (DateTime, Required)
- `createdBy` (User ID, Required)

**Relationships**:
- Belongs to one Client (many-to-one)
- Has one Owner (Person) (many-to-one)
- Belongs to a User (creator)

**Features**:
- CRUD operations
- Search and filter deals
- Pipeline visualization (Kanban board)
- Stage progression tracking
- Deal value calculations (total by stage, by owner, by client)
- Expected vs actual closing date tracking
- Deal activity timeline
- Notes and interactions
- Currency conversion display
- Deal forecasting and reporting

---

## 3. Additional Features & Entities

### 3.1 Activities/Interactions Entity

**Purpose**: Track all interactions with clients, deals, and people

**Properties**:
- `id` (UUID, Primary Key)
- `type` (Enum, Required) - "Call", "Email", "Meeting", "Note", "Task"
- `subject` (String, Required)
- `description` (String, Optional)
- `relatedTo` (Object, Required)
  - `entityType` (Enum) - "Deal", "Client", "Person"
  - `entityId` (UUID)
- `scheduledDate` (DateTime, Optional) - For scheduled activities
- `completedDate` (DateTime, Optional)
- `status` (Enum, Required) - "Scheduled", "Completed", "Cancelled"
- `assignedTo` (UUID, Foreign Key to People, Optional)
- `createdAt` (DateTime, Required)
- `createdBy` (User ID, Required)

**Features**:
- Create activities linked to deals, clients, or people
- Schedule future activities
- Mark activities as completed
- Activity timeline view
- Email reminders (future enhancement)

---

### 3.2 Tags System

**Purpose**: Flexible categorization across entities

**Features**:
- Create custom tags
- Apply multiple tags to Deals, Clients, and People
- Filter by tags
- Tag management (create, edit, delete)
- Tag suggestions based on usage

---

### 3.3 Pipelines & Stages

**Purpose**: Customizable sales pipelines

**Properties**:
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `stages` (Array of Objects, Required)
  - `name` (String)
  - `order` (Number)
  - `color` (String, Optional)
  - `probability` (Number, Optional, 0-100)
- `isDefault` (Boolean, Required)
- `createdAt` (DateTime, Required)
- `createdBy` (User ID, Required)

**Features**:
- Create custom pipelines
- Define stages with order and probability
- Set default pipeline
- Pipeline visualization (Kanban board)
- Drag-and-drop stage progression

---

### 3.4 Dashboard & Analytics

**Purpose**: Provide insights and overview of CRM data

**Features**:
- **Deal Metrics**:
  - Total deal value (by currency)
  - Deals by stage
  - Deals by owner
  - Win rate
  - Average deal size
  - Pipeline value
  - Forecasted revenue
- **Client Metrics**:
  - Total active clients
  - Clients by status
  - Clients by industry
  - Top clients by deal value
- **Activity Metrics**:
  - Activities completed this week/month
  - Upcoming scheduled activities
  - Activity completion rate
- **Charts & Visualizations**:
  - Deal value over time
  - Stage distribution
  - Owner performance
  - Client acquisition trends

---

### 3.5 Search & Filtering

**Features**:
- Global search across Deals, Clients, and People
- Advanced filtering:
  - By date ranges
  - By tags
  - By status
  - By owner
  - By value ranges
  - By custom fields
- Saved filters
- Quick filters (e.g., "My Deals", "This Week", "High Value")

---

### 3.6 Notifications (Future Enhancement)

**Features**:
- Email notifications for:
  - Deal stage changes
  - Upcoming closing dates
  - Assigned activities
  - Mentions in notes
- In-app notifications
- Notification preferences

---

## 4. User Interface Requirements

### 4.1 Layout & Navigation

- **Header**: 
  - Logo/Brand
  - Main navigation (Dashboard, Deals, Clients, People)
  - Search bar
  - User menu (Profile, Settings, Logout)
- **Sidebar** (Optional): Quick navigation, filters
- **Main Content Area**: Dynamic based on route
- **Responsive Design**: Mobile-friendly layout

### 4.2 Key Pages

1. **Home/Login Page** (Public)
   - Login form
   - Registration link
   - Forgot password link

2. **Dashboard** (Protected)
   - Overview metrics
   - Recent activities
   - Upcoming tasks
   - Quick actions

3. **Deals List** (Protected)
   - Table/List view
   - Kanban board view (by stage)
   - Filters and search
   - Create new deal button

4. **Deal Detail** (Protected)
   - Deal information form
   - Activity timeline
   - Notes section
   - Related client info
   - Owner information

5. **Clients List** (Protected)
   - Table/List view
   - Filters and search
   - Create new client button

6. **Client Detail** (Protected)
   - Client information form
   - Associated deals list
   - Stakeholders list
   - Activity timeline
   - Notes section

7. **People List** (Protected)
   - Table/List view
   - Filters and search
   - Create new person button

8. **Person Detail** (Protected)
   - Person information form
   - Owned deals list
   - Associated clients list
   - Activity timeline

---

## 5. AWS Services & SST Integration

### 5.1 Required AWS Services

1. **AWS DynamoDB**
   - Primary database for all entities
   - Tables:
     - `Users` - User accounts and authentication data
     - `People`
     - `Clients`
     - `Deals`
     - `Activities`
     - `Pipelines`
     - `Tags`
   - Global Secondary Indexes (GSI) for efficient queries

2. **AWS Lambda Functions**
   - API endpoints for CRUD operations
   - Business logic processing
   - Data validation

3. **AWS API Gateway**
   - RESTful API endpoints
   - Request routing to Lambda functions
   - CORS configuration

4. **AWS S3**
   - File storage for:
     - User avatars
     - Document attachments
     - Deal-related files

5. **AWS IAM**
   - Lambda execution roles
   - S3 bucket policies

### 5.2 SST Resources to Configure

- `sst.aws.Dynamo` - Database tables (including Users table)
- `sst.aws.Function` - Lambda functions
- `sst.aws.Api` or `sst.aws.ApiGatewayV2` - API Gateway
- `sst.aws.Bucket` - S3 storage
- `sst.aws.Nextjs` - Next.js application (already configured)

### 5.3 NextAuth Configuration

- NextAuth.js will be configured in the Next.js application
- Credentials provider for email/password authentication
- DynamoDB adapter for session and user management
- JWT or database sessions (configurable)

---

## 6. Data Model & Relationships

### 6.1 Entity Relationships

```
User (DynamoDB)
  ├── Creates → People
  ├── Creates → Clients
  ├── Creates → Deals
  └── Creates → Activities

Client
  ├── Has Many → Deals
  └── Has Many → People (as stakeholders)

Deal
  ├── Belongs To → Client
  └── Belongs To → Person (as owner)

Person
  ├── Owns Many → Deals
  └── Associated With Many → Clients (as stakeholder)

Activity
  └── Related To → Deal | Client | Person
```

### 6.2 DynamoDB Table Design

**Partition Key Strategy**:
- Use `userId` as partition key for user-scoped data
- Use `id` as sort key for unique identification
- Use GSIs for cross-entity queries

**Example Table Structure**:
- `Users`: PK = `id` (email or UUID), stores user credentials and profile
- `Deals`: PK = `userId`, SK = `dealId`, GSI1 = `clientId`, GSI2 = `ownerId`
- `Clients`: PK = `userId`, SK = `clientId`
- `People`: PK = `userId`, SK = `personId`

**NextAuth DynamoDB Adapter Tables** (if using database sessions):
- `sessions`: Stores NextAuth sessions
- `accounts`: Stores OAuth account links (if needed in future)
- `verificationTokens`: Stores email verification tokens

---

## 7. API Requirements

### 7.1 Authentication Endpoints

NextAuth.js provides these endpoints automatically:
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

Additional custom endpoints:
- `POST /api/auth/register` - User registration (custom endpoint)
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### 7.2 Deal Endpoints

- `GET /api/deals` - List deals (with filters)
- `GET /api/deals/:id` - Get deal details
- `POST /api/deals` - Create deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal
- `PATCH /api/deals/:id/stage` - Update deal stage
- `GET /api/deals/stats` - Get deal statistics

### 7.3 Client Endpoints

- `GET /api/clients` - List clients (with filters)
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/:id/deals` - Get client's deals
- `POST /api/clients/:id/stakeholders` - Add stakeholder
- `DELETE /api/clients/:id/stakeholders/:personId` - Remove stakeholder

### 7.4 People Endpoints

- `GET /api/people` - List people (with filters)
- `GET /api/people/:id` - Get person details
- `POST /api/people` - Create person
- `PUT /api/people/:id` - Update person
- `DELETE /api/people/:id` - Delete person
- `GET /api/people/:id/deals` - Get person's owned deals
- `GET /api/people/:id/clients` - Get person's associated clients

### 7.5 Activity Endpoints

- `GET /api/activities` - List activities (with filters)
- `GET /api/activities/:id` - Get activity details
- `POST /api/activities` - Create activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `PATCH /api/activities/:id/complete` - Mark activity as completed

### 7.6 Dashboard Endpoints

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activities` - Get recent activities
- `GET /api/dashboard/upcoming-tasks` - Get upcoming tasks

---

## 8. Security Requirements

1. **Authentication**:
   - All API endpoints must verify NextAuth session
   - Sessions stored in httpOnly cookies via NextAuth
   - Session expiration and refresh handled by NextAuth

2. **Authorization**:
   - All authenticated users have full access (internal users only)
   - Users can only access their own data (data isolation by userId)
   - Row-level security in DynamoDB queries
   - API-level authorization checks (verify session exists)

3. **Data Validation**:
   - Input validation on all API endpoints
   - SQL injection prevention (N/A for DynamoDB, but validate inputs)
   - XSS prevention in frontend

4. **CORS**:
   - Configured CORS policies
   - Allow only trusted origins

5. **Rate Limiting**:
   - API rate limiting to prevent abuse
   - Per-user rate limits

---

## 9. Performance Requirements

1. **Response Times**:
   - API responses < 500ms (p95)
   - Page load times < 2s
   - Search results < 1s

2. **Scalability**:
   - Support 1000+ concurrent users
   - Handle 10,000+ deals per user
   - Efficient pagination for large datasets

3. **Caching**:
   - Cache frequently accessed data
   - Use Next.js caching strategies
   - DynamoDB query optimization

---

## 10. Development Phases

### Phase 1: Foundation
- [ ] SST infrastructure setup
- [ ] Authentication (NextAuth.js integration with DynamoDB)
- [ ] Protected routes middleware
- [ ] Basic UI layout

### Phase 2: Core Entities
- [ ] People entity (CRUD)
- [ ] Clients entity (CRUD)
- [ ] Deals entity (CRUD)
- [ ] Basic relationships

### Phase 3: Advanced Features
- [ ] Pipeline and stages
- [ ] Activities/Interactions
- [ ] Tags system
- [ ] Search and filtering

### Phase 4: Analytics & Reporting
- [ ] Dashboard
- [ ] Statistics and metrics
- [ ] Charts and visualizations

### Phase 5: Enhancements
- [ ] File uploads (S3)
- [ ] Advanced filtering
- [ ] Export functionality
- [ ] Notifications (optional)

---

## 11. Future Enhancements (Out of Scope for MVP)

1. **Multi-tenancy**: Support for multiple organizations
2. **Email Integration**: Sync emails with activities
3. **Calendar Integration**: Sync with Google Calendar/Outlook
4. **Document Management**: Advanced file management
5. **Custom Fields**: User-defined custom fields
6. **Workflow Automation**: Automated workflows and triggers
7. **Mobile App**: Native mobile applications
8. **API for Integrations**: Public API for third-party integrations
9. **Advanced Reporting**: Custom report builder
10. **Team Collaboration**: Comments, mentions, sharing

---

## 12. Success Criteria

- ✅ Users can authenticate and access protected routes
- ✅ Users can create, read, update, and delete Deals, Clients, and People
- ✅ Deals are properly linked to Clients and Owners
- ✅ All deal properties are captured and displayed
- ✅ Pipeline visualization works correctly
- ✅ Search and filtering function properly
- ✅ Dashboard displays accurate metrics
- ✅ System is responsive and performs well
- ✅ All data is properly secured and isolated per user

---

## Notes

- All text and labels should be in English
- Currency support for BRL and USD
- Date formats should be configurable (ISO 8601 standard)
- Consider timezone handling for dates
- Design for internationalization (i18n) from the start if possible

