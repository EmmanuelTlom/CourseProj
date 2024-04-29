import { boot } from "quasar/wrappers";
import axios from "axios";
import loadStore from "stores/loader";
import { Notify, Dialog } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: process.env.baseURL })
// axios.defaults.baseURL = process.env.baseURL;
// axios.defaults.headers.common["Content-Type"] =
//   "application/json; charset=utf-8";
// axios.defaults.headers.common["Accept"] = "application/json";
// axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
const api = axios.create({
  // baseURL: "https://emmanueltlom.talentlms.com",

  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    apikey: "",
    Accept: "application/json",
    Authorization: `Basic ${btoa("p6j4bfpS2RDyPBm1bWLnZUxTYh7E5M")}`,
    // "Content-Type": "application/json; charset=utf-8",
    // "Access-Control-Allow-Credentials": "true",
    // "Access-Control-Allow-Origin": "*",
    // Authorization:
    //   "Bearer " + "sk_test_b97ba5a4246f3b366403c6751cc4cd97b57c7b7a",
  },
});

export default boot(({ app, store, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$store = loadStore;

  let auth = store.state.value.talent;
  // console.log(auth);
  // let auth = JSON.parse(localStorage.getItem("pinia_leegoluauth"));

  axios.interceptors.response.use(
    function (response) {
      // if (response.data && response.data.token) {
      //   token = response.data.token;
      // }
      // console.log(response);

      return response;
    },
    (e) => {
      console.log(e);
      let status_code = !e.response || e.response.status;
      console.log(status_code);
      if (status_code === 401) {
        Notify.create({
          message: "You need to log in to view this page",
          color: "red",
        });
        store.state.value.talent.previousRoute =
          router.currentRoute.value.fullPath;
        return router.replace({ name: "login" });
      } else if (
        status_code === 403 &&
        e.response.data.error.type === "api_error"
      ) {
        Dialog.create({
          title: "Limit Reached",
          message: `Sorry ${e.response.data.error.message}`,
          persistent: true,
        })
          .onOk(() => {
            router.replace({ name: "login" });
          })
          .onCancel(() => {
            // console.log('I am triggered on both OK and Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      } else if (e.message === "Network Error") {
        Notify.create({
          message: e.message + "check your internet connection",
          color: "red",
        });
      } else if (status_code === 500) {
        Notify.create({
          message:
            "This is not your fault, we have been notified and is currently fixing any issues.",
          color: "red",
        });
      } else {
        return Promise.reject(e);
      }
    }
  );

  api.interceptors.request.use(function (config) {
    // console.log(auth);
    if (auth.token) {
      config.headers.Authorization = "Bearer " + auth.token;
    }
    return config;
  });

  router.beforeEach((to, from, next) => {
    // const store = app.config.globalProperties.$store;

    if (to.name === "logout") {
      // console.log(store.state.value);
      // store.talent.logOut(store.talent.userdetails);
      // store.state.value.talent.token = "";
      // store.state.value.talent.userdetails = {};
      // localStorage.setItem("token", "");
      // localStorage.setItem("userdet", "");
      // console.log(store.state.value);
      let logoutdata = {
        user_id: store.state.value.talent.userdetails.id,
        next: "",
      };
      const formData = new FormData();
      for (var key in logoutdata) {
        formData.append(key, logoutdata[key]);
      }
      axios
        .post(`/api/api/v1/userlogout`, formData, {
          headers: {
            Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
          },
        })
        .then((response) => {
          console.log(response);
          router.replace({ name: "login" });
        })
        .catch(({ response }) => {
          console.log(response);
        });
      router.replace({ name: "login" });
    }

    // Continue with the navigation as is
    next();
  });

  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api };
