import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  title = 'noctuwell-frontend-main';

  constructor(public router: Router) {}

  isLandingPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/' || currentUrl === '';
  }
}
