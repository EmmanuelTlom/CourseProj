<template>
  <q-layout>
    <div class="pricing overflow-hidden">
      <div class="left">
        <div class="header">
          <div class="logo">
            <q-btn class="" flat no-wrap no-caps>
              <div class="row items-center no-wrap">
                <div class="logo_img">
                  <img src="../../assets/dot.svg" alt="" />
                </div>
              </div>
            </q-btn>
          </div>
        </div>
        <div class="sectionMain_text">Sign up</div>
        <div class="btn_toggle">
          <div>
            <q-btn
              @click="setVal('Learner-Type')"
              no-caps
              :class="setrole === 'Learner-Type' ? 'active' : ''"
              flat
            >
              Student
            </q-btn>
            <!-- <q-btn
              @click="setVal('Trainer-Type')"
              no-caps
              :class="setrole !== 'student' ? 'active' : ''"
              flat
            >
              I’m a lecturer
            </q-btn> -->
          </div>
        </div>

        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="register" class="q-mt-lg">
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
                <!-- <div class="input">
                  <label for=""> Department </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="department"
                      name="department"
                    >
                      <option value="" disabled selected>
                        Select your class
                      </option>
                      <option
                        v-for="(studentClasse, index) in studentClasses
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))"
                        :key="index"
                        :value="studentClasse.name"
                      >
                        {{ studentClasse.name }}
                      </option>
                    </select>
                  </div>
                </div> -->

                <!-- <div class="input">
                  <label v-if="setrole === 'Learner-Type'" for="">
                    Registration number*
                  </label>
                  <label v-else for=""> Registration Code* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.regNoOrCode"
                      :placeholder="
                        setrole === 'student'
                          ? 'Enter your registration number'
                          : 'Enter your secret lecturer code'
                      "
                      type="text"
                      required
                      name="registrationNo"
                    />
                  </div>
                </div> -->
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
                <!-- <div class="input">
                  <label for=""> Reg Number* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.reg_number"
                      placeholder="Enter your reg. no"
                      type="text"
                      required
                      name="regno"
                    />
                  </div>
                </div> -->
                <div class="input">
                  <label for=""> Phone* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.phone"
                      placeholder="Enter your phone"
                      type="text"
                      required
                      name="phone"
                    />
                  </div>
                </div>
                <div class="input">
                  <label for=""> Password* </label>

                  <div
                    class="input_wrap no-wrap row justify-between items-center"
                  >
                    <input
                      v-model="data.password"
                      placeholder="Create a password"
                      :type="!togglePass ? 'password' : 'text'"
                      required
                    />
                    <q-btn
                      @click="togglePass = !togglePass"
                      flat
                      icon="visibility"
                    >
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
                      <span>Click to upload</span> or drag and drop
                    </div>

                    <div class="text2 text-center">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </div>
                  </q-file>
                </div> -->

                <div class="q-pt-lg login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Sign up
                  </q-btn>
                </div>

                <div class="no_acc text-center q-mt-lg">
                  Already have an account?
                  <router-link :to="{ name: 'login' }"> Login </router-link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="right auth">
        <img
          v-if="setrole === 'Learner-Type'"
          src="../../assets/stud.jpg"
          alt=""
        />
        <q-carousel
          v-if="setrole === 'lecturer'"
          animated
          v-model="slide"
          arrows
          :autoplay="10000"
          navigation
          infinite
        >
          <q-carousel-slide :name="1" img-src="../../assets/lec1.jpg" />
          <q-carousel-slide :name="2" img-src="../../assets/lec2.jpg" />
        </q-carousel>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { api, axios } from "src/boot/axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useMyAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
let router = useRouter();
let store = useMyAuthStore();
let setrole = ref("Learner-Type");
let togglePass = ref(false);
let department = ref("");
let data = ref({
  user_type: "Learner-Type",
});
let user = ref({});
let model = ref(null);
let verify = ref(false);
let slide = ref(1);
let code = ref("");
let loading = ref(false);

let studentClasses = ref([
  {
    name: "JSS1",
  },
  {
    name: "JSS2",
  },
  {
    name: "JSS3",
  },
  {
    name: "SS1",
  },
  {
    name: "SS1",
  },
  {
    name: "SS3",
  },
]);

const bindModal = ref("");

const setVal = (value) => {
  setrole.value = value;
};

const register = () => {
  const keysToDelete = ["phone", "reg_number"];

  let clonedObj = JSON.parse(JSON.stringify(data.value));
  keysToDelete.forEach((key) => {
    if (clonedObj.hasOwnProperty(key)) {
      delete clonedObj[key];
    }
  });
  let newData = {
    ...clonedObj,
    user_type: setrole.value,
  };

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
      console.log(response);
      store.setUserDetails(response.data);
      activateUser();

      // registerFCNs();
    })
    .catch(({ response }) => {
      console.log(response);
      loading.value = false;
      Notify.create({
        message: response.data.error.message,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const getUser = async (data) => {
  console.log(data);
  try {
    const response = await axios.get(`/api/api/v1/users/id:${data}`, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
      },
    });
    // console.log(response);
    loading.value = false;
    Notify.create({
      message: "User successfully Logged in",
      color: "green",
      position: "top",
    });
    console.log(response.data);

    store.setUserDetails(response.data);
    // let value = users.value.find(
    //   (user) => user.login === response.data.login && user.is_enroll === 0
    // );
    // if (value) {
    //   store.setUserDetailsDB(value);
    // }
    router.replace({
      name: "user.overview",
    });
    // console.log("here4");
    // window.location.href = response.data.login_key;
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
const registerFCNs = () => {
  let newData = {
    ...data.value,
    user_type: setrole.value,
  };
  const formData = new FormData();
  for (var key in newData) {
    formData.append(key, newData[key]);
  }
  axios
    .post(
      "https://enroll-lms.qverselearning.com/api/v1/student/create-student",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      console.log(response);
      Notify.create({
        message: "User registration successful",
        color: "green",
        position: "top",
      });
      loading.value = false;
      data.value = {};
      store.setUserDetailsDB(response.data);
      activateUser();
    })
    .catch(({ response }) => {
      console.log(response);
      loading.value = false;
      Notify.create({
        message: response.data.message,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};

const activateUser = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/api/api/v1/usersetstatus/user_id:${store.userdetails.id},${
        store.userdetails.status === "active"
          ? "status:inactive"
          : "status:active"
      }`,

      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        },
      }
    );

    getUser(store.userdetails.id);
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
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  display: grid;
  height: 100vh;
  margin: 0 auto;
  /* max-width: 1200px; */
  grid-template-columns: 1fr 1fr;
}
.pricing::-webkit-scrollbar {
  display: none;
}

.left {
  padding: 1rem 3rem 2rem;
  height: 100vh;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.left::-webkit-scrollbar {
  display: none;
}

.right img {
  height: 100%;
  object-fit: cover;
}

.header {
  all: unset;
}

.q-card {
  border-radius: 12px;
  background: #fff;
  padding: 24px;
  position: relative;
  /* Shadow/xl */
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03),
    0px 20px 24px -4px rgba(16, 24, 40, 0.08);
}

.q-card .close {
  position: absolute;
  top: 2%;
  right: 2%;
}

@media (min-width: 1000px) {
  .q-card {
    min-width: 402px;
  }
}
.checkcircle {
  border-radius: 28px;
  border: 8px solid #f9f5ff;
  background: #f4ebff;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}
.downloadqr .checkcircle {
  border-radius: 28px;
  border: 8px solid #ecfdf3;
  background: #d1fadf;
}
.checkcircle img {
  width: 24px;
  height: 24px;
}
@media (min-width: 1000px) {
  .list_card {
    min-width: 600px;
  }
}

@media (max-width: 800px) {
  .right {
    display: none;
  }

  .pricing {
    grid-template-columns: 1fr;
  }
  .left {
    padding: 1rem 1rem 2rem;
  }
  .grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .btn_toggle .q-btn,
  .btns_switch .q-btn {
    font-size: 14px;
  }
}
</style>
