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
            <span style="padding-right: 20px"
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
              v-for="item in pickerOptions"
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
            value-format="yyyy-MM-dd"
            :picker-options="startPicker"
            @change="changeStartDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="ruleForm.endDate"
            type="date"
            placeholder="选择结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="endPicker"
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
      startPicker: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        },
        selectableRange:
          new Date().getHours() +
          ":" +
          (new Date().getMinutes() + 1) +
          ":00" +
          " - 23:59:59",
      },
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
      pickerOptions: [
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
    endPicker: (vm) => {
      return {
        disabledDate: (time) => {
          let beginDateVal = `${vm.ruleForm.startDate}`;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() +
                1 * 24 * 60 * 60 * 1000 -
                16.64e7
            );
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      };
    },
    frequencyLength() {
      switch (this.ruleForm.frequency) {
        case 0:
          return 1;
        case 1:
          let charactersLength = this.characters.filter(
            (item) => item.checked
          ).length;
          if (charactersLength < 1) charactersLength = 1;
          return charactersLength;
        case 2:
          let moonListLength = this.moonList.filter(
            (item) => item.checked
          ).length;
          if (moonListLength < 1) moonListLength = 1;
          return moonListLength;
      }
    },
    currentInfo() {
      let info = "";
      switch (this.ruleForm.frequency) {
        case 0:
          const inspection = this.pickerOptions.filter(
            (item) => item.value == this.ruleForm.inspection
          )[0].label;
          info = `${this.ruleForm.startDate}到${this.ruleForm.endDate} 每天 ${inspection} 执行1次`;
          break;
        case 1:
          let checkedItemArr = this.characters.filter((item) => item.checked);
          let checkedInfo = checkedItemArr.map((item) => item.label).join(",");
          const inspection1 = this.pickerOptions.filter(
            (item) => item.value == this.ruleForm.inspection
          )[0].label;
          info = `${this.ruleForm.startDate}到${this.ruleForm.endDate} 每周${checkedInfo} ${inspection1} 执行，共执行${this.frequencyLength}次`;
          break;
        case 2:
          let monthItemArr = this.moonList.filter((item) => item.checked);
          let monthinfo = monthItemArr.map((item) => item.label).join(",");
          const inspection2 = this.pickerOptions.filter(
            (item) => item.value == this.ruleForm.inspection
          )[0].label;

          info = `${this.ruleForm.startDate}到${this.ruleForm.endDate} 每月${monthinfo}号 ${inspection2} 执行，共执行${this.frequencyLength}次`;
        default:
          break;
      }

      return info;
    },
  },
  methods: {
    changeStartDate(date) {
      const startDate = new Date(date);
      const endDate = new Date(this.ruleForm.endDate);
      if(startDate.getTime() > endDate.getTime()) {
        this.ruleForm.endDate = date;
      }
    },
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
        airlineNumber: this.flightDataInfo.airlineNumber,
        note: this.currentInfo,
        orgId: localStorage.getItem("org_id"),
      };
      if (!params.timesType) delete params["dateArrays"];

      addAndEditTask(params).then((res) => {
        console.log(res, "aaa");
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.$emit("changeVisible");
        } else {
          this.$message.error(res.msg);
        }
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
      this.dateArr = this.characters
        .filter((item) => {
          if (item.checked) {
            return item.value;
          }
        })
        .map((it) => it.value);
    },
    checkedMoonItem(item) {
      console.log(item);

      item.checked = !item.checked;
      this.dateArr = this.moonList
        .filter((item) => {
          if (item.checked) {
            return item.value;
          }
        })
        .map((it) => it.value);
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
