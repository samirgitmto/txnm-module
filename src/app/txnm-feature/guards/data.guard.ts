import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DataGuardService } from '../services/data-guard.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DataGuard implements CanActivate {
  
  constructor(
    private dataGuardService: DataGuardService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    
    console.log('DataGuard: Checking access to', state.url);
    
    return this.dataGuardService.canAccessAnalytics().pipe(
      map(hasAccess => {
        if (hasAccess) {
          console.log('DataGuard: Access granted to', state.url);
          return true;
        } else {
          console.log('DataGuard: Access denied to', state.url, '- redirecting to home');
          
          // Show message to user
          this.snackBar.open(
            'Please upload a bank statement first to access analytics', 
            'Close', 
            { 
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
          
          // Redirect to home page
          this.router.navigate(['/txnm']);
          return false;
        }
      }),
      catchError(error => {
        console.error('DataGuard: Error checking access:', error);
        
        // On error, deny access and redirect
        this.snackBar.open(
          'Unable to verify transaction data. Please try again.', 
          'Close', 
          { 
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
        
        this.router.navigate(['/txnm']);
        return of(false);
      })
    );
  }
}
