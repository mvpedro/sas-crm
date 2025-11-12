// Test configuration to find correct syntax
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
    // Try minimal table configuration
    const testTable = new sst.aws.Dynamo("Test", {
      transform: {
        table: {
          keySchema: [
            { AttributeName: "id", KeyType: "HASH" },
          ],
          attributeDefinitions: [
            { AttributeName: "id", AttributeType: "S" },
          ],
        },
      },
    });

    return {};
  },
});

