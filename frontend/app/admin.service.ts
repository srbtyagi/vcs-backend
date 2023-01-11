import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import Swall from 'sweetalert2';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  header = new HttpHeaders().set('Authorization', 'Bearear eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfbW9iIjoiODM2OTU2NDAwNSIsInVzZXJfcGFzc2NvZGUiOiJ1bmRlZmluZWQifSwiaWF0IjoxNjIyNDY5MTkzLCJhdWQiOiI4MzY5NTY0MDA1IiwiaXNzIjoiMTUuMjA3LjE5My4xMTYifQ.-Kp_kfLhj_L3bqRLOMYk44JAU_IfPgRr8-FgNRnL7ho');

  constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }

  ///////
  spinnerShow() {
    this.spinner.show(undefined,
      {
        type: 'ball-square-clockwise-spin',
        size: 'medium',
        bdColor: "rgba(0, 0, 0, 0.8)",
        color: '#4C96D7',
        fullScreen: true
      }
    );
  }

  spinnerHide() {
    this.spinner.hide();
  }

  /////////////

  postJob(datas) {
    //console.log(datas)
    return this.http.post('https://vishusa.com/vcsapi/insert/job/post', datas, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );

  }

  getAllJobs(datas) {
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/jobPost/all', datas, { headers: this.header });
    return data;
  }

  changeJobStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change/job_status/byjobID', datas, { headers: this.header });
    return data;
  }

  updateJobDetails(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/edit/desc/n/req_info', datas, { headers: this.header });
    return data;
  }

  getApplicants(datas) {
    //console.log(this.header)
    let data = this.http.post('https://vishusa.com/vcsapi/api/get/applications', datas, { headers: this.header });
    return data;
  }

  getAllProfession() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/profession', { headers: this.header });
    return data;
  }

  getAllSpeciality() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/speciality', { headers: this.header });
    return data;
  }

  getAlljobType() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job_type', { headers: this.header });
    return data;
  }

  getAlljobSector() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job_sector', { headers: this.header });
    return data;
  }

  getAllPositionType() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/position_type', { headers: this.header });
    return data;
  }

  updateApplicant(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/application', datas, { headers: this.header });
    return data;
  }

  changeUserStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change_status/applicant/recruit_status', datas, { headers: this.header });
    return data;
  }

  changeApplyStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change_status/applicant/apply_status', datas, { headers: this.header });
    return data;
  }

  changePassword(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change_password', datas, { headers: this.header });
    return data;
  }

  changePasscode(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change_passcode', datas, { headers: this.header });
    return data;
  }

  getDocumentType() {
    let data = this.http.get('https://vishusa.com/vcsapi/api/get/standard/document/data', { headers: this.header });
    return data;
  }

  uploadDoc(datas, user, doc_id, doc_name, doc_expiry_date) {
    //console.log(datas, user, doc_id, doc_name)
    let data = this.http.post(`https://vishusa.com/vcsapi/upload/document/${doc_name}/${user}/${doc_id}/${doc_expiry_date}`, datas, {
      reportProgress: true, observe: "events",
      headers: this.header
    });
    return data;
  }

  uploadDocWithData(datas, rec_doc_id, user, doc_id, doc_name) {
    //console.log(datas, rec_doc_id, user, doc_id, doc_name)
    let data = this.http.post(`https://vishusa.com/vcsapi/submit/document/details/${rec_doc_id}/${doc_name}/${user}/${doc_id}`, datas, {

      headers: this.header
    });
    return data;
  }

  uploadConfDoc(datas, doc_name, user_id, recruitee_id) {
    //console.log(datas, doc_name, user_id, recruitee_id)
    let data = this.http.post(`https://vishusa.com/vcsapi/insert/api/tbl/conf_document/${doc_name}/${user_id}/${recruitee_id}`, datas, {
      reportProgress: true, observe: "events",
      headers: this.header
    });
    return data;
  }

  getConfDFiles(recruitee_id) {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/conf_document/${recruitee_id}`, { headers: this.header });
    return data;
  }

  getapplicantsProfileData(datas) {
    let data = this.http.get(`https://vishusa.com/vcsapi/api/get/applicants/details/${datas}`, { headers: this.header });
    return data;
  }

  getAllDocs(datas) {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/uploaded/document/list/${datas}`, { headers: this.header });
    return data;
  }

  getAllDocsCurrent(datas) {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/uploaded/document/list/current/${datas}`, { headers: this.header });
    return data;
  }

  downloadDoc(user, rec_doc_id) {
    //console.log(user, rec_doc_id)
    let data = this.http.get(`https://vishusa.com/vcsapi/download/${rec_doc_id}/${user}`);
    return data;
  }

  verifyJobId(datas) {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/checkIfexists/${datas}`, { headers: this.header });
    return data;
  }

  getClients() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/clients', { headers: this.header });
    return data;
  }

  getSystems() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/system_name', { headers: this.header });
    return data;
  }

  getClientsExceptStatus() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/all/clients', { headers: this.header });
    return data;
  }

  getJobId() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/JobNo/applicationlist', { headers: this.header });
    return data;
  }

  getJobIdSearch(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/JobNo/suggestionList', datas, { headers: this.header });
    return data;
  }

  getAllJobApplication(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/application/searchBar', datas, { headers: this.header });
    return data;
  }

  getjobSummery(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/application/job_id', datas, { headers: this.header });
    return data;
  }

  changeReviewStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/application/review_status', datas, { headers: this.header });
    return data;
  }

  getShortlistedCandidate(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/application/job_id/and/application_stage', datas, { headers: this.header });
    return data;
  }

  shortlistingCandidate(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/application_stage/byJobID/sort_listed', datas, { headers: this.header });
    return data;
  }

  offerreject(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/application_stage/byJobID/offeredORrejected', datas, { headers: this.header });
    return data;
  }

  InsertRemark(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/add/or/update/api/tbl/application/remarks/and/remarks_date', datas, { headers: this.header });
    return data;
  }

  getOfferedShortListCandi(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/application/by/job_id/sort_listed/or/rejected', datas, { headers: this.header });
    return data;
  }

  uploadResumeAppl(datas, user) {
    // //console.log(datas)
    let data = this.http.post(`https://vishusa.com/vcsapi/upload/resume/${user}`, datas, { headers: this.header });
    return data;
  }

  register(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/api/registration/user', datas, { headers: this.header });
    return data;
  }

  add_applicant(datas) {
    // //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/insert/api/tbl/application', datas, { headers: this.header });
    return data;
  }

  getClientOnBoard() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job/all/clients', { headers: this.header });
    return data;
  }

  getClientHired() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/assignment/and/client/data', { headers: this.header });
    return data;
  }

  getCountry() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job/all/country', { headers: this.header });
    return data;
  }

  getState() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/api/tbl/job/all/state', { headers: this.header });
    return data;
  }

  getCity(datas) {
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/tbl/job/all/city', datas, { headers: this.header });
    return data;
  }

  searchonboardAppl(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/all/job/data/onboarding/hired/offer_accepted', datas, { headers: this.header });
    return data;
  }

  searchHiredAppl(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/all/job/data/hired', datas, { headers: this.header });
    return data;
  }

  InsertOnboarding(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/payrate_details/process/data', datas, { headers: this.header });
    return data;
  }

  updateOnboarding(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/onboarding_details/onboarding/process', datas, { headers: this.header });
    return data;
  }

  finishOnboarding(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/onboarding_status/completed/onboarding', datas, { headers: this.header });
    return data;
  }

  cancelOnboarding(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/onboarding_status/cancelled/onboarding', datas, { headers: this.header });
    return data;
  }

  hiring(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/onboarding/hired/accepted', datas, { headers: this.header });
    return data;
  }

  getAllApplnByUser(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/application/user_id', datas, { headers: this.header });
    return data;
  }

  getApplicantByClient(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/applicant/by/clientID', datas, { headers: this.header });
    return data;
  }

  getJobByClient(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/tbl/job/job/by/client_id', datas, { headers: this.header });
    return data;
  }

  getAllEmployee() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/Recruiter/all', { headers: this.header });
    return data;
  }

  getAllApplicant() {
    let data = this.http.get('https://vishusa.com/vcsapi/get/applicant/by/clientID/ALL/data', { headers: this.header });
    return data;
  }

  assignRecruiter(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/recruiter_id/by/application_id', datas, { headers: this.header });
    return data;
  }

  assignOnboardMgr(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/onb_mgr_id/by/application_id', datas, { headers: this.header });
    return data;
  }

  assignTeamLead(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/teamLead_id/by/application_id', datas, { headers: this.header });
    return data;
  }

  assignManager(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/Manager_id/by/application_id', datas, { headers: this.header });
    return data;
  }

  assignOthers(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/insert/update/api/others/by/application_id', datas, { headers: this.header });
    return data;
  }

  getRolesByApplication(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/roles/by/application_id', datas, { headers: this.header });
    return data;
  }

  getSearchMgrApplication(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/asign_manager/and/applicant/details', datas, { headers: this.header });
    return data;
  }

  changeAssignmentStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/assignment_status/tbl/assignment', datas, { headers: this.header });
    return data;
  }

  changeJobApplicantStatus(datas) {
    // //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/application_stage/byJobID/offer/accepted/OR/rejected', datas, { headers: this.header });
    return data;
  }

  checkEmailApplicant(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/check/user/by/email', datas, { headers: this.header });
    return data;
  }

  getRecruiteeStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/recruitee/status/by/user_id', datas, { headers: this.header });
    return data;
  }

  getAlreadyAppliedStatus(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/user/already/applied/job', datas, { headers: this.header });
    return data;
  }

  updateRecruitee(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/rec_detailsandudetails', datas, { headers: this.header });
    return data;
  }

  ////////////// Finance module  ////////////////////////

  getYearByClient() {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/account_file/year`, { headers: this.header });
    return data;
  }

  getYearFromClientID(clientId) {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/account_file_data/year/${clientId}`, { headers: this.header });
    return data;
  }

  getMonthFromClientIDandYr(clientId, year) {
    //console.log(clientId, year)
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/account_file_data/month/${clientId}/${year}`, { headers: this.header });
    return data;
  }

  getMonthByYear(year) {
    //console.log(year)
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/account_file/month/${year}`, { headers: this.header });
    return data;
  }

  getWeekByMonth(year, month) {
    //console.log(year, month)
    let data = this.http.get(`https://vishusa.com/vcsapi/get/api/tbl/account_file/weeks/${year}/${month}`, { headers: this.header });
    return data;
  }

  getPayrollDataOfSecondModal(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/all/inprocess/accountdatas', datas, { headers: this.header });
    return data;
  }

  getPayrollDataByAssignID(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/payrollData/BYassignment', datas, { headers: this.header });
    return data;
  }

  insertPayrollData(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/add/or/update/api/tbl/payroll_invoice/calculate', datas, { headers: this.header });
    return data;
  }

  getPayrollAllData(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/all/inprocess/account/details', datas, { headers: this.header });
    return data;
  }

  getDataByFileID(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/payroll/Byaccountfile', datas, { headers: this.header });
    return data;
  }

  submitFile(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/api/account_status/tbl/account_file', datas, { headers: this.header });
    return data;
  }

  approvePayroll(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/update/status/payroll/account_file', datas, { headers: this.header });
    return data;
  }

  getPayrollInvoiceData(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/payrollData/recruiteePayroll/filtered', datas, { headers: this.header });
    return data;
  }

  getInvoiceDataByFileID(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/approval_status/approved/accountfiledata', datas, { headers: this.header });
    return data;
  }

  getRecruiteeCodebyName(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/all/recruitee/name/payroll', datas, { headers: this.header });
    return data;
  }

  getRecruiteeNameByCode(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/all/recruitee/code/payroll', datas, { headers: this.header });
    return data;
  }

  seachRecruiteePayroll(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/all/recruitee/payroll/search', datas, { headers: this.header });
    return data;
  }

  getApprovedWeek(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/acc_file/approved/week', datas, { headers: this.header });
    return data;
  }

  generateIncentivesforPayroll(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/generate/incentive', datas, { headers: this.header });
    return data;
  }

  getIncentiveData(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/incentive/file/data', datas, { headers: this.header });
    return data;
  }

  downloadIncentiveExcel(inc_file_id, user_id) {
    //console.log(inc_file_id, user_id)
    let data = this.http.get(`https://vishusa.com/vcsapi/get/incentive/file/download/excel/${inc_file_id}/${user_id}`, { headers: this.header });
    return data;
  }

  getPayrollReconData(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/invoice_recon/Byaccountfile', datas, { headers: this.header });
    return data;
  }

  InsertUpdatePayrollReconData(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/insert/payroll_recon/data', datas, { headers: this.header });
    return data;
  }

  getWorkHour(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/get/api/rec_work_hr/by/assignmentID/week_id/recruiteeID', datas, { headers: this.header });
    return data;
  }

  getBacklog() {
    let data = this.http.get(`https://vishusa.com/vcsapi/get/inc_data/backlog`, { headers: this.header });
    return data;
  }

  deleteFileIncentive(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/delete/account_file/byID', datas, { headers: this.header });
    return data;
  }

  generateBacklog(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/generate/incentive/backlog', datas, { headers: this.header });
    return data;
  }

  getcandiSkillSet() {
    let data = this.http.get(`https://vishusa.com/vcsapi/api/get/candidates`, { headers: this.header });
    return data;
  }

  getSkillsetByCandi(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/skilldata/by/candidate_id', datas, { headers: this.header });
    return data;
  }

  updateDocExpDate(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/api/update/expirY_dates/document', datas, { headers: this.header });
    return data;
  }

  insertRequestDoc(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/insert/req/doc', datas, { headers: this.header });
    return data;
  }

  getCurrentReqDocs(datas) {
    return this.http.get(`https://vishusa.com/vcsapi/get/required/doc/${datas}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAllDocuments(datas) {
    return this.http.get(`https://vishusa.com/vcsapi/get/uploaded/document/list/${datas}`, { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  jobDeleteById(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change/job_status/delete/byjobID', datas, { headers: this.header });
    return data;
  }

  jobDeleteByDate(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change/job_status/delete/byjobPostDate', datas, { headers: this.header });
    return data;
  }

  getPreferedLocation() {
    let data = this.http.get(`https://vishusa.com/vcsapi/api/get/applications/desiredlocation`, { headers: this.header });
    return data;
  }

  deleteMultipleApplicant(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/change/user_status/delete/byApplicantID', datas, { headers: this.header });
    return data;
  }

  deleteMultipleSkillset(datas) {
    //console.log(datas)
    let data = this.http.post('https://vishusa.com/vcsapi/edit/api/delete/skillset/byDate', datas, { headers: this.header });
    return data;
  }

  getUserRoleDetails() {
    return this.http.get('https://vishusa.com/vcsapi/get/api/user_roles', { headers: this.header })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }






  //////////// Error Handle //////////////

  handleError(error: any) {
    let Swal: any = Swall;
    if (error.status == 0) {
      Swal.fire({
        text: 'No Internet Connection',
        type: 'error'
      }).then(() => {
        location.reload();
      })
    }
    else if (error.status == 400) {
      Swal.fire({
        text: 'Invalid Syntex',
        type: 'error'
      })
    }
    else if (error.status == 403) {
      Swal.fire({
        text: 'Unauthorized Access',
        type: 'error'
      })
    }
    else if (error.status == 404) {
      Swal.fire({
        text: 'URL Is Not Recognized',
        type: 'error'
      })
    }
    else if (error.status == 500) {
      Swal.fire({
        text: 'Internal Server Error',
        type: 'error'
      })
    }
    else if (error.status == 501) {
      Swal.fire({
        text: 'Not Implemented',
        type: 'error'
      })
    }
    else if (error.status == 503) {
      Swal.fire({
        text: 'Service Unavailable',
        type: 'error'
      })
    }
    else if (error.status == 511) {
      Swal.fire({
        text: 'Network Authentication Required',
        type: 'error'
      })
    }
    return throwError(error.statusText);
  }



}
