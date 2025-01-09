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
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-switch
          v-model="form.status"
          active-value="0"
          inactive-value="1"
        ></el-switch>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-tabs v-model="activeName">
          <el-tab-pane label="管理侧" name="admin"></el-tab-pane>
          <el-tab-pane label="看板大屏" name="dashboard"></el-tab-pane>
          <el-tab-pane label="小程序" name="miniProgram"> </el-tab-pane>
        </el-tabs>
        <div v-show="activeName == 'miniProgram'">
          <tree-promission
            :checkedKeys="checkedKeys"
            :data="programsPermissions"
            :show-checkbox="true"
            @selectedKeys="selectedKeys"
          ></tree-promission>
        </div>
        <div v-show="activeName == 'dashboard'">
          <tree-promission
            :data="screenPermissions"
            :checkedKeys="checkedKeys"
            :show-checkbox="true"
            @selectedKeys="selectedKeys"
          ></tree-promission>
        </div>
        <div v-show="activeName == 'admin'">
          <tree-promission
            :data="managerPermissions"
            :show-checkbox="true"
            :checkedKeys="checkedKeys"
            @selectedKeys="selectedKeys"
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
import { mapState } from "vuex";
import { roleMenuTreeselectAPI, editRoleAPI } from "@/api/orgModel";
export default {
  components: {
    TreePromission,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    row: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    ...mapState("app", [
      "managerPermissions",
      "screenPermissions",
      "programsPermissions",
    ]),
  },
  data() {
    return {
      form: {
        roleName: "",
        remark: "",
        status: "1",
      },
      checkedKeys: [],
      activeName: "admin",
    };
  },
  created() {
    this.form = Object.assign({}, this.row);
    this.roleMenuTreeselect();
  },
  methods: {
    selectedKeys(checkedKeys) {
      console.log(checkedKeys,'aa');
      
    },
    handleClose() {
      this.$emit("updateDialogVisible", false);
    },
    handleSave() {
      console.log(this.form);
      console.log(this.$refs.tree);
      
      this.handleClose();
    },
    roleMenuTreeselect() {
      roleMenuTreeselectAPI(this.row.roleId).then((res) => {
        if (res.code == 200) {
          this.checkedKeys = res.checkedKeys;
        }
      });
    },
  },
};
</script>

<style>
</style>