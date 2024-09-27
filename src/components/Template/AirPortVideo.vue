<template>
  <div class="left-window-position"></div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.left-window-position {
    height: 80px;
  width: 130px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: calc(32px + 120px);
  left: 10px;
  z-index: 99;
  background-color: pink;
}
</style>