import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  
  title = 'Serving Healthcare and IT Clients';


  constructor( private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'Hospital, Banking, Healthcare, Software, IT' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'We serve Healthcare, finance, banking, infrastructure IT domains' }
    );
   
  }

  
 

}
