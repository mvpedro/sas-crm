// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sas-crm",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // DynamoDB Tables
    const usersTable = new sst.aws.Dynamo("Users", {
      fields: {
        id: "string",
        email: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        emailIndex: {
          hashKey: "email",
        },
      },
    });

    const peopleTable = new sst.aws.Dynamo("People", {
      fields: {
        userId: "string",
        id: "string",
        email: "string",
        clientId: "string", // For GSI
      },
      primaryIndex: { hashKey: "userId", rangeKey: "id" },
      globalIndexes: {
        emailIndex: {
          hashKey: "email",
        },
        clientStakeholdersIndex: {
          hashKey: "clientId",
        },
      },
    });

    const clientsTable = new sst.aws.Dynamo("Clients", {
      fields: {
        userId: "string",
        id: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "id" },
    });

    const dealsTable = new sst.aws.Dynamo("Deals", {
      fields: {
        userId: "string",
        id: "string",
        clientId: "string",
        ownerId: "string",
        stage: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "id" },
      globalIndexes: {
        clientIndex: {
          hashKey: "clientId",
        },
        ownerIndex: {
          hashKey: "ownerId",
        },
        stageIndex: {
          hashKey: "stage",
        },
      },
    });

    const activitiesTable = new sst.aws.Dynamo("Activities", {
      fields: {
        userId: "string",
        id: "string",
        entityType: "string",
        entityId: "string",
        scheduledDate: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "id" },
      globalIndexes: {
        entityIndex: {
          hashKey: "entityType",
          rangeKey: "entityId",
        },
        scheduledDateIndex: {
          hashKey: "scheduledDate",
        },
      },
    });

    const pipelinesTable = new sst.aws.Dynamo("Pipelines", {
      fields: {
        userId: "string",
        id: "string",
        isDefault: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "id" },
      globalIndexes: {
        defaultIndex: {
          hashKey: "isDefault",
        },
      },
    });

    const tagsTable = new sst.aws.Dynamo("Tags", {
      fields: {
        userId: "string",
        id: "string",
        name: "string",
      },
      primaryIndex: { hashKey: "userId", rangeKey: "id" },
      globalIndexes: {
        nameIndex: {
          hashKey: "name",
        },
      },
    });

    // NextAuth DynamoDB Tables
    const sessionsTable = new sst.aws.Dynamo("Sessions", {
      fields: {
        sessionToken: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "sessionToken" },
      globalIndexes: {
        userIdIndex: {
          hashKey: "userId",
        },
      },
    });

    const accountsTable = new sst.aws.Dynamo("Accounts", {
      fields: {
        id: "string",
        userId: "string",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        userIdIndex: {
          hashKey: "userId",
        },
      },
    });

    const verificationTokensTable = new sst.aws.Dynamo("VerificationTokens", {
      fields: {
        identifier: "string",
        token: "string",
      },
      primaryIndex: { hashKey: "identifier", rangeKey: "token" },
    });

    // S3 Bucket for file uploads
    const uploadsBucket = new sst.aws.Bucket("Uploads", {
      public: false,
    });

    // Next.js Application
    const site = new sst.aws.Nextjs("MyWeb", {
      link: [
        usersTable,
        peopleTable,
        clientsTable,
        dealsTable,
        activitiesTable,
        pipelinesTable,
        tagsTable,
        sessionsTable,
        accountsTable,
        verificationTokensTable,
        uploadsBucket,
      ],
      environment: {
        NEXTAUTH_URL: $app.stage === "production" 
          ? "https://your-production-domain.com" 
          : "http://localhost:3000",
      },
    });

    return {
      site: site.url,
      tables: {
        users: usersTable.name,
        people: peopleTable.name,
        clients: clientsTable.name,
        deals: dealsTable.name,
        activities: activitiesTable.name,
        pipelines: pipelinesTable.name,
        tags: tagsTable.name,
        sessions: sessionsTable.name,
        accounts: accountsTable.name,
        verificationTokens: verificationTokensTable.name,
      },
      bucket: uploadsBucket.name,
    };
  },
});
