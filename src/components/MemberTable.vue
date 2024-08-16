<template>
  <div class="member-table">
    <common-table :tableList="memberList" :columns="columns">
      <template #dept-header>
        <span>所属部门</span>
        <el-dropdown>
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template #auth-header>
        <span>所属角色</span>
        <el-dropdown>
          <span class="el-dropdown-link iconfont el-icon-guolv filter-icon">
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
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
      <template #nick_name="{ row }">
        <div class="user_info_box">
          <div class="user_headimg">
            <img :src="row.head_url" alt="" />
          </div>
          <div class="user_name_phone">
            <div class="user_name">{{ row.nick_name }}</div>
            <div class="user_tel">{{ row.tel }}</div>
          </div>
        </div>
      </template>
      <template #auth="{ row }">
        {{ row.auth.join("") }}
      </template>
      <template #dept="{ row }">
        {{ row.dept.join("") }}
      </template>
      <template #bind="{ row }">
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
          <div class="zzd_icon">
            <el-tooltip
              class="item"
              effect="dark"
              content="浙政钉已绑定"
              placement="top-start"
              v-if="row.zzd_bind == '已绑定'"
            >
              <i class="iconfont el-icon-zhezhengding"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="浙政钉未绑定"
              placement="top"
              v-else
            >
              <i class="iconfont el-icon-zhezhengding1"></i>
            </el-tooltip>
          </div>
        </div>
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.status" active-value="0" inactive-value="1">
        </el-switch>
      </template>
      <template #operate="{ row }">
        <el-button type="text" @click="editBtn(row)">编辑</el-button>
        <el-button type="text" style="margin-right: 10px;">调岗</el-button>
        
        <el-popconfirm title="你确定要删除吗？">
          <el-button type="text" style="color: red" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </common-table>
  </div>
</template>

<script>
import { mockList3 } from "@/utils/mock.js";
import CommonTable from "./CommonTable.vue";
export default {
  name: "MemberTable",
  data() {
    return {
      columns: [
        {
          prop: "nick_name",
          label: "姓名",
          showOverflowTooltip: true,
          slot: true,
          minWidth: "100",
        },
        {
          prop: "dept",
          label: "所在部门",
          slot: true,
          showOverflowTooltip: true,
        },
        {
          prop: "auth",
          label: "所属角色",
          slot: true,
          showOverflowTooltip: false,
        },
        {
          prop: "create_by",
          label: "添加/邀请人",
          showOverflowTooltip: false,
        },
        {
          prop: "create_time",
          label: "创建日期",
          showOverflowTooltip: true,
        },
        {
          prop: "bind",
          label: "微信/浙政钉",
          showOverflowTooltip: false,
          slot: true,
        },
        {
          prop: "status",
          label: "账号状态",
          showOverflowTooltip: false,
          slot: true,
        },
        {
          prop: "operate",
          label: "操作",
          showOverflowTooltip: false,
          width: "200px",
          slot: true,
        },
      ],
    };
  },
  components: {
    CommonTable,
  },
  computed: {
    memberList() {
      return mockList3;
    },
  },
  methods: {
    editBtn(row) {
      this.$emit("editMember");
    },
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