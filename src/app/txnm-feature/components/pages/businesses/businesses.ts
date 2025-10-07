import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-businesses',
  standalone: false,
  templateUrl: './businesses.html',
  styleUrl: './businesses.css'
})
export class Businesses {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/txnm']);
  }
}
