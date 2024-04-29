<template>
  <div class="container q-pt-xl">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-pa-md"
        active-color="primary"
        no-caps
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="List" label="List" />
        <q-tab name="Add" label="Add" />
        <!-- <q-tab name="courseGroup" label="Add Course to  Group" /> -->
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="List">
          <GroupsCompVue />
        </q-tab-panel>

        <q-tab-panel name="Add">
          <div class="auth">
            <form @submit.prevent="onSubmit" class="q-mt-lg">
              <div class="form_hold">
                <div class="input">
                  <label for=""> Name* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.name"
                      placeholder="Enter group name"
                      type="text"
                      name="name"
                    />
                  </div>
                </div>
                <!-- <div class="input">
                  <label for=""> Key* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.key"
                      placeholder="Enter your email"
                      type="text"
                      name="groupkey"
                    />
                  </div>
                </div> -->
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
                      v-model="keyData.option"
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
                  <label for=""> Mode of entry </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="keyData.mode"
                      name="mode"
                    >
                      <option value="" disabled selected>Select</option>
                      <option value="Standard">Standard</option>
                      <option value="Direct">Direct</option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Year </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="keyData.year"
                      name="year"
                    >
                      <option value="" disabled selected>Select</option>
                      <option value="Y1">Year 1</option>
                      <option value="Y2">Year 2</option>
                      <option value="Y3">Year 3</option>
                      <option value="Y4">Year 4</option>
                      <option value="Y5">Year 5</option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Semester </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="keyData.semester"
                      name="year"
                    >
                      <option value="" disabled selected>Select</option>
                      <option value="1st">First semester</option>
                      <option value="2nd">Second semester</option>
                    </select>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Description </label>

                  <div class="input_wrap">
                    <textarea
                      v-model="data.description"
                      name="description"
                      placeholder="Enter Description "
                      cols="5"
                      rows="5"
                    ></textarea>
                  </div>
                </div>
                <div class="login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Add Group
                  </q-btn>
                </div>
              </div>
            </form>
          </div>
        </q-tab-panel>

        <q-tab-panel name="courseGroup">
          <div class="auth">
            <div class="input">
              <label for=""> Existing groups </label>
              <div style="gap: 1rem" class="row no-wrap items-center">
                <div class="input_wrap">
                  <select
                    class="text2 grey"
                    required
                    v-model="groupSelected"
                    name="year"
                  >
                    <option value="" disabled selected>Select</option>
                    <option
                      v-for="(group, index) in groups"
                      :key="index"
                      :value="group.id"
                    >
                      {{ group.key }}
                    </option>
                  </select>
                </div>
                <q-btn
                  @click="addCourseTogroup"
                  v-if="groupSelected !== ''"
                  :loading="saveSelected"
                >
                  Submit
                </q-btn>
              </div>
              <div class="q-mt-md" v-if="groupSelected !== ''">
                <CourseNowVue @selectedCheckboxes="handleSelectedCheckboxes" />
              </div>
            </div>
          </div>
          <q-btn @click="addCourseTogroup" :loading="saveSelected">
            Submit
          </q-btn>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import CoursesCompVue from "src/components/CoursesComp.vue";
import { Notify } from "quasar";
import { axios } from "src/boot/axios";
const name = ref(null);
const age = ref(null);
const saveSelected = ref(false);
const selectedCheckboxes = ref([]);
const loading = ref(false);
let tab = ref("List");
import { useMyAuthStore } from "src/stores/auth";
import GroupsCompVue from "src/components/groups/GroupsComp.vue";
import CourseNowVue from "src/components/CourseNow.vue";
let store = useMyAuthStore();
let data = ref({});
let groupSelected = ref("");
let department = ref("");
let groups = ref([]);
let options = ref([]);
let option = ref(false);
let keyData = ref({ department: "", semester: "", mode: "", year: "" });

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
const onSubmit = () => {
  // console.log(data);
  let dataa = {
    ...data.value,
    key: `NAU/${getAbbreviation(department.value)}/${getAbbreviationOption(
      keyData.value.option
    )}/${keyData.value.year}/${keyData.value.semester}`,
    creator_id: store.userdetails.id,
  };
  const formData = new FormData();
  for (var key in dataa) {
    formData.append(key, dataa[key]);
  }
  loading.value = true;
  axios
    .post("/api/api/v1/creategroup", formData, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      loading.value = false;
      data.value = {};
      Notify.create({
        message: `Group added Successfully`,
        color: "green",
        position: "top",
      });
    })
    .catch(({ response }) => {
      console.log(response);
      Notify.create({
        message: response.data.error.message,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
      loading.value = false;
    });
};

const handleSelectedCheckboxes = (checkedCheckboxes) => {
  selectedCheckboxes.value = checkedCheckboxes;
  // console.log("selected");
  // console.log(checkedCheckboxes);
};
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
const addCourseTogroup = () => {
  // selectInstructor.value = true;
  const arrayOfIds = selectedCheckboxes.value.map((obj) => obj.id);
  console.log(arrayOfIds);

  // Create an array of Promise objects for each course ID
  const addCoursePromises = arrayOfIds.map((courseId) => {
    // const apiUrl = addCourseUrl(courseId);
    return axios.get(
      `/api/api/v1/addcoursetogroup/course_id:${courseId},group_id:${groupSelected.value}`,

      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        },
      }
    );
  });
  saveSelected.value = true;

  // Use Promise.all to wait for all requests to resolve
  Promise.all(addCoursePromises)
    .then((responses) => {
      console.log("All Courses assigned successfully:", responses);
      // Perform any necessary actions on success
      Notify.create({
        message: `Course(s) Successfully added to group`,
        color: "green",
        position: "top",
      });
      saveSelected.value = false;
      groupSelected.value = "";
    })
    .catch(({ response }) => {
      // Handle error appropriately
      Notify.create({
        message: response.data.error.message,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
      saveSelected.value = false;
    });
};
onMounted(async () => {
  try {
    // loadingDelete.value = true;
    const response2 = await axios.get(`/api/api/v1/groups`, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
      },
    });

    console.log(response2);
    // console.log(user);
    groups.value = response2.data;
  } catch (error) {
    console.error(error);
  }
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
</script>

<style lang="scss" scoped>
.form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
