<template>
  <div class="input-number">
    <el-input-number
      v-model="valueNumber"
      :min="min"
      :max="max"
      @change="handleChange"
    ></el-input-number>
    <span v-if="unit">{{ unit }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    unit: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      valueNumber: this.value,
    };
  },
  methods: {
    handleChange(value) {
      this.$emit("inputChange", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-number {
  position: relative;
  display: inline-block;
  span {
    position: absolute;
    right: 50px;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    color: #b4acac;
  }
}
</style>

