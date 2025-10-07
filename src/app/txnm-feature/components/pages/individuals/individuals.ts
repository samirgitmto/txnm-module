import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individuals',
  standalone: false,
  templateUrl: './individuals.html',
  styleUrl: './individuals.css'
})
export class Individuals {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/txnm']);
  }
}
