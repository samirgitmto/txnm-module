# Angular Interview Questions & Answers (Set 3)

## Question 6: What is TypeScript and why do we need it?

**TypeScript** is a superset of JavaScript developed by Microsoft. It adds static typing, classes, interfaces, and other features to JavaScript, making it more robust and maintainable for large-scale applications.

### Why do we need TypeScript in Angular?
- **Type Safety:** TypeScript allows you to define types for variables, function parameters, and return values. This helps catch errors at compile time rather than at runtime.
- **Better Tooling:** With TypeScript, you get improved code completion, navigation, and refactoring support in modern IDEs.
- **Object-Oriented Features:** TypeScript supports classes, interfaces, inheritance, and access modifiers, making it easier to write structured and maintainable code.
- **Readability and Maintainability:** Type annotations and interfaces make the code more self-documenting and easier to understand.
- **Compatibility:** TypeScript code is transpiled to JavaScript, so it runs in any browser or JavaScript environment.

In the `txnm-module` project, all source files (e.g., `.ts` files in `src/app/`) are written in TypeScript, leveraging its features for a more reliable and scalable Angular application.

---

## Question 7: Explain the importance of Angular CLI

**Angular CLI (Command Line Interface)** is a powerful tool that helps developers create, build, test, and maintain Angular applications efficiently.

### Importance of Angular CLI:
- **Project Scaffolding:** Quickly generates a new Angular project with best practices and recommended structure using `ng new`.
- **Code Generation:** Easily generate components, services, modules, and more with commands like `ng generate component my-component`.
- **Build and Serve:** Simplifies building (`ng build`) and serving (`ng serve`) the application for development and production.
- **Testing:** Provides commands for running unit tests (`ng test`) and end-to-end tests (`ng e2e`).
- **Configuration Management:** Manages environment-specific configurations and build options via `angular.json`.
- **Linting and Formatting:** Helps maintain code quality with linting commands.
- **Upgrades:** Simplifies upgrading Angular and dependencies with `ng update`.

In the `txnm-module` project, the Angular CLI is used to manage the project lifecycle, generate code, and handle builds and tests, ensuring consistency and productivity across the development team.

--- 