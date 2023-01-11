import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-it-service',
  templateUrl: './it-service.component.html',
  styleUrls: ['./it-service.component.css']
})
export class ITServiceComponent implements OnInit {

  title = 'Our IT Services';


  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Developer, Software, Analyst, Architect, Database jobs' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Our IT employment services' }
    );
  }

}
