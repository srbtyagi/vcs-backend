import { Component } from '@angular/core';
import { NavigationStart, Router, NavigationEnd } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { AdminService } from './admin.service';
import { filter } from 'rxjs/operators';
declare const gtag: Function;

@Component({
  selector: '.app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showHead: boolean = false;

  constructor(public router: Router, public metaTagService: Meta, public http: AdminService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        ////console.log(event['url'])
        if (event['url'].split("?")[0] == '/login') {
          this.showHead = false;
        } else {
          // //console.log("true")
          this.showHead = true;
        }
      }
    });

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      /** START : Code to Track Page View  */
      gtag('event', 'page_view', {
        page_path: event.urlAfterRedirects
      })
      /** END */
    })

  }

  ngOnInit() {
    this.metaTagService.addTags([
      { name: 'keywords', content: 'RN Jobs, Nursing Jobs, Healthcare Jobs, Clinical Jobs, IT Jobs' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { charset: 'UTF-8' }
    ]);

  }



}
