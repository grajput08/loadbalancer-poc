# Load Balancer + Rate Limiting POC (LocalStack)

## 🎯 POC Title

Serverless Load Balancer with Rate Limiting using API Gateway + Lambda (LocalStack)

## 🧠 Core Concept (Very Simple)

- Single API endpoint
- API Gateway applies rate limiting
- Requests go to a Dispatcher Lambda
- Dispatcher load-balances traffic across multiple workers
- Everything runs locally on LocalStack

## 🏗 Architecture

```
Client
  |
  v
API Gateway (Rate Limit Enabled)
  |
  v
Dispatcher Lambda (Load Balancer)
  |
  |--> Worker Lambda 1
  |--> Worker Lambda 2
  |--> Worker Lambda 3
```

## 🧩 Services Used (Minimal & Clear)

| Service | Purpose |
|---------|---------|
| API Gateway | Rate limiting |
| Lambda | Dispatcher + Workers |
| LocalStack | Local AWS |
| Serverless | Deployment |

## 📁 Project Structure

```
loadbalancer-poc/
├── serverless.yml
├── dispatcher.js
├── worker1.js
├── worker2.js
├── worker3.js
├── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

1. Install Node.js (v18 or higher)
2. Install LocalStack: `pip install localstack` or `brew install localstack/tap/localstack-cli`
3. Install Serverless Framework: `npm install -g serverless`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start LocalStack:
```bash
localstack start -d
```

3. Deploy the stack:
```bash
npm run deploy
# or
serverless deploy --stage local
```

## 🧪 Testing

### 1. Test Load Balancing

After deployment, you'll get an API endpoint. Use it to test load balancing:

```bash
# Replace <api-id> with your actual API Gateway ID from deployment output
curl http://localhost:4566/restapis/<api-id>/local/_user_request_/request
```

Call it multiple times to see requests distributed across workers:

**Sample Responses:**
```json
{ "loadBalancedTo": "loadbalancer-poc-local-worker1", "workerResponse": { "worker": "Worker 1", "handledAt": "2024-01-01T12:00:00.000Z" } }
{ "loadBalancedTo": "loadbalancer-poc-local-worker2", "workerResponse": { "worker": "Worker 2", "handledAt": "2024-01-01T12:00:01.000Z" } }
{ "loadBalancedTo": "loadbalancer-poc-local-worker3", "workerResponse": { "worker": "Worker 3", "handledAt": "2024-01-01T12:00:02.000Z" } }
```

### 2. Test Rate Limiting

Send multiple rapid requests:

```bash
for i in {1..5}; do curl http://localhost:4566/restapis/<api-id>/local/_user_request_/request; echo ""; done
```

**Expected Result:**
- First 2 requests → ✅ Success (200 OK)
- Extra requests → ❌ 429 Too Many Requests

## ⚙️ Configuration

### Rate Limit Settings

Configured in `serverless.yml`:
- `maxRequestsPerSecond: 2` - Maximum 2 requests per second
- `maxConcurrentRequests: 1` - Maximum 1 concurrent request

### Load Balancing

The dispatcher uses a simple round-robin algorithm to distribute requests across 3 worker Lambdas.

## 🧹 Cleanup

To remove the deployed stack:

```bash
npm run remove
# or
serverless remove --stage local
```

To stop LocalStack:

```bash
localstack stop
```

## 📝 Notes

- The dispatcher uses in-memory round-robin (resets on cold start)
- Rate limiting is enforced at the API Gateway level
- All services run locally via LocalStack
- Worker functions are stateless and return simple responses
