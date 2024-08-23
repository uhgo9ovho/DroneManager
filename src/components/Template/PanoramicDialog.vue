<template>
  <div class="qj-gird">
    <div class="qj-container">
      <div class="qj-view-position">
        <div class="panoramaComp"></div>
        <div class="qj-list-position">
          <div class="list-outer">
            <div class="qj-list-warp">
              <div class="qj-item"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="qj-map-info-wrap">
        <div class="task_back" @click="closeDialog">
          <i class="el-icon-close"></i>
        </div>
        <div class="qj-info-wrap qj-info-position">
          <div>
            <el-tooltip
              class="share"
              effect="dark"
              content="分享"
              placement="bottom"
            >
              <i class="el-icon-share"></i>
            </el-tooltip>
            <div class="title">【全景】比亚迪一期</div>
            <div class="nest">2024-08-19</div>
            <el-divider></el-divider>
            <div class="qj-info-item">
              <div class="qj-title">
                <i class="iconfont el-icon-xiazai20"></i>
                <div class="msg">全景地址</div>
              </div>
              <div class="qj-content">
                陕西省西安市周至县九峰镇,108省道北193米,集财路东北256米附近
              </div>
            </div>
            <div class="qj-info-item">
              <div class="qj-title">
                <i class="iconfont el-icon-guijifeihang"></i>
                <div class="msg">拍摄机场</div>
              </div>
              <div class="qj-content">西安-周至</div>
            </div>
            <div class="qj-info-item">
              <div class="qj-title">
                <i class="iconfont el-icon-feiji"></i>
                <div class="msg">航线名称</div>
              </div>
              <div class="qj-content">【全景】比亚迪一期</div>
            </div>
          </div>
        </div>
        <div class="qj-map">
          <MapContainer></MapContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "../MapContainer.vue";
export default {
  name: "PanoramicDialog",
  data() {
    return {};
  },
  components: {
    MapContainer,
  },
  methods: {
    closeDialog() {
        this.$emit('closeQJDialog')
    },
  },
};
</script>

<style lang="scss">
.qj-gird {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  background-color: rgba(29, 29, 31, 0.8);
  backdrop-filter: blur(5px);
  z-index: 1001;
  .qj-container {
    width: 1280px;
    height: 720px;
    border-radius: 12px;
    display: flex;
    .qj-view-position {
      width: 920px;
      border-radius: 12px 0 0 12px;
      height: 100%;
      box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.2);
      position: relative;
      background-color: pink;
      .panoramaComp {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0;
      }
      .qj-list-position {
        position: absolute;
        bottom: 0;
        padding: 12px 20px;
        width: 920px;
        overflow-x: auto;
        .list-outer {
          display: flex;
          align-items: center;
          .qj-list-warp {
            display: -webkit-box;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin: 10px 16px;
            caret-color: transparent;
            overflow-x: auto;
            overflow-y: hidden;
            width: calc(100% - 84px);
            .qj-item {
              position: relative;
              aspect-ratio: 4 / 3;
              margin-right: 12px;
              background-color: #f2f2f2;
              transform: scale(0.9);
              cursor: pointer;
              width: 96px;
              height: 72px;
              box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.34901960784313724);
              border-radius: 8px;
            }
            .selectedQj {
              transform: scale(1);
              border: 2px solid hsla(0, 0%, 100%, 0.8);
            }
          }
        }
      }
    }
    .qj-map-info-wrap {
      width: 360px;
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
      box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.050980392156862744);
      border-radius: 0 12px 12px 0;
      .task_back {
        overflow: hidden;
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 18px;
        position: absolute;
        right: -50px;
        top: 0px;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        font-size: 16px;
        cursor: pointer;
        color: #fff;
      }
      .qj-info-wrap {
        width: 100%;
        height: calc(100% - 250px);
        padding: 0 20px;
        overflow: hidden;
        position: relative;
        border-radius: 0 12px 0 0;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        .share {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.050980392156862744);
          border-radius: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .title {
          margin-top: 46px;
          height: 24px;
          font-weight: 500;
          font-size: 16px;
          color: #1d1d1f;
          text-align: center;
          line-height: 24px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          word-break: break-word;
        }
        .nest {
          margin-top: 6px;
          height: 18px;
          font-weight: 400;
          font-size: 12px;
          color: #6e6e73;
          text-align: center;
          line-height: 18px;
        }
        .qj-info-item {
          font-weight: 500;
          font-size: 13px;
          color: #1d1d1f;
          line-height: 24px;
          display: flex;
          flex-direction: column;
          margin-bottom: 24px;
          .qj-title {
            display: flex;
            align-items: center;
            i {
              font-size: 16px;
              margin-right: 8px;
            }
            .msg {
              width: 125px;
            }
          }
          .qj-content {
            font-weight: 400;
            font-size: 14px;
            color: #6e6e73;
          }
        }
      }
    }
    .qj-map {
      width: 360px;
      height: 250px;
    }
  }
}
</style>