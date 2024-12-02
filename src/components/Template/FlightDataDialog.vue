<template>
  <div class="flight-data-dialog">
    <el-drawer
      title="飞行排期设置"
      :visible.sync="flyDateVisible"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="重复频率" prop="checkedCities">
          <div class="frequency-box">
            <span>每</span>
            <el-select
              v-model="ruleForm.frequency"
              placeholder="请选择"
              @change="frequencyChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span
              >执行<i>{{ frequencyLength }}</i
              >次</span
            >
          </div>
          <div class="week" v-if="ruleForm.frequency == 1">
            <div
              class="week-item"
              :class="{ 'is-active': item.checked }"
              v-for="item in characters"
              :key="item.value"
              @click="checkedItem(item)"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="moon" v-if="ruleForm.frequency == 2">
            <div
              class="moon-item"
              :class="{ 'is-active': item.checked }"
              v-for="item in moonList"
              :key="item.value"
              @click="checkedMoonItem(item)"
            >
              {{ item.label }}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="巡检时段" prop="inspection">
          <el-select
            v-model="ruleForm.inspection"
            placeholder="请选择"
            class="inspection-select"
          >
            <el-option
              v-for="item in inspectionTimes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="date"
            placeholder="选择开始日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="ruleForm.endDate"
            type="date"
            placeholder="选择结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="scheduleFooter">
            <el-button class="greyBtnColor" @click="handleClose"
              >取消</el-button
            >
            <el-button class="pri-btn" type="primary" @click="updateDate"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { addAndEditTask } from "@/api/TaskManager";
const now = new Date();
export default {
  props: {
    flyDateVisible: {
      type: Boolean,
      default: false,
    },
    flightDataInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      ruleForm: {
        frequency: "",
        inspection: "",
        checkedCharacters: [],
        startDate: `${now.getFullYear()}-${
          now.getMonth() + 1
        }-${now.getDate()}`,
        endDate: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
      },
      characters: [
        {
          value: 1,
          label: "一",
          checked: false,
        },
        {
          value: 2,
          label: "二",
          checked: false,
        },
        {
          value: 3,
          label: "三",
          checked: false,
        },
        {
          value: 4,
          label: "四",
          checked: false,
        },
        {
          value: 5,
          label: "五",
          checked: false,
        },
        {
          value: 6,
          label: "六",
          checked: false,
        },
        {
          value: 7,
          label: "天",
          checked: false,
        },
      ],
      options: [
        {
          value: 0,
          label: "天",
        },
        {
          value: 1,
          label: "周",
        },
        {
          value: 2,
          label: "月",
        },
      ],
      rules: {},
      inspectionTimes: [
        {
          value: 3,
          label: "全天",
        },
        {
          value: 0,
          label: "9:00-12:00",
        },
        {
          value: 1,
          label: "12:00-17:00",
        },
        {
          value: 2,
          label: "17:00-21:00",
        },
      ],
      moonList: [],
      dateArr: [],
    };
  },
  computed: {
    frequencyLength() {
      switch (this.ruleForm.frequency) {
        case "天":
          return 1;
        case "周":
          let charactersLength = this.characters.filter(
            (item) => item.checked
          ).length;
          if (charactersLength < 1) charactersLength = 1;
          return charactersLength;
        case "月":
          let moonListLength = this.moonList.filter(
            (item) => item.checked
          ).length;
          if (moonListLength < 1) moonListLength = 1;
          return moonListLength;
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit("closeFlightDateDialog");
    },
    frequencyChange(val) {
      let value = 0; //天
      switch (val) {
        case "天":
          value = 0;
          break;
        case "周":
          value = 1;
          break;
        case "月":
          value = 2;
          break;
        default:
          break;
      }
    },
    updateDate() {
      const params = {
        timesType: this.ruleForm.frequency,
        dateArrays: this.dateArr,
        schedulingType: this.ruleForm.inspection,
        startTime: this.formatDate(this.ruleForm.startDate),
        endTime: this.formatDate(this.ruleForm.endDate),
        taskId: this.flightDataInfo.taskId,
      };
      if (!params.timesType) delete params["dateArrays"];

      addAndEditTask(params).then((res) => {
        console.log(res, "aaa");
      });
    },
    getMoons() {
      this.moonList = [];
      for (let i = 1; i <= 31; i++) {
        this.moonList.push({
          value: i,
          label: i,
          checked: false,
        });
      }
    },
    checkedItem(item) {
      item.checked = !item.checked;
      this.dateArr = this.characters.filter((item) => {
        if (item.checked) {
          return item.value;
        }
      }).map(it => it.value);
    },
    checkedMoonItem(item) {
      console.log(item);
      
      item.checked = !item.checked;
      this.dateArr = this.moonList.filter((item) => {
        if (item.checked) {
          return item.value;
        }
      }).map(it => it.value);
    },
    formatDate(currentDate) {
      const date = new Date(currentDate);
      const formattedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
      return formattedDate;
    },
  },
  mounted() {
    this.getMoons();
    this.ruleForm.frequency = this.flightDataInfo.timesType;
    this.ruleForm.inspection = this.flightDataInfo.schedulingType;
    this.ruleForm.startDate = this.formatDate(this.flightDataInfo.startTime);
    this.ruleForm.endDate = this.formatDate(this.flightDataInfo.endTime);
    if (this.flightDataInfo.timesType == 1) {
      //周
      this.characters.forEach((item) => {
        if (this.flightDataInfo.dateArrays.includes(item.value)) {
          item.checked = true;
        }
      });
    } else if (this.flightDataInfo.timesType == 2) {
      //月
      this.moonList.forEach((item) => {
        if (this.flightDataInfo.dateArrays.includes(item.value)) {
          item.checked = true;
        }
      });
    }
  },
};
</script>

<style lang="scss">
.flight-data-dialog {
  .scheduleFooter {
    margin-top: 200px;
    .greyBtnColor {
      width: 136px;
      height: 40px;
      border-radius: 100px;
      border: 0;
      color: #000;
      background: #e2e4e4;
    }
    .pri-btn {
      width: 204px;
      height: 40px;
      background: #0271e3;
      border-radius: 100px;
      margin-left: 16px;
    }
  }
  .el-drawer {
    width: 420px !important;
  }
  .el-drawer__header {
    color: #000;
  }
  .el-drawer__body {
    padding-left: 20px;
    .inspection-select {
      width: 356px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 356px;
    }
    .week {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      .week-item {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #d3d3d3;
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        color: #000;
        cursor: pointer;
      }
      .is-active {
        width: 24px;
        height: 24px;
        background: #0271e3;
        border-radius: 50%;
        color: #fff;
      }
    }
    .frequency-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        font-weight: bold;
        color: rgba(2, 113, 227, 1);
      }
      .el-select {
        flex: 1 !important;
        padding: 0 30px;
      }
    }
    .moon {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      margin-top: 24px;
      .moon-item {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #d3d3d3;
        font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        font-style: normal;
        text-transform: none;
        color: #000;
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .is-active {
        width: 24px;
        height: 24px;
        background: #0271e3;
        border-radius: 50%;
        color: #fff;
      }
    }
  }
}
</style>