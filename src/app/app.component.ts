import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activePage: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    router.events.subscribe((url: any) => {
      this.activePage = router.url.replace(/\W+/g, '');
    });
  }
}
