<template>
  <div class="setting-date">
    <div class="setting-title">
      <div class="title">飞行排期设置</div>
      <i class="el-icon-close" @click="closeSettingDate"></i>
    </div>
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
        <div class="week" v-if="ruleForm.frequency == '周'">
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
        <div class="moon" v-if="ruleForm.frequency == '月'">
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
          @change="inspectionChange"
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
          value-format="yyyy-MM-dd"
          placeholder="选择开始日期"
          @change="startTimeChange"
          :picker-options="startPicker"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker
          v-model="ruleForm.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          @change="endTimeChange"
          :picker-options="endPicker"
          placeholder="选择结束日期"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const now = new Date();
export default {
  name: "SettingDate",
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
          label: "日",
          checked: false,
        },
      ],
      ruleForm: {
        frequency: "天",
        inspection: "",
        checkedCharacters: [],
        startDate: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
        endDate: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`,
      },
      options: [
        {
          value: "天",
          label: "天",
        },
        {
          value: "周",
          label: "周",
        },
        {
          value: "月",
          label: "月",
        },
      ],
      rules: {},
      inspectionTimes: [
        {
          value: "全天",
          label: "全天",
        },
        {
          value: "9:00-12:00",
          label: "9:00-12:00",
        },
        {
          value: "12:00-17:00",
          label: "12:00-17:00",
        },
        {
          value: "17:00-21:00",
          label: "17:00-21:00",
        },
      ],
      moonList: [],
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
    times() {
      // 初始化数组和起始时间
      let times = [];
      let startHour = 9; // 起始时间小时部分
      let startMinute = 0; // 起始时间分钟部分

      // 设置循环次数
      let n = 9; // 生成9个时间

      for (let i = 0; i < n; i++) {
        // 格式化时间为 "HH:MM" 形式并加入数组
        let hourStr = startHour.toString().padStart(2, "0");
        let minuteStr = startMinute.toString().padStart(2, "0");
        let timeStr = `${hourStr}:${minuteStr}`;
        times.push(timeStr);

        // 增加1小时30分钟
        startMinute += 30;
        if (startMinute >= 60) {
          startHour += 1;
          startMinute -= 60;
        }

        startHour += 1;
      }
      return times;
    },
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
    currentInfo() {
      let info = "";
      switch (this.ruleForm.frequency) {
        case "天":
          info = `${this.ruleForm.startDate}到${this.ruleForm.endDate} 每天 ${this.ruleForm.inspection} 执行1次`;
          break;
        case "周":
          let checkedItemArr = this.characters.filter((item) => item.checked);
          let checkedInfo = checkedItemArr.map((item) => item.label).join(",");
          info = `${this.ruleForm.startDate}到${this.ruleForm.endDate} 每周${checkedInfo} ${this.ruleForm.inspection} 执行，共执行${this.frequencyLength}次`;
          break;
        case "月":
          let monthItemArr = this.moonList.filter((item) => item.checked);
          let monthinfo = monthItemArr.map((item) => item.label).join(",");
          info = `${this.ruleForm.startDate}到${this.ruleForm.endDate} 每月${monthinfo}号 ${this.ruleForm.inspection} 执行，共执行${this.frequencyLength}次`;
        default:
          break;
      }

      return info;
    },
  },
  created() {
    this.getMoons();
  },
  methods: {
    closeSettingDate() {
      this.$emit("closeSettingDate");
    },
    formatInfo() {
      this.$emit("updateFormatInfo", this.currentInfo);
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
      this.$emit("frequencyChange", value);
    },
    inspectionChange(val) {
      let value = 0;
      switch (val) {
        case "全天":
          value = 3;
          break;
        case "9:00-12:00":
          value = 0;
          break;
        case "17:00-21:00":
          value = 2;
          break;
        case "12:00-17:00":
          value = 1;
          break;
        default:
          break;
      }
      this.$emit("schedulingType", value);
      this.formatInfo();
    },
    startTimeChange(val) {
      const startDate = new Date(val);
      const endDate = new Date(this.ruleForm.endDate);
      if (startDate.getTime() > endDate.getTime()) {
        this.ruleForm.endDate = val;
        this.$emit("endTime", val);
      }
      this.$emit("startTime", val);
      this.formatInfo();
    },
    endTimeChange(val) {
      this.$emit("endTime", val);
      this.formatInfo();
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
      let dateArr = this.characters
        .filter((item) => item.checked)
        .map((it) => it.value);
      console.log(dateArr, "datearr");

      this.$emit("dateArrays", dateArr);

      this.formatInfo();
    },
    checkedMoonItem(item) {
      item.checked = !item.checked;
      let dateArr = this.moonList
        .filter((item) => item.checked)
        .map((it) => it.value);
      this.$emit("dateArrays", dateArr);
      this.formatInfo();
    },
  },
};
</script>

<style lang="scss">
.setting-date {
  position: absolute;
  top: calc(15vh - 52px);
  right: 365px;
  width: 353px;
  height: 620px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 12px 12px 12px 12px;
  padding: 0 24px;
  .setting-title {
    width: 100%;
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-family: Alibaba PuHuiTi 3, Alibaba PuHuiTi 30;
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
    i {
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
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
  }
  .characters-group {
    .el-checkbox {
      margin-right: 27px;
      margin-left: 0 !important;
      margin-bottom: 10px;
    }
  }
  .el-checkbox-group {
    margin-top: 18px;
  }
  .inspection-select {
    .el-input {
      width: 220px;
      .el-input__inner {
        width: 220px;
      }
    }
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
  .moon {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-top: 16px;
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
</style>