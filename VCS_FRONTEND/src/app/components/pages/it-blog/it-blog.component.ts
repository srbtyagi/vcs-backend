import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-it-blog',
  templateUrl: './it-blog.component.html',
  styleUrls: ['./it-blog.component.css']
})
export class ITBlogComponent implements OnInit {

  title = 'IT Blogs';


  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'AI, Big data, LOT, Java, .Net' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'Digital system and cybercrime' }
    );
  }

}
