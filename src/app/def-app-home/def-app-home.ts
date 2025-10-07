import { Component } from '@angular/core';

@Component({
  selector: 'app-def-app-home',
  standalone: false,
  templateUrl: './def-app-home.html',
  styleUrl: './def-app-home.css'
})
export class DefAppHome {
  message: string = 'Hello World';
  protected title = 'txnm-module';
}
