module.exports = function(req, res, next) {
    var isAzure = req.get("x-site-deployment-id"),
        isSsl = req.get("x-arr-ssl");

    if (isAzure && !isSsl) {
        return res.redirect(301, "https://" + req.get("host") + req.url);
    }

    next();
};