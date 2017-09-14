import homeComponent from "../../pages/home/home.vue";
import conductComponent from "../../pages/conduct/conduct.vue";
import profileComponent from "../../pages/profile/profile.vue";
import notFoundComponent from "../../pages/notfound/notfound.vue";
import signInComponent from "../../pages/signin/signin.vue";
import unauthorizedComponent from "../../pages/unauthorized/unauthorized.vue";
import adminComponent from "../../pages/admin/admin.vue";
import categoriesComponent from "../../pages/categories/categories.vue";

// declare var webpackDefine: any;

// let homeComponent;
// let conductComponent;
// let profileComponent;
// let notFoundComponent;
// let signInComponent;
// let categoriesComponent;

// if (webpackDefine.configuration === "debug") {
    // homeComponent = require("../../pages/home/home.vue");
    // conductComponent = require("../../pages/conduct/conduct.vue");
    // profileComponent = require("../../pages/profile/profile.vue");
    // notFoundComponent = require("../../pages/notfound/notfound.vue");
    // signInComponent = require("../../pages/signin/signin.vue");
    // categoriesComponent = require("../../pages/categories/categories.vue");
// }
// else {
//     homeComponent = require.ensure([], function(require) { return require("../../pages/home/home.vue"); }, "app");
//     conductComponent = require.ensure([], function(require) { return require("../../pages/conduct/conduct.vue"); }, "app.public");
//     profileComponent = require.ensure([], function(require) { return require("../../pages/profile/profile.vue"); }, "app.profile");
//     notFoundComponent = require.ensure([], function(require) { return require("../../pages/notfound/notfound.vue"); }, "app.public");
//     signInComponent = require.ensure([], function(require) { return require("../../pages/signin/signin.vue"); }, "app.auth");
//     categoriesComponent = require.ensure([], function(require) { return require("../../pages/categories/categories.vue"); }, "app.admin");
// }
 
export default [
    { name: "home", path: "/", component: homeComponent, meta: { signInTarget: "profile" } },
    { name: "conduct", path: "/conduct/", component: conductComponent, meta: { signInTarget: "profile" } },,
    { name: "unauthorized", path: "/unauthorized/", component: unauthorizedComponent, meta: { signOutToHome: true } },
    { name: "signin", path: "/signin/", component: signInComponent },
    { name: "profile", path: "/profile/", component: profileComponent, meta: { requiresAuth: true } },
    { name: "admin", path: "/admin/", component: adminComponent, meta: { requiresAuth: true, requiresAdmin: true } },
    { name: "categories", path: "/categories/", component: categoriesComponent, meta: { requiresAuth: true, requiresAdmin: true } },
    { name: "notfound", path: "*", component: notFoundComponent, meta: { signInTarget: "profile" } }
  ];
