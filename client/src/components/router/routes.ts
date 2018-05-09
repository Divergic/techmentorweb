// These components are imported like this to ensure they are bundled into the entry bundle
import homeComponent from "../../pages/home/home.vue";
import searchComponent from "../../pages/search/search.vue";
import profileComponent from "../../pages/profile/profile.vue";

const conductComponent = () => import(/* webpackChunkName: "app.policy" */ "../../pages/conduct/conduct.vue");
const privacyComponent = () => import(/* webpackChunkName: "app.policy" */ "../../pages/privacy/privacy.vue");

const reportAbuseComponent = () => import(/* webpackChunkName: "app.public" */ "../../pages/reportabuse/reportabuse.vue");
const unauthorizedComponent = () => import(/* webpackChunkName: "app.public" */ "../../pages/unauthorized/unauthorized.vue");

const signInComponent = () => import(/* webpackChunkName: "app.auth" */ "../../pages/signin/signin.vue");

const accountProfileComponent = () => import(/* webpackChunkName: "app.profile" */ "../../pages/accountProfile/accountProfile.vue");

const adminComponent = () => import(/* webpackChunkName: "app.admin" */ "../../pages/admin/admin.vue");
const categoriesComponent = () => import(/* webpackChunkName: "app.admin" */ "../../pages/categories/categories.vue");
const approveComponent = () => import(/* webpackChunkName: "app.admin" */ "../../pages/approve/approve.vue");

const notFoundComponent = () => import(/* webpackChunkName: "app.public" */ "../../pages/notfound/notfound.vue");

let routes = [
    { name: "home", path: "/", component: homeComponent, meta: { signInTarget: "accountProfile" } },
    { name: "search", path: "/search", component: searchComponent, meta: { signInTarget: "accountProfile" } },
    { name: "profile", path: "/profiles/:id", component: profileComponent, meta: { signInTarget: "accountProfile" } },

    { name: "conduct", path: "/conduct/", component: conductComponent, meta: { signInTarget: "accountProfile" } },
    { name: "privacy", path: "/privacy/", component: privacyComponent, meta: { signInTarget: "accountProfile" } },
    
    { name: "reportabuse", path: "/reportabuse/", component: reportAbuseComponent, meta: { signInTarget: "accountProfile" } },
    { name: "unauthorized", path: "/unauthorized/", component: unauthorizedComponent, meta: { signOutToHome: true } },

    { name: "signin", path: "/signin/", component: signInComponent },

    { name: "accountProfile", path: "/profile/", component: accountProfileComponent, meta: { requiresAuth: true } },

    { name: "admin", path: "/admin/", component: adminComponent, meta: { requiresAuth: true, requiresAdmin: true } },
    { name: "categories", path: "/categories/", component: categoriesComponent, meta: { requiresAuth: true, requiresAdmin: true } },
    { name: "approve", path: "/categories/approve", component: approveComponent, meta: { requiresAuth: true, requiresAdmin: true } },

    { name: "notfound", path: "*", component: notFoundComponent, meta: { signInTarget: "accountProfile" } }
  ];

export default routes;
