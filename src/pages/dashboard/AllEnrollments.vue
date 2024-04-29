<template>
  <div class="wrapp">
    <div v-if="spin" class="spinner">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else class="top">
      <span class="title">
        <i class="fa-solid q-mr-sm fa-list"></i>
        Enrollments | {{ arr.length }}
      </span>
    </div>
    <div v-for="(user, index) in sortedUsers" :key="index">
      <Users @refresh="getUsers" :Users="user" />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { Notify } from "quasar";
import Users from "src/components/users/UsersComponentSub.vue";
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
