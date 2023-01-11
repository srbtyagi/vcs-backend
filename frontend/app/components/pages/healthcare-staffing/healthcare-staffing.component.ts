import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-healthcare-staffing',
  templateUrl: './healthcare-staffing.component.html',
  styleUrls: ['./healthcare-staffing.component.css']
})
export class HealthcareStaffingComponent implements OnInit {

  title = 'Healthcare Services';


  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Healthcare Jobs, registered Nurse Jobs, RN Jobs, LPN Jobs, Technologist Jobs' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Employment services for Nursing, Allied Health, Pharmacist' }
    );
  }

}
