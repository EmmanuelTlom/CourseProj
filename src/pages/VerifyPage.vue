<template>
  <div class="hold">
    <q-spinner v-if="loading" color="primary" size="3em" />

    <div v-if="!loading" class="text-center">
      <div class="text-h3">Payment Successful</div>
      <q-btn :to="{ name: 'user.overview' }" class="q-mt-md"> Go Home </q-btn>
    </div>
    <!-- <div v-if="!loading" class="text-h3">Payment Successful</div> -->
  </div>
</template>

<script>
import { useMyAuthStore } from "src/stores/auth";
let store = useMyAuthStore();
import axios from "axios";
export default {
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.getReference();
  },
  methods: {
    getReference() {
      let reference = this.$router.currentRoute.value.query.reference;
      // console.log(this.$router.currentRoute.value);
      fetch(
        `https://enroll-lms.qverselearning.com/api/v1/enroll/verify-payment?trxref=${reference}&reference=${reference}`,
        {
          method: "POST",
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request failed");
          }
          return response.json();
        })
        .then((data) => {
          // Handle the response data
          this.loading = false;

          // console.log(data);
          this.$q.notify({
            message: `Successful`,
            color: "green",
            position: "top",
          });

          this.getUser();
        })
        .catch((error) => {
          // Handle the error
          // console.log(error);
          this.$q.notify({
            message: "Error",
            color: "red",
            position: "bottom",
            actions: [{ icon: "close", color: "white" }],
          });
        });
    },

    async getUser() {
      try {
        const response = await axios.get(
          `https://enroll-lms.qverselearning.com/api/v1/student/all-students`
        );

        // users.value = response.data.users;
        // console.log(response);

        let value = response.data.users.find(
          (user) =>
            user.login === store.userdetails.login && user.is_enroll === 1
        );

        // console.log(value);

        if (value) {
          store.setUserDetailsDB(value);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.hold {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90vh;
}
</style>
