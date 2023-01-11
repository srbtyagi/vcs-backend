import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-applicants-details',
  templateUrl: './applicants-details.component.html',
  styleUrls: ['./applicants-details.component.css']
})
export class ApplicantsDetailsComponent implements OnInit {
  user_id: any;
  details: any;
  docs: any;

  constructor(public route: ActivatedRoute, public http: AdminService) {
    this.route.queryParams.subscribe((r: any) => {
      this.user_id = JSON.parse(r.special);
      //console.log(this.user_id)
    });
  }

  ngOnInit() {
    this.http.spinnerShow();
    setTimeout(() => {
      
      this.http.spinnerHide();
    }, 900);

    this.getDetails();
    this.getAllDocs();

  }

  getDetails() {
    this.http.getapplicantsProfileData(this.user_id).subscribe((res: any) => {
      //console.log(res);
      this.details = res[0];
    })
  }

  getAllDocs() {
    this.http.getAllDocs(this.user_id).subscribe((res: any) => {
      //console.log(res);
      this.docs = res;
    })
  }

  downloadDoc(val) {
    this.http.downloadDoc(this.user_id, val.rec_doc_id).subscribe((res: any) => {
      //console.log(res);
      const blob = new Blob([res], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      //this.docs = res;
    })
  }

  back() {
    window.history.back();
  }

}
