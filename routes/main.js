'use strict';
var router;
router = function (app, pool) {
    console.log(router);
    app.post('/user/login', function (req, res) {
        let data = req.body;
        console.log(data);
        pool.getConnection(function (e, con) {
            if (!e) {
                con.query('select * from `user` WHERE `id` = ? AND `pw` = ?;', [data.id, data.pw], function (e, rs) {
                    console.log(rs);
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
                console.log(name);
            } else {
                bun = value.substring(0, value.length - 1);
                query_str += "('" + name + "','" + bun + "',0),";
                console.log(bun);
            }
        });
        console.log(query_str.substring(0, query_str.length - 1));

        pool.getConnection(function (e, con) {
            if (!e) {
                con.query("TRUNCATE TABLE `students` ;", [], function (e, rs) {
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
    })
};
module.exports = router;