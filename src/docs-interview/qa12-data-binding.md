# Angular Interview Question 12: Explain the Four Types of Data Bindings in Angular

Angular provides four main types of data binding, which define how data flows between the component (TypeScript class) and the template (HTML view).

## 1. Interpolation
- **Syntax:** `{{ expression }}`
- **Direction:** Component → Template
- **Purpose:** Display data from the component in the template.
- **Example:**
  ```html
  <h1>{{ title }}</h1>
  ```
  Here, the value of the `title` property in the component is displayed in the template.

## 2. Property Binding
- **Syntax:** `[property]="expression"`
- **Direction:** Component → Template
- **Purpose:** Bind a property of an HTML element or Angular component to a value in the component.
- **Example:**
  ```html
  <img [src]="imageUrl">
  ```
  The `src` attribute of the `<img>` tag is set to the value of `imageUrl` from the component.

## 3. Event Binding
- **Syntax:** `(event)="handler"`
- **Direction:** Template → Component
- **Purpose:** Listen for events in the template and call methods in the component.
- **Example:**
  ```html
  <button (click)="onClick()">Click Me</button>
  ```
  When the button is clicked, the `onClick()` method in the component is executed.

## 4. Two-way Binding
- **Syntax:** `[(ngModel)]="property"`
- **Direction:** Component ↔ Template (both ways)
- **Purpose:** Synchronize data between the component and the template.
- **Example:**
  ```html
  <input [(ngModel)]="username">
  ```
  Changes in the input field update the `username` property in the component, and vice versa.

---

## Summary Table
| Binding Type      | Syntax                | Direction              | Example Syntax           |
|------------------|-----------------------|------------------------|-------------------------|
| Interpolation    | `{{ value }}`         | Component → Template   | `<h1>{{ title }}</h1>`  |
| Property Binding | `[property]="value"` | Component → Template   | `<img [src]="url">`    |
| Event Binding    | `(event)="handler"`  | Template → Component   | `<button (click)=...>`  |
| Two-way Binding  | `[(ngModel)]="val"`  | Component ↔ Template   | `<input [(ngModel)]>`   |

---

**References:**
- See component and template files in `txnm-module/src/app/` for real examples of these bindings in use.
- [Angular Data Binding Guide](https://angular.io/guide/binding)
