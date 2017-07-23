/**
 * Created by young on 2017-07-17.
 */
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
    });
    app.post('/addStudentList', function (req, res) {
        let data = req.body.asdf;
        let name = "";
        let bun = "";
        data = data.substring(1, data.length - 1);
        let query_str = "INSERT INTO `students`(`name`,`student_num`,`umdx`) VALUES";
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
                                    'status': "insert error<br/>" + query_str.substring(0, query_str.length - 1)
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

    app.post('/addRent', function (req, res) {
        console.log(req.body);
        pool.getConnection(function (e, con) {
            if (e) {
                //connection error
                res.json({
                    'status': 'connection error'
                });
            } else {
                con.query("UPDATE `umbrellas` SET `status` = 1 WHERE `idx` = ?", [req.body.umdx], function (e, rs) {
                    if (e) {
                        //umbrella update error
                        res.json({
                            'status': 'umbrella update error'
                        });
                    } else {
                        //success
                        con.query("UPDATE `students` SET `umdx` = ?, `date` = ? WHERE `students`.`idx` = ?;", [req.body.studentUmdx, req.body.date, req.body.idx], function (e, rs) {
                            if (e) {
                                //students update error
                                res.json({
                                    'status': 'students update error'
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

};
module.exports = router;