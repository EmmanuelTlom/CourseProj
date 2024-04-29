<template>
  <div class="wrapp">
    <div v-if="spin" class="spinner">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else class="top">
      <span class="title">
        <i class="fa-solid q-mr-sm fa-list"></i>
        Users | {{ arr.length }}
      </span>

      <div class="sort_area">
        <div class="left">
          <q-btn color="primary" no-caps no-wrap> All Users </q-btn>
        </div>

        <div class="right">
          <q-btn
            color="primary"
            no-wrap
            no-caps
            class="q-ma-sm"
            @click="createUser = true"
          >
            Create User
          </q-btn>
          <q-btn-dropdown v-model="value" class="sort_by_date" :label="sort">
            <q-list>
              <q-item
                clickable
                @click="sortValue('Latest - Oldest')"
                v-close-popup
              >
                <q-item-section>
                  <q-item-label>Latest - Oldest</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                @click="sortValue('Oldest - Latest')"
                v-close-popup
              >
                <q-item-section>
                  <q-item-label>Oldest - Latest</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </div>
    <div v-for="(user, index) in sortedUsers" :key="index">
      <Users @refresh="getUsers" :Users="user" />
    </div>
  </div>
  <q-dialog v-model="createUser">
    <q-card>
      <div class="auth">
        <form @submit.prevent="register" class="q-mb-lg">
          <div class="row q-pb-sm justify-between items-center">
            <div class="text5">Create user</div>

            <q-btn @click="createUser = false" flat no-caps>
              <img src="../../assets/circle.svg" alt="" />
            </q-btn>
          </div>
          <div class="form_hold">
            <div class="grid">
              <div class="input">
                <label for=""> First name* </label>

                <div class="input_wrap">
                  <input
                    v-model="data.first_name"
                    placeholder="Enter your first name"
                    type="text"
                    required
                    name="firstName"
                  />
                </div>
              </div>
              <div class="input">
                <label for="">Last name* </label>

                <div class="input_wrap">
                  <input
                    v-model="data.last_name"
                    placeholder="Enter your last name"
                    type="text"
                    required
                    name="lastName"
                  />
                </div>
              </div>
            </div>

            <div class="input">
              <label for=""> Email* </label>

              <div class="input_wrap">
                <input
                  v-model="data.email"
                  placeholder="Enter your email"
                  type="text"
                  required
                  name="email"
                />
              </div>
            </div>
            <div class="input">
              <label for=""> Username* </label>

              <div class="input_wrap">
                <input
                  v-model="data.login"
                  placeholder="Enter your username"
                  type="text"
                  required
                  name="username"
                />
              </div>
            </div>
            <div class="input">
              <label for=""> User Type* </label>

              <div class="input_wrap">
                <select v-model="data.user_type">
                  <option value="Learner-Type">Student</option>
                  <option value="Trainer-Type">Instructor</option>
                  <option value="Admin-Type">Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                </select>
              </div>
            </div>
            <div class="input">
              <label for=""> Password* </label>

              <div class="input_wrap no-wrap row justify-between items-center">
                <input
                  v-model="data.password"
                  placeholder="Create a password"
                  :type="!togglePass ? 'password' : 'text'"
                  required
                />
                <q-btn @click="togglePass = !togglePass" flat icon="visibility">
                </q-btn>
              </div>
            </div>

            <!-- <div class="input">
              <label for=""> Profile photo (optional) </label>
              <q-file
                class="column profile_field justify-center items-center"
                v-model="data.avatar"
              >
                <div class="img q-mb-sm">
                  <img src="../../assets/down.svg" alt="" />
                </div>
                <div class="text3">
                  <span>Click to upload</span>
                </div>

                <div class="text2 text-center">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </div>
              </q-file>
            </div> -->

            <div class="login_btn">
              <q-btn :loading="loading" type="submit" no-caps flat>
                Create User
              </q-btn>
            </div>
          </div>
        </form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import axios from "axios";
import { Notify } from "quasar";
import Users from "src/components/users/UsersComponent.vue";
import { ref, onMounted, computed } from "vue";
let value = ref(false);
let loading = ref(false);
let togglePass = ref(false);
let spin = ref(true);
let sort = ref("Latest - Oldest");
let arr = ref([]);
let data = ref({});
let createUser = ref(false);

let sortedUsers = computed(() => {
  const sorted = arr.value.slice().sort((a, b) => {
    const dateA = new Date(formatDate(a.created_on));
    const dateB = new Date(formatDate(b.created_on));

    if (sort.value === "Latest - Oldest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  return sorted;
});

const formatDate = (dateString) => {
  const parts = dateString.split(",")[0].trim();
  return parts.split("/").reverse().join("-");
};
const sortValue = (val) => {
  console.log(val);
  sort.value = val;
  // value.value = val;
};
const getUsers = async () => {
  spin.value = true;
  const response = await axios.get(`/api/api/v1/users`, {
    headers: {
      Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
    },
  });

  console.log(response);
  arr.value = response.data;
  spin.value = false;
};

const register = () => {
  let newData = {
    ...data.value,
  };
  // console.log("register");
  loading.value = true;
  const formData = new FormData();
  for (var key in newData) {
    formData.append(key, newData[key]);
  }

  loading.value = true;
  axios
    .post("/api/api/v1/usersignup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
      },
    })
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: "User successfully created",
        color: "green",
        position: "top",
      });
      loading.value = false;
      data.value = {};
      createUser.value = false;
      getUsers();
    })
    .catch(({ response }) => {
      console.log(response);
      loading.value = false;

      // errors.value = response.data.errors;
      Notify.create({
        message: response.data.error.message,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
onMounted(async () => {
  try {
    getUsers();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
.wrapp {
  margin: 2rem 1.5rem;
  padding-bottom: 2rem;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}

.sort_area {
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin: 0.8rem 0;
}

.sort_area .left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.sort_area .right .sort_by_date {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  background: #f3f3f3;
  border: 1px solid #c7c7c7;
  border-radius: 5px;
}

.sort_area .active {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  // width: 107px;
  height: 34px;
  text-align: center;
  color: #ffffff;
  background: #1f7bb5;
  border-radius: 17px;
}
.sort_area .regular {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #666666;
}

.sort_area .regular::before {
  box-shadow: none;
}

.sort_area .regular.boosted {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #ffffff;
  background: #03ae1e;
  border-radius: 17px;
}

.sort_area .right .q-btn {
  width: 215px;
  height: 34px;
}
.sort_area .right .q-btn::before {
  box-shadow: none;
}

@media (max-width: 450px) {
  .sort_area .right .q-btn {
    width: auto;
    height: 34px;
  }
}
</style>
