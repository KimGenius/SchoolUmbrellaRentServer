'use strict';
var router;
router = function (app, pool) {
    app.post('/user/login', function (req, res) {
        let data = req.body;
        pool.getConnection(function (e, con) {
            if (!e) {
                con.query('select * from `user` WHERE `id` = ? AND `pw` = ?;', [data.id, data.pw], function (e, rs) {
                    if (!e && rs.length) {
                        res.json({
                            'status': "true",
                            'idx': rs[0].idx,
                            'id': rs[0].id,
                            'name': rs[0].name
                        });
                    } else {
                        res.json({
                            'status': "false"
                        });
                    }
                });
            } else {
                res.json({
                    'status': "false"
                });
            }
            con.release();
        })
    })
    app.post('/addStudentList', function (req, res) {
        var data = req.body.asdf;
        var name = "";
        let bun = "";
        data = data.substring(1, data.length - 1);
        let query_str = "INSERT INTO `students`(`name`,`num`,`umbrella`) VALUES";
        data.split(',').forEach(function (value, index) {
            if (index % 2 === 0) {
                name = value.substring(2, value.length - 1);
            } else {
                bun = value.substring(0, value.length - 1);
                query_str += "('" + name + "','" + bun + "',0),";
            }
        });

        pool.getConnection(function (e, con) {
            if (!e) {
                con.query("TRUNCATE TABLE `students`;", [], function (e, rs) {
                    if (!e) {
                        con.query(query_str.substring(0, query_str.length - 1), [], function (e, rs) {
                            if (e) {
                                //insert error
                                res.json({
                                    'status': "insert error"
                                });
                            } else {
                                //success
                                res.json({
                                    'status': "true"
                                });
                            }
                        });
                    } else {
                        //delete error
                        res.json({
                            'status': "delete error"
                        });
                    }
                });
            } else {
                //connection error
                res.json({
                    'status': "connection error"
                });
            }
            con.release();
        });
    });
    app.get('/', function (req, res) {
        res.render('index.html');
    });
    app.post('/getStudentList', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("SELECT * FROM `students`", [], function (e, rs) {
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
    app.post('/findStudent', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                console.log(req.body.name);
                con.query('SELECT * FROM `students` WHERE `name` LIKE "%' + req.body.name + '%";', [], function (e, rs) {
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
    app.post('/getStudent', function (req, res) {
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("SELECT * FROM `students` WHERE `num` = ?", [req.body.num], function (e, rs) {
                    if (e) {
                        //select error
                        res.json({
                            'status': 'select error'
                        });
                    } else if (rs.length) {
                        //success
                        res.json({
                            'status': 'success',
                            'name': rs[0].name,
                            'idx': rs[0].idx,
                            'umbrella': rs[0].umbrella
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
    app.post('/addRent', function (req, res) {
        console.log(req.body);
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("INSERT INTO `rents` (`sdx`, `date`) VALUES (?, ?);", [req.body.idx, req.body.date], function (e, rs) {
                    if (e) {
                        //insert error
                        res.json({
                            'status': 'insert error'
                        });
                    } else {
                        //success
                        con.query("UPDATE `students` SET `umbrella` = ? WHERE `students`.`idx` = ?;", [(parseInt(req.body.umbrella) + 1), req.body.idx], function (e, rs) {
                            if (e) {
                                //update error
                                res.json({
                                    'status': 'update error'
                                })
                            } else {
                                //success
                                res.json({
                                    'status': 'success'
                                })
                            }
                        })
                    }
                });
            }
            con.release();
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
                con.query("TRUNCATE `rents`", [], function (e, rs) {
                    if (e) {
                        //TRUNCATE error
                        res.json({
                            'status': 'TRUNCATE ERROR'
                        })
                    } else {
                        con.query("UPDATE `students` SET `umbrella` = 0", [], function (e, rs) {
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
    })
};
module.exports = router;