# Angular Interview Questions & Answers (Set 2)

## Question 4: Explain the importance of NPM and Node_Modules folder

**NPM (Node Package Manager)** is a tool that comes with Node.js and is used to manage JavaScript packages (libraries, tools, frameworks) required for a project. In Angular projects like `txnm-module`, NPM is essential for:
- **Installing dependencies:** All third-party libraries (like Angular itself, RxJS, etc.) are installed via NPM.
- **Managing versions:** NPM ensures that the correct versions of packages are used, as specified in `package.json`.
- **Running scripts:** Common Angular commands (like `ng serve`, `ng build`) are run via NPM scripts.

**node_modules folder** is where NPM installs all the project dependencies. It contains all the code for the libraries your project depends on, as well as their dependencies. In `txnm-module`, after running `npm install`, the `node_modules` folder is created and filled with all required packages, making the project runnable and buildable.

**Summary:**
- NPM manages and installs packages.
- `node_modules` stores all installed packages locally for the project.
- Both are critical for Angular development and project consistency.

---

## Question 5: Explain the importance of Package.json file in Angular

The `package.json` file is a core part of any Node.js or Angular project. It serves as the manifest for the project and contains:
- **Project metadata:** Name, version, description, author, etc.
- **Dependencies:** Lists all required packages and their versions (under `dependencies` and `devDependencies`). **(all Javascript references)**
- **Scripts:** Defines shortcut commands for building, testing, serving, and more (e.g., `ng serve`, `ng build`).
- **Configuration:** Some tools read configuration directly from `package.json`.

In the `txnm-module` project, `package.json` ensures that anyone cloning the project can run `npm install` to get the exact dependencies needed, and use the defined scripts to work with the project efficiently.

**Summary:**
- `package.json` is the blueprint for project dependencies and scripts.
- Ensures consistency across different environments and developers.
- Essential for project setup, maintenance, and collaboration.


## Special Question: Explain angular.json and the difference between angular.json and package.json?

### What is `angular.json`?

The `angular.json` file is a workspace configuration file specific to Angular projects. It defines **how the Angular CLI should build, serve, test, and manage your application**. This file contains settings for:
- Project structure and source roots
- Build and output paths
- File replacements for different environments
- Assets, styles, and scripts to include
- Configuration for different build targets (development, production, etc.)
- Default schematics and CLI options
**(e.g., which files to include, build options, output paths, etc.).**

In the `txnm-module` project, you can find `angular.json` at the root. It controls how the Angular CLI commands (`ng build`, `ng serve`, etc.) operate for this project.

### What is `package.json`?

The `package.json` file is a standard Node.js file that lists all dependencies, scripts, and metadata for the project. It is not specific to Angular, but is used by all Node.js-based projects, including Angular apps. It tells NPM which packages to install and provides scripts for running, building, and testing the project.

### Key Differences

| Feature                | `angular.json`                                 | `package.jjson`                        |
|------------------------|------------------------------------------------|----------------------------------------|
| Purpose                | Angular CLI project configuration              | Node.js/NPM project manifest           |
| Scope                  | Angular-specific (build, serve, test, assets)  | General (dependencies, scripts, meta)  |
| Who uses it?           | Angular CLI                                    | NPM, Node.js, Angular CLI              |
| Location               | Project root                                   | Project root                           |
| Example in txnm-module | `txnm-module/angular.json`                     | `txnm-module/package.json`             |

**Summary:**
- `angular.json` tells Angular CLI how to build and manage the Angular app.
- `package.json` tells NPM which packages to install and how to run scripts.
- Both are essential, but serve different roles in the project setup and workflow.

**package.json in Angular/Node.js is most similar to pom.xml in Maven.**

---

*References:*
- `txnm-module/package.json`
- `txnm-module/node_modules/` (created after `npm install`)
- NPM documentation: https://docs.npmjs.com/ 