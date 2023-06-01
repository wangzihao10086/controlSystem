<template>
  <el-dialog v-model="dialogVisible" title="新增规则" width="800px">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item :label="fieldList['rule_name']" prop="rule_name">
        <el-input v-model="formData.rule_name" placeholder="规则名称" />
      </el-form-item>
      <el-form-item :label="fieldList['rule_type']" prop="rule_type">
        <el-select v-model="formData.rule_type" placeholder="规则类型">
          <el-option label="白名单" value="white" />
          <el-option label="黑名单" value="black" />
        </el-select>
      </el-form-item>
      <el-form-item :label="fieldList['matching_mode']" prop="matching_mode">
        <el-select v-model="formData.matching_mode" placeholder="匹配方式">
          <el-option label="前缀匹配" value="prefix" />
          <el-option label="后缀匹配" value="suffix" />
          <el-option label="完全匹配" value="fully" />
          <el-option label="正则匹配" value="regex" />
        </el-select>
      </el-form-item>
      <el-form-item :label="fieldList['rule']" prop="rule">
        <el-input v-model="formData.rule" placeholder="匹配规则" />
      </el-form-item>
      <el-form-item :label="fieldList['action']" prop="action">
        <el-select v-model="formData.action" placeholder="指令">
          <el-option label="拦截" value="forbidden" />
          <el-option label="免审" value="auditFree" />
          <el-option label="内容审核" value="auditRequired" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="controlDialog(false)"> 取消 </el-button>
        <el-button type="primary" @click="addPolicyRequset"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
// const dialogVisible = ref(false);

import { ElForm, ElMessage } from "element-plus";
// import type { FormRules } from "element-plus";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
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
});

const formRef = ref();

const dialogVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    controlDialog(value);
  },
});

const formData = reactive({
  rule_name: "",
  rule_type: "white",
  matching_mode: "prefix",
  rule: "",
  action: "auditRequired",
});

const rules: FormRules = {
  rule_name: [
    {
      required: true,
      message: "请输入规则名称",
      trigger: "blur",
    },
  ],
  rule_type: [{ required: true }],
  matching_mode: [{ required: true }],
  rule: [{ required: true, message: "请输入规则", trigger: "blur" }],
  action: [{ required: true }],
};

const controlDialog = (value: boolean) => {
  emits("update:modelValue", value);
  formRef.value?.resetFields();
};

const addPolicyRequset = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      ElMessage({
        type: "success",
        message: "提交成功",
      });
    }
  });
};
</script>

<style lang="scss" scoped></style>
