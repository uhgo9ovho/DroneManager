<template>
  <div class="video-map-wrap">
    <!-- 全屏 div，显示地图或视频 -->
    <div class="full-screen">
      <component :is="fullScreenComponent" />
    </div>

    <!-- 小 div 1，点击后与全屏 div 交换 -->
    <div class="small-div small-div-1" @click="handleClick(0)">
      <component :is="smallComponent[0]" />
    </div>

    <!-- 小 div 2，点击后与全屏 div 交换 -->
    <div class="small-div small-div-2" @click="handleClick(1)">
      <component :is="smallComponent[1]" />
    </div>

    <!-- 顶部信息 -->
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
              <i class="el-icon-gaodu iconfont"></i>
            </div>
            <div class="fly_text">
              <p>
                离地高度
                <span class="distance_number">{{ tempHeight }}</span>
                <span class="distance_unit">m</span>
              </p>
              <p>
                离巢距离
                <span class="distance_number">{{ tempElevation }}</span>
                <span class="distance_unit">m</span>
              </p>
            </div>
          </div>
          <div class="flyinfo_speed">
            <div class="fly_icon">
              <i class="el-icon-yibiaopan iconfont"></i>
            </div>
            <div class="fly_text">
              <p>
                水平速度
                <span class="distance_number">{{ tempHorizontal_speed }}</span>
                <span class="distance_unit">m/s</span>
              </p>
              <p>
                垂直速度
                <span class="distance_number">{{ tempVertical_speed }}</span>
                <span class="distance_unit">m/s</span>
              </p>
            </div>
          </div>
        </div>
        <div class="top_side">
          <div class="weather_Box">
            <div class="weather_info">
              <div>
                <p>天气</p>
                <p>{{ tempRainfall }}</p>
              </div>
              <div>
                <p>风速</p>
                <p>{{ tempWind_speed }}级（1.5m/s）</p>
              </div>
              <div>
                <p>湿度</p>
                <p>{{ tempHumidity }}% RH</p>
              </div>
            </div>
          </div>
          <div class="top_right">
            <div class="top_right_plan">
              <div class="battery_signal">
                <div class="wifi">
                  <i class="iconfont el-icon-wifi"></i>
                  <span> 5339KB/s </span>
                </div>
                <div class="electric-panel warning">
                  <div class="panel">
                    <div class="remainder" style="width: 30%"></div>
                  </div>
                  <div class="textNum">{{ tempCapacityPercent }}%</div>
                </div>
                <div class="signal_info">
                  <i class="iconfont el-icon-xinhao"></i>
                </div>
              </div>
              <div class="goback_plan redBtnColor" @click="outVideo">退出</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 控制按钮 -->
    <el-popconfirm :title="title" v-if="showMap" @confirm="confirmPhoto()">
      <div class="bottomControlBox" slot="reference">
        <div class="innerbottomBox">
          <el-tooltip
            class="item"
            effect="dark"
            content="抓拍截图"
            placement="top"
          >
            <i class="iconfont el-icon-xiangji"></i>
          </el-tooltip>
        </div>
      </div>
    </el-popconfirm>
    <el-popconfirm :title="title" v-if="showMap" @confirm="confirm()">
      <div class="bottomControlBox1" slot="reference">
        <div class="innerbottomBox">
          <el-tooltip
            class="item"
            effect="dark"
            content="获取控制权"
            placement="top"
          >
            <i class="iconfont el-icon-kongzhi"></i>
          </el-tooltip>
        </div>
      </div>
    </el-popconfirm>
    <!-- 飞行视角预览 -->
    <!-- <FlyVideoBox @changeVideo="changeVideo" :mainView="mainView"></FlyVideoBox> -->
    <!-- 机巢视角预览 -->
    <!-- <AirPortVideo
      @changeVideo="changeVideo"
      :mainView="mainView"
    ></AirPortVideo> -->
    <!-- 控制无人机操作界面 -->
    <div v-if="showRemote">
      <FlyRemote></FlyRemote>
    </div>
  </div>
</template>

<script>
let player = null;
import MapContainer from "./MapContainer.vue";
import FlyVideoBox from "./Template/FlyVideoBox.vue";
import AirPortVideo from "./Template/AirPortVideo.vue";
import FlyRemote from "./Template/FlyRemote.vue";
import WebSocketClient from "@/utils/websocket.js";
import { mapState } from "vuex";
import Aliplayer from "aliyun-aliplayer";
import "aliyun-aliplayer/build/skins/default/aliplayer-min.css";
import { getquipmentToken } from "@/api/user.js";
import Cookies from "js-cookie";
export default {
  name: "VideoMapWrap",
  data() {
    return {
      fullScreenComponent: "MapContainer",
      smallComponent: ["FlyVideoBox", "AirPortVideo"],
      mainView: "map",
      lastView: null, // 用于记录上一次内容
      ws: null,
      showMap: false,
      showRemote: false,
      mapWidth: "100vw",
      mapHeight: "100vh",
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
      tempHeight: "-",
      tempHorizontal_speed: "-",
      tempVertical_speed: "-",
      tempElevation: "-",
      tempWind_speed: "-",
      tempHumidity: "-",
      capacity_percent: "-",
      tempRainfall: "-",
      tempCapacityPercent: "-"
    };
  },
  components: {
    MapContainer,
    FlyVideoBox,
    AirPortVideo,
    FlyRemote,
  },
  computed: {
    ...mapState("droneStatus", ["statusInfo"]),
    title() {
      return "当前无人控制该设备，是否确认继续申请控制权？";
    },
  },
  watch: {
    statusInfo(val) {
      if (val.host) {
        this.tempRainfall =
          val.host.rainfall == "1"
            ? "小雨"
            : val.host.rainfall == "2"
            ? "中雨"
            : val.host.rainfall == "3"
            ? "大雨"
            : "无雨";
        if (val.host.height) this.tempHeight = val.host.height.toFixed(2);

        if (val.host.horizontal_speed)
          this.tempHorizontal_speed = val.host.horizontal_speed.toFixed(2);

        if (val.host.vertical_speed)
          this.tempVertical_speed = val.host.vertical_speed.toFixed(2);

        if (val.host.elevation)
          this.tempElevation = val.host.elevation.toFixed(2);

        if (val.host.wind_speed)
          this.tempWind_speed = val.host.wind_speed.toFixed(2);

        if (val.host.humidity) this.tempHumidity = val.host.humidity.toFixed(2);

        if (val.host.capacity_percent)
          this.capacity_percent = val.host.capacity_percent;
        if (val.host.battery) this.tempCapacityPercent = val.host.capacity_percent
          if (val.host.mode_code == "0") {
            //待机状态
            this.tempElevation = "-";
            this.tempHeight = "-";
            this.tempHorizontal_speed = "-";
            this.tempHumidity = "-";
            this.tempVertical_speed = "-";
            this.tempWind_speed = "-";
          }
      }
    },
  },
  mounted() {
    this.getEQToken();
  },
  methods: {
    handleClick(index) {
      [this.fullScreenComponent, this.smallComponent[index]] = [
        this.smallComponent[index],
        this.fullScreenComponent,
      ];
      this.updateOutdoorContentVisibility(index);
    },
    updateOutdoorContentVisibility(index) {
      console.log(index, this.fullScreenComponent);
      // 检查条件：当 index 是 1 并且大屏显示的不是地图
      if (
        (index === 0 && this.fullScreenComponent !== "MapContainer") ||
        (index === 1 && this.fullScreenComponent === "FlyVideoBox")
      ) {
        this.showMap = true;
      } else {
        this.showMap = false;
      }
    },
    //获取设备token
    getEQToken() {
      const userId = JSON.parse(Cookies.get("user")).userId;
      console.log(JSON.parse(Cookies.get("user")), "aaa");
      const username = JSON.parse(Cookies.get("user")).userName;
      const params = {
        workspaceId: localStorage.getItem("workspaceId"),
        userId,
        username,
      };
      getquipmentToken(params).then((res) => {
        if (res.code === 200) {
          const token = res.data.data["ws-token"];
          this.ws = new WebSocketClient(
            `ws://8.136.97.59:6789/api/v1/ws?ws-token=${token}`
          );
        }
      });
    },
    confirm(e) {
      this.showRemote = true;
    },
    confirmPhoto() {},
    outVideo() {
      this.$router.go(-1);
    },
    Callback(data) {
      console.log(data);
    },
    showTools() {
      this.toolsVisible = true;
    },
    closeDebug() {
      this.toolsVisible = false;
    },
    changeVideo(view) {
      // 只有在点击的内容不是当前大屏内容时才切换
      if (this.mainView !== view) {
        this.mainView = view;
      } else {
        // 如果点击的是当前显示内容，则返回地图
        this.mainView = "map";
      }
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
  .full-screen {
    width: 100%;
    height: 100%;
    /* position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; */
    background-color: lightblue;
  }

  .small-div {
    position: absolute;
    bottom: 20px;
    height: 80px;
    width: 130px;
    background-color: lightgray;
    cursor: pointer;
    z-index: 100;
  }

  .small-div-1 {
    left: 20px;
  }

  .small-div-2 {
    left: 20px;
    bottom: 120px;
  }
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
          width: 470px;
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
            left: 200px;
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
        .flyinfo_center,
        .flyinfo_speed {
          background-image: none;
          display: flex;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          .fly_icon {
            width: 28px;
            height: 100%;
            display: flex;
            background-image: none;
            align-items: center;
            .el-icon-gaodu,
            .el-icon-yibiaopan {
              background-image: none;
              font-size: 28px;
            }
          }
          .fly_text {
            line-height: 18px;
            background-image: none;
            font-size: 12px;
            padding-left: 8px;
            margin-right: 40px;
            font-weight: 400;
            width: 136px;
            p {
              font-weight: 400;
              background-image: none;
              line-height: 18px;
              .distance_number {
                color: #fff;
                font-weight: 500;
                background-image: none;
                line-height: 18px;
                padding-left: 9px;
              }
              .distance_unit {
                color: #fff;
                background-image: none;
                font-size: 12px;
                font-weight: 400;
                line-height: 18px;
              }
            }
          }
        }
      }
      .top_side {
        display: flex;
        background-image: none;
        flex: 1;
        .weather_Box {
          background-image: none;
          .weather_info {
            width: 210px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
            background-image: none;
            display: flex;
            justify-content: space-around;
            font-size: 12px;
            font-weight: 400;
            color: #fff;
            div {
              background-image: none;
              p {
                text-align: center;
                line-height: 18px;
                background-image: none;
                margin-bottom: 2px;
              }
            }
          }
        }

        .top_right {
          flex: 1;
          display: flex;
          background-image: none;
          justify-content: flex-end;
          .top_right_plan {
            background-image: none;
            position: relative;
            .battery_signal {
              position: relative;
              background-image: none;
              line-height: 18px;
              margin: 6px 0;
              display: flex;
              justify-content: space-between;
              height: 18px;
              width: 80px;
              .wifi {
                position: absolute;
                display: flex;
                right: 98px;
                background-image: none;
                top: 0;
                font-weight: 400;
                font-size: 11px;
                span {
                  background-image: none;
                }
                .el-icon-wifi {
                  font-size: 16px;
                  background-image: none;
                  margin-right: 4px;
                }
              }
              .electric-panel {
                display: flex;
                justify-content: center;
                background-image: none;
                align-items: center;
                height: 18px;
                .panel {
                  box-sizing: border-box;
                  width: 16px;
                  height: 10px;
                  position: relative;
                  background: url("../assets/icons/下载.png") no-repeat;
                  background-size: cover;
                  padding: 3px;
                  padding-right: 4px;
                  background-image: none;
                  padding-left: 1px;
                  .remainder {
                    border-radius: 1px;
                    background-image: none;
                    position: relative;
                    height: 100%;
                    width: 0;
                    left: 0;
                    top: 0;
                    background: #13ce66;
                  }
                }
                .textNum {
                  padding-left: 4px;
                  background-image: none;
                  color: #fff;
                  font-weight: 400;
                  font-size: 12px;
                }
                .signal_info {
                  display: flex;
                  background-image: none;
                  width: 16px;
                  height: 10px;
                  margin-top: 4px;
                  .el-icon-xinhao {
                    font-size: 14px;
                    background-image: none;
                  }
                }
              }
            }
            .goback_plan {
              cursor: pointer;
              width: 80px;
              height: 26px;
              background-image: none;
              line-height: 26px;
              border-radius: 16px;
              font-weight: 500;
              font-size: 12px;
              color: #fff;
              text-align: center;
            }
            .redBtnColor {
              background-image: none;
              background: #f45050;
              transition: background 0.2s;
            }
          }
        }
      }
    }
  }
  .bottomControlBox {
    position: absolute;
    z-index: 1000;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    .innerbottomBox {
      display: flex;
      color: #fff;
      i {
        font-size: 32px;
        cursor: pointer;
      }
      .el-icon-kongzhi {
        margin-left: 100px;
      }
    }
  }
  .bottomControlBox1 {
    position: absolute;
    z-index: 1000;
    bottom: 20px;
    left: 55%;
    transform: translateX(-50%);
    .innerbottomBox {
      display: flex;
      color: #fff;
      i {
        font-size: 32px;
        cursor: pointer;
      }
    }
  }
}
</style>