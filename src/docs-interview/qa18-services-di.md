# Angular Interview Question 18: Services and Dependency Injection

## What are Services in Angular?
A **service** in Angular is a reusable class that provides specific functionality, such as data access, business logic, or utility functions. Services help keep components lean by moving shared logic out of components and into injectable classes.

**Common uses for services:**
- Fetching data from APIs
- Managing application state
- Logging and error handling
- Utility/helper functions

**Example from `txnm-module`:**
- `src/app/txnm-feature/services/txnm-api.ts` provides API-related logic for the feature module.

---

## What is Dependency Injection (DI)?
**Dependency Injection** is a design pattern in which a class receives its dependencies from an external source rather than creating them itself. Angular has a built-in DI framework that makes it easy to provide and inject services where needed.

**How DI works in Angular:**
- Services are registered with Angular’s injector (usually via the `@Injectable()` decorator and provided in a module or `providedIn: 'root'`).
- Components or other services declare their dependencies in the constructor.
- Angular automatically creates and injects the required service instances.

**Example:**
```typescript
// src/app/txnm-feature/components/txnm-home/txnm-home.ts
import { Component } from '@angular/core';
import { TxnmApi } from '../../services/txnm-api';

@Component({
  selector: 'txnm-home',
  templateUrl: './txnm-home.html',
  styleUrls: ['./txnm-home.css']
})
export class TxnmHome {
  constructor(private txnmApi: TxnmApi) {}
  // Now you can use txnmApi methods in this component
}
```

---

## Benefits of Using Services and DI
- **Separation of concerns:** Keeps components focused on the view, while services handle logic and data.
- **Reusability:** Services can be shared across multiple components.
- **Testability:** Services can be easily mocked or replaced in tests.
- **Maintainability:** Centralizes logic, making it easier to update and manage.

---

**References:**
- `txnm-module/src/app/txnm-feature/services/txnm-api.ts`
- [Angular Dependency Injection Guide](https://angular.io/guide/dependency-injection) 