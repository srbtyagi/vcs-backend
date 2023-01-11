import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { CandidateProfileComponent } from './components/candidate-portal/candidate-profile/candidate-profile.component';
import { AppliedJobsComponent } from './components/candidate-portal/applied-jobs/applied-jobs.component';
import { PostJobComponent } from './components/recruiter-portal/post-job/post-job.component';
import { ManageJobsComponent } from './components/recruiter-portal/manage-jobs/manage-jobs.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { ContactUsComponent } from './components/pages/contact-us/contact-us.component';
import { BrowseCandidateComponent } from './components/recruiter-portal/browse-candidate/browse-candidate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JobsComponent } from './components/pages/jobs/jobs.component';
import { CompanyComponent } from './components/admin-portal/setup/company/company.component';
import { DepartmentComponent } from './components/admin-portal/setup/department/department.component';
import { UserRoleComponent } from './components/admin-portal/setup/user-role/user-role.component';
import { ApplyJobComponent } from './components/pages/apply-job/apply-job.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { JobApplicationComponent } from './components/pages/job-application/job-application.component';
import { EmployeeComponent } from './components/admin-portal/setup/employee/employee.component';
import { ApplicantsComponent } from './components/admin-portal/applicants/applicants/applicants.component';
import { JobApplicationAdminComponent } from './components/admin-portal/applicants/job-application-admin/job-application-admin.component';
import { ApplicantsDetailsComponent } from './components/admin-portal/applicants/applicants-details/applicants-details.component';
import { ClientComponent } from './components/admin-portal/setup/client/client.component';
import { DropdownListComponent } from './components/admin-portal/setup/dropdown-list/dropdown-list.component';
import { JobDashboardComponent } from './components/common/job-dashboard/job-dashboard.component';
import { ApplicantDashboardComponent } from './components/common/applicant-dashboard/applicant-dashboard.component';
import { SetupDashboardComponent } from './components/common/setup-dashboard/setup-dashboard.component';
import { MyjobsDashboardComponent } from './components/common/myjobs-dashboard/myjobs-dashboard.component';
import { NgCircleProgressModule } from "ng-circle-progress";
import { AppSummaryComponent } from './components/admin-portal/applicants/app-summary/app-summary.component';
import { AddApplicantAdminComponent } from './components/admin-portal/applicants/add-applicant-admin/add-applicant-admin.component';

import { JobdetailsComponent } from './components/pages/jobdetails/jobdetails.component';
import { OnboardingAndHiringComponent } from './components/admin-portal/applicants/onboarding-and-hiring/onboarding-and-hiring.component';
import { OnboardingHiringComponent } from './components/candidate-portal/onboarding-hiring/onboarding-hiring.component';
import { HiredApplicantComponent } from './components/admin-portal/applicants/hired-applicant/hired-applicant.component';
import { AssignManagerComponent } from './components/admin-portal/applicants/assign-manager/assign-manager.component';
import { FinanceDashboardComponent } from './components/common/finance-dashboard/finance-dashboard.component';
import { PayrollProcessingComponent } from './components/admin-portal/finance/payroll-processing/payroll-processing.component';
import { PayrollApprovalComponent } from './components/admin-portal/finance/payroll-approval/payroll-approval.component';
import { AssignmentDashboardComponent } from './components/common/assignment-dashboard/assignment-dashboard.component';
import { CurrentAssignmentComponent } from './components/candidate-portal/current-assignment/current-assignment.component';
import { AssignmentHistoryComponent } from './components/candidate-portal/assignment-history/assignment-history.component';
import { PayrollInvoiceComponent } from './components/admin-portal/finance/payroll-invoice/payroll-invoice.component';
import { ApplyJobGuestComponent } from './components/candidate-portal/apply-job-guest/apply-job-guest.component';
import { IncentivesComponent } from './components/admin-portal/finance/incentives/incentives.component';
import { SkillChecklistComponent } from './components/pages/skill-checklist/skill-checklist.component';
import { SkillSetComponent } from './components/pages/skill-set/skill-set.component';
import { BusinessComponent } from './components/pages/business/business.component';
import { HealthcareStaffingComponent } from './components/pages/healthcare-staffing/healthcare-staffing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { ProfileComponent } from './components/candidate-portal/profile/profile.component';
import { PasswordChangeComponent } from './components/candidate-portal/password-change/password-change.component';
import { EditSkillSetComponent } from './components/candidate-portal/edit-skill-set/edit-skill-set.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { InvoiceReconcileComponent } from './components/admin-portal/finance/invoice-reconcile/invoice-reconcile.component';
import { ChangePasscodeComponent } from './components/candidate-portal/change-passcode/change-passcode.component';
import { AdminSkillSetComponent } from './components/recruiter-portal/admin-skill-set/admin-skill-set.component';
import { HealthcareBlogsComponent } from './components/pages/healthcare-blogs/healthcare-blogs.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { MyDocumentsComponent } from './components/candidate-portal/my-documents/my-documents.component';
import { ITCaseStudyComponent } from './components/pages/it-case-study/it-case-study.component';
import { ITBlogComponent } from './components/pages/it-blog/it-blog.component';
import { ITServiceComponent } from './components/pages/it-service/it-service.component';
import { HsCaseStudyComponent } from './components/pages/hs-case-study/hs-case-study.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TermsOfServiceComponent } from './components/pages/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { StoreDataService } from './store-data.service';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CandidateProfileComponent,
    AppliedJobsComponent,
    PostJobComponent,
    ManageJobsComponent,
    AboutUsComponent,
    ContactUsComponent,
    BrowseCandidateComponent,
    JobsComponent,
    CompanyComponent,
    DepartmentComponent,
    UserRoleComponent,
    ApplyJobComponent,
    JobApplicationComponent,
    EmployeeComponent,
    ApplicantsComponent,
    JobApplicationAdminComponent,
    ApplicantsDetailsComponent,
    ClientComponent,
    DropdownListComponent,
    JobDashboardComponent,
    ApplicantDashboardComponent,
    SetupDashboardComponent,
    MyjobsDashboardComponent,
    AppSummaryComponent,
    AddApplicantAdminComponent,
    JobdetailsComponent,
    OnboardingAndHiringComponent,
    OnboardingHiringComponent,
    HiredApplicantComponent,
    AssignManagerComponent,
    FinanceDashboardComponent,
    PayrollProcessingComponent,
    PayrollApprovalComponent,
    AssignmentDashboardComponent,
    CurrentAssignmentComponent,
    AssignmentHistoryComponent,
    PayrollInvoiceComponent,
    ApplyJobGuestComponent,
    IncentivesComponent,
    SkillChecklistComponent,
    SkillSetComponent,
    BusinessComponent,
    HealthcareStaffingComponent,
    MyProfileComponent,
    ProfileComponent,
    PasswordChangeComponent,
    EditSkillSetComponent,
    InvoiceReconcileComponent,
    ChangePasscodeComponent,
    AdminSkillSetComponent,
    HealthcareBlogsComponent,
    FaqComponent,
    MyDocumentsComponent,
    ITCaseStudyComponent,
    ITBlogComponent,
    ITServiceComponent,
    HsCaseStudyComponent,
    TermsOfServiceComponent,
    PrivacyPolicyComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 20,
      outerStrokeWidth: 8,
      innerStrokeWidth: 4,
      outerStrokeColor: "#4C96D7",
      innerStrokeColor: "#a6cbeb",
      animationDuration: 300,
    }),
    DpDatePickerModule,
    NgxPaginationModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgxSpinnerService, StoreDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
