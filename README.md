# SAS CRM

A Customer Relationship Management (CRM) system built with Next.js, SST.dev, and AWS serverless services.

## Tech Stack

- **Frontend**: Next.js 16+ (App Router)
- **Infrastructure**: SST.dev (Serverless Stack)
- **Database**: AWS DynamoDB
- **Storage**: AWS S3
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate credentials
- SST CLI installed globally: `npm install -g sst`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the `NEXTAUTH_SECRET` with a secure random string:
```bash
openssl rand -base64 32
```

### 3. Deploy Infrastructure

Deploy the SST infrastructure (DynamoDB tables, S3 bucket, etc.):

```bash
npm run sst:dev
```

This will:
- Create all DynamoDB tables
- Create S3 bucket for file uploads
- Set up IAM roles and policies
- Start the Next.js development server with linked resources

### 4. Run Development Server

In a separate terminal, run:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── deals/             # Deals pages
│   ├── clients/           # Clients pages
│   └── people/            # People pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── auth/             # NextAuth configuration
│   ├── db/               # DynamoDB helpers
│   └── utils/             # Utility functions
├── types/                 # TypeScript type definitions
└── sst.config.ts         # SST infrastructure configuration
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sst:dev` - Start SST dev mode (deploys infrastructure)
- `npm run sst:deploy` - Deploy to a stage
- `npm run sst:remove` - Remove deployed resources
- `npm run sst:console` - Open SST console

## Infrastructure

The infrastructure is defined in `sst.config.ts` and includes:

- **DynamoDB Tables**:
  - Users
  - People
  - Clients
  - Deals
  - Activities
  - Pipelines
  - Tags
  - Sessions (NextAuth)
  - Accounts (NextAuth)
  - VerificationTokens (NextAuth)

- **S3 Bucket**: For file uploads (avatars, documents)

All resources are automatically linked to the Next.js application and available via environment variables.

## Development Phases

See [ROADMAP.md](./ROADMAP.md) for the complete implementation roadmap.

**Current Phase**: Phase 0 - Project Setup & Infrastructure Foundation ✅

## Documentation

- [Requirements](./REQUIREMENTS.md) - Complete feature requirements
- [Roadmap](./ROADMAP.md) - Implementation phases and timeline

## License

Private project
