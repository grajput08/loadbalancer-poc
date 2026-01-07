const AWS = require("aws-sdk");

// Use LocalStack internal endpoint - try multiple options
// LocalStack Lambda functions run in the same Docker network
const getLocalstackEndpoint = () => {
  // Try environment variable first
  if (process.env.LOCALSTACK_HOSTNAME) {
    return `http://${process.env.LOCALSTACK_HOSTNAME}:4566`;
  }
  // Try internal service name (works when Lambda runs in same Docker network)
  if (process.env.AWS_LAMBDA_RUNTIME_API) {
    // We're in a Lambda runtime, try localstack service name
    return "http://localstack:4566";
  }
  // Fallback to host.docker.internal (Mac/Windows)
  return "http://host.docker.internal:4566";
};

const lambda = new AWS.Lambda({
  endpoint: getLocalstackEndpoint(),
  region: "us-east-1",
});

// Simple in-memory round robin
let index = 0;

exports.handler = async () => {
  const workers = [
    "loadbalancer-poc-local-worker1",
    "loadbalancer-poc-local-worker2",
    "loadbalancer-poc-local-worker3",
  ];

  const targetWorker = workers[index % workers.length];
  index++;

  const response = await lambda
    .invoke({
      FunctionName: targetWorker,
      InvocationType: "RequestResponse",
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      loadBalancedTo: targetWorker,
      workerResponse: JSON.parse(response.Payload),
    }),
  };
};
