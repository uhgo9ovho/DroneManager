<template>
  <div ref="canvasWrapEl">
    <canvas id="canvas" ref="canvas" ></canvas>
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
    width: {
      type: Number,
      default: 754,
    },
    height: {
      type: Number,
      default: 566
    }
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
      zoomFactor: 1, // 当前缩放比例
      hasPos: false, //定位信息
      textMap: new Map(), // 存储矩形框和对应的标注
    };
  },
  methods: {
    init() {
      let that = this;
      const canvasElement = this.$refs.canvas;
      // 使用自定义的上下文初始化 Fabric.js Canvas
      this.canvas = new fabric.Canvas(canvasElement);
      this.canvas.setWidth(this.width);
      this.canvas.setHeight(this.height);
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
      // 监听对象移动事件
      this.canvas.on("object:moving", this.handleObjectMoving);
    },
    handleMouseDown(event) {
      if(!this.isEdit) return;
      const pointer = this.canvas.getPointer(event.e);
      const activeObject = this.canvas.findTarget(event.e);

      if (activeObject && activeObject.type === "rect") {
        // 如果点击在已有的矩形上，启动拖动操作
        console.log(this.textMap.size);
        
        this.isDragging = true;
        this.canvas.setActiveObject(activeObject);
        // 获取矩形的起始位置和结束位置
        const left = activeObject.left;
        const top = activeObject.top;
        const width = activeObject.width * activeObject.scaleX; // 考虑缩放比例
        const height = activeObject.height * activeObject.scaleY; // 考虑缩放比例
        const right = left + width;
        const bottom = top + height;
        this.$emit("handleMouseUp", {
          x1: left,
          y1: top,
          x2: right,
          y2: bottom,
          width,
          height,
          size: this.textMap.size
        });
        this.hasPos = true;
      } else {
        this.hasPos = false;
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
          fill: "transparent",
          stroke: "red",
          strokeWidth: 1,
          selectable: true, // 允许拖动
          hasControls: true,
        });
        this.canvas.add(this.selectionRect);
      }
    },

    handleMouseMove(event) {
      if(!this.isEdit) return;
      if (!this.isDrawing) return;
      const activeObject = event.target;

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

    handleObjectMoving(event) {
      if(!this.isEdit) return;
      const activeObject = event.target;
      if (activeObject && activeObject.type === "rect") {
        const left = activeObject.left;
        const top = activeObject.top;
        const width = activeObject.width * activeObject.scaleX; // 考虑缩放比例
        const height = activeObject.height * activeObject.scaleY; // 考虑缩放比例
        const right = left + width;
        const bottom = top + height;
        this.$emit("handleMouseUp", {
          x1: left,
          y1: top,
          x2: right,
          y2: bottom,
          width,
          height,
        });
        // 输出实时的起始位置和结束位置
        console.log(`实时矩形起点位置: (${left}, ${top})`);
        console.log(`实时矩形结束位置: (${right}, ${bottom})`);
        // 获取与该矩形框绑定的标注文字
        const boundText = this.textMap.get(activeObject);

        if (boundText) {
          // 移动标注文字的位置，使其相对于矩形框的位置保持一致
          boundText.set({
            left: left + 10, // 偏移一点以确保文字在框内
            top: top + 10,
          });
        }
        this.canvas.renderAll();
      }
    },

    handleMouseUp() {
      if(!this.isEdit) return;
      // 框选完成后获取位置
      if (this.selectionRect) {
        const left = this.selectionRect.left;
        const top = this.selectionRect.top;
        const width = this.selectionRect.width * this.selectionRect.scaleX; // 考虑缩放比例
        const height = this.selectionRect.height * this.selectionRect.scaleY; // 考虑缩放比例
        const right = left + width;
        const bottom = top + height;

        console.log(`起点位置: (${left}, ${top})`);
        console.log(`结束位置: (${right}, ${bottom})`);
        this.$emit('location',[left, top, right, bottom])
        if (!this.hasPos) {
          this.$emit("handleMouseUp", {
            x1: left,
            y1: top,
            x2: right,
            y2: bottom,
            width,
            height,
          });
        }
      }
      this.isDrawing = false;
    },

    handleMouseWheel(event) {
      if(!this.isEdit) return;
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
        const newLeft = pointer.x - (pointer.x - rect.left) * zoom;
        const newTop = pointer.y - (pointer.y - rect.top) * zoom;
        rect.set({
          scaleX: rect.scaleX * zoom,
          scaleY: rect.scaleY * zoom,
          left: pointer.x - (pointer.x - rect.left) * zoom,
          top: pointer.y - (pointer.y - rect.top) * zoom,
        });
        // 获取矩形框对应的文字并更新其位置和缩放比例
        const boundText = this.textMap.get(rect);
        if (boundText) {
          boundText.set({
            scaleX: boundText.scaleX * zoom, // 同步缩放文字
            scaleY: boundText.scaleY * zoom,
            left: newLeft + 10, // 保持文字在框的偏移位置
            top: newTop + 10,
          });
        }
      });

      this.canvas.renderAll();
      event.e.preventDefault();
      event.e.stopPropagation();
    },

    addTextToSelectedBox(textProps) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === "rect") {
        // 先检查并删除框选区域内已有的文字标注
        this.removeExistingTextInRect(activeObject);
        // 获取矩形框的位置
        const left = activeObject.left + 10; // 稍微偏移，让文字在框内
        const top = activeObject.top + 10;

        // 创建一个标注文字
        const text = new fabric.Textbox(textProps, {
          left: left,
          top: top,
          fontSize: 16,
          fill: "#000",
          editable: true,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        });

        // 将文字添加到画布上
        this.canvas.add(text);
        // this.canvas.setActiveObject(text);
        // 绑定矩形框和文字
        this.textMap.set(activeObject, text);
        this.canvas.renderAll();
        
      } else {
        console.log("请选择一个矩形框进行标注");
      }
    },

    // 查找并删除已存在的标注文字
    removeExistingTextInRect(rect) {
      const objects = this.canvas.getObjects("textbox");
      objects.forEach((obj) => {
        if (
          obj.left >= rect.left &&
          obj.top >= rect.top &&
          obj.left <= rect.left + rect.width &&
          obj.top <= rect.top + rect.height
        ) {
          this.canvas.remove(obj); // 删除该标注
        }
      });
    },
    // 删除选中的矩形框和标注文字
    removeSelectedBoxAndText() {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'rect') {         
        // 查找该矩形框的标注文字
        const boundText = this.textMap.get(activeObject);

        // 从画布中移除矩形框和标注文字
        this.canvas.remove(activeObject);
        if (boundText) {
          this.canvas.remove(boundText);
        }

        // 从 textMap 中删除绑定信息
        this.textMap.delete(activeObject);

        this.canvas.renderAll();
      } else {
        console.log('没有选中任何框');
      }
    },
  },
  watch: {
    src(val) {
      this.init()
    }
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
  /* border-radius: 12px; */
}
</style>