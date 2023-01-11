const express = require('express');
const app = express();
const stuff = require('../services/jwt.js');
const moment = require('moment');
const db = require('../db/db')
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');


app.post('/vcsapi/api/login/user_mobile', stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
        async function apps() {
            try {
                var email = req.body.email.trim().replace(/\s/g, "");
                let user_det = await checkUser(email);
                
                if(user_det.length > 0 && user_det[0].user_id){
                    req.session.email_id = user_det[0].user_id;
                    const passcode = user_det[0].passcode;
                    let us = await checkUserStatus(user_det[0].user_id);
                    if(us.length > 0){
                        let ubs =await checkUserLoginBlockStatus(user_det[0].user_id);
                        if(ubs.length > 0){
                            let checkRec=await checkRecruitee(user_det[0].user_id);
                            if(checkRec.length){
                            let checkregStatus=await checkRegStatus(user_det[0].user_id);
                            //console.log(checkregStatus,"+");
                            if(checkregStatus.length){ 
                            // let uAccess = await getUserAccess(user_det[0].user_id);
                                if (req.body.passcode === passcode) {
                                    res.json({
                                        message: "You are logged in",
                                        session: req.session.email_id,
                                        username: user_det[0].user_first_name,
                                        user_id: user_det[0].user_id,
                                        // u_access: uAccess
            
                                    });
                                } else {
                                    {
                                        res.json("username and passcode is not matched");
                                    }
                                }
                            }
                            else {
                                res.json("No username in database please signup first");
                            }
                        }
                        else {
                            res.json("No username in database please signup first");
                        }
                        
                            
                        }else{
                            res.json("user login is blocked");
                        }
                        
                    }else{
                        res.json("user status not active");
                    }
                   
                }else{
                    res.json("No username in database please signup first");
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

function checkRecruitee(rid) {
    return new Promise(function (resolve, reject) {
        let sql = `select * from tbl_recruitee where user_id=${rid}`;

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
function checkRegStatus(uid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_recruitee WHERE user_id ='${uid}' and registration_status="yes"`;
        db.query(sql, function (err, row, fields) {
            //console.log(sql,row)
            if (err) {
                reject(err)
               
            } else {
                resolve(row)
                // 
            }
        });
    })
}

function getUserAccess(uid) {
    return new Promise(function (resolve, reject) {
        
        let sql = `SELECT DISTINCT * 
        FROM tbl_user AS a 
        inner join tbl_user_access AS b ON a.user_id=b.user_id 
        inner join tbl_action as c on b.action_id=c.action_id 
        inner join tbl_submodule as d on d.submodule_id=c.submodule_id 
        inner join tbl_module as e on e.module_id=d.module_id   
        where a.user_id=${uid}  ORDER BY e.module_id,d.submodule_id,c.action_id `;
        
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
function checkUser(email) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_user WHERE email ='${email}' and user_type="recruitee" `;
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

function checkUserStatus(uid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}' and user_status="active" and user_type="recruitee"`;
                db.query(sql, function (err, row, fields) {
                    if (row.length > 0) {
                       resolve(row)
                    } else {
                        reject(err)
                        // 
                    }
                });
    })
}
function checkUserLoginBlockStatus(uid) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        var sql = `SELECT * FROM tbl_user WHERE user_id ='${uid}' and login_block_status="unblock" and user_type="recruitee"`;
                db.query(sql, function (err, row, fields) {
                    if (row.length > 0) {
                       resolve(row)
                    } else {
                        reject(err)
                        // 
                    }
                });
    })
}
app.get("/vcsapi/get/api/tbl/job/all/active/job", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
    async function apps() {
        try {
            let job  = await getallActiveJobs();
            res.json(job);
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
function getallActiveJobs() {
    return new Promise(function (resolve, reject) {
        
        let sql = `select count(*) as active_job_count from tbl_job 
                where job_status="open"`;
        
        db.query(sql,function (err, res) {
            if (err) {
                //console.log(err);
                reject(err)
            } else {
                resolve(res);
            }
        })
    })
}

app.get("/vcsapi/get/all/job/mob", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
    async function apps() {
        try {
            let job  = await getAllJob();
            for(let i=0;i<job.length;i++)
            {
                let getCount = await applied(job[i].job_id);
                    let getCount1 = await onboard(job[i].job_id);
                    let getCount2 = await sortlisted(job[i].job_id);
                    let getCount3 = await offered(job[i].job_id);
                    let getCount4 = await apl_acc(job[i].job_id);
                    let getCount5 = await hire(job[i].job_id);
                    let obj={
                        applied: getCount.length,
                        onboard: getCount1.length,
                        sortlisted: getCount2.length,
                        offered: getCount3.length,
                        offer_acc: getCount4.length,
                        hired: getCount5.length
                        }
                    let obj1={
                        applied: getCount,
                        onboard: getCount1,
                        sortlisted: getCount2,
                        offered: getCount3,
                        offer_acc: getCount4,
                        hired: getCount5
                        }
                    job[i]["count"]=obj;
                    job[i]["details"]=obj1;
            }
            //console.log(job);
            res.json(job);
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
function getAllJob() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select a.*,b.*,d.*,e.*,f.*,g.user_first_name AS job_post_by_first_name,g.user_middle_name AS job_post_by_middle_name,g.user_last_name AS job_post_by_last_name,
        h.user_first_name AS job_post_edit_by_first_name,h.user_middle_name AS job_post_edit_by_middle_name,h.user_last_name AS job_post_edit_by_last_name
        from tbl_job AS a INNER JOIN tbl_client AS b ON a.client_id=b.client_id 
        left join tbl_job_type AS d ON d.job_type_id=a.job_type
        left join tbl_position_type AS e ON e.position_type_id=a.position_type
        inner join tbl_system_name AS f ON f.system_name_id=a.system_name
        inner join tbl_user AS g ON g.user_id=a.job_post_by
        left join tbl_user AS h ON h.user_id=a.job_post_edit_by
        ORDER BY a.job_id DESC `;
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

app.get("/vcsapi/get/all/jobclient/mob", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
    async function apps() {
        try {
            let allclient  = await getAllClient();
            for(let i=0;i<allclient.length;i++)
            {
                let client  = await getAllJOBClient(allclient[i].client_id);
                allclient[i]["jobCount"]=client.length;
            }
           
            res.json(allclient);
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
function getAllClient() {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_client AS b  ORDER BY client_id DESC `;
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
app.post("/vcsapi/get/all/alljobclient/mob", stuff.verifyToken, stuff.verify, function (req, res) {
    if (verifys == "verify") {
    async function apps() {
        try {

            let getclient  = await getClient(req.body.client_id);
                let client  = await getAllJOBClient(getclient[0].client_id);
                client["details"]=getclient[0];
                for(let i=0;i<client.length;i++)
                {
                    // let jobbyid  = await getAllApplicantByJOb(client[i].job_id);
                    let getCount = await applied(client[i].job_id);
                    let getCount1 = await onboard(client[i].job_id);
                    let getCount2 = await sortlisted(client[i].job_id);
                    let getCount3 = await offered(client[i].job_id);
                    let getCount4 = await apl_acc(client[i].job_id);
                    let getCount5 = await hire(client[i].job_id);
                    let obj={
                    applied: getCount.length,
                    onboard: getCount1.length,
                    sortlisted: getCount2.length,
                    offered: getCount3.length,
                    offer_acc: getCount4.length,
                    hired: getCount5.length
                    }
                    client[i]["applicantdetails"]=obj;
                    let obj1={
                        applied: getCount,
                        onboard: getCount1,
                        sortlisted: getCount2,
                        offered: getCount3,
                        offer_acc: getCount4,
                        hired: getCount5
                        }
                        client[i]["details"]=obj1;
                }

            
            res.json(client);
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
function getAllJOBClient(id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select a.*,b.*,d.*,e.*,f.*,g.user_first_name AS job_post_by_first_name,g.user_middle_name AS job_post_by_middle_name,g.user_last_name AS job_post_by_last_name,
        h.user_first_name AS job_post_edit_by_first_name,h.user_middle_name AS job_post_edit_by_middle_name,h.user_last_name AS job_post_edit_by_last_name
        from tbl_job AS a INNER JOIN tbl_client AS b ON a.client_id=b.client_id 
        left join tbl_job_type AS d ON d.job_type_id=a.job_type
        left join tbl_position_type AS e ON e.position_type_id=a.position_type
        inner join tbl_system_name AS f ON f.system_name_id=a.system_name
        inner join tbl_user AS g ON g.user_id=a.job_post_by
        left join tbl_user AS h ON h.user_id=a.job_post_edit_by
        WHERE b.client_id=${id} ORDER BY job_id DESC `;
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

function getClient(id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_client AS b  WHERE b.client_id=${id}  `;
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

function getAllApplicantByJOb(id) {
    return new Promise(function (resolve, reject) {
        // //console.log("insert")
        let sql = `select * from tbl_job AS a INNER JOIN tbl_application AS b ON a.job_id=b.job_id WHERE b.job_id=${id} ORDER BY application_id DESC `;
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

function applied(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,c.* FROM tbl_application AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id where (a.application_stage="applied" OR a.application_stage="sort_listed" OR a.application_stage="offered" OR a.application_stage="rejected"
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired") AND a.job_id="${data}"`;
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

function onboard(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,c.*,e.* FROM tbl_application AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id 
        INNER JOIN tbl_onboarding AS e ON e.application_id=a.application_id
        where (a.application_stage="onboarding" OR a.application_stage="hired") AND a.job_id="${data}"`;
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

function hire(data) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT a.*,c.*,d.*,e.* FROM tbl_application AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id 
        INNER JOIN tbl_assignment As d ON d.application_id=d.application_id
        INNER JOIN tbl_onboarding AS e ON e.onboarding_id=d.onboarding_id
        where a.application_stage="hired" AND a.job_id="${data}"`;
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
        let sql = `SELECT a.*,c.* FROM tbl_application AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id where (a.application_stage="sort_listed" OR a.application_stage="offered" OR a.application_stage="rejected"
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired") AND a.job_id="${data}"`;
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
        let sql = `SELECT a.*,c.* FROM tbl_application AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id where (a.application_stage="offered"
        OR a.application_stage="offer_accepted" OR a.application_stage="offer_declined" OR a.application_stage="onboarding" OR a.application_stage="hired") AND a.job_id="${data}"`;
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
        let sql = `SELECT a.*,c.* FROM tbl_application AS a INNER JOIN tbl_recruitee AS b ON b.recruitee_id=a.recruitee_id INNER JOIN tbl_user AS c ON c.user_id=b.user_id where (a.application_stage="offer_accepted" OR a.application_stage="onboarding" OR a.application_stage="hired") AND a.job_id="${data}"`;
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

module.exports = app;