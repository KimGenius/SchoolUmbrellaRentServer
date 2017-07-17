/**
 * Created by young on 2017-07-17.
 */
'use strict';
var router;
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
                con.query("SELECT * FROM `students` ORDER BY `umbrella` desc, `num` asc;", [], function (e, rs) {
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
                con.query("SELECT * FROM `students` WHERE `num` = ?", [req.query.num], function (e, rs) {
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
                        con.query("UPDATE `students` SET `umbrella` = 0, `date` = ''", [], function (e, rs) {
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
                    sql = "SELECT * FROM `students` ORDER BY `num` " + req.query.gradeSc + ", `umbrella` " + req.query.rentSc + ";"
                } else if (type === "umbrella") {
                    sql = "SELECT * FROM `students` ORDER BY `umbrella` " + req.query.rentSc + ", `num` " + req.query.gradeSc + ";"
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
                con.query(" SELECT * FROM `students` WHERE `umbrella` > 0 ORDER BY `umbrella` desc, `num` asc;", [], function (e, rs) {
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
};
module.exports = router;