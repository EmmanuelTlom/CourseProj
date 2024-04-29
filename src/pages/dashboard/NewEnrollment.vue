<template>
  <q-layout>
    <div class="pricing q-pt-xl container overflow-hidden">
      <div>
        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="register" class="q-mt-lg">
              <div class="form_hold">
                <div class="sectionMain_text">Enroll</div>
                <div class="grid">
                  <div class="input">
                    <label for=""> First name* </label>

                    <div class="input_wrap">
                      <input
                        v-model="data.firstName"
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
                        v-model="data.lastName"
                        placeholder="Enter your last name"
                        type="text"
                        required
                        name="lastName"
                      />
                    </div>
                  </div>
                </div>
                <div class="input">
                  <label for=""> State of origin</label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.state"
                      name="state"
                    >
                      <option value="" disabled selected>
                        Select your state
                      </option>
                      <option
                        v-for="(state, index) in states
                          .slice()
                          .sort((a, b) => a.localeCompare(b))"
                        :key="index"
                        :value="state"
                      >
                        {{ state }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="input">
                  <label for=""> Email* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.email"
                      placeholder="Enter your email"
                      type="email"
                      required
                      name="email"
                    />
                  </div>
                </div>
                <div class="input">
                  <label for=""> Jamb reg. no.* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.reg"
                      placeholder="Enter your jamb registration number"
                      type="text"
                      required
                      name="number"
                    />
                  </div>
                </div>

                <div class="input">
                  <label for=""> FSLC </label>
                  <div style="gap: 1rem" class="row items-start no-wrap">
                    <div>
                      <img
                        style="
                          width: 100px;
                          height: 100px;
                          object-fit: cover;
                          border-radius: 5px;
                        "
                        :src="previewFs"
                        alt=""
                      />
                    </div>
                    <q-file
                      style="width: 100%"
                      accept=".jpg,.png,.jpeg,.pdf"
                      class="column profile_field justify-center items-center"
                      v-model="data.image"
                      @update:model-value="setFileFS"
                    >
                      <div class="img q-mb-sm">
                        <img src="../../assets/down.svg" alt="" />
                      </div>
                      <div class="text3">
                        <span>Click to upload</span>
                      </div>

                      <div class="text2 text-center">PDF, PNG, JPG</div>
                    </q-file>
                  </div>
                </div>
                <div class="input">
                  <label for=""> WAEC/NECO Result </label>
                  <div style="gap: 1rem" class="row items-start no-wrap">
                    <div>
                      <img
                        style="
                          width: 100px;
                          height: 100px;
                          object-fit: cover;
                          border-radius: 5px;
                        "
                        :src="preview"
                        alt=""
                      />
                    </div>
                    <q-file
                      style="width: 100%"
                      accept=".jpg,.png,.jpeg,.pdf"
                      class="column profile_field justify-center items-center"
                      v-model="data.image"
                      @update:model-value="setFile"
                    >
                      <div class="img q-mb-sm">
                        <img src="../../assets/down.svg" alt="" />
                      </div>
                      <div class="text3">
                        <span>Click to upload</span>
                      </div>

                      <div class="text2 text-center">PDF, PNG, JPG</div>
                    </q-file>
                  </div>
                </div>
                <div class="input">
                  <label for="">Fees PDF </label>

                  <q-file
                    style="width: 100%"
                    accept=".pdf"
                    class="column profile_field justify-center items-center"
                    v-model="data.fees"
                  >
                    <div class="img q-mb-sm">
                      <img src="../../assets/down.svg" alt="" />
                    </div>
                    <div class="text3">
                      <span>Click to upload</span>
                    </div>

                    <div class="text2 text-center">PDF</div>
                  </q-file>
                </div>

                <div class="login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Enroll
                  </q-btn>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { api } from "src/boot/axios";
import { Dialog, Notify } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();
let setrole = ref("student");
let togglePass = ref(false);
let data = ref({
  state: "",
  image: null,
});
let preview = ref("/usersvg.svg");
let previewFs = ref("/usersvg.svg");
let user = ref({});
let model = ref(null);
let verify = ref(false);
let slide = ref(1);
let code = ref("");
let loading = ref(false);
const setFile = (props) => {
  data.value.image = props;
  var reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target.result;
  };
  reader.readAsDataURL(props);
};
const setFileFS = (props) => {
  data.value.image = props;
  var reader = new FileReader();
  reader.onload = (e) => {
    previewFs.value = e.target.result;
  };
  reader.readAsDataURL(props);
};
let states = ref([
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]);
// import VOtpInput from "vue3-otp-input";

const bindModal = ref("");

const setVal = (value) => {
  setrole.value = value;
};

const handleOnComplete = (value) => {
  // console.log("OTP completed: ", value);
  code.value = value;
};

const handleOnChange = (value) => {
  // console.log("OTP changed: ", value);
};
const register = () => {
  loading.value = true;
  Notify.create({
    message: "Enrollment Successful",
    color: "green",
    position: "top",
  });
  Dialog.create({
    title: "Successful",
    message: `Your enrollment was successful and has been recorded. You will receive an email once it is approved.`,
    ok: {
      push: true,
      label: "Okay",
      color: "green",
    },

    persistent: true,
  })
    .onOk(() => {
      router.replace({
        name: "user.overview",
      });
    })

    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });

  loading.value = false;
};
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  /* height: 100vh; */
  margin: 0 auto;
  align-items: center;
}
.pricing::-webkit-scrollbar {
  display: none;
}

.form_hold {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 10px;
  overflow: scroll;
  background: white;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
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
