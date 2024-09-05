<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>
  
  <script>
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
      scale: 1,
      originX: 0,
      originY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      isSelecting: false,
      selectionStartX: 0,
      selectionStartY: 0,
      selectionEndX: 0,
      selectionEndY: 0,
      img: null,
      canvasWidth: 754, // 固定 canvas 宽度
      canvasHeight: 566, // 固定 canvas 高度
    };
  },
  mounted() {
    this.img = new Image();
    this.img.src = this.src;

    this.img.onload = () => {
      this.setupCanvas();
      this.drawImage();
    };

    this.$refs.canvas.addEventListener("wheel", this.handleWheel);
    this.$refs.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.$refs.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.$refs.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.$refs.canvas.addEventListener("mouseout", this.handleMouseOut);
  },
  methods: {
    setupCanvas() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      // 获取设备像素比
      const devicePixelRatio = window.devicePixelRatio || 1;

      // 设置 canvas 的实际像素尺寸为显示尺寸的倍数
      canvas.width = this.canvasWidth * devicePixelRatio;
      canvas.height = this.canvasHeight * devicePixelRatio;

      // 缩放绘图上下文，确保绘制的内容清晰
      ctx.scale(devicePixelRatio, devicePixelRatio);
      // 禁用图像平滑处理，以提高清晰度
      ctx.imageSmoothingEnabled = false;
    },
    drawImage() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 计算图片缩放比例
      const scaleX = this.canvasWidth / this.img.width;
      const scaleY = this.canvasHeight / this.img.height;
      const scale = Math.min(scaleX, scaleY);
      // 计算图片在 canvas 中居中的位置
      const x = (this.canvasWidth - this.img.width * scale) / 2;
      const y = (this.canvasHeight - this.img.height * scale) / 2;
      ctx.save();
      ctx.translate(this.originX, this.originY);
      ctx.scale(this.scale, this.scale);
      ctx.drawImage(
        this.img,
        0,
        0,
        this.img.width,
        this.img.height,
        x,
        y,
        this.img.width * scale,
        this.img.height * scale
      );
      ctx.restore();

      if (this.isSelecting) {
        this.drawSelection();
      }
    },
    handleWheel(event) {
      event.preventDefault();

      const mouseX = event.offsetX;
      const mouseY = event.offsetY;
      const canvasX = (mouseX - this.originX) / this.scale;
      const canvasY = (mouseY - this.originY) / this.scale;

      if (event.deltaY < 0) {
        this.scale *= 1.1;
      } else {
        this.scale *= 0.9;
      }

      this.scale = Math.min(Math.max(0.1, this.scale), 10);

      this.originX = mouseX - canvasX * this.scale;
      this.originY = mouseY - canvasY * this.scale;

      this.drawImage();
    },
    // 将鼠标位置转换为图像中的实际位置
    transformMouseCoords(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left - this.originX) / this.scale;
      const y = (event.clientY - rect.top - this.originY) / this.scale;
      return { x, y };
    },
    handleMouseDown(event) {
      if (this.isEdit) {
        this.isSelecting = true;
        const coords = this.transformMouseCoords(event);
        this.selectionStartX = coords.x;
        this.selectionStartY = coords.y;
        this.selectionEndX = this.selectionStartX;
        this.selectionEndY = this.selectionStartY;
        this.$emit('startLister')
      } else {
        this.isDragging = true;
        this.startX = event.clientX - this.originX;
        this.startY = event.clientY - this.originY;
      }
    },

    handleMouseMove(event) {
      if (this.isDragging) {
        this.originX = event.clientX - this.startX;
        this.originY = event.clientY - this.startY;
        this.drawImage();
      }

      if (this.isSelecting) {
        const coords = this.transformMouseCoords(event);
        this.selectionEndX = coords.x;
        this.selectionEndY = coords.y;
        this.drawImage();
      }
    },
    handleMouseUp() {
      this.isDragging = false;
      if (this.isSelecting) {
        this.isSelecting = false;
        const selectedArea = this.getSelectionArea();
        this.$emit("handleMouseUp", selectedArea);
      }
    },
    handleMouseOut() {
      this.isDragging = false;
    },
    drawSelection() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      // 反向计算回实际的绘制位置
      const x = this.selectionStartX * this.scale + this.originX;
      const y = this.selectionStartY * this.scale + this.originY;
      const width = (this.selectionEndX - this.selectionStartX) * this.scale;
      const height = (this.selectionEndY - this.selectionStartY) * this.scale;

      ctx.strokeRect(x, y, width, height);
    },
    getSelectionArea() {
      const x1 = Math.min(this.selectionStartX, this.selectionEndX);
      const y1 = Math.min(this.selectionStartY, this.selectionEndY);
      const x2 = Math.max(this.selectionStartX, this.selectionEndX);
      const y2 = Math.max(this.selectionStartY, this.selectionEndY);
      return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
        x2,
        y2,
      };
    },
  },
  beforeDestroy() {
    this.$refs.canvas.removeEventListener("wheel", this.handleWheel);
    this.$refs.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.$refs.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.$refs.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.$refs.canvas.removeEventListener("mouseout", this.handleMouseOut);
  },
};
</script>
  
  <style scoped>
canvas {
  display: block;
  margin: 0 auto;
  border: 1px solid #ccc;
  position: absolute;
  width: 754px;
  height: 566px;
  left: 0px;
  top: 0px;
  touch-action: none;
  user-select: none;
  border-radius: 12px;
}
</style>