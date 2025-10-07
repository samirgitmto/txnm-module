import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/txnm']);
  }
}
