# Angular Interview Questions & Answers (Questions 9, 10, 11)

## Question 9: What is a decorator in Angular?

A **decorator** in Angular is a special kind of declaration that can be attached to a class, method, property, or parameter. Decorators provide metadata that Angular uses to understand how to process and instantiate those elements. Decorators are a core feature of TypeScript and Angular, enabling features like components, services, and dependency injection.

**Common Angular decorators:**
- `@Component` — Declares a class as an Angular component.
- `@NgModule` — Declares a class as an Angular module.
- `@Injectable` — Marks a class as available for dependency injection.
- `@Input` and `@Output` — Define input and output properties for components.

**Example from `txnm-module`:**
```typescript
// src/app/def-app-home/def-app-home.ts
import { Component } from '@angular/core';

@Component({
  selector: 'def-app-home',
  templateUrl: './def-app-home.html',
  styleUrls: ['./def-app-home.css']
})
export class DefAppHome { }
```
Here, `@Component` is a decorator that tells Angular this class is a component and provides its metadata.

---

## Question 10: What are Annotations or MetaData?

**Annotations** and **metadata** in Angular refer to the information attached to classes via decorators. This metadata tells Angular how to process a class. For example, the `@Component` decorator attaches metadata such as the component's selector, template, and styles.

- **Metadata** is the information provided to Angular about how to use a class.
- **Annotations** is a term sometimes used interchangeably with metadata, but in Angular, metadata is the more accurate term.

**Example:**
```typescript
@Component({
  selector: 'def-app-home',
  templateUrl: './def-app-home.html',
  styleUrls: ['./def-app-home.css']
})
```
Here, the object passed to `@Component` is the metadata for the component.

---

## Question 11: What is a template?

A **template** in Angular defines the view (UI) for a component. It is written in HTML and can include Angular-specific syntax such as data binding, directives, and pipes. Templates determine how data from the component class is displayed to the user.

**Types of templates:**
- **Inline template:** Defined directly in the component using the `template` property.
- **External template:** Defined in a separate HTML file and referenced using the `templateUrl` property.

**Example from `txnm-module`:**
- The file `src/app/def-app-home/def-app-home.html` is the template for the `DefAppHome` component.

**Sample usage:**
```typescript
@Component({
  selector: 'def-app-home',
  templateUrl: './def-app-home.html',
  styleUrls: ['./def-app-home.css']
})
```
- Here, `templateUrl` points to the external HTML file that serves as the template.

--- 