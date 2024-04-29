<template>
  <div class="q-mt-lg">
    <q-table
      title="Courses"
      :rows="rows"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="id"
      class="sort_tables"
      :grid="mode == 'grid'"
      :filter="filter"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:top-right="props">
        <!-- <q-btn
          :loading="load"
          @click="enroll"
          color="green"
          no-caps
          no-wrap
          class="q-mx-sm"
        >
          Enroll
        </q-btn> -->
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          v-if="mode === 'list'"
        >
          <q-tooltip :disable="$q.platform.is.mobile">
            {{ props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen" }}
          </q-tooltip>
        </q-btn>

        <q-btn
          flat
          round
          dense
          :icon="mode === 'grid' ? 'list' : 'grid_on'"
          @click="
            mode = mode === 'grid' ? 'list' : 'grid';
            separator = mode === 'grid' ? 'none' : 'horizontal';
          "
          v-if="!props.inFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile">{{
            mode === "grid" ? "List" : "Grid"
          }}</q-tooltip>
        </q-btn>

        <!-- <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          padding="xs"
          v-if="rows.length"
          @click="exportTable"
        /> -->
      </template>
      <template v-slot:body-cell-avatar="props">
        <q-td :props="props">
          <q-avatar size="50px" class="shadow-10">
            <img :src="props.row.avatar" />
          </q-avatar>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div style="gap: 0.5rem" class="row items-center no-wrap">
            <q-btn
              @click="enrollCourse(props.row.id)"
              :color="props.row.enrolled ? 'grey' : 'green'"
              :disable="props.row.enrolled"
              no-caps
              no-wrap
              class="q-mx-sm"
            >
              {{ props.row.enrolled ? "Enrolled" : "Enroll" }}
            </q-btn>
            <q-btn
              v-if="props.row.enrolled"
              @click="unEnrollCourse(props.row.id)"
              no-caps
              no-wrap
              color="red-10"
            >
              Unenroll
            </q-btn>
            <q-btn
              v-if="props.row.enrolled"
              @click="gotoCourse(props.row.id)"
              no-caps
              no-wrap
              color="primary"
            >
              Goto course
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center text-negative q-gutter-sm">
          <span> {{ message }} </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { exportFile, Loading, Notify, useMeta } from "quasar";
import axios from "axios";
// import helper from "../../plugins/helpers";
const columns = [
  {
    name: "index",
    required: true,
    label: "SN",
    align: "left",
    field: "index",
    sortable: true,
  },
  {
    name: "avatar",
    required: true,
    label: "Course avatar",
    align: "left",
    field: "avatar",
    sortable: true,
  },

  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },

  {
    name: "code",
    required: true,
    label: "Course Code",
    align: "left",
    field: "code",
    sortable: true,
  },
  {
    name: "certification",
    required: true,
    label: "Certification Type",
    align: "left",
    field: (row) => (row.certification ? row.certification : "NULL"),
    sortable: true,
  },
  {
    name: "actions",
    required: true,
    label: "Actions",
    align: "left",
    field: "id",
    sortable: true,
  },
];
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}
export default {
  setup() {
    useMeta({
      title: "Courses",
    });
  },
  data() {
    return {
      columns,
      selected: [],
      category: null,
      categories: [],
      rows: [],
      errors: [],
      fruitbay: {},
      image: null,

      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      filter: "",
      curl: "",
      separator: "",
      mode: "list",
      role: "fruitbay",
      new_fruitbay: false,
      is_password: true,
      loading: false,
      load: false,
      create_chapter: false,
      loaders: {
        delete: false,
        category: false,
        deleteBtn: [],
        save: [],
      },
    };
  },
  mounted() {
    this.onRequest();
    this.getUser();
  },
  watch: {
    selected(newSelectedCheckboxes) {
      this.$emit("selectedCheckboxes", newSelectedCheckboxes);
    },
  },
  emits: ["selectedCheckboxes"],
  methods: {
    onRequest() {
      this.loading = true;
      const url = `/api/api/v1/courses`;
      this.curl = url;
      this.$axios
        .get(url, {
          headers: {
            Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
          },
        })
        .then(({ data }) => {
          // console.log(data);
          this.loading = false;
          this.rows = data.map((course, index) => {
            const foundCourse2 = this.$store.talent.userdetails.courses.find(
              (usersCourse) => usersCourse.id === course.id
            );
            if (foundCourse2) {
              return { ...course, enrolled: true, index: index + 1 };
            } else {
              return { ...course, enrolled: false, index: index + 1 };
            }
          });

          // console.log(this.rows);
        })
        .catch(({ response }) => {
          console.log(response);
          this.loading = false;
          this.rows = [];
        });
    },
    async getUser() {
      try {
        const response = await axios.get(
          `/api/api/v1/users/id:${this.$store.talent.userdetails.id}`,
          {
            headers: {
              Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
            },
          }
        );

        console.log(response);
        this.$store.talent.setUserDetails(response.data);
        this.onRequest();
        // this.$router.replace({
        //   name: "user.overview",
        // });
      } catch ({ response }) {
        console.log(response);
        Notify.create({
          message: response.data.error.message,
          color: "red-3",
          position: "top",
        });
      }
    },
    async gotoCourse(id) {
      try {
        Loading.show();
        const response = await axios.get(
          `/api/api/v1/gotocourse/user_id:${this.$store.talent.userdetails.id},course_id:${id},course_completed_redirect:,logout_redirect:`,
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
    },
    enroll() {
      const arrayOfIds = this.selected.map((obj) => obj.id);
      console.log(arrayOfIds);

      // Create an array of Promise objects for each course ID
      const addCoursePromises = arrayOfIds.map((courseId) => {
        // const apiUrl = addCourseUrl(courseId);
        return axios.post(
          "/api/api/v1/addusertocourse",
          {
            user_id: this.$store.talent.userdetails.id,
            course_id: courseId,
            role: "learner",
          },
          {
            headers: {
              Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
            },
          }
        );
      });
      this.load = true;

      // Use Promise.all to wait for all requests to resolve
      Promise.all(addCoursePromises)
        .then((responses) => {
          console.log("All courses added successfully:", responses);
          // Perform any necessary actions on success
          Notify.create({
            message: `Course enrolled Successfully`,
            color: "green",
            position: "top",
          });
          this.load = false;
          this.getUser();
        })
        .catch(({ response }) => {
          console.log(response);
          // console.error("Error adding courses:", error);
          // Handle error appropriately
          Notify.create({
            message: response.data.error.message || "Could not add courses",
            color: "red",
            position: "top",
            actions: [{ icon: "close", color: "white" }],
          });
          this.load = false;
        });
    },
    enrollCourse(id) {
      this.loading = true;
      axios
        .post(
          "/api/api/v1/addusertocourse",
          {
            user_id: this.$store.talent.userdetails.id,
            course_id: id,
            role: "learner",
          },
          {
            headers: {
              Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
            },
          }
        )
        .then((responses) => {
          Notify.create({
            message: `Course enrolled Successfully`,
            color: "green",
            position: "top",
          });
          this.loading = false;
          this.getUser();
        })
        .catch(({ response }) => {
          console.log(response);

          Notify.create({
            message: response.data.error.message || "Could not add courses",
            color: "red",
            position: "top",
            actions: [{ icon: "close", color: "white" }],
          });
          this.loading = false;
        });
    },
    unEnrollCourse(id) {
      this.loading = true;
      axios
        .get(
          `/api/api/v1/removeuserfromcourse/user_id:${this.$store.talent.userdetails.id},course_id:${id}`,
          {
            headers: {
              Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
            },
          }
        )
        .then((responses) => {
          Notify.create({
            message: `Course unenrolled Successfully`,
            color: "green",
            position: "top",
          });
          this.loading = false;
          this.getUser();
        })
        .catch(({ response }) => {
          console.log(response);

          Notify.create({
            message: response.data.error.message || "Could not add courses",
            color: "red",
            position: "top",
            actions: [{ icon: "close", color: "white" }],
          });
          this.loading = false;
        });
    },

    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.rows.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");
      const status = exportFile("fruitbay-management.csv", content, "text/csv");
      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
