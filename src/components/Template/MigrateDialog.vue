<template>
  <el-drawer
    title="迁移成员"
    :visible.sync="mirgrateVisible"
    :before-close="handleClose"
    custom-class="mirgrate-dialog"
  >
    <div class="mirgrate-box">
      <div class="title">迁移人员目标部门</div>
      <div class="mirgrate-list" :class="{'is-active': item.checked}" v-for="(item, index) in formatData" :key="index" @click="checkedItem(item)">
        <div class="list-left">
          <div class="deptlist">{{ item.dept_name.slice(0, 2) }}</div>
          <div class="dept_name">{{ item.dept_name }}</div>
        </div>
        <div class="list-icon el-icon-check"></div>
      </div>
    </div>
    <div class="btn">
      <el-button class="clear-btn">取消</el-button>
      <el-button class="save-btn">保存</el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "MigrateDialog",
  props: {
    mirgrateVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formatData: []
    };
  },
  mounted() {
    this.formatData = this.data.map(item => {
      return {
        ...item, checked: false
      }
    })
    
  },
  methods: {
    handleClose() {
      this.$emit("mirgrateHandle");
    },
    checkedItem(item) {
      this.formatData.forEach(item => {
        item.checked = false;
      })
      item.checked = true;
    }
  },
};
</script>

<style lang="scss">
.mirgrate-dialog {
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
    .mirgrate-box {
      flex: 1;
      overflow: auto;
      .mirgrate-list {
        height: 48px;
        padding: 8px 20px 8px 12px;
        border-radius: 12px;
        margin-top: 8px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        &:hover {
          background-color: #f5f5f6;
        }
        .list-icon {
          display: none;
          color: #0271e3;
        }
        .list-left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .deptlist {
          width: 32px;
          height: 32px;
          line-height: 32px;
          opacity: 0.8;
          background: #0271e3;
          border-radius: 18px;
          border-radius: 50%;
          font-weight: 500;
          font-size: 10.5px;
          color: #fff;
          text-align: center;
          margin-right: 12px;
        }
      }
      .is-active {
        background-color: #f5f5f6;
        .list-icon {
          display: block;
        }
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
}
</style>