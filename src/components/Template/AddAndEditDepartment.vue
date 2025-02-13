<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :before-close="handleClose"
    custom-class="department-dialog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      label-position="top"
      height="500px"
      ref="Reform"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          placeholder="请输入部门名称"
          v-model="ruleForm.name"
          maxlength="20"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model.trim="ruleForm.desc"
          maxlength="50"
          show-word-limit
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button class="clear-btn" @click="handleClose">取消</el-button>
      <el-button class="save-btn" @click="saveBtn">保存</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { addDept, editDeptInfo } from '@/api/user.js'

export default {
  name: 'AddAndEditDepartment',
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新建部门'
    },
    itemRow: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' },
          {
            required: true,
            transform: (value) => value && value.trim(),
            message: '部门名称不能全部为空',
            trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    saveBtn() {
      this.$refs.Reform.validate((valid) => {
        if (valid) {
          if (this.title == '新建部门') {
            const params = {
              orgDeptName: this.ruleForm.name,
              isOrg: 0,
              orgId: +localStorage.getItem('org_id'),
              marker: this.ruleForm.desc
            }
            addDept(params).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.$emit('updateList')
                this.handleClose()
              } else {
                this.$message.error(res.msg)
              }

            })
          } else {
            //编辑保存
            if (!this.ruleForm.name) {
              return
            }
            const params = {
              id: this.itemRow.id,
              createId: this.itemRow.createId,
              orgDeptName: this.ruleForm.name,
              marker: this.ruleForm.desc
            }
            editDeptInfo(params).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                this.$emit('editSuccess')
                this.$emit('updateList')
                this.handleClose()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        } else {
          return false;
        }
      });

    }
  },
  mounted() {
    if (this.title == '编辑部门') {
      this.ruleForm.name = this.itemRow.orgDeptName
      this.ruleForm.desc = this.itemRow.marker
    }
  }
}
</script>

<style lang="scss">
.department-dialog {
  width: 420px;

  .el-drawer__header {
    color: #000;
    font-weight: bold;
  }

  .el-drawer__body {
    padding: 10px 20px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }

  .el-form {
    flex: 1;
  }

  .el-input {
    .el-input__inner {
      border: 1px solid transparent !important;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      height: 36px;
      line-height: 36px;
    }
  }

  .el-textarea {
    .el-textarea__inner {
      border: 1px solid transparent !important;
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      height: 120px;
    }
  }

  .btn {
    display: flex;

    .clear-btn {
      width: 136px;
      height: 40px;
      line-height: 40px;
      border-radius: 50px;
      font-weight: 550;
      font-size: 16px;
      text-align: center;
      padding: 0;
    }

    .save-btn {
      flex: 1;
      margin-left: 16px;
      color: #fff;
      height: 40px;
      line-height: 40px;
      border-radius: 50px;
      font-weight: 550;
      font-size: 16px;
      text-align: center;
      background: #0271e3;
      padding: 0;
      cursor: pointer;
    }
  }
}
</style>
