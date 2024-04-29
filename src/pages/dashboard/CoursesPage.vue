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
        <q-tab name="Add" label="Select your courses to list" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Add">
          <CoursesCompVue @selectedCheckboxes="handleSelectedCheckboxes" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import CoursesCompVue from "src/components/CoursesComp.vue";
import { axios } from "../../boot/axios";
import { Notify } from "quasar";
let tab = ref("Add");
let data = ref({});
let errors = ref({});
let loading = ref(false);
let saveSelected = ref(false);
let selectedCheckboxes = ref([]);
let selectedUnassignCheckboxes = ref([]);
let selectInstructor = ref(false);
let unassignselectInstructor = ref(false);
let selectedIntructor = ref("");
let unassignselectedIntructor = ref("");

// console.log(axios);
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
