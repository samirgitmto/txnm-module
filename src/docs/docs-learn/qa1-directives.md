# Angular Interview Questions & Answers

## Question 1: What is the use of Angular?

Angular is a popular open-source front-end web application framework developed and maintained by Google. It is used for building dynamic, single-page web applications (SPAs) with rich user interfaces and efficient data binding. Angular provides a robust structure for organizing code, managing dependencies, and handling complex application logic. In the `txnm-module` project, Angular is used to modularize the application into components, services, and modules, making the codebase maintainable and scalable.

**Key uses of Angular:**
- Building SPAs with seamless navigation and fast performance
- Organizing code using components and modules
- Implementing two-way data binding for real-time UI updates
- Managing application state and routing
- Facilitating unit testing and code reusability

* Connects your **HTML (View)** and **JavaScript/TypeScript code (Model)**.
* Automates **data binding**, **event handling**, **dependency injection**, **form handling**, and more.
* Uses **TypeScript**, a superset of JavaScript, which brings strong typing and better tooling.

---

## 🔷 Key Concepts from the Image (MVVM Pattern)

The image shows a simplified version of Angular’s architecture based on the **MVVM (Model-View-ViewModel)** design pattern:

```
          +-----------+         +------------+         +----------+
          |   HTML    | <--->   |   ViewModel| <--->   |  Object  |
          |   (View)  |         |   (VM)     |         | (Model)  |
          +-----------+         +------------+         +----------+
```

* **View (V)**: The **HTML template** that defines how your app appears (the UI).
* **Model (M)**: The **data** or business logic of the application (typically TypeScript objects).
* **ViewModel (VM)**: The intermediary handled by **Angular**—this:

  * Synchronizes data between the model and view.
  * Updates the DOM when data changes.
  * Responds to user input by updating the model.

---

## Question 2: What are directives in Angular?

Directives are special instructions in Angular that allow you to **manipulate the DOM, add behavior to elements, or create reusable components**. They are one of the core building blocks of Angular applications. Directives are declared using the `@Directive` decorator and can be applied to elements in templates to change their appearance or behavior.

In the `txnm-module` project, you can see directives in action within component templates (e.g., using `*ngIf`, `*ngFor`, or custom attribute directives).

**Types of directives:**
- **Structural Directives:** Change the structure of the DOM (e.g., `*ngIf`, `*ngFor`).
- **Component Directives:** The most common type, used to create UI components (e.g., `@Component`).
- **Attribute Directives:** Change the appearance or behavior of an element (e.g., `ngClass`, `ngStyle`) and not the structure of DOM.
**S A C**

---

## Question 3: Explain the different types of Angular directives?

Angular provides three main types of directives:

1. **Component Directives:**
   - These are directives with a template. Every Angular component is essentially a directive with its own view.
   - Example from `txnm-module`: The `def-app-home` component in `src/app/def-app-home/def-app-home.ts` is a component directive.

2. **Structural Directives:**
   - These directives change the structure of the DOM by adding or removing elements.
   - Common examples: `*ngIf` (conditionally includes a template), `*ngFor` (repeats a template for each item in a list).
   - Usage in `txnm-module`: In component HTML files like `def-app-home.html`, you may find `*ngIf` or `*ngFor` used to control rendering.

3. **Attribute Directives:**
   - These directives change the appearance or behavior of an element, component, or another directive.
   - Common examples: `ngClass`, `ngStyle`.
   - Usage in `txnm-module`: In templates, you might see `[ngClass]` or `[ngStyle]` to dynamically set classes or styles.

**Summary Table:**
| Directive Type         | Purpose                                 | Example           |
|-----------------------|-----------------------------------------|-------------------|
| Component             | UI building block                       | `@Component`      |
| Structural            | Change DOM structure                    | `*ngIf`, `*ngFor` |
| Attribute             | Change element appearance/behavior      | `ngClass`         |

---

*References:*
- `txnm-module/src/app/def-app-home/def-app-home.ts`
- `txnm-module/src/app/def-app-home/def-app-home.html`
- Angular documentation: https://angular.io/guide/directives 