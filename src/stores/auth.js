import { defineStore } from "pinia";
import { Notify } from "quasar";

export const useMyAuthStore = defineStore("talent", {
  state: () => ({
    token: "",
    userdetails: {},
    userdetailsData: {},
    previousRoute: "",
    loginKey: "",
  }),
  getters: {
    registrationForm: (state) => state.userdetails,
  },
  actions: {
    setUserDetails(data) {
      const user = data;
      // console.log(data);
      // localStorage.setItem("token", token);
      localStorage.setItem("userdet", JSON.stringify(user));
      this.userdetails = data;
      // console.log("here");
      // this.token = data.login_key;
    },
    setUserDetailsDB(data) {
      const user = data;
      // console.log(data);
      // localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      this.userdetailsData = data;
      // this.token = data.login_key;
    },

    logOut() {
      // console.log(response);
      this.token = null;
      this.userDetails = null;
      localStorage.setItem("token", "");
      localStorage.setItem("userdet", "");
    },
  },
});
