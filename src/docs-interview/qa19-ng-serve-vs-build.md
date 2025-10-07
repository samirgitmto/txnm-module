# Angular Interview Question 19: ng serve vs ng build

## `ng serve`
- **Purpose:** Starts a development server, watches for file changes, and automatically reloads the app in the browser.
- **Usage:** Used during development for rapid feedback and testing.
- **Output:** Does **not** create output files on disk by default; serves the app from memory.
- **Features:**
  - Live-reloading: Automatically reloads the app when you save changes.
  - Fast incremental builds for development.
  - Accessible at `http://localhost:4200` by default.
- **Example:**
  ```sh
  ng serve
  ```

## `ng build`
- **Purpose:** Compiles the application into static files for deployment.
- **Usage:** Used to generate optimized files for production or testing deployment.
- **Output:** Creates output files (HTML, JS, CSS, assets) in the `dist/` directory.
- **Features:**
  - Can build for different environments (development, production, etc.).
  - Minifies and optimizes code for production with `--prod` flag.
  - No live-reloading; just builds the files.
- **Example:**
  ```sh
  ng build --configuration production
  ```

## Summary Table
| Command     | Purpose                | Output Location | Live Reload | Typical Use         |
|-------------|------------------------|-----------------|-------------|---------------------|
| `ng serve`  | Dev server, live reload| Memory          | Yes         | Development         |
| `ng build`  | Build static files     | `dist/` folder  | No          | Deployment/Testing  |

## Reference in `txnm-module`
- Use `ng serve` for local development and testing changes in real time.
- Use `ng build` to generate deployable files in the `dist/txnm-module/` directory.

---

**References:**
- [Angular CLI ng serve](https://angular.io/cli/serve)
- [Angular CLI ng build](https://angular.io/cli/build) 

# Angular Interview Question 20: ng build --prod?

## `ng build --prod` (or `ng build --configuration production`)
- **Purpose:** Builds the Angular application for production deployment, applying advanced optimizations.
- **What it does:**
  - Enables production mode optimizations.
  - Minifies and uglifies JavaScript and CSS files (reduces file size).
  - Removes Angular development-specific code (like debugging tools and error messages).
  - Performs Ahead-of-Time (AOT) compilation for faster startup and better security.
  - Enables tree-shaking to remove unused code.
  - Adds cache-busting hashes to filenames for better browser caching.
- **Output:** Optimized static files in the `dist/` directory, ready for deployment to a web server.
- **Usage Example:**
  ```sh
  ng build --prod
  # or (recommended in newer Angular versions)
  ng build --configuration production
  ```

## Key Differences from Regular Build
- Regular `ng build` (without `--prod`) creates a development build, which is not fully optimized and may include debugging information.
- `ng build --prod` creates a highly optimized, minified, and production-ready build.

## Reference in `txnm-module`
- Use `ng build --prod` or `ng build --configuration production` before deploying your app to production for best performance and security.

---

**References:**
- [Angular CLI ng build --prod](https://angular.io/cli/build)
- [Angular Deployment Guide](https://angular.io/guide/deployment) 