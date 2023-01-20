const express = require("express");
const bcryptjs = require("bcryptjs");
const app = express();
const nodemailer = require("nodemailer");
const stuff = require("../services/jwt.js");
const db = require("../db/db");
const moment = require("moment");
var xls = require("excel4node");

app.get(
  "/vcsapi/api/generate/excel/pay-rate-change-log-data/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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
        let p = await getPayRateChangeLogData(req.params);

        var data = "";

        for (i in p) {
          let dueDate = "-";
          let comment = "-";
          let pstart_date = "-";
          let recruit_status = "-";
          let application_no = "-";
          let application_stage = "-";
          let pend_date = "-";
          let onb_regular_billrate = "-";
          let onb_ot_billrate = "-";
          let onb_holiday_billrate = "-";
          let onb_regular_payrate = "-";
          let onb_ot_payrate = "-";
          let onb_holiday_payrate = "-";
          let per_dieumwk = "-";
          let ot_starts_afterwk = "-";
          let total_shifthr = "-";
          let shiftdetails = "-";
          let rto = "-";
          let contract_durationwk = "-";
          let change_date = "-";
          let rec_name = "";

          if (p[i].rec_mname === null || p[i].rec_mname === "") {
            rec_name = p[i].rec_fname + " " + p[i].rec_lname;
          } else {
            rec_name =
              p[i].rec_fname + " " + p[i].rec_mname + " " + p[i].rec_lname;
          }
          let changed_byName = "";
          if (p[i].cb_mname === null || p[i].cb_mname === "") {
            changed_byName = p[i].cb_fname + " " + p[i].cb_lname;
          } else {
            changed_byName =
              p[i].cb_fname + " " + p[i].cb_mname + " " + p[i].cb_lname;
          }

          if (
            p[i].proposed_start_date === null ||
            p[i].proposed_start_date === ""
          ) {
            pstart_date = "-";
          } else {
            pstart_date = p[i].proposed_start_date;
          }

          if (
            p[i].proposed_end_date === null ||
            p[i].proposed_end_date === ""
          ) {
            pend_date = "-";
          } else {
            pend_date = p[i].proposed_end_date;
          }

          if (
            p[i].onb_regular_bill_rate === null ||
            p[i].onb_regular_bill_rate === ""
          ) {
            onb_regular_billrate = "-";
          } else {
            onb_regular_billrate = p[i].onb_regular_bill_rate;
          }

          if (p[i].onb_ot_bill_rate === null || p[i].onb_ot_bill_rate === "") {
            onb_ot_billrate = "-";
          } else {
            onb_ot_billrate = p[i].onb_ot_bill_rate;
          }

          if (
            p[i].onb_holiday_bill_rate === null ||
            p[i].onb_holiday_bill_rate === ""
          ) {
            onb_holiday_billrate = "-";
          } else {
            onb_holiday_billrate = p[i].onb_holiday_bill_rate;
          }

          if (
            p[i].onb_regular_pay_rate === null ||
            p[i].onb_regular_pay_rate === ""
          ) {
            onb_regular_pay_rate = "-";
          } else {
            onb_regular_pay_rate = p[i].onb_regular_pay_rate;
          }

          if (p[i].onb_ot_pay_rate === null || p[i].onb_ot_pay_rate === "") {
            onb_ot_payrate = "-";
          } else {
            onb_ot_payrate = p[i].onb_ot_pay_rate;
          }

          if (
            p[i].onb_holiday_pay_rate === null ||
            p[i].onb_holiday_pay_rate === ""
          ) {
            onb_holiday_payrate = "-";
          } else {
            onb_holiday_payrate = p[i].onb_holiday_pay_rate;
          }

          if (p[i].per_dieum_wk === null || p[i].per_dieum_wk === "") {
            per_dieumwk = "-";
          } else {
            per_dieumwk = p[i].per_dieum_wk;
          }

          if (
            p[i].ot_starts_after_wk === null ||
            p[i].ot_starts_after_wk === ""
          ) {
            ot_starts_afterwk = "-";
          } else {
            ot_starts_afterwk = p[i].ot_starts_after_wk;
          }

          if (
            p[i].pay_package_remarks === null ||
            p[i].pay_package_remarks === ""
          ) {
            pay_packageremarks = "-";
          } else {
            pay_packageremarks = p[i].pay_package_remarks;
          }

          if (p[i].total_shift_hr === null || p[i].total_shift_hr === "") {
            total_shifthr = "-";
          } else {
            total_shifthr = p[i].total_shift_hr;
          }

          if (p[i].shift_details === null || p[i].shift_details === "") {
            shiftdetails = "-";
          } else {
            shiftdetails = p[i].shift_details;
          }

          if (
            p[i].contract_duration_wk === null ||
            p[i].contract_duration_wk === ""
          ) {
            contract_durationwk = "-";
          } else {
            contract_durationwk = p[i].contract_duration_wk;
          }
          if (p[i].due_date === null || p[i].due_date === "") {
            duedate = "-";
          } else {
            duedate = p[i].due_date;
          }
          if (p[i].change_datetime === null || p[i].change_datetime === "") {
            change_date = "-";
          } else {
            change_date = p[i].change_datetime;
          }
          if (p[i].comments === null || p[i].comments === "") {
            comment = "-";
          } else {
            comment = p[i].comments;
          }
          if (p[i].rto === null || p[i].rto === "") {
            rto = "-";
          } else {
            rto = p[i].rto;
          }

          data =
            data +
            p[i].application_no +
            "\t" +
            pstart_date +
            "\t" +
            pend_date +
            "\t" +
            onb_regular_billrate +
            "\t" +
            onb_ot_billrate +
            "\t" +
            onb_holiday_billrate +
            "\t" +
            onb_regular_payrate +
            "\t" +
            onb_ot_payrate +
            "\t" +
            onb_holiday_payrate +
            "\t" +
            per_dieumwk +
            "\t" +
            ot_starts_afterwk +
            "\t" +
            total_shifthr +
            "\t" +
            shiftdetails +
            "\t" +
            rto +
            "\t" +
            contract_durationwk +
            "\t" +
            duedate +
            "\t" +
            change_date +
            "\t" +
            changed_byName +
            "\t" +
            rec_name +
            "\t" +
            p[i].email +
            "\t" +
            p[i].recruit_status +
            "\t" +
            p[i].application_stage +
            "\t" +
            pay_packageremarks +
            "\t" +
            comment +
            "\n";
        }
        var data2 = JSON.stringify(data);

        //console.log(data2)
        async function excle() {
          var get = await generateExcelPayRateChangeLogDetails(data1, data2);
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelPayRateChangeLogDetails(data, data2) {
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
    ws.column(3).setWidth(15);
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
    ws.column(18).setWidth(30);
    ws.column(19).setWidth(30);
    ws.column(20).setWidth(30);
    ws.column(21).setWidth(15);
    ws.column(22).setWidth(15);
    ws.column(23).setWidth(15);
    ws.column(24).setWidth(15);
    ws.column(25).setWidth(15);

    ws.cell(1, 1, 1, 12, true).string("PayRate Change log ").style(style);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Applicant No").style(style1);
    ws.cell(6, 3).string("Proposed Start Date").style(style1);
    ws.cell(6, 4).string("Proposed End Date").style(style1);
    ws.cell(6, 5).string("ONB Regular BillRate").style(style1);
    ws.cell(6, 6).string("ONB OT BillRate").style(style1);
    ws.cell(6, 7).string("ONB Holiday BillRate").style(style1);
    ws.cell(6, 8).string("ONB Regular PayRate").style(style1);
    ws.cell(6, 9).string("ONB OT PayRate").style(style1);
    ws.cell(6, 10).string("ONB Holiday PayRate").style(style1);
    ws.cell(6, 11).string("Per Diem Week").style(style1);
    ws.cell(6, 12).string("OT Starts After").style(style1);
    ws.cell(6, 13).string("Total Shift Hrs").style(style1);
    ws.cell(6, 14).string("Shift Details").style(style1);
    ws.cell(6, 15).string("RTO").style(style1);
    ws.cell(6, 16).string("Contract Duration Week").style(style1);
    ws.cell(6, 17).string("Due Date").style(style1);
    ws.cell(6, 18).string("Change Date").style(style1);
    ws.cell(6, 19).string("Changed By").style(style1);
    ws.cell(6, 20).string("Applicant Name").style(style1);
    ws.cell(6, 21).string("Recruitee Email").style(style1);
    ws.cell(6, 22).string("Job Status").style(style1);
    ws.cell(6, 23).string("Application Status").style(style1);
    ws.cell(6, 24).string("Pay Package Remarks").style(style1);
    ws.cell(6, 25).string("Comment").style(style1);

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
      `/home/ubuntu/vcs/excle_file/payRateChange{data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/payRateChange{data.created_by}.xlsx`
          );
      }
    );
  });
}
function getPayRateChangeLogData() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `
                    SELECT prc.*,r.recruit_status,ru.email,
                    cbu.user_first_name as cb_fname,cbu.user_middle_name as cb_mname,cbu.user_last_name as cb_lname,
                    ru.user_first_name as rec_fname,ru.user_middle_name as rec_mname,ru.user_last_name as rec_lname,
                    a.*
                    FROM tbl_pay_rate_change_log prc
                    INNER JOIN tbl_user cbu on prc.changed_by = cbu.user_id
                    INNER JOIN tbl_application a on a.application_id=prc.application_id
                    INNER JOIN tbl_recruitee r on r.recruitee_id=prc.recruitee_id
                    INNER JOIN tbl_user ru on ru.user_id=r.user_id         
                  
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

app.post(
  "/vcsapi/add/api/tbl/designation",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let add = await addDesignation(req.body);
          if (add === "success") {
            res.json("success");
          } else {
            res.json("designation not inserted");
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
function addDesignation(data) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_designation set ?`;
    let post = {
      designation_name: data.designation_name,
      designation_status: "active",
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
app.post(
  "/vcsapi/update/api/designation_status",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let designation_status = await updateDesignationStatus(req.body);
          res.json(designation_status);
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
  "/vcsapi/update/api/designation_name",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let designation_name = await updateDesignationName(req.body);
          res.json(designation_name);
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
function updateDesignationStatus(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_designation set ? where designation_id=${data.designation_id}`;
    let post = {
      designation_status: data.designation_status,
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
function updateDesignationName(data) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_designation set ? where designation_id=${data.designation_id}`;
    let post = {
      designation_name: data.designation_name,
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
app.get(
  "/vcsapi/get/api/tbl/designation/dropdown/list",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get_designation = await getDesignation();
          res.json(get_designation);
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
  "/vcsapi/get/api/tbl/designation/all",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let get_designation = await getDesignationAll();
          res.json(get_designation);
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
function getDesignation() {
  return new Promise(function (resolve, reject) {
    let sql = `select * from  tbl_designation where designation_status="active"`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("inserted")
        resolve(res);
      }
    });
  });
}
function getDesignationAll() {
  return new Promise(function (resolve, reject) {
    let sql = `select * from  tbl_designation`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("inserted")
        resolve(res);
      }
    });
  });
}
app.get(
  "/vcsapi/api/generate/excel/candidate/:user_id/:name",
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
        let arr = await getskillsetData();
        // //console.log(arr)
        var data = "";

        for (i in arr) {
          var uid = "unregistered";
          if (arr[i].user_id !== 0) {
            uid = "registered";
          }
          data =
            data +
            arr[i].candidate_name +
            "\t" +
            arr[i].skill_area_name +
            "\t" +
            arr[i].skill_category_name +
            "\t" +
            uid +
            "\t" +
            arr[i].candidate_email +
            "\t" +
            arr[i].candidate_phone +
            "\t" +
            arr[i].created_on +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(data2)
        async function excle() {
          var get = await generateExcelCandidateData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelCandidateData(data, data2) {
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
    ws.column(3).setWidth(25);
    ws.column(4).setWidth(30);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(30);
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

    ws.cell(1, 1, 1, 12, true).string("SkillSet Report").style(style);
    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Candidate Name").style(style1);
    ws.cell(6, 3).string("Area").style(style1);
    ws.cell(6, 4).string("Category").style(style1);
    ws.cell(6, 5).string("Regn. Status").style(style1);
    ws.cell(6, 6).string("Email").style(style1);
    ws.cell(6, 7).string("Phone").style(style1);
    ws.cell(6, 8).string("Date of Submission").style(style1);

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
      `/home/ubuntu/vcs/excle_file/candidate${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/candidate${data.created_by}.xlsx`
          );
      }
    );
  });
}
app.get("/vcsapi/api/get/candidates", function (req, res) {
  async function apps() {
    try {
      let po1 = await getCandidates();
      //console.log(po1)
      if (po1.length > 0) {
        res.json(po1);
      } else {
        res.json("candidate data not found");
      }
    } catch (err) {
      //console.log(err);
      res.json(err);
    }
  }
  apps();
});

app.get(
  "/vcsapi/api/generate/excel/payrollProcess/:user_id/:name",
  function (req, res) {
    async function apps() {
      try {
        let po1 = await getAccountFileDetails();

        var data = "";
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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
        for (i in po1) {
          data =
            data +
            po1[i].file_no +
            "\t" +
            po1[i].client_name +
            "\t" +
            po1[i].year +
            "\t" +
            po1[i].month +
            "\t" +
            po1[i].wk_start_date +
            "-" +
            po1[i].wk_end_date +
            "\t" +
            po1[i].account_status +
            "\n";
        }
        var data2 = JSON.stringify(data);
        async function excle() {
          var get = await generateExcelPayrollProcessData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
      } catch (err) {
        //console.log(err);
        res.json(err);
      }
    }
    apps();
  }
);

function generateExcelPayrollProcessData(data, data2) {
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
        shrinkToFit: true,
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
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(30);
    ws.column(7).setWidth(15);
    ws.column(8).setWidth(20);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(15);
    ws.column(11).setWidth(15);
    ws.column(12).setWidth(15);
    ws.column(13).setWidth(15);
    ws.column(14).setWidth(15);
    ws.column(15).setWidth(15);
    ws.column(16).setWidth(15);
    ws.column(17).setWidth(15);
    ws.column(18).setWidth(15);

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("Payroll Report").style(style);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Payroll File No.").style(style1);
    ws.cell(6, 3).string("Client").style(style1);
    ws.cell(6, 4).string("Year").style(style1);
    ws.cell(6, 5).string("Month").style(style1);
    ws.cell(6, 6).string("Week").style(style1);
    ws.cell(6, 7).string("Status").style(style1);

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
      `/home/ubuntu/vcs/excle_file/jobPosts${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/jobPosts${data.created_by}.xlsx`
          );
      }
    );
  });
}

app.get(
  "/vcsapi/api/generate/excel/manage/jobPost/:user_id/:name",
  function (req, res) {
    async function apps() {
      try {
        let get_jobPost = await getjobPostDetailsall();
        for (let i = 0; i < get_jobPost.length; i++) {
          let get_job = await getapplicationjobPostCount(get_jobPost[i].job_id);
          get_jobPost[i]["count"] = get_job[0].count;
        }
        var data = "";
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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

        for (i in get_jobPost) {
          var jpb = "";
          var jeb = "";
          var billRate = "";
          var blended_pr = "";
          var regular_pr = "";
          var ot_holidayr = "";
          var jpe_date = "";
          var jp_date = "";
          if (
            get_jobPost[i].job_post_by_first_name !== null &&
            get_jobPost[i].job_post_by_last_name !== null
          ) {
            if (
              get_jobPost[i].job_post_by_middle_name === null ||
              get_jobPost[i].job_post_by_middle_name === ""
            ) {
              jpb =
                get_jobPost[i].job_post_by_first_name +
                " " +
                get_jobPost[i].job_post_by_last_name;
            } else {
              jpb =
                get_jobPost[i].job_post_by_first_name +
                " " +
                get_jobPost[i].job_post_by_middle_name +
                " " +
                get_jobPost[i].job_post_by_last_name;
            }
          }
          if (
            get_jobPost[i].job_post_edit_by_first_name !== null &&
            get_jobPost[i].job_post_edit_by_last_name !== null
          ) {
            if (
              get_jobPost[i].job_post_edit_by_middle_name === null ||
              get_jobPost[i].job_post_edit_by_middle_name === ""
            ) {
              jeb =
                get_jobPost[i].job_post_edit_by_first_name +
                " " +
                get_jobPost[i].job_post_edit_by_last_name;
            } else {
              jeb =
                get_jobPost[i].job_post_edit_by_first_name +
                " " +
                get_jobPost[i].job_post_edit_by_middle_name +
                " " +
                get_jobPost[i].job_post_edit_by_last_name;
            }
          }
          if (
            get_jobPost[i].bill_rate !== null &&
            isNaN(get_jobPost[i].bill_rate) === false
          ) {
            billRate = get_jobPost[i].bill_rate;
          }
          if (
            get_jobPost[i].blended_pay_rate !== null &&
            isNaN(get_jobPost[i].blended_pay_rate) === false
          ) {
            blended_pr = get_jobPost[i].blended_pay_rate;
          }
          if (
            get_jobPost[i].regular_pay_rate !== null &&
            isNaN(get_jobPost[i].regular_pay_rate) === false
          ) {
            regular_pr = get_jobPost[i].regular_pay_rate;
          }
          if (
            get_jobPost[i].at_holiday_rate !== null &&
            isNaN(get_jobPost[i].at_holiday_rate) === false
          ) {
            ot_holidayr = get_jobPost[i].at_holiday_rate;
          }
          if (get_jobPost[i].job_post_date !== null) {
            jp_date = get_jobPost[i].job_post_date;
          }
          if (get_jobPost[i].job_post_edit_date !== null) {
            jpe_date = get_jobPost[i].job_post_edit_date;
          }
          data =
            data +
            get_jobPost[i].job_title +
            "\t" +
            get_jobPost[i].job_no +
            "\t" +
            get_jobPost[i].city +
            ", " +
            get_jobPost[i].state +
            ", " +
            get_jobPost[i].country +
            "\t" +
            get_jobPost[i].job_type_name +
            "\t" +
            get_jobPost[i].position_type_name +
            "\t" +
            get_jobPost[i].system_name_name +
            "\t" +
            billRate +
            "\t" +
            blended_pr +
            "\t" +
            regular_pr +
            "\t" +
            ot_holidayr +
            "\t" +
            jp_date +
            "\t" +
            jpb +
            "\t" +
            get_jobPost[i].count +
            "\t" +
            jpe_date +
            "\t" +
            jeb +
            "\t" +
            get_jobPost[i].job_status +
            "\n";
        }
        var data2 = JSON.stringify(data);
        // //console.log(data)
        async function excle() {
          var get = await generateExcelManageJobPostData(data1, data2);

          res.sendFile(get);
        }
        excle();
      } catch (err) {
        //console.log(err);
        res.json(err);
      }
    }
    apps();
  }
);
function generateExcelManageJobPostData(data, data2) {
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
        shrinkToFit: true,
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
    ws.column(2).setWidth(40);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(30);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(30);
    ws.column(7).setWidth(30);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);
    ws.column(10).setWidth(15);
    ws.column(11).setWidth(15);
    ws.column(12).setWidth(15);
    ws.column(13).setWidth(30);
    ws.column(14).setWidth(15);
    ws.column(15).setWidth(15);
    ws.column(16).setWidth(30);
    ws.column(17).setWidth(15);
    ws.column(18).setWidth(15);

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("Manage Jobs Report ").style(style);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Job Title").style(style1);
    ws.cell(6, 3).string("Job ID").style(style1);
    ws.cell(6, 4).string("Job Location").style(style1);
    ws.cell(6, 5).string("Job Type").style(style1);
    ws.cell(6, 6).string("Position Type").style(style1);
    ws.cell(6, 7).string("System Name").style(style1);
    ws.cell(6, 8).string("Bill Rate ($/Hr)").style(style1);
    ws.cell(6, 9).string("Blended Pay Rate(Traveller $/Hr)").style(style1);
    ws.cell(6, 10).string("Regular Pay Rate(Locals $/Hr)").style(style1);
    ws.cell(6, 11).string("OT/Holiday Rate ($/Hr)").style(style1);
    ws.cell(6, 12).string("Date Of Posting").style(style1);
    ws.cell(6, 13).string("Posted By").style(style1);
    ws.cell(6, 14).string("# of Applications").style(style1);
    ws.cell(6, 15).string("Date Of Editing").style(style1);
    ws.cell(6, 16).string("Edited By").style(style1);
    ws.cell(6, 17).string("Status").style(style1);

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
      }
    }
    wb.write(
      `/home/ubuntu/vcs/excle_file/jobPosts${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/jobPosts${data.created_by}.xlsx`
          );
      }
    );
  });
}
app.get(
  "/vcsapi/api/generate/excel/assign/manager/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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
        let asmd = await getApplicantAndAssignManagerDetails();

        for (let i = 0; i < asmd.length; i++) {
          let getRecruiter = await getAllUser(asmd[i].recruiter_id);
          let getOnboard = await getAllUser(asmd[i].onb_mgr_id);
          let getteamLead = await getAllUser(asmd[i].team_lead_id);
          let getManager = await getAllUser(asmd[i].manager_id);
          asmd[i]["recruiterData"] = getRecruiter[0];
          asmd[i]["onboardData"] = getOnboard[0];
          asmd[i]["teamLearData"] = getteamLead[0];
          asmd[i]["managerData"] = getManager[0];
        }
        var data = "";
        // res.json(asmd)
        var rn = "";
        var tln = "";
        var obn = "";
        var mn = "";
        var appl_name = "";
        for (i in asmd) {
          if (asmd[i].recruiterData !== undefined) {
            if (
              asmd[i].recruiterData.user_middle_name === null ||
              asmd[i].recruiterData.user_middle_name === ""
            ) {
              rn =
                asmd[i].recruiterData.user_first_name +
                " " +
                asmd[i].recruiterData.user_last_name;
            } else {
              rn =
                asmd[i].recruiterData.user_first_name +
                " " +
                asmd[i].recruiterData.user_middle_name +
                " " +
                asmd[i].recruiterData.user_last_name;
            }
          }

          if (asmd[i].onboardData !== undefined) {
            if (
              asmd[i].onboardData.user_middle_name === null ||
              asmd[i].onboardData.user_middle_name === ""
            ) {
              obn =
                asmd[i].onboardData.user_first_name +
                " " +
                asmd[i].onboardData.user_last_name;
            } else {
              obn =
                asmd[i].onboardData.user_first_name +
                " " +
                asmd[i].onboardData.user_middle_name +
                " " +
                asmd[i].onboardData.user_last_name;
            }
          }

          if (asmd[i].teamLearData !== undefined) {
            if (
              asmd[i].teamLearData.user_middle_name === null ||
              asmd[i].teamLearData.user_middle_name === ""
            ) {
              tln =
                asmd[i].teamLearData.user_first_name +
                " " +
                asmd[i].teamLearData.user_last_name;
            } else {
              tln =
                asmd[i].teamLearData.user_first_name +
                " " +
                asmd[i].teamLearData.user_middle_name +
                " " +
                asmd[i].teamLearData.user_last_name;
            }
          }

          if (asmd[i].managerData !== undefined) {
            if (
              asmd[i].managerData.user_middle_name === null ||
              asmd[i].managerData.user_middle_name === ""
            ) {
              mn =
                asmd[i].managerData.user_first_name +
                " " +
                asmd[i].managerData.user_last_name;
            } else {
              mn =
                asmd[i].managerData.user_first_name +
                " " +
                asmd[i].managerData.user_middle_name +
                " " +
                asmd[i].managerData.user_last_name;
            }
          }
          if (
            asmd[i].user_middle_name === null ||
            asmd[i].user_middle_name === ""
          ) {
            appl_name = asmd[i].user_first_name + " " + asmd[i].user_last_name;
          } else {
            appl_name =
              asmd[i].user_first_name +
              " " +
              asmd[i].user_middle_name +
              " " +
              asmd[i].user_last_name;
          }

          data =
            data +
            asmd[i].client_name +
            "\t" +
            asmd[i].application_no +
            "\t" +
            appl_name +
            "\t" +
            rn +
            "\t" +
            obn +
            "\t" +
            tln +
            "\t" +
            mn +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(hired)
        async function excle() {
          var get = await generateExcelAssigmMgrData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelAssigmMgrData(data, data2) {
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
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(20);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(15);
    ws.column(11).setWidth(15);
    ws.column(12).setWidth(15);
    ws.column(13).setWidth(15);
    ws.column(14).setWidth(15);
    ws.column(15).setWidth(15);
    ws.column(16).setWidth(15);
    ws.column(17).setWidth(15);
    ws.column(18).setWidth(15);

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("Assign Manager Report").style(style3);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Client").style(style1);
    ws.cell(6, 3).string("Appl No.").style(style1);
    ws.cell(6, 4).string("Applicant Name").style(style1);
    ws.cell(6, 5).string("Recruiter").style(style1);
    ws.cell(6, 6).string("Onboarding Mgr.").style(style1);
    ws.cell(6, 7).string("Team Lead").style(style1);
    ws.cell(6, 8).string("Manager").style(style1);

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
      `/home/ubuntu/vcs/excle_file/assign_mgr_report${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/assign_mgr_report${data.created_by}.xlsx`
          );
      }
    );
  });
}

app.get(
  "/vcsapi/api/generate/excel/hired/applicant/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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
        let hired = await getJobdataHired();
        var data = "";
        for (i in hired) {
          let appl_name = "";
          var h_date = "";
          var ps_date = "";
          var pe_date = "";
          var reg_br = "";
          var hol_br = "";
          var ot_br = "";
          var reg_pr = "";
          var hol_pr = "";
          var ot_pr = "";
          var pdwk = "";
          var ot_start_wk = "";
          var contr_dur = "";
          var rto = "";
          var tshr = "";
          var shft = "";
          var pp_remark = "";
          if (
            hired[i].shift_details !== null ||
            hired[i].shift_details !== ""
          ) {
            shft = hired[i].shift_details;
          }
          if (
            hired[i].pay_package_remarks !== null ||
            hired[i].pay_package_remarks !== ""
          ) {
            pp_remark = hired[i].pay_package_remarks;
          }
          if (hired[i].per_dieum_wk !== null || hired[i].per_dieum_wk !== "") {
            pdwk = hired[i].per_dieum_wk;
          }
          if (
            hired[i].ot_starts_after_wk !== null ||
            hired[i].ot_starts_after_wk !== ""
          ) {
            ot_start_wk = hired[i].ot_starts_after_wk;
          }
          if (
            hired[i].contract_duration_wk !== null ||
            hired[i].contract_duration_wk !== ""
          ) {
            contr_dur = hired[i].contract_duration_wk;
          }
          if (hired[i].rto !== null || hired[i].rto !== "") {
            rto = hired[i].rto;
          }
          if (
            hired[i].total_shift_hr !== null ||
            hired[i].total_shift_hr !== ""
          ) {
            tshr = hired[i].total_shift_hr;
          }
          if (
            hired[i].onb_regular_pay_rate !== null ||
            hired[i].onb_regular_pay_rate !== ""
          ) {
            reg_pr = hired[i].onb_regular_pay_rate;
          }
          if (
            hired[i].onb_holiday_pay_rate !== null ||
            hired[i].onb_holiday_pay_rate !== ""
          ) {
            hol_pr = hired[i].onb_holiday_pay_rate;
          }
          if (
            hired[i].onb_ot_pay_rate !== null ||
            hired[i].onb_ot_pay_rate !== ""
          ) {
            ot_pr = hired[i].onb_ot_pay_rate;
          }

          if (
            hired[i].onb_regular_bill_rate !== null ||
            hired[i].onb_regular_bill_rate !== ""
          ) {
            reg_br = hired[i].onb_regular_bill_rate;
          }
          if (
            hired[i].onb_holiday_bill_rate !== null ||
            hired[i].onb_holiday_bill_rate !== ""
          ) {
            hol_br = hired[i].onb_holiday_bill_rate;
          }
          if (
            hired[i].onb_ot_bill_rate !== null ||
            hired[i].onb_ot_bill_rate !== ""
          ) {
            ot_br = hired[i].onb_ot_bill_rate;
          }

          if (
            hired[i].user_middle_name === null ||
            hired[i].user_middle_name === ""
          ) {
            appl_name =
              hired[i].user_first_name + " " + hired[i].user_last_name;
          } else {
            appl_name =
              hired[i].user_first_name +
              " " +
              hired[i].user_middle_name +
              " " +
              hired[i].user_last_name;
          }
          if (hired[i].hiring_date !== null || hired[i].hiring_date !== "") {
            h_date = hired[i].hiring_date;
          }
          if (
            hired[i].proposed_start_date !== null ||
            hired[i].proposed_start_date !== ""
          ) {
            ps_date = hired[i].proposed_start_date;
          }
          if (
            hired[i].proposed_end_date !== null ||
            hired[i].proposed_end_date !== ""
          ) {
            pe_date = hired[i].proposed_end_date;
          }
          if (hired[i].hiring_date !== null || hired[i].hiring_date !== "") {
            h_date = hired[i].hiring_date;
          }
          data =
            data +
            hired[i].client_name +
            "\t" +
            hired[i].job_no +
            "\t" +
            hired[i].job_title +
            "\t" +
            appl_name +
            "\t" +
            hired[i].application_no +
            "\t" +
            h_date +
            "\t" +
            ps_date +
            "\t" +
            pe_date +
            "\t" +
            reg_br +
            "\t" +
            hol_br +
            "\t" +
            ot_br +
            "\t" +
            reg_pr +
            "\t" +
            hol_pr +
            "\t" +
            ot_pr +
            "\t" +
            pdwk +
            "\t" +
            ot_start_wk +
            "\t" +
            contr_dur +
            "\t" +
            rto +
            "\t" +
            tshr +
            "\t" +
            shft +
            "\t" +
            pp_remark +
            "\t" +
            hired[i].assignment_status +
            "\n";
        }
        var data2 = JSON.stringify(data);

        //console.log(hired)
        async function excle() {
          var get = await generateExcelHiredApplicantsData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelHiredApplicantsData(data, data2) {
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
        vertical: "center",
        shrinkToFit: true,
        horizontal: "center",
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
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(30);
    ws.column(5).setWidth(25);
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

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("Hired Report").style(style3);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Client").style(style1);
    ws.cell(6, 3).string("Job ID").style(style1);
    ws.cell(6, 4).string("Job Title").style(style1);
    ws.cell(6, 5).string("Applicant Name").style(style1);
    ws.cell(6, 6).string("Application No.").style(style1);
    ws.cell(6, 7).string("Hiring Date").style(style1);
    ws.cell(6, 8).string("Proposed Start Date").style(style1);
    ws.cell(6, 9).string("Proposed End Date").style(style1);
    ws.cell(6, 10).string("Regular Bill Rate ($/Hr)").style(style1);
    ws.cell(6, 11).string("Holiday Bill Rate ($/Hr)").style(style1);
    ws.cell(6, 12).string("OT Bill Rate ($/Hr)").style(style1);
    ws.cell(6, 13).string("Regular Pay Rate ($/Hr)").style(style1);
    ws.cell(6, 14).string("Holiday Pay Rate ($/Hr)").style(style1);
    ws.cell(6, 15).string("OT Pay Rate ($/Hr)").style(style1);
    ws.cell(6, 16).string("Allowed Per Diem/Week").style(style1);
    ws.cell(6, 17).string("OT Starts After (Hours)").style(style1);
    ws.cell(6, 18).string("Contract Duration (Week)").style(style1);
    ws.cell(6, 19).string("RTO").style(style1);
    ws.cell(6, 20).string("Shift (Hours/Week)").style(style1);
    ws.cell(6, 21).string("Shift Details").style(style1);
    ws.cell(6, 22).string("Pay Package/Miscellaneous").style(style1);
    ws.cell(6, 23).string("Assignment Status").style(style1);

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
      `/home/ubuntu/vcs/excle_file/hired_report${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/hired_report${data.created_by}.xlsx`
          );
      }
    );
  });
}
app.get(
  "/vcsapi/api/generate/excel/onboarding/report/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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
        let onb = await getJobdataOfOBHOA(req.params);
        var data = "";
        let appl_name = "";

        for (i in onb) {
          var ddate = "";
          if (
            onb[i].user_middle_name === null ||
            onb[i].user_middle_name === ""
          ) {
            appl_name = onb[i].user_first_name + " " + onb[i].user_last_name;
          } else {
            appl_name =
              onb[i].user_first_name +
              " " +
              onb[i].user_middle_name +
              " " +
              onb[i].user_last_name;
          }
          if (onb[i].due_date !== null) {
            ddate = onb[i].due_date;
          }
          data =
            data +
            onb[i].client_name +
            "\t" +
            appl_name +
            "\t" +
            onb[i].apply_date +
            "\t" +
            onb[i].application_no +
            "\t" +
            ddate +
            "\t" +
            onb[i].onboarding_status +
            "\t" +
            onb[i].fill_up_status +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(getApp)
        async function excle() {
          var get = await generateExcelOnboardingData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelOnboardingData(data, data2) {
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

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("On Boarding Report").style(style);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Client").style(style1);
    ws.cell(6, 3).string("Applicant Name").style(style1);
    ws.cell(6, 4).string("Appl Date").style(style1);
    ws.cell(6, 5).string("Appl No.").style(style1);
    ws.cell(6, 6).string("Due Date").style(style1);
    ws.cell(6, 7).string("Status").style(style1);
    ws.cell(6, 8).string("Fillup").style(style1);

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
      `/home/ubuntu/vcs/excle_file/onboarding_report${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/onboarding_report${data.created_by}.xlsx`
          );
      }
    );
  });
}

app.get(
  "/vcsapi/api/generate/excel/job/aplications/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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
        var getApp = await getApplicationByclient();
        //console.log(getApp)
        for (let i = 0; i < getApp.length; i++) {
          let getCount = await applied_no(getApp[i].job_id);
          let getCount1 = await applied_yes(getApp[i].job_id);
          let getCount2 = await sortlisted(getApp[i].job_id);
          let getCount3 = await offered(getApp[i].job_id);
          let getCount4 = await apl_acc(getApp[i].job_id);
          let getCount5 = await onBoard(getApp[i].job_id);
          let getCount6 = await hired(getApp[i].job_id);

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
          getApp[i]["onBoard"] = getCount5.length;
          getApp[i]["hired"] = getCount6.length;
        }

        var data = "";

        for (k in getApp) {
          var aplyes = "";
          var sortlistd = "";
          var offrd = "";
          var aplacc = "";
          var hird = "";
          var onbd = "";

          if (
            getApp[k].applied_yes !== null ||
            getApp[k].applied_yes !== "" ||
            getApp[k].applied_yes !== undefined ||
            isNaN(getApp[k].applied_yes) === false
          ) {
            aplyes = getApp[k].applied_yes;
          }
          if (
            getApp[k].sortlisted !== null ||
            getApp[k].sortlisted !== "" ||
            getApp[k].sortlisted !== undefined ||
            isNaN(getApp[k].sortlisted) === false
          ) {
            sortlistd = getApp[k].sortlisted;
          }
          if (
            getApp[k].offered !== null ||
            getApp[k].offered !== "" ||
            getApp[k].offered !== undefined ||
            isNaN(getApp[k].offered) === false
          ) {
            offrd = getApp[k].offered;
          }
          if (
            getApp[k].apl_acc !== null ||
            getApp[k].apl_acc !== "" ||
            getApp[k].apl_acc !== undefined ||
            isNaN(getApp[k].apl_acc) === false
          ) {
            aplacc = getApp[k].apl_acc;
          }
          if (
            getApp[k].onBoard !== null ||
            getApp[k].onBoard !== "" ||
            getApp[k].onBoard !== undefined ||
            isNaN(getApp[k].onBoard) === false
          ) {
            onbd = getApp[k].onBoard;
          }
          if (
            getApp[k].hired !== null ||
            getApp[k].hired !== "" ||
            getApp[k].hired !== undefined ||
            isNaN(getApp[k].hired) === false
          ) {
            hird = getApp[k].hired;
          }
          data =
            data +
            getApp[k].job_no +
            "\t" +
            getApp[k].job_title +
            "\t" +
            getApp[k].client_name +
            "\t" +
            aplyes +
            "\t" +
            sortlistd +
            "\t" +
            offrd +
            "\t" +
            aplacc +
            "\t" +
            onbd +
            "\t" +
            hird +
            "\t" +
            getApp[k].job_status +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(data)
        async function excle() {
          var get = await generateExcelJobApplicationData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelJobApplicationData(data, data2) {
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

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("Job Application Report").style(style);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Job ID").style(style1);
    ws.cell(6, 3).string("Job Title").style(style1);
    ws.cell(6, 4).string("Client").style(style1);

    ws.cell(6, 5).string("# of Applied").style(style1);
    ws.cell(6, 6).string("# of Submitted").style(style1);
    ws.cell(6, 7).string("# of Offered").style(style1);
    ws.cell(6, 8).string("# of Accepted (Applicant)").style(style1);

    ws.cell(6, 9).string("# of Onboarding").style(style1);
    ws.cell(6, 10).string("# of Hired").style(style1);

    ws.cell(6, 11).string("Status").style(style1);

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
      `/home/ubuntu/vcs/excle_file/applicants${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/applicants${data.created_by}.xlsx`
          );
      }
    );
  });
}

app.get(
  "/vcsapi/api/generate/excel/applicants/aplicant/:user_id/:name",
  function (req, res) {
    // if (verifys == "verify") {
    async function apps() {
      try {
        let un = await getAllUser(req.params.user_id);
        let user_name = "";
        if (un[0].user_middle_name === null || un[0].user_middle_name === "") {
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

        let p = await getApplicantsAll();
        for (i in p) {
          let data = await getAssignmentCount(p[i]);
          p[i]["assignment_count"] = data.length;
          p[i]["assignment_data"] = data;
        }

        var data = "";

        //console.log(p)
        for (i in p) {
          var rec_name = "";
          var b_date = "-";
          var email = "-";
          var phone = "-";
          var desired_location = "-";
          var cur_location = "-";
          var ssn = "-";
          var prof = "-";
          var spec = "-";
          var empPref = "-";
          if (p[i].user_middle_name === null || p[i].user_middle_name === "") {
            rec_name = p[i].user_first_name + " " + p[i].user_last_name;
          } else {
            rec_name =
              p[i].user_first_name +
              " " +
              p[i].user_middle_name +
              " " +
              p[i].user_last_name;
          }
          if (
            p[i].email !== null &&
            p[i].email !== "" &&
            p[i].email !== "null"
          ) {
            email = p[i].email;
          }
          if (
            p[i].phone !== null &&
            p[i].phone !== "" &&
            p[i].phone !== "null"
          ) {
            phone = p[i].phone;
          }
          if (p[i].dob !== null && p[i].dob !== "" && p[i].dob !== "null") {
            b_date = p[i].dob;
          }
          if (
            p[i].current_location !== null &&
            p[i].current_location !== "" &&
            p[i].current_location !== "null"
          ) {
            cur_location = p[i].current_location;
          }
          if (
            p[i].desired_location_1 !== null &&
            p[i].desired_location_1 !== "" &&
            p[i].desired_location_1 !== "null"
          ) {
            if (
              p[i].desired_location_2 !== null &&
              p[i].desired_location_2 !== "" &&
              p[i].desired_location_2 !== "null"
            ) {
              desired_location =
                p[i].desired_location_1 + ", " + p[i].desired_location_2;
            }
            desired_location = p[i].desired_location_1;
          }
          if (
            p[i].ssn_4digit !== null &&
            p[i].ssn_4digit !== "" &&
            p[i].ssn_4digit !== "null"
          ) {
            ssn = p[i].ssn_4digit;
          }
          if (
            p[i].profession_name !== null &&
            p[i].profession_name !== "" &&
            p[i].profession_name !== "null"
          ) {
            prof = p[i].profession_name;
          }
          if (
            p[i].speciality_name !== null &&
            p[i].speciality_name !== "" &&
            p[i].speciality_name !== "null"
          ) {
            spec = p[i].speciality_name;
          }
          if (
            p[i].employement_preference !== null &&
            p[i].employement_preference !== "" &&
            p[i].employement_preference !== "null"
          ) {
            empPref = p[i].employement_preference;
          }
          data =
            data +
            p[i].recruitee_code +
            "\t" +
            rec_name +
            "\t" +
            email +
            "\t" +
            phone +
            "\t" +
            b_date +
            "\t" +
            ssn +
            "\t" +
            prof +
            "\t" +
            spec +
            "\t" +
            cur_location +
            "\t" +
            desired_location +
            "\t" +
            empPref +
            "\t" +
            p[i].count +
            "\t" +
            p[i].assignment_count +
            "\t" +
            p[i].apply_status +
            "\t" +
            p[i].recruit_status +
            "\t" +
            p[i].user_status +
            "\n";
        }
        var data2 = JSON.stringify(data);

        // //console.log(data2)
        async function excle() {
          var get = await generateExcelAllApplicantsData(data1, data2);
          ///var dddd=send(datask);
          // //console.log('aaaa');
          // //console.log(datask);
          res.sendFile(get);
        }
        excle();
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
function generateExcelAllApplicantsData(data, data2) {
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
        vertical: "center",
        shrinkToFit: true,
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
    ws.column(3).setWidth(25);
    ws.column(4).setWidth(30);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(15);
    ws.column(7).setWidth(15);
    ws.column(8).setWidth(15);
    ws.column(9).setWidth(15);
    ws.column(10).setWidth(15);
    ws.column(11).setWidth(15);
    ws.column(12).setWidth(30);
    ws.column(13).setWidth(15);
    ws.column(14).setWidth(15);
    ws.column(15).setWidth(15);
    ws.column(16).setWidth(15);
    ws.column(17).setWidth(15);
    ws.column(18).setWidth(15);

    // ws.cell(3, 1, 3, 12, true)
    //     .string("From Month    : " +  data.from_month )
    //     .style(style3);
    ws.cell(1, 1, 1, 12, true).string("Applicants Report").style(style);

    ws.cell(3, 1, 3, 12, true)
      .string(
        "Created Date  : " + moment(new Date(strTime)).format("MM/DD/YYYY")
      )
      .style(style3);
    ws.cell(4, 1, 4, 12, true)
      .string("Created By     : " + data.created_by)
      .style(style3);

    ws.cell(6, 1).string("#").style(style1);
    ws.cell(6, 2).string("Code").style(style1);
    ws.cell(6, 3).string("Applicant Name").style(style1);
    ws.cell(6, 4).string("Email").style(style1);
    ws.cell(6, 5).string("Phone").style(style1);
    ws.cell(6, 6).string("Date Of Birth").style(style1);
    ws.cell(6, 7).string("SSN(Last 4 Digit)").style(style1);
    ws.cell(6, 8).string("Profession").style(style1);
    ws.cell(6, 9).string("Speciality").style(style1);
    ws.cell(6, 10).string("Current Location").style(style1);
    ws.cell(6, 11).string("Desired Location").style(style1);
    ws.cell(6, 12).string("Employment Preference").style(style1);
    ws.cell(6, 13).string("# of Applications").style(style1);
    ws.cell(6, 14).string("# of Assignments").style(style1);
    ws.cell(6, 15).string("Apply Status").style(style1);
    ws.cell(6, 16).string("Job Status").style(style1);
    ws.cell(6, 17).string("User Status").style(style1);

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
      `/home/ubuntu/vcs/excle_file/applicants${data.created_by}.xlsx`,
      function (err) {
        if (err) resolve("err");
        else
          resolve(
            `/home/ubuntu/vcs/excle_file/applicants${data.created_by}.xlsx`
          );
      }
    );
  });
}

app.post(
  "/vcsapi/api/get/job_no/assignment_id/and/job_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let post = await getJobDetailandAssignmentDetl(req.body);
          res.json(post);
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

function getJobDetailandAssignmentDetl(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `SELECT distinct j.job_no ,j.job_id,j.client_id,c.client_name,a.assignment_id 
        FROM tbl_assignment as a
        inner join tbl_job j on j.job_id=a.job_id
        inner join tbl_client c on c.client_id=j.client_id
        inner join tbl_recruitee r on r.recruitee_id=a.recruitee_id
         inner join tbl_user u on u.user_id=r.user_id
         where r.user_id=${data.user_id}
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
app.post(
  "/vcsapi/api/get/tbl_week/week_id/not/in/tbl_rec_work_hr",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.body);
          let getRec = await getRecruitee(req.body.user_id);
          //console.log(getRec);
          if (getRec.length) {
            var post = await getAssignmentData(req.body);

            var post2 = await getWeekData(post[0]);
            if (post2.length > 0) {
              let post1 = await getRecWorkHourWeekIDS(
                req.body,
                getRec[0].recruitee_id
              );

              //console.log(post2, post1)
              if (post1.length > 0) {
                let r = post2.filter(
                  (elem) =>
                    !post1.find(({ week_id }) => elem.week_id === week_id)
                );
                //console.log(r)

                res.json(r);
              } else {
                res.json(post2);
              }
            } else {
              res.json("no data in tbl_week");
            }
          } else {
            res.json("No User Exist");
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

function getWeekData(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_week where wk_start_date >="${data.closing_date}" AND wk_end_date>="${data.hiring_date}"`;
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
function getAssignmentData(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_assignment where assignment_id=${data.assignment_id}`;
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

function getRecWorkHourWeekIDS(data, rId) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select distinct week_id from tbl_rec_work_hr where assignment_id=${data.assignment_id} AND recruitee_id=${rId}`;
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
  "/vcsapi/api/insert/tbl_rec_work_hr",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let getREc = await getRecruitee(req.body.user_id);
          if (getREc.length) {
            let post2 = await getAssignmentDatabyOnboardingID(
              req.body.assignment_id
            );
            if (post2.length > 0) {
              let diff =
                parseInt(post2[0].ot_starts_after_wk) -
                parseInt(req.body.ot_reg_hr);
              if (diff > 0) {
                let reg_hr = parseInt(req.body.ot_reg_hr);
                let ot_hr = 0;
                let post = await addTblRecWorkHour(
                  req.body,
                  reg_hr,
                  ot_hr,
                  getREc[0].recruitee_id
                );
                if (post === "success") {
                  res.json("success");
                } else {
                  res.json("not added in tbl_rec_work_hr");
                }
              } else {
                let reg_hr = parseInt(post2[0].ot_starts_after_wk);
                let ot_hr = -diff;
                let post = await addTblRecWorkHour(
                  req.body,
                  reg_hr,
                  ot_hr,
                  getREc[0].recruitee_id
                );
                if (post === "success") {
                  res.json("success");
                } else {
                  res.json("not added in tbl_rec_work_hr");
                }
              }
            } else {
              res.json("no assignment data");
            }
          } else {
            res.json("NO USER FOUND.");
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

function addTblRecWorkHour(data, data1, data2, rec_id) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `insert into tbl_rec_work_hr set ?`;
    let post = {
      recruitee_id: rec_id,
      assignment_id: data.assignment_id,
      week_id: data.week_id,
      rec_reg_hr: data1,
      rec_ot_hr: data2,
      rec_holiday_hr: data.rec_holiday_hr,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        // //console.log("after insert",res)
        resolve("success");
      }
    });
  });
}

function getAssignmentDatabyOnboardingID(asgnID) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_assignment a
        inner join tbl_onboarding o on a.onboarding_id=o.onboarding_id 
        where a.assignment_id=${asgnID}
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

app.get(
  "/vcsapi/get/api/tbl/account_file_data/year/:client",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.params);
          let year = await getAccountFileyearallList(req.params.client);
          //console.log(year)
          res.json(year);
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

function getAccountFileyearallList(CID) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select distinct w.year from tbl_account_file a
        inner join tbl_week w on w.week_id=a.week_id
         where a.client_id=${CID}`;
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
  "/vcsapi/get/api/tbl/account_file_data/month/:client/:year",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.params);
          let mnth = await getAccountFilemonthallList(req.params);
          res.json(mnth);
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

function getAccountFilemonthallList(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select distinct w.month from tbl_account_file a
        inner join tbl_week w on w.week_id=a.week_id
         where a.client_id=${data.client} and w.year=${data.year}`;
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

app.post(
  "/vcsapi/get/api/payroll_status/approved/assgnmnt_status/workingORclosed/by/applID",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let post = await getApprovedPayrollASworcBYApplID(req.body);

          res.json(post);
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

function getApprovedPayrollASworcBYApplID(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_assignment AS a 
        INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id 
        INNER JOIN tbl_week AS c ON c.week_id=b.week_id 
        INNER JOIN tbl_client AS d ON d.client_id=a.client_id 
        INNER JOIN tbl_job AS e ON e.job_id=a.job_id 
        INNER JOIN tbl_recruitee AS f ON f.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user As g ON g.user_id=f.user_id
        INNER JOIN tbl_onboarding AS h ON h.onboarding_id=a.onboarding_id
        INNER JOIN tbl_application AS k ON k.application_id=a.application_id
        WHERE  b.payroll_status='approved' AND (a.assignment_status="working" OR a.assignment_status="closed") AND k.application_id=${data.application_id}`;
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

app.post("/vcsapi/api/registration/user", function (req, res) {
  async function apps() {
    var email = req.body.email.trim().replace(/\s/g, "");
    var mbl_no = ("" + req.body.phone + "").trim().replace(/\s/g, "");

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
    let checkifExists = await checkEmail(email);
    if (checkifExists.length) {
      res.json("user exists");
    } else {
      let insertUser = await adduser(
        req.body,
        email.toLowerCase(),
        mbl_no,
        hashedPassword
      );
      if (insertUser === "success") {
        let getUser = await getLatestUser();
        if (getUser.length > 0) {
          // let role = await getRolebyrole_name();
          // if (role.length) {
          //     let get_action_id = await getActionId(role[0].role_id);
          //     let insert_role_access = await INSERTINLOOP(get_action_id, getUser[0].user_id);
          // }
          let latestRecruitee1 = await getLatestRecruitee();
          let addrecruitee = await adduserRecruitee(
            getUser[0].user_id,
            latestRecruitee1,
            "no"
          );
          if (addrecruitee === "success") {
            let latestRecruitee = await getLatestRecruitee();
            let recruiteedetails = await adduserRecruiteeDetails(
              req.body,
              latestRecruitee[0].recruitee_id
            );
            if (recruiteedetails === "success") {
              // let sendCreds = await sendCredsbyEmail(getUser[0], req.body.password);
              // if (sendCreds === "success") {
              let uAccess = await getUserAccess(getUser[0].user_id);
              res.json({
                message: "You are login",
                session: req.session.email,
                user_details: getUser[0],
                recruitee: latestRecruitee[0].recruitee_id,
                u_access: uAccess,
              });
              // }
            }
          }
        }
      } else {
        res.json("ERROR");
      }
    }
  }
  apps();
});

app.post(
  "/vcsapi/api/updateOrInsert/registration/user/:exist/:user_id",
  function (req, res) {
    async function apps() {
      var email = req.body.email.trim().replace(/\s/g, "");
      var mbl_no = req.body.phone.trim().replace(/\s/g, "");

      //console.log(req.params);

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
      let checkifExists = await checkEmail(email);
      if (checkifExists.length) {
        let checkRec = await checkRecruitee(checkifExists[0].user_id);
        if (checkRec.length) {
          if (checkRec[0].registration_status === "no") {
            let updateUser = await updateuser(
              req.body,
              email.toLowerCase(),
              mbl_no,
              hashedPassword,
              checkifExists[0].user_id
            );
            if (updateUser === "success") {
              let updateRec = await updateRecruitee(
                checkRec[0].recruitee_id,
                "yes"
              );
              if (updateRec === "success") {
                let sendCreds = await sendCredsbyEmail(
                  checkifExists[0],
                  req.body.password
                );
                if (sendCreds === "success") {
                  let uAccess = await getUserAccess(checkifExists[0].user_id);
                  res.json({
                    message: "You are login",
                    session: req.session.email,
                    user_details: checkifExists[0],
                    recruitee: checkRec[0].recruitee_id,
                    u_access: uAccess,
                  });
                }
              }
            }
          } else {
            res.json("user exists");
          }
        } else {
          res.json("user exists");
        }
      } else {
        if (req.params.exist === "NO") {
          //console.log("not exist")
          let insertUser = await adduser(
            req.body,
            email.toLowerCase(),
            mbl_no,
            hashedPassword
          );

          let getUser = await getLatestUser();

          if (getUser.length > 0) {
            if (insertUser === "success") {
              let role = await getRolebyrole_name();
              if (role.length) {
                let get_action_id = await getActionId(role[0].role_id);
                let insert_role_access = await INSERTINLOOP(
                  get_action_id,
                  getUser[0].user_id
                );
              }
              let latestRecruitee1 = await getLatestRecruitee();
              let addrecruitee = await adduserRecruitee(
                getUser[0].user_id,
                latestRecruitee1,
                "yes"
              );
              if (addrecruitee === "success") {
                let latestRecruitee = await getLatestRecruitee();
                let recruiteedetails = await adduserRecruiteeDetails(
                  req.body,
                  latestRecruitee[0].recruitee_id
                );
                if (recruiteedetails === "success") {
                  let sendCreds = await sendCredsbyEmail(
                    getUser[0],
                    req.body.password
                  );
                  if (sendCreds === "success") {
                    let uAccess = await getUserAccess(getUser[0].user_id);
                    res.json({
                      message: "You are login",
                      session: req.session.email,
                      user_details: getUser[0],
                      recruitee: latestRecruitee[0].recruitee_id,
                      u_access: uAccess,
                    });
                  }
                }
              }
            }
          } else {
            res.json("ERROR");
          }
        } else {
          let updateUser = await updateuser(
            req.body,
            email.toLowerCase(),
            mbl_no,
            hashedPassword,
            req.params.user_id
          );
          if (updateUser === "success") {
            let role = await getRolebyrole_name();
            if (role.length) {
              let get_action_id = await getActionId(role[0].role_id);
              let insert_role_access = await INSERTINLOOP(
                get_action_id,
                req.params.user_id
              );
            }

            let userid = await checkUserStatus(req.params.user_id);
            let rid = await getRecruitee(req.params.user_id);
            if (rid.length) {
              // let updaterecruitee = await updateuserRecruitee(req.params.user_id, rid[0].recruitee_id);
              // if (updaterecruitee === "success") {
              // let recruiteedetails = await updateuserRecruiteeDetails(req.body, rid[0].recruitee_id);
              // if (recruiteedetails === "success") {
              let sendCreds = await sendCredsbyEmail(
                userid[0],
                req.body.password
              );
              if (sendCreds === "success") {
                let uAccess = await getUserAccess(userid[0].user_id);
                res.json({
                  message: "You are login",
                  session: req.session.email,
                  user_details: userid[0],
                  recruitee: rid[0].recruitee_id,
                  u_access: uAccess,
                });
              }
              // }

              // } else {
              //     res.json("ERROR")
              // }
            } else {
              res.json("ERROR");
            }
          } else {
            res.json("ERROR");
          }
        }
      }
    }
    apps();
  }
);

function getRolebyrole_name() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * FROM tbl_role WHERE role_status="active" and role_name="recruitee" `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
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
    action_id: data,
  };

  db.query(sql, post, function (err, result) {
    if (err) {
      //console.log(err)
    } else return "success";
  });
}

function sendCredsbyEmail(udata, passwd) {
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
      to: udata.email.trim().toLowerCase(),
      subject: `User Credentials `,
      html: `Hi, "${udata.user_first_name}"<br/>Welcome!!!<br/>
            Your login credentials is as:<br/>
            email : <strong>${udata.email}</strong>
            <br/>
            passcode : <strong>${udata.passcode}</strong>
            <br/>
            password : <strong>${passwd}</strong>
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
app.post(
  "/vcsapi/check/email",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        if (req.body.email !== "" || req.body.email === null) {
          var email = req.body.email.trim().replace(/\s/g, "");
        } else {
          res.json("empty email");
        }

        let post = await checkUser(email);
        if (post.length) {
          if (post[0].user_id) {
            res.json(post[0]);
          }
        } else {
          res.json("do not exists");
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/check/email/register",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        if (req.body.email !== "" || req.body.email === null) {
          var email = req.body.email.trim().replace(/\s/g, "");
        } else {
          res.json("empty email");
        }

        let post = await checkUserRegister(email);
        if (post.length) {
          if (post[0].user_id) {
            res.json(post[0]);
          }
        } else {
          res.json("do not exists");
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/check/email/edit",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        if (req.body.email !== "" || req.body.email === null) {
          var email = req.body.email.trim().replace(/\s/g, "");
        } else {
          res.json("empty email");
        }
        if (req.body.old_email !== "" || req.body.old_email === null) {
          var old_email = req.body.old_email.trim().replace(/\s/g, "");
        } else {
          res.json("empty old email");
        }

        let post = await checkUserOld(email, old_email);
        if (post.length) {
          if (post[0].user_id) {
            res.json("exist");
          }
        } else {
          res.json("do not exists");
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.post(
  "/vcsapi/api/login/user",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          var email = req.body.email.trim().replace(/\s/g, "");

          let user_det = await checkUser(email);

          if (user_det.length > 0 && user_det[0].user_id) {
            req.session.email_id = user_det[0].user_id;
            const password = user_det[0].password;
            let us = await checkUserStatus(user_det[0].user_id);
            //console.log(us);
            if (us.length > 0) {
              let ubs = await checkUserLoginBlockStatus(user_det[0].user_id);
              if (ubs.length > 0) {
                //console.log(ubs)
                let checkRec = await checkRecruitee(user_det[0].user_id);
                if (checkRec.length) {
                  let checkregStatus = await checkRegStatus(
                    user_det[0].user_id
                  );
                  //console.log(checkregStatus,"+");
                  if (checkregStatus.length) {
                    let uAccess = await getUserAccess(user_det[0].user_id);
                    bcryptjs.compare(
                      req.body.password,
                      password,
                      function (err, result) {
                        if (result == true) {
                          res.json({
                            message: "You are login",
                            session: req.session.email_id,
                            username: user_det[0].user_first_name,
                            user_id: user_det[0].user_id,
                            u_access: uAccess,
                          });
                        } else {
                          {
                            res.json("username and password is not matched");
                          }
                        }
                      }
                    );
                  } else {
                    res.json("unregistered");
                  }
                } else {
                  let uAccess = await getUserAccess(user_det[0].user_id);
                  bcryptjs.compare(
                    req.body.password,
                    password,
                    function (err, result) {
                      if (result == true) {
                        res.json({
                          message: "You are login",
                          session: req.session.email_id,
                          username: user_det[0].user_first_name,
                          user_id: user_det[0].user_id,
                          u_access: uAccess,
                        });
                      } else {
                        {
                          res.json("username and password is not matched");
                        }
                      }
                    }
                  );
                }
              } else {
                res.json("user login is blocked");
              }
            } else {
              res.json("user status not active");
            }
          } else {
            res.json("No username in database please signup first");
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

app.post("/vcsapi/api/forgot/user/password", function (req, res) {
  async function apps() {
    try {
      let email = req.body.email.trim().replace(/\s/g, "");
      let checkifExists = await checkEmail(email);
      var num = Math.floor(Math.random() * (10000 - 99999 + 1)) + 99999;
      if (checkifExists.length) {
        let checkRec = await checkRecruitee(checkifExists[0].user_id);
        if (checkRec.length) {
          let checkregStatus = await checkRegStatus(checkifExists[0].user_id);
          if (checkregStatus.length) {
            let sendCreds = await sendforgotPasswordByEmail(
              num,
              checkifExists[0].user_first_name,
              email.toLowerCase()
            );
            if (sendCreds === "success") {
              const saltRounds = 10;
              const hashedPassword = await new Promise((resolve, reject) => {
                bcryptjs.hash("" + num + "", saltRounds, function (err, hash) {
                  if (err) reject(err);
                  resolve(hash);
                });
              });
              let changePass = await updatewordPassword(email, hashedPassword);
              res.json(changePass);
            }
          } else {
            res.json("invalid email");
          }
        } else {
          let sendCreds = await sendforgotPasswordByEmail(
            num,
            checkifExists[0].user_first_name,
            email.toLowerCase()
          );
          if (sendCreds === "success") {
            const saltRounds = 10;
            const hashedPassword = await new Promise((resolve, reject) => {
              bcryptjs.hash("" + num + "", saltRounds, function (err, hash) {
                if (err) reject(err);
                resolve(hash);
              });
            });
            let changePass = await updatewordPassword(email, hashedPassword);
            res.json(changePass);
          }
        }
      } else {
        res.json("invalid email");
      }
    } catch (err) {
      //console.log(err);
      res.json(err);
    }
  }
  apps();
});
app.post("/vcsapi/api/add/user", function (req, res) {
  async function apps() {
    var email = req.body.email.trim().replace(/\s/g, "");
    var mbl_no = req.body.phone.trim().replace(/\s/g, "");
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
    let insertUser = await adduser(
      req.body,
      email.toLowerCase(),
      mbl_no,
      hashedPassword
    );
    res.json(insertUser);
  }
  apps();
});

app.post("/vcsapi/check/user/by/email", function (req, res) {
  async function apps() {
    var email = req.body.email.trim().replace(/\s/g, "");
    //console.log(req.body)
    let User = await checkEmail(email.toLowerCase());

    //console.log(User);
    if (User.length > 0) {
      //console.log("IF");
      let UserEmp = await checkEmailEmployee(email.toLowerCase());
      if (UserEmp.length) {
        //console.log("IFIF");
        res.json("Employee");
      } else {
        //console.log("IFELSE");
        var checkResume = await checkResumeUser(User[0].user_id);
        if (checkResume.length) {
          User[0]["resume"] = true;
        } else {
          User[0]["resume"] = false;
        }
        res.json(User);
      }
    } else {
      //console.log("ELSE");
      res.json("no user found by given email");
    }
  }
  apps();
});

app.post(
  "/vcsapi/api/get/applications",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        var geta_pplicants = [];
        var job_id = [];
        var job_id_list = [];
        var final_appl_list = [];
        // if (req.body.recruit_status === "applicant") {
        //geta_pplicants = await getApplicantsApplicant(req.body);

        // } else if (req.body.recruit_status === "all") {
        //     geta_pplicants = await getApplicantsAll(req.body);

        // } else if (req.body.recruit_status === "hired") {
        //     geta_pplicants = await getApplicantsHired(req.body);

        // }

        let str1 = "";
        if (req.body.position_type !== "ALL") {
          str1 = str1 + `position_type="${req.body.position_type}" `;
        } else {
          str1 = str1 + `(!isNull(position_type) OR isNull(position_type)) `;
        }

        job_id = await getJobByPosition(str1);

        // let str = "u.user_status != 'deleted' AND ";
        let str = "";
        if (req.body.recruit_status !== "all") {
          str = str + `r.recruit_status="${req.body.recruit_status}"  AND `;
        } else {
          str = str + `!isNull(r.recruit_status) AND `;
        }
        if (req.body.prefered_location !== "ALL") {
          str = str + `a.prefered_state="${req.body.prefered_location}" AND  `;
        } else {
          str =
            str +
            `(!isNull(a.prefered_state) OR isNull(a.prefered_state)) AND  `;
        }
        if (req.body.profession !== "ALL") {
          str = str + `s.profession="${req.body.profession}" `;
        } else {
          str = str + `(!isNull(s.profession) OR isNull(s.profession)) `;
        }
        // if (req.body.prefered_location !== "ALL") {
        //     str = str + `j.state="${req.body.prefered_location}" `
        // } else {
        //     str = str + `(!isNull(j.state) OR isNull(j.state)) `
        // }

        if (job_id.length > 0) {
          for (let i of job_id) {
            job_id_list.push(i.job_id);
          }

          geta_pplicants = await getApplicantsApplicant(
            str,
            job_id_list.join(",")
          );

          for (let i = 0; i < geta_pplicants.length; i++) {
            if (geta_pplicants[i].user_status !== "deleted") {
              let data = await getAssignmentCount(geta_pplicants[i]);
              geta_pplicants[i]["assignment_count"] = data.length;
              geta_pplicants[i]["assignment_data"] = data;

              final_appl_list.push(geta_pplicants[i]);
            }
          }
          res.json(final_appl_list);
        } else {
          res.json([]);
        }
      }
      apps();
    } else {
      res.status(401).json("token is not valid");
    }
  }
);
app.get(
  "/vcsapi/api/get/applications/desiredlocation",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    async function apps() {
      if (verifys == "verify") {
        let desired_location = await getDesiredLocation();
        res.json(desired_location);
      } else {
        res.status(401).json("token is not valid");
      }
    }
    apps();
  }
);
app.post(
  "/vcsapi/upload/resume/:user",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.files,req.params)
          let rid = await getRecruitee(req.params.user);
          //console.log(rid);
          if (rid.length) {
            let checkrecrResm = await checkRecResume(rid[0].recruitee_id);
            //console.log(checkrecrResm)
            if (checkrecrResm.length > 0) {
              let upd = await updateResume(req.files, rid[0].recruitee_id);
              //console.log("update", upd)
              let post = await uploadFile(req.files, rid[0].recruitee_id);
              return res.status(200).json(post);
            } else {
              let post = await uploadFile(req.files, rid[0].recruitee_id);
              //console.log("post", post)
              return res.status(200).json(post);
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
  "/vcsapi/upload/registration_api/resume/:exist/:user_id",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.files)
          if (req.params.exist === "NO") {
            let insertUser = await adduserRegister();
            //console.log(insertUser)
            if (insertUser === "success") {
              let getUser = await getLatestUser();
              //console.log(getUser)
              if (getUser.length > 0) {
                let latestRecruitee1 = await getLatestRecruitee();
                let addrecruitee = await adduserRecruiteeRegister(
                  getUser[0].user_id,
                  latestRecruitee1,
                  "yes"
                );
                if (addrecruitee === "success") {
                  let latestRecruitee = await getLatestRecruitee();
                  //console.log(latestRecruitee)
                  let recruiteedetails = await adduserRecruiteeDetailsRegister(
                    latestRecruitee[0].recruitee_id
                  );
                  if (recruiteedetails === "success") {
                    // //console.log(req.files)

                    let post = await uploadFile(
                      req.files,
                      latestRecruitee[0].recruitee_id
                    );
                    // //console.log("post", post)

                    res.json({
                      message: post,
                      // session: req.session.email,
                      user_details: getUser[0],
                      recruitee: latestRecruitee[0].recruitee_id,
                    });
                  }
                }
              }
            }
          } else {
            let userid = await checkUserByID(req.params.user_id);
            let rid = await getRecruitee(req.params.user_id);
            //console.log(rid);
            if (rid.length) {
              let checkrecrResm = await checkRecResume(rid[0].recruitee_id);
              if (checkrecrResm.length > 0) {
                let upd = await updateResume(req.files, rid[0].recruitee_id);
                //console.log("update", upd)
                let post = await uploadFile(req.files, rid[0].recruitee_id);
                res.json({
                  message: post,
                  // session: req.session.email,
                  user_details: userid[0],
                  recruitee: rid[0].recruitee_id,
                });
              }
            } else {
              let latestRecruitee1 = await getLatestRecruitee();
              let addrecruitee = await adduserRecruiteeRegister(
                req.params.user_id,
                latestRecruitee1,
                "yes"
              );
              if (addrecruitee === "success") {
                let latestRecruitee = await getLatestRecruitee();
                //console.log(latestRecruitee)
                let recruiteedetails = await adduserRecruiteeDetailsRegister(
                  latestRecruitee[0].recruitee_id
                );
                if (recruiteedetails === "success") {
                  let checkrecrResm = await checkRecResume(rid[0].recruitee_id);
                  if (checkrecrResm.length > 0) {
                    let upd = await updateResume(
                      req.files,
                      rid[0].recruitee_id
                    );
                    //console.log("update", upd)
                    let post = await uploadFile(req.files, rid[0].recruitee_id);
                    res.json({
                      message: post,
                      // session: req.session.email,
                      user_details: userid[0],
                      recruitee: rid[0].recruitee_id,
                    });
                  }
                }
              }
            }
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
  "/vcsapi/upload/registration_api/resume/guest/:exist/:user_id/:email",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          //console.log(req.files)
          if (req.params.exist === "NO") {
            let check = await checkEmail(req.params.email);
            // console.log("email--",check)
            if (check.length) {
              let checkrec = await checkRecruitee(check[0].user_id);
              // console.log("Rec--",checkrec)
              if (checkrec.length === 0) {
                let latestRecruitee1 = await getLatestRecruitee();
                let addrecruitee = await adduserRecruiteeRegister(
                  check[0].user_id,
                  latestRecruitee1,
                  "no"
                );
                if (addrecruitee === "success") {
                  let latestRecruitee = await getLatestRecruitee();
                  // console.log(latestRecruitee)
                  let recruiteedetails = await adduserRecruiteeDetailsRegister(
                    latestRecruitee[0].recruitee_id
                  );
                  if (recruiteedetails === "success") {
                    // console.log(req.files)

                    let post = await uploadFile(
                      req.files,
                      latestRecruitee[0].recruitee_id
                    );
                    // console.log("post", post)

                    res.json({
                      message: post,
                      // session: req.session.email,
                      user_details: check[0],
                      recruitee: latestRecruitee[0].recruitee_id,
                      user_exist: req.params.exist,
                    });
                  }
                }
              } else {
                let checkrecrResm = await checkRecResume(
                  checkrec[0].recruitee_id
                );
                // console.log("ckeckRes--", checkrecrResm)
                if (checkrecrResm.length > 0) {
                  let upd = await updateResume(
                    req.files,
                    checkrec[0].recruitee_id
                  );
                  // console.log("update", upd)
                  let post = await uploadFile(
                    req.files,
                    checkrec[0].recruitee_id
                  );
                  res.json({
                    message: post,
                    // session: req.session.email,
                    user_details: check[0],
                    recruitee: checkrec[0].recruitee_id,
                  });
                } else {
                  // console.log("else")
                  let post = await uploadFile(
                    req.files,
                    checkrec[0].recruitee_id
                  );
                  res.json({
                    message: post,
                    // session: req.session.email,
                    user_details: check[0],
                    recruitee: checkrec[0].recruitee_id,
                  });
                }
              }
            } else {
              let insertUser = await adduserRegister();
              //console.log(insertUser)
              if (insertUser === "success") {
                let getUser = await getLatestUser();
                //console.log(getUser)
                if (getUser.length > 0) {
                  let latestRecruitee1 = await getLatestRecruitee();
                  let addrecruitee = await adduserRecruiteeRegister(
                    getUser[0].user_id,
                    latestRecruitee1,
                    "no"
                  );
                  if (addrecruitee === "success") {
                    let latestRecruitee = await getLatestRecruitee();
                    //console.log(latestRecruitee)
                    let recruiteedetails =
                      await adduserRecruiteeDetailsRegister(
                        latestRecruitee[0].recruitee_id
                      );
                    if (recruiteedetails === "success") {
                      // //console.log(req.files)

                      let post = await uploadFile(
                        req.files,
                        latestRecruitee[0].recruitee_id
                      );
                      // //console.log("post", post)

                      res.json({
                        message: post,
                        // session: req.session.email,
                        user_details: getUser[0],
                        recruitee: latestRecruitee[0].recruitee_id,
                        user_exist: req.params.exist,
                      });
                    }
                  }
                }
              }
            }
          } else {
            let userid = await checkUserByID(req.params.user_id);
            let rid = await getRecruitee(req.params.user_id);
            //console.log(rid);
            if (rid.length) {
              let checkrecrResm = await checkRecResume(rid[0].recruitee_id);
              if (checkrecrResm.length > 0) {
                let upd = await updateResume(req.files, rid[0].recruitee_id);
                //console.log("update", upd)
                let post = await uploadFile(req.files, rid[0].recruitee_id);
                res.json({
                  message: post,
                  // session: req.session.email,
                  user_details: userid[0],
                  recruitee: rid[0].recruitee_id,
                  user_exist: req.params.exist,
                });
              }
            } else {
              let latestRecruitee1 = await getLatestRecruitee();
              let addrecruitee = await adduserRecruiteeRegister(
                req.params.user_id,
                latestRecruitee1,
                "no"
              );
              if (addrecruitee === "success") {
                let latestRecruitee = await getLatestRecruitee();
                //console.log(latestRecruitee)
                let recruiteedetails = await adduserRecruiteeDetailsRegister(
                  latestRecruitee[0].recruitee_id
                );
                if (recruiteedetails === "success") {
                  let checkrecrResm = await checkRecResume(rid[0].recruitee_id);
                  if (checkrecrResm.length > 0) {
                    let upd = await updateResume(
                      req.files,
                      rid[0].recruitee_id
                    );
                    //console.log("update", upd)
                    let post = await uploadFile(req.files, rid[0].recruitee_id);
                    res.json({
                      message: post,
                      // session: req.session.email,
                      user_details: userid[0],
                      recruitee: rid[0].recruitee_id,
                      user_exist: req.params.exist,
                    });
                  }
                }
              }
            }
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
  "/vcsapi/check/resume",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let rid = await getRecruitee(req.body.user_id);
          //console.log(rid);
          if (rid.length) {
            let checkrecrResm = await checkRecResume(rid[0].recruitee_id);
            //console.log(checkrecrResm)
            if (checkrecrResm.length > 0) {
              return res.status(200).json(checkrecrResm);
            } else {
              return res.status(200).json("NO RESUME");
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
app.get("/vcsapi/get/resume/:user/:name", function (req, res) {
  async function apps() {
    try {
      let rid = await getRecruitee(req.params.user);
      if (rid.length) {
        let checkrecrResm = await checkRecResume(rid[0].recruitee_id);

        if (checkrecrResm.length > 0) {
          return res.sendFile(checkrecrResm[0].resume_doc_path);
        } else {
          return res.status(200).json("NO resume uploaded");
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

app.post(
  "/vcsapi/delete/temp/registration",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let ret = "ERROR";
          let rid = await getRecruitee(req.body.user_id);
          //console.log(rid);
          if (rid.length) {
            let del_user = await deleteUser(req.body);
            if (del_user === "delete") {
              let del_rec = await deleteRecruitee(rid[0]);
              if (del_rec === "delete") {
                let del_rec_det = await deleteRecruiteeDetails(rid[0]);
                if (del_rec_det === "delete") {
                  let del_rec_resu = await deleteRecruiteeResume(rid[0]);
                  if (del_rec_resu === "delete") {
                    let del_user_access = await deleteUserAccess(
                      req.body.user_id
                    );
                    if (del_user_access === "delete") {
                      ret = del_user_access;
                    }
                  }
                }
              }
            }
          }

          return res.json({
            ret,
          });
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

function deleteUser(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_user where user_id='${data.user_id}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve("delete");
    });
  });
}

function deleteRecruitee(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_recruitee where recruitee_id='${data.recruitee_id}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve("delete");
    });
  });
}

function deleteRecruiteeDetails(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_recruitee_details where recruitee_id='${data.recruitee_id}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve("delete");
    });
  });
}

function deleteRecruiteeResume(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_recruitee_resume where recruitee_id='${data.recruitee_id}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve("delete");
    });
  });
}

function deleteUserAccess(data) {
  return new Promise(function (resolve, reject) {
    let sql = `delete from tbl_user_access where user_id='${data}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve("delete");
    });
  });
}

function updateResume(data, rid) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_recruitee_resume set ? where recruitee_id=${rid}`;
    let post = {
      rec_doc_status: "NULL",
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}

function updateRecruitee(rid, status) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_recruitee set ? where recruitee_id=${rid}`;
    let post = {
      registration_status: status,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        //console.log("updated")
        resolve("success");
      }
    });
  });
}

function checkRecResume(rid) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee_resume where recruitee_id=${rid} AND rec_doc_status="current"`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function checkRecruitee(rid) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee where user_id=${rid}`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function getRecruitee(uid) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_recruitee where user_id=${uid}`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function uploadFile(data, user) {
  return new Promise(function (resolve, reject) {
    //console.log(data);
    let file = data.file;
    let filename = data.file.name;
    let path = "/home/ubuntu/vcs/Uploads/" + filename;
    file.mv("/home/ubuntu/vcs/Uploads/" + filename, function (err) {
      if (err) {
        reject(err);
      } else {
        let date = new Date();
        let strTime = date.toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
        });

        let sql = `insert into tbl_recruitee_resume set ?`;
        let post = {
          recruitee_id: user,
          resume_doc_path: path,
          rec_doc_status: "current",
          upload_date_time: moment(new Date(strTime)).format(
            "MM/DD/YYYY hh:mm:ss A"
          ),
          expiry_date: "",
        };
        db.query(sql, post, function (err, res) {
          if (err) {
            //console.log(err);
            reject("err");
          } else {
            resolve("success");
          }
        });
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
        reject("err");
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}

function getLatestRecruitee() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_recruitee order by recruitee_id desc limit 1 `;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        // //console.log("after insert",res)
        resolve(res);
      }
    });
  });
}

function adduser(data, email, phone, hpass) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    // //console.log(strTime);
    let sql = `insert into tbl_user set ?`;
    let post = {
      user_first_name: data.user_first_name,
      user_middle_name: data.user_middle_name,
      user_last_name: data.user_last_name,
      phone: phone,
      email: email,
      password: hpass,
      passcode: "1234",
      user_type: data.user_type,
      user_status: "active",
      changed_by: "",
      changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
      login_block_status: "unblock",
      password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
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

function updateuser(data, email, phone, hpass, uId) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    // //console.log(strTime);
    let sql = `update tbl_user set ? where user_id='${uId}'`;
    let post = {
      user_first_name: data.user_first_name,
      user_middle_name: data.user_middle_name,
      user_last_name: data.user_last_name,
      phone: phone,
      email: email,
      password: hpass,
      passcode: "1234",
      user_type: data.user_type,
      user_status: "active",
      changed_by: "",
      changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
      login_block_status: "unblock",
      password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
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

function adduserRegister() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    // //console.log(strTime);
    let sql = `insert into tbl_user set ?`;
    let post = {
      user_first_name: "first_name",
      user_middle_name: "",
      user_last_name: "last_name",
      phone: "",
      email: "email@g",
      password: "1234",
      passcode: "1234",
      user_type: "recruitee",
      user_status: "active",
      changed_by: "",
      changed_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
      login_block_status: "unblock",
      password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
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

function adduserRecruitee(uid, pcode, status) {
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
      registration_status: status,
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

function updateuserRecruitee(uid, rId) {
  return new Promise(function (resolve, reject) {
    let sql = `update tbl_recruitee set ? where recruitee_id='${rId}'`;
    let post = {
      user_id: uid,
      apply_status: "regular",
      recruit_status: "applicant",
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

function adduserRecruiteeDetails(data, recID) {
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
      employement_preference: "",
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

function updateuserRecruiteeDetails(data, recID) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `update tbl_recruitee_details set ? where recruitee_id='${recID}'`;
    let post = {
      dob: moment(new Date(data.dob)).format("MM/DD/YYYY"),
      ssn_4digit: data.ssn_4digit,
      profession: data.profession,
      speciality: data.speciality,
      current_location: data.current_location,
      desired_location_1: data.desired_location_1,
      desired_location_2: data.desired_location_2,
      employement_preference: data.employment_preference,
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
      registration_status: status,
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
      employement_preference: "",
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

function adduserEmployee(data, uid) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_employee set ?`;
    let post = {
      user_id: uid,
      employee_code: data.employee_code,
      role_id: data.role_id,
      signatory_flag: data.signatory_flag,
      dept_id: data.dept_id,
      designation: moment(new Date(data.designation)).format("MM/DD/YYYY"),
      date_of_joining: moment(new Date(data.date_of_joining)).format(
        "MM/DD/YYYY"
      ),
      supervisor_code: data.supervisor_code,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve("success");
      }
    });
  });
}

function adduserClient(data, hpass) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `insert into tbl_client set ?`;
    let post = {
      user_id: data.user_id,
      client_name: data.client_name,
      client_status: data.client_status,
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve("success");
      }
    });
  });
}

function sendforgotPasswordByEmail(password, name, email) {
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
      subject: "Updated Login Credentials",
      html: `Hi, "${name}"<br/>Welcome!!!<br/>Your login credentials is as:
            <br/>
            email: <strong>${email}</strong><br/>
            password: <strong>${password}</strong><br/>
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

function checkEmail(email) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_user where email="${email}"  order by email desc limit 1`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function checkEmailEmployee(email) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_user AS a INNER JOIN tbl_employee As b ON b.user_id-a.user_id where a.email="${email}" and a.user_type<>"recruitee"  order by email desc limit 1`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function checkResumeUser(data) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_recruitee_resume rr 
        inner join tbl_recruitee r on r.recruitee_id=rr.recruitee_id where r.user_id='${data}'`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function sendCodebyEmail(code, name, email) {
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
      subject: "Updated Login Credentials",
      html: `Hi, "${name}"<br/>Welcome you!!!<br/>Please use the following code <strong>${code}</strong> to reset your password.
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

function checkUser(email) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_user WHERE email ='${email}' `;
    db.query(sql, function (err, row, fields) {
      if (!err) {
        resolve(row);
      } else {
        reject(err);
        //
      }
    });
  });
}
function checkUserRegister(email) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_user as a INNER JOIN tbl_recruitee AS b ON b.user_id=a.user_id WHERE a.email ='${email}' and b.registration_status='yes' `;
    db.query(sql, function (err, row, fields) {
      if (!err) {
        resolve(row);
      } else {
        reject(err);
        //
      }
    });
  });
}
function checkUserOld(email, emailold) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_user WHERE email ='${email}' and email<>'${emailold}'`;
    db.query(sql, function (err, row, fields) {
      if (!err) {
        resolve(row);
      } else {
        reject(err);
        //
      }
    });
  });
}

function checkUserStatus(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}' and user_status="active"`;
    db.query(sql, function (err, row, fields) {
      //console.log(sql,row)
      if (err) {
        reject(err);
      } else {
        resolve(row);
        //
      }
    });
  });
}

function checkUserByID(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}'`;
    db.query(sql, function (err, row, fields) {
      //console.log(sql)
      if (row.length > 0) {
        resolve(row);
      } else {
        reject(err);
        //
      }
    });
  });
}

function checkUserLoginBlockStatus(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}' and login_block_status="unblock"`;
    db.query(sql, function (err, row, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(row);
        //
      }
    });
  });
}
function checkRegStatus(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    var sql = `SELECT * FROM tbl_recruitee WHERE user_id ='${uid}' and registration_status="yes"`;
    db.query(sql, function (err, row, fields) {
      //console.log(sql,row)
      if (err) {
        reject(err);
      } else {
        resolve(row);
        //
      }
    });
  });
}

function getJobByPosition(str) {
  //console.log(str)
  return new Promise(function (resolve, reject) {
    let sql = `
        SELECT job_id FROM tbl_job WHERE ${str} `;

    // console.log(sql)

    db.query(sql, function (err, res) {
      if (err) {
        //  console.log(err);
        reject("err");
      } else {
        // console.log(res)
        resolve(res);
      }
    });
  });
}

function getDesiredLocation() {
  //console.log(str)
  return new Promise(function (resolve, reject) {
    let sql = `
            SELECT DISTINCT * FROM 
            ( SELECT prefered_state FROM tbl_application
            UNION ALL
            SELECT state as prefered_state FROM tbl_job
            ORDER BY prefered_state ASC ) as u
            WHERE u.prefered_state != ""
            `;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        //console.log(res)
        resolve(res);
      }
    });
  });
}

function getApplicantsApplicant(str, job_id) {
  // console.log(str)
  return new Promise(function (resolve, reject) {
    // let sql = `
    // select COUNT(*) as count,r.*,s.*,u.*,sp.*,p.* from tbl_application a
    //         inner join tbl_recruitee r on r.recruitee_id = a.recruitee_id
    //         inner join tbl_recruitee_details s on s.recruitee_id = a.recruitee_id
    //         inner join tbl_user u on u.user_id = r.user_id
    //         left join tbl_job j on j.job_id = a.job_id
    //         left join tbl_speciality  sp on sp.speciality_id=s.speciality
    //         left join tbl_profession p on p.profession_id=s.profession
    //         where ${str} and a.job_id in (${job_id})
    //         GROUP BY r.recruitee_id `;

    let sql = `
        select COUNT(*) as count,r.*,s.*,u.*,sp.*,p.* from tbl_application a
                inner join tbl_recruitee r on r.recruitee_id = a.recruitee_id 
                inner join tbl_recruitee_details s on s.recruitee_id = a.recruitee_id
                inner join tbl_user u on u.user_id = r.user_id
                inner join tbl_job j on j.job_id = a.job_id
                left join tbl_speciality  sp on sp.speciality_id=s.speciality
                left join tbl_profession p on p.profession_id=s.profession
                where ${str} and a.job_id in (${job_id})
                GROUP BY r.recruitee_id `;

    //  console.log(sql)

    db.query(sql, function (err, res) {
      if (err) {
        // console.log(err);
        reject("err");
      } else {
        // console.log(res);
        resolve(res);
      }
    });
  });
}

function getApplicantsHired(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select COUNT(*) as count,r.*,s.*,u.*,sp.*,p.* from tbl_application a
        inner join tbl_recruitee r on r.recruitee_id = a.recruitee_id 
        inner join tbl_recruitee_details s on s.recruitee_id = a.recruitee_id
        inner join tbl_user u on u.user_id = r.user_id
        left join tbl_speciality  sp on sp.speciality_id=s.speciality
        left join tbl_profession p on p.profession_id=s.profession
        where r.recruit_status="hired"
        GROUP BY r.recruitee_id`;
    // let sql = `select * from tbl_application a
    // inner join tbl_recruitee r on r.recruitee_id = a.recruitee_id
    // inner join tbl_recruitee_details s on s.recruitee_id = a.recruitee_id
    // inner join tbl_user u on u.user_id = r.user_id
    // where recruit_status="hired"
    // order by a.application_id desc`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function getAssignmentCount(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select a.*,b.*,c.* from tbl_application as a
        INNER JOIN tbl_assignment AS b ON b.application_id=a.application_id
        INNER JOIN tbl_job AS c On c.job_id=b.job_id
        where a.recruitee_id='${data.recruitee_id}'`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function getApplicantsAll(data) {
  return new Promise(function (resolve, reject) {
    let sql = `select COUNT(*) as count,r.*,s.*,u.*,sp.*,p.* from tbl_application a
        inner join tbl_recruitee r on r.recruitee_id = a.recruitee_id 
        inner join tbl_recruitee_details s on s.recruitee_id = a.recruitee_id
        left join tbl_speciality  sp on sp.speciality_id=s.speciality
        left join tbl_profession p on p.profession_id=s.profession
        inner join tbl_user u on u.user_id = r.user_id
        WHERE u.user_status!="deleted"
        GROUP BY r.recruitee_id`;
    // let sql = `select * from tbl_application a
    // inner join tbl_recruitee r on r.recruitee_id = a.recruitee_id
    // inner join tbl_recruitee_details s on s.recruitee_id = a.recruitee_id
    // inner join tbl_user u on u.user_id = r.user_id
    // order by a.application_id desc`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

function updatewordPassword(email, hashedPassword) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let date = new Date();
    let strTime = date.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    let sql = `update tbl_user set ? where email="${email}" and user_status="active" `;
    post = {
      password: hashedPassword,
      password_change_date: moment(new Date(strTime)).format("MM/DD/YYYY"),
    };
    db.query(sql, post, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve("success");
      }
    });
  });
}

function getUserAccess(uid) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT DISTINCT * 
        FROM tbl_user AS a 
        inner join tbl_user_access AS b ON a.user_id=b.user_id 
        inner join tbl_action as c on b.action_id=c.action_id 
        inner join tbl_submodule as d on d.submodule_id=c.submodule_id 
        inner join tbl_module as e on e.module_id=d.module_id   
        where a.user_id=${uid}  ORDER BY e.module_id,d.submodule_id,c.action_id`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

app.post(
  "/vcsapi/get/application/onboarding/user",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let us = await getApplicationOnboard(req.body.user_id);

          res.json(us);
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

function getApplicationOnboard(user_id) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT *,m.system_name AS system_name_name FROM tbl_job AS a 
        INNER JOIN tbl_application AS b ON a.job_id=b.job_id
        INNER JOIN tbl_onboarding AS c ON c.application_id=b.application_id
        INNER JOIN tbl_recruitee AS e ON e.recruitee_id=b.recruitee_id
        INNER JOIN tbl_recruitee_details AS f ON e.recruitee_id=f.recruitee_id
        INNER JOIN tbl_user AS g ON g.user_id=e.user_id
        LEFT JOIN tbl_profession AS h ON h.profession_id=f.profession
        LEFT JOIN tbl_speciality AS i ON i.speciality_id=f.speciality
        INNER JOIN tbl_client AS j ON j.client_id=a.client_id
        left join tbl_job_type AS k ON k.job_type_id=a.job_type
        left join tbl_position_type AS l ON l.position_type_id=a.position_type
        inner join tbl_system_name AS m ON m.system_name_id=a.system_name
        WHERE (b.application_stage="offer_accepted" OR b.application_stage="onboarding" OR b.application_stage="hired") AND g.user_id=${user_id}
        ORDER BY c.onboarding_id DESC`;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

app.post(
  "/vcsapi/get/doc_id/other/or/facility",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    async function apps() {
      try {
        let get = await getDocInfo(req.body.doc_name);
        res.json(get);
      } catch (err) {
        //console.log(err);
        res.json(err);
      }
    }
    apps();
  }
);

function getDocInfo(doc_name) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_standard_document where doc_name='${doc_name}' `;

    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

app.post(
  "/vcsapi/api/get/payroll/assignment",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let str = "";
          if (req.body.client_id !== "ALL") {
            str = ` AND a.client_id="${req.body.client_id}"`;
          }
          if (req.body.year !== "ALL") {
            str = str + ` AND c.year="${req.body.year}"`;
          }
          if (req.body.month !== "ALL") {
            str = str + ` AND c.month="${req.body.month}"`;
          }

          let getREc = await getRecruitee(req.body.user_id);
          if (getREc.length) {
            let getAss = await getAssignmentPay(str, getREc[0].recruitee_id);
            res.json(getAss);
          } else {
            res.json("No User found");
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

function getAssignmentPay(str, recId) {
  return new Promise(function (resolve, reject) {
    let sql = `select a.*,b.*,c.*,d.*,e.*,f.*,g.*,h.*,i.*,j.rec_reg_hr,j.rec_ot_hr,j.rec_holiday_hr from tbl_assignment AS a 
        INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id 
        INNER JOIN tbl_week AS c ON c.week_id=b.week_id 
        INNER JOIN tbl_client AS d ON d.client_id=a.client_id 
        INNER JOIN tbl_job AS e ON e.job_id=a.job_id 
        INNER JOIN tbl_recruitee AS f ON f.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user As g ON g.user_id=f.user_id
        INNER JOIN tbl_onboarding AS h ON h.onboarding_id=a.onboarding_id
        INNER JOIN tbl_application AS i ON i.application_id=a.application_id
        LEFT JOIN tbl_rec_work_hr AS j ON j.assignment_id=a.assignment_id AND j.recruitee_id=a.recruitee_id AND j.week_id=b.week_id
        WHERE  b.payroll_status='approved' AND a.recruitee_id=${recId} ${str} ORDER BY c.week_id DESC`;

    db.query(sql, function (err, res) {
      //console.log(sql);
      if (err) {
        //console.log(err);
        reject("err");
      } else {
        resolve(res);
      }
    });
  });
}

app.post(
  "/vcsapi/get/assignmentdata/assignment_history/filtered",
  stuff.verifyToken,
  stuff.verify,
  function (req, res) {
    if (verifys == "verify") {
      async function apps() {
        try {
          let str = "";
          if (req.body.client_id !== "ALL") {
            str = ` AND a.client_id="${req.body.client_id}"`;
          }
          if (req.body.year !== "ALL") {
            str = str + ` AND c.year="${req.body.year}"`;
          }
          if (req.body.month !== "ALL") {
            str = str + ` AND c.month="${req.body.month}"`;
          }

          let getREc = await getRecruitee(req.body.user_id);
          if (getREc.length) {
            let getAss = await getAssignmentHistoryFiltrdData(
              str,
              getREc[0].recruitee_id
            );
            res.json(getAss);
          } else {
            res.json("No User found");
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

function getAssignmentHistoryFiltrdData(str, recId) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_assignment AS a 
        INNER JOIN tbl_payroll_invoice AS b ON a.assignment_id=b.assignment_id 
        INNER JOIN tbl_week AS c ON c.week_id=b.week_id 
        INNER JOIN tbl_client AS d ON d.client_id=a.client_id 
        INNER JOIN tbl_job AS e ON e.job_id=a.job_id 
        INNER JOIN tbl_recruitee AS f ON f.recruitee_id=a.recruitee_id
        INNER JOIN tbl_user As g ON g.user_id=f.user_id
        INNER JOIN tbl_onboarding AS h ON h.onboarding_id=a.onboarding_id
        INNER JOIN tbl_application AS k ON k.application_id=a.application_id
        WHERE  b.payroll_status='approved' AND (a.assignment_status="working" OR a.assignment_status="closed") AND a.recruitee_id=${recId} ${str}
        ORDER BY c.week_id DESC`;
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

function getAllUser(uid) {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select * from tbl_user where user_id="${uid}" AND user_status!="deleted"`;
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
function getApplicationByclient() {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_job As a  INNER JOIN tbl_client AS c ON c.client_id=a.client_id`;
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
function applied_no(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a 
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        inner JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        left join tbl_job_type AS k ON k.job_type_id=d.job_type
        where a.application_stage="applied" && a.review_status="no" AND a.job_id="${data}"`;
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

function applied_yes(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a 
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        left join tbl_job_type AS k ON k.job_type_id=d.job_type
        where (a.application_stage="applied" OR a.application_stage="sort_listed" OR a.application_stage="offered"
         OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired")  AND a.job_id="${data}"`;
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

function sortlisted(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        left join tbl_job_type AS k ON k.job_type_id=d.job_type
        where (a.application_stage="sort_listed" OR a.application_stage="offered"
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired")  AND a.job_id="${data}"`;
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

function offered(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a 
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="offered"
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired") 
         AND a.job_id="${data}"`;
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

function apl_acc(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="offer_accepted" OR a.application_stage="onboarding" OR a.application_stage="hired") 
         AND a.job_id="${data}"`;
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
function onBoard(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="onboarding" OR a.application_stage="hired") 
         AND a.job_id="${data}"`;
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
function hired(data) {
  return new Promise(function (resolve, reject) {
    let sql = `SELECT * FROM tbl_application AS a
        INNER JOIN tbl_recruitee AS b ON a.recruitee_id=b.recruitee_id
        INNER JOIN tbl_user AS c ON c.user_id=b.user_id
        INNER JOIN tbl_job AS d ON d.job_id=a.job_id
        left JOIN tbl_position_type AS e ON e.position_type_id=d.position_type
        where (a.application_stage="hired") 
         AND a.job_id="${data}"`;
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
function getJobdataOfOBHOA(data) {
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
         AND j.onb_mgr_id='${data.user_id}'`;
    db.query(sql, function (err, res) {
      //  //console.log(sql);
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
function getJobdataHired() {
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
         `;
    //  INNER JOIN tbl_assign_manager AS j ON j.application_id=b.application_id
    db.query(sql, function (err, res) {
      //  //console.log(sql);
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
function getApplicantAndAssignManagerDetails() {
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
         `;
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
function getjobPostDetailsall() {
  return new Promise(function (resolve, reject) {
    let sql = `select j.*,d.*,e.*,c.client_name,f.system_name AS system_name_name, g.user_first_name AS job_post_by_first_name,g.user_middle_name AS job_post_by_middle_name,g.user_last_name AS job_post_by_last_name,
        h.user_first_name AS job_post_edit_by_first_name,h.user_middle_name AS job_post_edit_by_middle_name,h.user_last_name AS job_post_edit_by_last_name 
        from  tbl_job j
        inner join tbl_client c on c.client_id=j.client_id
        left join tbl_job_type AS d ON d.job_type_id=j.job_type
        left join tbl_position_type AS e ON e.position_type_id=j.position_type
        inner join tbl_system_name AS f ON f.system_name_id=j.system_name
        inner join tbl_user AS g ON g.user_id=j.job_post_by
        left join tbl_user AS h ON h.user_id=j.job_post_edit_by
        order by j.job_id desc`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("inserted")
        resolve(res);
      }
    });
  });
}
function getapplicationjobPostCount(job) {
  return new Promise(function (resolve, reject) {
    let sql = `select count(*) AS count from tbl_application AS a where a.job_id='${job}'`;
    db.query(sql, function (err, res) {
      if (err) {
        //console.log(err);
        reject(err);
      } else {
        //console.log("inserted")
        resolve(res);
      }
    });
  });
}
function getAccountFileDetails() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `SELECT * FROM tbl_account_file AS a 
        INNER JOIN tbl_week AS b ON a.week_id=b.week_id
        INNER JOIN tbl_client AS c ON c.client_id=a.client_id
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
function getCandidates() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    // let sql = `SELECT a.*,e.*,any_value(e.skill_area_id) as skill_area_id_id FROM tbl_candidate as a
    // INNER JOIN tbl_skillset_map as b ON b.candidate_id = a.candidate_id
    // INNER JOIN tbl_skillset As c ON c.skillset_id = b.skillset_id
    // INNER join tbl_skill_domain AS d ON d.skill_domain_id = c.skill_domain_id
    // INNER JOIN tbl_skill_area as e ON e.skill_area_id = d.skill_area_id
    // GROUP BY skill_area_id_id
    //  `;

    let sql = `SELECT a.*,e.*,any_value(e.skill_area_id) as skill_area_id_id  FROM tbl_candidate as a
        INNER JOIN tbl_skillset_map as b ON b.candidate_id = a.candidate_id
        INNER JOIN tbl_skillset As c ON c.skillset_id = b.skillset_id
        INNER join tbl_skill_domain AS d ON d.skill_domain_id = c.skill_domain_id 
        INNER JOIN tbl_skill_area as e ON e.skill_area_id = d.skill_area_id
        GROUP BY a.candidate_id,skill_area_id_id
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

function getskillsetData() {
  return new Promise(function (resolve, reject) {
    // //console.log("insert")
    let sql = `select distinct a.*,e.*,f.* from tbl_candidate as a 
        INNER JOIN tbl_skillset_map as b ON a.candidate_id=b.candidate_id 
        INNER JOIN tbl_skillset As c ON c.skillset_id=b.skillset_id 
        inner join tbl_skill_domain AS d ON d.skill_domain_id=c.skill_domain_id 
        INNER JOIN tbl_skill_area as e ON e.skill_area_id=d.skill_area_id 
        INNER JOIN tbl_skill_category AS f ON f.skill_category_id=e.skill_category_id
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

module.exports = app;
