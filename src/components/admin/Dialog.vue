<template>
  <el-dialog
    :model-value="show"
    :title="type === 'review' ? '审核' : '查看'"
    width="800px"
  >
    <el-descriptions class="margin-top" :column="2" size="large" border>
      <template v-for="(value, key) in data" :key="key">
        <el-descriptions-item
          v-if="fieldList[key] && key != 'appSecret'"
          :label="fieldList[key]"
        >
          {{ key == "id_card_no" ? hideIdCard(value) : value }}
        </el-descriptions-item>
      </template>
    </el-descriptions>
    <template #footer>
      <slot name="footer"> </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// import { ref } from "vue";
// const dialogVisible = ref(false);

import { hideIdCard } from "@/assets/ts/functions.ts";

defineProps({
  type: {
    type: String,
    default: "view",
  },
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
  },
  fieldList: {
    type: Object,
  },
  hide: {
    type: Array,
  },
});
</script>

<style lang="scss" scoped></style>
