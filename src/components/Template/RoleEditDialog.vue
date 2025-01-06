<template>
  <el-dialog
    title="编辑角色"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="form.roleDesc"></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-switch
          v-model="form.status"
          :active-value="0"
          :inactive-value="1"
        ></el-switch>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="小程序" name="miniProgram"> </el-tab-pane>
          <el-tab-pane label="看板大屏" name="dashboard"></el-tab-pane>
          <el-tab-pane label="管理侧" name="admin"></el-tab-pane>
        </el-tabs>
        <div v-if="activeName == 'miniProgram'">
          <tree-promission :data="data" :show-checkbox="true"></tree-promission>
        </div>
        <div v-if="activeName == 'dashboard'">
          <tree-promission
            :data="data1"
            :show-checkbox="true"
          ></tree-promission>
        </div>
        <div v-if="activeName == 'admin'">
          <tree-promission
            :data="data2"
            :show-checkbox="true"
          ></tree-promission>
        </div>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import TreePromission from "./TreePromission.vue";
export default {
  components: {
    TreePromission,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
      activeName: "admin",
      data: [
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      data1: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
      ],
      data2: [
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleClose() {
      this.$emit("updateDialogVisible", false);
    },
    handleSave() {
      console.log(this.form);
      this.handleClose();
    },
  },
};
</script>

<style>
</style>