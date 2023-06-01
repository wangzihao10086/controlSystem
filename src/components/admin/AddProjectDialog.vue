<template>
  <el-dialog
    v-model="dialogVisible"
    :title="type == 'add' ? '新增规则' : '修改规则'"
    width="800px"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item :label="fieldList['rule_name']" prop="rule_name">
        <el-input
          v-model="formData.rule_name"
          :placeholder="fieldList['rule_name']"
        />
      </el-form-item>
      <el-form-item :label="fieldList['projector']" prop="projector">
        <el-select
          v-model="formData.projector"
          :placeholder="fieldList['projector']"
        >
          <el-option label="alibaba" value="alibaba" />
          <el-option label="titok" value="titok" />
        </el-select>
        <!-- <el-cascader
          :props="cascaderProps"
          :options="cascaderOptions"
          :show-all-levels="false"
          :placeholder="fieldList['projector']"
          clearable
          v-model="formData.options"
        /> -->
      </el-form-item>
      <el-form-item :label="fieldList['device_name']" prop="device_name">
        <el-select
          v-model="formData.device_name"
          :placeholder="fieldList['device_name']"
          clearable
        >
          <el-option label="alibaba" value="alibaba" />
          <el-option label="titok" value="titok" />
        </el-select>
      </el-form-item>
      <el-form-item :label="fieldList['user_name']" prop="user_name">
        <el-select
          v-model="formData.user_name"
          :placeholder="fieldList['user_name']"
          clearable
        >
          <el-option label="alibaba" value="alibaba" />
          <el-option label="titok" value="titok" />
        </el-select>
      </el-form-item>
      <el-form-item :label="fieldList['url']" prop="url">
        <el-select
          v-model="formData.url"
          :placeholder="fieldList['url']"
          clearable
        >
          <el-option label="alibaba" value="alibaba" />
          <el-option label="titok" value="titok" />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="type == 'update'"
        :label="fieldList['fail_reason']"
        prop="fail_reason"
      >
        <el-input
          v-model="formData.fail_reason"
          :placeholder="fieldList['fail_reason']"
        />
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
import { computed, reactive, ref, watch } from "vue";

import { ElForm, ElMessage } from "element-plus";
import type { FormRules } from "element-plus";

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  type: {
    type: String,
    default: "add",
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
});

// const cascaderProps = {
//   multiple: true,
//   expandTrigger: "hover" as const,
// };

const dialogVisible = computed({
  get() {
    return props.show;
  },
  set(value) {
    console.log(value);
    controlDialog(value);
  },
});

const cascaderOptions = [
  {
    value: "tencent",
    label: "腾讯",
    children: [
      {
        value: "device_name",
        label: "设备",
        children: [
          {
            value: "disciplines",
            label: "Disciplines",
          },
          {
            value: "navigation",
            label: "Navigation",
          },
        ],
      },
      {
        value: "user_name",
        label: "用户",
        children: [
          {
            value: "basic",
            label: "Basic",
          },
          {
            value: "form",
            label: "Form",
          },
          {
            value: "data",
            label: "Data",
          },
          {
            value: "notice",
            label: "Notice",
          },
          {
            value: "navigation",
            label: "Navigation",
          },
          {
            value: "others",
            label: "Others",
          },
        ],
      },
      {
        value: "url",
        label: "内容",
        children: [
          {
            value: "axure",
            label: "Axure Components",
          },
          {
            value: "sketch",
            label: "Sketch Templates",
          },
          {
            value: "docs",
            label: "Design Documentation",
          },
        ],
      },
    ],
  },
  {
    value: "bytedance",
    label: "字节跳动",
    children: [
      {
        value: "device_name",
        label: "设备",
        children: [
          {
            value: "disciplines",
            label: "Disciplines",
          },
          {
            value: "navigation",
            label: "Navigation",
          },
        ],
      },
      {
        value: "user_name",
        label: "用户",
        children: [
          {
            value: "basic",
            label: "Basic",
          },
          {
            value: "form",
            label: "Form",
          },
          {
            value: "data",
            label: "Data",
          },
          {
            value: "notice",
            label: "Notice",
          },
          {
            value: "navigation",
            label: "Navigation",
          },
          {
            value: "others",
            label: "Others",
          },
        ],
      },
      {
        value: "url",
        label: "内容",
        children: [
          {
            value: "axure",
            label: "Axure Components",
          },
          {
            value: "sketch",
            label: "Sketch Templates",
          },
          {
            value: "docs",
            label: "Design Documentation",
          },
        ],
      },
    ],
  },
  {
    value: "lebo",
    label: "乐播科技",
    children: [
      {
        value: "device_name",
        label: "设备",
        children: [
          {
            value: "disciplines",
            label: "Disciplines",
          },
          {
            value: "navigation",
            label: "Navigation",
          },
        ],
      },
      {
        value: "user_name",
        label: "用户",
        children: [
          {
            value: "basic",
            label: "Basic",
          },
          {
            value: "form",
            label: "Form",
          },
          {
            value: "data",
            label: "Data",
          },
          {
            value: "notice",
            label: "Notice",
          },
          {
            value: "navigation",
            label: "Navigation",
          },
          {
            value: "others",
            label: "Others",
          },
        ],
      },
      {
        value: "url",
        label: "内容",
        children: [
          {
            value: "axure",
            label: "Axure Components",
          },
          {
            value: "sketch",
            label: "Sketch Templates",
          },
          {
            value: "docs",
            label: "Design Documentation",
          },
        ],
      },
    ],
  },
];

const formRef = ref();
const formData = reactive({
  rule_name: "",
  projector: "",
  device_name: "",
  user_name: "",
  url: "",
  fail_reason: "",
  status: 0,
  options: [],
});

// 自定义校验规则：设备、用户、url至少选择一项
const validateName = (rule, value, callback) => {
  console.log(formData);
  if (!formData.user_name && !formData.device_name && !formData.url) {
    callback(new Error("设备、用户、url至少选择一项"));
  } else {
    // 三个值任意值被填写，清除验证提示
    if (formData.user_name || formData.device_name || formData.url) {
      formRef.value?.clearValidate("user_name");
      formRef.value?.clearValidate("device_name");
      formRef.value?.clearValidate("url");
    }
    callback();
  }
};

const rules: FormRules = {
  rule_name: [
    {
      required: true,
      message: "请输入规则名称",
      trigger: "blur",
    },
  ],
  projector: [{ required: true, message: "请选择限定投屏商" }],
  device_name: [
    {
      required: true,
      message: "设备、用户、url至少选择一项",
      trigger: "change",
      validator: validateName,
    },
  ],
  user_name: [
    {
      required: true,
      message: "设备、用户、url至少选择一项",
      trigger: "change",
      validator: validateName,
    },
  ],
  url: [
    {
      required: true,
      message: "设备、用户、url至少选择一项",
      trigger: "change",
      validator: validateName,
    },
  ],
};

// 通过父组件修改 show 的值
const controlDialog = (value: boolean) => {
  emits("update:modelValue", value);
  formRef.value?.resetFields();
  formData.options = [];
};

// 确认提交发送请求
const addPolicyRequset = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (props.type == "add") {
        ElMessage({
          type: "success",
          message: "新增成功",
        });
      } else {
        ElMessage({
          type: "success",
          message: "修改成功",
        });
      }
    }
  });
};
// 监听 props data 的变化，判断当前是添加还是修改
watch(
  () => props.data,
  () => {
    if (props.type == "update") {
      formData.rule_name = props.data?.rule_name;
      formData.projector = props.data?.projector;
      formData.device_name = props.data?.device_name;
      formData.user_name = props.data?.user_name;
      formData.url = props.data?.url;
      formData.fail_reason = props.data?.fail_reason;
      formData.status = props.data?.status;
    } else {
      formRef.value?.resetFields();
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped></style>
