<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed type="index" width="50" />
    <el-table-column prop="company_name" label="公司全称" />
    <el-table-column prop="name" label="提交人" />
    <el-table-column prop="id_card_no" label="身份证号" />
    <el-table-column prop="phone" label="手机号" />
    <el-table-column prop="create_time" label="提交时间" />
    <el-table-column prop="update_time" label="修改时间" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button
          v-if="scope.row.status === 0"
          type="success"
          size="small"
          @click="handleClick(scope.row)"
          plain
          >审核</el-button
        >
        <el-button
          v-else
          type="primary"
          size="small"
          plain
          @click="handleClick(scope.row)"
          >查看</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
const handleClick = (info: object) => {
  console.log(info);
};

const tableData = [
  {
    create_time: "2016-05-03",
    update_time: "2023-06-01",
    user_id: "1631561",
    company_name: "乐播",
    company_desc: "无线投屏",
    homepage: "",
    licence_url: "Home",
    id_card_no: "441622200101011001",
    name: "lebo",
    phone: "1008611",
    status: 0,
  },
  {
    create_time: "2016-05-03",
    update_time: "2023-06-01",
    user_id: "1631561",
    company_name: "乐播",
    company_desc: "无线投屏",
    homepage: "",
    licence_url: "Home",
    id_card_no: "441622200101011001",
    name: "lebo",
    phone: "1008611",
    status: 1,
  },
];
</script>

<style lang="scss" scoped></style>
