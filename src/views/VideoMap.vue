<template>
    <div class="video-map">
      <video-map-wrap></video-map-wrap>
    </div>
  </template>
  
  <script>
  import VideoMapWrap from '../components/VideoMapWrap.vue';
  export default {
    name: "AirPort",
    components: {
      VideoMapWrap
    }
  }
  </script>
  
  <style lang="scss">
  .video-map {
    width: 100vw;
    height: 100vh;
  }
  </style>