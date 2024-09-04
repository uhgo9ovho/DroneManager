<template>
  <div class="photo-preview">
    <div class="imgPrewBox">
      <div class="innerImgBox">
        <ImageZoom src="http://fsimage.guihuao.com/images/38615a57-7181-4962-bdb1-b640614d6947/4928517202866343937.jpeg?imageMogr2/thumbnail/400x" />
      </div>
      <div class="close" @click="closePreview">
        <i class="el-icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ImageZoom from './ImageZoom.vue';
export default {
  name: "PhotoPreview",
  data() {
    return {};
  },
  components: {
    ImageZoom
  },
  methods: {
    closePreview() {
        this.$emit('closePreview')
    }
  },
  mounted() {
    
  },
};
</script>

<style lang="scss">
.photo-preview {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  .imgPrewBox {
    width: 100vh;
    height: 75vh;
    max-width: 1200px;
    max-height: 900px;
    border-radius: 12px;
    position: relative;
    .innerImgBox {
      border-radius: 8px;
      position: relative;
      width: 754px;
      height: 566px;
      background-color: #fff;
      user-select: none;
    }
    .close {
      width: 36px;
      height: 36px;
      background: hsla(0, 0%, 100%, 0.8509803921568627);
      border-radius: 18px;
      position: absolute;
      right: -40px;
      top: -40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
    }
  }
}
</style>