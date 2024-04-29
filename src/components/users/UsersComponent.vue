<template>
  <div class="listings_hold">
    <div class="listing">
      <div class="left items-center">
        <div class="img">
          <!-- <img :src="Users.img" alt="" /> -->
          <i class="fa-solid fa-user"></i>
          <p v-if="Users.status === 'active'" class="tag">Active</p>
          <p v-else class="tag inactive">inactive</p>
        </div>
        <div class="left_right">
          <div class="title">{{ Users.first_name }} {{ Users.last_name }}</div>
          <div class="date">{{ Users.email }}</div>
          <div class="date text-blue">{{ Users.user_type }}</div>
        </div>
      </div>

      <div class="right">
        <q-btn-dropdown class="modify" color="primary" label="Manage user">
          <q-list>
            <q-item class="" clickable @click="toggleeditUser">
              <q-item-section>
                <q-item-label>Edit user</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="" clickable v-close-popup @click="deleteUser">
              <q-item-section>
                <q-item-label>Delete</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-if="Users.status !== 'active'"
              class=""
              clickable
              v-close-popup
              @click="activateUser"
            >
              <q-item-section>
                <q-item-label>Activate user</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="" clickable v-close-popup @click="getUserName">
              <q-item-section>
                <q-item-label> Users username</q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="" clickable v-close-popup @click="resetPassword">
              <q-item-section>
                <q-item-label> Users password reset</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <q-dialog v-model="editUsersDetailModal" class="">
      <q-card>
        <form @submit.prevent="editUsersData" class="q-mt-md">
          <div class="row q-pb-sm justify-between items-center">
            <div class="text5">Edit user</div>

            <q-btn @click="editUsersDetailModal = false" flat no-caps>
              <img src="../../assets/circle.svg" alt="" />
            </q-btn>
          </div>
          <div class="form_hold auth">
            <div style="gap: 1rem" class="row items-center no-wrap">
              <div class="input">
                <label for=""> First name</label>

                <div class="input_wrap">
                  <input
                    v-model="data.first_name"
                    placeholder="Enter your firstname"
                    type="text"
                    name="first_name"
                  />
                </div>
              </div>
              <div class="input">
                <label for=""> Last name </label>

                <div class="input_wrap">
                  <input
                    v-model="data.last_name"
                    placeholder="Enter your lastname"
                    type="text"
                    name="last_name"
                  />
                </div>
              </div>
            </div>

            <div class="input">
              <label for=""> Email </label>

              <div class="input_wrap">
                <input
                  v-model="data.email"
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                />
              </div>
            </div>
            <div class="input">
              <label for=""> Username </label>

              <div class="input_wrap">
                <input
                  v-model="data.login"
                  placeholder="Enter your username"
                  type="text"
                  name="username"
                />
              </div>
            </div>
            <div class="input">
              <label for=""> Password </label>

              <div class="input_wrap">
                <input
                  v-model="data.password"
                  placeholder="Enter your passwword"
                  type="password"
                  name="password"
                />
              </div>
            </div>
            <div class="input">
              <label for=""> Bio </label>

              <div class="input_wrap">
                <textarea
                  placeholder="Bio"
                  v-model="data.bio"
                  name="bio"
                  cols="5"
                  rows="10"
                ></textarea>
              </div>
            </div>
            <div class="login_btn q-pt-lg">
              <q-btn :loading="loading" type="submit" no-caps flat>
                Edit user
              </q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import axios from "axios";
import { Dialog, Notify } from "quasar";
import { ref } from "vue";
import { useMyAuthStore } from "src/stores/auth";
let store = useMyAuthStore();
let dialog = ref(false);
let loading = ref(false);
let data = ref({});
let editUsersDetailModal = ref(false);
let props = defineProps({
  Users: Object,
});
const emit = defineEmits(["refresh"]);
const toggleeditUser = () => {
  data.value = { ...props.Users };
  editUsersDetailModal.value = true;
};
const editUsersData = async () => {
  try {
    // const keysToDelete = ["timezone"];

    // keysToDelete.forEach((key) => {
    //   if (data.value.hasOwnProperty(key)) {
    //     delete data.value[key];
    //   }
    // });
    let newData = {
      ...data.value,
      user_id: props.Users.id,
      timezone: -8,
      language: "en",
    };

    const formData = new FormData();
    for (var key in newData) {
      formData.append(key, newData[key]);
    }
    loading.value = true;
    const response = await axios.post(`/api/api/v1/edituser`, formData, {
      headers: {
        Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    loading.value = false;
    Notify.create({
      message: "User successfully deleted",
      color: "green",
      position: "top",
    });

    emit("refresh");
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
const deleteUser = () => {
  Dialog.create({
    title: "Delete user",
    message: "Are you sure you want to delete this user?",
  })
    .onOk(async () => {
      try {
        loading.value = true;
        const response = await axios.post(
          `/api/api/v1/deleteuser`,
          {
            user_id: props.Users.id,
            deleted_by_user_id: store.userdetails.id,
            // deleted_by_user_id: store.userdetails,
          },
          {
            headers: {
              Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        loading.value = false;
        Notify.create({
          message: "User successfully deleted",
          color: "green",
          position: "top",
        });
        emit("refresh");
      } catch ({ response }) {
        console.log(response);
        loading.value = false;
        Notify.create({
          message: response.data.error.message,
          color: "red-3",
          position: "top",
        });
      }
    })
    .onCancel(() => {
      // console.log('Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
const activateUser = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/api/api/v1/usersetstatus/user_id:${props.Users.id},${
        props.Users.status === "active" ? "status:inactive" : "status:active"
      }`,

      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        },
      }
    );
    console.log(response);
    loading.value = false;
    Notify.create({
      message: "User status successfully changed",
      color: "green",
      position: "top",
    });
    emit("refresh");
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
const getUserName = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/api/api/v1/forgotusername/email:${props.Users.email}`,

      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
        },
      }
    );
    console.log(response);
    loading.value = false;
    Dialog.create({
      title: "Users username",
      message: "Users username sent to users email",
    })
      .onOk(() => {
        // console.log('OK')
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
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
const resetPassword = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `/api/api/v1/forgotpassword/username:${props.Users.login}`,

      {
        headers: {
          Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
    loading.value = false;
    Dialog.create({
      title: "Users password reset",
      message: "Users password reset instructions has been sent to users email",
    })
      .onOk(() => {
        // console.log('OK')
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
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

<style lang="scss" scoped>
.listings_hold {
  background: rgba(233, 233, 233, 0.44);
}
.listing {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 0.5rem;
  margin: 2rem 0;
}

.listing .left {
  display: grid;
  grid-template-columns: 1fr 5fr;
  gap: 1rem;
}
.img {
  position: relative;
}

.img i {
  font-size: 4rem;
}

.img img {
  width: 116px;
  height: 116px;
}
.tag {
  font-style: normal;
  font-weight: 700;
  font-size: 8px;
  line-height: 11px;
  color: #ffffff;
  background: #03ae1e;
  border-radius: 3px 0px;
  padding: 0.4rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 44px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag.inactive {
  background: red;
}

.left_right .title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
}

.left_right .price {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-transform: capitalize;
  color: #000000;
  margin: 0.5rem 0;
}

.left_right .status {
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  color: #ffffff;
  background: #00a01a;
  border-radius: 3px;
  width: 45px;
  height: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.left_right .date {
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: #000000;
}

//  middle area

.listing .middle img {
  width: 18.32px;
  height: 18.32px;
  object-fit: contain;
}

.listing .middle {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  gap: 5rem;
}

.listing .middle .item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.listing .middle .count {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  margin-top: 1rem;
}

.listing .middle p {
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 11px;
  color: #000000;
}

.listing .right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.listing .right .modify {
  width: 136px;
  height: 31.5px;

  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  background: #c2e6e9;
  text-transform: capitalize;
  border-radius: 5px;
  color: #1f7bb5;
}

.listing .right .manage_ad {
  background: #03ae1e;
  border-radius: 5px;
  width: 210px;
  white-space: nowrap;
  height: 31.5px;

  font-style: normal;
  font-weight: 600;
  text-transform: capitalize;
  text-align: center;
  font-size: 15px;
  line-height: 20px;
  color: #ffffff;
}

// dialog

.card {
  min-width: 363px;
  background: #ffffff;
  box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  width: 466px;
  // height: 522px;
}

.dialog_content {
  background: #ffffff;
  box-shadow: 0px 0px 60px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  padding: 1rem;
  position: relative;
}
.dialog_content .dialog_top {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.dialog_content .dialog_top .title {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 27px;
  // text-align: center;
  color: #000000;
}
.dialog_content .dialog_top .price {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  // text-align: center;
  text-transform: capitalize;

  color: #000000;
}
.dialog_content .ad p:last-of-type {
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 27px;
  text-align: right;
  color: #000000;
  margin-bottom: 8px;
}

.dialog_content .ad p:first-of-type {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  margin-bottom: 8px;
}
.dialog_content .dialog_top.advert {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  gap: 0rem;
  margin-bottom: 1.5rem;
}
.dialog_content .dialog_top img {
  border: 3px solid rgba(176, 176, 176, 0.5);
  border-radius: 3px;
  width: 65px;
  height: 65px;
}
.dialog_content .dialog_top i {
  font-size: 3rem;
}
.dialog_content .dialog_top.advert img {
  width: 172px;
  height: 172px;
  border: 3px solid rgba(176, 176, 176, 0.5);
  border-radius: 3px;
}

.dialog_content .middle {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d1d1d1;
  border-bottom: 1px solid #d1d1d1;
  // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  align-items: center;
  padding: 0.7rem;
  margin: 1rem 0;
}
.dialog_content .middle.advert {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d1d1d1;
  border-bottom: none;
  align-items: center;
  padding: 1rem;
  margin: 0rem 0 0rem;
}
.dialog_content .middle.advert .q-btn {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
  color: #1f7bb5;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #c9c9c9;
  border-radius: 14.5px;
}
.dialog_content .middle.advert .q-btn::before {
  box-shadow: none;
}
.dialog_content .middle img {
  width: 19.96px;
  height: 19.96px;
}

.dialog_content .middle .count {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  margin-top: 0.1rem;
}

.dialog_content .middle p {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 0;
  color: #000000;
}

.dialog_content .performance {
  margin-top: 1rem;
}

.dialog_content .performance p {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  margin-bottom: 8px;
}

.dialog_content ul li {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #000000;
  list-style: disc;
  margin: 0.3rem 0 0 1rem;
}

.dialog_content .boost {
  margin-top: 1.5rem;
}

.dialog_content .boost .q-btn {
  width: 100%;

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #ffffff;
  background: #1f7bb5;
  border-radius: 5px;
  text-transform: capitalize;
}
.dialog_content .boost.advert .q-btn {
  width: 100%;

  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #ffffff;
  background: #03ae1e;
  border-radius: 5px;
  text-transform: capitalize;
}

.dialog_content .close {
  position: absolute;
  top: 1%;
  right: 2%;
  color: #979797;
  font-size: 1rem;
}
.dialog_content .close i {
  color: #979797;
  font-size: 1.3rem;
}
.dialog_content .close::before {
  box-shadow: none;
}

p.advert {
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
  color: #000000;
}

@media (max-width: 1150px) {
  .listing {
    grid-template-columns: 1.5fr 1fr 1.5fr;
  }

  .left_right .date {
    // padding-top: 0.7rem;
  }

  .listing .middle {
    gap: 3rem;
  }
}
@media (max-width: 1060px) {
  .listing .middle {
    gap: 2rem;
  }

  .listing .right .manage_ad {
    width: 146px;
  }
}
@media (max-width: 600px) {
  .listing .right .manage_ad {
    width: 106px;
    font-size: 10px;
  }

  .listing .right .modify {
    font-size: 10px;
    width: 96px;
  }
}
@media (max-width: 450px) {
  .listing {
    display: grid;
    grid-template-columns: 1fr;
    place-items: center;
  }

  .listing .left {
    display: flex;
    gap: 1rem;
  }
  .listing .right .manage_ad {
    width: 106px;
    font-size: 10px;
  }
  .card {
    min-width: 303px;
  }

  .listing .right .modify {
    width: 106px;
  }

  .dialog_content .middle {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>
