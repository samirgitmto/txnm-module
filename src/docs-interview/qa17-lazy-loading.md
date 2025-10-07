### **Interview Answer**  
**Q**: *"Why avoid `href` for internal routes in Angular?"*  
**A**:  
- `href` triggers a **full page reload**, breaking Angular’s SPA behavior.  
- `routerLink` uses client-side routing, preserving app state and improving performance.  
- Exception: Use `href` for external links, downloads, or anchor navigation.  

**Example**:  
```html
<!-- Good for external links -->
<a href="https://angular.io" target="_blank">Angular Docs</a>

<!-- Good for internal routes -->
<a routerLink="/home">Home</a>
```


### **Interview Perspective**
**Interviewer**: *"Why would you choose `routerLink` over a button for navigation?"*  
**You**:  
- **SPA Performance**: `routerLink` avoids full page reloads.  
- **UX Consistency**: Users expect links to update the URL.  
- **Accessibility**: Links are announced correctly by screen readers.  
- **SEO**: Crawlers index routes with `routerLink`.  

**Interviewer**: *"When would you use a button instead?"*  
**You**:  
- For **actions** (e.g., submitting data, triggering modals).  
- When **no route change** is needed (e.g., "Save Draft" button).  

---

### **Final Tip**  
- **For Actions**: `<button (click)="doSomething()">` + RxJS for side effects.  
- **For Navigation**: `<a routerLink="/path">` + lazy-loaded routes.  