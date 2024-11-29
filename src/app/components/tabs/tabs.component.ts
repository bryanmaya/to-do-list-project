import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
