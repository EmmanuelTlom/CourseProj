<template>
  <q-layout>
    <div class="pricing overflow-hidden">
      <div class="left">
        <div class="header">
          <div class="logo">
            <q-btn class="" flat no-wrap no-caps>
              <div class="row items-center no-wrap">
                <div class="logo_img">
                  <img src="../assets/dot.svg" alt="" />
                </div>
              </div>
            </q-btn>
          </div>
        </div>
        <div class="sectionMain_text">Enroll Fee</div>

        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="registerFCNs" class="q-mt-lg">
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
                  <label for=""> Department </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="department"
                      name="department"
                    >
                      <option value="" disabled selected>
                        Select your department
                      </option>
                      <option
                        v-for="(department, index) in departments
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))"
                        :key="index"
                        :value="department.name"
                      >
                        {{ department.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div v-if="option" class="input">
                  <label for=""> Department Options</label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.option"
                      name="department"
                    >
                      <option value="" disabled selected>
                        Select your option
                      </option>
                      <option
                        v-for="(department, index) in options
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))"
                        :key="index"
                        :value="department.name"
                      >
                        {{ department.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Entry Mode </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.entry_mode"
                      name="department"
                    >
                      <option value="" disabled selected>
                        Select your entry mode
                      </option>
                      <option value="Direct">Direct</option>
                      <option value="Standard">Standard</option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Year </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.level"
                      name="level"
                    >
                      <option value="" disabled selected>
                        Select your level
                      </option>
                      <option value="Y1">Year 1</option>
                      <option value="Y2">Year 2</option>
                      <option value="Y3">Year 3</option>
                      <option value="Y4">Year 4</option>
                      <option value="Y5">Year 5</option>
                      <option value="Y6">Year 6</option>
                      <option value="Y7">Year 7</option>
                      <option value="Y8">Year 8</option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Gender </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.gender"
                      name="gender"
                    >
                      <option value="" disabled selected>
                        Select your gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
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
                </div>
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

                <p class="sectionMain_text">Access Fee: NGN18,000</p>
                <p class="sectionMain_text items-center row no-wrap">
                  <span> Payment Method:</span>
                  <img
                    style="width: 150px; object-fit: contain; height: 60px"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Paystack.png/1200px-Paystack.png"
                    alt=""
                  />
                </p>

                <div class="q-pt-lg login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Pay
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
import { api, axios } from "src/boot/axios";
import { Notify } from "quasar";
import { onMounted, ref, watch } from "vue";
import { useMyAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
let router = useRouter();
let store = useMyAuthStore();
let setrole = ref("Learner-Type");
let togglePass = ref(false);
let department = ref("");
let data = ref({
  user_type: "Learner-Type",
  level: "",
  entry_mode: "",
  gender: "",
});
let user = ref({});
let loading = ref(false);
let option = ref(false);
let options = ref([]);
watch(department, (newValue, oldValue) => {
  let value = departments.value.find(
    (department) => department.name === newValue
  );
  if (value.option) {
    options.value = value.option;
    option.value = true;
  } else {
    option.value = false;
  }
  // You can perform actions here when myValue changes
});

let departments = ref([
  {
    name: "Agricultural Economics",
    option: [
      {
        name: "Option 1",
      },
      {
        name: "Option 2",
      },
      {
        name: "Option 3",
      },
    ],
  },
  {
    name: "Architecture",
  },
  {
    name: "Agricultural Extension",
  },
  {
    name: "Animal Science and Technology",
  },
  {
    name: "Crop Science and Technology",
  },
  {
    name: "Fisheries and Aquaculture Technology",
  },
  {
    name: "Forestry and Wildlife Technology",
  },
  {
    name: "Soil Science and Technology",
  },
  {
    name: "Biochemistry",
  },
  {
    name: "Biology",
  },
  {
    name: "Biotechnology",
  },
  {
    name: "Microbiology",
  },
  {
    name: "Forensic Science",
  },
  {
    name: "Agricultural and Bioresources Engineering",
  },
  {
    name: "Civil Engineering",
  },
  {
    name: "Chemical Engineering",
  },
  {
    name: "Electrical and Electronics Engineering",
  },
  {
    name: "Food Science and technology",
  },
  {
    name: "Material and Metallurgical Engineering",
  },
  {
    name: "Mechanical Engineering",
  },
  {
    name: "Mechatronic Engineering",
  },
  {
    name: "Petroleum Engineering",
  },
  {
    name: "Polymer and Textile Engineering",
  },

  {
    name: "Building Technology",
  },
  {
    name: "Environmental Technology",
  },
  {
    name: "Quantity Surveying",
  },
  {
    name: "Surveying and Geoinformatics",
  },
  {
    name: "Urban and Regional Planning",
  },
  {
    name: "Biomedical Technology",
  },
  {
    name: "Dental Technology",
  },
  {
    name: "Environmental Health Science",
  },
  {
    name: "Optometry",
  },
  {
    name: "Prosthetics and Orthotics",
  },
  {
    name: "Public Health Technology",
  },
  {
    name: "Computer Science",
  },
  {
    name: "Cyber Security",
  },
  {
    name: "Information Technology",
  },
  {
    name: "Software Engineering",
  },
  {
    name: "Financial Management Technology",
  },
  {
    name: "Management Technology",
  },
  {
    name: "Maritime Management Technology",
  },
  {
    name: "Project Management Technology",
  },
  {
    name: "Transport Management Technology",
  },
  {
    name: "Chemistry",
  },
  {
    name: "Geology",
  },
  {
    name: "Mathematics",
  },
  {
    name: "Physics",
  },
  {
    name: "Science Laboratory Technology",
  },
  {
    name: "Statistics",
  },
]);
const bindModal = ref("");

const registerFCNs = () => {
  let newData = {
    ...data.value,
    paying_for: "LMS Enrollment Fee",
    amount: 18000,
    department: department.value,
    academic_session: "2023/2024 Academic Session",
  };

  const formData = new FormData();
  for (var key in newData) {
    formData.append(key, newData[key]);
  }

  loading.value = true;
  axios
    .post(
      "https://enroll-lms.qverselearning.com/api/v1/enroll/enroll-student",
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
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loading.value = false;
      data.value = {};
      window.location.href = response.data.data.authorization_url;
      // addUserToGroup(response)
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

const addUserToGroup = (response) => {
  // console.log(data);
  let keyVal = `NAU/${getAbbreviation(
    department.value
  )}/${getAbbreviationOption(keyData.value.option)}/${keyData.value.year}/${
    keyData.value.semester
  }`;

  axios
    .get(
      `/api/api/v1/addusertogroup/user_id:${store.userdetails.id},group_key:${keyVal}`,
      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      console.log(response);
      loading.value = false;
      data.value = {};
      window.location.href = response.data.data.authorization_url;
    })
    .catch(({ response }) => {
      console.log(response);
    });
};

onMounted(() => {
  data.value = {
    ...store.userdetailsData,
    level: "",
    entry_mode: "",
    gender: "",
  };
});

const getAbbreviation = (department) => {
  const words = department.split(" ");
  const abbreviation = words.map((word) => word[0].toUpperCase()).join("");
  return abbreviation;
};
const getAbbreviationOption = (department) => {
  const words = department.split(" ");
  const abbreviation = words.map((word) => word[0].toUpperCase()).join("");
  return abbreviation;
};
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  height: 100vh;
  margin: 0 auto;
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

.checkcircle img {
  width: 24px;
  height: 24px;
}

.sectionMain_text {
  font-size: 25px;
}
@media (min-width: 1000px) {
  .list_card {
    min-width: 600px;
  }
}

@media (max-width: 800px) {
  .left {
    padding: 1rem 1rem 2rem;
  }
}
</style>
