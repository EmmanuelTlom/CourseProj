<template>
  <div class="">
    <q-table
      title="Courses"
      :rows="rows"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="id"
      :grid="mode == 'grid'"
      :filter="filter"
      class="sort_tables"
      :loading="loading"
      selection="single"
      v-model:selected="selected"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:top-right="props">
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

        <q-btn
          color="primary"
          icon-right="archive"
          label="Export to csv"
          no-caps
          padding="xs"
          v-if="rows.length"
          @click="exportTable"
        />
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
          <div>
            <q-btn
              round
              dense
              color="negative"
              size="sm"
              icon="delete"
              :loading="loaders.deleteBtn[props.value]"
              @click="deleteFruitbays(props.value)"
            >
              <q-tooltip>Delete {{ props.row.name }}</q-tooltip>
            </q-btn>
            <q-btn
              round
              dense
              glossy
              color="info"
              size="sm"
              class="q-ml-sm"
              icon="edit"
              :loading="loaders.save[props.value]"
              @click="editChapter(props.row)"
            >
              <q-tooltip>Edit {{ props.row.name }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-negative q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Well this is sad... {{ message }} </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>

      <template v-slot:bottom v-if="selected.length">
        <q-btn
          @click="uploadCourse"
          :loading="loaders.delete"
          color="negative"
          :label="`Upload content for selected course`"
          padding="sm"
          class="q-mr-xs"
        />
      </template>
    </q-table>
  </div>
  <q-dialog v-model="create_chapter">
    <q-card style="width: 800px; max-width: 85vw">
      <q-card-section>
        <div class="text-h6">
          Add new chapter
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
        </div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-pt-none">
        <q-form class="q-gutter-md" ref="fruitbayForm" @submit="createChapters">
          <div class="row q-gutter-sm">
            <div class="col">
              <q-item-label class="q-pb-xs">Image</q-item-label>
              <q-file
                dense
                color="teal"
                outlined
                name="cover"
                accept=".jpg,.png,.svg,.jpeg"
                v-model="image"
                label="Image"
                @update:model-value="setFile"
              >
              </q-file>
            </div>
          </div>

          <div class="row q-gutter-sm">
            <div class="col">
              <q-item-label class="q-pb-xs"
                >Chapter(Leave empty to auto generate)</q-item-label
              >
              <q-input
                dense
                outlined
                name="chapter"
                v-model="chapter"
                label="Chapter"
              />
              <div class="error" v-if="errors.chapter">
                {{ errors.chapter[0] }}
              </div>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <q-item-label class="q-pb-xs">Content id</q-item-label>
              <q-input
                dense
                outlined
                name="content_id"
                v-model="content_id"
                label="Content id"
              />
              <div class="error" v-if="errors.content_id">
                {{ errors.content_id[0] }}
              </div>
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <q-item-label class="q-pb-xs">Meta</q-item-label>
              <q-input
                dense
                outlined
                type="textarea"
                name="meta"
                v-model="meta"
                label="Meta"
              />
              <div class="error" v-if="errors.meta">
                {{ errors.meta[0] }}
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-teal">
        <q-btn
          v-if="!editstate"
          label="Save"
          type="submit"
          color="primary"
          :loading="loadChapter"
          @click="createChapters"
          v-close-popup="false"
        />
        <q-btn
          v-if="editstate"
          label="Edit"
          type="submit"
          color="primary"
          :loading="editChapterState"
          @click="editChapters"
          v-close-popup="false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { exportFile, useMeta } from "quasar";
import { useMyAuthStore } from "src/stores/auth";
const store = useMyAuthStore();
const columns = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },

  {
    name: "course_name",
    required: true,
    label: "Name",
    align: "left",
    field: "course_name",
    sortable: true,
  },
  // {
  //   name: "description",
  //   required: true,
  //   label: "Description",
  //   align: "left",
  //   field: "description",
  //   sortable: true,
  // },

  {
    name: "course_code",
    required: true,
    label: "Course Code",
    align: "left",
    field: "course_code",
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
    name: "actions",
    required: true,
    label: "Actions",
    align: "left",
    field: (row) => row.id,
    sortable: false,
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

  props: ["content"],
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
      chapter: "",
      content_id: "",
      chapterId: "",
      meta: "",
      editstate: false,
      loadChapter: false,
      editChapterState: false,

      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 100,
      },
      filter: "",
      curl: "",
      separator: "",
      mode: "list",
      role: "fruitbay",
      new_fruitbay: false,
      is_password: true,
      loading: false,
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
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
    });
  },
  methods: {
    onRequest(props) {
      this.loading = true;
      const url = `assign-unassign/assigned-course/${store.userdetails.id}`;
      this.curl = url;
      this.$axios
        .get(url)
        .then(({ data }) => {
          console.log(data);
          this.loading = false;
          this.rows = data.courses;
        })
        .catch(({ response }) => {
          console.log(response);
          this.loading = false;
          this.rows = [];
        });
    },

    uploadCourse() {},

    refreshPage() {
      if (this.curl !== "") {
        this.loading = true;
        this.$api
          .get(this.curl)
          .then(({ data }) => {
            this.loading = false;
            this.rows = data.data;
            console.log(data);
          })
          .catch(({ response }) => {
            console.log(response);
            this.loading = false;
            this.rows = [];
          });
      }
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
