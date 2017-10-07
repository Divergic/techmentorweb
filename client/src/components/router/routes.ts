import homeComponent from "../../pages/home/home.vue";
import conductComponent from "../../pages/conduct/conduct.vue";
import profileComponent from "../../pages/profile/profile.vue";
import accountProfileComponent from "../../pages/accountProfile/accountProfile.vue";
import notFoundComponent from "../../pages/notfound/notfound.vue";
import signInComponent from "../../pages/signin/signin.vue";
import unauthorizedComponent from "../../pages/unauthorized/unauthorized.vue";
import adminComponent from "../../pages/admin/admin.vue";
import categoriesComponent from "../../pages/categories/categories.vue";

// let homeComponent;
// let conductComponent;
// let accountProfileComponent;
// let notFoundComponent;
// let signInComponent;
// let categoriesComponent;

// if (webpackDefine.configuration === "debug") {
    // homeComponent = require("../../pages/home/home.vue");
    // conductComponent = require("../../pages/conduct/conduct.vue");
    // accountProfileComponent = require("../../pages/accountProfile/accountProfile.vue");
    // notFoundComponent = require("../../pages/notfound/notfound.vue");
    // signInComponent = require("../../pages/signin/signin.vue");
    // categoriesComponent = require("../../pages/categories/categories.vue");
// }
// else {
//     homeComponent = require.ensure([], function(require) { return require("../../pages/home/home.vue"); }, "app");
//     conductComponent = require.ensure([], function(require) { return require("../../pages/conduct/conduct.vue"); }, "app.public");
//     accountProfileComponent = require.ensure([], function(require) { return require("../../pages/accountProfile/accountProfile.vue"); }, "app.profile");
//     notFoundComponent = require.ensure([], function(require) { return require("../../pages/notfound/notfound.vue"); }, "app.public");
//     signInComponent = require.ensure([], function(require) { return require("../../pages/signin/signin.vue"); }, "app.auth");
//     categoriesComponent = require.ensure([], function(require) { return require("../../pages/categories/categories.vue"); }, "app.admin");
// }
let routes = [
    { name: "home", path: "/", component: homeComponent, meta: { signInTarget: "accountProfile" } },
    { name: "conduct", path: "/conduct/", component: conductComponent, meta: { signInTarget: "accountProfile" } },
    { name: "profile", path: "/profiles/:id", component: profileComponent, meta: { signInTarget: "accountProfile" } },
    { name: "unauthorized", path: "/unauthorized/", component: unauthorizedComponent, meta: { signOutToHome: true } },
    { name: "signin", path: "/signin/", component: signInComponent },
    { name: "accountProfile", path: "/profile/", component: accountProfileComponent, meta: { requiresAuth: true } },
    { name: "admin", path: "/admin/", component: adminComponent, meta: { requiresAuth: true, requiresAdmin: true } },
    { name: "categories", path: "/categories/", component: categoriesComponent, meta: { requiresAuth: true, requiresAdmin: true } },
    { name: "notfound", path: "*", component: notFoundComponent, meta: { signInTarget: "accountProfile" } }
  ];

//   declare var webpackDefine: any;
  
// TODO: Figure out how to include this only in a local environment build
// import devComponent from "../../pages/dev/dev.vue";

// if (webpackDefine.environment === "local") {
//     const devRoute = { name: "dev", path: "/dev/", component: devComponent, meta: { signInTarget: "accountProfile" } };

//     routes.push(devRoute);
// }

export default routes;
