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
        <div class="sectionMain_text">Login</div>
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
            <q-btn
              @click="setVal('Trainer-Type')"
              no-caps
              :class="setrole !== 'Learner-Type' ? 'active' : ''"
              flat
            >
              I’m a staff
            </q-btn>
          </div>
        </div>
        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="login" class="q-mt-lg">
              <div class="form_hold">
                <div class="input">
                  <label for=""> Username* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.login"
                      placeholder="Enter your email"
                      type="text"
                      name="email"
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
                      placeholder="Enter your password"
                      :type="!togglePass ? 'password' : 'text'"
                    />
                    <q-btn
                      @click="togglePass = !togglePass"
                      flat
                      icon="visibility"
                    >
                    </q-btn>
                  </div>
                </div>

                <div class="login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Log in
                  </q-btn>
                </div>

                <div class="no_acc text-center q-mt-lg">
                  Don't have an account?
                  <router-link to="/register"> Sign Up </router-link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="right auth">
        <q-carousel
          v-if="setrole === 'Learner-Type'"
          animated
          v-model="slide"
          arrows
          :autoplay="10000"
          navigation
          infinite
        >
          <q-carousel-slide :name="1" img-src="../../assets/stud.jpg" />
        </q-carousel>
        <q-carousel
          v-else
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
import { Notify } from "quasar";
import { api, axios } from "src/boot/axios";
import { useMyAuthStore } from "src/stores/auth";
import { ref, onMounted } from "vue";
let slide = ref(1);
let code = ref("");
import { useRouter } from "vue-router";
let store = useMyAuthStore();
let router = useRouter();
let data = ref({ logout_redirect: "https://google.com" });
let togglePass = ref(false);
let users = ref([]);
let loading = ref(false);
let setrole = ref("Learner-Type");

const setVal = (value) => {
  setrole.value = value;
};
const getUser = async (data) => {
  console.log(data);
  try {
    const response = await axios.get(`/api/api/v1/users/id:${data.user_id}`, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
      },
    });
    console.log(response);
    loading.value = false;
    Notify.create({
      message: "User successfully Logged in",
      color: "green",
      position: "top",
    });
    console.log(response.data);

    store.setUserDetails(response.data);
    let value = users.value.find(
      (user) => user.login === response.data.login && user.is_enroll === 0
    );
    if (value) {
      store.setUserDetailsDB(value);
    }
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

const login = async () => {
  try {
    const formData = new FormData();
    for (var key in data.value) {
      formData.append(key, data.value[key]);
    }
    loading.value = true;

    const response = await axios.post(`/api/api/v1/userlogin`, formData, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    store.loginKey = response.data.login_key;
    getUser(response.data);
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
//     const response = await axios.get(
//       `https://enroll-lms.qverselearning.com/api/v1/student/all-students`
//     );

//     users.value = response.data.users;
//     console.log(response);

//     // let value = response.data.users.find(
//     //   (user) => user.login === store.userdetails.login && user.is_enroll === 0
//     // );

//     // store.setUserDetailsDB(value);
//   } catch (error) {
//     console.error(error);
//   }
// });
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  display: grid;
  height: 100vh;
  margin: 0 auto;
  align-items: center;
  /* max-width: 1200px; */
  grid-template-columns: 1fr 1fr;
}
.pricing::-webkit-scrollbar {
  display: none;
}

.left {
  padding: 1rem 3rem 2rem;
  height: 100vh;
  display: flex;
  max-width: 600px;

  flex-direction: column;
  justify-content: center;
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
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
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
