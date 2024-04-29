<template>
  <div class="">
    <q-table
      title="Courses"
      :rows="courses"
      :hide-header="mode === 'grid'"
      :columns="columns"
      row-key="id"
      :grid="mode == 'grid'"
      :filter="filter"
      :loading="loading"
      class="sort_tables"
      selection="multiple"
      v-model:selected="selected"
      v-model:pagination="pagination"
    >
      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center text-negative q-gutter-sm">
          <span> {{ message }} </span>
        </div>
      </template>

      <!-- <template v-slot:bottom v-if="selected.length">
        <q-btn
          :loading="loaders.delete"
          :label="`Select`"
          padding="sm"
          @click="selectRows"
          class="q-mr-xs"
        />
      </template> -->
    </q-table>
  </div>
</template>

<script>
import { useMeta } from "quasar";
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
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    sortable: true,
  },
];

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
      loading: false,
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      filter: "",
      curl: "",
      separator: "",
      mode: "list",
      role: "fruitbay",
      loaders: {
        delete: false,
        category: false,
        deleteBtn: [],
        save: [],
      },
    };
  },
  props: ["courses"],
  watch: {
    selected(newSelectedCheckboxes) {
      this.$emit("selectedUnassignCheckboxes", newSelectedCheckboxes);
    },
  },
  mounted() {
    // this.onRequest({
    //   pagination: this.pagination,
    //   filter: undefined,
    // });
  },
  methods: {
    //   onRequest(props) {
    //     this.loading = true;
    //     const url = `/api/api/v1/courses`;
    //     this.curl = url;
    //     this.$axios
    //       .get(url, {
    //         headers: {
    //           Authorization: `Basic ${btoa("1R4WplICWCpVYtdkce28KHRXHIXUNl:")}`,
    //         },
    //       })
    //       .then(({ data }) => {
    //         console.log(data);
    //         this.loading = false;
    //         this.rows = data;
    //       })
    //       .catch(({ response }) => {
    //         console.log(response);
    //         this.loading = false;
    //         this.rows = [];
    //       });
    //   },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
