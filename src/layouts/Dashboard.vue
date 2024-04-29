<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      elevated
      class="header_dashboard bg-white q-py-xs"
      height-hint="58"
    >
      <q-toolbar class="row justify-between">
        <q-btn flat no-caps no-wrap class="q-ml-xs logo">
          <img src="../assets/f.svg" />
          <!-- <img src="/images/worklogo.png" alt="" /> -->
        </q-btn>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round flat>
            <q-avatar size="35px">
              <img :src="store.userdetails.avatar" />
            </q-avatar>
            <q-menu>
              <div class="q-pa-md">
                <div class="column items-center">
                  <q-avatar size="72px">
                    <img :src="store.userdetails.avatar" />
                  </q-avatar>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ store.userdetails.first_name }}
                    {{ store.userdetails.last_name }}
                  </div>

                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    :to="{ name: 'logout' }"
                    size="sm"
                    v-close-popup
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            aria-label="Menu"
            icon="menu"
            class="text-black"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="206"
      :breakpoint="800"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item
            :to="{ name: 'user.overview' }"
            class="links"
            v-ripple
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Overview</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            :to="{ name: 'user.courses' }"
            class="links"
            v-ripple
            v-if="
              store.userdetails.user_type === 'Learner-Type' &&
              store.userdetailsData.is_enroll === 1
            "
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="book" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Subjects</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            :to="{ name: 'user.courses' }"
            class="links"
            v-ripple
            v-if="store.userdetails.user_type === 'Learner-Type'"
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="fa-solid fa-graduation-cap" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Course reg.</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-if="store.userdetails.user_type === 'Learner-Type'"
            :to="{ name: 'new.enrollment' }"
            class="links"
            v-ripple
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="fa-solid fa-plus" />
            </q-item-section>
            <q-item-section>
              <q-item-label>New Enrollment</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            :to="{ name: 'admin.users' }"
            class="links"
            v-ripple
            v-if="
              store.userdetails.user_type === 'SuperAdmin' ||
              store.userdetails.user_type === 'Admin-Type'
            "
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="fa-solid fa-user" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Students</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="
              store.userdetails.user_type === 'SuperAdmin' ||
              store.userdetails.user_type === 'Admin-Type'
            "
            :to="{ name: 'admin.ManageCourses' }"
            class="links"
            v-ripple
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="fa-solid fa-book" />
            </q-item-section>
            <q-item-section>
              <q-item-label> Courses</q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-item
            :to="{ name: 'admin.groups' }"
            class="links"
            v-ripple
            v-if="
              store.userdetails.user_type === 'SuperAdmin' ||
              store.userdetails.user_type === 'Admin-Type'
            "
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="fa-solid fa-users" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Groups</q-item-label>
            </q-item-section>
          </q-item> -->
          <q-item
            v-if="store.userdetails.user_type === 'SuperAdmin'"
            :to="{ name: 'enrollments' }"
            class="links"
            v-ripple
            clickable
          >
            <q-item-section class="avater_side" avatar>
              <q-icon size="18px" name="fa-solid fa-users" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Enrollments</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator class="q-my-md" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { fabYoutube } from "@quasar/extras/fontawesome-v6";
import { useMyAuthStore } from "src/stores/auth";
const store = useMyAuthStore();
// import { useRouter } from "vue-router";
// let router = useRouter();
export default {
  name: "MyLayout",
  setup() {
    const leftDrawerOpen = ref(false);
    const search = ref("");
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    // console.log(store.userdetails);
    let userDetails = store.userdetails;
    return {
      fabYoutube,
      store,
      userDetails,
      leftDrawerOpen,
      search,
      toggleLeftDrawer,
    };
  },
};
</script>

<style scoped lang="scss">
.header {
  background: #ffffff;
  border-bottom: 1px solid #dddddd;
}
.btn {
  width: 166px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;

  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-transform: capitalize;
  color: #000000;
}

.btn::before {
  box-shadow: none;
}

.logo img {
  width: 152px;
  height: 60px;
  object-fit: contain;
}

.bar {
  width: 100%;
}

.bar .input_wrap {
  display: flex;
  align-items: center;
  background: #f3f3f3;
  border: 0.5px solid #c7c7c7;
  border-radius: 50px;
  width: 432px;
  margin-left: 3rem;
  height: 41.84px;
}

.bar input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0 1rem;
}

.search-btn {
  min-height: 0;
}

::placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #9a9a9a;
}

.links {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  // color: #000000;
}

.q-list {
  padding: 2rem 1rem;
}

.avater_side {
  min-width: 0;
}

.q-item.q-router-link--active,
.q-item--active {
  background: #7f56d9;
  color: white;
  border-radius: 5px;
}
@media (max-width: 900px) {
  .mybtn {
    font-size: 12px;
    width: 150px;
  }

  .bar .input_wrap {
    width: 70%;
    margin-left: 0;
  }
  .menu {
    display: block;
  }
}
@media (max-width: 500px) {
  .bar .input_wrap {
    display: none;
  }
  .mybtn {
    width: 160px;
  }
  .logo img {
    width: 70px;
    height: 50px;
    object-fit: contain;
  }
  .btn {
    width: 106px;
    height: 36px;
    font-size: 11px;
  }

  .q-btn.logo {
    padding: unset;
  }
}
</style>
