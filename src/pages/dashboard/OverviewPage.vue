<template>
  <div v-if="spin" class="spinner">
    <q-spinner color="primary" size="3em" />
  </div>
  <div v-else class="q-ma-lg">
    <div class="top_overview" v-if="store.userdetails?.courses?.length">
      <h5 class="text-h5 text-weight-bold">Overview</h5>
      <p>
        Here are a list of courses you have
        <span v-if="store.userdetails.user_type === 'Learner-Type'"
          >enrolled</span
        >
        <span v-if="store.userdetails.user_type === 'Trainer-Type'"
          >been assigned</span
        >.
        <a class="link" target="_blank" :href="store.userdetails.login_key"
          >Click here
        </a>
        to visit your customized page and start <br />
        <span v-if="store.userdetails.user_type === 'Learner-Type'">
          practicing with your preparatory questions.</span
        >
        <span v-if="store.userdetails.user_type === 'Trainer-Type'">
          creating your course contents.</span
        >
      </p>
      <q-list>
        <p
          class="text-weight-bold"
          v-if="store.userdetails.user_type === 'Trainer-Type'"
        >
          Assigned courses
        </p>
        <div class="courses_list">
          <q-item
            v-for="(course, index) in store.userdetails.courses"
            :key="index"
          >
            <!-- <img src="" alt="" /> -->
            <q-item-section>
              <q-item-label>{{ course.name }}</q-item-label>
              <q-item-label caption lines="2"
                ><q-btn
                  v-if="store.userdetails.user_type === 'Learner-Type'"
                  class="goto"
                  no-wrap
                  no-caps
                  flat
                  @click="gotoCourse(course.id)"
                  >Goto course</q-btn
                ></q-item-label
              >
            </q-item-section>

            <q-item-section side top>
              <q-item-label
                v-if="store.userdetails.user_type === 'Learner-Type'"
                caption
                >{{ course.completion_status_formatted }}</q-item-label
              >
              <!-- <q-icon name="star" color="yellow" /> -->
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </div>
    <div v-else>
      <div
        class="overview_type"
        v-if="store.userdetails.user_type === 'Learner-Type'"
      >
        <div class="overview_wrap">
          <p class="q-mt-md">
            You have not yet enrolled to any course. Enroll to get access and
            take your preparatory exams.
          </p>
          <q-btn
            color="green"
            no-caps
            no-wrap
            class="q-mt-xs"
            :to="{ name: 'user.courses' }"
          >
            Enroll
          </q-btn>
        </div>
        <!-- <q-btn class="q-mt-md" :to="{ name: 'user.enroll' }"> Enroll </q-btn> -->
      </div>
      <div
        class="overview_type"
        v-if="store.userdetails.user_type === 'Trainer-Type'"
      >
        <div class="overview_wrap">
          <p class="q-mt-md">You have not yet been assigned to any course.</p>
        </div>
        <!-- <q-btn class="q-mt-md" :to="{ name: 'user.enroll' }"> Enroll </q-btn> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { Loading } from "quasar";
import { axios } from "src/boot/axios";
import CoursesCompVue from "src/components/CoursesComp.vue";
import { useMyAuthStore } from "src/stores/auth";
import { onMounted, ref } from "vue";
let spin = ref(false);
const store = useMyAuthStore();
let user = ref({});

const gotoCourse = async (id) => {
  try {
    Loading.show();
    const response = await axios.get(
      `/api/api/v1/gotocourse/user_id:${store.userdetails.id},course_id:${id},course_completed_redirect:,logout_redirect:`,
      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        },
      }
    );

    console.log(response);
    window.open(response.data.goto_url, "_blank");
    // window.location.href = response.data.goto_url
    Loading.hide();
  } catch (error) {
    console.error(error);
    Loading.hide();
  }
};
// onMounted(async () => {
//   try {
//     // ,user_id:${15}
//     const response = await axios.get(
//       `/api/api/v1/getusersprogressinunits/unit_id:${2050}`,
//       {
//         headers: {
//           Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
//         },
//       }
//     );
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// });
</script>

<style lang="scss" scoped></style>
