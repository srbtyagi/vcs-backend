import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AdminService } from 'src/app/admin.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  title = 'Nursing and IT Staffing';


  constructor(public http: AdminService, private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Registered Nurse, RN, LPN, Nurse, Lab Technologist, LMSW' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'We provide healthcare staff like Registered Nurse, LPN, Lab Technologist, LMSW, IT Engineer, Software dev' }
    );
  }

}
