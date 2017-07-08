'use strict';
var router = function (app, pool) {
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
    app.get('/', function (req, res) {
        res.render('index.html')
        console.log("sadf")
    })
}
module.exports = router;