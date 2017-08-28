/**
 * Created by young on 2017-07-17.
 */
'use strict';
let router;
router = function (app, pool) {
    app.get('/', function (req, res) {
        res.render('index.html');
    });
    app.get('/getStudentList', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("SELECT * FROM `students` ORDER BY `umdx` desc, `student_num` asc;", [], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else {
                        //success
                        res.json({
                            'status': 'success',
                            'data': rs
                        })
                    }
                })
                con.release();
            }
        })
    });
    app.get('/findStudents', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                console.log(req.query.name);
                con.query('SELECT * FROM `students` WHERE `name` LIKE "%' + req.query.name + '%";', [], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else if (rs.length) {
                        //success
                        res.json({
                            'status': 'success',
                            'data': rs
                        })
                    } else {
                        res.json({
                            'status': 'empty'
                        })
                    }
                });
                con.release();
            }
        })
    });
    app.get('/getStudent', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("SELECT * FROM `students` WHERE `student_num` = ?", [req.query.student_num], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else if (rs.length) {
                        console.log(rs[0]);
                        //success
                        res.json({
                            'status': 'success',
                            'name': rs[0].name,
                            'idx': rs[0].idx,
                            'umdx': rs[0].umdx
                        })
                    } else {
                        //select empty
                        res.json({
                            'status': 'empty'
                        })
                    }
                });
                con.release();
            }
        })
    });
    app.get('/rentClear', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                res.json({
                    //connection error
                    'status': 'connection error'
                })
            } else {
                con.query("UPDATE `umbrellas` SET `status` = 0, `udx` = 0", [], function (e, rs) {
                    if (e) {
                        //TRUNCATE error
                        res.json({
                            'status': 'TRUNCATE ERROR'
                        })
                    } else {
                        con.query("UPDATE `students` SET `umdx` = 0, `date` = ''", [], function (e, rs) {
                            if (e) {
                                //UPDATE ERROR
                                res.json({
                                    'status': 'UPDATE ERROR'
                                })
                            } else {
                                res.json({
                                    'status': 'success',
                                    'message': "성공적으로 대여목록이 초기화되었습니다!"
                                })
                            }
                        });
                    }
                })
            }
            con.release();
        })
    });
    app.get('/sortStudents', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                let type = req.query.type;
                let sql = "";
                if (type === "num") {
                    sql = "SELECT * FROM `students` ORDER BY `student_num` " + req.query.gradeSc + ", `umdx` " + req.query.rentSc + ";"
                } else if (type === "umbrella") {
                    sql = "SELECT * FROM `students` ORDER BY `umdx` " + req.query.rentSc + ", `student_num` " + req.query.gradeSc + ";"
                }
                console.log(sql);
                con.query(sql, [], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else {
                        //success
                        res.json({
                            'status': 'success',
                            'data': rs
                        })
                    }
                })
            }
            con.release();
        })
    });
    app.get('/getRentList', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("SELECT `u`.`date`, `u`.`idx` as `udx`, `s`.`idx` as `sdx`, `s`.`name`, `s`.`student_num` FROM `umbrellas` as `u` INNER JOIN `students` as `s` ON `u`.`udx` = `s`.`idx` WHERE `status` <> 0;", [], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else {
                        //success
                        res.json({
                            'status': 'success',
                            'data': rs
                        })
                    }
                });
                con.release();
            }
        })
    });
    app.get('/returnRent', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("UPDATE `umbrellas` SET `status` = 0 WHERE `idx` = ?", [req.query.umdx], function (e, rs) {
                    if (e) {
                        //update error
                        res.json({
                            'status': 'update error'
                        });
                    } else {
                        con.query("SELECT `umdx` FROM `students` WHERE `student_num` = ?", [req.query.studentNum], function (e, rs) {
                            if (e) {
                                //select umdx error
                                res.json({
                                    'status': 'select umdx error'
                                });
                            } else {
                                let student_umbrellas = rs[0].umdx;
                                let remove_umbrella = req.query.umdx;
                                let umb = student_umbrellas.split("");
                                for (let i = 0; i < umb.length; i++) {
                                    if (remove_umbrella === umb[i]) {
                                        umb.splice(i - 2, 3);
                                        break;
                                    }
                                }
                                let result_umbrellas = "";
                                for (let i = 0; i < umb.length; i++) {
                                    result_umbrellas += umb[i];
                                }
                                con.query("UPDATE `students` SET `umdx` = ? WHERE `student_num` = ?", [result_umbrellas, req.query.studentNum], function (e, rs) {
                                    if (e) {
                                        //update error
                                        res.json({
                                            'status': 'update error'
                                        });
                                    } else {
                                        //success
                                        res.json({
                                            'status': 'success'
                                        });
                                    }
                                })
                            }
                        })
                    }
                });
            }
            con.release();
        })
    });
    app.get('/getUmbrellas', function (req, res) {
        pool.getConnection(function(e,con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("SELECT * FROM `umbrellas`", [], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else {
                        //success
                        console.log(rs);
                        res.json({
                            'status': 'success',
                            'data': rs
                        })
                    }
                });
                con.release();
            }
        })
    })
};
module.exports = router;