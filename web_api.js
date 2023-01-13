const express = require('express');
const app = express();
const stuff = require('../services/jwt.js');
const moment = require('moment');
const db = require('../db/db')
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
var xls = require("excel4node");
const { all, resource } = require('./employee_api.js');



app.get('/vcsapi/api/generate/excel/appplicant/and/application/:f_date/:t_date/:user_id/:name', function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
        try {
            let un = await getUsers(req.params.user_id);
            let user_name = ""
            if (un[0].user_middle_name === null || un[0].user_middle_name === '') {
                user_name = un[0].user_first_name + " " + un[0].user_last_name
            } else {
                user_name = un[0].user_first_name + " " + un[0].user_middle_name + " " + un[0].user_last_name
            }
            var data1 = {
                created_by: user_name,
                from_date: moment(new Date(req.params.f_date)).format("MM/DD/YYYY"),
                to_date: moment(new Date(req.params.t_date)).format("MM/DD/YYYY")
            }
            let p = await getApplicantApplicationDetails(req.params);

            //console.log("data1", data1)
            //console.log("req.params.t_date", req.params.t_date)
            //console.log("req.params.f_date", req.params.f_date)
            var data = ''

            for (i in p) {

                let phn = ''
                if (p[i].phone === null || p[i].phone === '') {
                    phn = "-"
                } else {
                    phn = p[i].phone
                }
                let applicantName = ""
                if (p[i].user_middle_name === null || p[i].user_middle_name === '') {
                    applicantName = p[i].user_first_name + " " + p[i].user_last_name
                } else {
                    applicantName = p[i].user_first_name + " " + p[i].user_middle_name + " " + p[i].user_last_name
                }

                let emlID = ''
                if (p[i].email === null || p[i].email === '') {
                    emlID = "-"
                } else {
                    emlID = p[i].email
                }

                data =
                    data +
                    applicantName +
                    "\t" +
                    emlID +
                    "\t" +
                    phn +
                    "\t" +
                    p[i].recruit_status +
                    "\t" +
                    p[i].application_no +
                    "\t" +
                    p[i].apply +
                    "\t" +
                    p[i].job_title +
                    "\t" +
                    p[i].application_stage +
                    "\n";
            }
            var data2 = JSON.stringify(data);

            //console.log(data2)
            async function excle() {
                var get = await generateExcelApplicantApplicationDetails(data1, data2);
                // //console.log(datask);
                res.sendFile(get);
            }
            excle();
        } catch (err) {
            //console.log(err);
            res.json(err)
        }
    }
    apps();
    // } else {
    //     res.status(401).json("token is not valid");
    // }


});
function generateExcelApplicantApplicationDetails(data, data2) {
    return new Promise(function (resolve, reject) {

        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var wb = new xls.Workbook();
        var ws = wb.addWorksheet("Sheet 1");
        var style = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 14
            },
            alignment: {
                wrapText: true
                //horizontal: 'center',
            }
        });
        var style1 = wb.createStyle({
            font: {
                color: "#000000",
                bold: true,
                //underline: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "center",
                vertical: "center"
            },
            outline: {
                summaryBelow: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style2 = wb.createStyle({
            alignment: {
                wrapText: true,
                horizontal: "center",
                shrinkToFit: true,
                vertical: "center"
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style3 = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "left"
            }
        });

        ws.column(1).setWidth(3);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(30);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(30);
        ws.column(9).setWidth(15);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(15);
        ws.column(12).setWidth(15);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(15);
        ws.column(15).setWidth(15);
        ws.column(16).setWidth(15);
        ws.column(17).setWidth(15);
        ws.column(18).setWidth(15);
        ws.cell(1, 1, 1, 12, true)
            .string("Application List ")
            .style(style);
        ws.cell(3, 1, 3, 12, true)
            .string("From Date    : " + data.from_date)
            .style(style3);
        ws.cell(4, 1, 4, 12, true)
            .string("To Date      : " + data.to_date)
            .style(style3);

        ws.cell(5, 1, 5, 12, true)
            .string("Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY"))
            .style(style3);
        ws.cell(6, 1, 6, 12, true)
            .string("Created By     : " + data.created_by)
            .style(style3)

        ws.cell(8, 1)
            .string("#")
            .style(style1);
        ws.cell(8, 2)
            .string("Applicant Name")
            .style(style1);
        ws.cell(8, 3)
            .string("Email")
            .style(style1);
        ws.cell(8, 4)
            .string("Phone")
            .style(style1);
        ws.cell(8, 5)
            .string("Job Status")
            .style(style1);
        ws.cell(8, 6)
            .string("Application No")
            .style(style1);
        ws.cell(8, 7)
            .string("Date of Apply")
            .style(style1);
        ws.cell(8, 8)
            .string("Job Title")
            .style(style1);
        ws.cell(8, 9)
            .string("Application Status")
            .style(style1);


        ws.cell(9, 1)
            .number(1)
            .style(style2);

        var row = 9;
        var col = 1;
        var key = "";
        var count = 1;
        for (var i = 1; i < data2.length - 1; i++) {
            if (data2[i] == "\\" && data2[i + 1] == "t") {
                col = col + 1;

                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                key = "";
                i++;
            } else if (data2[i] == "\\" && data2[i + 1] == "n") {
                col = col + 1;
                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                row = row + 1;
                count = count + 1;
                ////console.log(count);
                /// //console.log(data2[i+2]);
                if (data2[i + 2] == '"') {
                    break;
                } else {
                    ws.cell(row, 1)
                        .number(count)
                        .style(style2);
                }
                key = "";
                col = 1;
                i++;
            } else {
                var key = key + data2[i];
                ////console.log("in else condittion");
                ////console.log(key);
            }
        }
        wb.write(`/home/ubuntu/vcs/excle_file/applicationdetails${data.created_by}.xlsx`, function (err) {
            if (err) resolve("err");
            else resolve(`/home/ubuntu/vcs/excle_file/applicationdetails${data.created_by}.xlsx`);

        });
    });
}
function getApplicantApplicationDetails(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let frm_date = moment(new Date(data.f_date)).format("MM/DD/YYYY");
        let to_date = moment(new Date(data.t_date)).format("MM/DD/YYYY");


        let sql = `SELECT * FROM(
                    SELECT a.*,ur.*,r.recruit_status,j.job_title, a.apply_date  AS apply  FROM tbl_application a         
                    INNER JOIN tbl_recruitee r on r.recruitee_id=a.recruitee_id         
                    INNER JOIN tbl_user ur on ur.user_id=r.user_id         
                    INNER JOIN tbl_job j on j.job_id=a.job_id  
                    where ur.user_status!="deleted"       
                        ) AS temp
                    where apply>="${frm_date}" and apply<="${to_date}";`
        //console.log("sql", sql)
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}



app.get("/vcsapi/generate/excle/invoice_recon/:acc_file_id/:user_id/:client_id/:name", function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
        try {
            let p = await getPayrollRecondataByAccFIDSingle(req.params.acc_file_id)
            let gc = await getClientName(req.params.client_id)
            var getname = await getUsername(req.params.user_id);
            let user_name = ""
            if (getname[0].user_middle_name === null) {
                user_name = getname[0].user_first_name + " " + getname[0].user_last_name
            } else {
                user_name = getname[0].user_first_name + " " + getname[0].user_middle_name + " " + getname[0].user_last_name
            }
            var data1 = {
                created_by: user_name,
                client: gc[0].client_name
            }

            // if(p.length>0){
            var data = '';
            for (i in p) {
                let rbill_rate = 0
                let otbill_rate = 0
                let hbill_rate = 0
                let r_hr = ''
                let o_hr = ''
                let h_hr = ''
                let inv_amount = 0
                let dinv_amount = 0
                let creg_hr = ''
                let cot_hr = ''
                let ch_hr = ''
                let cinv_amount = 0
                if (p[i].onb_regular_bill_rate !== null && isNaN(p[i].onb_regular_bill_rate) === false) {
                    rbill_rate = p[i].onb_regular_bill_rate
                } else {
                    rbill_rate = 0
                }
                if (p[i].onb_ot_bill_rate !== null && isNaN(p[i].onb_ot_bill_rate) === false) {
                    otbill_rate = p[i].onb_ot_bill_rate
                } else {
                    otbill_rate = 0
                }
                if (p[i].onb_holiday_bill_rate !== null && isNaN(p[i].onb_holiday_bill_rate) === false) {
                    hbill_rate = p[i].onb_holiday_bill_rate
                } else {
                    hbill_rate = 0
                }
                if (p[i].reg_hr !== null) {
                    r_hr = p[i].reg_hr
                }
                if (p[i].ot_hr !== null) {
                    o_hr = p[i].ot_hr
                }
                if (p[i].holiday_hr !== null) {
                    h_hr = p[i].holiday_hr
                }
                if (p[i].invoice_amt !== null && isNaN(p[i].invoice_amt) === false) {
                    inv_amount = p[i].invoice_amt
                } else {
                    inv_amount = 0
                }
                if (p[i].deducted_invoice_amt !== null && isNaN(p[i].deducted_invoice_amt) === false) {
                    dinv_amount = p[i].deducted_invoice_amt
                } else {
                    dinv_amount = 0
                }
                if (p[i].reg_hr_clt !== null) {
                    creg_hr = p[i].reg_hr_clt
                }
                if (p[i].ot_hr_clt !== null) {
                    cot_hr = p[i].ot_hr_clt
                }
                if (p[i].holiday_hr_clt !== null) {
                    ch_hr = p[i].holiday_hr_clt
                }
                if (p[i].invoice_amt_clt !== null && isNaN(p[i].invoice_amt_clt) === false) {
                    cinv_amount = p[i].invoice_amt_clt
                } else {
                    cinv_amount = 0
                }

                var rec_name = ''
                if (p[i].rec_mname === null) {
                    recname = p[i].rec_fname + " " + p[i].rec_lname
                } else {
                    rec_name = p[i].rec_fname + " " + p[i].rec_mname + " " + p[i].rec_lname
                }


                data = data +
                    p[i].wk_start_date + "-" + p[i].wk_end_date +
                    "\t" +
                    rec_name +
                    "\t" +
                    rbill_rate +
                    "\t" +
                    otbill_rate +
                    "\t" +
                    hbill_rate +
                    "\t" +
                    r_hr +
                    "\t" +
                    o_hr +
                    "\t" +
                    h_hr +
                    "\t" +
                    parseFloat(inv_amount).toFixed(2) +
                    "\t" +
                    parseFloat(dinv_amount).toFixed(2) +
                    "\t" +
                    creg_hr +
                    "\t" +
                    cot_hr +
                    "\t" +
                    ch_hr +
                    "\t" +
                    parseFloat(cinv_amount).toFixed(2) +
                    "\t" +
                    parseFloat(cinv_amount - inv_amount) +
                    "\n"


            }
            var data2 = JSON.stringify(data);


            async function excle() {
                var get = await generateExcelInvoiceReconDatabyAccID(data1, data2);
                ///var dddd=send(datask);
                // //console.log('aaaa');
                // //console.log(datask);
                res.sendFile(get);
            }
            excle();


        } catch (err) {
            //console.log(err);
            res.json(err)
        }
    }
    apps();
    // } else {
    // res.status(401).json("token is not valid");
    // }
});
function getPayrollRecondataByAccFIDSingle(aid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT a.*,
        w.*,
        af.file_no,
        b.inv_recon_id ,  
        b.month,          
        b.year ,   
        b.reg_hr_clt,     
        b.ot_hr_clt,      
        b.holiday_hr_clt, 
        b.invoice_amt_clt,
        b.recon_status, 
        c.*,
        cl.*,
        d.user_first_name as rec_fname, d.user_middle_name as rec_mname, d.user_last_name as rec_lname,
        f.*,
        j.job_no
        from tbl_payroll_invoice AS a 
        INNER JOIN tbl_week AS w ON w.week_id=a.week_id
        INNER JOIN tbl_account_file AS af ON af.acc_file_id=a.acc_file_id 
        INNER JOIN tbl_invoice_recon AS b ON a.rec_payroll_id=b.rec_payroll_id AND a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_recruitee AS c ON c.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS d ON d.user_id=c.user_id
        INNER JOIN tbl_assignment As e ON e.assignment_id=a.assignment_id
        INNeR JOIN tbl_job as j on j.job_id=e.job_id
        INNER JOIN tbl_client AS cl ON cl.client_id=e.client_id
        INNER JOIN tbl_onboarding AS f ON f.onboarding_id=e.onboarding_id

        WHERE a.acc_file_id=${aid}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function generateExcelInvoiceReconDatabyAccID(data, data2) {
    return new Promise(function (resolve, reject) {

        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var wb = new xls.Workbook();
        var ws = wb.addWorksheet("Sheet 1");
        var style = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 14
            },
            alignment: {
                wrapText: true
                //horizontal: 'center',
            }
        });
        var style1 = wb.createStyle({
            font: {
                color: "#000000",
                bold: true,
                //underline: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "center",
                vertical: "center"
            },
            outline: {
                summaryBelow: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style2 = wb.createStyle({
            alignment: {
                wrapText: true,
                horizontal: "center",
                shrinkToFit: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style3 = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "left"
            }
        });

        ws.column(1).setWidth(3);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(15);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(15);
        ws.column(12).setWidth(15);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(15);
        ws.column(15).setWidth(15);
        ws.column(16).setWidth(15);
        ws.column(17).setWidth(15);
        ws.column(18).setWidth(15);
        ws.cell(1, 1, 1, 7, true)
            .string("Invoice Recon Report")
            .style(style);
        ws.cell(3, 1, 3, 7, true)
            .string("Client                : " + data.client)
            .style(style3);

        ws.cell(4, 1, 4, 12, true)
            .string("Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY"))
            .style(style3);
        ws.cell(5, 1, 5, 12, true)
            .string("Created By     : " + data.created_by)
            .style(style3)

        ws.cell(7, 1)
            .string("#")
            .style(style1);
        ws.cell(7, 2)
            .string("Week")
            .style(style1);
        ws.cell(7, 3)
            .string("Recruiter Name")
            .style(style1);
        ws.cell(7, 4)
            .string("Reg Bill Rate")
            .style(style1);
        ws.cell(7, 5)
            .string("OT Bill Rate")
            .style(style1);
        ws.cell(7, 6)
            .string("Holiday Bill Rate")
            .style(style1);
        ws.cell(7, 7)
            .string("Reg Hr")
            .style(style1);
        ws.cell(7, 8)
            .string("OT Hr")
            .style(style1);
        ws.cell(7, 9)
            .string("Holiday Hr")
            .style(style1);
        ws.cell(7, 10)
            .string("Invoice")
            .style(style1);
        ws.cell(7, 11)
            .string("Invoice(Ded)")
            .style(style1);
        ws.cell(7, 12)
            .string("Reg Hr(c)")
            .style(style1);
        ws.cell(7, 13)
            .string("OT Hr(c)")
            .style(style1);
        ws.cell(7, 14)
            .string("Holiday Hr(c)")
            .style(style1);
        ws.cell(7, 15)
            .string("Invoice(c)")
            .style(style1);
        ws.cell(7, 16)
            .string("Difference")
            .style(style1);


        ws.cell(8, 1)
            .number(1)
            .style(style2);

        var row = 8;
        var col = 1;
        var key = "";
        var count = 1;
        for (var i = 1; i < data2.length - 1; i++) {
            if (data2[i] == "\\" && data2[i + 1] == "t") {
                col = col + 1;

                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                key = "";
                i++;
            } else if (data2[i] == "\\" && data2[i + 1] == "n") {
                col = col + 1;
                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                row = row + 1;
                count = count + 1;
                ////console.log(count);
                /// //console.log(data2[i+2]);
                if (data2[i + 2] == '"') {
                    break;
                } else {
                    ws.cell(row, 1)
                        .number(count)
                        .style(style2);
                }
                key = "";
                col = 1;
                i++;
            } else {
                var key = key + data2[i];
                ////console.log("in else condittion");
                ////console.log(key);
            }
        }
        wb.write(`/home/ubuntu/vcs/excle_file/income_recon${data.year}${data.month}${data.created_by}.xlsx`, function (err) {
            if (err) resolve("err");
            else resolve(`/home/ubuntu/vcs/excle_file/income_recon${data.year}${data.month}${data.created_by}.xlsx`);

        });
    });
}
app.post("/vcsapi/insert/payroll_recon/data", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let count = 0;
                let checkaccountfile = await checkAccFile(req.body.data[0].acc_file_id);
                if (checkaccountfile.length) {
                    for (let i = 0; i < req.body.data.length; i++) {
                        let p1 = await updatePayrollRecondata(req.body.data[i]);
                        if (p1 === "success") {
                            count++;
                        }
                    }
                    if (count === req.body.data.length) {
                        res.json("success");
                    }
                    else {
                        res.json("Error While updating data.")
                    }
                }
                else {
                    for (let i = 0; i < req.body.data.length; i++) {
                        let p1 = await insertPayrollRecondata(req.body.data[i]);
                        if (p1 === "success") {
                            count++;
                        }
                    }
                    if (count === req.body.data.length) {
                        res.json("success");
                    }
                    else {
                        res.json("Error While inserting data.")
                    }
                }


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function checkAccFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_invoice_recon 
        WHERE acc_file_id='${data}'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function insertPayrollRecondata(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_invoice_recon set ?`;
        let post = {
            rec_payroll_id: data.rec_payroll_id,
            recruitee_id: data.recruitee_id,
            week_id: data.week_id,
            assignment_id: data.assignment_id,
            month: data.month,
            year: data.year,
            acc_file_id: data.acc_file_id,
            reg_hr_clt: data.reg_hr_clt,
            ot_hr_clt: data.ot_hr_clt,
            holiday_hr_clt: data.holiday_hr_clt,
            invoice_amt_clt: data.invoice_amt_clt,
            recon_status: "done"
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
function updatePayrollRecondata(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `UPDATE tbl_invoice_recon set ? where inv_recon_id='${data.inv_recon_id}'`;
        let post = {
            reg_hr_clt: data.reg_hr_clt,
            ot_hr_clt: data.ot_hr_clt,
            holiday_hr_clt: data.holiday_hr_clt,
            invoice_amt_clt: data.invoice_amt_clt
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/get/invoice_recon/Byaccountfile", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let str = "";
                if (req.body.week_id !== "ALL") {
                    str = ` AND a.week_id='${req.body.week_id}'`;
                }
                if (req.body.client_id !== "ALL") {

                    str = str + ` AND b.client_id="${req.body.client_id}"`;

                }
                if (req.body.month !== "ALL") {

                    str = str + ` AND a.month="${req.body.month}"`;

                }
                if (req.body.year !== "ALL") {

                    str = str + ` AND a.year="${req.body.year}"`;

                }

                let p = await getAccountFileUnique(str);
                if (p.length > 0) {
                    for (i in p) {
                        let getRecon = await getReconData(p[i].rec_payroll_id);
                        if (getRecon.length) {
                            p[i]["recon_status"] = getRecon[0].recon_status;
                        }
                        else {
                            p[i]["recon_status"] = "";
                        }
                        let wks = await getPayrollRecondataByAccFID(p[i].acc_file_id);
                        p[i]["payroll_and_reconcile_data"] = wks;
                    }
                }
                res.json(p);


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
function getReconData(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_invoice_recon 
        WHERE rec_payroll_id='${data}'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getPayrollRecondataByAccFID(aid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT a.*,
        b.inv_recon_id ,  
        b.month,          
        b.year ,   
        b.reg_hr_clt,     
        b.ot_hr_clt,      
        b.holiday_hr_clt, 
        b.invoice_amt_clt,
        b.recon_status, d.*,f.job_no
        from tbl_payroll_invoice AS a 
        LEFT JOIN tbl_invoice_recon AS b ON a.rec_payroll_id=b.rec_payroll_id AND a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_recruitee AS c ON c.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS d ON d.user_id=c.user_id
        INNER JOIN tbl_assignment As e ON e.assignment_id=a.assignment_id
        INNER JOIN tbl_job AS f ON f.job_id=e.job_id
        WHERE a.acc_file_id=${aid}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getAccountFileUnique(str) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct a.rec_payroll_id,a.month,a.year,c.client_id,a.week_id,c.client_name,b.file_no,e.wk_start_date,e.wk_end_date,a.acc_file_id
        from tbl_payroll_invoice AS a 
        INNER JOIN tbl_account_file AS b ON b.acc_file_id=a.acc_file_id 
        INNER JOIN tbl_client AS c ON c.client_id=b.client_id 
        INNER JOIN tbl_week AS e ON e.week_id=a.week_id WHERE b.approval_status="approved"  ${str}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.get("/vcsapi/generate/excle/invoice_recon/:client_id/:user_id/:from_date/:to_date/:name", function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
        try {
            let fd = moment(new Date(req.params.from_date)).format("MM/DD/YYYY");
            let td = moment(new Date(req.params.to_date)).format("MM/DD/YYYY");
            let gc = await getClientName(req.params.client_id)
            let p = await getallinvoiceRecondata(req.params.client_id, fd, td);
            var getname = await getUsername(req.params.user_id);
            let user_name = ""
            if (getname[0].user_middle_name === null) {
                user_name = getname[0].user_first_name + " " + getname[0].user_last_name
            } else {
                user_name = getname[0].user_first_name + " " + getname[0].user_middle_name + " " + getname[0].user_last_name
            }
            var data1 = {
                created_by: user_name,
                client: gc[0].client_name,
                start_date: fd,
                end_date: td

            }
            // //console.log(p)

            // if(p.length>0){
            var data = '';
            for (i in p) {
                let rbill_rate = ''
                let otbill_rate = ''
                let hbill_rate = ''
                let r_hr = ''
                let o_hr = ''
                let h_hr = ''
                let inv_amount = 0
                let dinv_amount = 0
                let creg_hr = ''
                let cot_hr = ''
                let ch_hr = ''
                let cinv_amount = 0
                if (p[i].onb_regular_bill_rate !== null) {
                    rbill_rate = p[i].onb_regular_bill_rate
                }
                if (p[i].onb_ot_bill_rate !== null) {
                    otbill_rate = p[i].onb_ot_bill_rate
                }
                if (p[i].onb_holiday_bill_rate !== null) {
                    hbill_rate = p[i].onb_holiday_bill_rate
                }
                if (p[i].reg_hr !== null) {
                    r_hr = p[i].reg_hr
                }
                if (p[i].ot_hr !== null) {
                    o_hr = p[i].ot_hr
                }
                if (p[i].holiday_hr !== null) {
                    h_hr = p[i].holiday_hr
                }
                if (p[i].invoice_amt !== null) {
                    inv_amount = p[i].invoice_amt
                }
                if (p[i].deducted_invoice_amt !== null) {
                    dinv_amount = p[i].deducted_invoice_amt
                }
                if (p[i].reg_hr_clt !== null) {
                    creg_hr = p[i].reg_hr_clt
                }
                if (p[i].ot_hr_clt !== null) {
                    cot_hr = p[i].ot_hr_clt
                }
                if (p[i].holiday_hr_clt !== null) {
                    ch_hr = p[i].holiday_hr_clt
                }
                if (p[i].invoice_amt_clt !== null) {
                    cinv_amount = p[i].invoice_amt_clt
                }
                let rec_name = ''
                if (p[i].user_middle_name === null || p[i].user_middle_name === '') {
                    rec_name = p[i].user_first_name + " " + p[i].user_last_name
                } else {
                    rec_name = p[i].user_first_name + " " + p[i].user_middle_name + " " + p[i].user_last_name
                }



                data = data +
                    p[i].wk_start_date + "-" + p[i].wk_end_date +
                    "\t" +
                    rec_name +
                    "\t" +
                    rbill_rate +
                    "\t" +
                    otbill_rate +
                    "\t" +
                    hbill_rate +
                    "\t" +
                    r_hr +
                    "\t" +
                    o_hr +
                    "\t" +
                    h_hr +
                    "\t" +
                    inv_amount +
                    "\t" +
                    dinv_amount +
                    "\t" +
                    creg_hr +
                    "\t" +
                    cot_hr +
                    "\t" +
                    ch_hr +
                    "\t" +
                    cinv_amount +
                    "\t" +
                    parseFloat(cinv_amount - inv_amount) +
                    "\n"


            }
            var data2 = JSON.stringify(data);

            //console.log(data2)
            async function excle() {
                var get = await generateExcelInvoiceReconData(data1, data2);
                ///var dddd=send(datask);
                // //console.log('aaaa');
                // //console.log(datask);
                res.sendFile(get);
            }
            excle();
            //    }else{
            //        res.json("no data")
            //    }


        } catch (err) {
            //console.log(err);
            res.json(err)
        }
    }
    apps();
    // } else {
    //     res.status(401).json("token is not valid");
    // }
});
function getallinvoiceRecondata(c_id, fd, td) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT *
        from tbl_payroll_invoice AS a 
        INNER JOIN tbl_invoice_recon AS b ON a.rec_payroll_id=b.rec_payroll_id AND a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_recruitee AS c ON c.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS d ON d.user_id=c.user_id
        INNER JOIN tbl_assignment As e ON e.assignment_id=a.assignment_id
        INNER JOIN tbl_onboarding AS f ON f.onboarding_id=e.onboarding_id
        INNER JOIN tbl_account_file AS g ON g.acc_file_id=b.acc_file_id
        INNER JOIN tbl_client AS h ON h.client_id=g.client_id
        INNER JOIN tbl_week AS i ON i.week_id=b.week_id
        WHERE h.client_id='${c_id}' AND i.wk_start_date >= '${fd}' AND i.wk_end_date<='${td}'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function generateExcelInvoiceReconData(data, data2) {
    return new Promise(function (resolve, reject) {

        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var wb = new xls.Workbook();
        var ws = wb.addWorksheet("Sheet 1");
        var style = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 14
            },
            alignment: {
                wrapText: true
                //horizontal: 'center',
            }
        });
        var style1 = wb.createStyle({
            font: {
                color: "#000000",
                bold: true,
                //underline: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "center",
                vertical: "center"
            },
            outline: {
                summaryBelow: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style2 = wb.createStyle({
            alignment: {
                wrapText: true,
                horizontal: "center",
                shrinkToFit: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style3 = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "left"
            }
        });

        ws.column(1).setWidth(3);
        ws.column(2).setWidth(30);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(15);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(15);
        ws.column(12).setWidth(15);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(15);
        ws.column(15).setWidth(15);
        ws.column(16).setWidth(15);
        ws.column(17).setWidth(15);
        ws.column(18).setWidth(15);
        ws.cell(1, 1, 1, 7, true)
            .string("Invoice Recon Report")
            .style(style);
        ws.cell(3, 1, 3, 7, true)
            .string("Client                : " + data.client)
            .style(style3);

        ws.cell(4, 1, 4, 12, true)
            .string("Start Date        : " + data.start_date)
            .style(style3);
        ws.cell(5, 1, 5, 12, true)
            .string("End Date         : " + data.end_date)
            .style(style3);

        ws.cell(6, 1, 6, 12, true)
            .string("Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY"))
            .style(style3);
        ws.cell(7, 1, 7, 12, true)
            .string("Created By     : " + data.created_by)
            .style(style3)

        ws.cell(9, 1)
            .string("#")
            .style(style1);
        ws.cell(9, 2)
            .string("Week")
            .style(style1);
        ws.cell(9, 3)
            .string("Recruiter Name")
            .style(style1);
        ws.cell(9, 4)
            .string("Reg Bill Rate")
            .style(style1);
        ws.cell(9, 5)
            .string("OT Bill Rate")
            .style(style1);
        ws.cell(9, 6)
            .string("Holiday Bill Rate")
            .style(style1);
        ws.cell(9, 7)
            .string("Reg Hr")
            .style(style1);
        ws.cell(9, 8)
            .string("OT Hr")
            .style(style1);
        ws.cell(9, 9)
            .string("Holiday Hr")
            .style(style1);
        ws.cell(9, 10)
            .string("Invoice")
            .style(style1);
        ws.cell(9, 11)
            .string("Invoice(Ded)")
            .style(style1);
        ws.cell(9, 12)
            .string("Reg Hr(c)")
            .style(style1);
        ws.cell(9, 13)
            .string("OT Hr(c)")
            .style(style1);
        ws.cell(9, 14)
            .string("Holiday Hr(c)")
            .style(style1);
        ws.cell(9, 15)
            .string("Invoice(c)")
            .style(style1);
        ws.cell(9, 16)
            .string("Difference")
            .style(style1);


        ws.cell(10, 1)
            .number(1)
            .style(style2);

        var row = 10;
        var col = 1;
        var key = "";
        var count = 1;
        for (var i = 1; i < data2.length - 1; i++) {
            if (data2[i] == "\\" && data2[i + 1] == "t") {
                col = col + 1;

                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                key = "";
                i++;
            } else if (data2[i] == "\\" && data2[i + 1] == "n") {
                col = col + 1;
                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                row = row + 1;
                count = count + 1;
                ////console.log(count);
                /// //console.log(data2[i+2]);
                if (data2[i + 2] == '"') {
                    break;
                } else {
                    ws.cell(row, 1)
                        .number(count)
                        .style(style2);
                }
                key = "";
                col = 1;
                i++;
            } else {
                var key = key + data2[i];
                ////console.log("in else condittion");
                ////console.log(key);
            }
        }
        wb.write(`/home/ubuntu/vcs/excle_file/income_recon${data.year}${data.month}${data.created_by}.xlsx`, function (err) {
            if (err) resolve("err");
            else resolve(`/home/ubuntu/vcs/excle_file/income_recon${data.year}${data.month}${data.created_by}.xlsx`);

        });
    });
}

app.get("/vcsapi/get/api/allrecruiteedetails/:user", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let p1 = await getAlRecruiteeDetails(req.params.user);
                if (p1.length > 0) {
                    res.json(p1)
                } else {
                    res.json("user not exists")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAlRecruiteeDetails(data) {
    return new Promise(function (resolve, reject) {
        // //console.log(" rec insert")
        let sql = `select * from tbl_user u 
        inner join tbl_recruitee r on r.user_id=u.user_id
        inner join tbl_recruitee_details rd on rd.recruitee_id=r.recruitee_id
        LEFT JOIN tbl_profession AS h ON h.profession_id=rd.profession
        LEFT JOIN tbl_speciality AS i ON i.speciality_id=rd.speciality
        where u.user_id=${data} `;

        db.query(sql, function (err, res) {
            if (err) {
                // //console.log(sql);
                reject(err)
            } else {
                // //console.log("after insert rec")
                resolve(res);
            }
        })
    })
}



app.post("/vcsapi/update/api/rec_details/and/recudetails", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let p1 = await checkUserStatus(req.body.user_id);
                if (p1.length > 0) {
                    let uu1 = await updateUserRecDetls(req.body.user_id, req.body)
                    if (uu1 === "success") {
                        let rid = await getRecruitee(req.body.user_id);
                        if (rid.length > 0) {
                            //console.log(rid[0].recruitee_id)
                            let p2 = await updateAllRecDetails(rid[0].recruitee_id, req.body);
                            if (p2 === "success") {
                                //console.log(p2)
                                res.json(p2)
                            }
                        } else {
                            res.json("userdata of recruitee not updated")
                        }
                    }
                } else {
                    res.json("user not exists")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateAllRecDetails(recID, data) {
    return new Promise(function (resolve, reject) {
        //console.log(" rec insert")
        let sql = `update tbl_recruitee_details set ? where recruitee_id=${recID} `;
        let post = {
            employement_preference: data.employement_preference,
            current_location: data.current_location,
            dob: data.dob,
            profession: data.profession,
            speciality: data.speciality,
            desired_location_1: data.desired_location_1,
            desired_location_2: data.desired_location_2,
            ssn_4digit: data.ssn_4digit

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(sql);
                reject(err)
            } else {
                //console.log("after insert rec")
                resolve("success");
            }
        })
    })
}

function updateUserRecDetls(UID, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_user set ? where user_id=${UID} `;
        let post = {
            user_first_name: data.user_first_name,
            user_middle_name: data.user_middle_name,
            user_last_name: data.user_last_name,
            email: data.email,
            phone: data.phone
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/rec_detailsandudetails", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let p1 = await checkUserStatus(req.body.user_id);
                if (p1.length > 0) {
                    let uu1 = await updateRecDetls(req.body.user_id, req.body)
                    if (uu1 === "success") {

                        res.json(uu1)

                    }
                } else {
                    res.json("user not exists")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateRecDetails(recID, data) {
    return new Promise(function (resolve, reject) {
        //console.log(" rec insert")
        let sql = `update tbl_recruitee_details set ? where recruitee_id=${recID} `;
        let post = {
            employement_preference: data.employement_preference,
            current_location: data.current_location
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(sql);
                reject(err)
            } else {
                //console.log("after insert rec")
                resolve("success");
            }
        })
    })
}

function updateRecDetls(UID, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_user set ? where user_id=${UID} `;
        let post = {
            user_first_name: data.user_first_name,
            user_middle_name: data.user_middle_name,
            user_last_name: data.user_last_name,
            email: data.email,
            phone: data.phone
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/get/api/rec_work_hr/by/assignmentID/week_id/recruiteeID", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                // let p1 = await getRecruitee(req.body.user_id);
                // if (p1.length > 0) {
                let p2 = await getRECworkHR(req.body);
                // if (p2.length > 0) {
                res.json(p2)
                // }
                // }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getRECworkHR(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_rec_work_hr where recruitee_id=${data.recruitee_id} and assignment_id=${data.assignment_id} and week_id=${data.week_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/insert/api/canditate/skillset_map/data", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let uid = 0;
                let errorCount = 0;
                let checkifExists = await checkEmail(req.body.candidateData.email);
                if (checkifExists.length > 0) {
                    uid = checkifExists[0].user_id
                }

                let checkifExistsCandidate = await checkEmailCandidate(req.body.candidateData.email);
                if (checkifExistsCandidate.length > 0) {
                    let p1 = await updateCandidateData(req.body.candidateData, checkifExistsCandidate[0].candidate_id, uid);
                    if (p1 === "success") {
                        var p2 = await checkEmailCandidate(req.body.candidateData.email);

                    }
                }
                else {



                    let p1 = await insertCandidateData(req.body.candidateData, uid);
                    if (p1 === "success") {
                        var p2 = await getCandidateLatest();

                    }

                }
                let count = 0;
                let count1 = 0;

                if (p2.length > 0) {
                    let checkSkillSet = await checkSkillSetMap(p2[0].candidate_id);
                    if (checkSkillSet.length) {
                        for (let i = 0; i < req.body.domainData.length; i++) {
                            let checkDomainCategoryUnique = await checkDomainUnique(req.body.domainData[i], p2[0].candidate_id);
                            console.log(checkDomainCategoryUnique)
                            if (checkDomainCategoryUnique.length) {
                                for (let j = 0; j < req.body.domainData[i]["skillset"].length; j++) {
                                    let ss = req.body.domainData[i]["skillset"][j]


                                    var p3 = await updateskillsetMap(p2[0].candidate_id, ss);
                                    if (p3 === "success") {
                                        count++;
                                    }
                                    count1++;




                                }
                            }
                            else {
                                //errorCount++;
                                for (let i = 0; i < req.body.domainData.length; i++) {
                                    for (let j = 0; j < req.body.domainData[i]["skillset"].length; j++) {
                                        let ss = req.body.domainData[i]["skillset"][j]


                                        var p3 = await insertskillsetMap(p2[0].candidate_id, ss);
                                        if (p3 === "success") {
                                            count++;
                                        }
                                        count1++;




                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < req.body.domainData.length; i++) {
                            for (let j = 0; j < req.body.domainData[i]["skillset"].length; j++) {
                                let ss = req.body.domainData[i]["skillset"][j]


                                var p3 = await insertskillsetMap(p2[0].candidate_id, ss);
                                if (p3 === "success") {
                                    count++;
                                }
                                count1++;




                            }
                        }
                    }



                }

                //if (errorCount === 0) {
                if (count === count1) {
                    res.json("success");
                }
                else {
                    res.json("ERROR");
                }
                //}
                // else {
                //     res.json("not_allowed");
                // }





            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function insertCandidateData(data, uid) {
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let sql = `insert into tbl_candidate set ?`;
        let post = {
            user_id: uid,
            candidate_name: data.name,
            candidate_email: data.email,
            // candidate_phone: data.phone_no,
            candidate_status: "active",
            created_on: moment(new Date(strTime)).format("MM/DD/YYYY"),
            edit_date: moment(new Date(data.edit_date)).format("MM/DD/YYYY")
        };
        db.query(sql, post, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function updateCandidateData(data, id, uid) {
    return new Promise(function (resolve, reject) {

        let sql = `update tbl_candidate set ? where candidate_id=${id}`;
        let post = {
            user_id: uid,
            candidate_name: data.name,
            candidate_email: data.email,
            candidate_phone: data.phone_no,
            edit_date: moment(new Date(data.edit_date)).format("MM/DD/YYYY")
        };
        db.query(sql, post, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function getCandidateLatest() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_candidate order by candidate_id desc limit 1`;
        db.query(sql, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function checkSkillSetMap(id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_skillset_map where candidate_id=${id}`;
        db.query(sql, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function checkDomainUnique(data, id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id
        where a.candidate_id=${id} and c.skill_area_id=${data.skill_area_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function insertskillsetMap(cID, data) {
    //console.log(data)
    return new Promise(function (resolve, reject) {
        //console.log("insert",data)
        let currTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let date_of_completion = data.date_of_completion;
        if (data.skillset_rate === 0) {
            date_of_completion = null;
        }
        else if (data.skillset_rate !== 0 && data.date_of_completion === undefined) {

            date_of_completion = moment(new Date(currTime)).format("MM/DD/YYYY");

        }
        let sql = `insert into tbl_skillset_map set ?`;
        let post = {
            candidate_id: cID,
            skillset_id: data.skillset_id,
            skillset_rate: data.skillset_rate,
            date_of_completion: date_of_completion
        };
        db.query(sql, post, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
function updateskillsetMap(cID, data) {

    return new Promise(function (resolve, reject) {
        //console.log("up",data.date_of_completion,data.skillset_rate);
        let currTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let date_of_completion = data.date_of_completion;
        if (data.skillset_rate === 0) {
            date_of_completion = null;
        }
        else if (data.skillset_rate !== 0 && data.date_of_completion === undefined) {

            date_of_completion = moment(new Date(currTime)).format("MM/DD/YYYY");

        }
        let sql = `update tbl_skillset_map set ? where candidate_id=${cID} AND skillset_id=${data.skillset_id}`;
        let post = {
            skillset_rate: data.skillset_rate,
            date_of_completion: date_of_completion
        };
        db.query(sql, post, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/send/email", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let eml = await sendContactUsEmail(req.body.name, req.body.message);
                res.json(eml)
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function sendContactUsEmail(name, message) {
    /////// email generate
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'registration@vishusa.com',
                pass: 'registrationVCS#2022'
            }
        });
        var mailOptions = {
            from: 'registration@vishusa.com',
            to: 'chinmayeerout1995@gmail.com',
            subject: `Contact Us`,
            html: `Hi "${name}",<br/>Welcome!!!<br/>
            ${message}
            `
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                resolve("success");
            } else {
                //console.log(error)
                reject(error);
            }
        });
    });
}
app.get("/vcsapi/get/api/skill_area/byall/activecatID", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                var p1 = await getActiveSkilCategory();
                // //console.log(p1);
                if (p1.length > 0) {
                    for (i in p1) {
                        var p2 = await getSkillAreaByCatID(p1[i].skill_category_id);
                        // //console.log(p2)
                        if (p2.length > 0) {
                            p1[i]["skillArea"] = p2;
                        }

                    }
                    // //console.log(data)


                }
                res.json(p1)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getActiveSkilCategory() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_skill_category where skill_category_status="active"`;
        db.query(sql, function (err, res) {
            if (err) {
                // //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getSkillAreaByCatID(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_skill_area
        WHERE skill_category_id=${data} AND skill_area_status='active'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/get/api/skill_domain/skillset/by/skill_area_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                var sdomain = await getSkillDomainBySkillAreaID(req.body.skill_area_id);
                if (sdomain.length > 0) {
                    for (i in sdomain) {
                        var p = await getSkillSetByDomainID(sdomain[i].skill_domain_id);
                        if (p.length > 0) {
                            sdomain[i]["skillset"] = p;
                            for (j in p) {
                                if (req.body.user_id !== "N") {
                                    var q = await getSkillRate(p[j].skillset_id, req.body.user_id);
                                    //console.log(q);
                                    if (q.length) {
                                        p[j]["date_of_completion"] = q[0].date_of_completion;
                                        p[j]["skillset_rate"] = q[0].skillset_rate;
                                    } else {
                                        p[j]["date_of_completion"] = undefined;
                                        p[j]["skillset_rate"] = 0;
                                    }
                                } else {
                                    p[j]["date_of_completion"] = undefined;
                                    p[j]["skillset_rate"] = 0;

                                }
                            }


                        }
                    }
                    res.json(sdomain)
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getSkillDomainBySkillAreaID(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_skill_area AS a INNER JOIN tbl_skill_domain AS b ON a.skill_area_id=b.skill_area_id
        WHERE b.skill_area_id=${data} and skill_domain_status="active"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getSkillRate(data, user) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")

        let sql = `SELECT * 
        FROM tbl_candidate AS a INNER JOIN tbl_skillset_map As b ON b.candidate_id=a.candidate_id
        WHERE b.skillset_id=${data} and a.user_id='${user}'`;
        db.query(sql, function (err, res) {
            //console.log(sql)
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getSkillSetByDomainID(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_skillset
        WHERE skill_domain_id=${data} AND skillset_status='active'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.post('/vcsapi/api/updateOrInsert/registration/user/application/guest/:exist/:user_id', function (req, res) {
    async function apps() {
        //console.log(req.body)
        var email = req.body.email.trim().replace(/\s/g, "");
        // var mbl_no = req.body.phone.trim().replace(/\s/g, "");
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (var i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * 40));
        }
        //console.log(result);
        const saltRounds = 10;
        const hashedPassword = await new Promise((resolve, reject) => {
            bcryptjs.hash("" + result + "", saltRounds, function (err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        });
        let user_ids = [];
        let checkifExists = await checkEmail(email);
        if (checkifExists.length) {
            //console.log(checkifExists);
            if (req.params.exist === "NO") {
                // let insertUser = await adduserGuest(req.body, email.toLowerCase(), mbl_no, hashedPassword);
                // if (insertUser === "success") {
                //     let getUser = await getLatestUser();
                //     if (getUser.length > 0) {
                //         let latestRecruitee1 = await getLatestRecruitee();
                //         let addrecruitee = await adduserRecruiteeGuest(getUser[0].user_id,latestRecruitee1);
                //         if (addrecruitee === "success") {
                //             let latestRecruitee = await getLatestRecruitee();
                //             let recruiteedetails = await adduserRecruiteeDetailsGuest(req.body, latestRecruitee[0].recruitee_id);
                //             if (recruiteedetails === "success") {
                //                 let rid = await getRecruitee(getUser[0].user_id);
                //                 // //console.log(rid)
                //                 if (rid.length > 0) {

                //                         // let sendCreds = await sendCredsbyEmail(getUser[0],result);
                //                         // if(sendCreds==="success"){
                //                             res.json({
                //                                 message: "success",
                //                                 session: req.session.email,
                //                                 user_details: getUser[0],
                //                                 recruitee:latestRecruitee[0].recruitee_id

                //                             });
                //                         // }   

                //                     // } else {
                //                     //     res.json("error");
                //                     // }
                //                 } else {
                //                     res.json("recruitee_id not found");
                //                 }

                //             }

                //         }

                //     }
                // } else {
                //     res.json("ERROR");
                // }
                res.json("upload resume first")
            } else {


                if (req.body.user_exist === "YES") {
                    let userid = await checkUserByID(req.params.user_id);
                    if (userid[0].user_status === "deleted") {
                        let statusUser = await updateRecruitStatus(userid[0]);
                    }
                    let rid = await getRecruitee(req.params.user_id);
                    if (rid.length) {

                        let getLatestApplication_ = await getLatestApplication();
                        let add_appication = await addApplication(req.body, rid[0].recruitee_id, getLatestApplication_);
                        if (add_appication === "success") {
                            let getLApplication = await getLatestApplication();
                            let getAdID = await getAdminID();
                            let get_job_post_by = await getJobpostby(req.body.job_id);
                            if (get_job_post_by.length > 0) {
                                let supervisor = await getSupervisor(get_job_post_by[0].job_post_by);
                                if (supervisor.length > 0 && supervisor[0].supervisor_name) {
                                    let supervisor2 = await getSupervisor(supervisor[0].supervisor_name);
                                    if (supervisor2.length > 0 && supervisor2[0].supervisor_name) {
                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: supervisor[0].supervisor_name,
                                            manager_id: supervisor2[0].supervisor_name,
                                            admin_id: getAdID[0].user_id
                                        }

                                        user_ids = [
                                            { user_id: get_job_post_by[0].job_post_by },
                                            { user_id: supervisor[0].supervisor_name },
                                            { user_id: supervisor2[0].supervisor_name },
                                            { user_id: getAdID[0].user_id }
                                        ]
                                    } else {

                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: supervisor[0].supervisor_name,
                                            manager_id: getAdID[0].user_id,
                                            admin_id: getAdID[0].user_id
                                        }

                                        user_ids = [
                                            { user_id: get_job_post_by[0].job_post_by },
                                            { user_id: supervisor[0].supervisor_name },
                                            { user_id: getAdID[0].user_id },
                                            { user_id: getAdID[0].user_id }
                                        ]
                                    }
                                } else {

                                    var j = {
                                        recruiter_id: get_job_post_by[0].job_post_by,
                                        team_lead_id: getAdID[0].user_id,
                                        manager_id: getAdID[0].user_id,
                                        admin_id: getAdID[0].user_id
                                    }

                                    user_ids = [
                                        { user_id: get_job_post_by[0].job_post_by },
                                        { user_id: getAdID[0].user_id },
                                        { user_id: getAdID[0].user_id },
                                        { user_id: getAdID[0].user_id }
                                    ]
                                }

                            }
                            //console.log("JJJJJJ",j);
                            for (let k = 0; k < user_ids.length; k++) {
                                var userRoleId = await getRoleOfEmployee(user_ids[k].user_id);
                                console.log(userRoleId, user_ids[k].user_id)
                                var addIncen_perc = await updateAssignManagerIncentiveTable(user_ids[k].user_id, rid[0].recruitee_id, getLApplication[0].application_id, userRoleId);
                            }
                            let addasgn_mgr = await updateAssignManagerTable(req.body, rid[0].recruitee_id, getLApplication[0].application_id, j);

                            //console.log(addasgn_mgr)
                            if (addasgn_mgr === "success") {
                                // let sendCreds = await sendCredsbyEmailGuest(userid[0], "" + result + "");
                                // if (sendCreds === "success") {

                                res.json({
                                    message: "success",
                                    session: req.session.email,
                                    user_details: userid[0],
                                    recruitee: rid[0].recruitee_id

                                });

                            } else {
                                res.json("failed to update assign manager")
                            }


                        } else {
                            res.json("ERROR")
                        }


                    } else {
                        res.json("ERROR")
                    }
                }
                else {
                    let updateUser = await updateuserGuest(req.body, req.body.phone, email, req.params.user_id, hashedPassword);
                    if (updateUser === "success") {
                        let role = await getRolebyrole_name();
                        if (role.length) {
                            let get_action_id = await getActionId(role[0].role_id);
                            let insert_role_access = await INSERTINLOOP(get_action_id, req.params.user_id);
                        }

                        let userid = await checkUserStatus(req.params.user_id);
                        let rid = await getRecruitee(req.params.user_id);
                        if (rid.length) {

                            let getLatestApplication_ = await getLatestApplication();
                            let add_appication = await addApplication(req.body, rid[0].recruitee_id, getLatestApplication_);
                            if (add_appication === "success") {
                                let getLApplication = await getLatestApplication();
                                let getAdID = await getAdminID();
                                let get_job_post_by = await getJobpostby(req.body.job_id);
                                if (get_job_post_by.length > 0) {
                                    let supervisor = await getSupervisor(get_job_post_by[0].job_post_by);
                                    if (supervisor.length > 0 && supervisor[0].supervisor_name) {
                                        let supervisor2 = await getSupervisor(supervisor[0].supervisor_name);
                                        if (supervisor2.length > 0 && supervisor2[0].supervisor_name) {
                                            var j = {
                                                recruiter_id: get_job_post_by[0].job_post_by,
                                                team_lead_id: supervisor[0].supervisor_name,
                                                manager_id: supervisor2[0].supervisor_name,
                                                admin_id: getAdID[0].user_id
                                            }
                                        } else {

                                            var j = {
                                                recruiter_id: get_job_post_by[0].job_post_by,
                                                team_lead_id: supervisor[0].supervisor_name,
                                                manager_id: getAdID[0].user_id,
                                                admin_id: getAdID[0].user_id
                                            }
                                        }
                                    } else {

                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: getAdID[0].user_id,
                                            manager_id: getAdID[0].user_id,
                                            admin_id: getAdID[0].user_id
                                        }
                                    }

                                }
                                let addasgn_mgr = await updateAssignManagerTable(req.body, rid[0].recruitee_id, getLApplication[0].application_id, j);

                                if (addasgn_mgr === "success") {
                                    // let sendCreds = await sendCredsbyEmailGuest(userid[0], "" + result + "");
                                    // if (sendCreds === "success") {

                                    res.json({
                                        message: "success",
                                        session: req.session.email,
                                        user_details: userid[0],
                                        recruitee: rid[0].recruitee_id

                                    });
                                    // }
                                } else {
                                    res.json("failed to update assign manager")
                                }


                            } else {
                                res.json("ERROR")
                            }


                        } else {
                            res.json("ERROR")
                        }
                    } else {
                        res.json("ERROR")
                    }
                }


            }

        } else {
            if (req.params.exist === "NO") {
                // let insertUser = await adduserGuest(req.body, email.toLowerCase(), mbl_no, hashedPassword);
                // if (insertUser === "success") {
                //     let getUser = await getLatestUser();
                //     if (getUser.length > 0) {
                //         let latestRecruitee1 = await getLatestRecruitee();
                //         let addrecruitee = await adduserRecruiteeGuest(getUser[0].user_id,latestRecruitee1);
                //         if (addrecruitee === "success") {
                //             let latestRecruitee = await getLatestRecruitee();
                //             let recruiteedetails = await adduserRecruiteeDetailsGuest(req.body, latestRecruitee[0].recruitee_id);
                //             if (recruiteedetails === "success") {
                //                 let rid = await getRecruitee(getUser[0].user_id);
                //                 // //console.log(rid)
                //                 if (rid.length > 0) {

                //                         // let sendCreds = await sendCredsbyEmail(getUser[0],result);
                //                         // if(sendCreds==="success"){
                //                             res.json({
                //                                 message: "success",
                //                                 session: req.session.email,
                //                                 user_details: getUser[0],
                //                                 recruitee:latestRecruitee[0].recruitee_id

                //                             });
                //                         // }   

                //                     // } else {
                //                     //     res.json("error");
                //                     // }
                //                 } else {
                //                     res.json("recruitee_id not found");
                //                 }

                //             }

                //         }

                //     }
                // } else {
                //     res.json("ERROR");
                // }
                res.json("upload resume first")
            } else {
                let updateUser = await updateuserGuest(req.body, req.body.phone, email, req.params.user_id, hashedPassword);
                if (updateUser === "success") {
                    let role = await getRolebyrole_name();
                    if (role.length) {
                        let get_action_id = await getActionId(role[0].role_id);
                        let insert_role_access = await INSERTINLOOP(get_action_id, req.params.user_id);
                    }

                    let userid = await checkUserStatus(req.params.user_id);
                    let rid = await getRecruitee(req.params.user_id);
                    if (rid.length) {

                        let getLatestApplication_ = await getLatestApplication();
                        let add_appication = await addApplication(req.body, rid[0].recruitee_id, getLatestApplication_);
                        if (add_appication === "success") {
                            let getLApplication = await getLatestApplication();
                            let getAdID = await getAdminID();
                            let get_job_post_by = await getJobpostby(req.body.job_id);
                            if (get_job_post_by.length > 0) {
                                let supervisor = await getSupervisor(get_job_post_by[0].job_post_by);
                                if (supervisor.length > 0 && supervisor[0].supervisor_name) {
                                    let supervisor2 = await getSupervisor(supervisor[0].supervisor_name);
                                    if (supervisor2.length > 0 && supervisor2[0].supervisor_name) {
                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: supervisor[0].supervisor_name,
                                            manager_id: supervisor2[0].supervisor_name,
                                            admin_id: getAdID[0].user_id
                                        }
                                    } else {

                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: supervisor[0].supervisor_name,
                                            manager_id: getAdID[0].user_id,
                                            admin_id: getAdID[0].user_id
                                        }
                                    }
                                } else {

                                    var j = {
                                        recruiter_id: get_job_post_by[0].job_post_by,
                                        team_lead_id: getAdID[0].user_id,
                                        manager_id: getAdID[0].user_id,
                                        admin_id: getAdID[0].user_id
                                    }
                                }

                            }
                            let addasgn_mgr = await updateAssignManagerTable(req.body, rid[0].recruitee_id, getLApplication[0].application_id, j);

                            if (addasgn_mgr === "success") {
                                // let sendCreds = await sendCredsbyEmailGuest(userid[0], "" + result + "");
                                // if (sendCreds === "success") {

                                res.json({
                                    message: "success",
                                    session: req.session.email,
                                    user_details: userid[0],
                                    recruitee: rid[0].recruitee_id

                                });
                                // }
                            } else {
                                res.json("failed to update assign manager")
                            }


                        } else {
                            res.json("ERROR")
                        }


                    } else {
                        res.json("ERROR")
                    }
                } else {
                    res.json("ERROR")
                }

            }
        }

    }
    apps();
});

app.post('/vcsapi/api/updateOrInsert/registration/user/application/guest/ByEmail', function (req, res) {
    async function apps() {
        try {
            //console.log(req.body)
            var email = req.body.email.trim().replace(/\s/g, "");
            // var mbl_no = req.body.phone.trim().replace(/\s/g, "");
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (var i = 0; i < 8; i++) {
                result += characters.charAt(Math.floor(Math.random() * 40));
            }
            //console.log(result);
            const saltRounds = 10;
            const hashedPassword = await new Promise((resolve, reject) => {
                bcryptjs.hash("" + result + "", saltRounds, function (err, hash) {
                    if (err) reject(err)
                    resolve(hash)
                });
            });
            let user_ids = [];
            let checkifExists = await checkEmail(email);
            // console.log(checkifExists);
            if (checkifExists.length) {
                let userid = await checkUserByEmail(email);
                // console.log(userid)
                if (userid[0].user_status === "deleted") {
                    let statusUser = await updateRecruitStatus(userid[0]);
                }
                let rid = await getRecruitee(userid[0].user_id);
                // console.log(rid)
                if (rid.length) {

                    let getLatestApplication_ = await getLatestApplication();
                    let add_appication = await addApplication(req.body, rid[0].recruitee_id, getLatestApplication_);
                    if (add_appication === "success") {
                        let getLApplication = await getLatestApplication();
                        let getAdID = await getAdminID();
                        let get_job_post_by = await getJobpostby(req.body.job_id);
                        if (get_job_post_by.length > 0) {
                            let supervisor = await getSupervisor(get_job_post_by[0].job_post_by);
                            if (supervisor.length > 0 && supervisor[0].supervisor_name) {
                                let supervisor2 = await getSupervisor(supervisor[0].supervisor_name);
                                if (supervisor2.length > 0 && supervisor2[0].supervisor_name) {
                                    var j = {
                                        recruiter_id: get_job_post_by[0].job_post_by,
                                        team_lead_id: supervisor[0].supervisor_name,
                                        manager_id: supervisor2[0].supervisor_name,
                                        admin_id: getAdID[0].user_id
                                    }

                                    user_ids = [
                                        { user_id: get_job_post_by[0].job_post_by },
                                        { user_id: supervisor[0].supervisor_name },
                                        { user_id: supervisor2[0].supervisor_name },
                                        { user_id: getAdID[0].user_id }
                                    ]
                                } else {

                                    var j = {
                                        recruiter_id: get_job_post_by[0].job_post_by,
                                        team_lead_id: supervisor[0].supervisor_name,
                                        manager_id: getAdID[0].user_id,
                                        admin_id: getAdID[0].user_id
                                    }

                                    user_ids = [
                                        { user_id: get_job_post_by[0].job_post_by },
                                        { user_id: supervisor[0].supervisor_name },
                                        { user_id: getAdID[0].user_id },
                                        { user_id: getAdID[0].user_id }
                                    ]
                                }
                            } else {

                                var j = {
                                    recruiter_id: get_job_post_by[0].job_post_by,
                                    team_lead_id: getAdID[0].user_id,
                                    manager_id: getAdID[0].user_id,
                                    admin_id: getAdID[0].user_id
                                }

                                user_ids = [
                                    { user_id: get_job_post_by[0].job_post_by },
                                    { user_id: getAdID[0].user_id },
                                    { user_id: getAdID[0].user_id },
                                    { user_id: getAdID[0].user_id }
                                ]
                            }

                        }
                        //console.log("JJJJJJ",j);
                        for (let k = 0; k < user_ids.length; k++) {
                            var userRoleId = await getRoleOfEmployee(user_ids[k].user_id);
                            console.log(userRoleId, user_ids[k].user_id)
                            var addIncen_perc = await updateAssignManagerIncentiveTable(user_ids[k].user_id, rid[0].recruitee_id, getLApplication[0].application_id, userRoleId);
                        }
                        let addasgn_mgr = await updateAssignManagerTable(req.body, rid[0].recruitee_id, getLApplication[0].application_id, j);

                        console.log(addasgn_mgr)
                        if (addasgn_mgr === "success") {
                            // let sendCreds = await sendCredsbyEmailGuest(userid[0], "" + result + "");
                            // if (sendCreds === "success") {

                            res.json({
                                message: "success",
                                session: req.session.email,
                                user_details: userid[0],
                                recruitee: rid[0].recruitee_id

                            });

                        } else {
                            res.json("failed to update assign manager")
                        }


                    } else {
                        res.json("ERROR")
                    }


                } else {
                    res.json("ERROR")
                }


            }
            else {

                let insertUser = await adduserRegisterGuest(req.body, hashedPassword);
                //console.log("user-- ",insertUser)
                if (insertUser === "success") {
                    let getUser = await getLatestUser();
                    //console.log("latest-- ", getUser)
                    if (getUser.length > 0) {
                        let latestRecruitee1 = await getLatestRecruitee();
                        //console.log(latestRecruitee1)
                        let addrecruitee = await adduserRecruiteeRegister(getUser[0].user_id, latestRecruitee1, "no");
                        if (addrecruitee === "success") {
                            let latestRecruitee = await getLatestRecruitee();
                            //console.log("l recruitee", latestRecruitee)
                            let recruiteedetails = await adduserRecruiteeDetailsRegister(latestRecruitee[0].recruitee_id);
                            if (recruiteedetails === "success") {

                                let role = await getRolebyrole_name();
                                if (role.length) {
                                    let get_action_id = await getActionId(role[0].role_id);
                                    let insert_role_access = await INSERTINLOOP(get_action_id, getUser[0].user_id);
                                }

                                let userid = await checkUserStatus(getUser[0].user_id);
                                let rid = await getRecruitee(getUser[0].user_id);
                                if (rid.length) {

                                    let getLatestApplication_ = await getLatestApplication();
                                    let add_appication = await addApplication(req.body, rid[0].recruitee_id, getLatestApplication_);
                                    if (add_appication === "success") {
                                        let getLApplication = await getLatestApplication();
                                        let getAdID = await getAdminID();
                                        //console.log("admin-- ", getAdID)
                                        let get_job_post_by = await getJobpostby(req.body.job_id);
                                        if (get_job_post_by.length > 0) {
                                            let supervisor = await getSupervisor(get_job_post_by[0].job_post_by);
                                            if (supervisor.length > 0 && supervisor[0].supervisor_name) {
                                                let supervisor2 = await getSupervisor(supervisor[0].supervisor_name);
                                                if (supervisor2.length > 0 && supervisor2[0].supervisor_name) {
                                                    var j = {
                                                        recruiter_id: get_job_post_by[0].job_post_by,
                                                        team_lead_id: supervisor[0].supervisor_name,
                                                        manager_id: supervisor2[0].supervisor_name,
                                                        admin_id: getAdID[0].user_id
                                                    }
                                                } else {

                                                    var j = {
                                                        recruiter_id: get_job_post_by[0].job_post_by,
                                                        team_lead_id: supervisor[0].supervisor_name,
                                                        manager_id: getAdID[0].user_id,
                                                        admin_id: getAdID[0].user_id
                                                    }
                                                }
                                            } else {

                                                var j = {
                                                    recruiter_id: get_job_post_by[0].job_post_by,
                                                    team_lead_id: getAdID[0].user_id,
                                                    manager_id: getAdID[0].user_id,
                                                    admin_id: getAdID[0].user_id
                                                }
                                            }

                                        }
                                        let addasgn_mgr = await updateAssignManagerTable(req.body, rid[0].recruitee_id, getLApplication[0].application_id, j);

                                        if (addasgn_mgr === "success") {
                                            // let sendCreds = await sendCredsbyEmailGuest(userid[0], "" + result + "");
                                            // if (sendCreds === "success") {

                                            res.json({
                                                message: "success",
                                                session: req.session.email,
                                                user_details: userid[0],
                                                recruitee: rid[0].recruitee_id

                                            });
                                            // }
                                        } else {
                                            res.json("failed to update assign manager")
                                        }


                                    } else {
                                        res.json("ERROR")
                                    }


                                } else {
                                    res.json("ERROR")
                                }




                            }
                        }
                    }
                }


                else {
                    res.json("ERROR")
                }


            }
        }
        catch (err) {
            //console.log(err);
            res.json(err)
        }

    }
    apps();
});

function updateRecruitStatus(data) {
    return new Promise(function (resolve, reject) {

        let sql = `update tbl_user set ? where user_id="${data.user_id}"`;
        post = {
            user_status: "active",

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve("success");
            }
        })
    })
}

function updateApplicationICOGuest(data, data1) {
    return new Promise(function (resolve, reject) {

        var sql = `update tbl_application set ? where application_id=${data.application_id}`;
        var post = {

            applicant_message: data1.message,
            applicant_availability: data1.availability

        }


        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}

function adduserGuest(data, email, phone, hpass) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        // //console.log(strTime);
        let sql = `insert into tbl_user set ?`;
        let post = {
            user_first_name: data.first_name,
            user_middle_name: data.middle_name,
            user_last_name: data.last_name,
            phone: phone,
            email: email,
            password: hpass,
            passcode: "1234",
            user_type: "recruitee",
            user_status: "active",
            changed_by: "",
            changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
            login_block_status: "unblock",
            password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY")

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function updateuserGuest(data, phone, email, uId, hash) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        // //console.log(strTime);
        let sql = `update tbl_user set ? where user_id='${uId}'`;
        let post = {
            user_first_name: data.first_name,
            user_middle_name: data.middle_name,
            user_last_name: data.last_name,
            phone: phone,
            password: hash,
            email: email,
            user_status: "active"
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function adduserRegisterGuest(data, password) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        // //console.log(strTime);
        let sql = `insert into tbl_user set ?`;
        let post = {
            user_first_name: data.first_name,
            user_middle_name: "",
            user_last_name: data.last_name,
            phone: data.phone,
            email: data.email,
            password: password,
            passcode: "1234",
            user_type: "recruitee",
            user_status: "active",
            changed_by: "",
            changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
            login_block_status: "unblock",
            password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY")

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function adduserRecruiteeRegister(uid, pcode, status) {
    return new Promise(function (resolve, reject) {

        let code = 0;
        if (pcode.length > 0) {
            code = parseInt(pcode[0].recruitee_code) + 1;
        } else {
            code = 10001;
        }

        let sql = `insert into tbl_recruitee set ?`;
        let post = {
            user_id: uid,
            recruitee_code: code,
            apply_status: "regular",
            recruit_status: "applicant",
            registration_status: status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function adduserRecruiteeDetailsRegister(recID) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_recruitee_details set ?`;
        let post = {
            recruitee_id: recID,
            dob: "",
            ssn_4digit: "",
            profession: "0",
            speciality: "0",
            current_location: "",
            desired_location_1: "",
            desired_location_2: "",
            employement_preference: ""

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function checkEmail(email) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_user where email="${email}"  order by email desc limit 1`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                resolve(res);
            }
        })
    })
}

function checkappExist(rId, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_application where recruitee_id="${rId}" and job_id="${data.job_id}"`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                resolve(res);
            }
        })
    })
}

function checkEmailCandidate(email) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_candidate where candidate_email="${email}" and candidate_status="active" `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                resolve(res);
            }
        })
    })
}

function getLatestUser() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_user order by user_id desc limit 1 `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function checkUserStatus(uid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}' and user_status="active"`;
        db.query(sql, function (err, row, fields) {
            if (!err) {
                resolve(row)
            } else {
                reject(err)
                // 
            }
        });
    })
}

function checkUserByID(uid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}' `;
        db.query(sql, function (err, row, fields) {
            if (!err) {
                resolve(row)
            } else {
                reject(err)
                // 
            }
        });
    })
}

function checkUserByEmail(email) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_user WHERE email ='${email}' `;
        db.query(sql, function (err, row, fields) {
            if (!err) {
                resolve(row)
            } else {
                reject(err)
                // 
            }
        });
    })
}

function getActionId(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_role_access where role_id=${data}`;
        db.query(sql, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function INSERTINLOOP(data, user_id) {

    return new Promise(function (resolve, reject) {

        for (i = 0; i <= data.length - 1; i++) {

            insertUserAccess(data[i].action_id, user_id);
        }
        resolve("success");

    });
}

function getRolebyrole_name() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * FROM tbl_role WHERE role_status="active" and role_name="recruitee" `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function sendCredsbyEmailGuest(udata, passwd) {
    /////// email generate
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'registration@vishusa.com',
                pass: 'registrationVCS#2022'
            }
        });
        var mailOptions = {
            from: 'registration@vishusa.com',
            to: ((udata.email).trim()).toLowerCase(),
            subject: `You have applied job successfully`,
            html: `Hi, "${udata.user_first_name}"<br/>Welcome!!!<br/>
            Your login credentials is as:<br/>
            email : <strong>${udata.email}</strong>
            <br/>
            passcode : <strong>${udata.passcode}</strong>
            <br/>
            password : <strong>${passwd}</strong>
            <br/>
            <br/><br/>Thanks & regards<br/>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                resolve("success");
            } else {
                //console.log(error)
                reject(error);
            }
        });
    });
}

function adduserRecruiteeDetailsGuest(data, recID) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_recruitee_details set ?`;
        let post = {
            recruitee_id: recID,
            dob: "",
            ssn_4digit: "",
            profession: 0,
            speciality: 0,
            current_location: "",
            desired_location_1: "",
            desired_location_2: "",
            employement_preference: ""

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function adduserRecruiteeGuest(uid, pcode) {
    return new Promise(function (resolve, reject) {

        let code = 0;
        if (pcode.length > 0) {
            code = parseInt(pcode[0].recruitee_code) + 1;
        } else {
            code = 10001;
        }

        let sql = `insert into tbl_recruitee set ?`;
        let post = {
            user_id: uid,
            recruitee_code: code,
            apply_status: "regular",
            recruit_status: "applicant"
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function updateuserRecruiteeGuest(uid, rId) {
    return new Promise(function (resolve, reject) {

        let sql = `update tbl_recruitee set ? where recruitee_id='${rId}'`;
        let post = {
            user_id: uid,
            apply_status: "regular",
            recruit_status: "applicant"
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function getLatestRecruitee() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_recruitee order by recruitee_id desc limit 1 `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject("err")
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/payrollData/recruiteePayroll/filtered", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let str = "";
                if (req.body.client_id !== "ALL") {
                    str = ` AND a.client_id="${req.body.client_id}"`;
                }
                if (req.body.year !== "ALL") {

                    str = str + ` AND b.year="${req.body.year}"`;

                }
                if (req.body.month !== "ALL") {

                    str = str + ` AND b.month="${req.body.month}"`;


                }
                if (req.body.week_id !== "ALL") {

                    str = str + ` AND a.week_id="${req.body.week_id}"`;


                }

                let wks = await getRecruteePayrollData(str);
                res.json(wks);

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getRecruteePayrollData(str) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_account_file AS a 
        INNER JOIN tbl_week AS b ON a.week_id=b.week_id
        INNER JOIN tbl_client AS c ON c.client_id=a.client_id WHERE a.approval_status="approved" 
         ${str}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/api/approval_status/approved/accountfiledata", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await getApprovedAccountFiledata(req.body);
                res.json(post)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/approval_status/approved/accountfiledata/download/excelfile/:user_id/:acc_file_id/:name", function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
        try {
            let post = await getApprovedAccountFiledata(req.params);
            let post1 = await getUsername(req.params.user_id);
            // //console.log(post)
            // //console.log(post1)
            var data = "";
            var user_name = ""
            if (post1[0].user_middle_name === null) {
                user_name = post1[0].user_first_name + " " + post1[0].user_last_name

            } else {
                user_name = post1[0].user_first_name + " " + post1[0].user_middle_name + " " + post1[0].user_last_name
            }
            var data1 = {
                client_name: post[0].client_name,
                file_no: post[0].file_no,
                wk_end_date: (post[0].wk_end_date.split("/"))[1],
                wk_start_date: (post[0].wk_start_date.split("/"))[1],
                year: post[0].year,
                month: post[0].month,
                user_name: user_name

            }


            for (var i = 0; i < post.length; i++) {
                let job_no = ''
                let ot_starts_after_wk = ''
                let onb_regular_bill_rate = ''
                let onb_ot_bill_rate = ''
                let onb_holiday_bill_rate = ''
                let onb_regular_pay_rate = ''
                let onb_ot_pay_rate = ''
                let onb_holiday_pay_rate = ''
                let reg_hr = ''
                let ot_hr = ''
                let holiday_hr = ''
                let total_shift_hr = ''
                let per_dieum_wk = ''
                let bonus_amount = ''
                let taxable_amt = 0
                let nontaxable_amt = 0
                let gross_amt = 0
                let comments = ''
                let invoice_amt = 0
                let deducted_perc = ''
                let deducted_invoice_amt = 0
                let misc_exp_amt = 0
                let profit_amt = 0
                // //console.log(data)
                if (post[i].job_no !== null) {
                    job_no = post[i].job_no
                }
                if (post[i].ot_starts_after_wk !== null) {
                    ot_starts_after_wk = post[i].ot_starts_after_wk
                }
                if (post[i].onb_regular_bill_rate !== null) {
                    onb_regular_bill_rate = post[i].onb_regular_bill_rate
                }
                if (post[i].onb_ot_bill_rate !== null) {
                    onb_ot_bill_rate = post[i].onb_ot_bill_rate
                }
                if (post[i].onb_holiday_bill_rate !== null) {
                    onb_holiday_bill_rate = post[i].onb_holiday_bill_rate
                }
                if (post[i].onb_regular_pay_rate !== null) {
                    onb_regular_pay_rate = post[i].onb_regular_pay_rate
                }
                if (post[i].onb_ot_pay_rate !== null) {
                    onb_ot_pay_rate = post[i].onb_ot_pay_rate
                }
                if (post[i].onb_holiday_pay_rate !== null) {
                    onb_holiday_pay_rate = post[i].onb_holiday_pay_rate
                }
                if (post[i].reg_hr !== null) {
                    reg_hr = post[i].reg_hr
                }
                if (post[i].ot_hr !== null) {
                    ot_hr = post[i].ot_hr
                }
                if (post[i].holiday_hr !== null) {
                    holiday_hr = post[i].holiday_hr
                }
                if (post[i].total_shift_hr !== null) {
                    total_shift_hr = post[i].total_shift_hr
                }
                if (post[i].per_dieum_wk !== null) {
                    per_dieum_wk = post[i].per_dieum_wk
                }
                if (post[i].bonus_amount !== null) {
                    bonus_amount = post[i].bonus_amount
                }
                if (post[i].taxable_amt !== null) {
                    taxable_amt = post[i].taxable_amt
                }
                if (post[i].nontaxable_amt !== null) {
                    nontaxable_amt = post[i].nontaxable_amt
                }
                if (post[i].gross_amt !== null) {
                    gross_amt = post[i].gross_amt
                }
                if (post[i].comments !== null) {
                    comments = post[i].comments
                }
                if (post[i].invoice_amt !== null) {
                    invoice_amt = post[i].invoice_amt
                }
                if (post[i].deducted_perc !== null) {
                    deducted_perc = post[i].deducted_perc
                }
                if (post[i].deducted_invoice_amt !== null) {
                    deducted_invoice_amt = post[i].deducted_invoice_amt
                }
                if (post[i].misc_exp_amt !== null) {
                    misc_exp_amt = post[i].misc_exp_amt
                }
                if (post[i].profit_amt !== null) {
                    profit_amt = post[i].profit_amt
                }
                var rec_name = ''
                if (post[i].user_middle_name === null || post[i].user_middle_name === "") {
                    rec_name = post[i].user_first_name + " " + post[i].user_last_name
                } else {
                    rec_name = post[i].user_first_name + " " + post[i].user_middle_name + " " + post[i].user_last_name
                }
                data =
                    data +
                    rec_name +
                    "\t" +
                    post[i].recruitee_code +
                    "\t" +
                    job_no +
                    "\t" +
                    ot_starts_after_wk +
                    "\t" +
                    onb_regular_bill_rate +
                    "\t" +
                    onb_ot_bill_rate +
                    "\t" +
                    onb_holiday_bill_rate +
                    "\t" +
                    onb_regular_pay_rate +
                    "\t" +
                    onb_ot_pay_rate +
                    "\t" +
                    onb_holiday_pay_rate +
                    "\t" +
                    reg_hr +
                    "\t" +
                    ot_hr +
                    "\t" +
                    holiday_hr +
                    "\t" +
                    total_shift_hr +
                    "\t" +
                    per_dieum_wk +
                    "\t" +
                    parseFloat(bonus_amount).toFixed(2) +
                    "\t" +
                    parseFloat(taxable_amt).toFixed(2) +
                    "\t" +
                    parseFloat(nontaxable_amt).toFixed(2) +
                    "\t" +
                    parseFloat(gross_amt).toFixed(2) +
                    "\t" +
                    comments +
                    "\t" +
                    parseFloat(invoice_amt).toFixed(2) +
                    "\t" +
                    deducted_perc +
                    "\t" +
                    parseFloat(deducted_invoice_amt).toFixed(2) +
                    "\t" +
                    parseFloat(misc_exp_amt).toFixed(2) +
                    "\t" +
                    parseFloat(profit_amt).toFixed(2) +
                    "\n";


            }
            var data2 = JSON.stringify(data);
            //console.log(data2)
            //console.log(data1)

            async function excle() {
                var get = await generateExcelFilePayrollInvoice(data1, data2);
                ///var dddd=send(datask);
                // //console.log('aaaa');
                // //console.log(datask);
                res.sendFile(get);
            }
            excle();
        } catch (err) {
            //console.log(err);
            res.json(err)
        }
    }
    apps();
    // } else {
    //     res.status(401).json("token is not valid");
    // }
});

function getApprovedAccountFiledata(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_account_file AS af
        INNER JOIN tbl_assignment AS a ON a.client_id=af.client_id
        inner join tbl_onboarding as onb on onb.onboarding_id=a.onboarding_id
        INNER JOIN tbl_week AS w ON w.week_id=af.week_id	
        INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id AND b.acc_file_id=af.acc_file_id AND b.week_id=w.week_id
        INNER JOIN tbl_recruitee AS d ON d.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS e ON e.user_id=d.user_id
        INNER JOIN tbl_job AS f ON f.job_id=a.job_id
        INNER JOIN tbl_client AS g ON g.client_id=af.client_id
        WHERE af.acc_file_id="${data.acc_file_id}"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getUsername(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_user
        WHERE user_id=${data}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getWeek(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_week
        WHERE week_id=${data}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getClientName(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_client
        WHERE client_id=${data}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function generateExcelFilePayrollInvoice(data, data2) {
    return new Promise(function (resolve, reject) {

        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var wb = new xls.Workbook();
        var ws = wb.addWorksheet("Sheet 1");
        var style = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 14
            },
            alignment: {
                wrapText: true
                //horizontal: 'center',
            }
        });
        var style1 = wb.createStyle({
            font: {
                color: "#000000",
                bold: true,
                //underline: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "center",
                shrinkToFit: true
            },
            outline: {
                summaryBelow: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style2 = wb.createStyle({
            alignment: {
                wrapText: true,
                horizontal: "center",
                shrinkToFit: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style3 = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "left"
            }
        });

        ws.column(1).setWidth(3);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(15);
        ws.column(4).setWidth(15);
        ws.column(5).setWidth(15);
        ws.column(6).setWidth(15);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(15);
        ws.column(15).setWidth(15);
        ws.column(11).setWidth(15);
        ws.column(12).setWidth(15);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(15);
        ws.column(15).setWidth(15);
        ws.column(16).setWidth(15);
        ws.column(17).setWidth(15);
        ws.column(19).setWidth(15);
        ws.column(20).setWidth(15);
        ws.column(21).setWidth(20);
        ws.column(22).setWidth(15);
        ws.column(23).setWidth(15);
        ws.column(24).setWidth(15);
        ws.column(25).setWidth(15);
        ws.column(26).setWidth(15);

        ws.cell(1, 1, 1, 7, true)
            .string("Payroll Invoice Report")
            .style(style);

        ws.cell(3, 1, 3, 7, true)
            .string("Client : " + data.client_name)
            .style(style);
        ws.cell(4, 1, 4, 12, true)
            .string("File No : " + data.file_no)
            .style(style3);
        ws.cell(5, 1, 5, 12, true)
            .string("Week,Month,Year :" + data.wk_start_date + "-" + data.wk_end_date + " " + "," + data.month + "," + data.year)
            .style(style3);
        ws.cell(6, 1, 6, 12, true)
            .string("Created On :" + moment(new Date(strTime)).format("MM/DD/YYYY"))
            .style(style3);
        ws.cell(7, 1, 7, 12, true)
            .string("Created By :" + data.user_name)
            .style(style3)

        ws.cell(9, 1)
            .string("#")
            .style(style1);
        ws.cell(9, 2)
            .string("Recruitee Name")
            .style(style1);
        ws.cell(9, 3)
            .string("Recruitee Code")
            .style(style1);
        ws.cell(9, 4)
            .string("Job ID")
            .style(style1);
        ws.cell(9, 5)
            .string("OT Starts After")
            .style(style1);
        ws.cell(9, 6)
            .string("Reg Bill Rate")
            .style(style1);
        ws.cell(9, 7)
            .string("OT Bill Rate")
            .style(style1);
        ws.cell(9, 8)
            .string("Holiday Bill Rate")
            .style(style1);
        ws.cell(9, 9)
            .string("Reg Pay Rate")
            .style(style1);
        ws.cell(9, 10)
            .string("OT Pay Rate")
            .style(style1);
        ws.cell(9, 11)
            .string("Holiday Pay Rate")
            .style(style1);
        ws.cell(9, 12)
            .string("Reg Hrs")
            .style(style1);
        ws.cell(9, 13)
            .string("Ot Hrs")
            .style(style1);
        ws.cell(9, 14)
            .string("Holiday Hrs")
            .style(style1);
        ws.cell(9, 15)
            .string("Total Hrs")
            .style(style1);
        ws.cell(9, 16)
            .string("Weekly perdiem")
            .style(style1);
        ws.cell(9, 17)
            .string("Bonus Amt")
            .style(style1);
        ws.cell(9, 18)
            .string("Taxable Income")
            .style(style1);
        ws.cell(9, 19)
            .string("Non-Taxable Income")
            .style(style1);
        ws.cell(9, 20)
            .string("Gross Income")
            .style(style1);
        ws.cell(9, 21)
            .string("comments")
            .style(style1);
        ws.cell(9, 22)
            .string("Invoice Amount")
            .style(style1);
        ws.cell(9, 23)
            .string("Deduction Percentage")
            .style(style1);
        ws.cell(9, 24)
            .string("Invoice (Aft. Ded.)")
            .style(style1);
        ws.cell(9, 25)
            .string("Misc. expense")
            .style(style1);
        ws.cell(9, 26)
            .string("Profit(#/wk)")
            .style(style1);

        ws.cell(10, 1)
            .number(1)
            .style(style2);

        var row = 10;
        var col = 1;
        var key = "";
        var count = 1;
        for (var i = 1; i < data2.length - 1; i++) {
            if (data2[i] == "\\" && data2[i + 1] == "t") {
                col = col + 1;

                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                key = "";
                i++;
            } else if (data2[i] == "\\" && data2[i + 1] == "n") {
                col = col + 1;
                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                row = row + 1;
                count = count + 1;
                ////console.log(count);
                /// //console.log(data2[i+2]);
                if (data2[i + 2] == '"') {
                    break;
                } else {
                    ws.cell(row, 1)
                        .number(count)
                        .style(style2);
                }
                key = "";
                col = 1;
                i++;
            } else {
                var key = key + data2[i];
                ////console.log("in else condittion");
                ////console.log(key);
            }
        }
        wb.write("/home/ubuntu/vcs/excle_file/payroll_invoice.xlsx", function (err) {
            if (err) resolve("err");
            else resolve("/home/ubuntu/vcs/excle_file/payroll_invoice.xlsx");

        });
    });
}


app.post("/vcsapi/add/or/update/api/tbl/payroll_invoice/calculate", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);

                let wks = await updateCalculatePayrollInvoice(req.body);
                if (wks === "success") {
                    if (req.body.rec_work_hr_id === 0) {
                        let get = await getPayrollDataByID(req.body.rec_payroll_id);
                        if (get.length) {
                            var wrk_hr = await addTblRecWorkHour(req.body, get[0]);
                        }
                    }
                    else {
                        var wrk_hr = await updateTblRecWorkHour(req.body);
                    }
                    res.json(wrk_hr);
                } else {
                    res.json("not updated");
                }



            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
function getPayrollDataByID(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_payroll_invoice
        WHERE rec_payroll_id='${data}'`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function addTblRecWorkHour(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_rec_work_hr set ?`;
        let post = {
            recruitee_id: data1.recruitee_id,
            assignment_id: data1.assignment_id,
            week_id: data1.week_id,
            rec_reg_hr: data.reg_hr,
            rec_ot_hr: data.ot_hr,
            rec_holiday_hr: data.holiday_hr
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function updateTblRecWorkHour(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_rec_work_hr set ? where rec_work_hr_id=${data.rec_work_hr_id}`;
        let post = {
            rec_reg_hr: data.reg_hr,
            rec_ot_hr: data.ot_hr,
            rec_holiday_hr: data.holiday_hr
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}


function updateCalculatePayrollInvoice(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_payroll_invoice set ?  where rec_payroll_id=${data.rec_payroll_id}`;
        let post = {
            reg_hr: data.reg_hr,
            ot_hr: data.ot_hr,
            holiday_hr: data.holiday_hr,
            per_dieum_amt: data.per_dieum_amt,
            bonus_amount: data.bonus_amount,
            taxable_amt: data.taxable_amt,
            nontaxable_amt: data.nontaxable_amt,
            gross_amt: data.gross_amt,
            invoice_amt: data.invoice_amt,
            deducted_invoice_amt: data.deducted_invoice_amt,
            profit_amt: data.profit_amt,
            deducted_perc: data.deducted_perc,
            comments: data.comments,
            payroll_status: data.payroll_status,
            misc_exp_amt: data.misc_exp_amt
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function insertCalculatePayrollInvoice(data, file_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_payroll_invoice set ?`;
        let post = {
            assignment_id: data.assignment_id,
            recruitee_id: data.recruitee_id,
            week_id: data.week_id,
            month: data.month,
            year: data.year,
            acc_file_id: file_id,
            incentive_paid_status: "unpaid"
        }

        db.query(sql, post, function (err, res) {
            //console.log(sql, post);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/get/api/all/inprocess/accountdatas", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body)
                let count = 0;
                let cdn = await checkIfExistsAccountFile(req.body);
                if (cdn.length > 0) {
                    res.json("already exists")
                } else {
                    let latestcdn = await getLatestsAccountFile();
                    let insrt_account_file = await insertAccountFile(req.body, latestcdn);
                    if (insrt_account_file === "success") {
                        let latestcdn2 = await getLatestsAccountFile();
                        let wks2 = await getAccountFiledata1(req.body, latestcdn2[0].acc_file_id);

                        for (let i = 0; i < wks2.length; i++) {
                            let post = await insertCalculatePayrollInvoice(wks2[i], latestcdn2[0].acc_file_id);
                            if (post === "success") {
                                count++;
                            }
                        }
                        if (count === wks2.length) {
                            let wks = await getAccountFiledata(req.body, latestcdn2[0].acc_file_id);
                            if (wks.length > 0) {
                                res.json(wks);
                            }
                            else {
                                res.json({ message: "hiring data is greater than wk_end_date.", acc_file_id: latestcdn2[0].acc_file_id })
                            }

                        } else {
                            res.json("ERROR IN insert");
                        }

                    } else {
                        res.json("account_file data not inserted");
                    }


                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAccountFiledata(data, file_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        // let sql = `
        // SELECT * FROM(
        // SELECT af.acc_file_id AS account_file_id, a.*,w.*,b.rec_payroll_id,b.payroll_status,e.*,f.job_no,g.client_name,b.reg_hr,b.ot_hr,b.holiday_hr,b.taxable_amt,b.nontaxable_amt,b.gross_amt,b.profit_amt,b.deducted_invoice_amt,STR_TO_DATE(w.wk_start_date,"%m/%d/%Y") as start,STR_TO_DATE(w.wk_end_date,"%m/%d/%Y") as end,STR_TO_DATE(a.closing_date,"%m/%d/%Y") AS closing,STR_TO_DATE(a.hiring_date,"%m/%d/%Y") AS hiring 
        // FROM tbl_account_file AS af
        // INNER JOIN tbl_assignment AS a ON a.client_id=af.client_id
        // INNER JOIN tbl_week AS w ON w.week_id=af.week_id
        // INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id AND b.acc_file_id=af.acc_file_id AND b.week_id=w.week_id
        // INNER JOIN tbl_recruitee AS d ON d.recruitee_id=a.recruitee_id
        // INNER JOIN tbl_user AS e ON e.user_id=d.user_id
        // INNER JOIN tbl_job AS f ON f.job_id=a.job_id
        // INNER JOIN tbl_client AS g ON g.client_id=af.client_id
        // WHERE a.assignment_status='working' AND af.client_id="${data.client_id}"   AND af.month="${data.month}"  AND af.year="${data.year}" and af.week_id=${data.week_id} 
        // AND af.acc_file_id=${file_id}
        // ) AS temp where  (hiring<=end) AND (closing>=start)`;

        let sql = `
        SELECT * FROM(
        SELECT af.acc_file_id AS account_file_id, a.*,w.*,b.rec_payroll_id,b.payroll_status,e.*,f.job_no,g.client_name,b.reg_hr,b.ot_hr,b.holiday_hr,b.taxable_amt,b.nontaxable_amt,b.gross_amt,b.profit_amt,b.deducted_invoice_amt,STR_TO_DATE(w.wk_start_date,"%m/%d/%Y") as start,STR_TO_DATE(w.wk_end_date,"%m/%d/%Y") as end,STR_TO_DATE(a.closing_date,"%m/%d/%Y") AS closing,STR_TO_DATE(a.hiring_date,"%m/%d/%Y") AS hiring 
        FROM tbl_account_file AS af
        INNER JOIN tbl_assignment AS a ON a.client_id=af.client_id
        INNER JOIN tbl_week AS w ON w.week_id=af.week_id
        INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id AND b.acc_file_id=af.acc_file_id AND b.week_id=w.week_id
        INNER JOIN tbl_recruitee AS d ON d.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS e ON e.user_id=d.user_id
        INNER JOIN tbl_job AS f ON f.job_id=a.job_id
        INNER JOIN tbl_client AS g ON g.client_id=af.client_id
        af.client_id="${data.client_id}"   AND af.month="${data.month}"  AND af.year="${data.year}" and af.week_id=${data.week_id} 
        AND af.acc_file_id=${file_id}
        ) AS temp where  (hiring<=end) AND (closing>=start)`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getAccountFiledata1(data, file_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `
        SELECT * FROM(
        SELECT af.acc_file_id AS account_file_id, a.*,w.*,e.*,f.job_no,g.client_name,STR_TO_DATE(w.wk_start_date,"%m/%d/%Y") as start,STR_TO_DATE(w.wk_end_date,"%m/%d/%Y") as end,STR_TO_DATE(a.closing_date,"%m/%d/%Y") AS closing,STR_TO_DATE(a.hiring_date,"%m/%d/%Y") AS hiring 
        FROM tbl_account_file AS af
        INNER JOIN tbl_assignment AS a ON a.client_id=af.client_id
        INNER JOIN tbl_week AS w ON w.week_id=af.week_id
        INNER JOIN tbl_recruitee AS d ON d.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS e ON e.user_id=d.user_id
        INNER JOIN tbl_job AS f ON f.job_id=a.job_id
        INNER JOIN tbl_client AS g ON g.client_id=af.client_id
        WHERE af.account_status="inprocess" AND af.client_id="${data.client_id}"   AND af.month="${data.month}"  AND af.year="${data.year}" and af.week_id=${data.week_id} 
        AND af.acc_file_id=${file_id}
        ) AS temp where (hiring<=end) AND (closing>=start)`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function checkIfExistsAccountFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_account_file 
        WHERE client_id="${data.client_id}"   AND week_id=${data.week_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getLatestsAccountFile() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_account_file ORDER BY acc_file_id DESC`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function insertAccountFile(data, pcode) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let ustime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var times = moment(new Date(ustime)).format("MM/DD/YYYY");
        var day = times.split("/");
        var dt = day[1];
        var mm = day[0];
        var yy = day[2].slice(2, 4);
        /////////slice previous code
        if (pcode.length > 0) {
            var dtt = pcode[0].file_no.slice(4, 6);
            var mmm = pcode[0].file_no.slice(2, 4);
            var yyy = pcode[0].file_no.slice(6, 8);
            var ccc = pcode[0].file_no.slice(8, 11);

        } else {
            var dtt = dt;
            var mmm = mm;
            var yyy = yy;
            var ccc = "000";
        }

        var code = 'FL';
        if (dt.length == 1) {
            dt = '0' + dt;
        }
        if (mm.length == 1) {
            mm = '0' + mm;
        }
        if (dt == dtt && mm == mmm && yy == yyy) {
            var cc = ccc.slice(2, 3);
            var c = ccc.slice(0, 2);
            var cs = ccc;

            if (cc < 9) {
                var sum = cc + 1;

                cc = parseInt(cc) + 1;
                code = code + mm + dt + yy + c + cc;
                //console.log(code, "1");
            } else {
                c = parseInt(cc) + 1;
                cc = 0;
                var databasevalue = cs;
                // coerce the previous variable as a number and add 1
                var incrementvalue = (+databasevalue) + 1;
                // //console.log("---------------------------TEST 3",incrementvalue);

                // insert leading zeroes with a negative slice
                incrementvalue = ("000" + incrementvalue).slice(-3);
                // //console.log("---------------------------TEST 4",incrementvalue);
                var value = incrementvalue;
                code = code + mm + dt + yy + value;
                //console.log(code, "2");
            }
        } else if (dt != dtt && mm == mmm && yy == yyy) {
            ccc = "001";
            code = code + mm + dt + yy + ccc;
            //console.log(code, "3");
        } else if (dt != dtt && mm != mmm && yy == yyy) {
            ccc = "001";
            code = code + mm + dt + yy + ccc;
            //console.log(code, "4");
        } else if (dt != dtt && mm != mmm && yy != yyy) {
            ccc = "001";
            code = code + mm + dt + yy + ccc;
            //console.log(code, "5");
        } else {
            var cc = "001";
            code = code + mm + dt + yy + cc;
            //console.log(code, "6");
        }

        //console.log(code);
        let sql = `insert into tbl_account_file set ? `;
        let post = {
            client_id: data.client_id,
            week_id: data.week_id,
            month: data.month,
            year: data.year,
            file_no: code
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("after insert", res)
                resolve("success");
            }
        })
    })
}
app.get("/vcsapi/get/api/tbl/account_file/year", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let year = await getAccountFileyearallList();
                res.json(year);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/delete/account_file/byID", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let year = await deleteAccountFile(req.body);
                res.json(year);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAccountFileyearallList(CID) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct year from tbl_week`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/payrollData/BYassignment", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let cdn = await getPayrollData(req.body);

                res.json(cdn);


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getPayrollData(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT b.*,c.* FROM tbl_assignment AS a INNER JOIN tbl_onboarding AS b ON a.onboarding_id=b.onboarding_id INNER JOIN tbl_payroll_invoice AS c ON c.assignment_id=a.assignment_id WHERE
        a.assignment_id=${data.assignment_id} AND c.week_id=${data.week_id} AND c.rec_payroll_id=${data.rec_payroll_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.get("/vcsapi/get/api/tbl/account_file/month/:year", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let mnth = await getAccountFilemonthallList(req.params.year);
                res.json(mnth);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAccountFilemonthallList(yr) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct month from tbl_week  where year=${yr}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.get("/vcsapi/get/api/tbl/account_file/weeks/:year/:month", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let wks = await getAccountFileweekallList(req.params.year, req.params.month);
                res.json(wks);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAccountFileweekallList(yr, mnth) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct w.* from tbl_week w
         where w.year=${yr} and w.month="${mnth}"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}


app.post("/vcsapi/update/api/account_status/tbl/account_file", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await updateAccountStatusByClientID(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not updated")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateAccountStatusByClientID(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_account_file set ? where acc_file_id=${data.acc_file_id}`;
        let post = {
            account_status: data.account_status
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

app.post("/vcsapi/delete/account_file", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await deleteAccountFile(req.body);
                if (post === "success") {
                    let postde = await deletePayrollFile(req.body);
                    res.json(postde);
                } else {
                    res.json("not updated")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function deleteAccountFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `delete from tbl_account_file where acc_file_id=${data.acc_file_id}`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function deletePayrollFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `delete from tbl_payroll_invoice where acc_file_id=${data.acc_file_id}`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}


app.post("/vcsapi/update/status/payroll/account_file", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let count = 0;
                let post = await updateAccountFile(req.body);
                if (post === "success") {
                    let postde = await updatePayrollFile(req.body);
                    if (postde === "success") {
                        let getPayrollDataByFile = await getPayrollFile(req.body)


                        for (let i = 0; i < getPayrollDataByFile.length; i++) {
                            let getSum = await sumRecWkHr(getPayrollDataByFile[i]);
                            if (getSum.length) {

                                let updateAssignment = await updateAssignmentWkHr(getPayrollDataByFile[i], getSum[0].sum);
                                if (updateAssignment === "success") {
                                    count++;
                                }
                            }

                        }

                        if (count === getPayrollDataByFile.length) {
                            res.json("success")
                        }
                        else {
                            res.json("ERROR")
                        }


                    }
                    else {
                        res.json("not updated PayrollFile")
                    }

                } else {
                    res.json("not updated")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function sumRecWkHr(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = ` select SUM(rec_reg_hr+rec_ot_hr+rec_holiday_hr) AS sum from tbl_rec_work_hr where recruitee_id=${data.recruitee_id} and assignment_id=${data.assignment_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getPayrollFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = ` select distinct assignment_id,recruitee_id from tbl_payroll_invoice where acc_file_id=${data.acc_file_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function updateAccountFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_account_file set ? where acc_file_id=${data.acc_file_id}`;
        let post = {
            approval_status: "approved"
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatePayrollFile(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_payroll_invoice set ? where acc_file_id=${data.acc_file_id}`;
        let post = {
            payroll_status: "approved"
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateAssignmentWkHr(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")

        let sql = `update tbl_assignment set ? where assignment_id=${data.assignment_id}`;
        let post = {
            total_working_hr: data1
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}


















app.post("/vcsapi/add/api/name/tbl/system_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await addSystemName(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not added")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function addSystemName(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_system_name set ?`;
        let post = {
            system_name: data.system_name
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/add/api/name/tbl/standard_document", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await addStandardDocName(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not added")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function addStandardDocName(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_standard_document set ?`;
        let post = {
            doc_name: data.doc_name,
            doc_status: "active"
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/name/tbl/system_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await updateSystemName(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not added")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateSystemName(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_system_name set ? where system_name_id=${data.system_name_id}`;
        let post = {
            system_name: data.system_name
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/assignment_status/tbl/assignment", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_assignment_status = await getAssignmentStatus(req.body.assignment_id);

                if (req.body.assignment_status === "working") {
                    let jsn = {
                        hdate: req.body.effective_date,
                        cdate: req.body.closing_date
                    }
                    var post = await updateAssignmentStatusByAIDBoth(req.body, jsn);
                    if (post === "success") {
                        var post1 = await updateApplicationHiringDate(get_assignment_status[0].application_id, jsn);
                        if (post1 === "success") {
                            var post2 = await updateonboardData(get_assignment_status[0].onboarding_id, jsn);
                            if (post2 === "success") {
                                var post3 = await updatepayrateData(get_assignment_status[0], jsn);
                                if (post3 === "success") {
                                    var post4 = await updatechangelogData(get_assignment_status[0], jsn);
                                    if (post4 === "success") {
                                        res.json(post4);
                                    } else {
                                        res.json("not updated")
                                    }
                                } else {
                                    res.json("not updated")
                                }
                            } else {
                                res.json("not updated")
                            }
                        } else {
                            res.json("not updated")
                        }
                    }
                    else {
                        res.json("not updated")
                    }



                } else if (req.body.assignment_status === "closed") {
                    let jsn = {
                        cdate: req.body.closing_date
                    }
                    var post = await updateAssignmentStatusByAIDClosed(req.body, jsn);

                    if (post === "success") {
                        var post1 = await updateOnboardDataClose(get_assignment_status[0].onboarding_id, jsn);

                        if (post1 === "success") {
                            var post2 = await updatepayrateDataClose(get_assignment_status[0], jsn);

                            if (post2 === "success") {
                                var post3 = await updatechangelogDataClose(get_assignment_status[0], jsn);

                                if (post3 === "success") {
                                    res.json(post3);
                                } else {
                                    res.json("not updated")
                                }
                            } else {
                                res.json("not updated")
                            }
                        } else {
                            res.json("not updated")
                        }
                    } else {
                        res.json("not updated")
                    }
                } else if (req.body.assignment_status === "not_started") {
                    let jsn = {
                        hdate: "",
                        cdate: ""
                    }
                    var post = await updateAssignmentStatusByAIDBoth(req.body, jsn);
                    var post1 = await updateApplicationHiringDate(get_assignment_status[0].application_id, jsn);
                    if (post1 === "success") {
                        res.json(post);
                    } else {
                        res.json("not updated")
                    }
                }


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateAssignmentStatusByAIDHired(sts, j) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_assignment set ? where assignment_id=${sts.assignment_id}`;
        let post = {
            assignment_status: sts.assignment_status,
            hiring_date: j.hdate
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
function updateAssignmentStatusByAIDClosed(sts, j) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_assignment set ? where assignment_id=${sts.assignment_id}`;
        let post = {
            assignment_status: sts.assignment_status,
            closing_date: j.cdate
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
function updateAssignmentStatusByAIDBoth(sts, j) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_assignment set ? where assignment_id=${sts.assignment_id}`;
        let post = {
            assignment_status: sts.assignment_status,
            hiring_date: j.hdate,
            closing_date: j.cdate
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatepayrateData(data1, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_pay_rate set ? where application_id=${data1.application_id} and recruitee_id=${data1.recruitee_id}`;
        let post = {
            proposed_start_date: moment(new Date(data.hdate)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.cdate)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateonboardData(id, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_onboarding set ? where onboarding_id=${id}`;
        let post = {
            proposed_start_date: moment(new Date(data.hdate)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.cdate)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatechangelogData(data1, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_pay_rate_change_log set ? where application_id=${data1.application_id} and recruitee_id=${data1.recruitee_id}`;
        let post = {
            proposed_start_date: moment(new Date(data.hdate)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.cdate)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}


function updatepayrateDataClose(data1, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_pay_rate set ? where application_id=${data1.application_id} and recruitee_id=${data1.recruitee_id}`;
        let post = {
            proposed_end_date: moment(new Date(data.cdate)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateOnboardDataClose(id, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_onboarding set ? where onboarding_id=${id}`;
        let post = {
            proposed_end_date: moment(new Date(data.cdate)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatechangelogDataClose(data1, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_pay_rate_change_log set ? where application_id=${data1.application_id} and recruitee_id=${data1.recruitee_id}`;
        let post = {
            proposed_end_date: moment(new Date(data.cdate)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateApplicationHiringDate(aid, j) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_application set ? where application_id=${aid}`;
        let post = {
            hiring_date: j.hdate
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateAssignmentStatusByAID(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_assignment set ? where assignment_id=${data.assignment_id}`;
        let post = {
            assignment_status: data.assignment_status
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/name/tbl/standard_document", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await updateStandardDocName(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not added")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateStandardDocName(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_standard_document set ? where doc_id = ${data.doc_id}`;
        let post = {
            doc_name: data.doc_name
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/status/tbl/system_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await updateSystemStatus(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not added")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateSystemStatus(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_system_name set ? where system_name_id=${data.system_name_id}`;
        let post = {
            system_name_status: data.system_name_status
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/status/tbl/standard_document", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await updateStandardDocStatus(req.body);
                if (post === "success") {
                    res.json(post);
                } else {
                    res.json("not added")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateStandardDocStatus(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_standard_document set ? where doc_id = ${data.doc_id}`;
        let post = {
            doc_status: data.doc_status
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.get("/vcsapi/get/api/tbl/standard_document/all", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let jobclients = await getStandardDocumentsallList();
                // //console.log(jobclients)
                res.json(jobclients);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getStandardDocumentsallList() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_standard_document  where doc_name!='facility_spec' and doc_name!='other'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.get("/vcsapi/get/api/tbl/system_name/all", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let jobclients = await getSystemNameallList();
                res.json(jobclients);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getSystemNameallList() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_system_name`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}



app.post('/vcsapi/api/get/standard/document/by/doc_id', stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                const data = await getStandardDocuments(req.body.doc_id);
                return res.json(data);
            } catch (err) {
                return res.send("ERROR");
            }


        }
        apps();
    } else {
        res.json("token is not valid");
    }
});

function getStandardDocuments(dID) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_standard_document AS a  where a.doc_id=${dID}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/update/api/onboarding_status/completed/onboarding", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let onb_process = await updateOnboardingStatusFinished(req.body);
                if (onb_process === "success") {

                    res.json("success");

                } else {
                    res.json("not updated")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/update/api/onboarding_status/cancelled/onboarding", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let onb_process = await updateOnboardingStatusCancelled(req.body);
                if (onb_process === "success") {

                    res.json("success");

                } else {
                    res.json("not updated")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/edit/api/change/user_status/delete/byApplicantID", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let applicant_ids = []
                applicant_ids = req.body.user_ids;
                //console.log(applicant_ids)
                for (i in applicant_ids) {
                    var userstatus = await deleteMultipleApplicant(applicant_ids[i]);
                }
                if (userstatus === "success") {
                    res.json("success");
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function deleteMultipleApplicant(data) {
    return new Promise(function (resolve, reject) {

        let sql = `update tbl_user set ?  where user_id=${data} `;
        let post = {
            user_status: "deleted"
        };

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateOnboardingStatusFinished(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_onboarding set ? where onboarding_id=${data.onboarding_id}`;
        let post = {
            onboarding_status: "completed"
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateOnboardingStatusCancelled(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_onboarding set ? where onboarding_id=${data.onboarding_id}`;
        let post = {
            onboarding_status: "cancelled",
            onboard_cancel_date: data.onboard_cancel_date
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
function updateOnboardingStatus(data, s) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_onboarding set ? where onboarding_id=${data}`;
        let post = {
            hiring_status: s
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/update/api/onboarding/hired/accepted", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);
                let onb_process = await updateOnboardingStatusHired(req.body);
                if (onb_process === "success") {
                    let onb_process1 = await updatepayrate(req.body);
                    if (onb_process1 === "success") {
                        let onb_process2 = await updatechangelog(req.body);
                        if (onb_process2 === "success") {
                            let rec_status = await updateRecruiteeStatusHired(req.body);
                            if (rec_status === "success") {
                                let onb_appl_updt = await updateOnboardindApplicationStatusHired(req.body);
                                if (onb_appl_updt === "success") {
                                    let assgninsert = await insertAssignment(req.body);
                                    if (assgninsert === "success") {
                                        res.json("success");
                                    } else {
                                        res.json("not added");
                                    }
                                } else {
                                    res.json("not updated")
                                }
                            } else {
                                res.json("not updated")
                            }
                        } else {
                            res.json("not updated")
                        }
                    } else {
                        res.json("not updated")
                    }
                } else {
                    res.json("not updated")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateOnboardingStatusHired(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_onboarding set ? where onboarding_id=${data.onboarding_id}`;
        let post = {
            hiring_status: "hired",
            proposed_start_date: moment(new Date(data.hiring_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.closing_date)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatepayrate(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_pay_rate set ? where application_id=${data.application_id} and recruitee_id=${data.recruitee_id}`;
        let post = {
            proposed_start_date: moment(new Date(data.hiring_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.closing_date)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatechangelog(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update  tbl_pay_rate_change_log set ? where application_id=${data.application_id} and recruitee_id=${data.recruitee_id}`;
        let post = {
            proposed_start_date: moment(new Date(data.hiring_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.closing_date)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateOnboardindApplicationStatusHired(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let sql = `update  tbl_application set ? where application_id=${data.application_id}`;
        let post = {
            application_stage: "hired",
            application_status: "accepted",
            hiring_date: moment(new Date(data.hiring_date)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
function updateRecruiteeStatusHired(data) {
    return new Promise(function (resolve, reject) {

        let sql = `update  tbl_recruitee set ? where recruitee_id=${data.recruitee_id}`;
        let post = {
            recruit_status: "hired"

        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
function insertAssignment(data) {
    return new Promise(function (resolve, reject) {

        let sql = `insert into tbl_assignment set ? `;
        let post = {

            client_id: data.client_id,
            recruitee_id: data.recruitee_id,
            onboarding_id: data.onboarding_id,
            application_id: data.application_id,
            hiring_date: data.hiring_date,
            job_id: data.job_id,
            assignment_status: data.assignment_status,
            closing_date: moment(new Date(data.closing_date)).format("MM/DD/YYYY")

        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}
app.get("/vcsapi/get/api/assignment/and/client/data", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let post = await getAssignmentData1();
                res.json(post);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAssignmentData1() {
    return new Promise(function (resolve, reject) {

        let sql = `SELECT distinct b.* FROM tbl_assignment AS a 
                    INNER JOIN tbl_client AS b ON b.client_id=a.client_id`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("updated")
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/get/api/standard/docby/IDs", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let checkIfexists = "ERROR";

                let get_recruitee = await getRecruitee(req.body.user_id);
                if (get_recruitee.length) {
                    checkIfexists = await getstdDocID(req.body.doc_id, get_recruitee[0].recruitee_id);
                }

                res.json(checkIfexists);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getstdDocID(rdID, recruitee_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_recruitee_document AS a INNER JOIN tbl_standard_document As b ON a.doc_id=b.doc_id
        WHERE a.recruitee_id=${recruitee_id} and b.doc_id=${rdID} and a.rec_doc_type='standard' AND a.rec_doc_status="current"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/get/api/facility/doc/byname", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let checkIfexists = "ERROR";

                let get_recruitee = await getRecruitee(req.body.user_id);
                if (get_recruitee.length) {
                    checkIfexists = await getfacDocName(req.body.doc_name, get_recruitee[0].recruitee_id);
                }

                res.json(checkIfexists);

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getfacDocName(rdName, recruitee_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_recruitee_document 
        WHERE recruitee_id=${recruitee_id} and rec_doc_name="${rdName}" and rec_doc_type="facility_spec" AND rec_doc_status="current"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/api/other/doc/byname", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let checkIfexists = "ERROR";

                let get_recruitee = await getRecruitee(req.body.user_id);
                if (get_recruitee.length) {
                    checkIfexists = await getothrDocName(req.body.doc_name, get_recruitee[0].recruitee_id);
                }

                res.json(checkIfexists);

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getothrDocName(rdName, recruitee_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_recruitee_document 
        WHERE recruitee_id=${recruitee_id} and rec_doc_name="${rdName}" and rec_doc_type="other" AND rec_doc_status="current"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/test/test/test", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let chk = await checkOnboardindDetails(req.body);
                res.json(chk)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/payrate_details/process/data", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let count = 0;
                var application = await getApplicationByID(req.body.application_id);
                if (application.length > 0 && application[0].application_id) {

                    if (application[0].application_stage === "offered") {
                        var onb_payrate = await updatePayRateDATA(req.body);
                        if (onb_payrate === "success") {
                            count++;
                        }
                    }
                    else if (application[0].application_stage === "offer_accepted" || application[0].application_stage === "onboarding" || application[0].application_stage === "hired") {
                        var onb_payrate1 = await updatePayRateDATA(req.body);
                        if (onb_payrate1 === "success") {
                            var getOnboard = await getOnboardData(req.body);
                            var onb_update = await updateOnboardDATA(req.body, getOnboard[0].onboarding_id);
                            if (onb_update === "success") {
                                var insert = await insertlogDATA(req.body);
                                if (insert === "success") {
                                    count++;
                                }
                            }
                        }


                    }

                }

                if (count === 1) {
                    res.json("success")
                }
                else {
                    res.json("ERROR")
                }


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});


app.post("/vcsapi/update/api/onboarding_details/onboarding/process", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {


                if (req.body.reqd_std_doc_id_list !== '') {
                    var std_list = (req.body.reqd_std_doc_id_list).split(',');
                }
                if (req.body.reqd_facility_doc_list !== '') {
                    var faclty_list = (req.body.reqd_facility_doc_list).split(',');
                }
                if (req.body.reqd_other_doc_list !== '') {
                    var other_list = (req.body.reqd_other_doc_list).split(',');
                }
                var arr = [];
                for (i in std_list) {
                    var checkIfexsts = await getstdDocByrdID(std_list[i], req.body.recruitee_id);
                    if (checkIfexsts.length > 0) {
                        arr.push(std_list[i]);
                    }
                }
                for (i in faclty_list) {
                    var checkIfexsts = await getfacDocByrdName(faclty_list[i], req.body.recruitee_id);
                    if (checkIfexsts.length > 0) {
                        arr.push(checkIfexsts[0].rec_doc_id);
                    }
                }
                for (i in other_list) {
                    var checkIfexists = await getothrDocByrdName(other_list[i], req.body.recruitee_id);
                    if (checkIfexists.length > 0) {
                        arr.push(checkIfexists[0].rec_doc_id);
                    }
                }
                // function onlyUnique(value, index, self) {
                //     return self.indexOf(value) === index;
                //   }
                // arr = arr.filter(onlyUnique);
                let uniqueItems = [...new Set(arr)]
                doc_id_list = uniqueItems.join(',');
                //console.log(arr);
                var onb_process = await updateOnboardindDetails(req.body, doc_id_list);
                if (onb_process === "success") {
                    let onb_appl_updt = await updateOnboardindApplicationDetails(req.body);
                    if (onb_appl_updt === "success") {
                        res.json("success");
                    } else {
                        res.json("not updated")
                    }
                } else {
                    res.json("not updated")
                }


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getLatestOnboardindDetails() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct * from tbl_onboarding order by onbording_id desc`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getstdDocByrdID(rdID, recruitee_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_recruitee_document AS a INNER JOIN tbl_standard_document As b ON a.doc_id=b.doc_id
        WHERE a.recruitee_id=${recruitee_id} and b.doc_id=${rdID} and a.rec_doc_type='standard'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getfacDocByrdName(rdName, recruitee_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_recruitee_document 
        WHERE recruitee_id=${recruitee_id} and rec_doc_name="${rdName}" and rec_doc_type="facility_spec"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getothrDocByrdName(rdName, recruitee_id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_recruitee_document 
        WHERE recruitee_id=${recruitee_id} and rec_doc_name="${rdName}" and rec_doc_type="other"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function updateOnboardindDetails(data, a) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_onboarding set ? where onboarding_id=${data.onboarding_id}`;
        let post = {

            reqd_std_doc_id_list: data.reqd_std_doc_id_list,
            reqd_facility_doc_list: data.reqd_facility_doc_list,
            reqd_other_doc_list: data.reqd_other_doc_list,
            reqd_doc_id_list: a,
            due_date: moment(new Date(data.due_date)).format("MM/DD/YYYY"),
            comments: data.comments,
            onboarding_status: "in_progress",
            fill_up_status: "not_done"
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatePayRateDATA(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_pay_rate set ? where pay_rate_id=${data.pay_rate_id}`;
        let post = {
            proposed_start_date: moment(new Date(data.proposed_start_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.proposed_end_date)).format("MM/DD/YYYY"),
            onb_regular_bill_rate: data.onb_regular_bill_rate,
            onb_ot_bill_rate: data.onb_ot_bill_rate,
            onb_holiday_bill_rate: data.onb_holiday_bill_rate,
            onb_regular_pay_rate: data.onb_regular_pay_rate,
            onb_ot_pay_rate: data.onb_ot_pay_rate,
            onb_holiday_pay_rate: data.onb_holiday_pay_rate,
            per_dieum_wk: data.per_dieum_wk,
            ot_starts_after_wk: data.ot_starts_after_wk,
            pay_package_remarks: data.pay_package_remarks,
            total_shift_hr: data.total_shift_hr,
            shift_details: data.shift_details,
            rto: data.rto,
            contract_duration_wk: data.contract_duration_wk
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateOnboardDATA(data, id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_onboarding set ? where onboarding_id=${id}`;
        let post = {
            proposed_start_date: moment(new Date(data.proposed_start_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.proposed_end_date)).format("MM/DD/YYYY"),
            onb_regular_bill_rate: data.onb_regular_bill_rate,
            onb_ot_bill_rate: data.onb_ot_bill_rate,
            onb_holiday_bill_rate: data.onb_holiday_bill_rate,
            onb_regular_pay_rate: data.onb_regular_pay_rate,
            onb_ot_pay_rate: data.onb_ot_pay_rate,
            onb_holiday_pay_rate: data.onb_holiday_pay_rate,
            per_dieum_wk: data.per_dieum_wk,
            ot_starts_after_wk: data.ot_starts_after_wk,
            pay_package_remarks: data.pay_package_remarks,
            total_shift_hr: data.total_shift_hr,
            shift_details: data.shift_details,
            rto: data.rto,
            contract_duration_wk: data.contract_duration_wk
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateOnboardindApplicationDetails(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let sql = `update  tbl_application set ? where application_id=${data.application_id} `;
        let post = {
            application_stage: "onboarding",
            application_status: "accepted",
            onboarding_date: moment(new Date(strTime)).format("MM/DD/YYYY")
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/get/api/all/job/data/onboarding/hired/offer_accepted", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);
                let strdata = "";
                if (req.body.client_id !== "ALL") {
                    strdata = ` AND a.client_id=${req.body.client_id}`;
                }
                if (req.body.country !== "ALL") {
                    strdata = strdata + ` AND a.country='${req.body.country}'`;
                }
                if (req.body.state !== "ALL") {
                    strdata = strdata + ` AND a.state='${req.body.state}'`;
                }
                if (req.body.city !== "ALL") {
                    strdata = strdata + ` AND a.city='${req.body.city}'`;
                }
                if (req.body.status !== "ALL") {
                    strdata = strdata + ` AND c.onboarding_status='${req.body.status}'`;
                }
                let jobdata = await getJobdataOfOBHOA(strdata, req.body);
                res.json(jobdata);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobdataOfOBHOA(str, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT DISTINCT * FROM tbl_job AS a 
        INNER JOIN tbl_application AS b ON a.job_id=b.job_id
        INNER JOIN tbl_onboarding AS c ON c.application_id=b.application_id
        INNER JOIN tbl_client AS d ON d.client_id=a.client_id
        INNER JOIN tbl_recruitee AS e ON e.recruitee_id=b.recruitee_id
        INNER JOIN tbl_recruitee_details AS f ON e.recruitee_id=f.recruitee_id
        INNER JOIN tbl_user AS g ON g.user_id=e.user_id
        LEFT JOIN tbl_profession AS h ON h.profession_id=f.profession
        LEFT JOIN tbl_speciality AS i ON i.speciality_id=f.speciality
        INNER JOIN tbl_assign_manager AS j ON j.application_id=b.application_id
        WHERE (b.application_stage="offer_accepted" OR b.application_stage="onboarding" OR b.application_stage="hired")  
         ${str} `;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/api/all/job/data/hired", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);
                let strdata = "";
                if (req.body.client_id !== "ALL") {
                    strdata = ` AND a.client_id=${req.body.client_id}`;
                }
                if (req.body.job_id !== "ALL") {
                    strdata = ` AND a.job_id=${req.body.job_id}`;
                }

                if (req.body.status !== "ALL") {
                    strdata = strdata + ` AND k.assignment_status='${req.body.status}'`;
                }
                let jobdata = await getJobdataHire(strdata, req.body);
                res.json(jobdata);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobdataHire(str, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_job AS a 
        INNER JOIN tbl_application AS b ON a.job_id=b.job_id
        INNER JOIN tbl_onboarding AS c ON c.application_id=b.application_id
        INNER JOIN tbl_client AS d ON d.client_id=a.client_id
        INNER JOIN tbl_recruitee AS e ON e.recruitee_id=b.recruitee_id
        INNER JOIN tbl_recruitee_details AS f ON e.recruitee_id=f.recruitee_id
        INNER JOIN tbl_user AS g ON g.user_id=e.user_id
        LEFT JOIN tbl_profession AS h ON h.profession_id=f.profession
        LEFT JOIN tbl_speciality AS i ON i.speciality_id=f.speciality
        INNER JOIN tbl_assignment AS k ON k.application_id=b.application_id AND k.client_id=d.client_id AND k.onboarding_id=c.onboarding_id
         AND k.job_id=a.job_id AND k.recruitee_id=e.recruitee_id
        WHERE (b.application_stage="offer_accepted" OR b.application_stage="onboarding" OR b.application_stage="hired")  
         ${str}`;
        //  INNER JOIN tbl_assign_manager AS j ON j.application_id=b.application_id
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/recruitee/status/by/user_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let get = await getRecruitee(req.body.user_id);
                res.json(get);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});


app.get("/vcsapi/get/api/tbl/job/all/clients", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let jobclients = await getJobClients();
                res.json(jobclients);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobClients() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct c.* FROM tbl_job j inner join
        tbl_client as c on j.client_id=c.client_id  order by c.client_name`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.post("/vcsapi/get/api/tbl/job/all/city", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let str = "";
                if (req.body.state !== "ALL") {
                    str = `where state="${req.body.state}" `
                }
                let jobclients = await getJobCity(str);
                res.json(jobclients);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobCity(str) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct city FROM tbl_job ${str}  order by city`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.get("/vcsapi/get/api/tbl/job/all/state", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let jobclients = await getJobState();
                res.json(jobclients);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobState() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct state FROM tbl_job  order by state`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
app.get("/vcsapi/get/api/tbl/job/all/country", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let jobclients = await getJobCountry();
                res.json(jobclients);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobCountry() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct country FROM tbl_job  order by country`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}


app.post("/vcsapi/get/api/tbl/job/search_job/with/filter", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                var allJob = []
                if (req.body.s1 === "" && req.body.s2 === "" && req.body.s3 === "") {
                    let searchResult = await getallJobLists();
                    let set = new Set();
                    for (let i in searchResult) {
                        set.add(searchResult[i].job_id)
                    }
                    allJob = [...set];
                }
                else if (req.body.s1 !== "" && req.body.s2 !== "" && req.body.s3 !== "") {

                    let set = new Set();

                    var searchResultS1 = await getAllJobOfS1s2s3(req.body.s1, req.body.s2, req.body.s3);
                    if (searchResultS1.length) {
                        for (let i in searchResultS1) {
                            set.add(searchResultS1[i].job_id)
                        }

                    }
                    allJob = [...set];

                }
                else if (req.body.s1 === "" && req.body.s2 === "" && req.body.s3 !== "") {
                    let set = new Set();
                    var searchResultS3 = await getAllJobOfS3(req.body.s3);
                    if (searchResultS3.length) {
                        for (let i in searchResultS3) {
                            set.add(searchResultS3[i].job_id)
                        }

                    }
                    allJob = [...set];
                }
                else if (req.body.s1 === "" && req.body.s2 !== "" && req.body.s3 !== "") {
                    let set = new Set();
                    var searchResultS3 = await getAllJobOfs2s3(req.body.s2, req.body.s3);
                    if (searchResultS3.length) {
                        for (let i in searchResultS3) {
                            set.add(searchResultS3[i].job_id)
                        }

                    }
                    allJob = [...set];
                }
                else if (req.body.s1 !== "" && req.body.s2 !== "" && req.body.s3 === "") {
                    let set = new Set();
                    var searchResultS3 = await getAllJobOfs1s2(req.body.s1, req.body.s2);
                    if (searchResultS3.length) {
                        for (let i in searchResultS3) {
                            set.add(searchResultS3[i].job_id)
                        }

                    }
                    allJob = [...set];
                }
                else if (req.body.s1 !== "" && req.body.s2 === "" && req.body.s3 !== "") {
                    let set = new Set();
                    var searchResultS3 = await getAllJobOfS1s3(req.body.s1, req.body.s3);
                    if (searchResultS3.length) {
                        for (let i in searchResultS3) {
                            set.add(searchResultS3[i].job_id)
                        }

                    }
                    allJob = [...set];
                }
                else if (req.body.s1 === "" && req.body.s2 !== "" && req.body.s3 === "") {
                    let set = new Set();
                    var searchResultS3 = await getAllJobOfS2(req.body.s2);
                    if (searchResultS3.length) {
                        for (let i in searchResultS3) {
                            set.add(searchResultS3[i].job_id)
                        }
                    }

                    allJob = [...set];
                }
                else if (req.body.s1 !== "" && req.body.s2 === "" && req.body.s3 === "") {
                    let set = new Set();
                    var searchResultS3 = await getAllJobOfS1(req.body.s1);
                    if (searchResultS3.length) {
                        for (let i in searchResultS3) {
                            set.add(searchResultS3[i].job_id)
                        }
                    }

                    allJob = [...set];
                }
                //console.log(allJob);

                let getList = await getallJobListsByIDS(allJob.join(','));



                res.json(getList);




            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAllJobOfS1s2s3(s1, s2, s3) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open")
            AND (j.job_title like "%${s1}%"
            or j.job_description like "%${s1}%"
            or j.req_information like "%${s1}%")
            AND (j.city like "%${s2}%" 
            or j.state like "%${s2}%" or j.country like "%${s2}%" )
            AND j.position_type ="${s3}" `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAllJobOfs2s3(s2, s3) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open")
            AND (j.city like "%${s2}%" 
            or j.state like "%${s2}%" or j.country like "%${s2}%" )
            AND j.position_type ="${s3}" `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAllJobOfs1s2(s1, s2) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open")
            AND (j.job_title like "%${s1}%"
            or j.job_description like "%${s1}%"
            or j.req_information like "%${s1}%")
            AND (j.city like "%${s2}%" 
            or j.state like "%${s2}%" or j.country like "%${s2}%" ) `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAllJobOfS1s3(s1, s3) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open")
            AND (j.job_title like "%${s1}%"
            or j.job_description like "%${s1}%"
            or j.req_information like "%${s1}%")
            AND j.position_type ="${s3}" `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAllJobOfS1(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open")
            AND (j.job_title like "%${data}%"
            or j.job_description like "%${data}%"
            or j.req_information like "%${data}%") `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAllJobOfS2(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open" ) and (j.city like "%${data}%" 
        or j.state like "%${data}%" or j.country like "%${data}%" )`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAllJobOfS3(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where (j.job_status="open") 
        and j.position_type ="${data}"
        `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getallJobLists() {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where j.job_status="open" ORDER BY j.job_id DESC`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getallJobListsByIDS(jobId) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where j.job_status="open" and j.job_id IN(${jobId}) ORDER BY j.job_id DESC`;
        db.query(sql, function (err, res) {
            //console.log(sql)
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/api/tbl/job/by/id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {


                let getList = await getJobByIDS(req.body.job_id);



                res.json(getList);




            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJobByIDS(jobId) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,c.*,d.*,e.*,f.system_name AS system_name_name from  tbl_job AS j 
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        where j.job_status="open" and j.job_id =${jobId} ORDER BY j.job_id DESC`;
        db.query(sql, function (err, res) {
            //console.log(sql)
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}



app.post("/vcsapi/add/api/tbl/profession", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let add = await addProfessionName(req.body);
                if (add === "success") {
                    res.json("success");
                } else {
                    res.json("profession not inserted")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/add/api/tbl/job_type", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add = await addJobTypeName(req.body);
                if (add === "success") {
                    res.json("success");
                } else {
                    res.json("job_type not inserted")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/add/api/tbl/job_sector", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add = await addJobSectorName(req.body);
                if (add === "success") {
                    res.json("success");
                } else {
                    res.json("job_sector not inserted")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/add/api/tbl/position_type", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add = await addPositionTypeName(req.body);
                if (add === "success") {
                    res.json("success");
                } else {
                    res.json("position_type not inserted")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/add/api/tbl/speciality", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add = await addSpecialityName(req.body);
                if (add === "success") {
                    res.json("success");
                } else {
                    res.json("speciality not inserted")
                }
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});





app.get("/vcsapi/get/api/tbl/profession", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_profession = await getProfession();
                res.json(get_profession);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/profession_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let professionstatus = await updateProfessionStatus(req.body);
                res.json(professionstatus);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/profession_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let professionname = await updateProfessionName(req.body);
                res.json(professionname);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/tbl/job_type", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_job_type = await getJobTpyes();
                res.json(get_job_type);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/get/api/tbl/job/job/by/client_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_job = await getJobByClientID(req.body.client_id);
                res.json(get_job);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/job_type_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let job_typestatus = await updateJobTypeStatus(req.body);
                res.json(job_typestatus);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/job_type_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let job_typename = await updateJobTypeName(req.body);
                res.json(job_typename);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/tbl/job_sector", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_job_sector = await getJobSector();
                res.json(get_job_sector);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/job_sector_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let job_sectorstatus = await updateJobSectorStatus(req.body);
                res.json(job_sectorstatus);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/job_sector_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let job_sectorname = await updateJobSectorName(req.body);
                res.json(job_sectorname);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/tbl/position_type", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_position_type = await getPositionType();
                res.json(get_position_type);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/position_type_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let position_type_status = await updatePositionTypeStatus(req.body);
                res.json(position_type_status);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/position_type_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let position_type_name = await updatePositionTypeName(req.body);
                res.json(position_type_name);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/tbl/speciality", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_speciality = await getSpeciality();
                res.json(get_speciality);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/speciality_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let speciality_status = await updateSpecialityStatus(req.body);
                res.json(speciality_status);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/speciality_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let speciality_name = await updateSpecialityName(req.body);
                res.json(speciality_name);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/recruiter_id/by/application_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let post = await updateRecruiterIDinAssgnMgr(req.body);
                let a = await checkUserIfExistInIncentive(req.body);

                if (a.length > 0) {
                    var post1 = await updateRecruiterIDinAssgnMgrIncentive(req.body);
                }
                else {
                    var post1 = await inserOthersIDinAssgnMgrIncentive(req.body);
                }
                res.json(post1);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/teamLead_id/by/application_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let post = await updateTeamLeadIDinAssgnMgr(req.body);
                let a = await checkUserIfExistInIncentive(req.body);

                if (a.length > 0) {
                    var post1 = await updateRecruiterIDinAssgnMgrIncentive(req.body);
                }
                else {
                    var post1 = await inserOthersIDinAssgnMgrIncentive(req.body);
                }
                res.json(post1);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/Manager_id/by/application_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let post = await updateManagerIDinAssgnMgr(req.body);
                let a = await checkUserIfExistInIncentive(req.body);

                if (a.length > 0) {
                    var post1 = await updateRecruiterIDinAssgnMgrIncentive(req.body);
                }
                else {
                    var post1 = await inserOthersIDinAssgnMgrIncentive(req.body);
                }
                res.json(post1);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/onb_mgr_id/by/application_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let post = await updateONBmgrIDinAssgnMgr(req.body);
                let a = await checkUserIfExistInIncentive(req.body);

                if (a.length > 0) {
                    var post1 = await updateRecruiterIDinAssgnMgrIncentive(req.body);
                }
                else {
                    var post1 = await inserOthersIDinAssgnMgrIncentive(req.body);
                }

                res.json(post1);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/insert/update/api/others/by/application_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let post = await checkUserIfExistInIncentive(req.body);
                console.log(post.length)
                if (post.length > 0) {
                    var post1 = await updateRecruiterIDinAssgnMgrIncentive(req.body);
                }
                else {
                    var post1 = await inserOthersIDinAssgnMgrIncentive(req.body);
                }

                res.json(post1);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/get/api/roles/by/application_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let post = await selectRolesByapplication(req.body);
                res.json(post);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateRecruiterIDinAssgnMgr(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_assign_manager set ? where application_id=${data.application_id}`;
        let post = {
            recruiter_id: data.user_id
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateRecruiterIDinAssgnMgrIncentive(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_manager_incentive set ? where application_id=${data.application_id} AND user_role_id=${data.role_id}`;
        let post = {
            user_id: data.user_id,
            incentive_perc: data.incentive_percentage
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function checkUserIfExistInIncentive(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_manager_incentive where application_id=${data.application_id} AND user_role_id=${data.role_id}`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve(res);
            }
        })
    })
}

function selectRolesByapplication(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_manager_incentive where application_id=${data.application_id} `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve(res);
            }
        })
    })
}


function inserOthersIDinAssgnMgrIncentive(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_manager_incentive set ? `;
        var post = {
            application_id: data.application_id,
            recruitee_id: data.recruitee_id,
            user_id: data.user_id,
            user_role_id: data.role_id,
            incentive_perc: data.incentive_percentage
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateTeamLeadIDinAssgnMgr(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_assign_manager set ? where application_id=${data.application_id}`;
        let post = {
            team_lead_id: data.user_id
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateManagerIDinAssgnMgr(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_assign_manager set ? where application_id=${data.application_id}`;
        let post = {
            manager_id: data.user_id
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateONBmgrIDinAssgnMgr(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_assign_manager set ? where application_id=${data.application_id}`;
        let post = {
            onb_mgr_id: data.user_id
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}
app.post("/vcsapi/insert/api/tbl/application", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let rid = await getRecruitee(req.body.user_id);
                let user_ids = [];
                console.log(req.body)
                if (rid.length > 0) {
                    let getLatestApplication_ = await getLatestApplication();
                    let add_appication = await addApplication(req.body, rid[0].recruitee_id, getLatestApplication_);
                    console.log("application--", add_appication)
                    if (add_appication === "success") {
                        let getLApplication = await getLatestApplication();
                        let getAdID = await getAdminID();
                        let updAppl = await updateApplicants(req.body);
                        if (updAppl === "success") {
                            let get_job_post_by = await getJobpostby(getLApplication[0].job_id);
                            if (get_job_post_by.length > 0) {
                                let supervisor = await getSupervisor(get_job_post_by[0].job_post_by);
                                if (supervisor.length > 0 && supervisor[0].supervisor_name) {
                                    let supervisor2 = await getSupervisor(supervisor[0].supervisor_name);
                                    if (supervisor2.length > 0 && supervisor2[0].supervisor_name) {
                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: supervisor[0].supervisor_name,
                                            manager_id: supervisor2[0].supervisor_name,
                                            admin_id: getAdID[0].user_id
                                        }

                                        user_ids = [
                                            { user_id: get_job_post_by[0].job_post_by },
                                            { user_id: supervisor[0].supervisor_name },
                                            { user_id: supervisor2[0].supervisor_name },
                                            { user_id: getAdID[0].user_id }
                                        ]
                                    } else {

                                        var j = {
                                            recruiter_id: get_job_post_by[0].job_post_by,
                                            team_lead_id: supervisor[0].supervisor_name,
                                            manager_id: getAdID[0].user_id,
                                            admin_id: getAdID[0].user_id
                                        }

                                        user_ids = [
                                            { user_id: get_job_post_by[0].job_post_by },
                                            { user_id: supervisor[0].supervisor_name },
                                            { user_id: getAdID[0].user_id },
                                            { user_id: getAdID[0].user_id }
                                        ]
                                    }
                                } else {

                                    var j = {
                                        recruiter_id: get_job_post_by[0].job_post_by,
                                        team_lead_id: getAdID[0].user_id,
                                        manager_id: getAdID[0].user_id,
                                        admin_id: getAdID[0].user_id
                                    }

                                    user_ids = [
                                        { user_id: get_job_post_by[0].job_post_by },
                                        { user_id: getAdID[0].user_id },
                                        { user_id: getAdID[0].user_id },
                                        { user_id: getAdID[0].user_id }
                                    ]
                                }

                            }
                            for (let k = 0; k < user_ids.length; k++) {
                                var userRoleId = await getRoleOfEmployee(user_ids[k].user_id);
                                console.log(userRoleId, user_ids[k].user_id)
                                var addIncen_perc = await updateAssignManagerIncentiveTable(user_ids[k].user_id, rid[0].recruitee_id, getLApplication[0].application_id, userRoleId);
                            }
                            let addasgn_mgr = await updateAssignManagerTable(req.body, rid[0].recruitee_id, getLApplication[0].application_id, j);
                            console.log("response----", addasgn_mgr)
                            res.json(addasgn_mgr);
                        } else {
                            res.json("error");
                        }

                    } else {
                        res.json("error");
                    }
                } else {
                    res.json("recruitee_id not found");
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/edit/api/application", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let adduadetail = await updateApplicantUserDetails(req.body)
                if (adduadetail === "success") {
                    let getrid = await getRecruitee(req.body.user_id)
                    if (getrid.length > 0) {
                        let addradetail = await updateApplicantRecruiteeDetails(req.body, getrid[0].recruitee_id);
                        if (addradetail === "success") {
                            res.json("success");
                        }
                    }
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/add/api/tbl/role/user_role", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add_urole = await addUserRole(req.body);
                res.json(add_urole);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/edit/api/change/role_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let rolename = await updateRoleName(req.body);
                res.json(rolename);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.get("/vcsapi/get/JobNo/applicationlist", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await getApplicationByJOBNO();
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getApplicationByJOBNO() {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT distinct a.* FROM tbl_job As a INNER JOIN tbl_application As b ON a.job_id=b.job_id`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.post("/vcsapi/get/JobNo/suggestionList", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await getJOBNOSuggestion(req.body.job_no);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getJOBNOSuggestion(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_job As a WHERE job_no LIKE "%${data}%" and job_status!='delete' `;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.post("/vcsapi/get/application/searchBar", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let str = "";
                if (req.body.client_id !== "ALL") {
                    str = str + `a.client_id="${req.body.client_id}" AND `
                } else {
                    str = str + `!isNull(a.client_id) AND `
                }
                if (req.body.job_no !== "ALL") {
                    str = str + `a.job_no="${req.body.job_no}" AND `
                } else {
                    str = str + `!isNull(a.job_no) AND `
                }
                if (req.body.job_status !== "ALL") {
                    str = str + `a.job_status="${req.body.job_status}" AND `
                }
                else {
                    str = str + `a.job_status!='delete' AND `;
                }
                if (req.body.posted_by !== "ALL") {
                    str = str + `a.job_post_by="${req.body.posted_by}"`
                } else {
                    str = str + `!isNull(a.job_post_by)`
                }

                let getApp = await getApplicationByclient(str);

                for (let i = 0; i < getApp.length; i++) {
                    let getCount = await applied_no(getApp[i].job_id);
                    let getCount1 = await applied_yes(getApp[i].job_id);
                    let getCount2 = await sortlisted(getApp[i].job_id);
                    let getCount3 = await offered(getApp[i].job_id);
                    let getCount4 = await apl_acc(getApp[i].job_id);


                    getApp[i]["applied_no"] = getCount.length;
                    getApp[i]["applied_no_details"] = getCount;
                    getApp[i]["applied_yes"] = getCount1.length;
                    getApp[i]["applied_yes_details"] = getCount1;
                    getApp[i]["sortlisted"] = getCount2.length;
                    getApp[i]["sortlisted_details"] = getCount2;
                    getApp[i]["offered"] = getCount3.length;
                    getApp[i]["offered_details"] = getCount3;
                    getApp[i]["apl_acc"] = getCount4.length;
                    getApp[i]["apl_acc_details"] = getCount4;
                }


                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function applied_no(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a 
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        LEFT JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where a.application_stage="applied" && a.review_status="no" AND a.job_id="${data}"`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function applied_yes(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a 
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        LEFT JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="applied" OR a.application_stage="sort_listed" OR a.application_stage="offered" OR a.application_stage="rejected" 
         OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired")  AND a.job_id="${data}"`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function sortlisted(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        LEFT JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="sort_listed" OR a.application_stage="offered" OR a.application_stage="rejected" 
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired")  AND a.job_id="${data}"`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function offered(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a 
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        LEFT JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="offered"
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired") 
         AND a.job_id="${data}"`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function apl_acc(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        LEFT JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="offer_accepted" OR a.application_stage="onboarding" OR a.application_stage="hired") 
         AND a.job_id="${data}"`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}



function getApplicationByclient(str) {
    console.log(str)
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_job As a  INNER JOIN tbl_client AS c ON c.client_id=a.client_id where ${str}`;
        db.query(sql, function (err, result) {
            // //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

//GET ALL DATA of tbl_app_action
app.get('/vcsapi/get/app_action', stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let data = await getAppAction();
                return res.status(200).json(data);

            } catch (err) {
                return res.send("ERROR")
            }


        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
//get data from tbl_app_user_access
app.post('/vcsapi/get/app_action_id_by_user_id', stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get = await getAppActionByUSERID(req.body.user_id);

                return res.status(200).json(get);
            } catch (err) {
                return res.send("ERROR")
            }

        }
        apps();
    } else {
        res.status(401).json(401);
    }
});
app.post("/vcsapi/update/login_block_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let rstatus = await updateBlockStatus(req.body);
                res.json(rstatus);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
//insert data into tbl_user_access
app.post('/vcsapi/post/user_access_insert', stuff.verifyToken, stuff.verify, function (req, res) {

    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body)
                if (req.body.data.length == "0") {
                    return res.status(400).json("ERROR");
                }
                ////get data from tbl_role_access according to roleid
                let get = await getUserAccess_(req.body.userId);
                //console.log("--------------------------------------------------SAVE 1 GET", get);
                //check condition
                if (get.length > 0) {
                    ///delete from tbl_user_access if exist    
                    let deletess = await deleteUserAccesIfExist(req.body);
                    // //console.log("--------------------------------------------------SAVE 2 DELETE", deletess);
                    let update_user = await updateUser(req.body.userId);
                    // //console.log("--------------------------------------------------SAVE 3 UPDATE USER", update_user);
                    //after delete insert data in tbl_user_access
                    let insert = await INSERTUserAcess(req.body.data, req.body);
                    // //console.log("--------------------------------------------------SAVE 4 INSERT AFTER DELETE", insert);

                    res.status(200).json("check_value")
                } else {

                    let update_user = await deleteUserAccesIfExist(req.body);
                    // //console.log("--------------------------------------------------SAVE 7 UPDATE USER", update_user);
                    let insert = await INSERTUserAcess(req.body.data, req.body);
                    // //console.log("--------------------------------------------------SAVE 8 INSERT USER", insert);
                    res.status(200).json("check_value");
                }
            } catch (err) {
                //console.log(err);
                return res.send("ERROR")
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/get/user/already/applied/job", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {


                let getApp = await checkApplicantStatusJob(req.body);
                res.json(getApp);






            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/get/user/already/applied/job/ByEmail", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {


                let getApp = await checkApplicantStatusJobByEmail(req.body);
                res.json(getApp);






            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function checkApplicantStatusJob(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user As c On c.user_id=b.user_id
        where a.job_id="${data.job_id}" AND c.user_id='${data.user_id}'`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function checkApplicantStatusJobByEmail(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user As c On c.user_id=b.user_id
        where a.job_id="${data.job_id}" AND c.email='${data.email}'`;
        db.query(sql, function (err, result) {
            //console.log(sql)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
//INSERT INTO tbl_app_user_access
app.post('/vcsapi/post/app_user_access_insert', stuff.verifyToken, stuff.verify, function (req, res) {

    if (verifys == "verify") {
        async function apps() {
            try {
                if (req.body.data.length == "0") {
                    return res.status(400).json("ERROR");
                }
                // //console.log(req.params.userId);
                var gets;
                ////get data from tbl_role_access according to roleid
                let get = await getAppUserAccess(req.body.userId);
                // //console.log("--------------------------------------------------SAVE 1 GET", get, req.params);
                //check condition
                if (get.length > 0) {
                    ///delete from tbl_user_access if exist    
                    let deletess = await deleteAppUserAccess(req.body);
                    // //console.log("--------------------------------------------------SAVE 2 DELETE", deletess, req.params);
                    let update_user = await updateUser(req.body.userId);
                    // //console.log("--------------------------------------------------SAVE 3 UPDATE USER", update_user);
                    //after delete insert data in tbl_user_access
                    let insert = await INSERTAPPUSERACCESS(req.body.data, req.body);
                    // //console.log("--------------------------------------------------SAVE 4 INSERT AFTER DELETE", insert);

                } else {

                    let update_user = await deleteAppUserAccess(req.body);
                    //console.log("--------------------------------------------------SAVE 7 UPDATE USER", update_user);
                    let insert = await INSERTAPPUSERACCESS(req.body.data, req.body);
                    //console.log("--------------------------------------------------SAVE 8 INSERT USER", insert);
                }
                res.status(200).json("check_value");
            } catch (err) {
                //console.log(err);
                return res.send("ERROR")
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/edit/api/change/role_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let rolestatus = await updateRoleStatus(req.body);
                res.json(rolestatus);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/user_roles", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let groles = await getRoles();
                res.json(groles);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/module/submodules", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let modules = await getmodsubmodule();
                res.json(modules);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
//////////////////
app.post("/vcsapi/add/api/tbl/user_access", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add_uaccess = await addUserAccess(req.body);
                res.json(add_uaccess);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
//////////////////////////////////////
app.post("/vcsapi/get/api/users", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let users = await getUsers(req.body.user_id);
                res.json(users);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/get/api/candidate/by/userID", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let users = await getCandidateByUser(req.body.user_id);
                res.json(users);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/add/api/tbl/employee/details", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body)
                let email = req.body.email.trim().replace(/\s/g, "");
                var mbl_no = req.body.phone.trim().replace(/\s/g, "");
                const saltRounds = 10;
                const hashedPassword = await new Promise((resolve, reject) => {
                    bcryptjs.hash("1234", saltRounds, function (err, hash) {
                        if (err) reject(err)
                        resolve(hash)
                    });
                });
                let insertUserEmp = await addUserDetlForEmp(req.body, email.toLowerCase(), mbl_no, hashedPassword);
                if (insertUserEmp === "success") {
                    let getLatestUse = await getLatestUser();
                    let get_action_id = await getActionId(req.body.role_id);
                    //console.log(get_action_id);
                    let add_employee = await addEmployee(req.body, getLatestUse[0].user_id);
                    //console.log(add_employee)
                    let insert_role_access = await INSERTINLOOP(get_action_id, getLatestUse[0].user_id);
                    //console.log(insert_role_access);
                    var obejct_check_code = {
                        post: insertUserEmp,
                        post_employee_hotels: add_employee,
                        insert_role_access: insert_role_access
                    }
                    let sendCreds = await sendCredsbyEmail(getLatestUse[0], "1234");
                    //console.log(sendCreds)
                    var codes = Object.values(obejct_check_code);
                    var code = check_status_code(codes);
                    //console.log("return",code);
                    return res.status(code).json(code);
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function sendCredsbyEmail(udata, passwd) {
    /////// email generate
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'registration@vishusa.com',
                pass: 'registrationVCS#2022'
            }
        });
        var mailOptions = {
            from: 'registration@vishusa.com',
            to: ((udata.email).trim()).toLowerCase(),
            subject: `User Credentials `,
            html: `Hi, "${udata.user_first_name}"<br/>Welcome!!!<br/>
            Your login credentials is as:<br/>
            email : <strong>${udata.email}</strong>
            <br/>
           
            password : <strong>${passwd}</strong>
            <br/>
            <br/><br/>Thanks & regards<br/>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                resolve("success");
            } else {
                //console.log(error)
                reject(error);
            }
        });
    });
}
app.post('/vcsapi/get/action_id_by_user_id', stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get = await userAccessByuser_id(req.body.user_id);
                var arry = [];
                for (i = 0; i <= get.length - 1; i++) {
                    arry.push(get[i].action_id);
                }
                return res.status(200).json(arry);
            } catch (err) {
                return res.send("ERROR")
            }

        }
        apps();
    } else {
        res.status(401).json(401);
    }
});
app.get("/vcsapi/get/all/employee/details", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getEmp = await getAllEmp();
                //console.log(getEmp)
                res.json(getEmp)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/checkIfExists/designation/:designation_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getdesig = await checkIfexistsDesignation(req.params);
                if (getdesig.length > 0) {
                    res.json("exist")

                } else {
                    res.json("do not exist")

                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/all/role", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getRole = await getAllRole();
                if (getRole.length) {

                    res.json(getRole);
                } else {
                    res.json("ERROR")
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/all/dept", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getComp = await getCompanyDetails();
                if (getComp.length) {
                    let getDept = await getAllDept(getComp[0].company_id);
                    if (getDept.length) {

                        res.json(getDept);
                    } else {
                        res.json("ERROR")
                    }
                } else {
                    res.json("ERROR")
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/check/supervisor_code", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getSup = await checkSupervisor((req.body.supervisor_code).trim().replace(/\s/g, "").toLowerCase());
                if (getSup.length) {

                    res.json("EXIST");
                } else {
                    res.json("DO NOT EXIST")
                }


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/tbl/company/details", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let add_company = await addCompanyDetails(req.body);
                res.json(add_company);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.get("/vcsapi/get/api/tbl/company/details", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let get_company = await getCompanyDetails(req.body);
                res.json(get_company);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
////LCrB.D
app.get("/vcsapi/get/api/department/byCID", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let cdet = await getCompanyDetails()
                let get_department = await getDepartmentDetailsbyid(cdet[0].company_id);
                for (let i = 0; i < get_department.length; i++) {
                    let get_user = await getEmpDepartmentbyid(get_department[i].dept_id);
                    // //console.log(get_user)
                    if (get_user.length) {
                        get_department[i]["count"] = get_user[0].count;
                    } else {
                        get_department[i]["count"] = 0;
                    }
                }
                // //console.log(get_department)
                res.json(get_department);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
/////
app.post("/vcsapi/add/api/department", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let cdet = await getCompanyDetails()
                let add_department = await addDepartmentDetails(req.body, cdet[0].company_id);
                res.json(add_department);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/update/api/department_name", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let cdet = await getCompanyDetails()
                let update_department = await updateDepartmentDetails(req.body, cdet[0].company_id);
                res.json(update_department);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/edit/api/change_status/department", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let cdet = await getCompanyDetails()
                let deptstatus = await updateDepartmentStatus(req.body, cdet[0].company_id);
                res.json(deptstatus);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/get/api/jobPost/all", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let str = "";
                console.log(req.body.status)
                if (req.body.status !== "ALL") {
                    str = ` where j.job_status='${req.body.status}' `;
                }
                else if (req.body.status === "ALL") {
                    str = ` where j.job_status!='delete' `;
                }
                let get_jobPost = await getjobPostDetailsall(str);
                for (let i = 0; i < get_jobPost.length; i++) {
                    let get_job = await getapplicationjobPostCount(get_jobPost[i].job_id);
                    get_jobPost[i]["count"] = get_job[0].count;
                }
                res.json(get_jobPost);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/get/api/module/accesses/by/role_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let modules = await Query1(req.body.role_id);
                res.json(modules);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});


function userAccessByuser_id(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_user_access where user_id=${data}`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getProfession() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_profession `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getJobByClientID(cID) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_job where client_id=${cID} `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getJobTpyes() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_job_type `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getJobSector() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_job_sector `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })

}

function getPositionType() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_position_type `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function addUserRole(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_role set ?`;
        let post = {
            role_name: data.role_name,
            role_status: "active",
            incentive_percentage: data.incentive_perc
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function updateRoleName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_role set ? where role_id=${data.role_id}`;
        let post = {
            role_name: data.role_name,
            incentive_percentage: data.incentive_perc
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function getSpeciality() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_speciality`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function updateApplicantUserDetails(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update  tbl_user set ? where user_id=${data.user_id}`;
        let post = {
            user_first_name: data.user_first_name,
            user_middle_name: data.user_middle_name,
            user_last_name: data.user_last_name,
            phone: data.phone,
            email: data.email

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateApplicantRecruiteeDetails(data, rid) {
    return new Promise(function (resolve, reject) {
        let sql = `update  tbl_recruitee_details set ? where recruitee_id=${rid}`;
        let post = {
            dob: moment(new Date(data.dob)).format("MM/DD/YYYY"),
            profession: data.profession,
            speciality: data.speciality,
            ssn_4digit: data.ssn_4digit
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function getLatestApplication() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_application order by application_id desc `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function getApplicationByID(id) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_application where application_id="${id}"`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}


function getAdminID() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_user where email="raj@vishusa.com" limit 1`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function getJobpostby(jID) {
    return new Promise(function (resolve, reject) {
        let sql = `select job_post_by
        from tbl_job where job_id=${jID}`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}
function getSupervisor(jpb) {
    return new Promise(function (resolve, reject) {
        let sql = `select supervisor_name from tbl_employee where user_id=${jpb} limit 1`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function getRoleOfEmployee(jpb) {
    return new Promise(function (resolve, reject) {
        let sql = `select a.role_id,b.incentive_percentage from tbl_employee as a
        INNER JOIN tbl_role AS b ON b.role_id = a.role_id
         where a.user_id=${jpb} `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function addApplication(data, rid, pcode) {
    // console.log("ap no--", data.job_no, pcode.length, pcode[0])
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let ustime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var times = moment(new Date(ustime)).format("MM/DD/YYYY");
        var day = times.split("/");
        var dt = day[1];
        var mm = day[0];
        var yy = day[2].slice(2, 4);
        /////////slice previous code
        if (pcode.length > 0) {
            var str = pcode[0].application_no.replace(/^'|'$/g, "").split(/\s*\-\s*/g)
            // var dtt = str.slice(6, 8);
            // var mmm = str.slice(4, 6);
            // var yyy = str.slice(8, 10);
            // var ccc = str.slice(10, 13);
            if (str.length === 1) {
                var dtt = str[0].slice(6, 8);
                var mmm = str[0].slice(4, 6);
                var yyy = str[0].slice(8, 10);
                var ccc = str[0].slice(10, 13);
            }
            else {
                var dtt = str[1].slice(2, 4);
                var mmm = str[1].slice(0, 2);
                var yyy = str[1].slice(4, 6);
                var ccc = str[1].slice(6, 9);
            }




        } else {
            var dtt = dt;
            var mmm = mm;
            var yyy = yy;
            var ccc = "000";
        }

        //var code = 'VCSA';
        var code = data.job_no + '-';
        if (dt.length == 1) {
            dt = '0' + dt;
        }
        if (mm.length == 1) {
            mm = '0' + mm;
        }
        if (dt == dtt && mm == mmm && yy == yyy) {

            var cc = ccc.slice(2, 3);
            var c = ccc.slice(0, 2);
            var cs = ccc;
            // console.log("here--", cc, c, cs)

            if (cc < 9) {
                var sum = cc + 1;

                cc = parseInt(cc) + 1;
                // console.log("1st---", cc)
                code = code + mm + dt + yy + c + cc;
            } else {
                c = parseInt(cc) + 1;
                cc = 0;
                var databasevalue = cs;
                // coerce the previous variable as a number and add 1
                var incrementvalue = (+databasevalue) + 1;
                // console.log("---------------------------TEST 3", incrementvalue);

                // insert leading zeroes with a negative slice
                incrementvalue = ("000" + incrementvalue).slice(-3);
                // console.log("---------------------------TEST 4", incrementvalue);
                var value = incrementvalue;
                // console.log("2nd---", value)
                code = code + mm + dt + yy + value;
            }
        } else if (dt != dtt && mm == mmm && yy == yyy) {
            ccc = "001";
            code = code + mm + dt + yy + ccc;
        } else if (dt != dtt && mm != mmm && yy == yyy) {
            ccc = "001";
            code = code + mm + dt + yy + ccc;
        } else if (dt != dtt && mm != mmm && yy != yyy) {
            ccc = "001";
            code = code + mm + dt + yy + ccc;
        } else {
            var cc = "001";
            code = code + mm + dt + yy + cc;
        }
        let sql = `insert into tbl_application set ?`;
        let post = {
            recruitee_id: rid,
            application_stage: "applied",
            application_status: "underreview",
            applicant_message: data.message,
            applicant_availability: data.availability,
            applicant_reply: "",
            job_id: data.job_id,
            application_no: code,
            applied_by: data.applied_by,
            apply_date: moment(new Date(times)).format("MM/DD/YYYY"),
            prefered_state: data.prefered_state,
            prefered_city: data.prefered_city
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                // console.log(err);
                reject(err)
            } else {
                console.log("inserted")
                resolve("success");
            }
        })
    })
}

function updateApplicants(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_user set ? where user_id=${data.user_id}`;
        let post = {
            phone: data.phone
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateAssignManagerTable(data, recr_id, appl_id, jsn) {
    return new Promise(function (resolve, reject) {

        let sql = `insert into tbl_assign_manager set ? `;
        let post = {
            application_id: appl_id,
            recruitee_id: recr_id,
            onb_mgr_id: jsn.admin_id,
            recruiter_id: jsn.recruiter_id,
            team_lead_id: jsn.team_lead_id,
            manager_id: jsn.manager_id
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateAssignManagerIncentiveTable(user_id, recr_id, appl_id, jsn) {
    console.log(jsn)
    return new Promise(function (resolve, reject) {

        let sql = `insert into tbl_manager_incentive set ? `;
        if (jsn.length === 0) {
            var post = {
                application_id: appl_id,
                recruitee_id: recr_id,
                user_id: user_id,
                user_role_id: jsn.role_id,
                incentive_perc: jsn.incentive_percentage
            }
        }
        else {
            var post = {
                application_id: appl_id,
                recruitee_id: recr_id,
                user_id: user_id,
                user_role_id: jsn[0].role_id,
                incentive_perc: jsn[0].incentive_percentage
            }
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function getRecruitee(uid) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_recruitee where user_id=${uid}`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function updateRoleStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_role set ? where role_id=${data.role_id}`;
        let post = {
            role_status: data.role_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function getRoles() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_role where role_name!='recruitee'`;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function Query1(rid) {
    return new Promise(function (resolve, reject) {

        let sql = ` SELECT * FROM tbl_role_access AS a
        INNER JOIN tbl_action AS b ON b.action_id = a.action_id
        INNER JOIN tbl_submodule AS c ON c.submodule_id = b.submodule_id         
        INNER JOIN tbl_module AS d ON d.module_id = c.module_id
        where a.role_id = ${rid}
       `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function getjobPostDetailsall(str) {
    return new Promise(function (resolve, reject) {
        let sql = `select j.*,d.*,e.*,c.client_name,f.system_name AS system_name_name, g.user_first_name AS job_post_by_first_name,g.user_middle_name AS job_post_by_middle_name,g.user_last_name AS job_post_by_last_name,
        h.user_first_name AS job_post_edit_by_first_name,h.user_middle_name AS job_post_edit_by_middle_name,h.user_last_name AS job_post_edit_by_last_name 
        from  tbl_job j
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        left join tbl_user AS g ON g.user_id=j.job_post_by
        left join tbl_user AS h ON h.user_id=j.job_post_edit_by ${str}
        order by j.job_id desc`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getapplicationjobPostCount(job) {
    return new Promise(function (resolve, reject) {
        let sql = `select count(*) AS count from tbl_application AS a where a.job_id='${job}'`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getCompanyDetails() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_company where company_status="active"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getDepartmentDetailsbyid(cid) {
    return new Promise(function (resolve, reject) {
        let sql = `select a.*
        from  tbl_department AS a where a.company_id=${cid}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getEmpDepartmentbyid(dept_id) {
    return new Promise(function (resolve, reject) {
        let sql = `select count(*) AS count from tbl_employee AS b INNER JOIN tbl_user AS c ON c.user_id=b.user_id 
         where c.user_status="active" and b.dept_id='${dept_id}' GROUP BY b.dept_id`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function updateDepartmentStatus(data, cid) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_department set ? where company_id=${cid} and dept_id=${data.dept_id}`;
        let post = {
            dept_status: data.dept_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateDepartmentDetails(data, cid) {
    return new Promise(function (resolve, reject) {
        let sql = `update  tbl_department set ? where company_id=${cid} and dept_id=${data.dept_id}`;
        let post = {
            dept_name: data.dept_name

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addDepartmentDetails(data, cid) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_department set ?`;
        let post = {
            company_id: cid,
            dept_name: data.dept_name,
            dept_status: "active"
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addCompanyDetails(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_company set ? where company_id=1`;
        let post = {
            company_name: data.company_name,
            company_addr: data.company_addr,
            company_phone: data.company_phone,
            company_email: data.company_email
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addUserDetlForEmp(data, email, phone, hpass) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        // //console.log(strTime);
        let sql = `insert into tbl_user set ?`;
        if (data.role_id === "1") {
            var post = {
                user_first_name: data.user_first_name,
                user_middle_name: data.user_middle_name,
                user_last_name: data.user_last_name,
                phone: phone,
                email: email,
                password: hpass,
                passcode: "1234",
                user_type: "admin",
                user_status: "active",
                changed_by: "",
                changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
                login_block_status: "unblock",
                password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY")

            }
        }
        else {
            var post = {
                user_first_name: data.user_first_name,
                user_middle_name: data.user_middle_name,
                user_last_name: data.user_last_name,
                phone: phone,
                email: email,
                password: hpass,
                passcode: "1234",
                user_type: "employee",
                user_status: "active",
                changed_by: "",
                changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
                login_block_status: "unblock",
                password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY")

            }
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function addEmployee(data, user_id) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_employee set ?`;
        let post = {
            user_id: user_id,
            employee_code: data.employee_code,
            role_id: data.role_id,
            signatory_flag: data.signatory_flag,
            dept_id: data.dept_id,
            designation: data.designation,
            date_of_joining: moment(new Date(data.date_of_joining)).format("MM/DD/YYYY"),
            supervisor_name: data.supervisor_name,
            image_id: 0

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function getUsers(user_id) {
    return new Promise(function (resolve, reject) {
        let sql = `select *   from tbl_user where user_id=${user_id} AND user_status!="deleted" `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function getCandidateByUser(user_id) {
    return new Promise(function (resolve, reject) {
        let sql = `select *   from tbl_candidate where user_id=${user_id} `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function addUserAccess(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_role_access set ? `;
        let post = {
            roll_id: data.roll_id,
            action_id: data.action_id
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function getmodsubmodule(uid) {
    return new Promise(function (resolve, reject) {

        let sql = `SELECT  * 
        FROM  tbl_action as c 
        inner join tbl_submodule as d on d.submodule_id=c.submodule_id 
        inner join tbl_module as e on e.module_id=d.module_id   
       `;

        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

function getAppUserAccess(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_app_user_access where user_id=${data}`;

        db.query(sql, function (err, result) {
            // //console.log("--------------------------------------------------SAVE 1", sql, result)
            if (err) {
                reject(err);
            } else {
                resolve("200");
            }
        });
    });
}

function deleteAppUserAccess(data) {
    return new Promise(function (resolve, reject) {
        let sql = `delete from tbl_app_user_access where user_id='${data.userId}'`;
        db.query(sql, function (err, result) {
            // //console.log("--------------------------------------------------SAVE 2", sql, result);
            if (err) reject(err);
            else resolve("delete");
        });
    });
}

function INSERTAPPUSERACCESS(data, datas) {

    return new Promise(function (resolve, reject) {
        for (i = 0; i <= data.length - 1; i++) {
            insert_into_app_access(data[i], datas);

        }
        resolve("success");

    });
}

function insert_into_app_access(data, datas) {
    let sql = `insert into tbl_app_user_access set ?`;
    let post = {
        user_id: datas.userId,
        app_action_id: data.action_id
    }
    db.query(sql, post, function (err, result) {
        // //console.log("--------------------------------------------------SAVE 4", result);
        if (err) {
            //console.log(err)
        }
        else return "success";
    });
}

function getUserAccess_(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_user_access where user_id=${data}`;

        db.query(sql, function (err, result) {
            // //console.log("--------------------------------------------------SAVE 1", sql, result)
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function deleteUserAccesIfExist(data) {
    return new Promise(function (resolve, reject) {
        let sql = `delete from tbl_user_access where user_id='${data.userId}'`;
        db.query(sql, function (err, result) {
            // //console.log("--------------------------------------------------SAVE 2", sql, result);
            if (err) reject(err);
            else resolve("delete");
        });
    });
}

function updateUser(data) {

    return new Promise(function (resolve, reject) {

        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });

        let time = moment(new Date(strTime)).format("MM/DD/YYYY hh:mm:ss A");


        let sql = `update tbl_user set ? where user_id='${data}'`;
        let post = {
            changed_by: data,
            changed_date: time
        }
        db.query(sql, post, function (err, result) {
            // //console.log("--------------------------------------------------SAVE 3", result);
            if (err) reject(err);
            else resolve("ok");
        });
    });
}

function INSERTUserAcess(data, datas) {

    return new Promise(function (resolve, reject) {
        for (i = 0; i <= data.length - 1; i++) {
            loopINSERtUSERaccess(data[i], datas);

        }
        resolve("success");

    });
}

function loopINSERtUSERaccess(data, datas) {
    let sql = `insert into tbl_user_access set ?`;
    let post = {
        user_id: datas.userId,
        action_id: data.action_id
    }
    db.query(sql, post, function (err, result) {
        //console.log("--------------------------------------------------SAVE 4", result);
        if (err) {
            //console.log(err)
        }
        else return "success";
    });
}

function getAppAction() {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_app_action`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getLatestUser() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_user order by user_id desc limit 1 `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getAllEmp() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select f.*,a.*,b.*,c.role_name,d.dept_name,e.user_first_name AS supervisor_first_name,e.user_middle_name AS supervisor_middle_name,e.user_last_name AS supervisor_last_name
         from tbl_employee AS a 
        INNER JOIN tbl_user AS b ON a.user_id=b.user_id
        INNER JOIN tbl_role AS c ON a.role_id=c.role_id
        INNER JOIN tbl_department AS d ON a.dept_id=d.dept_id
        INNER JOIN tbl_designation AS f ON f.designation_id=a.designation
        LEFT JOIN tbl_user AS e ON e.user_id=a.supervisor_name WHERE b.email<>"admin@gmail.com" AND b.email<>"raj@vishusa.com" AND b.email<>"dhruv@vishusa.com"
        order by b.user_id desc`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function checkIfexistsDesignation(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * from tbl_designation where (designation_name="admin" OR designation_name="Team Lead" OR designation_name="Manager" OR designation_name="Recruiter" OR designation_name="On-boarding Member") and designation_name="${data.designation_name}"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getAllRole() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * FROM tbl_role WHERE role_status="active" and role_name!='recruitee' order by role_name`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getAllDept(id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * FROM tbl_department WHERE dept_status="active" and company_id="${id}" order by dept_name`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function checkSupervisor(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select a.* FROM tbl_employee AS a INNER JOIN tbl_user AS b ON a.user_id=b.user_id 
        INNER JOIN tbl_department AS c ON a.dept_id=c.dept_id
        INNER JOIN tbl_company AS d ON d.company_id=c.company_id
        WHERE user_status="active" AND c.dept_status="active" AND d.company_status="active" AND a.supervisor_code="${data}" `;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getCompanyDetails() {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_company where company_status="active"`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function getAppActionByUSERID(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * FROM tbl_app_user_access AS a INNER JOIN tbl_app_action AS b ON a.app_action_id=b.app_action_id WHERE user_id=${data}`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function updateBlockStatus(data) {
    return new Promise(function (resolve, reject) {

        let sql = `update tbl_user set ? where user_id="${data.user_id}"`;
        post = {
            login_block_status: data.login_block_status

        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve("success");
            }
        })
    })
}

function updateProfessionStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_profession set ? where profession_id=${data.profession_id}`;
        let post = {
            profession_status: data.profession_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateProfessionName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_profession set ? where profession_id=${data.profession_id}`;
        let post = {
            profession_name: data.profession_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateJobTypeStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_job_type set ? where job_type_id=${data.job_type_id}`;
        let post = {
            job_type_status: data.job_type_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateJobTypeName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_job_type set ? where job_type_id=${data.job_type_id}`;
        let post = {
            job_type_name: data.job_type_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateJobSectorStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_job_sector set ? where job_sector_id=${data.job_sector_id}`;
        let post = {
            job_sector_status: data.job_sector_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateJobSectorName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_job_sector set ? where job_sector_id=${data.job_sector_id}`;
        let post = {
            job_sector_name: data.job_sector_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatePositionTypeStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_position_type set ? where position_type_id=${data.position_type_id}`;
        let post = {
            position_type_status: data.position_type_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updatePositionTypeName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_position_type set ? where position_type_id=${data.position_type_id}`;
        let post = {
            position_type_name: data.position_type_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateSpecialityStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_speciality set ? where speciality_id=${data.speciality_id}`;
        let post = {
            speciality_status: data.speciality_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function updateSpecialityName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_speciality set ? where speciality_id=${data.speciality_id}`;
        let post = {
            speciality_name: data.speciality_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}

function check_status_code(data) {

    var check = data.indexOf("err");

    if (check == '-1') {
        return "200";
    } else {
        return "400";
    }
}

function getActionId(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_role_access where role_id=${data}`;
        db.query(sql, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function INSERTINLOOP(data, user_id) {

    return new Promise(function (resolve, reject) {

        for (i = 0; i <= data.length - 1; i++) {

            insertUserAccess(data[i].action_id, user_id);
        }
        resolve("success");

    });
}

function insertUserAccess(data, user_id) {

    let sql = `insert into tbl_user_access set ?`;
    let post = {
        user_id: user_id,
        action_id: data

    }

    db.query(sql, post, function (err, result) {

        if (err) {
            //console.log(err)
        }
        else return "success";
    });
}

function addProfessionName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_profession set ?`;
        let post = {
            profession_name: data.profession_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addJobTypeName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_job_type set ?`;
        let post = {
            job_type_name: data.job_type_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addJobSectorName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_job_sector set ? `;
        let post = {
            job_sector_name: data.job_sector_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addPositionTypeName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_position_type set ? `;
        let post = {
            position_type_name: data.position_type_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

function addSpecialityName(data) {
    return new Promise(function (resolve, reject) {
        let sql = `insert into tbl_speciality set ?`;
        let post = {
            speciality_name: data.speciality_name
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("inserted")
                resolve("success");
            }
        })
    })
}

app.post("/vcsapi/get/api/application/user_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);
                let getApp = await getApplicationByUser(req.body);
                //console.log(getApp);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getApplicationByUser(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT *,m.system_name AS system_name_name FROM tbl_application As a 
        INNER JOIN tbl_recruitee As b  ON a.recruitee_id=b.recruitee_id 
        INNER JOIN tbl_user As c ON c.user_id=b.user_id 
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id 
        INNER JOIN tbl_recruitee_details AS e ON e.recruitee_id=b.recruitee_id
        LEFT JOIN tbl_speciality AS f ON f.speciality_id=e.speciality
        LEFT JOIN tbl_profession AS g ON g.profession_id=e.profession
        LEFT join tbl_job_type AS k ON k.job_type_id=d.job_type
        LEFT join tbl_position_type AS l ON l.position_type_id=d.position_type
        inner join tbl_system_name AS m ON m.system_name_id=d.system_name
        inner join tbl_client AS n ON n.client_id=d.client_id
        LEFT JOIN tbl_pay_rate As o ON o.application_id=a.application_id AND o.recruitee_id=b.recruitee_id
        WHERE c.user_id="${data.user_id}" order by a.application_id DESC`;
        db.query(sql, function (err, result) {
            //  //console.log(sql);
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.post("/vcsapi/get/api/application/job_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await getApplicationByJOBID(req.body);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});
app.post("/vcsapi/get/api/application/job_id/and/application_stage", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await getApplicationByJOBIDAndApStage(req.body);
                //console.log(getApp);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getApplicationByJOBID(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,b.*,u.*,r.*,am.recruiter_id,d.user_first_name as recruiter_first_name,d.user_middle_name as recruiter_middle_name,d.user_last_name as recruiter_last_name,  
        o.pay_rate_id,      
        o.proposed_start_date,   
        o.proposed_end_date,     
        o.onb_regular_bill_rate, 
        o.onb_ot_bill_rate,      
        o.onb_holiday_bill_rate, 
        o.onb_regular_pay_rate,  
        o.onb_ot_pay_rate,       
        o.onb_holiday_pay_rate,  
        o.per_dieum_wk,          
        o.ot_starts_after_wk,    
        o.pay_package_remarks,   
        o.total_shift_hr,        
        o.shift_details,         
        o.rto ,           
        o.contract_duration_wk,    
        o.due_date   ,         
        o.comments  ,
        o.pay_rate_status,z.client_id,z.client_name,z.client_status     
        FROM tbl_application As a 
        INNER JOIN tbl_job AS b ON a.job_id=b.job_id 
        inner join tbl_assign_manager am on am.application_id=a.application_id
        inner join tbl_client As z ON z.client_id=b.client_id
        LEFT join tbl_pay_rate o on o.application_id=a.application_id
        inner join tbl_recruitee r on r.recruitee_id=a.recruitee_id
        inner join tbl_user as u on u.user_id=r.user_id
        INNER JOIN tbl_user AS d ON d.user_id=am.recruiter_id 
        
        WHERE b.job_id="${data.job_id}" `;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getApplicationByJOBIDAndApStage(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,b.*,c.*,d.*,e.user_first_name AS applied_by_first_name,e.user_middle_name AS applied_by_middle_name,e.user_last_name AS applied_by_last_name,f.position_type_name
        FROM tbl_application As a 
        INNER JOIN tbl_job AS b ON a.job_id=b.job_id 
        INNER JOIN tbl_recruitee AS c ON a.recruitee_id=c.recruitee_id 
        INNER JOIN tbl_user AS d ON d.user_id=c.user_id 
        LEFT JOIN tbl_user AS e ON e.user_id=a.applied_by
        LEFT JOIN tbl_position_type AS f ON f.position_type_id=b.position_type
        WHERE b.job_id="${data.job_id}" and (a.application_stage="applied" OR a.application_stage="sort_listed")`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
app.post("/vcsapi/get/api/application/review_status", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await updateApplicationByreviewStatus(req.body);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateApplicationByreviewStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `update tbl_application set ? where application_id=${data.application_id}`;
        let post = {
            review_status: data.review_status
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}
app.post("/vcsapi/update/api/application_stage/byJobID/sort_listed", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let application_ids = []
                application_ids = req.body.application_id
                for (i in application_ids) {
                    var getApp = await updateApplicationStageSortListed(req.body, application_ids[i]);
                }
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateApplicationStageSortListed(data, application_id) {
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let sql = `update tbl_application set ? where application_id=${application_id} and job_id=${data.job_id}`;
        let post = {
            application_stage: data.application_stage,
            sort_listing_date: moment(new Date(strTime)).format("MM/DD/YYYY")
        }
        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}
app.post("/vcsapi/update/api/application_stage/byJobID/offeredORrejected", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                var getApp = await updateApplicationStageOfferedRejected(req.body);
                if (getApp === "success") {
                    if (req.body.application_stage === "offered") {
                        let insertpayrate = await insertpayRate(req.body);
                        res.json(insertpayrate);
                    } else {
                        res.json(getApp);
                    }

                } else {
                    res.json("Offer Not Updated");
                }


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updateApplicationStageOfferedRejected(data) {
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        if (data.application_stage === "offered") {
            var sql = `update tbl_application set ? where application_id=${data.application_id} and job_id=${data.job_id}`;
            var post = {
                application_stage: data.application_stage,
                offering_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
                application_status: "accepted"

            }
        } else if (data.application_stage === "rejected") {
            var sql = `update tbl_application set ? where application_id=${data.application_id} and job_id=${data.job_id}`;
            var post = {
                application_stage: data.application_stage,
                offer_reject_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
                application_status: "rejected"
            }
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}

app.post("/vcsapi/update/api/application_stage/byJobID/offer/accepted/OR/rejected", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                var getApp = await updateApplicationStageOfferAcceptededRejected(req.body);
                if (getApp === "success") {
                    let getpayrate = await getPayRate(req.body);
                    if (getpayrate.length) {
                        if (req.body.application_stage === "offer_accepted") {
                            var insertOnbDet = await insertOnbordingApplRecrut(req.body, getpayrate[0]);
                            if (insertOnbDet === "success") {
                                let update = await updatePayRateStatus(getpayrate[0].pay_rate_id);
                                res.json(update);
                            } else {
                                res.json(insertOnbDet)
                            }

                        } else {
                            res.json(getApp);
                        }
                    }



                } else {
                    res.json("Status not updated.")
                }

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function updatePayRateStatus(data) {
    return new Promise(function (resolve, reject) {

        var sql = `update tbl_pay_rate set ? where pay_rate_id=${data}`;
        var post = {
            pay_rate_status: "inactive"

        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}

function updateApplicationStageOfferAcceptededRejected(data) {
    return new Promise(function (resolve, reject) {
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        if (data.application_stage === "offer_accepted") {
            var sql = `update tbl_application set ? where application_id=${data.application_id} and job_id=${data.job_id}`;
            var post = {
                application_stage: data.application_stage,
                applicant_reply_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
                offer_accepted_by: data.offer_accepted_by,
                application_status: "accepted"

            }
        } else if (data.application_stage === "offer_declined") {
            var sql = `update tbl_application set ? where application_id=${data.application_id} and job_id=${data.job_id}`;
            var post = {
                application_stage: data.application_stage,
                applicant_reply_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
                offer_accepted_by: data.offer_accepted_by,
                application_status: "cancelled"
            }
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}

function insertOnbordingApplRecrut(data1, data) {
    return new Promise(function (resolve, reject) {

        var sql = `insert into tbl_onboarding set ? `;
        var post = {
            application_id: data1.application_id,
            recruitee_id: data1.recruitee_id,
            proposed_start_date: moment(new Date(data.proposed_start_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.proposed_end_date)).format("MM/DD/YYYY"),
            onb_regular_bill_rate: data.onb_regular_bill_rate,
            onb_ot_bill_rate: data.onb_ot_bill_rate,
            onb_holiday_bill_rate: data.onb_holiday_bill_rate,
            onb_regular_pay_rate: data.onb_regular_pay_rate,
            onb_ot_pay_rate: data.onb_ot_pay_rate,
            onb_holiday_pay_rate: data.onb_holiday_pay_rate,
            per_dieum_wk: data.per_dieum_wk,
            ot_starts_after_wk: data.ot_starts_after_wk,
            pay_package_remarks: data.pay_package_remarks,
            total_shift_hr: data.total_shift_hr,
            shift_details: data.shift_details,
            rto: data.rto,
            contract_duration_wk: data.contract_duration_wk
        }


        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("Inserted")
                resolve("success");
            }
        })
    });
}

function insertpayRate(data) {
    return new Promise(function (resolve, reject) {

        var sql = `insert into tbl_pay_rate set ? `;
        var post = {
            application_id: data.application_id,
            recruitee_id: data.recruitee_id,
            proposed_start_date: moment(new Date(data.proposed_start_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.proposed_end_date)).format("MM/DD/YYYY"),
            onb_regular_bill_rate: data.onb_regular_bill_rate,
            onb_ot_bill_rate: data.onb_ot_bill_rate,
            onb_holiday_bill_rate: data.onb_holiday_bill_rate,
            onb_regular_pay_rate: data.onb_regular_pay_rate,
            onb_ot_pay_rate: data.onb_ot_pay_rate,
            onb_holiday_pay_rate: data.onb_holiday_pay_rate,
            per_dieum_wk: data.per_dieum_wk,
            ot_starts_after_wk: data.ot_starts_after_wk,
            pay_package_remarks: data.pay_package_remarks,
            total_shift_hr: data.total_shift_hr,
            shift_details: data.shift_details,
            rto: data.rto,
            contract_duration_wk: data.contract_duration_wk
        }


        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("Inserted")
                resolve("success");
            }
        })
    });
}

function getPayRate(data) {
    return new Promise(function (resolve, reject) {

        var sql = `SELECT * FROM tbl_pay_rate WHERE application_id='${data.application_id}' AND recruitee_id='${data.recruitee_id}' and pay_rate_status='active'`;


        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("Inserted")
                resolve(res);
            }
        })
    });
}

function getPayRateByID(data) {
    return new Promise(function (resolve, reject) {

        var sql = `SELECT * FROM tbl_pay_rate WHERE pay_rate_id="${data}"`;


        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("Inserted")
                resolve(res);
            }
        })
    });
}
function getOnboardData(data) {
    return new Promise(function (resolve, reject) {

        var sql = `SELECT * FROM tbl_onboarding WHERE application_id="${data.application_id}" AND recruitee_id="${data.recruitee_id}"`;


        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("Inserted")
                resolve(res);
            }
        })
    });
}
function insertlogDATA(data) {
    return new Promise(function (resolve, reject) {

        let date = new Date();
        let currDate = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });

        var sql = `insert into tbl_pay_rate_change_log set ? `;
        var post = {
            pay_rate_id: data.pay_rate_id,
            application_id: data.application_id,
            recruitee_id: data.recruitee_id,
            proposed_start_date: moment(new Date(data.proposed_start_date)).format("MM/DD/YYYY"),
            proposed_end_date: moment(new Date(data.proposed_end_date)).format("MM/DD/YYYY"),
            onb_regular_bill_rate: data.onb_regular_bill_rate,
            onb_ot_bill_rate: data.onb_ot_bill_rate,
            onb_holiday_bill_rate: data.onb_holiday_bill_rate,
            onb_regular_pay_rate: data.onb_regular_pay_rate,
            onb_ot_pay_rate: data.onb_ot_pay_rate,
            onb_holiday_pay_rate: data.onb_holiday_pay_rate,
            per_dieum_wk: data.per_dieum_wk,
            ot_starts_after_wk: data.ot_starts_after_wk,
            pay_package_remarks: data.pay_package_remarks,
            total_shift_hr: data.total_shift_hr,
            shift_details: data.shift_details,
            rto: data.rto,
            contract_duration_wk: data.contract_duration_wk,
            changed_by: data.changed_by,
            change_datetime: moment(new Date(currDate)).format("MM/DD/YYYY")
        }


        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("Inserted")
                resolve("success");
            }
        })
    });
}
app.post("/vcsapi/add/or/update/api/tbl/application/remarks/and/remarks_date", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);
                let date = new Date();
                let strTime = date.toLocaleString("en-US", {
                    timeZone: "America/Los_Angeles"
                });
                let checkremarkdata = await getApplicationDataByJobIDandAppID(req.body)
                //console.log(checkremarkdata);
                if (checkremarkdata.length > 0) {
                    if (checkremarkdata[0].remarks === null) {
                        var remarks = req.body.remarks
                        var remarkDate = moment(new Date(strTime)).format("MM/DD/YYYY")
                    } else {
                        var remarks = checkremarkdata[0].remarks + "&$&" + req.body.remarks
                        var remarkDate = checkremarkdata[0].remarks_date + "&$&" + moment(new Date(strTime)).format("MM/DD/YYYY")
                    }

                }

                var getApp = await updateApplicationRemarkAndRemarkDate(req.body, remarks, remarkDate);

                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getApplicationDataByJobIDandAppID(data) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from  tbl_application where job_id=${data.job_id} and application_id = ${data.application_id}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("inserted")
                resolve(res);
            }
        })
    })
}

function updateApplicationRemarkAndRemarkDate(data, remarks, remarkDate) {
    return new Promise(function (resolve, reject) {

        var sql = `update tbl_application set ? where application_id=${data.application_id} and job_id=${data.job_id}`;
        var post = {
            remarks: remarks,
            remarks_date: remarkDate


        }


        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    });
}
app.post("/vcsapi/get/api/application/by/job_id_and_application_stage", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await getApplicationByapplicationStage(req.body);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getApplicationByapplicationStage(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,b.*,d.* FROM tbl_application As a 
        INNER JOIN tbl_job AS b ON a.job_id=b.job_id 
        INNER JOIN tbl_recruitee AS c ON a.recruitee_id=c.recruitee_id 
        INNER JOIN tbl_user AS d ON d.user_id=c.user_id 
        WHERE b.job_id="${data.job_id}" and a.application_stage="${data.application_stage}" `;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

app.post("/vcsapi/get/api/application/by/job_id/sort_listed/or/rejected", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let getApp = await getApplicationSorListedOrRejected(req.body);
                res.json(getApp);
            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getApplicationSorListedOrRejected(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,b.*,d.* FROM tbl_application As a 
        INNER JOIN tbl_job AS b ON a.job_id=b.job_id 
        INNER JOIN tbl_recruitee AS c ON a.recruitee_id=c.recruitee_id 
        INNER JOIN tbl_user AS d ON d.user_id=c.user_id 
        WHERE b.job_id="${data.job_id}" and (a.application_stage="rejected" OR a.application_stage="sort_listed")`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}





let date = new Date();
var now = new Date(date.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles"
}));


// var millisTill12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0) - now;
// if (millisTill12 < 0) {
//     millisTill12 += 86400000; // it's after 12am, try 12am tomorrow.
// }
// setInterval(function () {
//     async function apps() {
//         try {

//             let currentDate = moment(now).format("MM/DD/YYYY");
//             let get_assignmentData = await getAssignmentData(currentDate);
//             if (get_assignmentData.length && get_assignmentData[0].assignment_id) {
//                 for (let i = 0; i < get_assignmentData.length; i++) {
//                     let updateassignment = await updateAssignmentStatus(get_assignmentData[i]);
//                     if (updateassignment === "success") {
//                         //console.log("updated assignment success");
//                     } else {
//                         //console.log("update assignment error", updateassignment);
//                     }
//                 }
//             } else {
//                 //console.log("no assignment found")
//             }

//         } catch (err) {
//             //console.log(err)
//         }
//     }
//     apps();

// }, millisTill12);


function getAssignmentData(currentDate) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * from tbl_assignment where hiring_date='${currentDate}'`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
function getAssignmentStatus(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT * from tbl_assignment where assignment_id=${data}`;
        db.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
function updateAssignmentStatus(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_assignment set ? where assignment_id=${data.assignment_id} AND assignment_status='not_started'`;
        let post = {
            assignment_status: "working"
        }

        db.query(sql, post, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("updated")
                resolve("success");
            }
        })
    })
}


app.post("/vcsapi/get/all/inprocess/account/details", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let str = "";
                if (req.body.client_id !== "ALL") {
                    str = `WHERE a.client_id="${req.body.client_id}"`;
                }
                if (req.body.year !== "ALL") {
                    if (str === "") {
                        str = `WHERE b.year="${req.body.year}"`;
                    } else {
                        str = str + ` AND b.year="${req.body.year}"`;
                    }
                }
                if (req.body.month !== "ALL") {
                    if (str === "") {
                        str = `WHERE b.month="${req.body.month}"`;
                    } else {
                        str = str + ` AND b.month="${req.body.month}"`;
                    }

                }
                if (req.body.week_id !== "ALL") {
                    if (str === "") {
                        str = `WHERE a.week_id="${req.body.week_id}"`;
                    } else {
                        str = str + ` AND a.week_id="${req.body.week_id}"`;
                    }

                }

                let wks = await getAccountFileDetails(str);
                res.json(wks);


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAccountFileDetails(str) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_account_file AS a 
        INNER JOIN tbl_week AS b ON a.week_id=b.week_id
        INNER JOIN tbl_client AS c ON c.client_id=a.client_id
         ${str}`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}


app.post("/vcsapi/get/payroll/Byaccountfile", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let wks = await getPayrolldataByAcc(req.body);
                res.json(wks);


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getPayrolldataByAcc(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `
        SELECT * FROM (
        SELECT af.acc_file_id AS account_file_id, a.*,w.*,b.rec_payroll_id,b.payroll_status,e.*,f.job_no,g.client_name,b.reg_hr,b.ot_hr,b.holiday_hr,b.taxable_amt,b.nontaxable_amt ,b.gross_amt,b.profit_amt,b.deducted_invoice_amt,STR_TO_DATE(w.wk_start_date,"%m/%d/%Y") as start,STR_TO_DATE(w.wk_end_date,"%m/%d/%Y") as end,STR_TO_DATE(a.closing_date,"%m/%d/%Y") AS closing,STR_TO_DATE(a.hiring_date,"%m/%d/%Y") AS hiring   
        FROM tbl_account_file AS af
        INNER JOIN tbl_assignment AS a ON a.client_id=af.client_id
        INNER JOIN tbl_week AS w ON w.week_id=af.week_id
        INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id AND b.week_id=w.week_id AND b.acc_file_id=af.acc_file_id
        INNER JOIN tbl_recruitee AS d ON d.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS e ON e.user_id=d.user_id
        INNER JOIN tbl_job AS f ON f.job_id=a.job_id
        INNER JOIN tbl_client AS g ON g.client_id=af.client_id
        WHERE a.assignment_status='working' AND af.client_id="${data.client_id}"   AND af.month="${data.month}"  AND af.year="${data.year}" and af.week_id=${data.week_id}
         AND af.acc_file_id=${data.acc_file_id}
        ) AS temp where (hiring<=end) AND (closing>=start)`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/all/recruitee/name/payroll", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getRecruitee = await getAllRecruitee(req.body.name);
                //console.log(getRecruitee)
                res.json(getRecruitee)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAllRecruitee(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct b.*,c.*  
         from tbl_payroll_invoice AS a 
         INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        WHERE c.user_first_name like '${data}%' OR c.user_middle_name like '${data}%' OR c.user_last_name like '${data}%'
        order by c.user_first_name,c.user_middle_name,c.user_last_name`;
        db.query(sql, function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/all/recruitee/code/payroll", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getRecruitee = await getAllRecruiteeCode(req.body.code);
                //console.log(getRecruitee)
                res.json(getRecruitee)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAllRecruiteeCode(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct b.*,c.*  
         from tbl_payroll_invoice AS a 
         INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        WHERE b.recruitee_code like '${data}%' 
        order by c.user_first_name,c.user_middle_name,c.user_last_name`;
        db.query(sql, function (err, res) {
            // //console.log(sql)
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/all/recruitee/payroll/search", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getRecruitee = await getAllRecruiteePayrollSearch(req.body);
                //console.log(getRecruitee)
                res.json(getRecruitee)

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getAllRecruiteePayrollSearch(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * 
         from tbl_payroll_invoice AS a 
         INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_account_file AS d ON d.acc_file_id=a.acc_file_id
        INNER JOIN tbl_client AS e ON e.client_id=d.client_id
        INNER JOIN tbl_assignment As g ON g.assignment_id=a.assignment_id
        INNER JOIN tbl_onboarding AS h ON h.onboarding_id=g.onboarding_id
        INNER JOIN tbl_job AS f ON f.job_id=g.job_id
        INNER JOIN tbl_week AS i On i.week_id=a.week_id
        INNER JOIN tbl_application AS j ON j.application_id=g.application_id
        WHERE a.recruitee_id='${data.recruitee_id}' AND a.week_id='${data.week_id}' AND d.client_id='${data.client_id}' AND a.month='${data.month}' AND a.year='${data.year}'
        order by c.user_first_name,c.user_middle_name,c.user_last_name`;
        db.query(sql, function (err, res) {
            //  //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/get/acc_file/approved/week", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {


                let getaccfile = await getAllACCFileWeek(req.body);
                if (getaccfile.length) {



                    let getinc = await getIncFileWeek(req.body);
                    if (getinc.length) {
                        res.json("Already generated for this week.")
                    } else {

                        res.json(getaccfile);
                    }
                }
                else {
                    res.json("no data");
                }


                // //console.log(getRecruitee)


            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.get("/vcsapi/get/inc_data/backlog", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {


                let getinc = await getPayrollRecData();
                res.json(getinc)




            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getPayrollRecData() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = ` select distinct a.recruitee_id,b.client_id,c.client_name,d.user_first_name,d.user_middle_name,d.user_last_name,d.user_id 
        from tbl_payroll_invoice AS a 
        INNER JOIN tbl_assignment AS b ON b.assignment_id=a.assignment_id 
        INNER JOIN tbl_client AS c ON c.client_id=b.client_id 
        INNER JOIN tbl_recruitee AS r ON r.recruitee_id=a.recruitee_id 
        INNER JOIN tbl_user AS d On d.user_id=r.user_id  
        where a.payroll_status="approved" and b.total_working_hr>=140 and a.incentive_paid_status="unpaid"`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getIncFileWeek(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * FROM tbl_incentive_file where month='${data.month}' AND year='${data.year}' AND client_id='${data.client_id}'`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getAllACCFileWeek(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct b.*,c.* FROM tbl_payroll_invoice AS a INNER JOIN tbl_account_file As b ON b.acc_file_id=a.acc_file_id 
        inner join tbl_week as c on c.week_id=b.week_id
        where a.month='${data.month}' AND a.year='${data.year}' AND b.client_id='${data.client_id}' AND b.approval_status='approved' AND a.payroll_status='approved' 
         order by b.week_id`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}




app.post("/vcsapi/generate/incentive/backlog", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                //console.log(req.body);
                let count2 = 0;
                for (let l = 0; l < req.body.data.length; l++) {
                    let count1 = 0;
                    let accFile = [];
                    let weekidlist = [];

                    let getDistinctMonthYear = await getMonthYear(req.body.data[l]);
                    for (let k = 0; k < getDistinctMonthYear.length; k++) {
                        // count1=0;
                        let getAccFile = await getAccFileData(getDistinctMonthYear[k], req.body.data[l]);
                        for (let m = 0; m < getAccFile.length; m++) {
                            accFile.push(getAccFile[m].acc_file_id);
                            weekidlist.push(getAccFile[m].week_id);
                        }
                        let getAccData = await geAccountPayrollInfo(accFile.join(','), req.body.data[l]);
                        if (getAccData.length) {



                            let recruiteeData = [];
                            for (let i = 0; i < getAccData.length; i++) {


                                let getAssignmentByRec = await getAssignmentByrecruitee(getAccData[i]);

                                let getminWeek = await getMinWeekRecruitee(getAccData[i]);
                                let gemMinWeekID = await week_idmin(getminWeek[0].min);
                                let minhr = 0;
                                if (gemMinWeekID.length) {
                                    if (weekidlist.join(',').includes(gemMinWeekID[0].week_id)) {
                                        let getwrkHrData = await getWrkHourMin(gemMinWeekID[0].week_id, getAccData[i]);
                                        minhr = getwrkHrData[0].sum;
                                    }
                                }


                                //console.log((getAssignmentByRec[0].sum-minhr)>=140,(getAssignmentByRec[0].sum-minhr),getAssignmentByRec,minhr)
                                if (getAssignmentByRec.length && (getAssignmentByRec[0].sum - minhr) >= 140) {
                                    let getAccIncentive = await geAccountIncentiveData(accFile.join(','), getAccData[i]);

                                    let net_margin = 0;
                                    let rec_payroll_id = [];
                                    for (let j = 0; j < getAccIncentive.length; j++) {
                                        let data = getAccIncentive[j];
                                        if (!data.reg_hr) {
                                            data.reg_hr = 0;
                                        }
                                        if (!data.onb_regular_bill_rate) {
                                            data.onb_regular_bill_rate = 0;
                                        }
                                        if (!data.onb_regular_pay_rate) {
                                            data.onb_regular_pay_rate = 0;
                                        }
                                        if (!data.bonus_amount) {
                                            data.bonus_amount = 0;
                                        }
                                        let net_margin_wk = (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_bill_rate)) - (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_pay_rate)) - (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_pay_rate)) * 0.14 - (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_bill_rate)) * 0.04 - (data.bonus_amount);
                                        net_margin = net_margin + net_margin_wk;
                                        let update = await updatePayrollStatus(data.rec_payroll_id);
                                        if (update === "success") {
                                            rec_payroll_id.push(data.rec_payroll_id);
                                        }
                                    }

                                    let userRoleData = await getUserRoles();
                                    for (let k = 0; k < userRoleData; k++) {
                                        if (Number(userRoleData[k].role_id) === 1) {
                                            var admin_inc_amount = Number(userRoleData[k].incentive_percentage);
                                        }
                                        else if (Number(userRoleData[k].role_id) === 5) {
                                            var recruiter_inc_amt = Number(userRoleData[k].incentive_percentage);
                                        }
                                        else if (Number(userRoleData[k].role_id) === 9) {
                                            var onb_mgr_inc_amt = Number(userRoleData[k].incentive_percentage);
                                        }
                                        else if (Number(userRoleData[k].role_id) === 10) {
                                            var tl_inc_amount = Number(userRoleData[k].incentive_percentage);
                                        }
                                    }

                                    // let recruiter_inc_amt = net_margin * 0.07;
                                    // let tl_inc_amount = net_margin * 0.03;
                                    // let onb_mgr_inc_amt = net_margin * 0.0075;
                                    // let admin_inc_amount = net_margin * 0.02;

                                    let obj = {
                                        net_margin: (net_margin).toFixed(2),
                                        recruiter_inc_amt: (recruiter_inc_amt).toFixed(2),
                                        tl_inc_amount: (tl_inc_amount).toFixed(2),
                                        onb_mgr_inc_amt: (onb_mgr_inc_amt).toFixed(2),
                                        admin_inc_amount: (admin_inc_amount).toFixed(2),
                                        recruiter_id: getAccIncentive[0].recruiter_id,
                                        onb_mgr_id: getAccIncentive[0].onb_mgr_id,
                                        team_lead_id: getAccIncentive[0].team_lead_id,
                                        manager_id: getAccIncentive[0].manager_id,
                                        rec_payroll_id: rec_payroll_id.join(','),
                                        recruitee_id: getAccData[i].recruitee_id
                                    };
                                    //console.log(obj);
                                    recruiteeData.push(obj);
                                }

                            }

                            let count = 0;

                            if (recruiteeData.length) {
                                let getLincFile2 = await getLatestincFile();
                                let addincfile = await insertIncentiveFileData(req.body, req.body.data[l], weekidlist.join(','), getLincFile2, getDistinctMonthYear[k]);
                                if (addincfile === "success") {
                                    let getLincFile = await getLatestincFile();

                                    for (let o = 0; o < recruiteeData.length; o++) {
                                        let addinc = await insertIncentiveData(getDistinctMonthYear[k], getLincFile[0].inc_file_id, recruiteeData[o], req.body.data[l]);
                                        if (addinc === "success") {
                                            count++;
                                        }

                                    }

                                    if (count === recruiteeData.length) {
                                        count1++;
                                    }



                                } else {
                                    //console.log("Problem while inserting into tbl_incentive_file.")
                                }
                            }
                            else {
                                //console.log("No data to be inserted.")
                            }
                        }
                        else {
                            //console.log("no data in assignment")
                        }


                    }
                    if (count1 === getDistinctMonthYear.length) {
                        count2++;
                    }
                }

                if (count2 === req.body.data.length) {
                    res.json('success');
                }
                else {
                    res.json("error")
                }














            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getMonthYear(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = ` select distinct a.month,a.year
        from tbl_payroll_invoice AS a 
        INNER JOIN tbl_assignment AS b ON b.assignment_id=a.assignment_id 
        INNER JOIN tbl_client AS c ON c.client_id=b.client_id 
        where a.payroll_status="approved" and b.total_working_hr>=140 and a.incentive_paid_status="unpaid" and a.recruitee_id =${data.recruitee_id} AND c.client_id =${data.client_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getAccFileData(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = ` select distinct d.*,a.acc_file_id
        from tbl_payroll_invoice AS a 
        INNER JOIN tbl_assignment AS b ON b.assignment_id=a.assignment_id 
        INNER JOIN tbl_client AS c ON c.client_id=b.client_id 
        INNER JOIN tbl_week AS d ON d.week_id=a.week_id
        where a.payroll_status="approved" and b.total_working_hr>=140 and a.incentive_paid_status="unpaid" 
        and a.month="${data.month}" and a.year="${data.year}"
        and a.recruitee_id=${data1.recruitee_id} AND c.client_id =${data1.client_id}`;

        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.post("/vcsapi/generate/incentive", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let getAccData = await geAccountPayrollData(req.body.account_file);
                if (getAccData.length) {



                    let recruiteeData = [];
                    for (let i = 0; i < getAccData.length; i++) {

                        let getAssignmentByRec = await getAssignmentByrecruitee(getAccData[i]);

                        let getminWeek = await getMinWeekRecruitee(getAccData[i]);
                        let gemMinWeekID = await week_idmin(getminWeek[0].min);
                        let minhr = 0;
                        if (gemMinWeekID.length) {
                            if (req.body.week_id_list.includes(gemMinWeekID[0].week_id)) {
                                let getwrkHrData = await getWrkHourMin(gemMinWeekID[0].week_id, getAccData[i]);
                                minhr = getwrkHrData[0].sum;
                            }
                        }


                        //console.log((getAssignmentByRec[0].sum-minhr)>=140,(getAssignmentByRec[0].sum-minhr),getAssignmentByRec,minhr)
                        if (getAssignmentByRec.length && (getAssignmentByRec[0].sum - minhr) >= 140) {
                            let getAccIncentive = await geAccountIncentiveData(req.body.account_file, getAccData[i]);

                            let net_margin = 0;
                            let rec_payroll_id = [];
                            for (let j = 0; j < getAccIncentive.length; j++) {
                                let data = getAccIncentive[j];
                                if (!data.reg_hr) {
                                    data.reg_hr = 0;
                                }
                                if (!data.onb_regular_bill_rate) {
                                    data.onb_regular_bill_rate = 0;
                                }
                                if (!data.onb_regular_pay_rate) {
                                    data.onb_regular_pay_rate = 0;
                                }
                                if (!data.bonus_amount) {
                                    data.bonus_amount = 0;
                                }
                                let net_margin_wk = (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_bill_rate)) - (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_pay_rate)) - (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_pay_rate)) * 0.14 - (parseFloat(data.reg_hr) * parseFloat(data.onb_regular_bill_rate)) * 0.04 - (data.bonus_amount);
                                net_margin = net_margin + net_margin_wk;
                                let update = await updatePayrollStatus(data.rec_payroll_id);
                                if (update === "success") {
                                    rec_payroll_id.push(data.rec_payroll_id);
                                }
                            }

                            let userRoleData = await getUserRoles();
                            for (let k = 0; k < userRoleData; k++) {
                                if (Number(userRoleData[k].role_id) === 1) {
                                    var admin_inc_amount = Number(userRoleData[k].incentive_percentage);
                                }
                                else if (Number(userRoleData[k].role_id) === 5) {
                                    var recruiter_inc_amt = Number(userRoleData[k].incentive_percentage);
                                }
                                else if (Number(userRoleData[k].role_id) === 9) {
                                    var onb_mgr_inc_amt = Number(userRoleData[k].incentive_percentage);
                                }
                                else if (Number(userRoleData[k].role_id) === 10) {
                                    var tl_inc_amount = Number(userRoleData[k].incentive_percentage);
                                }
                            }

                            // let recruiter_inc_amt = net_margin * 0.07;
                            // let tl_inc_amount = net_margin * 0.03;
                            // let onb_mgr_inc_amt = net_margin * 0.0075;
                            // let admin_inc_amount = net_margin * 0.02;

                            let obj = {
                                net_margin: (net_margin).toFixed(2),
                                recruiter_inc_amt: (recruiter_inc_amt).toFixed(2),
                                tl_inc_amount: (tl_inc_amount).toFixed(2),
                                onb_mgr_inc_amt: (onb_mgr_inc_amt).toFixed(2),
                                admin_inc_amount: (admin_inc_amount).toFixed(2),
                                recruiter_id: getAccIncentive[0].recruiter_id,
                                onb_mgr_id: getAccIncentive[0].onb_mgr_id,
                                team_lead_id: getAccIncentive[0].team_lead_id,
                                manager_id: getAccIncentive[0].manager_id,
                                rec_payroll_id: rec_payroll_id.join(','),
                                recruitee_id: getAccData[i].recruitee_id
                            };
                            recruiteeData.push(obj);
                        }

                    }

                    let count = 0;

                    if (recruiteeData.length) {
                        let getLincFile2 = await getLatestincFile();
                        let addincfile = await insertIncentiveFile(req.body, getLincFile2);
                        if (addincfile === "success") {
                            let getLincFile = await getLatestincFile();

                            for (let k = 0; k < recruiteeData.length; k++) {
                                let addinc = await insertIncentiveData(req.body, getLincFile[0].inc_file_id, recruiteeData[k]);
                                if (addinc === "success") {
                                    count++;
                                }

                            }

                            if (count === recruiteeData.length) {
                                res.json("success");
                            } else {
                                res.json("Problem while inserting into tbl_incentive.")
                            }



                        } else {
                            res.json("Problem while inserting into tbl_incentive_file.")
                        }
                    }
                    else {
                        res.json("No data to be inserted.")
                    }
                } else {
                    res.json("NO RECRUITEE IN Payroll.")
                }









            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getUserRoles() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from  tbl_role  
        WHERE role_id IN (1,5,9,10)`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getMinWeekRecruitee(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select min(b.wk_start_date) AS min
        from tbl_account_file as a 
        INNER JOIN tbl_week as b On b.week_id=a.week_id 
        INNER JOIN tbl_payroll_invoice AS c ON c.acc_file_id=a.acc_file_id 
        WHERE  c.recruitee_id=${data.recruitee_id} and c.assignment_id=${data.assignment_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function week_idmin(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from  tbl_week  
        WHERE wk_start_date="${data}"`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getWrkHourMin(id, data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select (rec_reg_hr+rec_ot_hr+rec_holiday_hr) as sum from  tbl_rec_work_hr  
        WHERE week_id="${id}" and recruitee_id="${data.recruitee_id}" and assignment_id="${data.assignment_id}"`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function geAccountPayrollData(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT DISTINCT recruitee_id,assignment_id FROM tbl_payroll_invoice WHERE acc_file_id IN(${data})`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function geAccountPayrollInfo(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT DISTINCT recruitee_id,assignment_id FROM tbl_payroll_invoice WHERE acc_file_id IN(${data}) and recruitee_id=${data1.recruitee_id} `;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getAssignmentByrecruitee(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT total_working_hr AS sum FROM tbl_assignment WHERE recruitee_id=${data.recruitee_id} and assignment_id=${data.assignment_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function geAccountIncentiveData(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_payroll_invoice AS a  
        INNER JOIN tbl_assignment AS b ON b.assignment_id=a.assignment_id
        INNER JOIN tbl_onboarding AS c ON c.onboarding_id=b.onboarding_id 
        INNER JOIN tbl_assign_manager AS h ON h.application_id=b.application_id
        WHERE a.acc_file_id IN(${data}) AND a.recruitee_id='${data1.recruitee_id}' and a.assignment_id=${data1.assignment_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                //console.log("after insert",sql,res)
                resolve(res);
            }
        })
    })
}

function insertIncentiveFileData(data, data2, week, pcode, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let code = 10000;
        if (pcode.length) {
            code = parseInt(pcode[0].inc_file_no) + 1;
        } else {
            code = code + 1;
        }
        let sql = `insert into tbl_incentive_file set ?`;
        let post = {
            client_id: data2.client_id,
            month: data1.month,
            year: data1.year,
            week_id_list: week,
            create_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
            create_by: data.create_by,
            inc_file_no: code,
            file_type: "backlog"
        }
        db.query(sql, post, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}
function insertIncentiveFile(data, pcode) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        let code = 10000;
        if (pcode.length) {
            code = parseInt(pcode[0].inc_file_no) + 1;
        } else {
            code = code + 1;
        }
        let sql = `insert into tbl_incentive_file set ?`;
        let post = {
            client_id: data.client_id,
            month: data.month,
            year: data.year,
            week_id_list: data.week_id_list,
            create_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
            create_by: data.create_by,
            inc_file_no: code
        }
        db.query(sql, post, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve("success");
            }
        })
    })
}

function updatePayrollStatus(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `update tbl_payroll_invoice set ? where rec_payroll_id='${data}'`;
        let post = {
            incentive_paid_status: "paid"
        }
        db.query(sql, post, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve("success");
            }
        })
    })
}



function insertIncentiveData(data, ifID, calc) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `insert into tbl_incentive set ?`;
        let post = {
            rec_payroll_id: calc.rec_payroll_id,
            recruiter_id: calc.recruiter_id,
            tl_id: calc.team_lead_id,
            onb_mgr_id: calc.onb_mgr_id,
            admin_id: calc.manager_id,
            month: data.month,
            year: data.year,
            net_margin: calc.net_margin,
            recruiter_inc_amt: calc.recruiter_inc_amt,
            tl_inc_amount: calc.tl_inc_amount,
            onb_inc_amount: calc.onb_mgr_inc_amt,
            admin_inc_amount: calc.admin_inc_amount,
            inc_file_id: ifID,
            recruitee_id: calc.recruitee_id
        }
        db.query(sql, post, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve("success");
            }
        })
    })
}

function getLatestincFile() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * FROM tbl_incentive_file order by inc_file_id desc`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}


app.post("/vcsapi/get/incentive/file/data", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {

                let str = "";

                if (req.body.client_id !== "ALL") {
                    str = `WHERE a.client_id=${req.body.client_id}`;
                }
                if (req.body.month !== "ALL") {
                    if (str === "") {
                        str = `where a.month='${req.body.month}' `;
                    } else {
                        str = str + ` AND a.month='${req.body.month}'`;
                    }
                }

                if (req.body.year !== "ALL") {
                    if (str === "") {
                        str = `where a.year='${req.body.year}' `;
                    } else {
                        str = str + ` AND a.year='${req.body.year}'`;
                    }
                }


                let getinc = await getincentiveDetails(str);

                res.json(getinc);



            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getincentiveDetails(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * FROM tbl_incentive_file AS a INNER JOIN tbl_client AS b ON a.client_id=b.client_id 
        INNER JOIN tbl_user AS c ON c.user_id=a.create_by 
        ${data}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

app.get("/vcsapi/get/incentive/file/download/excel/:inc_file_id/:client_id/:user_id/:name", function (req, res) {

    async function apps() {
        try {

            var getinc = await getincentiveData(req.params);
            // res.json(getinc)
            var details = [];
            var data = ""
            var getincrest = []
            if (getinc.length > 0) {
                for (let j = 0; j < getinc.length; j++) {
                    var payroll = (getinc[j].rec_payroll_id).split(',');
                    var restData = [];
                    let pay_amount = 0.00;
                    let bill_amount = 0.00;
                    let perc_pay_amount = 0.00;
                    let perc_bill_amount = 0.00;
                    let bonus = 0.00;
                    for (let i = 0; i < payroll.length; i++) {
                        // //console.log(payroll[i])
                        getincrest = await getincentiveDataRest(payroll[i]);
                        // //console.log(getincrest)
                        if (getincrest.length > 0) {
                            if (!getincrest[0].reg_hr) {
                                getincrest[0].reg_hr = 0;
                            }
                            if (!getincrest[0].onb_regular_pay_rate) {
                                getincrest[0].onb_regular_pay_rate = 0;
                            }
                            if (!getincrest[0].onb_regular_bill_rate) {
                                getincrest[0].onb_regular_bill_rate = 0;
                            }
                            if (!getincrest[0].bonus_amount) {
                                getincrest[0].bonus_amount = 0;
                            }

                            perc_pay_amount = perc_pay_amount + (parseFloat(getincrest[0].reg_hr) * parseFloat(getincrest[0].onb_regular_pay_rate) * 0.14);
                            perc_bill_amount = perc_bill_amount + (parseFloat(getincrest[0].reg_hr) * parseFloat(getincrest[0].onb_regular_bill_rate) * 0.04);
                            pay_amount = pay_amount + parseFloat(getincrest[0].onb_regular_pay_rate);
                            bill_amount = bill_amount + parseFloat(getincrest[0].onb_regular_bill_rate);
                            bonus = bonus + parseFloat(getincrest[0].bonus_amount);
                            restData.push(getincrest[0]);
                        }
                    }
                    // //console.log(restData);
                    if (restData.length > 0) {
                        let obj = {
                            perc_pay_amount: (perc_pay_amount).toFixed(2),
                            perc_bill_amount: (perc_bill_amount).toFixed(2),
                            pay_amount: (pay_amount).toFixed(2),
                            bill_amount: (bill_amount).toFixed(2),
                            bonus: (bonus).toFixed(2),
                            month_start_date: restData[0].wk_start_date,
                            month_end_date: restData[restData.length - 1].wk_end_date,
                            names: restData[0],
                            incentive: getinc[j]
                        }
                        details.push(obj);
                    }
                }

            } else {
                res.json("no incentive data");

            }
            var getname = await getUsername(req.params.user_id);
            // if(getincrest.length>0){
            var getclientname = await getClientName(req.params.client_id);
            var cn = getclientname[0].client_name
            // }else{
            //     cn = ''
            // }

            if (getinc[0].week_id_list === "") {
                var wl = ''
            } else {
                var wlistid = (getinc[0].week_id_list).split(",");
                // //console.log(wlistid)
                var weeklist = [];
                for (k in wlistid) {
                    var sweekdata = await getWeek(parseInt(wlistid[k]));
                    // //console.log(sweekdata)
                    if (sweekdata.length > 0) {
                        var sd = "  " + sweekdata[0].wk_start_date + "-" + sweekdata[0].wk_end_date;
                        weeklist.push(sd);
                    }
                }
                var wl = weeklist.join(",");
            }

            // //console.log(wl)
            let user_name = ""
            if (getname[0].user_middle_name === null) {
                user_name = getname[0].user_first_name + " " + getname[0].user_last_name
            } else {
                user_name = getname[0].user_first_name + " " + getname[0].user_middle_name + " " + getname[0].user_last_name
            }
            let data1 = {
                created_by: user_name,
                client: cn,
                year: getinc[0].year,
                month: getinc[0].month,
                inc_file_no: getinc[0].inc_file_no,
                week_list: wl
            }
            if (details.length > 0) {
                //console.log("out")




                for (i in details) {
                    let bill_amount = ''
                    let pay_amount = ''
                    let perc_pay_amount = ''
                    let perc_bill_amount = ''
                    let bonus = ''
                    let net_margin = ''
                    let recruiter_inc_amt = ''
                    let tl_inc_amount = ''
                    let admin_inc_amount = ''
                    let onb_inc_amount = ''

                    if (details[i].bill_amount !== null && isNaN(details[i].bill_amount) === false) {
                        bill_amount = details[i].bill_amount
                    } else {
                        bill_amount = 0
                    }
                    if (details[i].pay_amount !== null && isNaN(details[i].pay_amount) === false) {
                        pay_amount = details[i].pay_amount
                    } else {
                        pay_amount = 0
                    }
                    if (details[i].perc_pay_amount !== null && isNaN(details[i].perc_pay_amount) === false) {
                        perc_pay_amount = details[i].perc_pay_amount
                    } else {
                        perc_pay_amount = 0
                    }
                    if (details[i].perc_bill_amount !== null && isNaN(details[i].perc_bill_amount) === false) {
                        perc_bill_amount = details[i].perc_bill_amount
                    } else {
                        perc_bill_amount = 0
                    }
                    if (details[i].bonus !== null && isNaN(details[i].bonus) === false) {
                        bonus = details[i].bonus
                    } else {
                        bonus = 0
                    }
                    if (details[i].incentive.net_margin !== null && isNaN(details[i].incentive.net_margin) === false) {
                        net_margin = details[i].incentive.net_margin
                    } else {
                        net_margin = 0
                    }
                    if (details[i].incentive.recruiter_inc_amt !== null && isNaN(details[i].incentive.recruiter_inc_amt) === false) {
                        recruiter_inc_amt = details[i].incentive.recruiter_inc_amt
                    } else {
                        recruiter_inc_amt = 0
                    }
                    if (details[i].incentive.tl_inc_amount !== null && isNaN(details[i].incentive.tl_inc_amount) === false) {
                        tl_inc_amount = details[i].incentive.tl_inc_amount
                    } else {
                        tl_inc_amount = 0
                    }
                    if (details[i].incentive.admin_inc_amount !== null && isNaN(details[i].incentive.admin_inc_amount) === false) {
                        admin_inc_amount = details[i].incentive.admin_inc_amount
                    } else {
                        admin_inc_amount = 0
                    }
                    if (details[i].incentive.onb_inc_amount !== null && isNaN(details[i].incentive.onb_inc_amount) === false) {
                        onb_inc_amount = details[i].incentive.onb_inc_amount
                    } else {
                        onb_inc_amount = 0
                    }
                    let rec_name = ""
                    if (details[i].names.user_middle_name === null) {
                        rec_name = details[i].names.user_first_name + " " + details[i].names.user_last_name
                    } else {
                        rec_name = details[i].names.user_first_name + " " + details[i].names.user_middle_name + " " + details[i].names.user_last_name
                    }
                    let recruiter_name = ""
                    if (details[i].names.recruiter_middle_name === null) {
                        recruiter_name = details[i].names.recruiter_first_name + " " + details[i].names.recruiter_last_name
                    } else {
                        recruiter_name = details[i].names.recruiter_first_name + " " + details[i].names.recruiter_middle_name + " " + details[i].names.recruiter_last_name
                    }
                    let teamlead_name = ""
                    if (details[i].names.team_lead_middle_name === null) {
                        teamlead_name = details[i].names.team_lead_first_name + " " + details[i].names.team_lead_last_name
                    } else {
                        teamlead_name = details[i].names.team_lead_first_name + " " + details[i].names.team_lead_middle_name + " " + details[i].names.team_lead_last_name
                    }
                    let onb_name = ""
                    if (details[i].names.onboard_middle_name === null) {
                        onb_name = details[i].names.onboard_first_name + " " + details[i].names.onboard_last_name
                    } else {
                        onb_name = details[i].names.onboard_first_name + " " + details[i].names.onboard_middle_name + " " + details[i].names.onboard_last_name
                    }
                    let manager_name = ""
                    if (details[i].names.manager_middle_name === null) {
                        manager_name = details[i].names.manager_first_name + " " + details[i].names.manager_last_name
                        manager_name = details[i].names.manager_first_name + " " + details[i].names.manager_middle_name + " " + details[i].names.manager_last_name
                    }
                    data =
                        data +
                        rec_name +
                        "\t" +
                        recruiter_name +
                        "\t" +
                        teamlead_name +
                        "\t" +
                        onb_name +
                        "\t" +
                        manager_name +
                        "\t" +
                        details[i].month_start_date +
                        "\t" +
                        details[i].month_end_date +
                        "\t" +
                        parseFloat(bill_amount).toFixed(2) +
                        "\t" +
                        parseFloat(pay_amount).toFixed(2) +
                        "\t" +
                        parseFloat(perc_pay_amount).toFixed(2) +
                        "\t" +
                        parseFloat(perc_bill_amount).toFixed(2) +
                        "\t" +
                        parseFloat(bonus).toFixed(2) +
                        "\t" +
                        parseFloat(net_margin).toFixed(2) +
                        "\t" +
                        parseFloat(recruiter_inc_amt).toFixed(2) +
                        "\t" +
                        parseFloat(tl_inc_amount).toFixed(2) +
                        "\t" +
                        parseFloat(admin_inc_amount).toFixed(2) +
                        "\t" +
                        parseFloat(onb_inc_amount).toFixed(2) +
                        "\n";
                }


            }
            var data2 = JSON.stringify(data);
            //console.log(data2)
            //console.log(data1)

            async function excle() {
                var get = await generateExcelIncentiveData(data1, data2);
                ///var dddd=send(datask);
                // //console.log('aaaa');
                // //console.log(datask);
                res.sendFile(get);
            }
            excle();



        } catch (err) {
            //console.log(err);
            res.json(err)
        }
    }
    apps();

});

function generateExcelIncentiveData(data, data2) {
    return new Promise(function (resolve, reject) {
        // try{
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles"
        });
        var wb = new xls.Workbook();
        var ws = wb.addWorksheet("Sheet 1");
        var style = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 14
            },
            alignment: {
                wrapText: true
                //horizontal: 'center',
            }
        });
        var style1 = wb.createStyle({
            font: {
                color: "#000000",
                bold: true,
                //underline: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "center",
                vertical: "center"
            },
            outline: {
                summaryBelow: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style2 = wb.createStyle({
            alignment: {
                wrapText: true,
                horizontal: "center",
                shrinkToFit: true
            },
            border: {
                left: {
                    style: "thin",
                    color: "000000"
                },
                right: {
                    style: "thin",
                    color: "000000"
                },
                top: {
                    style: "thin",
                    color: "000000"
                },
                bottom: {
                    style: "thin",
                    color: "000000"
                }
            }
        });
        var style3 = wb.createStyle({
            font: {
                color: "000000",
                bold: true,
                size: 12
            },
            alignment: {
                wrapText: true,
                horizontal: "left"
            }
        });

        ws.column(1).setWidth(3);
        ws.column(2).setWidth(20);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(20);
        ws.column(5).setWidth(20);
        ws.column(6).setWidth(20);
        ws.column(7).setWidth(15);
        ws.column(8).setWidth(15);
        ws.column(9).setWidth(15);
        ws.column(10).setWidth(15);
        ws.column(11).setWidth(15);
        ws.column(12).setWidth(15);
        ws.column(13).setWidth(15);
        ws.column(14).setWidth(15);
        ws.column(15).setWidth(15);
        ws.column(16).setWidth(15);
        ws.column(17).setWidth(15);
        ws.column(18).setWidth(15);
        ws.cell(1, 1, 1, 7, true)
            .string("Incentive Report")
            .style(style);
        ws.cell(3, 1, 3, 7, true)
            .string("Client              : " + data.client)
            .style(style3);
        ws.cell(4, 1, 4, 12, true)
            .string("File No            : " + data.inc_file_no)
            .style(style3);
        ws.cell(5, 1, 5, 12, true)
            .string("Month            : " + data.month)
            .style(style3);
        ws.cell(6, 1, 6, 12, true)
            .string("Year                : " + data.year)
            .style(style3);
        ws.cell(7, 1, 7, 12, true)
            .string("Week-list       :" + data.week_list)
            .style(style3);
        ws.cell(8, 1, 8, 12, true)
            .string("Created Date : " + moment(new Date(strTime)).format("MM/DD/YYYY"))
            .style(style3);
        ws.cell(9, 1, 9, 12, true)
            .string("Created By     : " + data.created_by)
            .style(style3)

        ws.cell(11, 1)
            .string("#")
            .style(style1);
        ws.cell(11, 2)
            .string("Recruitee Name")
            .style(style1);
        ws.cell(11, 3)
            .string("Recruiter Name")
            .style(style1);
        ws.cell(11, 4)
            .string("Team Lead Name")
            .style(style1);
        ws.cell(11, 5)
            .string("Onboarding Name")
            .style(style1);
        ws.cell(11, 6)
            .string("Manager Name")
            .style(style1);
        ws.cell(11, 7)
            .string("Month Start Date")
            .style(style1);
        ws.cell(11, 8)
            .string("Month End Date")
            .style(style1);
        ws.cell(11, 9)
            .string("Bill Amount(Reg)")
            .style(style1);
        ws.cell(11, 10)
            .string("Pay Amount(Reg)")
            .style(style1);
        ws.cell(11, 11)
            .string("14% of Pay Amt")
            .style(style1);
        ws.cell(11, 12)
            .string("4% of Bill Amt")
            .style(style1);
        ws.cell(11, 13)
            .string("Bonus")
            .style(style1);
        ws.cell(11, 14)
            .string("Net Margin")
            .style(style1);
        ws.cell(11, 15)
            .string("Recruiter Incentive(7%)")
            .style(style1);
        ws.cell(11, 16)
            .string("TL Incentive(3%)")
            .style(style1);
        ws.cell(11, 17)
            .string("Admin Incentive(2%)")
            .style(style1);
        ws.cell(11, 18)
            .string("Onboarding Incentive(0.75%)")
            .style(style1);

        ws.cell(12, 1)
            .number(1)
            .style(style2);

        var row = 12;
        var col = 1;
        var key = "";
        var count = 1;
        for (var i = 1; i < data2.length - 1; i++) {
            if (data2[i] == "\\" && data2[i + 1] == "t") {
                col = col + 1;

                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                key = "";
                i++;
            } else if (data2[i] == "\\" && data2[i + 1] == "n") {
                col = col + 1;
                ws.cell(row, col)
                    .string(key)
                    .style(style2);
                row = row + 1;
                count = count + 1;
                ////console.log(count);
                /// //console.log(data2[i+2]);
                if (data2[i + 2] == '"') {
                    break;
                } else {
                    ws.cell(row, 1)
                        .number(count)
                        .style(style2);
                }
                key = "";
                col = 1;
                i++;
            } else {
                var key = key + data2[i];
                ////console.log("in else condittion");
                ////console.log(key);
            }
        }
        wb.write(`/home/ubuntu/vcs/excle_file/incentive${data.year}${data.month}${data.created_by}.xlsx`, function (err) {
            if (err) resolve("err");
            else resolve(`/home/ubuntu/vcs/excle_file/incentive${data.year}${data.month}${data.created_by}.xlsx`);

        });
        // }catch(err){
        //     res.json(err)
        // }

    });
}

function getincentiveData(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT * 
        FROM tbl_incentive_file AS a 
        INNER JOIN tbl_incentive AS b ON b.inc_file_id=a.inc_file_id
        where a.inc_file_id=${data.inc_file_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getincentiveDataRest(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `SELECT a.*,d.*,k.*,
        f.user_first_name,f.user_middle_name,f.user_last_name,
        g.user_first_name AS recruiter_first_name, g.user_middle_name AS recruiter_middle_name, g.user_last_name AS recruiter_last_name, 
        h.user_first_name AS onboard_first_name, h.user_middle_name AS onboard_middle_name, h.user_last_name AS onboard_last_name, 
        i.user_first_name AS team_lead_first_name, i.user_middle_name AS team_lead_middle_name, i.user_last_name AS team_lead_last_name, 
        j.user_first_name AS manager_first_name, j.user_middle_name AS manager_middle_name, j.user_last_name AS manager_last_name 
        FROM tbl_payroll_invoice AS a 
        INNER JOIN tbl_assignment AS b ON b.assignment_id=a.assignment_id
        INNER JOIN tbl_assign_manager AS c ON c.application_id=b.application_id
        INNER JOIN tbl_onboarding AS d ON d.onboarding_id=b.onboarding_id
        INNER JOIN tbl_recruitee AS e ON e.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user AS f ON f.user_id=e.user_id
        INNER JOIN tbl_user AS g ON g.user_id=c.recruiter_id
        INNER JOIN tbl_user AS h ON h.user_id=c.onb_mgr_id
        INNER JOIN tbl_user AS i ON i.user_id=c.team_lead_id
        INNER JOIN tbl_user AS j ON j.user_id=c.manager_id
        INNER JOIN tbl_week AS k ON k.week_id=a.week_id
        where a.rec_payroll_id=${data}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}


app.post("/vcsapi/skilldata/by/candidate_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let p1 = await getskillmapCategory(req.body);
                // //console.log("1",p1)
                for (i = 0; i < p1.length; i++) {
                    let p2 = await getskillmapArea(req.body, p1[i]);
                    p1[i]["area"] = p2;
                    // //console.log("2",p2)
                    for (j = 0; j < p2.length; j++) {

                        let p3 = await getskillmapDomain(req.body, p2[j]);
                        p1[i]["area"][j]["domain"] = p3;
                        // //console.log("3",p3)
                        for (k = 0; k < p3.length; k++) {

                            let p4 = await getskillmapSet(req.body, p3[k]);
                            p1[i]["area"][j]["domain"][k]["set"] = p4;
                            // //console.log("4",p4)

                        }
                    }
                }

                res.json(p1);

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

app.post("/vcsapi/skilldata/by/user_id", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                let p1 = await getskillmapCategory2(req.body);
                // //console.log("1",p1)
                for (i = 0; i < p1.length; i++) {
                    let p2 = await getskillmapArea2(req.body, p1[i]);
                    p1[i]["area"] = p2;
                    // //console.log("2",p2)
                    for (j = 0; j < p2.length; j++) {

                        let p3 = await getskillmapDomain2(req.body, p2[j]);
                        p1[i]["area"][j]["domain"] = p3;
                        // //console.log("3",p3)
                        for (k = 0; k < p3.length; k++) {

                            let p4 = await getskillmapSet2(req.body, p3[k]);
                            p1[i]["area"][j]["domain"][k]["skillset"] = p4;
                            // //console.log("4",p4)

                        }
                    }
                }

                res.json(p1);

            } catch (err) {
                //console.log(err);
                res.json(err)
            }
        }
        apps();
    } else {
        res.status(401).json("token is not valid");
    }
});

function getskillmapCategory2(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct e.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        INNER JOIN tbl_candidate AS f ON f.candidate_id=a.candidate_id
        where f.user_id=${data.user_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getskillmapArea2(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct d.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        INNER JOIN tbl_candidate AS f ON f.candidate_id=a.candidate_id
        where f.user_id=${data.user_id} and d.skill_category_id=${data1.skill_category_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getskillmapDomain2(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct c.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        INNER JOIN tbl_candidate AS f ON f.candidate_id=a.candidate_id
        where f.user_id=${data.user_id} and c.skill_area_id=${data1.skill_area_id} `;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getskillmapSet2(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct b.*,a.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id
        INNER JOIN tbl_candidate AS f ON f.candidate_id=a.candidate_id
        where f.user_id=${data.user_id} and b.skill_domain_id=${data1.skill_domain_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}

function getskillmapCategory(data) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct e.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        where a.candidate_id=${data.candidate_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getskillmapArea(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct d.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        where a.candidate_id=${data.candidate_id} and d.skill_category_id=${data1.skill_category_id}
        and d.skill_area_id=${data.skill_area_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getskillmapDomain(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct c.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        where a.candidate_id=${data.candidate_id} and c.skill_area_id=${data1.skill_area_id} `;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
function getskillmapSet(data, data1) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select distinct b.*,a.* from tbl_skillset_map AS a 
        INNER JOIN tbl_skillset AS b ON b.skillset_id=a.skillset_id 
        INNER JOIN tbl_skill_domain AS c ON c.skill_domain_id=b.skill_domain_id 
        INNER JOIN tbl_skill_area as d ON d.skill_area_id=c.skill_area_id 
        INNER JOIN tbl_skill_category AS e ON e.skill_category_id=d.skill_category_id 
        where a.candidate_id=${data.candidate_id} and b.skill_domain_id=${data1.skill_domain_id}`;
        db.query(sql, function (err, res) {
            //  //console.log(sql);
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                // //console.log("after insert",res)
                resolve(res);
            }
        })
    })
}
module.exports = app;