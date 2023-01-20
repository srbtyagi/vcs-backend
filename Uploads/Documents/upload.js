const db = require("./db/db");
const moment = require("moment");
var xlsx = require("xlsx");
var wb = xlsx.readFile("xlfile/consume_cc.xlsx");
var ws = wb.Sheets["CITY CAFE"];
const bcrypt = require("bcrypt");
// var data=xlsx.utils.sheet_to_json(ws);
var data = xlsx.utils.sheet_to_row_object_array(ws, {
  date_format: "dd/mm/yyyy",
});

var Arrays = [...data];
// console.log("data",Arrays[0]);

setTimeout(function () {
  async function apps() {
    const obj = {
      costcenter_name: Arrays[0].costcenter_name,
      email: Arrays[0].email,
    };
    console.log(obj);

    let dataArt = [];
    let getUser = await getUserByEmail(obj);
    let count = 0;
    let count1 = 0;
    if (getUser.length > 0) {
      console.log("USER");
      let getCostcenter = await getCC(obj);
      if (getCostcenter.length > 0) {
        console.log("CC");
        //insert data inside tbl_consume
        let obj2 = {
          costcenter_id: getCostcenter[0].costcenter_id,
          created_by: getUser[0].user_id,
        };
        console.log(obj2);
        let post = await insertConsume(obj2);
        if (post === "success") {
          console.log("BEFORE LOOP----------------");
          for (let i in Arrays) {
            let getArt = await getArticle(Arrays[i]);
            const obj1 = {
              article_code: Arrays[i].article_code,
              article_id: getArt[0].article_id,
              qty_bus: Arrays[i].qty_bu,
              costcentre_id: getCostcenter[0].costcenter_id,
              store_unit: Arrays[i].store_unit,
              created_by: getUser[0].user_id,
              qrcode_print_label: "NULL",
              qr_id: 0,
              inventory_id: 0,
            };

            // console.log("obj1",obj1);

            let getInv = await getInventory(obj1);
            if (getInv.length > 0) {
              for (let k = 0; k < getInv.length; k++) {
                if (getInv[k].qty_bu - getInv[k].min_soh_bu >= 0) {
                  obj1["inventory_id"] = getInv[0].inventory_id;
                }
              }

              let getQR = await getQrcode(obj1);
              if (getQR.length > 0) {
                obj1["qrcode_print_label"] = getQR[0].qrcode_print_label;
                obj1["qr_id"] = getQR[0].qr_id;
                dataArt.push(obj1);
              } else {
                console.log(obj1, "NO QRCODE");
              }
            }
          }
          // console.log(dataArt)
        }
      }
    }

    for (let m = 0; m < dataArt.length; m++) {
      // console.log("IN LOOP-------------------------",m)
      if (dataArt[m].qrcode_print_label != "NULL") {
        console.log("IF INV");
        if (dataArt[m].inventory_id != 0) {
          let inventory_data = await getInventoryData(dataArt[m].inventory_id);
          // console.log(inventory_data);
          if (inventory_data.length) {
            console.log("IN INVE");
            let diff =
              parseFloat(inventory_data[0].qty_bu) -
              parseFloat(inventory_data[0].min_soh_bu);

            if (dataArt[m].qty_bus > diff) {
              if (diff >= inventory_data[0].min_soh_bu) {
                console.log("IF IF");
                dataArt[m].qty_bus = diff.toFixed(4);
              } else {
                console.log("IF ELSE");
                dataArt[m].qty_bus = 0;
              }
            } else {
              console.log("ELSE");
              dataArt[m].qty_bus = dataArt[m].qty_bus.toFixed(4);
            }
          }
        } else {
          count1++;
        }
        console.log(dataArt[m].qty_bus);
      }
    }
    ///////// get consume_id
    let post1 = await getConsumeId();
    let post2 = await insertConsumeArt(dataArt, post1);
    count++;

    // console.log("=================",post1,post2)
    /////work for inventory
    for (i = 0; i <= dataArt.length - 1; i++) {
      if (dataArt[i].qrcode_print_label != "NULL") {
        console.log("IN loop inventory", i, dataArt[i]);
        if (dataArt[i].inventory_id != 0) {
          let previouseData = await getInventoryData(dataArt[i].inventory_id);
          let update_inv = await updateInventory(dataArt[i], previouseData[0]);
          count++;
          console.log("SUCCESS INV");
        } else {
          count1++;
        }
      }
    }

    ///work for tbl_qrcode
    for (i = 0; i <= dataArt.length - 1; i++) {
      if (dataArt[i].qrcode_print_label != "NULL") {
        console.log("IN loop tbl_qrcode", i, dataArt[i].qty_bus);
        if (dataArt[i].inventory_id != 0) {
          let previouseData = await getInventoryData(dataArt[i].inventory_id);
          let getqrcodeData = await getqrid(dataArt[i].qr_id);
          if (getqrcodeData.length > 0) {
            let update_qrcode = await updateqrcodedata(
              dataArt[i],
              previouseData[0],
              getqrcodeData
            );
            count++;
            console.log("update res", update_qrcode);
          }
        } else {
          count1++;
        }
      }
    }

    //work for tbl_inventoy_tracking
    for (let k in dataArt) {
      if (dataArt[k].qrcode_print_label != "NULL") {
        // console.log("IN loop tbl_inventory_track",i,dataArt[k].qty_bus);
        let check_inv_tracking = await getInvTrack(
          dataArt[0].costcentre_id,
          dataArt[k].qr_id
        );
        if (check_inv_tracking.length > 0) {
          ////update tbl_inventory_tracking
          if (dataArt[k].inventory_id != 0) {
            let previouseData = await getInventoryData(dataArt[k].inventory_id);
            const obj3 = {
              qr_id: dataArt[k].qr_id,
              cost_center_id: dataArt[0].costcentre_id,
              previousIn: previouseData,
              quantity: dataArt[k].qty_bus,
            };
            ////////////insert into tbl_inventory_tracking
            console.log("update inventory tracking ----if");
            let updartInv_track = await updateInvTrack(
              obj3,
              obj3.previousIn[0],
              check_inv_tracking[0]
            );
            console.log("res", updartInv_track);
          } else {
            count1++;
          }
        } else {
          console.log("insert inventory tracking ----else");
          if (dataArt[k].inventory_id != 0) {
            let previouseData = await getInventoryData(dataArt[k].inventory_id);
            const obj4 = {
              qr_id: dataArt[k].qr_id,
              cost_center_id: dataArt[0].costcentre_id,
              previousIn: previouseData,
              quantity: dataArt[k].qty_bus,
            };
            ////////////insert into tbl_inventory_tracking

            let insertInv_track = await insertInvTrack(
              obj4,
              obj4.previousIn[0]
            );
            count++;
            console.log("res", insertInv_track);
          } else {
            count1++;
          }
        }
      } else {
        console.log("NULL------------");
      }
    }

    console.log("success", post2, count, count1++);
  }
  apps();
}, 1000);

function insertConsume(data) {
  return new Promise((resolve, reject) => {
    var time = calcTime("dubai", "+4");
    let sql = `insert into tbl_consume set ?`;
    let post = {
      costcentre_id: data.costcenter_id,
      date_time: time,
      consume_status: "active",
      created_by: data.created_by,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else {
        console.log("insert query--", sql, post, result);
        resolve("success");
      }
    });
  });
}

function getUserByEmail(data) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `SELECT * FROM tbl_user where email="${data.email}" and user_status="active"`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log("ERROR===================");
          reject(err);
        } else resolve(result);
      });
    } catch (err) {
      console.log("ERROR" + err);
    }
  });
}
function getCC(data) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `SELECT * FROM tbl_cost_center where costcenter_name="${data.costcenter_name}" and hotel_id=5 and type="costcenter"`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log("ERROR===================");
          reject(err);
        } else resolve(result);
      });
    } catch (err) {
      console.log("ERROR" + err);
    }
  });
}
function getQrcode(data) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `
    SELECT * FROM(
    SELECT a.qrcode_print_label ,a.qr_id,b.purchase_id
    from tbl_qrcode_print AS a
    INNER JOIN tbl_qrcode AS b ON a.qr_id=b.qr_id
    INNER JOIN tbl_purchases AS c ON c.purchase_id=b.purchase_id
    WHERE c.article_no="${data.article_code}" AND c.unit="${data.store_unit}" AND c.cost_centre_id="${data.costcentre_id}" AND c.hotel_id=5
    UNION ALL
    SELECT a.qrcode_print_label ,a.qr_id,b.purchase_id
    from tbl_qrcode_print AS a
    INNER JOIN tbl_qrcode AS b ON a.qr_id=b.qr_id
    INNER JOIN tbl_purchases AS c ON c.purchase_id=b.purchase_id
    WHERE c.article_no="${data.article_code}" AND c.unit="${data.store_unit}" AND c.hotel_id=5
   ) temp
    ORDER BY purchase_id DESC LIMIT 1;`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log("ERROR===================");
          reject(err);
        } else resolve(result);
      });
    } catch (err) {
      console.log("ERROR" + err);
    }
  });
}
function getInventory(data) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `SELECT a.* 
    from tbl_inventory AS a
    INNER JOIN tbl_article AS b ON b.article_id=a.article_id
    WHERE b.article_code="${data.article_code}" AND a.store_unit="${data.store_unit}" AND a.costcenter_id="${data.costcentre_id}"`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log("ERROR===================");
          reject(err);
        } else resolve(result);
      });
    } catch (err) {
      console.log("ERROR" + err);
    }
  });
}
function getInventoryData(data) {
  return new Promise((resolve, reject) => {
    let sql = ` SELECT * from tbl_inventory as a WHERE a.inventory_id='${data}'`;
    db.query(sql, (err, result) => {
      // console.log(err);
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function getConsumeId() {
  return new Promise((resolve, reject) => {
    let sql = `select consume_id from tbl_consume order by consume_id desc limit 1 `;
    db.query(sql, (err, result) => {
      console.log(err);
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function insertConsumeArt(data, data1) {
  return new Promise((resolve, reject) => {
    for (i = 0; i < data.length; i++) {
      let sql = `insert into tbl_consume_art_list set ?`;
      let post = {
        consume_id: data1[0].consume_id,
        article_id: data[i].article_id,
        qty_bu: data[i].qty_bus,
        qr_id: data[i].qr_id,
      };
      db.query(sql, post, (err, result) => {
        console.log(err);
        if (err) resolve("err");
        else console.log("success");
      });
    }
    resolve("success");
  });
}
function getArticle(data) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `SELECT b.* 
    from tbl_article AS b 
    WHERE b.article_code="${data.article_code}"`;

      db.query(sql, (err, result) => {
        if (err) {
          console.log("ERROR===================");
          reject(err);
        } else resolve(result);
      });
    } catch (err) {
      console.log("ERROR" + err);
    }
  });
}
function updateInventory(data, prevData) {
  return new Promise((resolve, reject) => {
    let eqvalant = 0;
    if (prevData.qty_bu != 0) {
      console.log("IN");
      eqvalant = prevData.qty_su / prevData.qty_bu;
    }
    let su = 0;
    if (eqvalant != 0) {
      su = data.qty_bus / eqvalant;
    }
    const qty = data.qty_bus * Math.round(eqvalant);
    console.log(prevData.qty_bu, qty, su, eqvalant);
    let sql = `update tbl_inventory  set ? where inventory_id='${data.inventory_id}'`;
    let post = {
      qty_su: parseFloat(prevData.qty_su) - parseFloat(su),
      qty_bu: parseFloat(prevData.qty_bu) - parseFloat(data.qty_bus),
    };
    db.query(sql, post, function (err, result) {
      console.log(err, post);
      if (err) reject(err);
      else resolve("200");
    });
  });
}
function getqrid(data) {
  return new Promise((resolve, reject) => {
    let sql = `select * from  tbl_qrcode where qr_id ='${data}'`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function updateqrcodedata(data, prevData, qrcodeprevious) {
  return new Promise((resolve, reject) => {
    let total_qty =
      parseFloat(qrcodeprevious[0].total_qty) - parseFloat(data.qty_bus);
    let consumed_qty =
      parseFloat(qrcodeprevious[0].consumed_qty) + parseFloat(data.qty_bus);

    let total_qtys = total_qty.toFixed(2);

    let sql = `update tbl_qrcode set ? where qr_id='${data.qr_id}'`;
    let post = {
      total_qty: total_qtys,
      consumed_qty: parseFloat(consumed_qty).toFixed(2),
    };
    db.query(sql, post, function (err, result) {
      console.log(err);
      if (err) reject(err);
      else resolve("200");
    });
  });
}
function getInvTrack(cost_center_id, qr_id) {
  return new Promise(function (resolve, reject) {
    let sql = `select * from tbl_inventory_tracking where cost_center_id='${cost_center_id}' and qr_id='${qr_id}'`;
    db.query(sql, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function insertInvTrack(data, prevData) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_inventory_tracking set ?`;
    let post = {
      qr_id: data.qr_id,
      cost_center_id: data.cost_center_id,
      quantity: data.quantity,
    };
    db.query(sql, post, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function updateInvTrack(data, prevData, prevInche) {
  return new Promise(function (resolve, reject) {
    // var eqvalant=prevData.qty_su/prevData.qty_bu;
    // if(Number.isNaN(eqvalant)){
    // eqvalant=1
    // }
    // const quntity=data.quantity/eqvalant;

    let total_qty = parseFloat(prevInche.quantity) - parseFloat(data.quantity);
    let total_qtys = total_qty.toFixed(2);

    let sql = `update tbl_inventory_tracking set ? where qr_id='${data.qr_id}' and cost_center_id='${data.cost_center_id}'`;
    let post = {
      quantity: total_qtys,
    };
    db.query(sql, post, function (err, result) {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function update_contract_art(data, data1) {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE tbl_contract_art_list SET ? WHERE contract_id=${data1.contract_id} AND art_id="${data1.article_id}"`;

    let post = {
      purchase_unit: data.purchase_unit,
      eq_bu: data.eq_bu,
      unit_price: data.unit_price,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("success");
    });
  });
}
function update_quote_contract_art(data) {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE tbl_quote_contract_art_list SET ? WHERE quote_contract_id=${data.quote_contract_id} AND art_id="${data.article_id}"`;

    let post = {
      purchase_unit: data.purchase_unit,
      eq_bu: data.eq_bu,
      unit_price: data.unit_price,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("success");
    });
  });
}

function insert_qrcode_print(data) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_qrcode_print set ?`;
    let post = {
      qrcode_print_label: data.qrcode_print_label,
      qr_id: data.qr_id,
      purchase_no: data.purchase_no,
      label_qty: data.label_qty,
      no_label: data.no_label,
    };
    db.query(sql, post, function (err, result) {
      if (err) reject(err);
      else resolve("200");
    });
  });
}
function insert_article_1(data) {
  return new Promise(function (resolve, reject) {
    var times = calcTime("dubai", "+4");

    let sql = `insert into tbl_article set ?`;
    let post = {
      article_name: data.article_name,
      article_code: data.article_code,
      item_grp_id: data.item_grp_id,
      base_unit: data.base_unit,
      store_unit: data.store_unit,
      assigned_to: data.assigned_to,
      changed_by: 869,
      changed_date: times,
      article_status: "active",
      article_type: data.article_type,
      last_purchase_price: data.last_purchase_price,
      inventory_account: data.inventory_account,
      expense_account: data.expense_account,
      old_article_code: data.old_article_code,
    };
    db.query(sql, post, function (err, result) {
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function query1(data) {
  return new Promise(function (resolve, reject) {
    var time = calcTime("dubai", "+4");

    const saltRounds = 10;
    var pass = "casa@123";
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(pass, salt, function (err, hash) {
        let sql = `insert into tbl_vendor set ?`;
        let post = {
          vendor_name: data.vendor_name,
          supplier_name: data.vendor_name,
          group: data.ven_group,
          mob_no: data.mob_no,
          phone: data.mob_no,
          email: data.email,
          contact_person: data.contact_person,
          regn_status: "permanent",
          created_date: time,
          password: hash,
          status: "active",
          changed_date: time,
          hotel_id: 5,
          vendor_code: data.vendor_code,
          created_by: 869,
          type_supplier: "Trade-Local",
          gl_code: data.gl_code,
        };
        db.query(sql, post, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve("200");
          }
        });
      });
    });
  });
}

function calcTime(city, offset) {
  var d = new Date();
  var utc = d.getTime() + d.getTimezoneOffset() * 60000;
  var nd = new Date(utc + 3600000 * offset);
  var times = nd.toLocaleString();
  let newss = times.split("/");
  let dd = newss[0];
  let mm = newss[1];
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return (newdate = dd + "/" + mm + "/" + newss[2]);
}
function insert_purchase_history_f(data, article, vendor, cc) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_purchase_history set ?`;
    var price = data.price.toFixed(2);
    let post = {
      vendor_id: data.vendor_id,
      vendor_name: vendor.vendor_name,
      cost_centre_id: data.cost_centre_id,
      cost_centre_name: cc.costcenter_name,
      delivery_date: data.delivery_date,
      order_no: data.order_no,
      hotel_id: 5,
      invoice_no: data.invoice_no,
      article_id: article.article_id,
      article_no: article.article_code,
      article_name: article.article_name,
      unit: article.base_unit,
      qty: data.qty,
      unit_price: price,
      order_date: data.order_date,
      pr_qty: data.qty,
      pr_price: price,
      old_article_no: article.old_article_code,
    };
    db.query(sql, post, function (err, result) {
      console.log(err);
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function update_article_inventory(data) {
  return new Promise((resolve, reject) => {
    let sql = `update tbl_inventory set ? where inventory_id='${data.inventory_id}'`;

    let post = {
      min_soh_bu: data.min_soh_bu,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("success");
    });
  });
}
function get_article_id(data) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `select * from tbl_article where article_code='${data.new_article_no}'`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log("ERROR===================");
          reject(err);
        } else resolve(result);
      });
    } catch (err) {
      console.log("ERROR" + err);
    }
  });
}

function get_vendor_id(data) {
  return new Promise((resolve, reject) => {
    let sql = `select vendor_name from tbl_vendor where vendor_id='${data.vendor_id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log("ERROR===================");
        reject(err);
      } else resolve(result);
    });
  });
}
function get_costcenter_id(data) {
  return new Promise((resolve, reject) => {
    let sql = `select costcenter_name from tbl_cost_center where costcenter_id='${data.cost_centre_id}'`;
    db.query(sql, (err, result) => {
      if (err) {
        console.log("ERROR===================");
        reject(err);
      } else resolve(result);
    });
  });
}
function insert_article_inventory(data, article) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_inventory set ?`;
    var price = parseFloat(data.price_bu).toFixed(2);
    let post = {
      // costcenter_id:data.cost_centre_id,
      article_id: article.article_id,
      store_unit: article.store_unit,
      base_unit: article.base_unit,
      price_bu: price,
      article_status: "active",
      stroage_ht_id: 0,
      // min_soh_bu:data.min_soh_bu
    };
    db.query(sql, post, function (err, result) {
      console.log(err);
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function insert_article_purchaserate(data, article) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_purchase_rate set ?`;
    var price = data.pr_price.toFixed(2);
    let post = {
      article_id: article.article_id,
      article_no: data.article_no,
      pr_price: price,
    };
    db.query(sql, post, function (err, result) {
      console.log(err);
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function update_article_purchaseregister(data) {
  return new Promise((resolve, reject) => {
    let sql = `update tbl_article set ? where article_code='${data.article_code}'`;
    var lpp = data.lpp.toFixed(2);
    let post = {
      last_purchase_price: lpp,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("success");
    });
  });
}

function get_cost_Center_id(data) {
  return new Promise((resolve, reject) => {
    let sql = `select costcenter_id from tbl_cost_center where costcenter_code ='${data}' and hotel_id="5" and type='profitcenter'`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function insert_tbl_fnb_rev_history(data) {
  return new Promise(function (resolve, reject) {
    let sql = `insert into tbl_fnb_rev_history set ?`;
    let post = {
      start_year: data.start_year,
      end_year: data.end_year,
      hotel_id: data.hotel_id,
      corp_id: data.corp_id,
      profit_center_id: data.profit_center_id,
    };
    db.query(sql, post, function (err, result) {
      console.log(err);
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function update_recipe_comp(data, article) {
  return new Promise((resolve, reject) => {
    let sql = `update tbl_recipe_component set ? where comp_id='${data.article_no}'`;
    let post = {
      pot_qty: data.qty,
      act_qty: data.qty,
      wt_comp: data.qty,
      cos_comp: data.qty * article.last_purchase_price,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function update_recipe_comp2(data, articleNO, recipeID, article) {
  return new Promise((resolve, reject) => {
    let sql = `update tbl_recipe_component set ? where comp_id='${articleNO}' AND recipe_id='${recipeID}'`;
    let post = {
      pot_qty: data.qty,
      act_qty: data.qty,
      wt_comp: data.qty,
      cos_comp: data.qty * article.last_purchase_price,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function update_recipe_group(data) {
  return new Promise((resolve, reject) => {
    let sql = `update tbl_recipe set ? where recipe_no='${data.recipe_no}'`;
    let post = {
      recipe_group_id: data.recipe_group_id,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function sum_value(id) {
  return new Promise((resolve, reject) => {
    let sql = `select SUM(pot_qty) AS wt, SUM(cos_comp) AS cos from tbl_recipe_component where recipe_id=${id}`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
function update_recipe_gross(data, recipe_id) {
  return new Promise((resolve, reject) => {
    let sql = `update tbl_recipe set ? where recipe_id='${recipe_id}'`;
    let post = {
      wt_per_portion: data.wt,
      gross_wt: data.wt,
      cos_recipe: data.cos,
    };
    db.query(sql, post, (err, result) => {
      if (err) reject(err);
      else resolve("200");
    });
  });
}

function get_id_recipe() {
  return new Promise((resolve, reject) => {
    let sql = `select recipe_id from tbl_recipe`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
// function f_22(data){
// return new Promise((resolve,reject)=>{
// let sql=`update tbl_article set ? where  article_code='${data.article_code}'`;
// let post={
// last_purchase_price:data.lpp,
// inventory_account:data.inventory,
// expense_account:data.exp
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve("200");
// })
// });
// }

function get_article(data) {
  return new Promise((resolve, reject) => {
    let sql = `select last_purchase_price from tbl_article where article_code="${data}"`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function get_recipe(data) {
  return new Promise((resolve, reject) => {
    let sql = `select recipe_id from tbl_recipe where recipe_name="${data}"`;
    db.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function insert_recipe_comp(data, article, recipe) {
  return new Promise(function (resolve, reject) {
    let sql = "insert into tbl_recipe_component set ?";
    let post = {
      recipe_id: recipe.recipe_id,
      comp_type: "article",
      comp_id: data.article_no,
      pot_qty: data.qty,
      base_unit: article.base_unit,
      loss: 0,
      act_qty: data.qty,
      pr_price: article.last_purchase_price,
      cos_comp: data.qty * article.last_purchase_price,
      wt_comp: data.qty,
    };
    db.query(sql, post, function (err, result) {
      if (err) reject(err);
      else resolve("200");
    });
  });
}

// function f_1(){
//     return new Promise((resolve,reject)=>{
//     let sql=`select * from tbl_article`;
//     db.query(sql,(err,result)=>{
//     if(err)reject(err)
//     else resolve(result);
//     })
//     });
//     }

//get data from tbl_recipe
// function f_21(data){
//     return new Promise((resolve,reject)=>{
//     let sql=`select recipe_id from tbl_recipe where recipe_name="${data}"`;
//     db.query(sql,(err,result)=>{
//     if(err)reject(err)
//     else resolve(JSON.parse(JSON.stringify(result)));
//     })
//     });
//     }

// function fxz_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into practice set ?`
// let post={
// name:data.name,
// age:data.age,

// }

// db.query(sql,post,(err,result)=>{
// if(err)resolve("err")
// else
// console.log("200")
// resolve("200")

// })
// })
// }

// function fxz_2(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into  tbl_asset set ?`
// let post={
// ra_id:id.roomarea_id,
// asset_master_id:id.asset_master_id,
// hotel_id:id.hotel_id,
// dept_ht_id:id.dept_id,
// mcontract_id:0,
// operational_status:data.Operational_Status,
// yr_install:data.YearofInstallation,
// date_install:"NULL",
// warrenty_valid_dt:"NULL",
// proj_equip_life:data.ProEquipmentLifeyr,
// act_equip_life:data.Actual_Equipment_Life,
// po_id:0,
// replacement_status:data.Major_Repacabls,
// replace_yr:data.DurationofReplacement_y,
// replace_cost:data.Replacement_Cost,
// maintenance_cost_type:data.MaintenanceCostType,
// warranty_status:data.WarrantyStatus,
// asset_quantity:data.Quantity,
// asset_item_name:data.Asset_Item_Name.trim(),
// }
// db.query(sql,post,(err,result)=>{
// if(err)resolve("err")
// else {
// console.log("done")
// resolve("200")
// }

// })
// })
// }

// function fxz_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from practice where name='${data}'`
// db.query(sql,(err,result)=>{
// if(err)resolve("err")
// else {
// //console.log("done")
// resolve(result)
// }

// })
// })
// }

// function fxz_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_dept_ht where dept_code='${data}'`
// db.query(sql,(err,result)=>{
// if(err)resolve("err")
// else {
// //console.log("done")
// resolve(result)
// }

// })
// })
// }

// function fxz_5(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_asset_master where asset_code='${data}'`
// db.query(sql,(err,result)=>{
// if(err)resolve("err")
// else {
// //console.log("done")
// resolve(result)
// }

// })
// })
// }

// var fs = require('fs');

// var data=fs.readFileSync('xlfile/xl.xlsx',"utf8");
// console.log("data",data)
// var fs = require('fs');
// var array = fs.readFileSync('xlfile/xl.xlsx',"utf8")
// console.log(array)
// for(i in array) {
//   console.log(array[i]);
// }
// for(i in array) {
//     console.log(array[i]);
// }
//const db=require('./db/db');

// setTimeout(function(){
// try{
// async function app(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("master.xlsx");
// var ws=wb.Sheets["PReg2016-19"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// //console.log(Arrays[0])

// for(let i in Arrays){

// //////get article new code
// let get_1=await f_1(Arrays[i]);
// if(get_1.length>0){
// let delivery_1=new Date(Math.round((Arrays[i].Delivery_Date - 25569) * 86400 * 1000)).toISOString().substring(0, 10);
// let order_1=new Date(Math.round((Arrays[i].Order_Date - 25569) * 86400 * 1000)).toISOString().substring(0, 10);
// const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// const firstDate = new Date(delivery_1);
// const secondDate = new Date(order_1);
// const leadtime = Math.round(Math.abs((firstDate - secondDate) / oneDay));
// //console.log(diffDays)
// const obj={
// delivery_date:delivery_1,
// order_date:order_1,
// qty:Arrays[i].QTY,
// article_name:Arrays[i].Article,
// new_article_code:get_1[0].article_code,
// leadtime:leadtime
// }

// /////insert data in temp table
// let insertTable=await f_2(obj);
// //console.log("yes")
// }
// else{
//     console.log("NO")
// }
// }
// //console.log(obj)

// //console.log(new Date(Math.round((Arrays[5].Delivery_Date - 25569) * 86400 * 1000)).toISOString().substring(0, 10));
// }

// app();
// }catch(err){
// return (err)
// }
// }, 2000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_article where old_article_code='${data.Article_No}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_temp_data_register set ?`;
// let post={
//     delivery_date:data.delivery_date,
//     order_date:data.order_date,
//     qty:data.qty,
//     article_name:data.article_name,
//     new_article_code:data.new_article_code,
//     leadtime:data.leadtime,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else console.log("200")
// resolve("200")
// })
// });
// }

///////////////////////////////////////////////////////////////////////////
//const db=require('./db/db');

// setTimeout(function(){
// try{
// async function app(){
// ////get article
// let get_1=await f_1()
// //for(let i in get_1){
// for(let i=0;i<=get_1.length-1;i++){

// var no_puur=await f_6(get_1[i])
// if(no_puur.length>0){
//     var nopurs=no_puur[0].id
// }else{
//     var nopurs=0
// }
// //get_1[i].article_code=416001
// /////////////lead time avg
// let e_1=await f_2(get_1[i])
// if(e_1.length>0){

// let avgleadt_1= e_1[0].avgleadtime
// /////////get day between two date
// let get_11=await f_3(get_1[i]);
// if(get_11.length>1){
// let firstdateIs=get_11[0].delivery_date
// let lastdateIs=get_11[get_11.length-1].delivery_date
// let diff =  Math.floor(( Date.parse(new Date(lastdateIs)) - Date.parse(new Date(firstdateIs)) ) / 86400000);
// ///total quatity
// let totalqty=await f_4(get_1[i]);
// if(totalqty.length>0){
// var totalqtys= totalqty[0].sumqty
// }else{
// var totalqtys= 0
// }
// let consumptionRate=parseFloat(totalqtys)/parseFloat(diff);
// const obj={
// consumptionRate:consumptionRate.toFixed(2),
// leadtime:avgleadt_1.toFixed(2),
// article_code_new:get_1[i].article_code,
// articlename:get_1[i].article_name,
// hotel_id:2,
// no_purchase:nopurs
// }

// ////////insert data inside table
// let insedrt_1=await f_5(obj)

// }
// else{
// const obj={
// consumptionRate:0,
// leadtime:0,
// article_code_new:get_1[i].article_code,
// articlename:get_1[i].article_name,
// hotel_id:2,
// no_purchase:nopurs
// }

// ////////insert data inside table
// let insedrt_1=await f_5(obj)
// }
// }else{
// const obj={
//     consumptionRate:0,
//     leadtime:0,
//     article_code_new:get_1[i].article_code,
//     articlename:get_1[i].article_name,
//     hotel_id:2,
//     no_purchase:nopurs
//     }

//     ////////insert data inside table
//     let insedrt_1=await f_5(obj)
// }
// //console.log(e_1)

// }

// }
// app();
// }catch(err){
// return (err)
// }
// }, 2000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_article`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise((resolve,reject)=>{
// let sql=`select avg(leadtime) as avgleadtime from tbl_temp_data_register where new_article_code='${data.article_code}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_temp_data_register where new_article_code='${data.article_code}' order by delivery_date ASC `;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select sum(qty) as sumqty from tbl_temp_data_register where new_article_code='${data.article_code}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_cosumption_article set ?`;
// let post={
// consumptionRate:data.consumptionRate,
// leadtime:data.leadtime,
// article_code_new:data.article_code_new,
// articlename:data.articlename,
// hotel_id:data.hotel_id,
// no_purchase:data.no_purchase
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else
// console.log("200")
// resolve("200");
// })
// });
// }

// function f_6(data){
// return new Promise((resolve,reject)=>{
// let sql=`select count(id) as id from tbl_temp_data_register where new_article_code='${data.article_code}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
//////////////////////////////////////////////////////////////////////
// const db=require('./db/db'); ///over group

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Article Master (RAK)"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// for(let i in Arrays){
// let overgroupname=Arrays[i].new_over_group.trim();
// let checkData=await f_1(overgroupname)
// if(checkData.length==0){
// //////////////insert into tbl_over_group
// let isnertOver=await f_2(overgroupname,Arrays[i].assigned_to);
// }else{
//     console.log(i)
// }
// }
// }
// app()

// }, 3000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_over_group where over_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,assigned){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_over_group set ?`;
// let post={
//     over_grp_name:data,
//     assigned_to:assigned,
//     changed_by:"334",
//     changed_date:"3/16/2020, 11:15:27 AM",
//     over_grp_status:"active"
// }
// db.query(sql,post,(err,result)=>{
//     console.log(err)
// if(err)reject(err)
// else
// resolve(result);
// })
// });
// }

//////////////////////////////////////////////////////major group
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Article Master (RAK)"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// ////////////////////
// for(let i in Arrays){
// let overgroupname=Arrays[i].new_over_group.trim();
// let getoverId=await f_1(overgroupname)
// let majorgroupname=Arrays[i].new_major_group.trim();
// let checkmajorgroup=await f_3(majorgroupname)
// if(checkmajorgroup.length==0){
// //////insert into major group
// let insertmajor=await f_2(Arrays[i],getoverId,majorgroupname,Arrays[i].assigned_to)
// }else{
//     console.log(i)
// }
// }

// }
// app()

// }, 3000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_over_group where over_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result[0].over_grp_id);
// })
// });
// }

// function f_2(data,getoverId,majorgroupname,assigned_to){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_major_group set ?`;
// let post={
//     major_grp_name:majorgroupname,
//     over_grp_id:getoverId,
//     sales_tax_rate:0,
//     beverage_tax_rate:0,
//     service_charge:0,
//     assigned_to:assigned_to,
//     changed_by:"334",
//     changed_date:"3/16/2020, 11:15:27 AM",
//     major_grp_status:"active"
// }
// db.query(sql,post,(err,result)=>{
// console.log(err)
// if(err)reolve("err")
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_major_group where major_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////item  group
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Article Master (RAK)"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// ////////////////////
// for(let i in Arrays){
// let majorgroupname=Arrays[i].new_major_group.trim();
// ////get id
// let getmajorgroupId=await f_3(majorgroupname);
// ////////check itme group
// let itemgroupname=Arrays[i].new_item_group.trim();
// let check_item=await f_1(itemgroupname)
// if(check_item.length==0){
// //insert into tbl_item_group
// let itemgroupcode=Arrays[i].new_artno.toString().slice(0,3)
// let insert=await f_2(itemgroupname,getmajorgroupId,Arrays[i],itemgroupcode)

// }else{
//     console.log(i)
// }

// }
// }
// app()

// }, 3000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_item_group where item_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(itemgroupname,major_grp_id,data,itemgroupcode){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_item_group set ?`;
// let post={
//     item_grp_name:itemgroupname,
//     item_grp_code :itemgroupcode,
//     major_grp_id:major_grp_id,
//     inventory_account:0,
//     expense_account:0,
//     cos_account:0,
//     purchase_tax_rate:1,
//     assigned_to:data.assigned_to,
//     changed_by:"334",
//     changed_date:"3/16/2020, 11:15:27 AM",
//     item_grp_status:"active"
// }
// db.query(sql,post,(err,result)=>{
// console.log(err)
// if(err)reolve("err")
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_major_group where major_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result[0].major_grp_id);
// })
// });
// }
//////////////////////////////////////////////article
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Article Master (RAK)"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// ////////////////////
// for(let i=0;i<=Arrays.length-1;i++){
// let itemgroupname=Arrays[i].new_item_group.trim();
// ////get id
// let getitemgroupId=await f_3(itemgroupname);
// ////////check artilce
// let article=Arrays[i].Article.trim();
// let insert=await f_2(Arrays[i],getitemgroupId)
// //let check_item=await f_1(article)
// // if(check_item.length==0){
// // //insert into tbl_article

// // }else{
// //     console.log(i)
// // }

// }
// }
// app()

// }, 15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_article where article_name=${data}`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,getitemgroupId){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_article set ?`;
// let post={
//     article_name:data.Article,
//     article_code  :data.new_artno,
//     item_grp_id:getitemgroupId,
//     base_unit:data.base_unit,
//     store_unit:data.store_unit,
//     assigned_to:data.assigned_to,
//     changed_by:334,
//     changed_date:"3/16/2020, 11:15:27 AM",
//     article_status:"active",
//     old_article_code:data.old_article_no,
//     article_type:data.type,
//     last_purchase_price:data.last_purchase_price
// }
// db.query(sql,post,(err,result)=>{
// console.log(err)
// if(err)resolve("err")
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_item_group where item_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result[0].item_grp_id);
// })
// });
// }

//////////////////////////////////////////chart account

// ///
// const db=require('./db/db');

// setTimeout(function(){

// async function app(){
// ////////////////////
// let getdata=await f_1();
// //console.log(getdata)
// /////////////////////////////
// for(let i in getdata){

// let update=await f_2(getdata[i]);
// }

// }
// app()

// }, 5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * FROM tbl_roster_duty_data_1 where roster_id='4'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise((resolve,reject)=>{
// let sql=`update tbl_roster_duty_data set ? where roster_id='3' and user_id='${data.user_id}'`;
// let post={
//     days_data:data.days_data
// }
// db.query(sql,post,(err,result)=>{
//     console.log(err)
// if(err)reject(err)
// else
// resolve(result);
// })
// });
// }
///////////////chart account
///
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("chartofaccount.xlsx");
// var ws=wb.Sheets["Corporate"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){
// const obj={
// glcodes:Arrays[i].glcodes,
// accounttype:Arrays[i].accounttype.trim(),
// name:Arrays[i].name.trim(),
// hotel_id:0,
// corp_id:2
// }
// let insert_post=await f_1(obj);

// }
// }
// app()

// }, 3000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_chart_account set ?`;
// let post={
//     chart_acc_name:data.name,
//     gl_code:data.glcodes,
//     chart_acc_type:data.accounttype,
//     hotel_id:data.hotel_id,
//     corp_id:data.corp_id,
//     chart_acc_status:"active",
// }
// db.query(sql,post,(err,result)=>{
//     console.log(err)
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////recipe
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Recipe Master"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// for(let i=0;i<=Arrays.length-1;i++){
// let get_recipe=await f_1();
// console.log(i)
// let name=Arrays[i].Recipe.trim()
// let check=await f_3(name)
// if(check.length==0){
// const obj={
// recipe_name:Arrays[i].Recipe.trim(),
// recipe_group_id:0,
// wt_per_portion:"NULL",
// gross_wt:"NULL",
// cos_recipe:Arrays[i].COS,
// portion:1,
// recipe_status:"active",
// major_group_id:"0",
// base_unit:"stk",
// vats:0,
// hotel_id:5,
// menu_major_grp_id:"0"
// }
// let post_recipe=await f_2(obj,get_recipe)
// if(post_recipe=='200'){
// //////
// let upadete=await f_4(get_recipe,get_recipe)
// }
// }
// else{
// console.log("no entry")
// }

// }
// }
// app()

// }, 10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_variable_count`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_recipe where recipe_name='${data}'`;
// db.query(sql,(err,result)=>{
// console.log(err)
// if(err)resolve("err")
// else resolve(result);
// })
// });
// }

// function f_4(data,datas){
// return new Promise((resolve,reject)=>{
// var codes="RCP";
// // I suppose databasevalue is a string
// var databasevalue =datas[0].recipe_no;
// var incrementvalue = (+databasevalue) + 1;
// incrementvalue = ("0000" + incrementvalue).slice(-4);
// var value=incrementvalue;
// let sql=`update tbl_variable_count set ? where recipe_no='${databasevalue}'`;
// let post={
// recipe_no:value
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve("200");
// })
// });
// }
//const moment=require('moment');
//console.log(moment(new Date("")).format("MM-DD-YY"));

//////////////////////////////////////////////////////////////////////////////////////////////////////////////vendor add
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("vendor.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[122]);

// async function app(){
// for(let i=122;i<=Arrays.length-1;i++){
// const obj={
// name:Arrays[i].name.trim(),
// ven_group:Arrays[i].ven_group,
// code:Arrays[i].code
// }
// let insert=await f_2(obj)
// ////
// //let check=await f_1(obj.name);
// // if(check.length==0){
// // let insert=await f_2(obj)
// // }else{
// //     console.log("dono")
// // }

// }
// }
// app()

// }, 10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_vendor where vendor_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,datas,calculatedData){
// return new Promise(function(resolve,reject){
// let sql="insert into tbl_vendor set ?";
// let post={
// vendor_code:data.code,
// vendor_name:data.name,
// group:data.ven_group,
// flag:1,
// password:"$2b$10$5WfF7weT6KzKpqKpwgHYw.ZeUoXNMJ.LU/dRHbepnGZZ4saYX/JQe",
// regn_status:"permanent"

// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)console.log(err);
// else
// resolve("200");
// })
// });
// }

//////////////////////////////////////////////////////////////////////////purchase register
// const db=require('./db/db');
// const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Purchase"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// //console.log(Arrays[0]);

// //console.log(g);
// //console.log(Arrays[86080])
// async function app(){
// for(let i =0;i<=Arrays.length-1;i++){

// ///////get vendcode
// let getven_1=await f_1(Arrays[i].Vendor_Code);
// if(getven_1.length>0){
// let delivery_date_1=new Date(Math.round((Arrays[i].del_date - 25569) * 86400 * 1000)).toISOString().substring(0, 10);
// let delivery_date_2=moment(new Date(delivery_date_1)).format("MM-DD-YY")

// let order_date=new Date(Math.round((Arrays[i].or_date - 25569) * 86400 * 1000)).toISOString().substring(0, 10)
// let order_date_2=moment(new Date(order_date)).format("MM-DD-YY")

// let invoice_date=new Date(Math.round((Arrays[i].Invoice_Date - 25569) * 86400 * 1000)).toISOString().substring(0, 10)
// let invoice__date_2=moment(new Date(invoice_date)).format("MM-DD-YY")

// console.log(Arrays[i].CC_store)
// let costname=await f_2(Arrays[i].CC_store.trim())

// let article=await f_3(Arrays[i].Art_no)
// if(article.length>0){
// let ob={
//     vendor_id:getven_1[0].vendor_id,
//     vendor_name:getven_1[0].vendor_name,
//     cost_centre_id:costname[0].costcenter_id,
//     cost_centre_name:costname[0].costcenter_name,
//     delivery_date:delivery_date_2,
//     order_no:Arrays[i].Order_no,
//     hotel_id:5,
//     invoice_no:Arrays[i].Invoice_nno,
//     article_id:article[0].article_id,
//     article_no:article[0].article_code,
//     article_name:article[0].article_name,
//     unit:Arrays[i].Unit,
//     qty:Arrays[i].QTY,
//     unit_price:Arrays[i].Price,
//     order_date:order_date_2,
//     old_article_no:Arrays[i].Art_no
//     }
//     console.log(i)
//     let insertDAta=await f_4(ob)

// }else{
//     console.log("No")
// }

// }

// }

// }
// app()
// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_vendor where vendor_code='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise(function(resolve,reject){
// let sql=`select * from tbl_cost_center where costcenter_name='${data}' and hotel_id='5'`;
// db.query(sql,function(err,result){
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise(function(resolve,reject){
// let sql=`select * from tbl_article where old_article_code='${data}'`;
// db.query(sql,function(err,result){
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_purchase_history set ?`;
// let post={
// vendor_id:data.vendor_id,
// vendor_name:data.vendor_name,
// cost_centre_id:data.cost_centre_id,
// cost_centre_name:data.cost_centre_name,
// delivery_date:data.delivery_date,
// order_no:data.order_no,
// hotel_id:data.hotel_id,
// invoice_no:data.invoice_no,
// article_id:data.article_id,
// article_no:data.article_no,
// article_name:data.article_name,
// unit:data.unit,
// qty:data.qty,
// unit_price:data.unit_price,
// order_date:data.order_date,
// old_article_no:data.old_article_no

// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////recipe component A
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Recipe Master"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// for(let i =0;i<=Arrays.length-1;i++){
// ////get recipe id
// let recipename=Arrays[i].Recipe.trim();
// let get_1=await f_1(recipename);

// if(Arrays[i].Type=='A'){

// let getArticleNo=await f_3(Arrays[i].articleno)
// if(getArticleNo.length>0){
// // if(Arrays[i].BU.trim()==getArticleNo[0].base_unit){
// // var base_unit_1=getArticleNo[0].base_unit
// // }else{
// //     var base_unit_1="a"
// // }
// var base_unit_1=getArticleNo[0].base_unit
// var comp_types="article";
// var comp_ids=getArticleNo[0].article_code

// }else{
// var comp_types="article";
// var comp_ids="NULL"
// var base_unit_1="NULL"
// }

// if(get_1.length>0){
// let obj={
// recipe_id:get_1[0].recipe_id,
// comp_type:comp_types,
// comp_id:comp_ids,
// pot_qty:Arrays[i].ACT_QTY,
// base_unit:base_unit_1,
// loss:0,
// act_qty:Arrays[i].ACT_QTY,
// pr_price:"NULL",
// cos_comp:0,
// wt_comp:Arrays[i].ACT_QTY,
// }
// //////insert data inside tbl_recioe componet
// console.log(i)
// let insert_copont=await f_2(obj)

// }else{
//     console.log(i)
// console.log("do nothing")
// }

// }

// else{
//     console.log(i)
//     console.log("recipe")
// }
// }
// }
// app()
// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_recipe where recipe_name="${data}"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_recipe_component set ?`;
// let post={
// recipe_id:data.recipe_id,
// comp_type:data.comp_type,
// comp_id	:data.comp_id,
// pot_qty:data.pot_qty,
// base_unit:data.base_unit,
// loss:data.loss,
// act_qty:data.act_qty,
// pr_price:data.pr_price,
// cos_comp:data.cos_comp,
// wt_comp:data.wt_comp,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_article where old_article_code='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////recipe component R
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Recipe Master"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// for(let i =0;i<=Arrays.length-1;i++){
// ////get recipe id
// let recipename=Arrays[i].Recipe.trim();
// let get_1=await f_1(recipename);

// if(Arrays[i].Type=='R'){
// let recipeNo=await f_3(recipename)
// if(recipeNo.length>0){
// var comp_types="recipe";
// var comp_ids=recipeNo[0].recipe_no
// }else{
// var comp_types="recipe";
// var comp_ids="NULL"
// }

// if(get_1.length>0){
// let obj={
// recipe_id:get_1[0].recipe_id,
// comp_type:comp_types,
// comp_id:comp_ids,
// pot_qty:Arrays[i].ACT_QTY,
// base_unit:'stk',
// loss:0,
// act_qty:Arrays[i].ACT_QTY,
// pr_price:"NULL",
// cos_comp:Arrays[i].COS,
// wt_comp:Arrays[i].ACT_QTY,
// }
// //////insert data inside tbl_recioe componet
// console.log(i)
// let insert_copont=await f_2(obj)

// }else{
//     console.log(i)
// console.log("do nothing")
// }
// }else{
//     console.log(i)
//     console.log("article")
// }

// }

// }
// app()
// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_recipe where recipe_name="${data}"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_recipe_component set ?`;
// let post={
// recipe_id:data.recipe_id,
// comp_type:data.comp_type,
// comp_id	:data.comp_id,
// pot_qty:data.pot_qty,
// base_unit:data.base_unit,
// loss:data.loss,
// act_qty:data.act_qty,
// pr_price:data.pr_price,
// cos_comp:data.cos_comp,
// wt_comp:data.wt_comp,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_recipe where recipe_name="${data}"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_article_price
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get article from tbl_artilce
// let get_article=await f_1()
// for(let i in get_article){
// /////get avg price
// let getavg=await f_3(get_article[i].article_id);
// console.log(getavg)
// if(getavg[0].AveragePrice==null){
// var avgprice=0

// }else{
// var avgprice=getavg[0].AveragePrice

// }
// console.log(i)
// //insert into tbl_article_price
// let insert=await f_2(get_article[i].article_id,get_article[i].article_code,avgprice,get_article[i].old_article_code)

// }

// }

// app()
// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_article`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(article_id,article_code,avgprice,olno){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_article_price set ?`;
// let post={
// article_id:article_id,
// article_no:article_code,
// price:avgprice,
// old_article_no:olno
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT AVG(unit_price) AS AveragePrice,old_article_no FROM tbl_purchase_history where article_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////update recipe component
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get article from tbl_article
// let get_article=await f_1()
// for(let i =0;i<=get_article.length-1;i++){
// ////
// if(get_article[i].last_purchase_price==0){
//     get_article[i].last_purchase_price=0
// }else{
// console.log(i)
// /////update tbl_recipe_component
// let uprecipe=await f_2(get_article[i].last_purchase_price,get_article[i].article_code);

// }
// }}
// app()
// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_article`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(price,article_no){
// let pr=parseFloat(price).toFixed(2)
// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe_component set ? where comp_id='${article_no}' and comp_type='article'`;
// let post={
// pr_price:pr
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT AVG(unit_price) AS AveragePrice FROM tbl_purchase_history where article_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////do cos component update by muliply
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get article from tbl_article_price
// let get_recipercomp=await f_1()
// for(let i =0;i<=get_recipercomp.length-1;i++){
// ///update tbl_recipe_component cos
// let upchar=parseFloat(get_recipercomp[i].pot_qty)*parseFloat(get_recipercomp[i].pr_price);
// console.log(i)
// let update_table=await f_2(get_recipercomp[i],upchar)

// }

// }

// app()
// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * FROM tbl_recipe_component WHERE pr_price<>"NULL"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,upchar){
// let pr=parseFloat(upchar).toFixed(2)
// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe_component set ? where comp_id='${data.comp_id}' and recipe_id='${data.recipe_id}'`;
// let post={
// cos_comp:pr
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////calculate cos of recipe
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get data from tbl_recipe
// let get_recipercomp=await f_1()
// //console.log(get_recipercomp)
// for(let i=0;i<=get_recipercomp.length-1;i++){
// let get_componetn=await f_3(get_recipercomp[i].recipe_id)
// console.log(get_componetn)

// if(get_componetn[0].cocomp==null){
// var cos= 0
// }else{
// var cos= parseFloat(get_componetn[0].cocomp).toFixed(2)
// }

// let wtcomp=await f_4(get_recipercomp[i].recipe_id)

// if(wtcomp[0].wtcomp==null){
// var grosswt= 0
// }else{
// var grosswt= parseFloat(wtcomp[0].wtcomp).toFixed(2)
// }

// ///////
// let wt_portion=parseFloat(grosswt).toFixed(2)
// console.log(wt_portion)
// console.log("wt_portion")
// //console.log(i)
// /////////update tbl_recipe
// let uprecipe=await f_2(get_recipercomp[i].recipe_id,cos,grosswt,wt_portion)

// }

// }

// app()
// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * FROM tbl_recipe`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(id,cos,grosswt,wt_portion){

// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe set ? where recipe_id ='${id}'`;
// let post={
// wt_per_portion:wt_portion,
// gross_wt:grosswt,
// cos_recipe:cos,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(cos_comp) as cocomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(wt_comp) as wtcomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////delete from recipe and component

// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get data from tbl_recipe
// let get_recipercomp=await f_1()
// console.log(get_recipercomp)
// //console.log(get_recipercomp)
// for(let i=0;i<=get_recipercomp.length-1;i++){
// ////////delete  from tbl_recipe
// let recipes=await f_3(get_recipercomp[i].recipe_id);
// let recipe=await f_2(get_recipercomp[i].recipe_id);

// }

// }

// app()
// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * FROM tbl_recipe_component WHERE comp_id="NULL"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){

// return new Promise(function(resolve,reject){
// let sql=`delete FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`delete  FROM tbl_recipe where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////recipe group
// const db=require('./db/db');
// // //const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("articledata.xlsx");
// var ws=wb.Sheets["Recipe Master"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// for(let i =0;i<=Arrays.length-1;i++){
// let recip_group=Arrays[i].recipe_group.trim();
// let get_recip_groupid=await f_1(recip_group)
// if(get_recip_groupid.length>0){
// //////let get recipe id
// let recipe_get=await f_3(Arrays[i].Recipe.trim())
// if(recipe_get.length>0){
// ////update in recipe
// console.log(i)
// let up=await f_2(recipe_get[0],get_recip_groupid[0].recipe_group_id)
// }else{
// console.log("no recipe")
// console.log(i)
// }

// }else{
//     console.log("no group")
// }

// }
// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_recipe_group where recipe_group_name="${data}"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe set ? where recipe_name ="${data.recipe_name}"`;
// let post={
// portion:data.portion
// }
// db.query(sql,post,function(err,result){

// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_recipe where recipe_name="${data}"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////revenue history table
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("revenue_history.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// // /console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Profit_Center_Code);
// if(getProfitcenterid.length>0){
// const obj={
// start_year:Arrays[i].Start_Year,
// end_year:Arrays[i].End_Year,
// hotel_id:5,
// corp_id:0,
// profit_center_id:getProfitcenterid[0].costcenter_id
// }

// let check=await f_3(obj.profit_center_id);
// if(check.length==0){
// ////insert into tbl_fnb_rev_history
// let insert=await f_2(obj)
// }
// else{
// console.log("no insert")
// }
// }
// }

// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_fnb_rev_history set ?`;
// let post={
// start_year:data.start_year,
// end_year:data.end_year,
// hotel_id:data.hotel_id,
// corp_id:data.corp_id,
// profit_center_id:data.profit_center_id
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_fnb_rev_history where profit_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////revenue history details
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("revenue_history.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Profit_Center_Code);
// if(getProfitcenterid.length>0){
// let check=await f_3(getProfitcenterid[0].costcenter_id);
// if(check.length>0){

// let getBugetheadId=await f_4(Arrays[i].Budget_Head.trim())
// if(getBugetheadId.length>0){
// var id =getBugetheadId[0].budget_head_id
// }else{
// var id =0
// }

// const obj={
// fnb_rev_hst_id:check[0].fnb_rev_hst_id,
// budget_head_id:id,
// month:Arrays[i].Month,
// year:Arrays[i].Year,
// amount:Arrays[i].Amount,
// covers:Arrays[i].Covers
// }
// ////insert into revenuew details
// let insert=await f_2(obj)
// }

// else{
// console.log("no insert")
// }
// }
// }

// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_fnb_rev_history_details set ?`;
// let post={
// fnb_rev_hst_id:data.fnb_rev_hst_id,
// budget_head_id:data.budget_head_id,
// month:data.month,
// year:data.year,
// amount:data.amount,
// covers:data.covers
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_fnb_rev_history where profit_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fnb op exp history
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("opexphistory.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Cost_Center_Code);
// if(getProfitcenterid.length>0){
// const obj={
// start_year:Arrays[i].Start_Year,
// end_year:Arrays[i].End_Year,
// hotel_id:5,
// corp_id:0,
// cost_center_id:getProfitcenterid[0].costcenter_id
// }

// let check=await f_3(obj.cost_center_id);
// if(check.length==0){
// ////insert into  tbl_fnb_opexp_history
// let insert=await f_2(obj)
// }
// else{
// console.log("no insert")
// }
// }
// }

// }
// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into  tbl_fnb_opexp_history set ?`;
// let post={
// start_year:data.start_year,
// end_year:data.end_year,
// hotel_id:data.hotel_id,
// corp_id:data.corp_id,
// cost_center_id:data.cost_center_id
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from  tbl_fnb_opexp_history where cost_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fnb op exp history details
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("opexphistory.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Cost_Center_Code);
// if(getProfitcenterid.length>0){
// let check=await f_3(getProfitcenterid[0].costcenter_id);
// if(check.length>0){

// let getBugetheadId=await f_4(Arrays[i].Budget_Head.trim())
// if(getBugetheadId.length>0){
// var id =getBugetheadId[0].budget_head_id
// }else{
// var id =0
// }

// const obj={
// fnb_opexp_hst_id:check[0].fnb_opexp_hst_id,
// budget_head_id:id,
// month:Arrays[i].Month,
// year:Arrays[i].Year,
// amount:Arrays[i].Amount

// }
// ////insert into tbl_fnb_opexp_history_details
// let insert=await f_2(obj)
// }

// else{
// console.log("no insert")
// }
// }
// }

// }
// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and  hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_fnb_opexp_history_details set ?`;
// let post={
// fnb_opexp_hst_id:data.fnb_opexp_hst_id,
// budget_head_id:data.budget_head_id,
// month:data.month,
// year:data.year,
// amount:data.amount

// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_fnb_opexp_history where cost_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////revenu fnb budget
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("revenu_budget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Profit_Center_Code);
// if(getProfitcenterid.length>0){
// const obj={
// start_year:Arrays[i].Start_Year,
// end_year:Arrays[i].End_Year,
// hotel_id:5,
// corp_id:0,
// profit_center_id:getProfitcenterid[0].costcenter_id,
// budget_fnb_rev_no:"NULL",
// create_date:"NULL",
// status:"active"
// }

// let check=await f_3(obj.profit_center_id);
// if(check.length==0){
// ////insert into tbl_budget_fnb_revenue
// let insert=await f_2(obj)
// }
// else{
// console.log("no insert")
// }
// }
// }
// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_budget_fnb_revenue set ?`;
// let post={
// start_year:data.start_year,
// end_year:data.end_year,
// hotel_id:data.hotel_id,
// corp_id:data.corp_id,
// profit_center_id:data.profit_center_id,
// budget_fnb_rev_no:data.budget_fnb_rev_no,
// create_date:data.create_date,
// status:data.status,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_fnb_revenue where profit_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////fnb budget revenue history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("revenu_budget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Profit_Center_Code);
// if(getProfitcenterid.length>0){
// let check=await f_3(getProfitcenterid[0].costcenter_id);
// if(check.length>0){

// let getBugetheadId=await f_4(Arrays[i].Budget_Head.trim())
// if(getBugetheadId.length>0){
// var id =getBugetheadId[0].budget_head_id
// }else{
// var id =0
// }
// const obj={
// exp_fnb_rev_id:check[0].budget_fnb_rev_id ,
// budget_head_id:id,
// month:Arrays[i].Month,
// year:Arrays[i].Year,
// exp_rev_amount:Arrays[i].Amount,
// covers:Arrays[i].Covers,

// }
// ////insert into e: tbl_budget_fnb_rev_details
// let insert=await f_2(obj)
// }

// else{
// console.log("no insert")
// }
// }
// }
// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into  tbl_budget_fnb_rev_details set ?`;
// let post={
// exp_fnb_rev_id:data.exp_fnb_rev_id,
// budget_head_id:data.budget_head_id,
// month:data.month,
// year:data.year,
// exp_rev_amount:data.exp_rev_amount,
// covers:data.covers

// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_fnb_revenue where profit_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////add cogs history
// const db=require('./db/db');

// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("cogs_history.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Cost_Center_Code);
// if(getProfitcenterid.length>0){
// const obj={
// start_year:Arrays[i].Start_Year,
// end_year:Arrays[i].End_Year,
// hotel_id:5,
// corp_id:0,
// cost_center_id:getProfitcenterid[0].costcenter_id,

// }

// let check=await f_3(obj.cost_center_id);
// if(check.length==0){
// ////insert into : tbl_fnb_cogs_history
// let insert=await f_2(obj)
// }
// else{
// console.log("no insert")
// }
// }
// }
// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_fnb_cogs_history set ?`;
// let post={
// start_year:data.start_year,
// end_year:data.end_year,
// hotel_id:data.hotel_id,
// corp_id:data.corp_id,
// cost_center_id:data.cost_center_id,

// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from  tbl_fnb_cogs_history where cost_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////add cogs history details
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("cogs_history.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){

// let getProfitcenterid=await f_1(Arrays[i].Cost_Center_Code);
// if(getProfitcenterid.length>0){
// let check=await f_3(getProfitcenterid[0].costcenter_id);
// if(check.length>0){

// let getBugetheadId=await f_4(Arrays[i].Budget_Head.trim())
// if(getBugetheadId.length>0){
// var id =getBugetheadId[0].budget_head_id
// }else{
// var id =0
// }
// const obj={
// fnb_cogs_hist_id:check[0].fnb_cogs_hist_id,
// budge_head_id:id,
// month:Arrays[i].Month,
// year:Arrays[i].Year,
// amount:Arrays[i].Amount

// }
// console.log(i)
// ////insert into tbl_fnb_cogs_history_details
// let insert=await f_2(obj)
// }

// else{
// console.log("no insert")
// }
// }
// }
// }
// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code="${data}" and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,id){
// return new Promise(function(resolve,reject){
// let sql=`insert into  tbl_fnb_cogs_history_details set ?`;
// let post={
// fnb_cogs_hist_id:data.fnb_cogs_hist_id,
// budge_head_id:data.budge_head_id,
// month:data.month,
// year:data.year,
// amount:data.amount,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_fnb_cogs_history where cost_center_id='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name='${data}' and hotel_id='5'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////calculate recipe component cos
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get data from tbl_recipe_cpmponent
// let get_recipercomp=await f_1()
// //console.log(get_recipercomp)
// for(let i=0;i<=get_recipercomp.length-1;i++){
// let get_recipe_cos=await f_3(get_recipercomp[i].comp_id)

// if(get_recipe_cos.length>0){
// var pr_price=get_recipe_cos[0].cos_recipe
// var cosIs=parseFloat(pr_price)*get_recipercomp[i].pot_qty
// }else{
// var pr_price=0
// var cosIs=parseFloat(pr_price)*get_recipercomp[i].pot_qty
// }

// /////////update tbl_recipe component
// let uprecipe=await f_2(get_recipercomp[i].recipe_id,pr_price,cosIs,get_recipercomp[i].comp_id)

// }

// }

// app()
// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * FROM tbl_recipe_component where comp_type='recipe'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(id,pr_price,cosIs,comid){

// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe_component set ? where recipe_id ='${id}' and comp_id='${comid}'`;
// let post={
// pr_price:pr_price,
// cos_comp:cosIs,

// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT *  FROM tbl_recipe where recipe_no='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(wt_comp) as wtcomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////calcuate recipe cos
// const db=require('./db/db');
// //const moment=require('moment')

// setTimeout(function(){

// async function app(){
// //////get data from tbl_recipe
// let get_recipercomp=await f_1()
// //console.log(get_recipercomp)
// for(let i=0;i<=get_recipercomp.length-1;i++){
// let get_componetn=await f_3(get_recipercomp[i].recipe_id)
// console.log(get_componetn)

// if(get_componetn[0].cocomp==null){
// var cos= 0
// }else{
// var cos= parseFloat(get_componetn[0].cocomp).toFixed(2)
// }

// let wtcomp=await f_4(get_recipercomp[i].recipe_id)

// if(wtcomp[0].wtcomp==null){
// var grosswt= 0
// }else{
// var grosswt= parseFloat(wtcomp[0].wtcomp).toFixed(2)
// }

// ///////
// let wt_portion=parseFloat(grosswt).toFixed(2)
// console.log(wt_portion)
// console.log("wt_portion")
// //console.log(i)
// /////////update tbl_recipe
// let uprecipe=await f_2(get_recipercomp[i].recipe_id,cos,grosswt,wt_portion)

// }
// }

// app()
// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * FROM tbl_recipe`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(id,cos,grosswt,wt_portion){

// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe set ? where recipe_id ='${id}'`;
// let post={
// wt_per_portion:wt_portion,
// gross_wt:grosswt,
// cos_recipe:cos,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(cos_comp) as cocomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(wt_comp) as wtcomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// kitchen need
//  const db=require('./db/db');
// const moment=require('moment')

// setTimeout(function(){

// async function app(){
// let Inhouse_dateIs="2020-06-03"
// let getinhousedata=await f_1(Inhouse_dateIs)
// console.log(getinhousedata)
// }

// app()
// },1000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT COUNT(a.nos_adult)  as co FROM tbl_osr_guest_inhouse as a WHERE  "${data}" BETWEEN  a.arrival_date  AND  a.departure_date`;
// console.log(sql)
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(id,cos,grosswt,wt_portion){

// return new Promise(function(resolve,reject){
// let sql=`update tbl_recipe set ? where recipe_id ='${id}'`;
// let post={
// wt_per_portion:wt_portion,
// gross_wt:grosswt,
// cos_recipe:cos,
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(cos_comp) as cocomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT sum(wt_comp) as wtcomp FROM tbl_recipe_component where recipe_id='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////guest laundry rate
// const db=require('./db/db');

// setTimeout(function(){

// async function app(){

// let getinhousedata=await f_1()
// for(let i in getinhousedata){
// let obj={linen_id:parseInt(getinhousedata[i].linen_id),laundry_service_id:4,cleaning_rate:0}
// let insert=await f_2(obj)
// }
// //console.table(getinhousedata)
// }

// app()
// },1000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`SELECT * from tbl_linen_master as a WHERE a.linen_type="Guest Linen - Gentleman" OR a.linen_type="Guest Linen - Ladies"`;
// console.log(sql)
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){

// return new Promise(function(resolve,reject){
// let sql=`insert into tbl_guest_laundry_rate set ?`;
// let post={
// linen_id:data.linen_id,
// laundry_service_id:data.laundry_service_id,
// cleaning_rate:0
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve(result);
// })
// });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////check it code
// const db=require('./db/db');
// const moment=require('moment')

// setTimeout(function(){

// async function app(){

// let value="A062120-01"
// let value="A062120-01"
// let getinhousedata=await query4(0,value,0)

// //console.table(getinhousedata)
// }

// app()
// },10000);

// function query4(data,pcode,value){
// return new Promise((resolve,reject)=>{
// let times= calcTime('dubai', '+4');
// var day = times.split("/");
// var dt = day[0];
// var mm = day[1];
// var yy = day[2].slice(2, 4);

// let codeIs=""
// /////////slice previous code
// if(pcode.length>0){
// let valueispr=pcode.split("-")[1]
// let splitis_month=pcode.split("-")[0].slice(1,3)
// let splitis_date=pcode.split("-")[0].slice(3,5)
// let splitis_year=pcode.split("-")[0].slice(5,7)
// let datecompare=splitis_month+"/"+splitis_date+"/"+splitis_year
// if(moment(new Date(datecompare)).format('MM/DD/Y')==moment(new Date()).format('MM/DD/Y')){
// var databasevalue = valueispr
// var incrementvalue = (+databasevalue) + 1;
// incrementvalue = ("00" + incrementvalue).slice(-2);
// codeIs="A-"+splitis_month+splitis_date+splitis_year+incrementvalue
// console.log(codeIs)
// }else{
// let cc="-01"
// codeIs="A"+dt+mm+yy+cc;

// }}else{
// let cc="-01"
// codeIs="A"+dt+mm+yy+cc;
// console.log(codeIs)
// }

// if(err)reject("err")
// else resolve(codeIs)
// })

// }

// function calcTime(city, offset) {
//     var d = (new Date());
//     var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
//     var nd = new Date(utc + (3600000*offset));
//     var times=nd.toLocaleString();
//     let newss=times.split("/");
//     let dd=newss[0];
//     let mm=newss[1];
//     if (dd < 10) {
//     dd = '0' + dd;
//     }
//     if (mm < 10) {
//     mm = '0' + mm;
//     }
//     return  newdate=dd+"/"+mm+"/"+newss[2]
//     }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_menu_majorgrp
// const db=require('./db/db');
// const { QueryCursor } = require('mongoose');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("Restaurant Menu.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){
// let getDAta=await f_1();
// let check=await f_4(Arrays[i].MAJORGROUPNAMEMASTER)
// if(check.length==0){
//     console.log(i)
// let insert_data=await f_2(Arrays[i],getDAta);
// var codes = "MJG";
// var databasevalue = getDAta[0].pos_majorgrp;
// var incrementvalue = (+databasevalue) + 1;
// incrementvalue = ("0000" + incrementvalue).slice(-4);
// var value = incrementvalue;
// var code = codes + incrementvalue;
// let update_varriable_count=await f_3(databasevalue,value);
// }else{
//     console.log(i)
// }
// }
// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_variable_count`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,datas){
// return new Promise(function(resolve,reject){
// var codes = "MJG";
// // I suppose databasevalue is a string
// var databasevalue = datas[0].pos_majorgrp;
// console.log(databasevalue);
// // coerce the previous variable as a number and add 1
// var incrementvalue = (+databasevalue) + 1;

// // insert leading zeroes with a negative slice
// incrementvalue = ("0000" + incrementvalue).slice(-4);
// var value = incrementvalue;
// var code = codes + incrementvalue;

// let sql=`insert into  tbl_menu_majorgrp set ?`;
// let post={
// menu_majorgrp_status:"active",
// menu_major_grp_name:data.MAJORGROUPNAMEMASTER,
// menu_major_grp_code:code
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data,datas){
// return new Promise((resolve,reject)=>{
// let sql = `update tbl_variable_count set ? where pos_majorgrp='${data}'`;
// let post = {
// pos_majorgrp: datas
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_menu_majorgrp where menu_major_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////family group
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("Restaurant Menu.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i in Arrays){
// let getDAta=await f_1();
// let check=await f_4(Arrays[i].FAMILYGROUPNAMEMASTER)
// if(check.length==0){
// let check_id=await f_5(Arrays[i].MAJORGROUPNAMEMASTER)
// let insert_data=await f_2(Arrays[i],getDAta,check_id);
// var databasevalue = getDAta[0].menu_family_grp_code;
// console.log(databasevalue);
// // coerce the previous variable as a number and add 1
// var incrementvalue = (+databasevalue) + 1;

// // insert leading zeroes with a negative slice
// incrementvalue = ("0000" + incrementvalue).slice(-4);
// var value = incrementvalue;

// let update_varriable_count=await f_3(databasevalue,value);
// }else{
// console.log(i)
// }
// }
// }
// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_variable_count`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,datas,id){
// return new Promise(function(resolve,reject){
// var codes = "FMG";
// // I suppose databasevalue is a string
// var databasevalue = datas[0].menu_family_grp_code;
// console.log(databasevalue);
// // coerce the previous variable as a number and add 1
// var incrementvalue = (+databasevalue) + 1;

// // insert leading zeroes with a negative slice
// incrementvalue = ("0000" + incrementvalue).slice(-4);
// var value = incrementvalue;
// var code = codes + incrementvalue;
// let sql = `insert into tbl_menu_familygrp set ?`;
// let post = {
// menu_family_grp_name: data.FAMILYGROUPNAMEMASTER,
// menu_family_grp_code: code,
// manu_family_grp_status: 'active',
// menu_major_grp_id:id[0].menu_major_grp_id
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data,datas){
// return new Promise((resolve,reject)=>{
//     let sql = `update tbl_variable_count set ? where menu_family_grp_code=${data}`;
//     let post = {
//     menu_family_grp_code: datas
//     }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_menu_familygrp where menu_family_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_menu_majorgrp where menu_major_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////res menu  item
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("Restaurant Menu.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i=0;i<=Arrays.length-1;i++){
// ////get menu family group id
// let menu_id_family=await f_1(Arrays[i].FAMILYGROUPNAMEMASTER)
// let profitcenter=await f_3(Arrays[i].NAME.trim())
// if(profitcenter.length==0){
// profitcenter[0].costcenter_id=0
// }
// console.log(i)
// /////insert data inside res_menu-item
// let insert=await f_2(Arrays[i],menu_id_family,profitcenter)

// }
// }

// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_menu_familygrp where menu_family_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,datas,id){
// return new Promise(function(resolve,reject){
// let sql = `insert into tbl_res_menu_item set ?`;
// let post = {
// res_menu_item_name: data.MENUITEMNAME1.trim(),
// res_menu_item_code: data.MENUITEMPOSREF,
// res_menu_item_price: data.PRICE,
// hotel_id:5,
// res_menu_item_status:"active",
// menu_family_grp_id:datas[0].menu_family_grp_id,
// profit_center_id:id[0].costcenter_id
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql = `SELECT * FROM tbl_cost_center AS a WHERE a.costcenter_name = "${data}" AND a.hotel_id = "5" and a.type='profitcenter'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_variable_count`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_menu_majorgrp where menu_major_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////qr code fo roomarea
// const db=require('./db/db');
// setTimeout(function(){

// async function app(){

// let array=['CMBD-RM','CMABATM-RM','CMAB2-RM','CMRAK-RM','CMSHJ']
// let array_1=[2,1,4,5,3]
// for(let i in array){
// ///////get data from tbl_room_area
// let get_data=await  f_1(array[i])
// for(let j in get_data){
// //////////////update table tbl_room_area
// let updateRoom_area=await f_2(get_data[j],array_1[i])
// }

// }

// }

// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_room_area where ra_code LIKE '%${data}%'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,datas){
// return new Promise(function(resolve,reject){
// let split=data.ra_code.split("-")[2]
// let sql = `update  tbl_room_area set ? where ra_id ='${data.ra_id }'`;
// let code=datas+"-"+split+"-"+0
// let post = {
// qr_code:code
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql = `SELECT * FROM tbl_cost_center AS a WHERE a.costcenter_name = "${data}" AND a.hotel_id = "5" and a.type='profitcenter'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_variable_count`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_menu_majorgrp where menu_major_grp_name='${data}'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////qr code for tbl_restaurant
// const db=require('./db/db');
// setTimeout(function(){

// async function app(){

// ///////get data from tbl_restaurant
// let get_data=await  f_1()
// for(let i in get_data){
// let update=await f_2(get_data[i])
// }

// }

// app()

// },10000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_restaurant`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data){
// return new Promise(function(resolve,reject){
// let sql = `update  tbl_restaurant set ? where res_id ='${data.res_id }'`;
// let code=data.hotel_id+"-"+0+"-"+data.res_id
// let post = {
// qr_code:code
// }
// db.query(sql,post,function(err,result){
// console.log(err)
// if(err)reject(err);
// else
// resolve("200");
// })
// });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////code for vendor
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("rak.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i=0;i<=Arrays.length-1;i++){
// let obj={
// vendor_code:Arrays[i].vendor_code,
// vendor_name:Arrays[i].Supplier.trim(),
// group:Arrays[i].Category.trim(),
// email:Arrays[i].Mail_Id.trim(),
// password:'$2b$10$5WfF7weT6KzKpqKpwgHYw.ZeUoXNMJ.LU/dRHbepnGZZ4saYX/JQe',
// status:'active',
// regn_status:'permanent',
// hotel_id:5,
// flag:1,
// gl_code:Arrays[i].Account_Code,
// contact_person:Arrays[i].contact_person,
// mob_no:Arrays[i].Contact_details
// }

// let insert=await f_1(obj)

// }
// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_vendor set ?`;
// let post={
// vendor_code:data.vendor_code,
// vendor_name:data.vendor_name,
// group:data.group,
// email:data.email,
// status:data.status,
// regn_status:data.regn_status,
// hotel_id:data.hotel_id,
// flag:data.flag,
// gl_code:data.gl_code,
// mob_no:data.mob_no,
// contact_person:data.contact_person
// }

// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////budgt head
// const db=require('./db/db');
// setTimeout(function(){

// async function app(){

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_vendor set ?`;
// let post={
// vendor_code:data.vendor_code,
// vendor_name:data.vendor_name,
// group:data.group,
// email:data.email,
// status:data.status,
// regn_status:data.regn_status,
// hotel_id:data.hotel_id,
// flag:data.flag,
// gl_code:data.gl_code,
// mob_no:data.mob_no,
// contact_person:data.contact_person
// }

// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_article update
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("Article Update.xlsx");
// var ws=wb.Sheets["Article Update"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i=0;i<=Arrays.length-1;i++){

// console.log(i)
// //let getarticle=await f_1(Arrays[i])
// let updagearticle=await f_2(Arrays[i])
// }
// }

// app()

// },10000);

// // function f_1(data){
// // return new Promise((resolve,reject)=>{
// // let sql=`select * from tbl_article where article_code='${data.article_code}'`;
// // db.query(sql,post,(err,result)=>{
// // if(err)reject(err)
// // else resolve(result);
// // })
// // });
// // }

////////////////////////////////////////////////////////////////////////////////////////calculation of lead time
// const db=require('./db/db');
// const moment=require('moment')
// setTimeout(function(){
// async function app(){
// let getArticle=await f_3();

// let filterdataIs=getArticle.filter((item)=>{
// //get date from 1 year
// let deldate=moment(new Date(item.delivery_date)).format('MM/DD/YYYY');
// let splits=deldate.split('/')[2];
// if(splits==2019){
// return item
// }
// });
// ////////year data

// ///calculation of avg lead time
// let getarticle=await f_1();
// for(let i in getarticle){
// let articledataall=filterdataIs.filter((item)=>{
// if(item.article_no==getarticle[i].article_code){
//     return item
// }
// });

// let qty=[];
// for(let h in articledataall){
// qty.push(parseInt(articledataall[h].qty))
// }

// let qtysum=qty.reduce((a, b) => a + b, 0);
// let consumptionrate=(qtysum/365).toFixed(2);

// let ledary=[]
// for(let m in articledataall){
// var dateFirst =moment(new Date(articledataall[m].delivery_date)).format('MM/DD/YYYY');
// var dateSecond =moment(new Date(articledataall[m].order_date)).format('MM/DD/YYYY');

// var startDate = Date.parse(dateFirst);
// var endDate = Date.parse(dateSecond);
// var timeDiff = startDate - endDate;
// var daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
// ledary.push(daysDiff)
// }

// let sumIs=ledary.reduce((a, b) => a + b, 0);
// let avgLeadTime=(sumIs/ledary.length).toFixed(2)

// ///////
// let min_soh=parseFloat((consumptionrate*(avgLeadTime+3))).toFixed(2)

// if(articledataall.length==0){
// avgLeadTime=0
// consumptionrate=0
// min_soh=2
// }
// if(min_soh==0){
// min_soh=2
// }

// let Object={conrate:consumptionrate,leadtime:avgLeadTime,min_soh:parseInt(min_soh),article_code_new:getarticle[i].article_code}
// let insertdatble=await f_4(Object)

// }

// }

// app()

// },15000);

// function f_3(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_purchase_history`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_article_consumption set ?`;
// let post={
// consmrate:data.conrate,
// leadtime:data.leadtime,
// min_soh:data.min_soh,
// article_code_new:data.article_code_new,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

/////////////////////////////////excel
// Require library
// var xl = require('excel4node');

// // Create a new instance of a Workbook class
// var wb = new xl.Workbook();

// // Add Worksheets to the workbook
// var ws = wb.addWorksheet('Sheet 1');
// var ws2 = wb.addWorksheet('Sheet 2');

// // Create a reusable style
// var style = wb.createStyle({
//   font: {
//     color: '#FF0800',
//     size: 15,
//   },
//   numberFormat: '$#,##0.00; ($#,##0.00); -',
// });

// ws.cell(8, 1)
// .string("#")

// wb.write('Excel.xlsx');

//////////////////////////////tbl_task_category
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("Task Role.xlsx");
// var ws=wb.Sheets["Sheet1"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){

// for(let i=0;i<=Arrays.length-1;i++){

// console.log(i)

// let insertData=await f_2(Arrays[i])
// }
// }

// app()

// },5000);

// function f_2(data){
//     console.log(data)
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_task_category set ?`;
// let post={
// task_category_role:data.Role,
// task_category_responsibilities:data.Responsibilities,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_rooms_rev_history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("room_budget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert
// let insert=await f_2(Arrays[i],get,check[0].rooms_rev_hst_id)
// }
// }
// else{
// //not insert tbl_rooms_rev_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
//     console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Profit_Center_Code}' and hotel_id="5" and type='profitcenter'`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_rev_history_details set ?`;
// let post={
// rooms_rev_hst_id:id,
// budget_head_id:budget[0].budget_head_id ,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_rooms_rev_history where profit_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_rev_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// profit_center_id:id.costcenter_id ,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_rooms  opex history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("roomsopx.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert
// let insert=await f_2(Arrays[i],get,check[0].rooms_opexp_hst_id)
// }else{
//     console.log(i)
// }

// }
// else{
// //not insert tbl_rooms_opexp_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
//     console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_opexp_history_details set ?`;
// let post={
// rooms_opexp_hst_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_rooms_opexp_history where cost_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_opexp_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// cost_center_id:id.costcenter_id,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_otherincome_rev_history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("other_income.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_otherincome_rev_history_details
// let insert=await f_2(Arrays[i],get,check[0].otherincome_rev_hst_id)
// }else{
// console.log(i)
// }

// }
// else{
// //not insert tbl_otherincome_rev_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Profit_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_otherincome_rev_history_details set ?`;
// let post={
// otherincome_rev_hst_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_otherincome_rev_history where profit_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_otherincome_rev_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// profit_center_id:id.costcenter_id,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_otherincome_opexp_history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("otheropx.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_otherincome_opexp_history_details
// let insert=await f_2(Arrays[i],get,check[0].otherincome_opexp_hst_id)
// }else{
// console.log(i)
// }

// }
// else{
// //not insert tbl_otherincome_opexp_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_otherincome_opexp_history_details set ?`;
// let post={
// otherincome_opexp_hst_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_otherincome_opexp_history where costcenter_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_otherincome_opexp_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// costcenter_id:id.costcenter_id,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////tbl_admin_opexp_history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("adminopx.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_admin_opexp_history_details
// let insert=await f_2(Arrays[i],get,check[0].admin_opexp_hst_id)
// }else{
// console.log(i)
// }

// }
// else{
// //not insert tbl_admin_opexp_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_admin_opexp_history_details set ?`;
// let post={
// admin_opexp_hst_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_admin_opexp_history where costcenter_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_admin_opexp_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// costcenter_id:id.costcenter_id,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////tbl_sm_opexp_history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("smopex.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_sm_opexp_history_details
// let insert=await f_2(Arrays[i],get,check[0].sm_opexp_hst_id)
// }else{
// console.log(i)
// }

// }
// else{
// //not insert tbl_admin_opexp_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_sm_opexp_history_details set ?`;
// let post={
// sm_opexp_hst_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_sm_opexp_history where costcenter_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_sm_opexp_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// costcenter_id:id.costcenter_id,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////tbl_pomec_opexp_history
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("pomec_opx.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_pomec_opexp_history_details
// let insert=await f_2(Arrays[i],get,check[0].pomec_opexp_hst_id)
// }else{
// console.log(i)
// }

// }
// else{
// //not insert tbl_pomec_opexp_history
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },15000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_pomec_opexp_history_details set ?`;
// let post={
// pomec_opexp_hst_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_pomec_opexp_history where costcenter_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_pomec_opexp_history set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// costcenter_id:id.costcenter_id,

// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
// ///////////////////////////////////////////////////////////////////////////////////////////past admin budg3et
//  const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("adminbudget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_admin_budget_details
// let insert=await f_2(Arrays[i],get,check[0].admin_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_admin_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_admin_budget_details set ?`;
// let post={
// admin_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_admin_budget where cost_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_admin_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// cost_center_id:id.costcenter_id,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// admin_budget_no:"ADPL09192001"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////////////////////////////past sm budg3et
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("smbudget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_sm_budget_details
// let insert=await f_2(Arrays[i],get,check[0].sm_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_admin_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_sm_budget_details set ?`;
// let post={
// sm_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_sm_budget where cost_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_sm_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// cost_center_id:id.costcenter_id,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// sm_budget_no:"SMPL09192001"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
///////////////////////////////////////////////////////////////////pomec budget data
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("pomecbudget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_pomec_budget_details
// let insert=await f_2(Arrays[i],get,check[0].pomec_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_pomec_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_pomec_budget_details set ?`;
// let post={
// pomec_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_pomec_budget where cost_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_pomec_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// cost_center_id:id.costcenter_id,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// pomec_budget_no:"PMPL09192001"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
// ////////////////////////////////////////////room budget revenue
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("roomrevbudget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_rooms_budget_details
// let insert=await f_2(Arrays[i],get,check[0].room_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_rooms_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_budget_details set ?`;
// let post={
// rooms_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_rooms_budget where profit_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// profit_center_id:id.costcenter_id,
// cost_center_id:12,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// plan_no_budget_room:"RMPL09192001"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
////////////////////////////////////////////room budget opex
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("roomopxbudget.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_rooms_budget_details
// let insert=await f_2(Arrays[i],get,check[0].room_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_rooms_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_budget_details set ?`;
// let post={
// rooms_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_rooms_budget where cost_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_rooms_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// cost_center_id:id.costcenter_id,
// profit_center_id:233,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// plan_no_budget_room:"RMPL09192001"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// ////////////////////////////////////////////other budget revenue
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("otherrev.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_oth_income_budget_details
// let insert=await f_2(Arrays[i],get,check[0].oth_income_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_rooms_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_oth_income_budget_details set ?`;
// let post={
// oth_income_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_oth_income_budget where profit_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_oth_income_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// profit_center_id:id.costcenter_id,
// cost_center_id:126,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// oth_budget_no:"OTPN09102006"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// ////////////////////////////////////////////other budget opex
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("othopex.xlsx");
// var ws=wb.Sheets["Sheet2"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i=0;i<=Arrays.length-1;i++){
// //get profitcenter
// let profitcentercode=await f_1(Arrays[i])
// if(profitcentercode.length>0){
// //check data
// let check=await f_3(Arrays[i],profitcentercode[0].costcenter_id)
// if(check.length>0){
// //get budget head
// let get=await f_4(Arrays[i]);
// if(get.length>0){
// //not insert tbl_oth_income_budget_details
// let insert=await f_2(Arrays[i],get,check[0].oth_income_budget_id)
// }else{
// console.log(Arrays[i])
// }

// }
// else{
// //not insert tbl_rooms_budget
// let insert=await f_5(Arrays[i],profitcentercode[0])
// }

// }

// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_cost_center where costcenter_code ='${data.Cost_Center_Code}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_2(data,budget,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_oth_income_budget_details set ?`;
// let post={
// oth_income_budget_id:id,
// budget_head_id:budget[0].budget_head_id,
// month:data.Month,
// year:data.Year,
// amount:data.Amount.toFixed(4),
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_3(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_oth_income_budget where cost_center_id ='${id}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_4(data){
// return new Promise((resolve,reject)=>{
// let sql=`select * from tbl_budget_head where budget_head_name ='${data.Budget_Head}' and hotel_id="5"`;
// db.query(sql,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }

// function f_5(data,id){
// return new Promise((resolve,reject)=>{
// let sql=`insert into tbl_oth_income_budget set ?`;
// let post={
// start_year:data.Start_Year,
// end_year:data.End_Year,
// hotel_id:"5",
// profit_center_id:id.costcenter_id,
// cost_center_id:126,
// corp_id:0,
// create_date:"09/19/2020",
// status:"active",
// oth_budget_no:"OTPN09102006"
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
// ////////////////////////////////////////////update article
// const db=require('./db/db');
// setTimeout(function(){
// var xlsx=require('xlsx');
// var wb=xlsx.readFile("rakartilce.xlsx");
// var ws=wb.Sheets["RAK CASA FINAL"];
// var data=xlsx.utils.sheet_to_json(ws);
// var Arrays=[...data];
// console.log(Arrays[0]);

// async function app(){
// try{
// for(let i in Arrays){
// //uupdate tbl-artilce
// let update=await f_1(Arrays[i])
// console.log(i)
// }
// }catch(err){
// console.log(err)
// }

// }

// app()

// },5000);

// function f_1(data){
// return new Promise((resolve,reject)=>{
// let sql=`update tbl_article set ? where article_code='${data.code}'`;
// let post={
// inventory_account:data.ina,
// expense_account:data.expac,
// }
// db.query(sql,post,(err,result)=>{
// if(err)reject(err)
// else resolve(result);
// })
// });
// }
