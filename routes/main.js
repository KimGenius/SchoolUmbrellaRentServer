module.exports = function (app, pool) {
    require("./post")(app, pool);
    require("./get")(app, pool);
}