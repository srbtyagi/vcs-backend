import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-hs-case-study',
  templateUrl: './hs-case-study.component.html',
  styleUrls: ['./hs-case-study.component.css']
})
export class HsCaseStudyComponent implements OnInit {

  title = 'Clinical Studies';


  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Professional Nurses, Patient care, Quality Staffing, Hospitals, Facilities' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Better patient care by VCS nurses' }
    );
  }

}
