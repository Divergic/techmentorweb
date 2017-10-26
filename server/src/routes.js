const express = require("express");
const serveStatic = require("serve-static");
const mime = require("mime-types");

const router = express.Router();

router.head("/", function (req, res) {
    res.send("Success");
});

router.get("*.map", function (req, res) {
    res.status(403);
    
    if (req.accepts("html")) {
        // respond with html page
        res.send("403: Forbidden");
    }
    else if (req.accepts("json")) {
        // respond with json
        res.send({ error: "Forbidden" });
    }
    else {
        // default to plain-text. send()
        res.type("txt").send("Forbidden");
    }
});

const staticConfig = {
    setHeaders: function(res, path, stat) {
        var contentType = mime.lookup(path);

        if (!contentType){
            res.setHeader("content-type", contentType);
        }
    }
};

// Allow static access to the following folders
router.use("/content", serveStatic(__dirname + "/content", staticConfig));
router.use("/images", serveStatic(__dirname + "/images", staticConfig));
router.use("/scripts", serveStatic(__dirname + "/scripts", staticConfig));
router.use("/views", serveStatic(__dirname + "/views", staticConfig));

// Any other request gets the website
router.use(function (req, res, next) {
    
    // If the request is for one of the static paths then we should return a 404 instead
    if (req.url.indexOf("/content/") > -1
        || req.url.indexOf("/images/") > -1
        || req.url.indexOf("/scripts/") > -1
        || req.url.indexOf("/views/") > -1)
    {
        res.status(404);
        
        if (req.accepts("html")) {
            // respond with html page
            res.send("404: Page not Found");
        }
        else if (req.accepts("json")) {
            // respond with json
            res.send({ error: "Not found" });
        }
        else {
            // default to plain-text. send()
            res.type("txt").send("Not found");
        }
    }
    else {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile("index.html", { root: __dirname });
    }
});

module.exports = router;