// DynamoDB client and helper functions
// This will be implemented in later phases when we set up the DynamoDB client

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Get table names from SST resources
// These will be available via environment variables when linked in SST
const getTableName = (tableKey: string): string => {
  // In SST, linked resources are available via Resource.* syntax
  // For now, we'll use environment variables
  return process.env[`SST_Resource_${tableKey}`] || "";
};

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const dynamoClient = DynamoDBDocumentClient.from(client);

// Table name getters (will be populated by SST)
export const Tables = {
  Users: getTableName("Users"),
  People: getTableName("People"),
  Clients: getTableName("Clients"),
  Deals: getTableName("Deals"),
  Activities: getTableName("Activities"),
  Pipelines: getTableName("Pipelines"),
  Tags: getTableName("Tags"),
  Sessions: getTableName("Sessions"),
  Accounts: getTableName("Accounts"),
  VerificationTokens: getTableName("VerificationTokens"),
};

// Helper function to get current user ID from session
// This will be implemented when we set up NextAuth
export function getUserId(): string | null {
  // TODO: Implement when NextAuth is set up
  return null;
}

