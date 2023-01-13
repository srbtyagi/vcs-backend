import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { RecruiteeService } from 'src/app/recruitee.service';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Vish Consulting Services';

  search1: any = "";
  search2: any = "";
  search3: any = "";
  allJobs = [];

  constructor(public http: AdminService, public service: RecruiteeService, public router: Router, private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit() {
    this.getAllJobs();
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'happy Registered Nurses' }
    );

  }

  getAllJobs() {
    this.allJobs = [];
    let obj = {
      s1: this.search1,
      s2: this.search2,
      s3: this.search3,


    }
    this.service.getAllJob(obj).subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        for (let i = 0; i < 5; i++) {
          if (result[i].job_status === "open") {
            result[i]["regular_pay"] = Math.trunc(result[i].regular_pay_rate);
            result[i]["blended_pay"] = Math.trunc(result[i].blended_pay_rate);
            this.allJobs.push(result[i]);
          }
        }
      }
    });
  }

  goTo(data) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: btoa(unescape(encodeURIComponent(JSON.stringify(data)))),
        skipLocationChange: false,
        fragment: 'top'
      }
    };
    this.router.navigate(["/job-details"], navigationExtras);


  }

}
