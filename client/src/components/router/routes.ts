// declare var webpackDefine: any;

let homeComponent;
let conductComponent;
let profileComponent;
let notFoundComponent;
let signInComponent;

// if (webpackDefine.configuration === "debug") {
    homeComponent = require("../../pages/home/home.vue");
    conductComponent = require("../../pages/conduct/conduct.vue");
    profileComponent = require("../../pages/profile/profile.vue");
    notFoundComponent = require("../../pages/notfound/notfound.vue");
    signInComponent = require("../../pages/signin/signin.vue");
// }
// else {
//     homeComponent = require.ensure([], function(require) { return require("../../pages/home/home.vue"); }, "app");
//     conductComponent = require.ensure([], function(require) { return require("../../pages/conduct/conduct.vue"); }, "app.public");
//     profileComponent = require.ensure([], function(require) { return require("../../pages/profile/profile.vue"); }, "app.profile");
//     notFoundComponent = require.ensure([], function(require) { return require("../../pages/notfound/notfound.vue"); }, "app.public");
//     signInComponent = require.ensure([], function(require) { return require("../../pages/signin/signin.vue"); }, "app.auth");
// }
 
export default [
    { name: "home", path: "/", component: homeComponent, meta: { signInTarget: "profile" } },
    { name: "conduct", path: "/conduct/", component: conductComponent, meta: { signInTarget: "profile" } },
    { name: "signin", path: "/signin/", component: signInComponent },
    { name: "profile", path: "/profile/", component: profileComponent, meta: { requiresAuth: true } },
    { name: "notfound", path: "*", component: notFoundComponent, meta: { signInTarget: "profile" } }
  ];
