import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  title = 'Contact us for better job';


  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Nursing jobs, RN jobs, LPN jobs, technologist jobs' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Nursing jobs' }
    );
  }

}
