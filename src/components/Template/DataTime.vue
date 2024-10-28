<template>
  <div class="task-info">
    <div class="taskImage">
      <p class="calendar">
        {{ row.data_time.split('-')[2] }} <em>{{ dayOfWeek }}</em>
      </p>
    </div>
    <div class="task-title">{{ row.data_time }}</div>
  </div>
</template>

<script>
export default {
  name: "DataTime",
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    dayOfWeek() {
      const today = new Date(this.row.data_time);
      // 获取星期几 (0 表示星期日，1 表示星期一，以此类推)
      const dayOfWeek = today.getDay();
      // 获取星期几
      const days = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      return days[dayOfWeek];
    },
  },
};
</script>

<style lang="scss">
.task-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  .taskImage {
    margin-right: 4px;
    position: relative;
    .calendar {
      margin: 0.25em 10px 10px 0;
      padding-top: 5px;
      float: left;
      width: 80px;
      background: #ededef;
      background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        from(#ededef),
        to(#ccc)
      );
      background: -moz-linear-gradient(top, #ededef, #ccc);
      font: bold 30px/60px Arial Black, Arial, Helvetica, sans-serif;
      text-align: center;
      color: #000;
      text-shadow: #fff 0 1px 0;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      border-radius: 3px;
      position: relative;
      -moz-box-shadow: 0 2px 2px #888;
      -webkit-box-shadow: 0 2px 2px #888;
      box-shadow: 0 2px 2px #888;
      &::before,
      &::after {
        content: "";
        float: left;
        position: absolute;
        top: 5px;
        width: 8px;
        height: 8px;
        background: #111;
        z-index: 1;
        -moz-border-radius: 10px;
        -webkit-border-radius: 10px;
        border-radius: 10px;
        -moz-box-shadow: 0 1px 1px #fff;
        -webkit-box-shadow: 0 1px 1px #fff;
        box-shadow: 0 1px 1px #fff;
      }
      &::before {
        left: 11px;
      }
      &::after {
        right: 11px;
      }
      em {
        display: block;
        font: normal bold 11px/30px Arial, Helvetica, sans-serif;
        color: #fff;
        text-shadow: #00365a 0 -1px 0;
        background: #04599a;
        background: -webkit-gradient(
          linear,
          left top,
          left bottom,
          from(#04599a),
          to(#00365a)
        );
        background: -moz-linear-gradient(top, #04599a, #00365a);
        -moz-border-radius-bottomright: 3px;
        -webkit-border-bottom-right-radius: 3px;
        border-bottom-right-radius: 3px;
        -moz-border-radius-bottomleft: 3px;
        -webkit-border-bottom-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-top: 1px solid #00365a;
        &::before,
        &::after {
          content: "";
          float: left;
          position: absolute;
          top: -5px;
          width: 4px;
          height: 14px;
          background: #dadada;
          background: -webkit-gradient(
            linear,
            left top,
            left bottom,
            from(#f1f1f1),
            to(#aaa)
          );
          background: -moz-linear-gradient(top, #f1f1f1, #aaa);
          z-index: 2;
          -moz-border-radius: 2px;
          -webkit-border-radius: 2px;
          border-radius: 2px;
        }
        &::before {
          left: 13px;
        }
        &::after {
          right: 13px;
        }
      }
    }
  }
  .task-title {
    font-weight: 600;
    font-size: 14px;
    color: #1d1d1f;
    line-height: 22px;
    margin-left: 10px;
  }
}
</style>