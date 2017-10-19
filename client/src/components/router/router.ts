import Vue from "vue";
import VueRouter, { RouterOptions } from "vue-router";
import { IUserService, UserService } from "../../services/authentication/userService";
import Routes from "./routes";

export default class Router {

  public constructor(private userService: IUserService = new UserService()) {
  }

  compile(): VueRouter {

    Vue.use(VueRouter);

    let router = new VueRouter(<RouterOptions>{
      mode: "history",
      routes: Routes,
      scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition;
        } else {
          return { x: 0, y: 0 };
        }
      }
    });

    router.beforeEach((to, from, next) => {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!this.userService.isAuthenticated
          || this.userService.sessionExpired) {
          next({ name: "signin", query: { redirectUri: to.fullPath } });

          return;
        }
      }

      // At this point we either don't require authentication or the user is authenticated
      if (to.matched.some(record => record.meta.requiresAuth && record.meta.requiresAdmin)) {
        if (!this.userService.isAdministrator) {
          next({ name: "unauthorized" });

          return;
        }
      }

      // Always make a call to next()
      next();
    });

    return router;
  }
}