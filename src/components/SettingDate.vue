<template>
  <div class="setting-date">
    <div class="setting-title">
      <div class="title">飞行排期设置</div>
      <i class="el-icon-close"></i>
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
          <el-select v-model="ruleForm.frequency" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span
            >执行<i>{{ ruleForm.checkedTimes.length }}</i
            >次</span
          >
        </div>
        <el-checkbox-group v-model="ruleForm.checkedTimes" size="small" class="time-group">
          <el-checkbox v-for="item in times" :label="item" :key="item" border>{{
            item
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择结束日期">
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
      ruleForm: {
        frequency: "天",
        checkedTimes: [],
        startDate: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
        endDate: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
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
    };
  },
  computed: {
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
  .el-checkbox-group {
    margin-top: 18px;
    .el-checkbox {
      margin-right: 20px;
      margin-left: 0 !important;
      margin-bottom: 10px;
    }
  }
}
</style>