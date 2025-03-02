<template>
  <el-dialog
    :visible="DeviceDialogVisible"
    @close="handleClose"
    :title="deviceTitle"
    class="deviceDialog"
  >
    <el-form :model="deviceForm" :rules="rules" ref="ruleForm">
      <el-form-item label="设备id" prop="deviceId">
        <el-input
          v-model="deviceForm.deviceId"
          placeholder="请输入设备id"
          :maxlength="64"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="deviceForm.deviceName"
          placeholder="请输入设备名称"
          :maxlength="64"
        />
      </el-form-item>
      <el-form-item label="设备描述">
        <el-input
          v-model="deviceForm.deviceDesc"
          placeholder="请输入设备描述"
          :maxlength="64"
        />
      </el-form-item>
      <el-form-item label="经度" prop="lng">
        <el-input
          @input="handleInputLng"
          v-model.trim="deviceForm.lng"
          placeholder="请输入经度"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input
          v-model.trim="deviceForm.lat"
          placeholder="请输入纬度"
          @input="handleInputLat"
        />
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="deviceForm.deviceType" placeholder="请选择设备类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addDeviceAPI, editDeviceAPI } from "@/api/orgModel";
export default {
  name: "AddDeviceDialog",
  props: {
    DeviceDialogVisible: {
      type: Boolean,
      default: false,
    },
    itemOrgId: {
      type: Number,
      default: 0,
    },
    itemRow: {
      type: Object,
      default: null,
    },
    deviceTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      rules: {
        deviceId: [
          { required: true, message: "请输入设备id", trigger: "blur" },
        ],
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        lng: [{ required: true, message: "请输入经度", trigger: "blur" }],
        lat: [{ required: true, message: "请输入纬度", trigger: "blur" }],
      },
      deviceForm: {
        deviceName: "",
        deviceId: "",
        deviceDesc: "",
        deviceType: 0,
        lng: "",
        lat: "",
      },
      typeOptions: [
        {
          label: "飞行器",
          value: 0,
        },
        {
          label: "机场",
          value: 1,
        },
        {
          label: "遥控器",
          value: 2,
        },
        {
          label: "算法盒子",
          value: 3,
        },
        {
          label: "摄像头",
          value: 4,
        },
      ],
    };
  },
  mounted() {
    if (this.itemRow) {
      console.log(this.itemRow);
      let latlonArr = this.itemRow.location.split(',');
      this.deviceForm = this.itemRow;
      this.deviceForm.lng = latlonArr[0];
      this.deviceForm.lat = latlonArr[1];
    }
  },
  methods: {
    handleInputLng(value) {
      // 只允许数字和小数点
      const validValue = value.replace(/[^0-9.]/g, "");

      // 防止多个小数点
      const dotCount = validValue.split(".").length - 1;
      if (dotCount > 1) {
        this.deviceForm.lng = validValue.slice(0, -1); // 删除最后一个小数点
      } else {
        this.deviceForm.lng = validValue;
      }
    },
    handleInputLat(value) {
      // 只允许数字和小数点
      const validValue = value.replace(/[^0-9.]/g, "");

      // 防止多个小数点
      const dotCount = validValue.split(".").length - 1;
      if (dotCount > 1) {
        this.deviceForm.lat = validValue.slice(0, -1); // 删除最后一个小数点
      } else {
        this.deviceForm.lat = validValue;
      }
    },
    handleClose() {
      this.$emit("updateDeviceDialogVisible", false);
    },
    handleSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (this.itemRow) {
            // 编辑设备
            const params = {
              ...this.deviceForm,
              location: this.deviceForm.lng + "," + this.deviceForm.lat,
            };
            editDeviceAPI(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("编辑设备成功");
                  this.$emit("updateDeviceList");
                  this.handleClose();
                } else {
                  this.$message.error("编辑设备失败");
                }
              })
              .catch((err) => {
                this.$message.error("编辑设备失败");
              });
          } else {
            const params = {
              ...this.deviceForm,
              orgId: this.itemOrgId,
              location: this.deviceForm.lng + "," + this.deviceForm.lat,
            };
            addDeviceAPI(params)
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success("新增设备成功");
                  this.handleClose();
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                this.$message.error("新增设备失败");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.deviceDialog {
  padding: 0 20px !important;
}
</style>
