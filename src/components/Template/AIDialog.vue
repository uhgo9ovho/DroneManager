<template>
  <div class="AI_dialog">
    <el-drawer
      title="AI托管设置"
      :visible.sync="showAIDialog"
      :before-close="handleClose"
      :size="628"
    >
      <div class="ai-setting-search">
<!--        <el-input placeholder="搜索机场" v-model="value"></el-input>-->
      </div>
      <div class="ai-setting-content">
        <div class="ai-area-list">
          <div
            class="ai-area-item"
            v-for="(item, index) in aiAreaOptions"
            :key="index"
            :class="{ 'ai-area-selected': item.select }"
          >
            {{ item.label }} ({{ item.quantity }})
          </div>
        </div>
        <div class="ai-nest-list-wrap">
          <div class="head">
            <div>机场</div>
            <div>AI托管</div>
          </div>
          <div class="ai-nest-list">
            <div class="ai-nest-item">
              <div class="curr-nest">当前</div>
              <div style="flex: 1 1 0%">{{ taskOptions[0].label }}</div>
              <div>
                <el-switch v-model="openAI" @change="changeAI"></el-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { AIHostingAPI, selectAIHostingStatusAPI } from '@/api/TaskManager.js'
export default {
  name: "AIDialog",
  props: {
    showAIDialog: {
      type: Boolean,
      default: false,
    },
    taskOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      openAI: false,
      value: "",
      aiAreaOptions: [
        {
          label: "全部机场",
          quantity: 1,
          select: false,
        },
        {
          label: "西安市",
          quantity: 1,
          select: true,
        },
      ],
    };
  },
  methods: {

    selectAIHostingStatus() {
      selectAIHostingStatusAPI().then(res => {
        if(res.code === 200) {
          if(res.msg == '开启') {
            localStorage.setItem('AIStatus', true);
          } else {
            localStorage.setItem('AIStatus', false);
          }
        }
      })
    },
    handleClose() {
      this.$emit("handleClose");
    },
    changeAI(val) {
      AIHostingAPI(val ? 1 : 2).then(res => {
        if(res.code === 200) {
          if(res.msg == '开启') {
            localStorage.setItem('AIStatus', true);
          } else {
            localStorage.setItem('AIStatus', false);
          }
        }
      })
    }
  },
  mounted() {
    const AIStatus = JSON.parse(localStorage.getItem('AIStatus'));
    this.selectAIHostingStatus();
    if(AIStatus) {
      this.openAI = AIStatus;
    } else {
      this.openAI = false;
    }
  }
};
</script>

<style lang="scss">
.AI_dialog {
  .el-drawer {
    .el-drawer__header {
      font-weight: 600;
      font-size: 18px;
      color: #1d1d1f;
      line-height: 28px;
    }
    .el-drawer__body {
      height: 100%;
      width: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      padding: 28px 4px 14px 32px;
      .ai-setting-search {
        margin-bottom: 16px;
        margin-right: 32px;
        caret-color: #000;
        .el-input {
          .el-input__inner {
            border: 1px solid #dcdfe6;
          }
        }
      }
      .ai-setting-content {
        display: flex;
        flex-direction: row;
        flex: 1;
        overflow: hidden;
        .ai-area-list {
          border-right: 2px solid #e2e2e2;
          overflow-y: auto;
          background-color: #fff;
          width: 165px;
          padding-right: 15px;
          .ai-area-item {
            cursor: pointer;
            border-radius: 6px;
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 7px 16px;
            &:hover {
              background-color: #f5f5f5;
            }
          }
          .ai-area-selected {
            background-color: #f5f5f5;
            font-weight: 700;
          }
        }
        .ai-nest-list-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding-left: 16px;
          .head {
            height: 40px;
            font-weight: 400;
            font-size: 14px;
            color: #86868c;
            line-height: 40px;
            justify-content: space-between;
            padding-right: 48px;
            padding-left: 16px;
            display: flex;
            -webkit-box-direction: normal;
          }
          .ai-nest-list {
            font-weight: 400;
            font-size: 14px;
            color: #1d1d1f;
            letter-spacing: 0;
            line-height: 22px;
            overflow-y: auto;
            padding-right: 32px;
            flex: 1;
            .ai-nest-item {
              margin-bottom: 8px;
              padding-left: 16px;
              padding-right: 16px;
              display: flex;
              -webkit-box-direction: normal;
              font-weight: bold;
              .curr-nest {
                background: #dfefff;
                border-radius: 4px;
                font-weight: 400;
                font-size: 12px;
                color: #0271e3;
                padding: 1px 4px;
                margin-right: 6px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
