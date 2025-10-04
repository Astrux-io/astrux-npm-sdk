# Astrux JavaScript/TypeScript SDK

Official SDK for interacting with the Astrux API in JavaScript and TypeScript.

## Installation

```bash
npm install astrux
```

## Configuration

To use the SDK, you need an Astrux API key. You can provide it in two ways:

### Environment variable (recommended)

```bash
export ASTRUX_API_KEY=your_api_key
```

### Direct configuration

```typescript
import { Astrux } from 'astrux';

const client = new Astrux({
  apiKey: 'your_api_key'
});
```

## Usage

### Basic prediction

```typescript
import { Astrux } from 'astrux';

const client = new Astrux();

try {
  const result = await client.models.predict({
    model: 'model-name',
    input: {
      feature1: 'value1',
      feature2: 42
    }
  });

  console.log('Score:', result.score);
  console.log('Class:', result.class_);
  console.log('Probabilities:', result.proba);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Prediction with specific version

```typescript
const result = await client.models.predict({
  model: 'model-name',
  input: { /* your data */ },
  version: 2
});
```

### Timeout configuration

The default timeout is 30 seconds. You can customize it:

```typescript
const client = new Astrux({
  apiKey: 'your_api_key',
  timeout: 60000 // 60 seconds
});
```

## Response

The `predict` method returns a `PredictResponse` object with the following properties:

```typescript
{
  score?: number;          // Prediction score (for regression)
  class_?: string;         // Predicted class (for classification)
  proba?: number[];        // Probabilities for each class (for classification)
  model_id?: string;       // Model identifier
  model_name?: string;     // Model name
  version?: number;        // Model version used
  task_type?: string;      // Task type (classification or regression)
}
```

## Error handling

The SDK provides several specific error types:

```typescript
import { 
  AstruxError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
  ServerError
} from 'astrux';

try {
  const result = await client.models.predict({ /* ... */ });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication issue:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Invalid data:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
  } else if (error instanceof NotFoundError) {
    console.error('Model not found:', error.message);
  } else if (error instanceof ServerError) {
    console.error('Server error:', error.message);
  }
}
```

### Error types

- **`AuthenticationError`** (401): Missing or invalid API key
- **`NotFoundError`** (404): Model not found
- **`ValidationError`** (400, 422): Invalid parameters
- **`RateLimitError`** (429): Request rate limit exceeded
- **`ServerError`** (500+): Server-side error
- **`AstruxError`**: Generic error

All errors contain `status` (HTTP code) and `payload` (server response) properties when available.

## Examples

### Classification

```typescript
const result = await client.models.predict({
  model: 'spam-classifier',
  input: {
    text: 'Congratulations! You won $1,000,000!'
  }
});

console.log(`Predicted class: ${result.class_}`);
console.log(`Confidence: ${result.score}`);
console.log(`Probabilities: ${result.proba}`);
```

### Regression

```typescript
const result = await client.models.predict({
  model: 'house-price-predictor',
  input: {
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1500,
    location: 'downtown'
  }
});

console.log(`Predicted price: $${result.score}`);
```

## Support

- **Website**: [https://astrux.io](https://astrux.io)
- **Documentation**: [https://docs.astrux.io](https://docs.astrux.io)
- **Issues**: [https://github.com/astrux-labs/astrux-js/issues](https://github.com/astrux-labs/astrux-js/issues)

## Requirements

- Node.js >= 18

## License

MIT © Thomas Bodénan