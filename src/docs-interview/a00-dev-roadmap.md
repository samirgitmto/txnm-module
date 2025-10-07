# TXNM Module Development Roadmap
## React to Angular Migration Plan

**Project**: Replicating `txnm-mvp-web` (React) functionality in `txnm-module` (Angular)  
**Date**: January 2025  
**Status**: Planning Phase  

---

## Project Overview

This document outlines the comprehensive plan to replicate the React-based `txnm-mvp-web` application within the existing Angular `txnm-module`. The migration will maintain all existing functionality while leveraging Angular's architecture and best practices.

### Current State Analysis

**Source Application (txnm-mvp-web)**:
- **Framework**: React 18.2.0 with TypeScript
- **UI Library**: Material-UI (MUI) v5.15.10
- **Charts**: Chart.js v4.4.1 with react-chartjs-2
- **Routing**: React Router DOM v6.21.0
- **HTTP Client**: Axios v1.6.7
- **Authentication**: Google OAuth + Guest login
- **State Management**: React Context API

**Target Application (txnm-module)**:
- **Framework**: Angular 20.0.0
- **Current State**: Basic Angular module with minimal functionality
- **Existing Features**: Basic routing, simple components
- **Target**: Full feature parity with React application

---

## Migration Strategy

### Phase 1: Foundation & Dependencies (Week 1)

#### 1.1 Dependency Management
- [ ] **Add Angular Material**
  ```bash
  ng add @angular/material
  ```
- [ ] **Add Chart.js Integration**
  ```bash
  npm install chart.js ng2-charts
  ```
- [ ] **Configure HTTP Client**
  - Setup interceptors for authentication
  - Configure base API service
- [ ] **Add Form Validation**
  - Reactive forms for transaction input
  - Custom validators for bank key formats

#### 1.2 Project Structure Setup
```
txnm-module/src/app/txnm-feature/
├── components/
│   ├── auth/
│   │   ├── google-login/
│   │   ├── login-modal/
│   │   └── protected-route/
│   ├── analytics/
│   │   ├── daily-analytics/
│   │   ├── weekly-analytics/
│   │   ├── five-day-analytics/
│   │   └── shared/
│   ├── pages/
│   │   ├── individuals/
│   │   ├── businesses/
│   │   ├── register/
│   │   └── about-us/
│   └── shared/
│       ├── header/
│       ├── transaction-list/
│       └── home-page/
├── services/
│   ├── auth.service.ts
│   ├── session.service.ts
│   ├── transaction.service.ts
│   ├── statement.service.ts
│   └── base-api.service.ts
├── models/
│   ├── user.model.ts
│   ├── transaction.model.ts
│   └── statement.model.ts
├── guards/
│   └── auth.guard.ts
└── interceptors/
    └── auth.interceptor.ts
```

### Phase 2: Services Layer Implementation (Week 2)

#### 2.1 Core Services Development
- [ ] **AuthService** (Replaces AuthContext)
  - Google OAuth integration
  - Guest login functionality
  - User session management
  - Logout functionality
  - Authentication state management

- [ ] **SessionService** (Replaces SessionContext)
  - Session creation and validation
  - Session refresh mechanism
  - Session storage management
  - Guest session handling

- [ ] **TransactionService** (Replaces transactionService)
  - PDF upload and parsing
  - Bank configuration management
  - Transaction data processing
  - API integration for backend

- [ ] **BaseApiService** (Replaces baseService)
  - HTTP client configuration
  - Request/response interceptors
  - Error handling
  - Authentication token management

#### 2.2 Service Integration
- [ ] **Dependency Injection Setup**
  - Configure service providers
  - Setup service singletons
  - Implement service interfaces

- [ ] **HTTP Interceptors**
  - Authentication token injection
  - Error handling and retry logic
  - Request/response logging

### Phase 3: Component Architecture (Week 3-4)

#### 3.1 Authentication Components
- [ ] **GoogleLoginComponent**
  - Google OAuth button
  - Authentication flow handling
  - User profile display

- [ ] **LoginModalComponent**
  - Modal dialog for authentication
  - Guest login option
  - Error message display

- [ ] **AuthGuard**
  - Route protection
  - Authentication state checking
  - Redirect logic

#### 3.2 Core UI Components
- [ ] **HeaderComponent**
  - Navigation menu
  - Active route highlighting
  - User authentication status
  - Responsive design

- [ ] **HomePageComponent**
  - Bank selection dropdown
  - Statement key input with validation
  - PDF file upload
  - Transaction processing form

- [ ] **TransactionListComponent**
  - Transaction data display
  - Period-based grouping
  - Expandable transaction details
  - Analytics navigation

#### 3.3 Page Components
- [ ] **IndividualsComponent**
  - Individual user information
  - Personal banking features

- [ ] **BusinessesComponent**
  - Business user information
  - Corporate banking features

- [ ] **RegisterComponent**
  - User registration form
  - Account type selection

- [ ] **AboutUsComponent**
  - Company information
  - Contact details

### Phase 4: Analytics Implementation (Week 5)

#### 4.1 Chart Components
- [ ] **DailyAnalyticsComponent**
  - Daily transaction charts
  - Income vs expense visualization
  - Trend analysis

- [ ] **WeeklyAnalyticsComponent**
  - Weekly summary charts
  - Period comparison
  - Spending patterns

- [ ] **FiveDayAnalyticsComponent**
  - Five-day rolling analysis
  - Short-term trends
  - Quick insights

#### 4.2 Shared Analytics Components
- [ ] **AnalyticsChartsComponent**
  - Reusable chart configurations
  - Chart type switching
  - Data formatting utilities

- [ ] **SummaryCardsComponent**
  - Key metrics display
  - Summary statistics
  - Quick overview cards

### Phase 5: Routing & Navigation (Week 6)

#### 5.1 Route Configuration
- [ ] **Main Routes Setup**
  ```typescript
  const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'individuals', component: IndividualsComponent },
    { path: 'businesses', component: BusinessesComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'transactions', component: TransactionListComponent },
    { path: 'analytics/daily', component: DailyAnalyticsComponent },
    { path: 'analytics/weekly', component: WeeklyAnalyticsComponent },
    { path: 'analytics/five-day', component: FiveDayAnalyticsComponent }
  ];
  ```

- [ ] **Lazy Loading Implementation**
  - Feature module lazy loading
  - Route-based code splitting
  - Performance optimization

#### 5.2 Navigation Features
- [ ] **Route Guards**
  - Authentication guards
  - Role-based access control
  - Redirect handling

- [ ] **Navigation Service**
  - Programmatic navigation
  - Route state management
  - Breadcrumb generation

### Phase 6: Styling & UI/UX (Week 7)

#### 6.1 Material Design Integration
- [ ] **Theme Configuration**
  - Custom color palette
  - Typography settings
  - Component theming

- [ ] **Component Styling**
  - Convert React CSS to Angular styles
  - Material Design components
  - Responsive design implementation

#### 6.2 UI Components
- [ ] **Form Components**
  - Reactive forms with validation
  - Custom form controls
  - Error message handling

- [ ] **Data Display Components**
  - Data tables with sorting/filtering
  - Pagination components
  - Loading states and spinners

### Phase 7: Integration & Testing (Week 8)

#### 7.1 API Integration
- [ ] **Backend Connectivity**
  - API endpoint integration
  - Data model mapping
  - Error handling

- [ ] **File Upload Implementation**
  - PDF upload functionality
  - Progress indicators
  - File validation

#### 7.2 Testing & Quality Assurance
- [ ] **Unit Testing**
  - Component testing
  - Service testing
  - Utility function testing

- [ ] **Integration Testing**
  - End-to-end workflows
  - API integration testing
  - Cross-browser compatibility

### Phase 8: Deployment & Optimization (Week 9)

#### 8.1 Performance Optimization
- [ ] **Bundle Optimization**
  - Tree shaking implementation
  - Lazy loading optimization
  - Bundle size analysis

- [ ] **Runtime Performance**
  - Change detection optimization
  - Memory leak prevention
  - Performance monitoring

#### 8.2 Production Readiness
- [ ] **Build Configuration**
  - Production build setup
  - Environment configuration
  - Asset optimization

- [ ] **Documentation**
  - Component documentation
  - API documentation
  - Deployment guide

---

## Technical Specifications

### Dependencies to Add

```json
{
  "dependencies": {
    "@angular/material": "^20.0.0",
    "@angular/cdk": "^20.0.0",
    "chart.js": "^4.4.1",
    "ng2-charts": "^5.0.4",
    "rxjs": "~7.8.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^20.0.0",
    "karma": "~6.4.0"
  }
}
```

### Key Angular Concepts to Implement

1. **Dependency Injection**
   - Service-based architecture
   - Singleton pattern implementation
   - Interface-based design

2. **Reactive Programming**
   - RxJS Observables for data flow
   - Async pipe for template binding
   - Subject-based state management

3. **Component Lifecycle**
   - OnInit, OnDestroy hooks
   - Change detection strategies
   - Memory management

4. **Forms**
   - Reactive forms for complex validation
   - Custom validators
   - Form state management

5. **Routing**
   - Lazy loading modules
   - Route guards and resolvers
   - Navigation service

---

## Success Criteria

### Functional Requirements
- [ ] Complete feature parity with React application
- [ ] All authentication flows working
- [ ] Transaction processing functionality
- [ ] Analytics and charting capabilities
- [ ] Responsive design across devices

### Technical Requirements
- [ ] Angular best practices implementation
- [ ] TypeScript strict mode compliance
- [ ] Unit test coverage > 80%
- [ ] Performance benchmarks met
- [ ] Accessibility standards compliance

### Quality Metrics
- [ ] Code maintainability score
- [ ] Bundle size optimization
- [ ] Load time performance
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

---

## Risk Mitigation

### Technical Risks
- **Chart.js Integration**: Use ng2-charts for seamless Angular integration
- **Material Design Migration**: Leverage Angular Material for consistent UI
- **State Management**: Implement RxJS-based reactive state management
- **Performance**: Use OnPush change detection strategy

### Timeline Risks
- **Scope Creep**: Maintain strict feature parity focus
- **Dependency Issues**: Use stable, well-maintained packages
- **Integration Complexity**: Implement incremental testing

---

## Resources & References

### Documentation
- [Angular Architecture Guide](https://angular.io/guide/architecture)
- [Angular Material Documentation](https://material.angular.io/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

### Project Files
- Source React App: `txnm-mvp-web/`
- Target Angular Module: `txnm-module/src/app/txnm-feature/`
- Documentation: `txnm-module/src/docs-interview/`

---

**Last Updated**: January 2025  
**Next Review**: Weekly during implementation  
**Status**: Ready for Phase 1 Implementation
