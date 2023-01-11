import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { RecruiteeService } from 'src/app/recruitee.service';
import Swal from 'sweetalert2';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-skill-checklist',
  templateUrl: './skill-checklist.component.html',
  styleUrls: ['./skill-checklist.component.css']
})
export class SkillChecklistComponent implements OnInit {

  title = 'Healthcare Skills Checklist';

  constructor(public router: Router, public service: RecruiteeService, private titleService: Title,
    private metaTagService: Meta) { }

  jobCategory: any = [];

  ngOnInit() {
    this.getAllCategory();
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'keywords', content: 'ICU, Med/Surg, Telemetry, Emergency, Operation, Psych, Correction, LMSW' },
    );
    this.metaTagService.updateTag(
      { name: 'description', content: 'ICU, Med/Surg, Telemetry, Emergency, Operation, Psych, Correction, LMSW' }
    );
  }

  getAllCategory() {
    this.service.geAllJobCategory_Area().subscribe((res) => {
      //console.log(res);
      let result: any = res;
      if (result.length > 0) {
        this.jobCategory = result;
      }
      else {
        this.error("No Data.");
      }
    }, err => {
      this.error("Something went wrong. Please Try Again.");

    });
  }
  error(msg) {
    Swal.fire({
      title: msg,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#4C96D7',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }

  getJobSector(data) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(data.skill_area_id)
      }
    };
    this.router.navigate(["skill-set"], navigationExtras);
  }
}
