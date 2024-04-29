<template>
  <div class="container q-pt-xl">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey q-pa-md"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        no-caps
        narrow-indicator
      >
        <q-tab name="List" label="List" />
        <q-tab name="Add" label="Add Course" />
        <q-tab name="courseGroup" label="Assign courses to instructor" />
        <q-tab
          name="assigncourseGroup"
          label="Unassign courses to instructor"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="List">
          <CoursesCompVue />
        </q-tab-panel>

        <q-tab-panel name="Add">
          <q-form @submit="onSubmit" class="form">
            <q-input
              filled
              v-model="data.code"
              label="Course Code"
              lazy-rules
            />

            <q-input
              filled
              class="q-my-xs"
              v-model="data.name"
              label="Course Name"
              lazy-rules
            />

            <q-input
              filled
              class="q-my-xs"
              type="textarea"
              v-model="data.description"
              label="Description"
              lazy-rules
            />

            <q-select
              v-model="premiumValues.isPremium"
              :options="options"
              filled
              class="q-my-xs"
              label="Is this a premium course?"
            />
            <q-input
              filled
              :disable="premiumValues.isPremium === 'false'"
              class="q-my-xs"
              v-model="premiumValues.price"
              label="Price"
              lazy-rules
            />

            <q-file
              color="purple-12"
              v-model="data.course_image"
              label="Upload Course Image"
              accept=".jpg,.png,.svg,.jpeg"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-file
              color="purple-12"
              v-model="data.display_image"
              label="Upload Display Image"
              accept=".jpg,.png,.svg,.jpeg"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <div class="q-mt-md">
              <q-btn
                :loading="loading"
                label="Submit"
                type="submit"
                color="primary"
              />
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="courseGroup">
          <div class="text-h6">Assign course to instructor</div>
          <div style="gap: 0.6rem" class="row courseGroup items-center no-wrap">
            <select
              @change="selectInstructorToAssign"
              v-model="selectedIntructor"
              name=""
              id=""
            >
              <option value="">Select instructor</option>
              <option
                :value="instructor.id"
                v-for="(instructor, index) in instructors"
                :key="index"
              >
                {{ instructor.first_name }} {{ instructor.last_name }}
              </option>
            </select>

            <q-btn
              color="primary"
              no-caps
              no-wrap
              :loading="saveSelected"
              @click="assignCourse"
            >
              Submit
            </q-btn>
          </div>

          <div class="q-mt-md" v-if="selectInstructor">
            <CoursesNow @selectedCheckboxes="handleSelectedCheckboxes" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="assigncourseGroup">
          <div class="text-h6">Unassign course from instructor</div>
          <div style="gap: 0.6rem" class="row courseGroup items-center no-wrap">
            <select
              @change="selectunInstructorToAssign"
              v-model="unassignselectedIntructor"
              name=""
              id=""
            >
              <option value="">Select instructor</option>
              <option
                :value="instructor.id"
                v-for="(instructor, index) in instructors"
                :key="index"
              >
                {{ instructor.first_name }} {{ instructor.last_name }}
              </option>
            </select>

            <q-btn
              color="primary"
              no-wrap
              no-caps
              :loading="saveSelected"
              @click="unassignCourse"
            >
              Unassign
            </q-btn>
          </div>
          <div v-if="smallSPin" class="text-center q-ma-lg row justify-center">
            <q-spinner-tail color="primary" size="2em" />
          </div>
          <div class="q-mt-md" v-if="unassignselectInstructor">
            <UnAssign
              :courses="courses"
              @selectedUnassignCheckboxes="handleUnassignSelectedCheckboxes"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import CoursesCompVue from "src/components/ManageCourses.vue";
import CoursesNow from "src/components/CourseNow.vue";
import UnAssign from "src/components/UnAssign.vue";
import { axios } from "../../boot/axios";
import { Notify } from "quasar";
import { useMyAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
let store = useMyAuthStore();
let router = useRouter();
let tab = ref("List");
let data = ref({});

let premiumValues = ref({ isPremium: "false" });
let errors = ref({});
let loading = ref(false);
let smallSPin = ref(false);
let saveSelected = ref(false);
let selectedCheckboxes = ref([]);
let selectedUnassignCheckboxes = ref([]);
let selectInstructor = ref(false);
let unassignselectInstructor = ref(false);
let selectedIntructor = ref("");
let unassignselectedIntructor = ref("");
let yearoptions = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
let departmentoptions = ["Educational foundation"];
let modeoptions = ["Standard", "Direct"];
let programmeoptions = ["Undergraduate", "Postgraduate"];
let semesteroptions = ["1st semester", "2nd semester"];
let instructors = ref([]);
let courses = ref([]);
// console.log(axios);
let options = ref(["true", "false"]);
const onSubmit = () => {
  // console.log(data);
  let dataa = {
    ...data.value,
    creator_id: store.userdetails.id,
  };
  const formData = new FormData();
  for (var key in dataa) {
    formData.append(key, dataa[key]);
  }
  loading.value = true;
  axios
    .post("/api/api/v1/createcourse", formData, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response);
      sendCourseToOurDB();
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

const sendCourseToOurDB = () => {
  let dataa = {
    ...data.value,
    is_premimum: premiumValues.value.isPremium === "true" ? true : false,
    price: premiumValues.value.price,
  };

  console.log(typeof dataa.is_premimum);
  // const formData = new FormData();
  // for (var key in dataa) {
  //   formData.append(key, dataa[key]);
  // }
  axios
    .post(
      "https://tutorial.qverselearning.com/api/v1/course/create-course",
      dataa
    )
    .then((response) => {
      console.log(response);
      loading.value = false;
      data.value = {};
      premiumValues.value = {};
      Notify.create({
        message: `Course added Successfully`,
        color: "green",
        position: "top",
      });
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

const selectInstructorToAssign = () => {
  selectInstructor.value = true;
};
const selectunInstructorToAssign = () => {
  getLecCourses(unassignselectedIntructor.value);
};
const assignCourse = () => {
  // selectInstructor.value = true;
  const arrayOfIds = selectedCheckboxes.value.map((obj) => obj.id);
  console.log(arrayOfIds);

  // Create an array of Promise objects for each course ID
  const addCoursePromises = arrayOfIds.map((courseId) => {
    // const apiUrl = addCourseUrl(courseId);
    return axios.post(
      "/api/api/v1/addusertocourse",
      {
        user_id: selectedIntructor.value,
        course_id: courseId,
        role: "instructor",
      },
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
        message: `Course assigned Successfully`,
        color: "green",
        position: "top",
      });
      saveSelected.value = false;
      selectInstructor.value = false;
      selectedIntructor.value = "";
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
const unassignCourse = () => {
  // selectInstructor.value = true;
  const arrayOfIds = selectedUnassignCheckboxes.value.map((obj) => obj.id);
  // console.log(arrayOfIds);

  // Create an array of Promise objects for each course ID
  const addCoursePromises = arrayOfIds.map((courseId) => {
    // const apiUrl = addCourseUrl(courseId);
    return axios.get(
      `/api/api/v1/removeuserfromcourse/user_id:${unassignselectedIntructor.value},course_id:${courseId}`,
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
        message: `Course unassigned Successfully`,
        color: "green",
        position: "top",
      });
      saveSelected.value = false;
      getLecCourses(unassignselectedIntructor.value);
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

const handleSelectedCheckboxes = (checkedCheckboxes) => {
  selectedCheckboxes.value = checkedCheckboxes;
  console.log("selected");
  console.log(checkedCheckboxes);
};
const handleUnassignSelectedCheckboxes = (checkedCheckboxes) => {
  console.log(checkedCheckboxes);
  selectedUnassignCheckboxes.value = checkedCheckboxes;
  // console.log("selected");
};

const getLecCourses = async (id) => {
  smallSPin.value = true;
  const user = await axios.get(`/api/api/v1/users/id:${id}`, {
    headers: {
      Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
    },
  });

  courses.value = user.data.courses;
  unassignselectInstructor.value = true;
  smallSPin.value = false;
  console.log(user);
};

onMounted(async () => {
  try {
    const response = await axios.get("/api/api/v1/users", {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
      },
    });
    console.log(response);
    instructors.value = response.data.filter(
      (lec) => lec.user_type === "Trainer-Type"
    );
    // data.value = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
.form {
  max-width: 600px;
  margin: 0 auto;
}

select {
  border-radius: 5px;
  border: 1px solid #e3e3e3;
  padding: 1rem 0.5rem;
  width: 100%;
  height: 50px;
  // color: #e3e3e3;
}

.courseGroup .q-btn {
  height: 50px;
}
</style>
