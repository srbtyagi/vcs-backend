const express = require("express");
const app = express();
const stuff = require("../services/jwt.js");
const moment = require("moment");
const db = require("../db/db");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
var xls = require("excel4node");
const { FileArray } = require("express-fileupload");

app.get(
  "/vcsapi/api/generate/excel/employees/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null) {
          user_name = un[0].user_first_name + " " + un[0].user_last_name;
        } else {
          user_name =
            un[0].user_first_name +
            " " +
            un[0].user_middle_name +
            " " +
            un[0].user_last_name;
        }
        var data1 = {
          created_by: user_name,
        };
        let arr = await getAllEmp();
        var data = "";

        // //console.log(arr)
        for (i in arr) {
          var u_name = "";
          var sop_name = "";
          if (
            arr[i].user_middle_name === null ||
            arr[i].user_middle_name === ""
          ) {
            u_name = arr[i].user_first_name + " " + arr[i].user_last_name;
          } else {
            u_name =
              arr[i].user_first_name +
              " " +
              arr[i].user_middle_name +
              " " +
              arr[i].user_last_name;
          }
          if (
            arr[i].supervisor_first_name !== null &&
            arr[i].supervisor_last_name !== null
          ) {
            if (
              arr[i].supervisor_middle_name === null ||
              arr[i].supervisor_middle_name === ""
            ) {
              sop_name =
                arr[i].supervisor_first_name +
                " " +
                arr[i].supervisor_last_name;
            } else {
              sop_name =
                arr[i].supervisor_first_name +
                " " +
                arr[i].supervisor_middle_name +
                " " +
                arr[i].supervisor_last_name;
            }
          }
          data =
            data +
            arr[i].employee_code +
            "\t" +
            u_name +
            "\t" +
            arr[i].designation_name +
            "\t" +
            arr[i].role_name +
            "\t" +
            arr[i].dept_name +
            "\t" +
            arr[i].email +
            "\t" +
            arr[i].phone +
            "\t" +
            arr[i].date_of_joining +
            "\t" +
            sop_name +
            "\t" +
            arr[i].signatory_flag +
            "\t" +
            arr[i].user_status +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(data)
        async function excle() {
          var get = await generateExcelEmployeeData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
      } catch (err) {
        // //console.log(err);
        res.json(err);
      }
    }
    apps();
    // } else {
    //     res.status(401).json("token is not valid");
    // }
  }
);
function generateExcelEmployeeData(data, data2) {
  return new Promise(function (resolve, reject) {
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    var wb = new xls.Workbook();
    var ws = wb.addWorksheet("Sheet 1");
    var style = wb.createStyle({
      font: {
        color: "000000",
        bold: true,
        size: 14,
      },
      alignment: {
        wrapText: true,
        //horizontal: 'center',
      },
    });
    var style1 = wb.createStyle({
      font: {
        color: "#000000",
        bold: true,
        //underline: true,
        size: 12,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
        vertical: "center",
      },
      outline: {
        summaryBelow: true,
      },
      border: {
        left: {
          style: "thin",
          color: "000000",
        },
        right: {
          style: "thin",
          color: "000000",
        },
        top: {
          style: "thin",
          color: "000000",
        },
        bottom: {
          style: "thin",
          color: "000000",
        },
      },
    });
    var style2 = wb.createStyle({
      alignment: {
        wrapText: true,
        horizontal: "center",
        shrinkToFit: true,
        vertical: "center",
      },
      border: {
        left: {
          style: "thin",
          color: "000000",
        },
        right: {
          style: "thin",
          color: "000000",
        },
        top: {
          style: "thin",
          color: "000000",
        },
        bottom: {
          style: "thin",
          color: "000000",
        },
      },
    });
    var style3 = wb.createStyle({
      font: {
        color: "000000",
        bold: true,
        size: 12,
      },
      alignment: {
        wrapText: true,
        horizontal: "left",
      },
    });

    ws.column(1).setWidth(3);
    ws.column(2).setWidth(15);
    ws.column(3).setWidth(30);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(15);
    ws.column(7).setWidth(25);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);
    ws.column(10).setWidth(30);
    ws.column(11).setWidth(15);
    ws.column(12).setWidth(15);
    ws.column(13).setWidth(15);
    ws.column(14).setWidth(15);
    ws.column(15).setWidth(15);
    ws.column(16).setWidth(15);
    ws.column(17).setWidth(15);
    ws.column(18).setWidth(15);

    ws.cell(1, 1, 1, 12, true).string("Employee Report").style(style3);
    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Employee Code").style(style1);
    ws.cell(6, 3).string("Employee Name").style(style1);
    ws.cell(6, 4).string("Designation").style(style1);
    ws.cell(6, 5).string("Role").style(style1);
    ws.cell(6, 6).string("Department").style(style1);
    ws.cell(6, 7).string("Email").style(style1);
    ws.cell(6, 8).string("Phone").style(style1);
    ws.cell(6, 9).string("Date OF Joining").style(style1);
    ws.cell(6, 10).string("Supervisor Name").style(style1);
    ws.cell(6, 11).string("Signatory").style(style1);
    ws.cell(6, 12).string("Status").style(style1);

    ws.cell(7, 1).number(1).style(style2);

    var row = 7;
    var col = 1;
    var key = "";
    var count = 1;
    for (var i = 1; i < data2.length - 1; i++) {
      if (data2[i] == "\\" && data2[i + 1] == "t") {
        col = col + 1;

        ws.cell(row, col).string(key).style(style2);
        key = "";
        i++;
      } else if (data2[i] == "\\" && data2[i + 1] == "n") {
        col = col + 1;
        ws.cell(row, col).string(key).style(style2);
        row = row + 1;
        count = count + 1;
        ////console.log(count);
        /// //console.log(data2[i+2]);
        if (data2[i + 2] == '"') {
          break;
        } else {
          ws.cell(row, 1).number(count).style(style2);
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
    wb.write(
      `/home/ubuntu/vcs/excle_file/employee${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/employee${data.created_by}.xlsx`
          );
      }
    );
  });
}
function getAllEmp() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select f.*,a.*,b.*,c.role_name,d.dept_name,
        e.user_first_name AS supervisor_first_name,
        e.user_middle_name AS supervisor_middle_name,
        e.user_last_name AS supervisor_last_name
         from tbl_employee AS a
        INNER JOIN tbl_user AS b ON a.user_id=b.user_id
        INNER JOIN tbl_role AS c ON a.role_id=c.role_id
        INNER JOIN tbl_department AS d ON a.dept_id=d.dept_id
        INNER JOIN tbl_designation As f ON f.designation_id=a.designation
        LEFT JOIN tbl_user AS e ON e.user_id=a.supervisor_name WHERE b.email<>"admin@gmail.com" AND b.email<>"raj@vishusa.com" AND b.email<>"dhruv@vishusa.com"
        order by b.user_id desc`;
    db.query(sql, function (err, res) {
      if (err) {
        // //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
app.get(
  "/vcsapi/api/generate/excel/incentive_process/:employee/:f_date/:t_date/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null) {
          user_name = un[0].user_first_name + " " + un[0].user_last_name;
        } else {
          user_name =
            un[0].user_first_name +
            " " +
            un[0].user_middle_name +
            " " +
            un[0].user_last_name;
        }
        var data1 = {
          created_by: user_name,
          from_month:
            moment(new Date(req.params.f_date)).format("MMMM") +
            ", " +
            moment(new Date(req.params.f_date)).format("YYYY"),
          to_month:
            moment(new Date(req.params.t_date)).format("MMMM") +
            ", " +
            moment(new Date(req.params.f_date)).format("YYYY"),
        };
        var arr = [];

        if (req.params.employee === "ALL") {
          let p = await getIncentiveExcelDataAll(req.params);
          arr.push(...p);
        } else {
          let p = await getIncentiveExcelData(req.params);
          arr.push(...p);
        }
        var data = "";
        let amt = 0.0;
        // res.json(arr);
        for (i in arr) {
          if (
            arr[i].designation === "admin" ||
            arr[i].designation === "Manager"
          ) {
            amt = arr[i].admin_inc_amount;
          }
          if (arr[i].designation === "Recruiter") {
            amt = arr[i].recruiter_inc_amt;
          }
          if (arr[i].designation === "On-boarding Member") {
            amt = arr[i].onb_inc_amount;
          }
          if (arr[i].designation === "Team Lead") {
            amt = arr[i].tl_inc_amount;
          }
          let amount = 0;
          if (amt === "NaN" || isNaN(amt) || amt === null) {
            amount = 0.0;
          } else {
            amount = amt;
          }
          let rec_name = "";
          if (arr[i].rm_name === null) {
            rec_name = arr[i].rf_name + " " + arr[i].rl_name;
          } else {
            rec_name =
              arr[i].rf_name + " " + arr[i].rm_name + " " + arr[i].rl_name;
          }
          let emp_nae = "";
          if (arr[i].em_name === null) {
            emp_nae = arr[i].ef_name + " " + arr[i].el_name;
          } else {
            emp_nae =
              arr[i].ef_name + " " + arr[i].em_name + " " + arr[i].el_name;
          }
          data =
            data +
            emp_nae +
            "\t" +
            arr[i].designation +
            "\t" +
            arr[i].month +
            "\t" +
            arr[i].year +
            "\t" +
            arr[i].client_name +
            "\t" +
            rec_name +
            "\t" +
            parseFloat(amount).toFixed(2) +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(data2)
        async function excle() {
          var get = await generateExcelIncentivePData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
      } catch (err) {
        // //console.log(err);
        res.json(err);
      }
    }
    apps();
    // } else {
    //     res.status(401).json("token is not valid");
    // }
  }
);
function generateExcelIncentivePData(data, data2) {
  return new Promise(function (resolve, reject) {
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    var wb = new xls.Workbook();
    var ws = wb.addWorksheet("Sheet 1");
    var style = wb.createStyle({
      font: {
        color: "000000",
        bold: true,
        size: 14,
      },
      alignment: {
        wrapText: true,
        //horizontal: 'center',
      },
    });
    var style1 = wb.createStyle({
      font: {
        color: "#000000",
        bold: true,
        //underline: true,
        size: 12,
      },
      alignment: {
        wrapText: true,
        horizontal: "center",
        vertical: "center",
      },
      outline: {
        summaryBelow: true,
      },
      border: {
        left: {
          style: "thin",
          color: "000000",
        },
        right: {
          style: "thin",
          color: "000000",
        },
        top: {
          style: "thin",
          color: "000000",
        },
        bottom: {
          style: "thin",
          color: "000000",
        },
      },
    });
    var style2 = wb.createStyle({
      alignment: {
        wrapText: true,
        horizontal: "center",
        shrinkToFit: true,
        vertical: "center",
      },
      border: {
        left: {
          style: "thin",
          color: "000000",
        },
        right: {
          style: "thin",
          color: "000000",
        },
        top: {
          style: "thin",
          color: "000000",
        },
        bottom: {
          style: "thin",
          color: "000000",
        },
      },
    });
    var style3 = wb.createStyle({
      font: {
        color: "000000",
        bold: true,
        size: 12,
      },
      alignment: {
        wrapText: true,
        horizontal: "left",
      },
    });

    ws.column(1).setWidth(3);
    ws.column(2).setWidth(30);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(15);
    ws.column(7).setWidth(30);
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
    ws.cell(1, 1, 1, 12, true).string("Incentive Report").style(style);
    ws.cell(3, 1, 3, 12, true)
      .string("From Month    : " + data.from_month)
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("To Month       : " + data.to_month)
      .style(style3);

    ws.cell(5, 1, 5, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(6, 1, 6, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(8, 1).string("#").style(style1);
    ws.cell(8, 2).string("VCS Emp").style(style1);
    ws.cell(8, 3).string("Designation").style(style1);
    ws.cell(8, 4).string("Month").style(style1);
    ws.cell(8, 5).string("Year").style(style1);
    ws.cell(8, 6).string("Client").style(style1);
    ws.cell(8, 7).string("Recruitee Name").style(style1);
    ws.cell(8, 8).string("Amount").style(style1);

    ws.cell(9, 1).number(1).style(style2);

    var row = 9;
    var col = 1;
    var key = "";
    var count = 1;
    for (var i = 1; i < data2.length - 1; i++) {
      if (data2[i] == "\\" && data2[i + 1] == "t") {
        col = col + 1;

        ws.cell(row, col).string(key).style(style2);
        key = "";
        i++;
      } else if (data2[i] == "\\" && data2[i + 1] == "n") {
        col = col + 1;
        ws.cell(row, col).string(key).style(style2);
        row = row + 1;
        count = count + 1;
        ////console.log(count);
        /// //console.log(data2[i+2]);
        if (data2[i + 2] == '"') {
          break;
        } else {
          ws.cell(row, 1).number(count).style(style2);
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
    wb.write(
      `/home/ubuntu/vcs/excle_file/income_recon${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/income_recon${data.created_by}.xlsx`
          );
      }
    );
  });
}
function getIncentiveExcelData(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let frm_date = moment(new Date(data.f_date)).format("MM/DD/YYYY");
    let to_date = moment(new Date(data.t_date)).format("MM/DD/YYYY");

    let sql = `SELECT * FROM(
            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.admin_id
                        inner join tbl_employee e on e.user_id=i.admin_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="admin" OR designation="Manager") and admin_id=${data.employee}

            UNION

            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.recruiter_id
                        inner join tbl_employee e on e.user_id=i.recruiter_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="Recruiter") and recruiter_id=${data.employee}

            UNION

            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.onb_mgr_id
                        inner join tbl_employee e on e.user_id=i.onb_mgr_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="On-boarding Member") and onb_mgr_id=${data.employee}

            UNION

            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.tl_id
                        inner join tbl_employee e on e.user_id=i.tl_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="Team Lead") and tl_id=${data.employee}

            ) temp2
             where  date>="${data.f_date}" and date<="${data.t_date}" `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getIncentiveExcelDataAll(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let frm_date = moment(new Date(data.f_date)).format("MM/DD/YYYY");
    let to_date = moment(new Date(data.t_date)).format("MM/DD/YYYY");

    let sql = `SELECT * FROM(
            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.admin_id
                        inner join tbl_employee e on e.user_id=i.admin_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="admin" OR designation="Manager")

            UNION

            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.recruiter_id
                        inner join tbl_employee e on e.user_id=i.recruiter_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="Recruiter")

            UNION

            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.onb_mgr_id
                        inner join tbl_employee e on e.user_id=i.onb_mgr_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="On-boarding Member")

            UNION

            SELECT * FROM(
                    SELECT i.*,c.client_name,e.*,
                    eu.user_first_name as ef_name,eu.user_middle_name as em_name,eu.user_last_name as el_name,
                    u.user_first_name as rf_name,u.user_middle_name as rm_name,u.user_last_name as rl_name,
                    str_to_date(concat(i.year,'-', i.month,'-01'), '%Y-%M-%d') as date
                    FROM tbl_incentive as i
                        INNER JOIN tbl_incentive_file AS j ON j.inc_file_id=i.inc_file_id
                        inner join tbl_client c on c.client_id=j.client_id
                        inner join tbl_user eu on eu.user_id=i.tl_id
                        inner join tbl_employee e on e.user_id=i.tl_id
                        inner join tbl_recruitee r on r.recruitee_id=i.recruitee_id
                        inner join tbl_user u on u.user_id=r.user_id ) as temp
                     where   (designation="Team Lead")

            ) temp2
         where  date>="${data.f_date}" and date<="${data.t_date}"`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}

app.get(
  "/vcsapi/get/api/tbl/conf_document/:recruitee_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let cnfdoc = await getConfDocumentByRecID(req.params);
          res.json(cnfdoc);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
function getConfDocumentByRecID(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select d.*,
        uu.user_first_name as uploadby_fname,uu.user_middle_name as uploadby_mname,uu.user_last_name as uploadby_lname,
        ru.user_first_name as recruitee_fname,ru.user_middle_name as recruitee_mname,ru.user_last_name as recruitee_lname,
        r.*
         from tbl_conf_document as d
        inner join tbl_user uu on uu.user_id=d.upload_user_id
        inner join tbl_recruitee r on r.recruitee_id=d.recruitee_id
        inner join tbl_user ru on ru.user_id=r.user_id
        where d.recruitee_id=${data.recruitee_id}`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
app.get(
  "/vcsapi/get/api/tbl/conf_document/:conf_doc_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let cnfdoc = await getConfDocument(req.params);
        if (cnfdoc.length > 0) {
          return res.sendFile(cnfdoc[0].conf_doc_path);
        } else {
          return res.status(200).json("NO doc uploaded");
        }
      } catch (err) {
        //console.log(err);
        res.json(err);
      }
    }
    apps();
    // } else {
    //     res.status(401).json("token is not valid");
    // }
  }
);
function getConfDocument(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_conf_document where conf_doc_id=${data.conf_doc_id}`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
app.post(
  "/vcsapi/insert/api/tbl/conf_document/:conf_doc_name/:user_id/:recruitee_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let cnfdoc = await insertConfDocument(req.files, req.params);
          if (cnfdoc === "success") {
            res.json(cnfdoc);
          } else {
            res.json("error");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
function insertConfDocument(data1, data) {
  return new Promise(function (resolve, reject) {
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    let file = data1.file;
    filename = data1.file.name;
    let path = "/home/ubuntu/vcs/Uploads/ConfDocument/" + filename;
    file.mv(
      "/home/ubuntu/vcs/Uploads/ConfDocument/" + filename,
      function (err) {
        if (err) {
          reject(err);
        } else {
          let sql = `insert into tbl_conf_document set ?`;
          let post = {
            recruitee_id: data.recruitee_id,
            upload_datetime: moment(new Date(strTime)).format(
              "MM/DD/YYYY h:mm:ss A"
            ),
            upload_user_id: data.user_id,
            conf_doc_path: path,
            conf_doc_name: data.conf_doc_name,
          };
          db.query(sql, post, function (err, res) {
            if (err) {
              //console.log(err);
              reject(err);
            } else {
              resolve("success");
            }
          });
        }
      }
    );
  });
}

app.get(
  "/vcsapi/get/api/tbl/system_name",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let jobclients = await getSystemNameList();
          res.json(jobclients);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
function getSystemNameList() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_system_name where system_name_status="active"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}

app.post(
  "/vcsapi/api/get/action_id/role_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await getRoleAccess(req.body);
          ////console.log(get.action_id);

          var arry = [];
          for (i = 0; i <= get.length - 1; i++) {
            arry.push(get[i].action_id);
          }
          ////console.log(arry);

          return res.json(arry);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
// user role me list me role data jo dikhta hai
app.get(
  "/vcsapi/api/get_userrole/fields",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          const data = await query16();
          return res.json(data);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
//user role me default access pe click karne k baad jo data dikhta hai
app.post(
  "/vcsapi/api/get/data/role_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await query10(req.body.role_id);
          let newData = [];
          let indexof = [];

          for (let i = 0; i <= get.length - 1; i++) {
            if (indexof.length == 0) {
              newData.push(get[i]);
              indexof.push(get[i].submodule_name);
            } else {
              let indvalue = indexof.indexOf(get[i].submodule_name);
              if (indvalue == -1) {
                newData.push(get[i]);
                indexof.push(get[i].submodule_name);
              } else {
                let action_names = newData[indvalue].action_name;
                //console.log(action_names);
                //console.log("action_types");
                newData[indvalue].action_name =
                  action_names + "," + get[i].action_name;
              }
            }
          }
          return res.status(200).json(newData);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
// edit karte tym role name unique hai check karte hai
app.post(
  "/vcsapi/api/check_post_role",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let check = await query15(req.body);
          return res.status(200).json(check);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else res.status(401).json("token is not valid");
  }
);
//get user access
app.get(
  "/vcsapi/get/api/user/access",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let modules = await getUserAccess();
          res.json(modules);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.get(
  "/vcsapi/get/api/checkIfexists/:job_no",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let job_nos = await getJobNo(req.params.job_no);
          if (job_nos.length > 0) {
            res.json("already exists");
          } else {
            res.json("not exists");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
function getJobNo(j_no) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_job where job_no="${j_no}" and job_status!='delete' `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
app.post(
  "/api/api/get/action_id_by_user_id/user_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await query7(req.body.role_id);
          if (get.length > 0) {
            let deletess = await query9(req.body);
            let insert = await query8(req.body.data, req.body);
            let gets = await query13(req.body);
            var arrys1 = [];
            var arrys2 = [];
            var arrys3 = [];
            for (i = 0; i <= gets.length - 1; i++) {
              arrys1.push(gets[i].action_id.toString().split("").pop());
              arrys2.push(gets[i].action_id);
              let length = gets[i].action_id.toString().length;
              let value = gets[i].action_id.toString().slice(0, length - 1);
              arrys3.push(value);
              let check_value = query14(arrys2, req.body);
            }
            res.json("check_value");
          } else {
            //console.log("else");
            let insert = await query8(req.body.data, req.body);
            let gets = await query13(req.body);
            var arrys1 = [];
            var arrys2 = [];
            var arrys3 = [];
            for (i = 0; i <= gets.length - 1; i++) {
              arrys1.push(gets[i].action_id.toString().split("").pop());
              arrys2.push(gets[i].action_id);
              let length = gets[i].action_id.toString().length;
              let value = gets[i].action_id.toString().slice(0, length - 1);
              arrys3.push(value);
            }

            let check_value = query14(arrys2, req.body);

            return res.json("check_value");
          }
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
app.put(
  "/vcsapi/api/update/status/userrole/:role_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let update = await query5(req.body, req.params);
          return res.json(update);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
app.put(
  "/vcsapi/api/update/userrole/:role_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let update = await query4(req.body, req.params);
          return res.json(update);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/api/post/insert/role_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.body);
          let get = await query7(req.body.role_id);
          //console.log("get",get)
          if (get.length > 0) {
            ///delete from tbl_role_access if exist

            let deletess = await query9(req.body);
          }

          let insert = await query8(req.body.data, req.body);

          let getEmployees = await getEmployeeByRole(req.body.role_id);

          for (let i = 0; i < getEmployees.length; i++) {
            let deleteUserAcc = await deleteUserAccess(getEmployees[i].user_id);
            if (deleteUserAcc === "success") {
              for (let j = 0; j < req.body.data.length; j++) {
                let insertUserAcc = await insertUserAccess(
                  getEmployees[i].user_id,
                  req.body.data[j].action_id
                );
              }
            }
          }

          res.json("check_value");
        } catch (err) {
          //console.log(err)
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/update/api/client_name",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let update_client = await updateClientName(req.body);
          res.json(update_client);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change_status/client",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let clientstatus = await updateClientStatus(req.body);
          res.json(clientstatus);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/add/api/client/client_name",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let add_client = await addClientDetails(req.body);
          res.json(add_client);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.get(
  "/vcsapi/get/all/clients",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let getDept = await getAllClient();

          res.json(getDept);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/get/applicant/by/clientID",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await getApplicationByclientID(req.body.client_id);

          res.json(get);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.get(
  "/vcsapi/get/applicant/by/clientID/ALL/data",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await getApplicationByclientIDALL();

          res.json(get);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/get/asign_manager/and/applicant/details",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.body);
          let str = "";
          if (req.body.client_id !== "ALL") {
            str = ` where c.client_id=${req.body.client_id}`;
          }
          if (req.body.user_id !== "ALL") {
            if (str === "") {
              str = ` where e.user_id=${req.body.user_id}`;
            } else {
              str = str + ` and e.user_id=${req.body.user_id}`;
            }
          }

          if (req.body.manager_id !== "ALL") {
            if (str === "") {
              // //console.log("if",str);
              str = ` where (am.recruiter_id=${req.body.manager_id} OR am.onb_mgr_id=${req.body.manager_id} OR am.team_lead_id=${req.body.manager_id} OR am.manager_id=${req.body.manager_id})`;
            } else {
              // //console.log("else",str);
              str =
                str +
                ` and (am.recruiter_id=${req.body.manager_id} OR am.onb_mgr_id=${req.body.manager_id} OR am.team_lead_id=${req.body.manager_id} OR am.manager_id=${req.body.manager_id})`;
            }
          }

          let get = await getApplicantAndAssignManagerDetails(str);

          for (let i = 0; i < get.length; i++) {
            let getRecruiter = await getAllUser(get[i].recruiter_id);
            let getOnboard = await getAllUser(get[i].onb_mgr_id);
            let getteamLead = await getAllUser(get[i].team_lead_id);
            let getManager = await getAllUser(get[i].manager_id);
            get[i]["recruiterData"] = getRecruiter[0];
            get[i]["onboardData"] = getOnboard[0];
            get[i]["teamLearData"] = getteamLead[0];
            get[i]["managerData"] = getManager[0];
          }

          //console.log(get.length);
          res.json(get);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.get(
  "/vcsapi/get/clients",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let getclient = await getActvClient();

          res.json(getclient);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.get(
  "/vcsapi/get/Recruiter/all",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await getEmployeeActive();
          if (get.length > 0) {
            res.json(get);
          } else {
            res.json("data not found");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/update/fillup/status/done",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await updateFillUpStatusDone(req.body);
          if (get === "success") {
            res.json(get);
          } else {
            res.json("not updated");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.get(
  "/vcsapi/api/get/standard/document/data",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          const data = await getStandardDocuments();
          return res.json(data);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/api/update/expirY_dates/document",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let arr = req.body.exp_date;
          for (i in arr) {
            var data = await UpdateExpiryDatesDocument(arr[i]);
            //console.log(data)
          }

          return res.json("success");
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/upload/document/:rec_doc_name/:user_id/:doc_id/:expiryDate",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.files)
          //console.log(req.params)
          let sDocName = "";
          let dtyp = await getStandardDocumentsbyID(req.params.doc_id);
          if (dtyp.length > 0) {
            sDocName = dtyp[0].doc_name;
          }
          //console.log(sDocName,"DOC NAME STANDARD")

          let rid = await getRecruitee(req.params.user_id);
          let getRdoc = await checkRecDocumentsbyrbName(
            rid[0].recruitee_id,
            req.params.rec_doc_name
          );

          // //console.log("getRdoc",getRdoc);
          if (rid.length) {
            let post = await uploadFile(
              req.params.doc_id,
              req.files,
              rid[0].recruitee_id,
              sDocName,
              req.params.rec_doc_name,
              getRdoc,
              req.params.expiryDate
            );
            if (post === "success") {
              let getlatestrd = await getLatestRecDocuments(
                rid[0].recruitee_id,
                req.params.rec_doc_name
              );
              //console.log("post", post)
              return res.json({
                message: "success",
                rec_doc_details: getlatestrd[0],
              });
            } else {
              return res.status(200).json("doc not uploaded");
            }
          } else {
            return res.status(200).json("recruitee_id not found");
          }
        } catch (err) {
          //console.log("++++++++++++++++", err)
          return res.send("ERROR" + err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/submit/document/details/:rec_doc_id/:rec_doc_name/:user_id/:doc_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          // //console.log(req.files)
          // //console.log(req.params)
          let sDocName = "";
          let dtyp = await getStandardDocumentsbyID(req.params.doc_id);
          if (dtyp.length > 0) {
            sDocName = dtyp[0].doc_name;
          }
          let rid = await getRecruitee(req.params.user_id);
          if (rid.length) {
            let post = await updateRecrDoc(
              req.params.doc_id,
              rid[0].recruitee_id,
              sDocName,
              req.params.rec_doc_name,
              req.params.rec_doc_id
            );
            if (post === "success") {
              return res.status(200).json("success");
            } else {
              return res.status(200).json("doc not updated");
            }
          } else {
            return res.status(200).json("recruitee_id not found");
          }
        } catch (err) {
          //console.log("++++++++++++++++", err)
          return res.send("ERROR" + err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.get(
  "/vcsapi/get/uploaded/document/list/current/:user",
  function (req, res) {
    async function apps() {
      try {
        let rid = await getRecruitee(req.params.user);
        if (rid.length) {
          let checkrecrDoc = await checkRecDocumentsCurrent(
            rid[0].recruitee_id
          );
          res.json(checkrecrDoc);
        } else {
          return res.status(200).json("recruitee_id not found");
        }
      } catch (err) {
        //console.log("++++++++++++++++", err)
        return res.send("ERROR" + err);
      }
    }
    apps();
  }
);
app.get("/vcsapi/get/uploaded/document/list/:user", function (req, res) {
  async function apps() {
    try {
      let rid = await getRecruitee(req.params.user);
      if (rid.length) {
        let checkrecrDoc = await checkRecDocuments(rid[0].recruitee_id);
        res.json(checkrecrDoc);
      } else {
        return res.status(200).json("recruitee_id not found");
      }
    } catch (err) {
      //console.log("++++++++++++++++", err)
      return res.send("ERROR" + err);
    }
  }
  apps();
});
app.get("/vcsapi/download/:rec_doc_id/:user/:name", function (req, res) {
  async function apps() {
    try {
      let rid = await getRecruitee(req.params.user);
      if (rid.length) {
        let checkrecrDoc = await checkRecDocumentsbyrbID(
          rid[0].recruitee_id,
          req.params.rec_doc_id
        );
        // res.json(checkrecrDoc)
        if (checkrecrDoc.length > 0) {
          return res.sendFile(checkrecrDoc[0].rec_doc_path);
        } else {
          return res.status(200).json("NO doc uploaded");
        }
      } else {
        return res.status(200).json("recruitee_id not found");
      }
    } catch (err) {
      //console.log("++++++++++++++++", err)
      return res.send("ERROR" + err);
    }
  }
  apps();
});

app.get(
  "/vcsapi/api/get/applicants/details/:uid",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          const data = await getApplicantsDetails(req.params.uid);
          return res.json(data);
        } catch (err) {
          return res.send("ERROR");
        }
      }
      apps();
    } else {
      res.json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/employee",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let count = 0;
          let adduadetail = await updateEmployeeUser(req.body);
          if (adduadetail === "success") {
            let addradetail = await updateEmployeeDetails(req.body);
            if (addradetail === "success") {
              let deleteUserAcc = await deleteUserAccess(req.body.user_id);
              if (deleteUserAcc === "success") {
                let get = await query7(req.body.role_id);
                if (get.length) {
                  for (let i = 0; i < get.length; i++) {
                    let insertUserAcc = await insertUserAccess(
                      req.body.user_id,
                      get[i].action_id
                    );
                    if (insertUserAcc === "success") {
                      count++;
                    }
                  }
                  if (count === get.length) {
                    res.json("success");
                  }
                } else {
                  res.json("success");
                }
              } else {
                res.json("ERROR");
              }
            } else {
              res.json("ERROR");
            }
          } else {
            res.json("ERROR");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/insert/req/doc",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let count = 0;
          for (let i = 0; i < req.body.data.length; i++) {
            let add = await insertRequestedDoc(req.body.data[i]);
            if (add === "success") {
              count++;
            }
          }
          if (count === req.body.data.length) {
            res.json("success");
          } else {
            res.json("ERROR");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change_status/applicant/recruit_status",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let rstatus = await updateRecruitStatus(req.body);
          res.json(rstatus);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change_status/applicant/apply_status",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let astatus = await updateApplyStatus(req.body);
          res.json(astatus);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/update/req/doc/status",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let astatus = await updateReqDocStatus(req.body);
          res.json(astatus);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change_password",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          var result = "";
          var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          for (var i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * 40));
          }
          //console.log(result);
          const saltRounds = 10;
          const hashedPassword = await new Promise((resolve, reject) => {
            bcryptjs.hash("" + result + "", saltRounds, function (err, hash) {
              if (err) reject(err);
              resolve(hash);
            });
          });
          //console.log(hashedPassword);
          let rpasswd = await updateResetPassword(
            req.body.user_id,
            hashedPassword
          );
          if (rpasswd === "success") {
            let ud = await getAllUser(req.body.user_id);
            //console.log(ud[0].user_first_name);

            if (ud.length > 0) {
              // //console.log("before email",result)
              let sendemail = await sendCodebyEmail(
                result,
                ud[0].user_first_name,
                ud[0].email,
                "Password"
              );
              if (sendemail === "success") {
                //console.log("after email",result)
                res.json("success");
              } else {
                res.json("email not sent");
              }
            }
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/update/api/new/password/not/autogenerated",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          const saltRounds = 10;
          const hashedPassword = await new Promise((resolve, reject) => {
            bcryptjs.hash(
              "" + req.body.password + "",
              saltRounds,
              function (err, hash) {
                if (err) reject(err);
                resolve(hash);
              }
            );
          });
          //console.log(hashedPassword);
          let rpasswd = await updateResetPassword(
            req.body.user_id,
            hashedPassword
          );
          if (rpasswd === "success") {
            let ud = await getAllUser(req.body.user_id);
            //console.log(ud[0].user_first_name);

            if (ud.length > 0) {
              // //console.log("before email",result)
              let sendemail = await sendCodebyEmail(
                req.body.password,
                ud[0].user_first_name,
                ud[0].email,
                "Password"
              );
              if (sendemail === "success") {
                //console.log("after email")
                res.json("success");
              } else {
                res.json("email not sent");
              }
            }
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/update/api/new/passcode/not/autogenerated",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let rpasswd = await updateResetPasscode(req.body, req.body.passcode);
          if (rpasswd === "success") {
            let ud = await getAllUser(req.body.user_id);
            if (ud.length > 0) {
              let sendemail = await sendCodebyEmail(
                req.body.passcode,
                ud[0].user_first_name,
                ud[0].email,
                "Passcode"
              );
              if (sendemail === "success") {
                res.json("success");
              } else {
                res.json("email not sent");
              }
            }
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/check/api/new/password",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let ud = await getAllUser(req.body.user_id);
          // //console.log(ud[0].user_first_name);
          if (ud.length > 0) {
            bcryptjs.compare(
              req.body.password,
              ud[0].password,
              function (err, result) {
                if (result == true) {
                  res.json({
                    message: "same password",
                  });
                } else {
                  {
                    res.json("password not matched");
                  }
                }
              }
            );
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/check/api/new/passcode",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let ud = await getAllUser(req.body.user_id);
          if (ud.length > 0) {
            if (req.body.passcode == ud[0].passcode) {
              res.json({
                message: "same passcode",
              });
            } else {
              {
                res.json("passcode not matched");
              }
            }
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/edit/api/change_passcode",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          var pcode = Math.floor(Math.random() * (1000 - 9999 + 1)) + 9999;
          let rpasswd = await updateResetPasscode(req.body, pcode);
          if (rpasswd === "success") {
            let ud = await getAllUser(req.body.user_id);
            if (ud.length > 0) {
              let sendemail = await sendCodebyEmail(
                pcode,
                ud[0].user_first_name,
                ud[0].email,
                "Passcode"
              );
              if (sendemail === "success") {
                res.json("success");
              } else {
                res.json("email not sent");
              }
            }
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/edit/api/change_passcode/email",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let email = req.body.email.trim().replace(/\s/g, "");
          var pcode = Math.floor(Math.random() * (1000 - 9999 + 1)) + 9999;
          let ud = await getAllUserEmail(email);
          if (ud.length > 0) {
            let rpasswd = await updateResetPasscodeEmail(email, pcode);
            if (rpasswd === "success") {
              let sendemail = await sendCodebyEmail(
                pcode,
                ud[0].user_first_name,
                ud[0].email,
                "Passcode"
              );
              if (sendemail === "success") {
                res.json("success");
              } else {
                res.json("email not sent");
              }
            }
          } else {
            res.json("Email Do not exist.");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/insert/job/post",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let addPost = await addJobPost(req.body);
          res.json(addPost);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.get(
  "/vcsapi/get/required/doc/:user",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get = await getReqDocDetails(req.params.user);
          res.json(get);
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change/job_status/byjobID",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let jobstatus = await updateJobStatus(req.body);
          if (jobstatus === "success") {
            res.json("success");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change/job_status/delete/byjobID",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let job_ids = [];
          job_ids = req.body.job_id;
          for (i in job_ids) {
            var jobstatus = await deleteMultipleJobs(job_ids[i]);
          }
          if (jobstatus === "success") {
            res.json("success");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/change/job_status/delete/byjobPostDate",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let job_ids = await getJobIdByDate(req.body.job_delete_date);
          //console.log(job_ids)
          if (job_ids.length !== 0) {
            for (i in job_ids) {
              var jobstatus = await deleteMultipleJobs(job_ids[i].job_id);
            }
            if (jobstatus === "success") {
              res.json("success");
            }
          } else {
            res.json("no jobs found");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/delete/skillset/byDate",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let skillset_ids = await getSkillsetIdByDate(
            req.body.skillset_delete_date
          );
          console.log(skillset_ids);
          if (skillset_ids.length !== 0) {
            for (i in skillset_ids) {
              var deletestatus = await deleteMultipleskillset(
                skillset_ids[i].skillset_id
              );
            }
            if (deletestatus === "success") {
              res.json("success");
            }
          } else {
            res.json("no skillset found");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

app.post(
  "/vcsapi/edit/api/edit/desc/n/req_info",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let post = await updateJobDescRinfo(req.body);
          if (post === "success") {
            res.json("success");
          } else {
            res.json("not updated");
          }
        } catch (err) {
          //console.log(err);
          res.json(err);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);

function query24(data) {
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
function query4(data, datas) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_role set ? where role_id=${datas.role_id}`;
    let post = {
      role_name: data.role_name,
    };
    db.query(sql, post, function (err, resul) {
      if (err) reject(err);
      else resolve("success");
    });
  });
}
function query5(data, datas) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_role set ? where role_id='${datas.role_id}'`;
    let post = {
      role_status: data.role_status,
    };
    db.query(sql, post, function (err, result) {
      if (err) reject(err);
      else resolve("success");
    });
  });
}
function getRoleAccess(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_role_access where role_id=${data.role_id}`;
    db.query(sql, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
function getUserAccess() {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT DISTINCT b.*, c.*, d.*
        FROM tbl_module AS b
        INNER JOIN tbl_submodule AS c ON b.module_id = c.module_id
        INNER JOIN tbl_action AS d ON d.submodule_id = c.submodule_id
        LEFT JOIN tbl_role_access AS f ON f.action_id = d.action_id
        WHERE module_name!="MY JOBS"
       `;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function query7(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_role_access where role_id=${data}`;
    db.query(sql, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
function query9(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_role_access where role_id='${data.role_id}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve("delete");
    });
  });
}
function query8(data, datas) {
  return new Promise(function (resolve, reject) {
    for (i = 0; i <= data.length - 1; i++) {
      loop1(data[i], datas);
    }
    resolve("success");
  });
}
function query10(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT   a.action_id, c.submodule_name, d.module_name, b.action_name
        FROM tbl_role_access AS a
        INNER JOIN tbl_action AS b ON a.action_id = b.action_id
        INNER JOIN tbl_submodule AS c ON c.submodule_id = b.submodule_id
        INNER JOIN tbl_module AS d ON d.module_id = c.module_id
        WHERE a.role_id='${data}'`;
    db.query(sql, function (err, result) {
      if (err) {
        //console.log(err)
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getEmployeeByRole(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT   * from tbl_employee
        WHERE role_id='${data}'`;
    db.query(sql, function (err, result) {
      if (err) {
        //console.log(err)
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
function deleteUserAccess(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_user_access
        WHERE user_id='${data}'`;
    db.query(sql, function (err, result) {
      if (err) {
        //console.log(err)
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function insertUserAccess(user_id, action_id) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_user_access set ?`;
    post = {
      user_id: user_id,
      action_id: action_id,
    };
    db.query(sql, post, function (err, result) {
      if (err) {
        //console.log(err)
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function query13(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_role_access where role_id=${data.role_id}`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function query14(arrayq, role_id) {
  //return new Promise(function(resolve,reject){

  for (k = 0; k <= arrayq.length - 1; k++) {
    var last_digit = arrayq[k].toString().split("").pop();
    if (last_digit == "1") {
    } else {
      let ths = arrayq[k];
      get_call_function(arrayq[k], role_id);
    }
  }
}
function query16() {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_role where role_name!='recruitee' ORDER BY role_id DESC,role_status ASC`;
    db.query(sql, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
function query15(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_role where role_name='${data.role_name}' and role_name!='recruitee'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function loop1(data, datas) {
  let sql = `insert into tbl_role_access set ?`;
  let post = {
    role_id: datas.role_id,
    action_id: data.action_id,
  };
  db.query(sql, post, function (err, result) {
    if (err) {
      //console.log(err);
    } else return "success";
  });
}
function get_call_function(get_action_id, role_id) {
  //console.log(get_action_id);
  let length = get_action_id.toString().length;
  let value = get_action_id.toString().slice(0, length - 1);
  var get_action_idsss = value + "1";
  //console.log(get_action_idsss);
  // //console.log("get_action_id");

  let sqlqqs = `select * from tbl_role_access where role_id=${role_id.role_id} AND action_id=${get_action_idsss}`;
  db.query(sqlqqs, function (err, resultaaa) {
    if (err) {
      //console.log(err);
    } else {
      ////console.log(resultaaa+"ss");
      //return result;
      if (resultaaa.length > 0) {
        //delete actionid of view from tbl_role_access
        let sqlzzzz = `delete from tbl_role_access where role_id=${role_id.role_id} and action_id=${get_action_idsss}`;
        db.query(sqlzzzz, function (err, resultsbbb) {
          if (err) {
            //console.log(err)
          } else {
            let sqlss = `insert into tbl_role_access set ?`;
            let posts = {
              role_id: role_id.role_id,
              action_id: get_action_idsss,
            };
            db.query(sqlss, posts, function (err, resultss) {
              if (err) {
                //console.log(err)
              } else {
                return "success";
              }
            });
          }
        });
      } else {
        let sqlss = `insert into tbl_role_access set ?`;
        let posts = {
          role_id: role_id.role_id,
          action_id: get_action_idsss,
        };
        db.query(sqlss, posts, function (err, resultsscccc) {
          if (err) {
            //console.log(err)
          } else return "success";
        });
      }
    }
  });
}
function sendCodebyEmail(code, name, email, a) {
  /////// email generate
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "registration@vishusa.com",
        pass: "registrationVCS#2022",
      },
    });
    var mailOptions = {
      from: "registration@vishusa.com",
      to: email.trim().toLowerCase(),
      subject: `Updated Login Credentials`,
      html: `Hi, "${name}"<br/>Welcome!!!<br/>
            Your credential is changed as :<br/>
            ${a} : <strong>${code}</strong>
            <br/>
            <br/><br/>Thanks & regards<br/>`,
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
function getAllUser(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_user where user_id="${uid}"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getAllUserEmail(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_user where email="${uid}"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function updateClientStatus(data, cid) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_client set ? where client_id=${data.client_id}`;
    let post = {
      client_status: data.client_status,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function updateClientName(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_client set ? where client_id=${data.client_id}`;
    let post = {
      client_name: data.client_name,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function updateReqDocStatus(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_requested_document set ? where req_doc_id=${data.req_doc_id}`;
    let post = {
      req_doc_status: "done",
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}

function updateFillUpStatusDone(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_onboarding set ? where onboarding_id=${data.onboarding_id}`;
    let post = {
      fill_up_status: "done",
      reqd_doc_id_list: data.req_doc_id_list,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function addClientDetails(data) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_client set ? `;
    let post = {
      user_id: 0,
      client_name: data.client_name,
      client_status: "active",
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("inserted")
        resolve("success");
      }
    });
  });
}
function getEmployeeActive() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * FROM tbl_employee e inner join  tbl_user u on u.user_id = e.user_id
        INNER JOIN tbl_designation AS k On k.designation_id=e.designation where u.user_status="active"
        `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getActvClient() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * FROM tbl_client where client_status="active" order by client_name`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getAllClient() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * FROM tbl_client  order by client_id desc`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getApplicationByclientID(clID) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select distinct u.* FROM tbl_application a
        inner join tbl_job j on a.job_id=j.job_id
        inner join tbl_client c on c.client_id=j.client_id
        inner join tbl_recruitee r on r.recruitee_id=a.recruitee_id
        inner join tbl_user u on u.user_id=r.user_id
        where c.client_id=${clID} `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getApplicationByclientIDALL() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select distinct u.* FROM tbl_application a
        inner join tbl_job j on a.job_id=j.job_id
        inner join tbl_client c on c.client_id=j.client_id
        inner join tbl_recruitee r on r.recruitee_id=a.recruitee_id
        inner join tbl_user u on u.user_id=r.user_id `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getApplicantAndAssignManagerDetails(str) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * FROM tbl_assign_manager am
        inner join tbl_application a on am.application_id=a.application_id
        inner join tbl_job j on a.job_id=j.job_id
        inner join tbl_client c on c.client_id=j.client_id
        inner join tbl_recruitee AS d On d.recruitee_id=a.recruitee_id
        inner join tbl_recruitee_details AS g On g.recruitee_id=a.recruitee_id
        inner JOIN tbl_user As e ON e.user_id=d.user_id
        left join tbl_profession as i ON i.profession_id=g.profession
        left join tbl_speciality As k On k.speciality_id=g.speciality
         ${str}`;
    db.query(sql, function (err, res) {
      //console.log(sql)
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}
function getStandardDocuments() {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_standard_document where doc_status='active'`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function UpdateExpiryDatesDocument(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_recruitee_document set ? where rec_doc_id=${data.rec_doc_id} `;
    var ed = "";
    if (data.expiry_date === "") {
      ed = "";
    } else {
      ed = moment(new Date(data.expiry_date)).format("MM/DD/YYYY");
    }
    post = {
      expiry_date: ed,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function uploadFile(dID, data, user, sdn, rdn, crDoc, eDate) {
  return new Promise(function (resolve, reject) {
    //console.log(data);
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    let ed = "";
    if (eDate == "0") {
      ed = "";
    } else {
      ed = moment(new Date(eDate)).format("MM/DD/YYYY");
    }
    let file = data.file;
    // var filename=''
    // if(data.file.name){
    filename = data.file.name;
    // }
    let path = "/home/ubuntu/vcs/Uploads/Documents/" + filename;
    file.mv("/home/ubuntu/vcs/Uploads/Documents/" + filename, function (err) {
      if (err) {
        reject(err);
      } else {
        if (sdn === "other") {
          var docTpy = "other";
          if (crDoc.length > 0) {
            let sql = `update  tbl_recruitee_document set ? where recruitee_id=${user} and rec_doc_name="${rdn}"`;
            let post = {
              rec_doc_status: null,
            };
            db.query(sql, post, function (err, res) {
              if (err) {
                //console.log(err);
                reject(err);
              } else {
                resolve("success");
              }
            });
          }
          let sql = `insert into tbl_recruitee_document set ?`;
          let post = {
            recruitee_id: user,
            rec_doc_type: docTpy,
            rec_doc_path: path,
            rec_doc_name: rdn,
            rec_doc_status: "current",
            expiry_date: ed,
            upload_date_time: moment(new Date(strTime)).format(
              "MM/DD/YYYY hh:mm:ss A"
            ),
          };
          db.query(sql, post, function (err, res) {
            if (err) {
              //console.log(err);
              reject(err);
            } else {
              resolve("success");
            }
          });
        } else if (sdn === "facility_spec") {
          var docTpy = "facility_spec";
          if (crDoc.length > 0) {
            let sql = `update  tbl_recruitee_document set ? where recruitee_id=${user} and rec_doc_name="${rdn}"`;
            let post = {
              rec_doc_status: null,
            };
            db.query(sql, post, function (err, res) {
              if (err) {
                //console.log(err);
                reject(err);
              } else {
                resolve("success");
              }
            });
          }
          let sql = `insert into tbl_recruitee_document set ?`;
          let post = {
            recruitee_id: user,
            rec_doc_type: docTpy,
            rec_doc_path: path,
            rec_doc_name: rdn,
            rec_doc_status: "current",
            expiry_date: ed,
            upload_date_time: moment(new Date(strTime)).format(
              "MM/DD/YYYY hh:mm:ss A"
            ),
          };
          db.query(sql, post, function (err, res) {
            if (err) {
              //console.log(err);
              reject(err);
            } else {
              resolve("success");
            }
          });
        } else {
          //console.log(sdn,"sdn");
          var docTpy = "standard";
          if (crDoc.length > 0) {
            let sql = `update  tbl_recruitee_document set ? where recruitee_id=${user}  and    rec_doc_name="${rdn}"`;
            let post = {
              rec_doc_status: null,
            };
            db.query(sql, post, function (err, res) {
              if (err) {
                //console.log(err);
                reject(err);
              } else {
                resolve("success");
              }
            });
          }
          let sql = `insert into tbl_recruitee_document set ?`;
          let post = {
            recruitee_id: user,
            rec_doc_type: docTpy,
            doc_id: dID,
            rec_doc_path: path,
            rec_doc_name: rdn,
            rec_doc_status: "current",
            expiry_date: ed,
            upload_date_time: moment(new Date(strTime)).format(
              "MM/DD/YYYY hh:mm:ss A"
            ),
          };
          db.query(sql, post, function (err, res) {
            if (err) {
              //console.log(err);
              reject(err);
            } else {
              resolve("success");
            }
          });
        }
      }
    });
  });
}
function updateRecrDoc(dID, user, sdn, rdn, rdID) {
  return new Promise(function (resolve, reject) {
    if (sdn === "other") {
      var docTpy = "facility_spec";

      let sql = `update  tbl_recruitee_document set ? where recruitee_id=${user} and rec_doc_id=${rdID} `;
      let post = {
        rec_doc_name: rdn,
        rec_doc_type: docTpy,
        rec_doc_status: null,
      };
      db.query(sql, post, function (err, res) {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          resolve("success");
        }
      });
    } else {
      var docTpy = "standard";

      let sql = `update  tbl_recruitee_document set ? where recruitee_id=${user} and rec_doc_id=${rdID} `;
      let post = {
        rec_doc_type: docTpy,
        rec_doc_name: rdn,
        rec_doc_status: null,
        doc_id: dID,
      };
      db.query(sql, post, function (err, res) {
        if (err) {
          //console.log(err);
          reject(err);
        } else {
          resolve("success");
        }
      });
    }
  });
}
function getRecruitee(uid) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee where user_id=${uid}`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function getStandardDocumentsbyID(docID) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_standard_document where doc_id=${docID}`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function checkRecDocuments(recruitee_id) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee_document where recruitee_id=${recruitee_id} order by rec_doc_id desc`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function checkRecDocumentsCurrent(recruitee_id) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee_document where recruitee_id=${recruitee_id} AND rec_doc_status="current"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function getLatestRecDocuments(recruitee_id, doc_name) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee_document where recruitee_id=${recruitee_id} AND rec_doc_name='${doc_name}' order by rec_doc_id desc`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function checkRecDocumentsbyrbID(recruitee_id, r_doc_id) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee_document where recruitee_id=${recruitee_id} and rec_doc_id=${r_doc_id}`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function checkRecDocumentsbyrbName(recruitee_id, r_doc_name) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee_document where recruitee_id=${recruitee_id} and rec_doc_name="${r_doc_name}"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function getApplicantsDetails(user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_user  u
        inner join tbl_recruitee r on u.user_id=r.user_id
        inner join tbl_recruitee_details rd on rd.recruitee_id=r.recruitee_id
        inner join tbl_recruitee_resume rr on rr.recruitee_id=rd.recruitee_id
        left join tbl_profession p on p.profession_id=rd.profession
        left join tbl_speciality s on s.speciality_id=rd.speciality
        where u.user_id=${user_id}`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function getReqDocDetails(user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_requested_document AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        where c.user_id=${user_id} and req_doc_status="current"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
function updateEmployeeUser(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update  tbl_user set ? where user_id=${data.user_id}`;
    if (data.role_id === "1") {
      var post = {
        user_first_name: data.user_first_name,
        user_middle_name: data.user_middle_name,
        user_last_name: data.user_last_name,
        phone: data.phone,
        email: data.email,
        user_type: "admin",
      };
    } else {
      var post = {
        user_first_name: data.user_first_name,
        user_middle_name: data.user_middle_name,
        user_last_name: data.user_last_name,
        phone: data.phone,
        email: data.email,
        user_type: "employee",
      };
    }

    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function updateEmployeeDetails(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update  tbl_employee set ? where user_id=${data.user_id}`;
    let post = {
      employee_code: data.employee_code,
      role_id: data.role_id,
      signatory_flag: data.signatory_flag,
      dept_id: data.dept_id,
      designation: data.designation,
      date_of_joining: moment(new Date(data.date_of_joining)).format(
        "MM/DD/YYYY"
      ),
      supervisor_name: data.supervisor_name,
      image_id: 0,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function updateRecruitStatus(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_user set ? where user_id="${data.user_id}"`;
    post = {
      user_status: data.user_status,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function updateApplyStatus(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_recruitee set ? where recruitee_id="${data.recruitee_id}"`;
    post = {
      apply_status: data.apply_status,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function updateResetPassword(data, hp) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")

    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    let sql = `update tbl_user set ? where user_id="${data}" and user_status="active"`;
    post = {
      password: hp,
      password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function insertRequestedDoc(data) {
  return new Promise(function (resolve, reject) {
    let date = new Date();
    let currTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    let sql = `insert into tbl_requested_document set ?`;
    let post = {
      recruitee_id: data.recruitee_id,
      req_doc_type: data.req_doc_type,
      req_doc_name: data.req_doc_name,
      req_doc_status: "current",
      doc_id: data.doc_id,
      requested_doc_date: moment(new Date(currTime)).format("MM/DD/YYYY"),
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function updateResetPasscode(data, pcode) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_user set ? where user_id=${data.user_id}`;
    post = {
      passcode: pcode,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}

function updateResetPasscodeEmail(data, pcode) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_user set ? where email="${data}"`;
    post = {
      passcode: pcode,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        resolve("success");
      }
    });
  });
}
function addJobPost(data) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_job set ?`;
    let post = {
      job_status: "open",
      position_type: data.position_type,
      client_id: data.client_id,
      job_no: data.job_no,
      job_title: data.job_title,
      job_type: data.job_type,
      country: data.country,
      state: data.state,
      city: data.city,
      bill_rate: data.bill_rate,
      blended_pay_rate: data.blended_pay_rate,
      at_holiday_rate: data.at_holiday_rate,
      regular_pay_rate: data.regular_pay_rate,
      job_description: data.job_description,
      job_post_by: data.job_post_by,
      job_post_date: moment(new Date(data.job_post_date)).format("MM/DD/YYYY"),
      req_information: data.req_information,
      system_name: data.system_name,
      job_sector: data.job_sector,
      shift: data.shift,
      duration: data.duration,
      ot_holiday_pay_rate_traveller: data.ot_holiday_pay_rate_traveller,
      ot_holiday_pay_rate_local: data.ot_holiday_pay_rate_local,
      confirm_hr: data.confirm_hr,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("inserted")
        resolve("success");
      }
    });
  });
}
function updateJobStatus(data) {
  return new Promise(function (resolve, reject) {
    let date = new Date();
    let currTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });

    let sql = `update tbl_job set ?  where job_id=${data.job_id} `;
    let post = {
      job_status: data.job_status,
    };

    if (data.job_status === "open") {
      post = {
        job_status: data.job_status,
        job_post_date: moment(new Date(currTime)).format("MM/DD/YYYY"),
      };
    }

    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function deleteMultipleJobs(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_job set ?  where job_id=${data} `;
    let post = {
      job_status: "delete",
    };

    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}
function getJobIdByDate(data) {
  return new Promise(function (resolve, reject) {
    // let sql = `SELECT job_id from tbl_job WHERE job_post_date<'${data}' `;

    let sql = `select job_id,job_post_date from tbl_job
        where
        str_to_date(job_post_date,'%m/%d/%Y') < str_to_date('${data}','%m/%d/%Y'); `;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve(res);
      }
    });
  });
}
function updateJobDescRinfo(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update  tbl_job set ? where job_id=${data.job_id} `;
    let post = {
      job_status: "open",
      position_type: data.position_type,
      client_id: data.client_id,
      job_no: data.job_no,
      job_title: data.job_title,
      job_type: data.job_type,
      country: data.country,
      state: data.state,
      city: data.city,
      bill_rate: data.bill_rate,
      blended_pay_rate: data.blended_pay_rate,
      at_holiday_rate: data.at_holiday_rate,
      regular_pay_rate: data.regular_pay_rate,
      job_description: data.job_description,
      req_information: data.req_information,
      system_name: data.system_name,
      job_sector: data.job_sector,
      job_post_edit_date: data.job_post_edit_date,
      job_post_edit_by: data.job_post_edit_by,
      shift: data.shift,
      duration: data.duration,
      ot_holiday_pay_rate_traveller: data.ot_holiday_pay_rate_traveller,
      ot_holiday_pay_rate_local: data.ot_holiday_pay_rate_local,
      confirm_hr: data.confirm_hr,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}

function getSkillsetIdByDate(data) {
  return new Promise(function (resolve, reject) {
    // let sql = `SELECT skillset_id from tbl_skillset_map WHERE date_of_completion<'${data}' OR date_of_completion IS NULL `;

    let sql = `select skillset_id,date_of_completion from tbl_skillset_map
        where
        str_to_date(date_of_completion,'%m/%d/%Y') < str_to_date('${data}','%m/%d/%Y') OR date_of_completion IS NULL `;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve(res);
      }
    });
  });
}

function deleteMultipleskillset(data) {
  return new Promise(function (resolve, reject) {
    let sql = `DELETE FROM tbl_skillset_map where skillset_id=${data} `;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}

app.post("/vcsapi/post/signup_emp_app", function (req, res) {
  async function apps() {
    //console.log(req.body);
    let email = req.body.email.trim().replace(/\s/g, "");
    let checkemailexist = await checkEmailApp(email.toLowerCase());

    if (checkemailexist.length && checkemailexist[0].user_app_id) {
      res.json("Already registered with this email id.");
    } else {
      // let passcode = Math.floor(1000 + Math.random() * 9000);
      let passcode = "1234";
      const saltRounds = 10;
      const hashedPasscode = await new Promise((resolve, reject) => {
        bcryptjs.hash("" + passcode + "", saltRounds, function (err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
      });
      //console.log("PASS",passcode)
      let post = await insertUserApp(
        req.body,
        email.toLowerCase(),
        hashedPasscode
      );
      //console.log(post);
      if (post === "success") {
        let mail = await sendCredsbyEmail(req.body, email, passcode);
        if (mail === "success") {
          //console.log(mail);
          res.status(200).json("success");
        } else {
          res.json("ERROR");
        }
      } else {
        res.json("ERROR");
      }
    }
  }
  apps();
});

function checkEmailApp(email) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_user_app as a WHERE a.user_app_email='${email}'`;
    db.query(sql, function (err, result) {
      if (err) resolve("err");
      else resolve(result);
    });
  });
}
function insertUserApp(data, email, passcode) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `insert into tbl_user_app set ?`;
    let post = {
      user_app_name: data.name,
      user_app_mob: data.mobile_no,
      user_app_email: email,
      user_app_passcode: passcode,
      user_app_status: "active",
      user_id: 0,
    };

    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        // //console.log("after insert",res)
        resolve("success");
      }
    });
  });
}
function sendCredsbyEmail(udata, email, passcode) {
  /////// email generate
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "registration@vishusa.com",
        pass: "registrationVCS#2022",
      },
    });
    var mailOptions = {
      from: "registration@vishusa.com",
      to: email.trim().toLowerCase(),
      subject: `User App Credentials `,
      html: `Hi, "${udata.name}"<br/>Welcome!!!<br/>
                Your login credentials is as:<br/>
                email : <strong>${email}</strong>
                <br/>
                passcode : <strong>${passcode}</strong>
                <br/>

                <br/><br/>Thanks & regards<br/>`,
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

app.post("/vcsapi/forgot_password/user_emp_app", function (req, res) {
  async function apps() {
    let passcode = Math.floor(1000 + Math.random() * 9000);
    let email = req.body.email.trim().replace(/\s/g, "");
    ////////// get vendor_id + password
    let post1 = await checkLogin(email.toLowerCase(), "" + passcode + "");

    //console.log(post1);
    res.status("200").json(post1);
  }
  apps();
});

function checkLogin(email, pass) {
  return new Promise(function (resolve, reject) {
    let sql = `select user_id from tbl_user_app where user_app_email='${email}'`;
    db.query(sql, function (err, result) {
      //console.log(result);
      if (err) resolve("err");
      else {
        if (result.length > 0) {
          changePassword(email, pass);
          sendemail(email, pass);
          resolve("success");
        } else {
          resolve("Email not found");
        }
      }
    });
  });
}

function changePassword(data, data1) {
  return new Promise((resolve, reject) => {
    const saltRounds = 10;
    let password = data1;
    bcryptjs.genSalt(saltRounds, function (err, salt) {
      bcryptjs.hash(password, salt, function (err, hash) {
        //console.log(hash);
        let sql = `update tbl_user_app set ? where user_app_email='${data}'`;
        let post = {
          user_app_passcode: hash,
        };
        db.query(sql, post, function (err, result) {
          if (err) {
            //console.log(err);
          } else {
            //console.log("change passcode",result)
            resolve("200");
            // //console.log("success");
            //res.json("your password is changed");
          }
        });
      });
    });
    // resolve("success");
  });
}

function sendemail(email, pass) {
  /////// email generate
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "registration@vishusa.com",
        pass: "registrationVCS#2022",
      },
    });
    var mailOptions = {
      from: "registration@vishusa.com",
      to: email.trim().toLowerCase(),
      subject: `Updated Login Credentials`,
      html: `Hi, <br/>Welcome!!!<br/>
                Your new passcode is as:<br/>
                passcode : <strong>${pass}</strong>
                <br/>

                <br/><br/>Thanks & regards<br/>`,
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

app.post("/vcsapi/post/login_employee", function (req, res) {
  async function apps() {
    // //console.log(req.body);
    let userDetails = [];
    let email = req.body.email.trim().replace(/\s/g, "");
    let getemail = await checkEmailApp(email.toLowerCase());
    if (getemail.length && getemail[0].user_app_email) {
      bcryptjs.compare(
        "" + req.body.passcode + "",
        getemail[0].user_app_passcode,
        function (err, result) {
          if (result == true) {
            let sql = `SELECT * FROM tbl_employee AS a INNER JOIN tbl_user AS b ON a.user_id=b.user_id WHERE b.email='${getemail[0].user_app_email}' and b.user_type<>"recruitee"`;
            db.query(sql, function (err, val) {
              if (err) {
                //console.log(err);
              } else {
                if (val.length && val[0].user_id) {
                  // //console.log("login if")
                  if (getemail[0].user_id === 0) {
                    let sql1 = `update tbl_user_app set ? WHERE user_app_id='${getemail[0].user_app_id}'`;
                    let post1 = {
                      user_id: val[0].user_id,
                    };
                    db.query(sql1, post1, function (err1, result1) {
                      if (err1) {
                        //console.log(err1);
                      } else {
                        let sql2 = `SELECT * FROM tbl_user_app AS a WHERE a.user_id='${val[0].user_id}'`;
                        db.query(sql2, function (err2, val2) {
                          if (err2) {
                            //console.log(err2);
                          } else {
                            res.json({
                              message: "login success",
                              status: "active",
                              user_details: val2[0],
                            });
                          }
                        });

                        //console.log("update success");
                      }
                    });
                  } else {
                    res.json({
                      message: "login success",
                      status: "active",
                      user_details: getemail[0],
                    });
                  }
                } else {
                  // //console.log("login else")
                  res.json({
                    message: "login success",
                    status: "inactive",
                    user_details: getemail[0],
                  });
                }
              }
            });
          } else {
            {
              res.json({ message: "Wrong passcode" });
            }
          }
        }
      );
    } else {
      res.json({ message: "Email do not exist" });
    }
  }
  apps();
});

app.post("/vcsapi/get/employee/mob_api", function (req, res) {
  async function apps() {
    let email = req.body.email.trim().replace(/\s/g, "");
    let getemail = await checkEmailApp(email.toLowerCase());
    res.json(getemail);
  }
  apps();
});
module.exports = app;
