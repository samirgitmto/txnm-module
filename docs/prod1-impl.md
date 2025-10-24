
## Environment Configuration

### **Current API Configuration**
The frontend currently uses a hardcoded localhost API endpoint:
```typescript
// base-api.service.ts
private readonly baseUrl = 'http://localhost:8241/api';
```

### **Production Environment Setup**
We need to create environment files for different deployment stages:

#### **1. Environment Files Structure**
```
src/
├── environments/
│   ├── environment.ts          # Development
│   ├── environment.prod.ts     # Production
│   └── environment.staging.ts  # Staging (optional)
```

#### **2. Environment Configuration**
```typescript
// src/environments/environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8241/api',
  appName: 'TXNM Development',
  version: '1.0.0'
};

// src/environments/environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'http://<EC2-PUBLIC-IP>:8241/api',
  appName: 'TXNM',
  version: '1.0.0'
};
```

#### **3. Update Base API Service**
```typescript
// base-api.service.ts
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private readonly baseUrl = environment.apiUrl;
  // ... rest of the service
}
```

---

## Build Configuration

### **Angular Build Settings**
The current `angular.json` configuration needs optimization for production:

#### **Current Configuration**
```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kB",
          "maximumError": "1MB"
        }
      ],
      "outputHashing": "all"
    }
  }
}
```

#### **Optimized Production Configuration**
```json
{
  "configurations": {
    "production": {
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kB",
          "maximumError": "1MB"
        },
        {
          "type": "anyComponentStyle",
          "maximumWarning": "4kB",
          "maximumError": "8kB"
        }
      ],
      "outputHashing": "all",
      "optimization": true,
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

### **Build Commands**
```bash
# Development build
npm run build

# Production build
npm run build --configuration=production

# Build with specific environment
ng build --configuration=production --environment=prod
```

---