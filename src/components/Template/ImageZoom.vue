<template>
  <div ref="canvasWrapEl">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric"; // v6
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      canvas: null,
      isDrawing: false,
      selectionRect: null,
      isDrawing: false, // 判断是否正在框选
      startX: 0, // 框选起点X
      startY: 0, // 框选起点Y
      backgroundImage: null, // 背景图片对象
      width: 754,
      height: 566,
      zoomFactor: 1, // 当前缩放比例
    };
  },
  methods: {
    init() {
      let that = this;
      const canvasElement = this.$refs.canvas;
      // 使用自定义的上下文初始化 Fabric.js Canvas
      this.canvas = new fabric.Canvas(canvasElement);
      this.canvas.setWidth(754);
      this.canvas.setHeight(566);
      if (!this.canvas) {
        console.error("Canvas not initialized");
        return;
      }
      // 加载图片并设置为背景
      fabric.Image.fromURL(
        this.src,
        (img) => {
          this.backgroundImage = img;
          img.scaleToWidth(this.canvas.width); // 将图片缩放到 canvas 宽度
          img.scaleToHeight(this.canvas.height); // 将图片缩放到 canvas 高度

          // 缩放背景图片使其与 canvas 的尺寸匹配
          this.canvas.setBackgroundImage(
            img,
            this.canvas.renderAll.bind(this.canvas), // 回调函数以渲染 canvas
            {
              scaleX: this.canvas.width / img.width, // 计算水平缩放比例
              scaleY: this.canvas.height / img.height, // 计算垂直缩放比例
            }
          );
        },
        { crossOrigin: "anonymous" }
      );
      // 监听框选操作
      this.canvas.on("mouse:down", this.handleMouseDown);
      this.canvas.on("mouse:move", this.handleMouseMove);
      this.canvas.on("mouse:up", this.handleMouseUp);
      // 监听鼠标滚轮事件
      this.canvas.on("mouse:wheel", this.handleMouseWheel);
    },
    handleMouseDown(event) {
      const pointer = this.canvas.getPointer(event.e);
      const activeObject = this.canvas.findTarget(event.e);

      if (activeObject && activeObject.type === "rect") {
        // 如果点击在已有的矩形上，启动拖动操作
        this.isDragging = true;
        this.canvas.setActiveObject(activeObject);
      } else {
        // 如果没有点击在已有的矩形上，开始新的框选
        this.isDrawing = true;
        this.startX = pointer.x;
        this.startY = pointer.y;

        // 创建一个新的矩形
        this.selectionRect = new fabric.Rect({
          left: this.startX,
          top: this.startY,
          width: 0,
          height: 0,
          fill: "rgba(0, 0, 255, 0.3)",
          stroke: "blue",
          strokeWidth: 2,
          selectable: true, // 允许拖动
          hasControls: true,
        });
        this.canvas.add(this.selectionRect);
      }
    },

    handleMouseMove(event) {
      if (!this.isDrawing) return;

      const pointer = this.canvas.getPointer(event.e);
      const width = pointer.x - this.startX;
      const height = pointer.y - this.startY;

      // 更新矩形的大小
      this.selectionRect.set({
        width: Math.abs(width),
        height: Math.abs(height),
        left: width < 0 ? pointer.x : this.startX,
        top: height < 0 ? pointer.y : this.startY,
      });

      this.canvas.renderAll();
    },

    handleMouseUp() {
      this.isDrawing = false;
    },

    handleMouseWheel(event) {
      const delta = event.e.deltaY;
      const zoomFactor = 1.1;
      let zoom = delta < 0 ? zoomFactor : 1 / zoomFactor;

      // 当前缩放比例
      this.zoomFactor *= zoom;

      // 获取鼠标位置
      const pointer = this.canvas.getPointer(event.e);

      // 更新背景图片缩放
      if (this.backgroundImage) {
        const newScaleX = this.backgroundImage.scaleX * zoom;
        const newScaleY = this.backgroundImage.scaleY * zoom;

        const newLeft =
          pointer.x -
          (pointer.x - (this.backgroundImage.left || 0)) *
            (newScaleX / this.backgroundImage.scaleX);
        const newTop =
          pointer.y -
          (pointer.y - (this.backgroundImage.top || 0)) *
            (newScaleY / this.backgroundImage.scaleY);

        this.backgroundImage.set({
          scaleX: newScaleX,
          scaleY: newScaleY,
          left: newLeft,
          top: newTop,
        });
        this.canvas.renderAll();
      }

      // 更新所有矩形的缩放比例和位置
      this.canvas.getObjects("rect").forEach((rect) => {
        rect.set({
          scaleX: rect.scaleX * zoom,
          scaleY: rect.scaleY * zoom,
          left: pointer.x - (pointer.x - rect.left) * zoom,
          top: pointer.y - (pointer.y - rect.top) * zoom,
        });
      });

      this.canvas.renderAll();
      event.e.preventDefault();
      event.e.stopPropagation();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
canvas {
  display: block;
  margin: 0 auto;
  border: 1px solid #ccc;
  position: absolute;
  left: 0px;
  top: 0px;
  touch-action: none;
  user-select: none;
  border-radius: 12px;
}
</style>