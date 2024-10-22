<template>
  <div class="FlyRemoteBox">
    <div class="flyRemote"></div>
    <div class="toflypoint">指点飞行</div>
    <div class="cameraMoudle">广角镜头</div>
    <div class="fly_control_plan">
      <div class="to_fly">
        <div class="keyupBox">
          <div>
            <i class="iconfont el-icon-jiantou1"></i>
            <span>W</span>
            <div class="keyBox_hover_background"></div>
          </div>
        </div>
        <div class="keydownBox">
          <div>
            <i class="iconfont el-icon-jiantou1"></i>
            <span>S</span>
            <div class="keyBox_hover_background"></div>
          </div>
        </div>
        <div class="keyleftBox">
          <div>
            <i class="iconfont el-icon-jiantou1"></i>
            <span>A</span>
            <div class="keyBox_hover_background"></div>
          </div>
        </div>
        <div class="keyrightBox">
          <div>
            <i class="iconfont el-icon-jiantou1"></i>
            <span>D</span>
            <div class="keyBox_hover_background"></div>
          </div>
        </div>
        <div class="keylevorotaBox">
          <div>
            <i class="iconfont el-icon-chexiao"></i>
            <span>Q</span>
            <div class="keylevorotaBox_hover_background"></div>
          </div>
        </div>
        <div class="keydextroBox">
          <div>
            <i class="iconfont el-icon-fanhui"></i>
            <span>E</span>
            <div class="keylevorotaBox_hover_background"></div>
          </div>
        </div>
      </div>
      <div class="setting_fly_btn" @click="openPlan">
        <div class="fly_center_point setting_fly_center_point">
          <span>一键<br />起飞</span>
        </div>
        <div class="setting_fly_center_point2"></div>
      </div>
    </div>
    <div class="ris_and_fall">
      <div><i class="iconfont el-icon-jiantou"></i> 下降</div>
      <div><i class="iconfont el-icon-jiantou"></i> 上升</div>
    </div>
    <div class="return_home_plan">
      <div class="return_homeBox">
        <i class="iconfont el-icon-yijianfanhang"></i>
        <div class="return_text">
          <span>一键返航</span>
        </div>
      </div>
    </div>
    <div class="takeflyPlan" v-if="showPlan">
      <div class="planTakeoffBox">
        <div class="planTakeof_title">
          <div>飞行参数 <i class="el-icon-question"></i></div>
          <div class="setTakeofTips">注意：必须设置飞行参数，否则无法起飞</div>
        </div>
        <div class="setTakeofBox">
          <div class="setTakeofindex">
            安全离场高度(ALT)
            <input type="number" /> m
          </div>
          <div class="setTakeofindex">
            飞行作业高度(AGT)
            <input type="number" /> m
          </div>
        </div>
        <div class="setTakeofBox">
          <div class="setTakeofindex">
            返航高度(ALT)
            <input type="number" /> m
          </div>
          <div class="setTakeofindex badselectlist">
            失联动作
            <span style="margin-left: 20px">返航</span>
          </div>
        </div>
        <div class="setTakeofTips_Btn">
          <div class="setTakeofBtn">
            <div class="greyBtnColor" @click="clearPlan">取消</div>
            <div class="blueBtnColor" @click="surePlan">确认</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import mqtt from 'mqtt';
export default {
  data() {
    return {
      lenses: "广角镜头",
      showPlan: false
    };
  },
  methods: {
    clearPlan() {
        this.showPlan = false;
    },
    openPlan() {
        this.showPlan = true;
    },
    surePlan() {
        this.showPlan = false;
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
.FlyRemoteBox {
  position: absolute;
  right: 24px;
  bottom: 210px;
  z-index: 1000;
  .flyRemote {
    width: 136px;
    height: 436px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 68px;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    position: relative;
    user-select: none;
  }
  .toflypoint {
    margin: 0 auto;
    width: 112px;
    height: 28px;
    border: 1px solid hsla(0, 0%, 100%, 0.25);
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 26px;
    cursor: pointer;
    position: absolute;
    bottom: 368px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    color: #fff;
  }
  .cameraMoudle {
    display: block;
    border: 1px solid hsla(0, 0%, 100%, 0.25);
    width: 112px;
    height: 28px;
    font-size: 12px;
    line-height: 26px;
    margin: 0 auto;
    border-radius: 15px;
    text-indent: 8px;
    cursor: pointer;
    text-align: center;
    line-height: 25px;
    position: absolute;
    bottom: 332px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 15;
    color: #fff;
  }
  .fly_control_plan {
    height: 128px;
    width: 128px;
    position: absolute;
    bottom: 108px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    background: url("../../assets/images/fly_cross_background.43e16d5a.png")
      no-repeat 50%;
    background-size: 100%;
    .to_fly {
      height: 100%;
      width: 100%;
      position: relative;
      .keyupBox {
        position: absolute;
        z-index: 10;
        transition: all 0.3s;
        top: 2px;
        left: 50%;
        transform: translateX(-50%);
        div {
          width: 36px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          position: relative;
          //   color: hsla(0, 0%, 100%, 0.30196078431372547);
          color: #fff;
          font-weight: 300;
          font-size: 12px;
          i {
            position: absolute;
            width: 24px;
            height: 12px;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
          }
          span {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
          }
          .keyBox_hover_background {
            position: absolute;
            top: 0;
            left: 0;
            width: 36px;
            height: 36px;
            background-image: linear-gradient(
              1deg,
              hsla(0, 0%, 53.3%, 0) 3%,
              hsla(0, 0%, 53.3%, 0.5019607843137255) 97%
            );
            border-radius: 10px;
            z-index: 5;
            opacity: 0;
            translate: all 0.8s;
          }
        }
      }
      .keydownBox {
        position: absolute;
        z-index: 10;
        transition: all 0.3s;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        div {
          width: 36px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          position: relative;
          font-weight: 300;
          color: #fff;
          font-size: 12px;
        }
        i {
          position: absolute;
          width: 24px;
          height: 12px;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleY(-1);
        }
        span {
          position: absolute;
          bottom: 18px;
          left: 50%;
          transform: translateX(-50%);
        }
        .keyBox_hover_background {
          position: absolute;
          top: 0;
          left: 0;
          width: 36px;
          height: 36px;
          background-image: linear-gradient(
            1deg,
            hsla(0, 0%, 53.3%, 0) 3%,
            hsla(0, 0%, 53.3%, 0.5019607843137255) 97%
          );
          border-radius: 10px;
          z-index: 5;
          opacity: 0;
          translate: all 0.8s;
        }
      }
      .keyleftBox {
        left: 5px;
        top: 51%;
        transform: translateY(-50%);
        position: absolute;
        z-index: 10;
        transition: all 0.3s;
        div {
          width: 36px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          position: relative;
          font-weight: 300;
          color: #fff;
          font-size: 12px;
          i {
            position: absolute;
            width: 12px;
            height: 24px;
            left: 4px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
          }
          span {
            position: absolute;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            line-height: 12px;
          }
          .keyBox_hover_background {
            position: absolute;
            top: 0;
            left: 0;
            width: 36px;
            height: 36px;
            background-image: linear-gradient(
              1deg,
              hsla(0, 0%, 53.3%, 0) 3%,
              hsla(0, 0%, 53.3%, 0.5019607843137255) 97%
            );
            border-radius: 10px;
            z-index: 5;
            opacity: 0;
            translate: all 0.8s;
          }
        }
      }
      .keyrightBox {
        right: 2px;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        z-index: 10;
        transition: all 0.3s;
        div {
          width: 36px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          position: relative;
          color: #fff;
          font-weight: 300;
          font-size: 12px;
          i {
            position: absolute;
            width: 12px;
            height: 24px;
            right: 4px;
            top: 50%;
            transform: translateY(-50%) rotate(90deg);
          }
          span {
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            line-height: 12px;
          }
          .keyBox_hover_background {
            position: absolute;
            top: 0;
            left: 0;
            width: 36px;
            height: 36px;
            background-image: linear-gradient(
              1deg,
              hsla(0, 0%, 53.3%, 0) 3%,
              hsla(0, 0%, 53.3%, 0.5019607843137255) 97%
            );
            border-radius: 10px;
            z-index: 5;
            opacity: 0;
            translate: all 0.8s;
          }
        }
      }
      .keylevorotaBox {
        position: absolute;
        z-index: 10;
        transition: all 0.3s;
        top: 0;
        left: 0;
        div {
          width: 36px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          position: relative;
          font-weight: 300;
          color: #fff;
          font-size: 12px;
          background: rgba(85, 85, 85, 0.5019607843137255);
          border-radius: 50%;
        }
        i {
          width: 24px;
          height: 12px;
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
        }
        span {
          width: 10px;
          height: 12px;
          font-weight: 300;
          font-size: 12px;
          text-align: center;
          color: #fff;
          line-height: 12px;
          display: block;
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        }
        .keylevorotaBox_hover_background {
          opacity: 0;
          width: 36px;
          height: 36px;
          background: hsla(0, 0%, 53.3%, 0.5019607843137255);
          border-radius: 18px;
          z-index: 5;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .keydextroBox {
        position: absolute;
        z-index: 10;
        transition: all 0.3s;
        top: 0;
        right: 0;
        div {
          width: 36px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          position: relative;
          font-weight: 300;
          color: #fff;
          font-size: 12px;
          background: rgba(85, 85, 85, 0.5019607843137255);
          border-radius: 50%;
          i {
            width: 24px;
            height: 12px;
            position: absolute;
            top: 6px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
          }
          span {
            width: 10px;
            height: 12px;
            font-weight: 300;
            font-size: 12px;
            text-align: center;
            line-height: 12px;
            display: block;
            position: absolute;
            top: 21px;
            left: 50%;
            z-index: 10;
            transform: translateX(-50%);
          }
          .keylevorotaBox_hover_background {
            opacity: 0;
            width: 36px;
            height: 36px;
            background: hsla(0, 0%, 53.3%, 0.5019607843137255);
            border-radius: 18px;
            z-index: 5;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }
    .setting_fly_btn {
      position: absolute;
      width: 46px;
      height: 46px;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      .setting_fly_center_point {
        background: #0271e3;
        font-weight: 500;
        font-size: 12px;
        color: #fff;
        text-align: center;
        line-height: 14px;
        span {
          background: #0271e3;
          font-weight: 500;
          font-size: 12px;
          color: #fff;
          text-align: center;
          line-height: 14px;
        }
      }
      .fly_center_point {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        font-size: 12px;
        color: #1d1d1f;
        text-align: center;
        line-height: 14px;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: absolute;
        top: 4px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        transition: all 0.3s;
      }
      .setting_fly_center_point2 {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        background: hsla(0, 0%, 100%, 0);
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        border: 1px solid #fff;
        z-index: 9999;
        transition: all 0.3s;
        z-index: 10;
      }
    }
  }
  .ris_and_fall {
    height: 32px;
    width: 100%;
    background: hsla(0, 0%, 100%, 0.15);
    line-height: 32px;
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 68px;
    left: 0;
    z-index: 10;
    transition: all 0.3s;
    color: #fff;
    div {
      flex: 1;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
      i {
        font-size: 10px;
        margin: 0 5px;
        transform: rotate(90deg);
      }
    }
    :nth-child(1) {
      border-right: 1px solid rgba(0, 0, 0, 0.4);
      i {
        border: 0;
      }
    }
    :nth-child(2) {
      i {
        border: 0;
        transform: rotate(-90deg);
      }
    }
  }
  .return_home_plan {
    position: absolute;
    width: 100%;
    bottom: 26px;
    z-index: 10;
    cursor: pointer;
    .return_homeBox {
      display: flex;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      i {
        font-size: 20px;
      }
      .return_text {
        margin: 5px 0 0 5px;
        line-height: 16px;
        font-size: 12px;
      }
    }
  }
  .takeflyPlan {
    .planTakeoffBox {
      position: absolute;
      width: 380px;
      height: 300px;
      background: #1d1d1f;
      border-radius: 12px;
      padding: 20px 24px;
      border-radius: 8px;
      color: #cecece;
      top: 70px;
      right: 148px;
      z-index: 1000;
      box-sizing: border-box;
      .planTakeof_title {
        font-weight: 600;
        font-size: 14px;
        color: #fff;
        line-height: 24px;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25098039215686274);
        display: flex;
        justify-content: space-between;
        margin-bottom: 24px;
        .setTakeofTips {
          font-weight: 400;
          font-size: 12px;
          color: hsla(0, 0%, 100%, 0.6);
          text-align: right;
        }
      }
      .setTakeofBox {
        padding-right: 51px;
        .setTakeofindex {
          color: hsla(0, 0%, 100%, 0.7490196078431373);
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25098039215686274);
          font-size: 13px;
          line-height: 28px;
          margin-bottom: 12px;
          flex: 1;
          text-align: end;
          input {
            border: 1px solid hsla(0, 0%, 100%, 0.45098039215686275);
            background-color: transparent;
            color: #fff;
            width: 100px;
            height: 28px;
            border-radius: 8px;
            text-indent: 12px;
          }
        }
        .badselectlist {
          text-align: center;
        }
      }
      .setTakeofTips_Btn {
        margin-top: 20px;
        .setTakeofBtn {
          display: flex;
          justify-content: flex-end;
          .greyBtnColor {
            margin-left: 12px;
            text-align: center;
            cursor: pointer;
            width: 88px;
            height: 36px;
            background: #e2e2e4;
            line-height: 36px;
            border-radius: 100px;
            font-weight: 500;
            font-size: 14px;
            color: #1d1d1f;
          }
          .blueBtnColor {
            margin-left: 12px;
            text-align: center;
            cursor: pointer;
            width: 88px;
            height: 36px;
            line-height: 36px;
            border-radius: 100px;
            font-weight: 500;
            font-size: 14px;
            color: #fff;
            background: #0271e3;
          }
        }
      }
    }
  }
}
</style>