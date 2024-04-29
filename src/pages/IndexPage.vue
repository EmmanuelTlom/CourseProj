<template>
  <q-page class="flex flex-center">
    <!-- <div class="text-h4">Sign Up</div> -->
    <form @submit.prevent="login">
      <div>
        <!-- <label>First name:</label> -->
        <q-input v-model="data.first_name" label="First name" />
      </div>
      <div>
        <!-- <label>Last name:</label> -->
        <q-input v-model="data.last_name" label="Last name" />
      </div>
      <div>
        <!-- <label>Email</label> -->
        <q-input v-model="data.email" label=" Email" />
      </div>
      <div>
        <!-- <label>Login</label> -->
        <q-input v-model="data.login" label="Username" />
      </div>
      <!-- <input v-model="data.username" type="text" /> -->
      <!-- <label>Password:</label> -->
      <q-input v-model="data.password" label="Password" />
      <!-- <input v-model="data.password" type="password" /> -->
      <div class="q-mt-lg">
        <q-btn :loading="loading" type="submit">Login</q-btn>
      </div>
    </form>
  </q-page>
</template>

<script setup>
import { Notify } from "quasar";
import { api, axios } from "src/boot/axios";
import { onMounted, ref } from "vue";
let data = ref({
  user_type: "Learner-Type",
});

let loading = ref(false);

const login = async () => {
  try {
    loading.value = true;
    const response = await axios.post(`/api/api/v1/usersignup`, data.value, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
      },
    });
    console.log(response);
    loading.value = false;
    Notify.create({
      message: "User successfully created",
      color: "green",
      position: "top",
    });

    data.value = {
      user_type: "Learner-Type",
    };
  } catch ({ response }) {
    console.log(response);
    loading.value = false;
    Notify.create({
      message: response.data.error.message,
      color: "red-3",
      position: "top",
    });
  }
};
// onMounted(async () => {
//   try {
//     // loadingDelete.value = true;
//     const response = await axios.get(`/api/api/v1/users`, {
//       headers: {
//         Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
//       },
//     });
//     const response2 = await axios.get(
//       `/api/api/v1/getcustomregistrationfields`,
//       {
//         headers: {
//           Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
//         },
//       }
//     );
//     console.log(response);
//     console.log(response2);
//   } catch (error) {
//     console.error(error);
//   }
// });
</script>

<style scoped>
form {
  width: 100%;
  max-width: 500px;
}
</style>
