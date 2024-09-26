<template>
  <div class="video-map-wrap">
    <map-container></map-container>
    <div class="topinfoBox">
      <div class="toppaln">
        <div class="toppaln_left">
          <div class="flight_name">一键起飞任务</div>
          <div class="nestListBox">
            <div class="select_nest">
              <el-select v-model="task" size="mini">
                <el-option
                  v-for="(item, index) in taskOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="tools-container debug_control">
              <el-tooltip class="item" effect="dark" content="远程调试">
                <i class="el-icon-setting" @click="showTools"></i>
              </el-tooltip>
              <div class="tools-box" v-if="toolsVisible">
                <div class="nav">
                  <div class="left">
                    <div class="title">远程调试</div>
                    <el-switch v-model="openDebug"></el-switch>
                  </div>
                  <div class="right" @click="closeDebug">
                    <i class="el-icon-close"></i>
                  </div>
                </div>
                <div class="airportinfoBox clearfix">
                  <div
                    class="airportinfolist"
                    v-for="(item, index) in airportOptions"
                    :key="index"
                  >
                    <div class="foriconfont">
                      <i :class="item.icon"></i>
                    </div>
                    <div class="aconttext">
                      <p>{{ item.title }}</p>
                      <p>{{ item.decs }}</p>
                    </div>
                    <div class="aontrolBtn">
                      <span :class="{ disabled: !openDebug }">{{
                        item.btnText
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="top_center">
          <div class="flyinfo_center">
            <div class="fly_icon">
                <i class="el-icon-sort"></i>    
            </div>
            <div class="fly_text"></div>
          </div>
          <div class="flyinfo_speed"></div>
        </div>
        <div class="top_side"></div>
      </div>
    </div>
  </div>
</template>

<script>
import MapContainer from "./MapContainer.vue";
export default {
  name: "VideoMapWrap",
  data() {
    return {
      taskOptions: [
        {
          label: "西安-周至",
          value: "西安-周至",
        },
      ],
      task: "",
      toolsVisible: false,
      openDebug: false,
      airportOptions: [
        {
          icon: "el-icon-switch-button",
          title: "关机",
          decs: "飞行器电源",
          btnText: "开机",
        },
        {
          icon: "el-icon-dianliang iconfont",
          title: "断电",
          decs: "充电状态",
          btnText: "充电",
        },
        {
          icon: "el-icon-hangpai iconfont",
          title: "空闲中",
          decs: "机场系统",
          btnText: "重启",
        },
        {
          icon: "el-icon-box",
          title: "关",
          decs: "舱盖",
          btnText: "开启",
        },
      ],
    };
  },
  components: {
    MapContainer,
  },
  methods: {
    showTools() {
      this.toolsVisible = true;
    },
    closeDebug() {
      this.toolsVisible = false;
    },
  },
};
</script>

<style lang="scss">
.video-map-wrap {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  .topinfoBox {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 64px;
    color: #fff;
    transition: all 0.5s;
    background-image: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.30196078431372547) 2%,
      transparent 98%
    );
    :hover {
      transition: all 0.5s;
      background-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.5490196078431373) 2%,
        rgba(0, 0, 0, 0.45098039215686275) 98%
      );
    }
    .toppaln {
      display: flex;
      height: 100%;
      width: 100%;
      padding: 0 16px;
      box-sizing: border-box;
      .toppaln_left {
        padding-top: 9px;
        background-image: none;
        .flight_name {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          background-image: none;
        }
        .nestListBox {
          width: 200px;
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          background-image: none;
          .select_nest {
            background-image: none;
          }
          .el-select {
            border: 1px solid hsla(0, 0%, 100%, 0.4);
            background-image: none;
            border-radius: 16px;

            .el-input {
              background-image: none;
              .el-input__suffix {
                background-image: none;
                .el-input__suffix-inner {
                  background-image: none;
                }
                .el-select__caret {
                  color: #fff;
                  background-image: none !important;
                }
              }
            }
            .el-input__inner {
              border: 1px solid transparent !important;
              background-color: rgba(0, 0, 0, 0.04);
              border-radius: 16px;
              width: 100%;
              background-image: none;

              font-weight: 400;
              font-size: 12px;
              color: #fff;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
              &::placeholder {
                color: #fff;
              }
            }
          }
          .debug_control {
            position: absolute;
            left: 210px;
            bottom: 6px;
            background-image: none;
            cursor: pointer;
            .el-tooltip {
              background-image: none;
            }
            .tools-box {
              background-image: none;
              width: 388px;
              height: 160px;
              background: rgba(0, 0, 0, 0.7019607843137254);
              border-radius: 12px;
              padding: 12px;
              position: absolute;
              left: -200px;
              top: 49px;
              .nav {
                width: 100%;
                height: 20px;
                background-image: none;
                display: flex;
                justify-content: space-between;
                margin-bottom: 14px;
                .left {
                  height: 20px;
                  font-family: PingFangSC-Medium;
                  font-weight: 500;
                  font-size: 14px;
                  background-image: none;
                  color: #fff;
                  line-height: 20px;
                  display: flex;
                  align-items: center;
                  .title {
                    background-image: none;
                    margin-right: 12px;
                  }
                  .el-switch {
                    background-image: none;
                    .el-switch__core {
                      background-image: none;
                    }
                  }
                }
                .right {
                  width: 20px;
                  height: 20px;
                  background-image: none;
                  font-size: 20px;
                  cursor: pointer;
                  .el-icon-close {
                    background-image: none;
                  }
                }
              }
              .airportinfoBox {
                width: 100%;
                height: 48px;
                display: flex;
                flex-wrap: wrap;
                background-image: none;
                .airportinfolist {
                  width: 180px;
                  background-image: none;
                  height: 48px;
                  background: rgba(29, 29, 31, 0.7490196078431373);
                  padding: 8px;
                  border-radius: 4px;
                  margin-right: 2px;
                  display: flex;
                  margin-bottom: 2px;

                  .foriconfont {
                    font-size: 32px;
                    background-image: none;
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    margin-right: 14px;
                    .el-icon-hangpai,
                    .el-icon-dianliang {
                      font-size: 32px;
                    }
                  }
                  .aconttext {
                    background-image: none;
                    :nth-child(1) {
                      line-height: 14px;
                      font-weight: 500;
                      font-size: 12px;
                      background-image: none;
                      height: 14px;
                      color: #fff;
                      margin: 0;
                    }
                    :nth-child(2) {
                      font-weight: 400;
                      font-size: 12px;
                      color: hsla(0, 0%, 100%, 0.6);
                      background-image: none;
                      margin-top: 4px;
                    }
                  }
                  .aontrolBtn {
                    flex: 1;
                    text-align: end;
                    background-image: none;
                    padding-top: 4px;
                    padding-right: 5px;
                    .disabled {
                      cursor: not-allowed;
                      background: hsla(0, 0%, 100%, 0.14901960784313725);
                      color: hsla(0, 0%, 100%, 0.34901960784313724);
                    }
                    span {
                      width: 40px;
                      height: 24px;
                      background: hsla(0, 0%, 100%, 0.14901960784313725);
                      border-radius: 6px;
                      padding: 5px 5px;
                      display: inline-block;
                      font-size: 12px;
                      background-image: none;
                      text-align: center;
                      cursor: pointer;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .top_center {
        display: flex;
        background-image: none;
        justify-content: center;
        .flyinfo_center {
          background-image: none;
          display: flex;
          padding: 13px 0;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
        }
      }
    }
  }
}
</style>