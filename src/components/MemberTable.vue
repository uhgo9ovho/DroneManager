<template>
  <div class="member-table">
    <common-table
      :tableList="memberList"
      :columns="columns"
      :total="total"
      :showSelection="true"
      @handleSelectionChange="handleSelectionChange"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
      :pageSize="params.pageSize"
      :pageNum="params.pageNum"
    >
      <template #dept-header>
        <span>所属部门</span>
        <el-dropdown>
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #auth-header>
        <span>所属角色</span>
        <el-dropdown>
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #status-header>
        <span>账号状态</span>
        <el-tooltip
          class="item"
          effect="dark"
          content="开启为正常状态，关闭为停用状态，停用后不可登录组织"
          placement="top"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </template>
      <template #userName="{ row }">
        <div class="user_info_box">
          <div class="user_headimg">
            <!-- <img :src="row.head_url" alt="" /> -->
            <img src="../assets/images/avatar.png" alt="" />
          </div>
          <div class="user_name_phone">
            <div class="user_name">{{ row.userName }}</div>
            <div class="user_tel">{{ row.phonenumber }}</div>
          </div>
        </div>
      </template>
      <template #orgDeptName="{ row }">
        {{ row.orgDeptName }}
      </template>
      <template #roleName="{ row }">
        {{ row.roleName }}
      </template>
      <!-- <template #bind="{ row }">
        <div class="bind_icon">
          <div class="wx_icon">
            <el-tooltip
              v-if="row.wx_bind == '已绑定'"
              class="item"
              effect="dark"
              content="微信已绑定"
              placement="top-start"
            >
              <i class="iconfont el-icon-weixin"></i>
            </el-tooltip>
            <el-tooltip
              v-else
              class="item"
              effect="dark"
              content="微信未绑定"
              placement="top-start"
            >
              <i class="iconfont el-icon-weixin1"></i>
            </el-tooltip>
          </div>
        </div>
      </template> -->
      <template #status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1">
        </el-switch>
      </template>
      <template #createTime="{ row }">
        {{ row.createTime | filterTime }}
      </template>
      <template #operate="scope">
        <el-button type="text" @click="editBtn(scope.row)" style="margin-right: 10px" v-permissions="'wrj:user:edit'">编辑</el-button>
        <!-- <el-button type="text" style="margin-right: 10px">调岗</el-button> -->

        <el-popconfirm :ref="`popover-${scope.$index}`" title="你确定要删除吗？" @confirm="confirm(scope.row)" v-permissions="'wrj:user:remove'">
          <el-button type="text" style="color: red" slot="reference" v-show="scope.row.roleName!=='组织管理员'"
            >删除</el-button
          >
        </el-popconfirm>
      </template>
    </common-table>
  </div>
</template>

<script>
import CommonTable from "./CommonTable.vue";
import { getUserList, deleteUser, searchUser } from "@/api/user.js";
export default {
  name: "MemberTable",
  data() {
    return {
      columns: [
        {
          prop: "userName",
          label: "成员",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "200",
        },
        {
          prop: "orgDeptName",
          label: "所在部门",
          slot: true,
          showOverflowTooltip: true,
        },
        {
          prop: "roleName",
          label: "所属角色",
          slot: true,
          showOverflowTooltip: false,
        },
        {
          prop: "inviterName",
          label: "添加/邀请人",
          showOverflowTooltip: false,
        },
        {
          prop: "createTime",
          label: "创建日期",
          slot: true,
          showOverflowTooltip: true,
        },
        // {
        //   prop: "bind",
        //   label: "微信",
        //   showOverflowTooltip: false,
        //   slot: true,
        // },
        // {
        //   prop: "status",
        //   label: "账号状态",
        //   showOverflowTooltip: false,
        //   slot: true,
        // },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "200px",
          slot: true,
        },
      ],
      memberList: [],
      total: 0,
      params: {
        pageSize: 10,
        pageNum: 1,
        orgId: this.$store.getters.orgId,
        nickName: "",
      },
    };
  },
  filters: {
    filterTime(e) {
      const date = new Date(e);

      // 提取各个部分
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以加 1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      // 组合成所需格式
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      return formattedDate
    },
  },
  components: {
    CommonTable,
  },
  methods: {
    confirm(row) {
      deleteUser(row.id).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.getList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    editBtn(row) {
      this.$emit("editMember", row);
    },
    getList() {
      getUserList(this.params).then((res) => {
        if (res.code === 200) {
          this.memberList = res.rows;
          this.total = res.total;
        }
      });
    },
    pageChange({ pageNum, pageSize }) {
      this.params.pageSize = pageSize;
      this.params.pageNum = pageNum;
      this.getList();
    },
    sizeChange({ pageNum, pageSize }) {
      this.params.pageSize = pageSize;
      this.params.pageNum = pageNum;
      this.getList();
    },
    searchList() {
      this.params.pageNum = 1;
      searchUser(this.params).then((res) => {
        if (res.code === 200) {
          this.memberList = res.rows;
          this.total = res.total;
        }
      });
    },
    handleSelectionChange(ids) {
      const idStr = ids.map((item) => item.id).join(',');
      this.$emit('deleteIds',idStr);
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss">
.member-table {
  .user_info_box {
    display: flex;
    .user_headimg {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user_name_phone {
      padding-left: 16px;
      .user_name {
        font-weight: 550;
        font-size: 14px;
        color: #1d1d1f;
        line-height: 22px;
        margin: 3px 0 1px 0;
      }
      .user_tel {
        font-weight: 400;
        font-size: 13px;
        color: #86868c;
        line-height: 18px;
      }
    }
  }
  .bind_icon {
    display: flex;
    .wx_icon {
      margin-right: 12px;
      .el-icon-weixin {
        color: #5ac53a;
        font-size: 24px;
      }
      .el-icon-weixin1 {
        font-size: 24px;
      }
    }
    .zzd_icon {
      .el-icon-zhezhengding {
        color: #5ac53a;
        font-size: 24px;
      }
      .el-icon-zhezhengding1 {
        font-size: 24px;
      }
    }
  }
}
</style>
