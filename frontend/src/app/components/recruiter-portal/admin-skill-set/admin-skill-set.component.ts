import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from "jquery";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { IDayCalendarConfig } from 'ng2-date-picker';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-admin-skill-set',
  templateUrl: './admin-skill-set.component.html',
  styleUrls: ['./admin-skill-set.component.css']
})
export class AdminSkillSetComponent implements OnInit {
  /*paginate */
  public count: any = 20;
  public page: any;
  /**paginate  */
  moduleArray: any;
  candiSkillSetList: any = [];
  details: any;
  category_name: any;
  area_name: any;
  jobDomain: any = [];
  filterArray: any = [];
  search_data: any;
  user_id: any;
  excelfileName: any;
  showDivPdf: boolean = false;

  datePickerConfig = <IDayCalendarConfig>{
    drops: 'down',
    format: 'MM/DD/YYYY'
  }
  user_type:any;

  constructor(public http: AdminService, public route: ActivatedRoute, public router: Router, public fb: FormBuilder,) {
    this.user_id = sessionStorage.getItem("user_id");
    this.excelfileName = "skill_set_report(" + moment(new Date).format("MM-DD-YYYY") + ")";
    this.user_type = sessionStorage.getItem("user_type");
  }

  ngOnInit() {
    this.route.queryParams.subscribe((r: any) => {
      var data = JSON.parse(r.special);
      this.getAssignaccess(data);
    });
    // //console.log(this.data)
    /** spinner starts on init */
    this.http.spinnerShow();
    setTimeout(() => {

      this.http.spinnerHide();
    }, 800);
    this.getskillsetCandidate();
  }

  /////////////////////////////
  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }
  ///////////////////

  getAssignaccess(val) {
    if (sessionStorage.getItem("user_id")) {
      this.moduleArray = [];
      const arr = JSON.parse(sessionStorage.getItem("moduleArray"));
      const ids = arr.map(o => o.submodule_id);
      const arry = arr.filter(({ submodule_id }, index) => !ids.includes(submodule_id, index + 1));
      arry.forEach((e, index) => {
        if (e.module_id === val) {
          this.moduleArray.push(e);
          switch (e.submodule_name) {
            case "APPLICANT": {
              e.submodule_name_lower = "Applicants";
              e.routing = "/applicants";
              break;
            }
            case "JOB APPLICATION": {
              e.submodule_name_lower = "Job Application";
              e.routing = "/job-applications_admin";
              break;
            }
            case "ONBOARDING & HIRING": {
              e.submodule_name_lower = "On Boarding";
              e.routing = "/onboarding-hiring";
              break;
            }
            case "HIRED": {
              e.submodule_name_lower = "Hired";
              e.routing = "/hired-applicant";
              break;
            }
            case "ASSIGN MANAGERS": {
              e.submodule_name_lower = "Assign Manager";
              e.routing = "/assign-Manager";
              break;
            }
            case "SKILLSET": {
              e.submodule_name_lower = "Skill Set";
              e.routing = "/skill-set-admin";
              break;
            }
            default: {
              //statements; 
              break;
            }
          }

        }

      });
    }
    //console.log(this.moduleArray)
    setTimeout(() => {
      document.getElementById("clsActive206").className = "active";
    }, 200)
  }

  navigateTo(val) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(val.module_id)
      }
    };
    this.router.navigate([val.routing], navigationExtras);
  }

  ////////////////////

  getskillsetCandidate() {
    this.http.getcandiSkillSet().subscribe((res: any) => {
      //  console.log(res)

      if (res.length !== 0) {
        this.candiSkillSetList = res; 
        this.filterArray = res;
      } else {
        this.errorMsg("No search result found.");
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  get searchData() {
    return this.search_data;
  }

  set searchData(value) {
    this.search_data = value;
    this.candiSkillSetList = this.search_data ? this.filterList(this.search_data) : this.filterArray;
  }

  filterList(filterby) {
    filterby = filterby.toLocaleLowerCase();
    return this.filterArray.filter((list: any) =>
      list.candidate_email.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.candidate_name.toLocaleLowerCase().indexOf(filterby) !== -1 ||
      list.skill_area_name.toLocaleLowerCase().indexOf(filterby) !== -1
    );

  }

  viewSkillModal(val) {
    // //console.log(val)
    this.details = val;
    let data = {
      candidate_id: val.candidate_id,
      skill_area_id: val.skill_area_id
    }
    this.http.getSkillsetByCandi(data).subscribe((res: any) => {
      // //console.log(res)
      let result: any = res;
      if (result.length > 0) {
        this.category_name = result[0].skill_category_name;
        this.area_name = result[0]["area"][0].skill_area_name;
        //console.log(this.area_name)
        this.jobDomain = result[0]["area"][0]["domain"];
        //console.log(this.jobDomain)
      }
      else {
        this.errorMsg("Skill checklist not added yet.")
      }
    }, err => {
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  delete_date: any;
  deleteSkillset() {
    this.http.spinnerShow();
    let data = {
      skillset_delete_date: moment(this.delete_date).format("MM/DD/YYYY")
    }
    this.http.deleteMultipleSkillset(data).subscribe((res: any) => {
      //console.log(res)
      this.http.spinnerHide();
      if (res === "success") {
        this.getskillsetCandidate();
        this.successMsg("Skillsets deleted successfully.");

      }
      else if (res === "no skillset found") {
        this.errorMsg("No skillset found.");
      }

    }, err => {
      this.http.spinnerHide();
      this.errorMsg("Something went wrong. Please Try Again.");
    })
  }

  downloadPDF() {
    this.showDivPdf = true;
    setTimeout(() => {
      var HTML_Width = $(".canvas_div_pdf").width();
      var HTML_Height = $(".canvas_div_pdf").height();
      var top_left_margin = 10;
      var PDF_Width = HTML_Width + (top_left_margin * 2);
      var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      var canvas_image_width = HTML_Width;
      var canvas_image_height = HTML_Height;
      var heightLeft = canvas_image_height;
      var pageHeight = 210;

      var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;


      html2canvas($(".canvas_div_pdf")[0], { allowTaint: true }).then(function (canvas) {
        canvas.getContext('2d');

        //console.log(canvas.height + "  " + canvas.width);


        var imgData = canvas.toDataURL("image/jpeg", 1.0);
        var pdf: any = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.page = 1; // use this as a counter.
        var position = 0;

        // function footer() {
        //   pdf.text(150, 285, 'page ' + pdf.page); //print number bottom right
        //   pdf.page++;
        // };
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        heightLeft -= pageHeight;


        for (var i = 1; i <= totalPDFPages; i++) {
          pdf.addPage();
          //footer();
          pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        // while (heightLeft >= 0) {
        //   position = heightLeft - canvas_image_height;
        //   pdf.addPage();
        //   pdf.addImage(imgData, 'JPG', top_left_margin, position, canvas_image_width, canvas_image_height);
        //   heightLeft -= pageHeight;
        // }

        pdf.save("Skill_Checklist.pdf");
      });
    }, 100);


    setTimeout(() => {
      this.showDivPdf = false;
    }, 100)
  }


  // downloadPDF() {
  //   this.showDivPdf = true;
  //   setTimeout(() => {
  //     var data = document.getElementById('add');
  //     //console.log(data)
  //     html2canvas($(".canvas_div_pdf")[0], { allowTaint: true }).then(canvas => {
  //       var imgWidth = 210;
  //       var pageHeight = 295;
  //       var imgHeight = canvas.height * imgWidth / canvas.width;
  //       var heightLeft = imgHeight;
  //       canvas.getContext('2d');

  //       const imgData = canvas.toDataURL('image/jpeg', 1.0)

  //       var doc = new jspdf('p', 'mm', "a4");
  //       var position = 0;

  //       doc.addImage(imgData, 'JPG', 0, position, imgWidth, imgHeight + 10);
  //       heightLeft -= pageHeight;

  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         doc.addPage();
  //         doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 10);
  //         heightLeft -= pageHeight;
  //       }

  //       doc.save("Skill_Checklist.pdf");
  //     });
  //   }, 500);


  //   setTimeout(() => {
  //     this.showDivPdf = false;
  //   }, 600)
  // }

  ////////////////////////////

  // downloadPDF(action = "download") {

  //   html2canvas(document.getElementById('exportthis')).then(function (canvas) {
  //     var data = canvas.toDataURL();
  //     let docDefinition = {
  //       header: {
  //         headerRows: 0,
  //         columns: [
  //           {
  //             image: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAAA9CAYAAAAuwrKNAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAdTAAAOpgAAA6lwAAF2+XqZnUAAA7iElEQVR4nIyRTUiTARjHf3vf7XVN2+bcwvmBIk7NitFsaRI5MAgs6NDBS5oiHaKDp47RJapjYh9QRJkQhWWX1tdgBdZS+jjMjQ4rZyvaFGwznXOb7/s2u0kU/W9/Hp7//+H3aK543/P0wzfmszINZj1H9tTjD34hNJem0Wrg9psY1/p38+JjghpbMcO+CA8HO/BPx6myGRifmkVGYGuFEVdzPVoBfJEMelGlp9WKN5gypWXNycDscrugQdnvKHluN0q3HgST6e1b9KqkE1AVhc4mE6Nvf6CXNKDA3jojcz9X2Vlt4Kxvjq6mEmaTMsfcZWTyKjOJRYbHAjTXmenYZiccS9LraaDr3DOunvDgqrWQlwtB/6HcmsyTyQjFBj2qqm6YrVurSY+7sRJZ+XtekaQlMB0jGk+hW4fwD613SJIOSaf9o28lk93gxQK0haUs0fk0ztpSKstLuTfxicRKnoM77IwFotTaTXgcFkYmooS+L3H8QDMXul2ks2v4QnEGLr3EWWXkkLOCjCBywx/hcp+bO6+jdLfVMDj6jqH+dqotUoGFglK4qdy8GZ0oIooC0USSlVyevutT3BxoYzWb5/R4kKHeFu6/+szkTIrYYpZd9TYenepkYTlHPJVh3xkvjrJNv7uPFn7zdTHHiC/M+Z5WLj4Oc7iliruFfUORll8CiIWomCIR/AdCZkZGySP3vlqefPy96Mff/9pCHMwCwCTGsPvWFzcxHhZDoPwCNmaGm8BoeEULN4yCoQUAAoiqCZGFkRFUIrKxMTO63n3/2+rkkx9ZAsAEyMPKyADK9yAsxMnM/v3XPx9g2eJ19dWveUYynDt+/2E48h8iPQpGKAAIIKolRGAaZDj98AuQwST55stf988//4eDEiEzI2oK+/cfXN2IgSz+8ed/xeknP7xZGf+vdVRjmMPAyPCcWu4ZBUMLAAQQ/sYMEYCFiQnUJpLhYGPhe3TvJoOhJNNDL3XeUg1x7kpWFsYFP//+/wVsqv1kRNMHSpzAkpOJ8f9//V9//ze17Hm56uef/1EsjAx8wGYRuvJRMMwBQACRnRBB7UBhHjaWx+++Rdx6+WXnkZuv5zIyMVmKsv1h2Hni8k+G7+/mBejyNwDbhynA0vLE19//cKYuJqACXjYmy5ef/9R8+P5v/ttvf2152JjYRuvqkQMAAoisqpkN2JMCpkHrhrVXioCJMOg/sMF35/knLRE+dpef/xjnX7r5coKzzu9Haw+9fBiop7RCQkTgwJG7H0suv/hly8POaMiEJUkCO2rMfOxMmm+//ZP/+/+/0/qrH6YZS7FvYmFiPEmxL0fBoAcAAURSQgQlQF5OVomuTZdqNlx9ncjy7x8XN7DrCypWuRmZgd36vwK7rrzI+Przj7ctA9OUJ68+zvn+8dX3Hxx/HysIchWZyfObzTv1KomLlckdmBhlGdHSI6j9yMbEwPWfgZHr5affVds//064+frnZC42pvnAduVLKvp7FAwyABBABKtm0DgXJyszAzcbi+idl19S7rz+en3rlZeJgiyMXDzARAhKS+Ae8X9Qe5GRgZuViVOEh01t8ZlnLV9//T1x/eknV5b//9jZvj7/e//Fm+NuKlz5MoLsdX/+/5/65ee/7yB9yOkRVh0D248MrEyMUg/f/0kAdnyWvPryNxhovgAPOxMDNxD/H623hxUACCC8JSIornnYWTmO3njpdezu27Izt9+YSwpygEsufAkBlLpFOVn43n38obfixONdn/4wLtIQ4piw+uT189leWt9Yf7EucFEVOfz19/+Lx+59KfjLwCjPxcLIjc1IYNpWF+RgUj/28LuqND/LvdWXPmT+/stwU5P/3+h4zzACAAGENSHCSih2FkbTdz//lM88ct/2759/YmICHAxETlaAEytohkGYj51h29nHcUf52Y0FeTj3XnzwvlVOlOvVq6ff7vpaa937+fPvnlff/1bcev1LR4CdyQpb4gKZBUyM8i8//5W4/OKD6u9//2+22HGS5+NRMCgBQAChVs3AFMjJzsLw7edfSYZ/DAumHny4louFKZidiVGMFyj+Dy2VgBLsP6Dghx+/GT7//AMuodCrWVDJCexdM/z7/U/71YfvWUtPPj725z9Txut3n7gYf376z/P7zX0OZoYMN3We6tff/80EdlTO/v6LmRxB5rAyMQD73gy/mlyEgU0FJmDNzSgAag6MloyogBXUmeRgAWMOYLOKHgEEnk0DxgUPByuw6cTCwMXOzECKxQABhFIisjIyCp2+98Z7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',
  //             width: 110,
  //             height: 40,
  //             margin: [20, 25, 20, 40]
  //           },

  //           {
  //             stack: [
  //               {
  //                 text: 'Vish Consulting Services Inc.',
  //                 fontsize: 6,
  //                 bold: true,
  //                 absolutePosition: { x: 160, y: 18 },

  //               },
  //               {
  //                 text: '9655 Granite Ridge Dr, STE 200, San Diego,CA 92123',
  //                 fontsize: 4,
  //                 absolutePosition: { x: 160, y: 35 },

  //               },
  //               {
  //                 text: 'E: info@vishusa.com P: +1 (916) 800-376',
  //                 fontsize: 4,
  //                 absolutePosition: { x: 160, y: 45 },

  //               }
  //             ]
  //           },

  //         ]
  //       },
  //       footer: function (currentPage, pageCount) {
  //         return {
  //           table: {
  //             widths: [400],
  //             //margin: [50, 0, 0, 0],
  //             body: [
  //               [
  //                 // [left, top, right, bottom]
  //                 {
  //                   text: "Page " + currentPage.toString() + ' of ' + pageCount,
  //                   alignment: 'right',
  //                   style: 'normalText',
  //                   margin: [0, 20, 50, 0]
  //                 }
  //               ],

  //             ]
  //           },
  //           layout: 'noBorders',

  //         };
  //       },

  //       styles: {
  //         header: {
  //           fontSize: 12,
  //           bold: true,
  //           margin: [0, 20, 0, 10],
  //           // decoration: 'underline'
  //         },
  //         name: {
  //           fontSize: 7,

  //         },
  //         jobTitle: {
  //           fontSize: 14,
  //           bold: true,
  //           italics: true
  //         },
  //         sign: {
  //           margin: [0, 50, 0, 10],
  //           alignment: 'right',
  //           italics: true
  //         },
  //         content: {
  //           fontSize: 12,
  //         }

  //       },

  //       pageMargins: [15, 60, 15, 60],

  //       content: [{
  //         image: data,
  //         width: 500,
  //         pageBreak: 'after'
  //       }]
  //     };


  //     pdfMake.createPdf(docDefinition).download("skill_set.pdf");
  //   });


  //   // let docDefinition = {
  //   //   header: {
  //   //     headerRows: 0,
  //   //     columns: [
  //   //       {
  //   //         image: 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAAA9CAYAAAAuwrKNAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAdTAAAOpgAAA6lwAAF2+XqZnUAAA7iElEQVR4nIyRTUiTARjHf3vf7XVN2+bcwvmBIk7NitFsaRI5MAgs6NDBS5oiHaKDp47RJapjYh9QRJkQhWWX1tdgBdZS+jjMjQ4rZyvaFGwznXOb7/s2u0kU/W9/Hp7//+H3aK543/P0wzfmszINZj1H9tTjD34hNJem0Wrg9psY1/p38+JjghpbMcO+CA8HO/BPx6myGRifmkVGYGuFEVdzPVoBfJEMelGlp9WKN5gypWXNycDscrugQdnvKHluN0q3HgST6e1b9KqkE1AVhc4mE6Nvf6CXNKDA3jojcz9X2Vlt4Kxvjq6mEmaTMsfcZWTyKjOJRYbHAjTXmenYZiccS9LraaDr3DOunvDgqrWQlwtB/6HcmsyTyQjFBj2qqm6YrVurSY+7sRJZ+XtekaQlMB0jGk+hW4fwD613SJIOSaf9o28lk93gxQK0haUs0fk0ztpSKstLuTfxicRKnoM77IwFotTaTXgcFkYmooS+L3H8QDMXul2ks2v4QnEGLr3EWWXkkLOCjCBywx/hcp+bO6+jdLfVMDj6jqH+dqotUoGFglK4qdy8GZ0oIooC0USSlVyevutT3BxoYzWb5/R4kKHeFu6/+szkTIrYYpZd9TYenepkYTlHPJVh3xkvjrJNv7uPFn7zdTHHiC/M+Z5WLj4Oc7iliruFfUORll8CiIWomCIR/AdCZkZGySP3vlqefPy96Mff/9pCHMwCwCTGsPvWFzcxHhZDoPwCNmaGm8BoeEULN4yCoQUAAoiqCZGFkRFUIrKxMTO63n3/2+rkkx9ZAsAEyMPKyADK9yAsxMnM/v3XPx9g2eJ19dWveUYynDt+/2E48h8iPQpGKAAIIKolRGAaZDj98AuQwST55stf988//4eDEiEzI2oK+/cfXN2IgSz+8ed/xeknP7xZGf+vdVRjmMPAyPCcWu4ZBUMLAAQQ/sYMEYCFiQnUJpLhYGPhe3TvJoOhJNNDL3XeUg1x7kpWFsYFP//+/wVsqv1kRNMHSpzAkpOJ8f9//V9//ze17Hm56uef/1EsjAx8wGYRuvJRMMwBQACRnRBB7UBhHjaWx+++Rdx6+WXnkZuv5zIyMVmKsv1h2Hni8k+G7+/mBejyNwDbhynA0vLE19//cKYuJqACXjYmy5ef/9R8+P5v/ttvf2152JjYRuvqkQMAAoisqpkN2JMCpkHrhrVXioCJMOg/sMF35/knLRE+dpef/xjnX7r5coKzzu9Haw+9fBiop7RCQkTgwJG7H0suv/hly8POaMiEJUkCO2rMfOxMmm+//ZP/+/+/0/qrH6YZS7FvYmFiPEmxL0fBoAcAAURSQgQlQF5OVomuTZdqNlx9ncjy7x8XN7DrCypWuRmZgd36vwK7rrzI+Przj7ctA9OUJ68+zvn+8dX3Hxx/HysIchWZyfObzTv1KomLlckdmBhlGdHSI6j9yMbEwPWfgZHr5affVds//064+frnZC42pvnAduVLKvp7FAwyABBABKtm0DgXJyszAzcbi+idl19S7rz+en3rlZeJgiyMXDzARAhKS+Ae8X9Qe5GRgZuViVOEh01t8ZlnLV9//T1x/eknV5b//9jZvj7/e//Fm+NuKlz5MoLsdX/+/5/65ee/7yB9yOkRVh0D248MrEyMUg/f/0kAdnyWvPryNxhovgAPOxMDNxD/H623hxUACCC8JSIornnYWTmO3njpdezu27Izt9+YSwpygEsufAkBlLpFOVn43n38obfixONdn/4wLtIQ4piw+uT189leWt9Yf7EucFEVOfz19/+Lx+59KfjLwCjPxcLIjc1IYNpWF+RgUj/28LuqND/LvdWXPmT+/stwU5P/3+h4zzACAAGENSHCSih2FkbTdz//lM88ct/2759/YmICHAxETlaAEytohkGYj51h29nHcUf52Y0FeTj3XnzwvlVOlOvVq6ff7vpaa937+fPvnlff/1bcev1LR4CdyQpb4gKZBUyM8i8//5W4/OKD6u9//2+22HGS5+NRMCgBQAChVs3AFMjJzsLw7edfSYZ/DAumHny4louFKZidiVGMFyj+Dy2VgBLsP6Dghx+/GT7//AMuodCrWVDJCexdM/z7/U/71YfvWUtPPj725z9Txut3n7gYf376z/P7zX0OZoYMN3We6tff/80EdlTO/v6LmRxB5rAyMQD73gy/mlyEgU0FJmDNzSgAag6MloyogBXUmeRgAWMOYLOKHgEEnk0DxgUPByuw6cTCwMXOzECKxQABhFIisjIyCp2+98Z7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',
  //   //         width: 110,
  //   //         height: 40,
  //   //         margin: [20, 25, 20, 40]
  //   //       },

  //   //       {
  //   //         stack: [
  //   //           {
  //   //             text: 'Vish Consulting Services Inc.',
  //   //             fontsize: 6,
  //   //             bold: true,
  //   //             absolutePosition: { x: 160, y: 18 },

  //   //           },
  //   //           {
  //   //             text: '9655 Granite Ridge Dr, STE 200, San Diego,CA 92123',
  //   //             fontsize: 4,
  //   //             absolutePosition: { x: 160, y: 35 },

  //   //           },
  //   //           {
  //   //             text: 'E: info@vishusa.com P: +1 (916) 800-376',
  //   //             fontsize: 4,
  //   //             absolutePosition: { x: 160, y: 45 },

  //   //           }
  //   //         ]
  //   //       },

  //   //     ]
  //   //   },
  //   //   footer: function (currentPage, pageCount) {
  //   //     return {
  //   //       table: {
  //   //         widths: [400],
  //   //         //margin: [50, 0, 0, 0],
  //   //         body: [
  //   //           [
  //   //             // [left, top, right, bottom]
  //   //             {
  //   //               text: "Page " + currentPage.toString() + ' of ' + pageCount,
  //   //               alignment: 'right',
  //   //               style: 'normalText',
  //   //               margin: [0, 20, 50, 0]
  //   //             }
  //   //           ],

  //   //         ]
  //   //       },
  //   //       layout: 'noBorders',

  //   //     };
  //   //   },

  //   //   styles: {
  //   //     header: {
  //   //       fontSize: 12,
  //   //       bold: true,
  //   //       margin: [0, 20, 0, 10],
  //   //       // decoration: 'underline'
  //   //     },
  //   //     name: {
  //   //       fontSize: 7,

  //   //     },
  //   //     jobTitle: {
  //   //       fontSize: 14,
  //   //       bold: true,
  //   //       italics: true
  //   //     },
  //   //     sign: {
  //   //       margin: [0, 50, 0, 10],
  //   //       alignment: 'right',
  //   //       italics: true
  //   //     },

  //   //   },

  //   //   pageMargins: [15, 60, 15, 60],

  //   //   content: [
  //   //     {
  //   //       text: 'Name  :       ' + this.details.candidate_name,
  //   //       fontSize: 10,
  //   //       bold: true,
  //   //       margin: [10, 30, 0, 5]
  //   //     },
  //   //     {
  //   //       text: 'Email  :      ' + this.details.candidate_email,
  //   //       fontSize: 10,
  //   //       bold: true,
  //   //       margin: [10, 0, 0, 5]
  //   //     },
  //   //     {
  //   //       text: 'Date  :       ' + this.details.edit_date,
  //   //       fontSize: 10,
  //   //       bold: true,
  //   //       margin: [10, 0, 0, 5]
  //   //     },
  //   //     {
  //   //       text: 'Skill Set For ' + this.category_name + ' > ' + this.area_name,
  //   //       fontSize: 15,
  //   //       bold: true,
  //   //       margin: [10, 15, 0, 5]
  //   //     },

  //   //     // {
  //   //     //   canvas: [
  //   //     //     //{ type: 'line', x1: 0, y1: 10, x2: 400, y2: 10, lineWidth: 1 }, //Up line
  //   //     //     { type: 'line', x1: 0, y1: 150, x2: 300, y2: 150, lineWidth: 1 }, //Bottom line
  //   //     //     //{ type: 'line', x1: 0, y1: 30, x2: 0, y2: 150, lineWidth: 1 }, //Left line
  //   //     //     //{ type: 'line', x1: 300, y1: 30, x2: 300, y2: 150, lineWidth: 1, }, //Rigth line
  //   //     //   ]
  //   //     // },


  //   //     {
  //   //       width: ['230'],
  //   //       margin: [0, 0, 0, 0],
  //   //       table: {
  //   //         widths: [400],
  //   //         body: [
  //   //           [
  //   //             {
  //   //               text: 'Instructions  :    This checklist is meant to serve as a general guideline for our client facilities as to the level of your skills within your nursing specialty.Please use the scale below to describe your experience/expertise in each area listed below.',
  //   //               fontSize: 10,
  //   //               bold: true,
  //   //               margin: [10, 0, 0, 5],
  //   //               color: 'red'
  //   //             },
  //   //           ],
  //   //           [
  //   //             {
  //   //               fontSize: 10,
  //   //               bold: true,
  //   //               margin: [10, 0, 0, 5],
  //   //               text: 'Scale  :    1 = No Experience\n       2 = Need Training\n        3 = Able to perform with supervision\n         4 = Able to perform independently',
  //   //               color: 'red'

  //   //             },
  //   //           ],

  //   //         ],
  //   //       },
  //   //       layout: 'noBorders',
  //   //     },

  //   //     this.skillSetData(this.jobDomain),
  //   //   ],
  //   // };

  //   // if (action === 'download') {
  //   //   pdfMake.createPdf(docDefinition).download('skill_set.pdf');
  //   // } else if (action === 'print') {
  //   //   pdfMake.createPdf(docDefinition).print('skill_set.pdf');
  //   // } else {
  //   //   pdfMake.createPdf(docDefinition).open('skill_set.pdf');
  //   // }
  // }


  /////////////////////////////////

  errorMsg(msg) {
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
    });
  }

  successMsg(msg) {
    Swal.fire({
      title: msg,
      icon: 'success',
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


}
