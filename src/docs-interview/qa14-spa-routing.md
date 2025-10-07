# Angular Interview Questions 14–17: SPA, Routing, and Lazy Loading

## Question 14: What is SPA in Angular?
A **Single Page Application (SPA)** is a web application that loads a single HTML page and dynamically updates the content as the user interacts with the app, without requiring a full page reload. Angular is designed to build SPAs efficiently, providing seamless navigation and a responsive user experience.

**Key features of SPAs:**
- Only the necessary content is updated, not the whole page.
- Navigation between views is handled on the client side.
- Faster user experience and reduced server load.

---

## Question 15: How to implement SPA in Angular?
To implement an SPA in Angular:
1. **Use Angular Router:** The Angular Router enables navigation between different views or components without reloading the page.
2. **Define routes:** Set up routes in a routing module (e.g., `app-routing-module.ts` in `txnm-module`).
3. **Configure `<router-outlet>`:** Place `<router-outlet></router-outlet>` in your main template (e.g., `app.html`) where routed components will be displayed.

**Example from `txnm-module`:**
- Routes are defined in `src/app/app-routing-module.ts`.
- `<router-outlet>` is used in `src/app/app.html`.

---

## Question 16: How to implement routing in Angular?
**Routing** in Angular allows navigation between different components/views based on the URL.

**Steps to implement routing:**
1. **Create a routing module:**
   - Use Angular CLI: `ng generate module app-routing --flat --module=app`
2. **Define routes:**
   - In the routing module, define an array of route objects mapping paths to components.
   - Example:
     ```typescript
     const routes: Routes = [
       { path: 'home', component: HomeComponent },
       { path: 'about', component: AboutComponent },
       { path: '', redirectTo: '/home', pathMatch: 'full' }
     ];
     ```
3. **Import RouterModule:**
   - Import `RouterModule.forRoot(routes)` in your routing module and export it.
4. **Add `<router-outlet>`:**
   - Place `<router-outlet></router-outlet>` in your main template.
5. **Use routerLink:**
   - Use `[routerLink]` directive in templates for navigation links.

**Reference in `txnm-module`:**
- See `src/app/app-routing-module.ts` and `src/app/app.html`.

---

## Question 17: What is lazy loading and how to implement it?
**Lazy loading** is a technique in Angular where feature modules are loaded on demand, rather than at the initial application load. This improves performance by reducing the size of the initial bundle and only loading code when needed.

**How to implement lazy loading:**
1. **Create a feature module:**
   - Example: `TxnmFeatureModule` in `src/app/txnm-feature/txnm-feature-module.ts`.
2. **Set up routing for the feature module:**
   - Define child routes in the feature module’s routing file (e.g., `txnm-feature-routing-module.ts`).
3. **Configure lazy loading in the main routing module:**
   - Use the `loadChildren` property in the route definition:
     ```typescript
     {
       path: 'feature',
       loadChildren: () => import('./txnm-feature/txnm-feature-module').then(m => m.TxnMFeatureModule)
     }
     ```
e.g. in app-routing-module.ts:
const routes: Routes = [
  // { path: '', component: App },
  { path: 'home', component: DefAppHome },
  { path: 'txnm', loadChildren: () => import('./txnm-feature/txnm-feature-module').then(m => m.TxnmFeatureModule) },
  { path: '**', redirectTo: '' }
];

4. **Navigate to the feature route:**
   - When the user navigates to `/feature`, Angular loads the module and its components on demand.

**Reference in `txnm-module`:**
- Feature module: `src/app/txnm-feature/txnm-feature-module.ts`
- Feature routing: `src/app/txnm-feature/txnm-feature-routing-module.ts`
- Main routing: `src/app/app-routing-module.ts`

---

**References:**
- [Angular Routing & Navigation](https://angular.io/guide/router)
- [Angular Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules) 