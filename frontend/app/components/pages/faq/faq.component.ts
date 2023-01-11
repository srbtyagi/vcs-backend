import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  title = 'Nursing Resources';


  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Nurse Payroll, Compact RN License, Nurse Education, RN Jobs' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Services to keep happy nursing staff' }
    );
  }

}
