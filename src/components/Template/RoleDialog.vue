<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <el-form :model="form" label-width="80px" :rules="rules" ref="roleFrom">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="roleKey">
        <el-input
          v-model="form.roleKey"
          :disabled="title == '编辑角色'"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色状态">
        <el-switch
          v-model="form.status"
          active-value="0"
          inactive-value="1"
        ></el-switch>
      </el-form-item>
      <el-form-item label="角色权限" prop="menuIds">
        <el-tabs v-model="activeName">
          <el-tab-pane label="管理侧" name="admin"></el-tab-pane>
          <el-tab-pane label="看板大屏" name="dashboard"></el-tab-pane>
          <el-tab-pane label="小程序" name="miniProgram"> </el-tab-pane>
        </el-tabs>
        <div
          class="role-selector"
          v-show="activeName == 'miniProgram'"
          style="overflow-y: scroll"
        >
          <tree-promission
            ref="programsRef"
            :checkedKeys="checkedKeysObj.miniProgram"
            :data="programsPermissions"
            :show-checkbox="true"
            @selectedKeys="selectedKeys"
          ></tree-promission>
        </div>
        <div class="role-selector" v-show="activeName == 'dashboard'">
          <tree-promission
            ref="screenRef"
            :data="screenPermissions"
            :checkedKeys="checkedKeysObj.dashboard"
            :show-checkbox="true"
            @selectedKeys="selectedKeys"
          ></tree-promission>
        </div>
        <div class="role-selector" v-show="activeName == 'admin'">
          <tree-promission
            ref="managerRef"
            :data="managerPermissions"
            :show-checkbox="true"
            :checkedKeys="checkedKeysObj.admin"
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
import { roleMenuTreeselectAPI, editRoleAPI, addRoleAPI } from "@/api/orgModel";
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
    title: {
      type: String,
      default: "添加角色",
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
    let validatePass = (rules, value, callback) => {
      if (this.form.menuIds.length) {
        callback();
      } else {
        callback(new Error("请至少选择一个权限"));
      }
    };
    return {
      form: {
        roleName: "",
        remark: "",
        status: "1",
        roleKey: "",
        roleSort: 1,
        menuIds: [],
      },
      checkedKeys: [],
      activeName: "admin",
      halfCheckedKeys: [],
      checkedKeysObj: {
        admin: [],
        dashboard: [],
        miniProgram: [],
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "请输入角色标识", trigger: "blur" },
        ],
        menuIds: [
          {
            type: "array",
            required: true,
            validator: validatePass,
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    if (this.title === "编辑角色") {
      this.form = Object.assign({}, this.row);
      this.roleMenuTreeselect();
    }
  },
  methods: {
    selectedKeys(checkedKeys, halfCheckedKeys) {
      // 只更新当前激活标签页的选中状态
      this.checkedKeysObj[this.activeName] = checkedKeys || [];
      console.log(`${this.activeName}模块权限更新为:`, checkedKeys);
      this.halfCheckedKeys.push(...halfCheckedKeys);
      this.$refs["roleFrom"].clearValidate(["menuIds"]);
    },
    handleClose() {
      this.resetCheckedKeys();
      this.$emit("updateDialogVisible", false);
    },
    handleSave() {
      this.form.menuIds = [
        ...new Set([
          ...(this.checkedKeysObj.admin || []),
          ...(this.checkedKeysObj.dashboard || []),
          ...(this.checkedKeysObj.miniProgram || []),
        ]),
      ];
      this.form.menuIds.push(...this.halfCheckedKeys);
      this.form.menuIds = [...new Set(this.form.menuIds)];
      console.log("保存前的权限数据:", this.form.menuIds);
      this.$refs.roleFrom.validate((valid) => {
        if (valid) {
          // 合并所有模块当前选中的权限

          if (this.title === "编辑角色") {
            editRoleAPI(this.form)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success(res.msg);
                  this.$emit("updateList");
                  this.handleClose();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.$message.error("操作失败");
              });
          } else {
            const params = {
              ...this.form,
              orgId: localStorage.getItem("org_id"),
            };
            addRoleAPI(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success(res.msg);
                  this.$emit("updateList");
                  this.handleClose();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.$message.error("操作失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    roleMenuTreeselect() {
      roleMenuTreeselectAPI(this.row.roleId).then((res) => {
        if (res.code == 200) {
          const allCheckedKeys = res.checkedKeys || [];
          const menus = res.menus || [];

          // 找到三个主模块的ID
          const adminModule = menus.find((item) => item.label === "管理侧");
          const dashboardModule = menus.find((item) => item.label === "大屏端");
          const miniProgramModule = menus.find(
            (item) => item.label === "小程序"
          );

          // 递归查找某个ID是否属于指定模块
          const isInModule = (id, moduleData) => {
            if (!moduleData) return false;

            const findId = (node) => {
              if (node.id === id) return true;
              if (node.children) {
                return node.children.some((child) => findId(child));
              }
              return false;
            };

            return findId(moduleData);
          };

          // 分类权限ID
          this.checkedKeysObj = {
            admin: allCheckedKeys.filter((id) => isInModule(id, adminModule)),
            dashboard: allCheckedKeys.filter((id) =>
              isInModule(id, dashboardModule)
            ),
            miniProgram: allCheckedKeys.filter((id) =>
              isInModule(id, miniProgramModule)
            ),
          };

          console.log("初始化各模块权限数据：", this.checkedKeysObj);
        }
      });
    },
    resetCheckedKeys() {
      this.checkedKeysObj = {
        admin: [],
        dashboard: [],
        miniProgram: [],
      };
    },
  },
};
</script>

<style>
.role-selector {
  margin-top: 10px;
  overflow-y: scroll;
}
</style>
