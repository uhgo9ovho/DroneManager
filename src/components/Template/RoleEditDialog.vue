<template>
    <el-dialog title="编辑角色" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    handleClose() {
      this.$emit("updateDialogVisible", false);
    },
  },
};
</script>

<style>

</style>