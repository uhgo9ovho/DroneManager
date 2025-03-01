<template>
  <div class="tree-promission">
    <el-tree
      :data="data"
      ref="menu"
      node-key="menuId"
      :props="defaultProps"
      show-checkbox
      highlight-current
      @check="currentChecked"
      :default-checked-keys="checkedKeys"
      :check-strictly="isCheck"
    ></el-tree>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    checkedKeys: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.isCheck = true
    this.$nextTick(() => {
      this.$refs.menu.setCheckedKeys(this.checkedKeys); //给树节点赋值回显
      this.isCheck = false; //重点： 赋值完成后 设置为false
    });
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "menuName",
      },
      isCheck: false,
    };
  },
  methods: {
    currentChecked(nodeObj, SelectedObj) {
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      console.log(halfCheckedKeys);

      this.$emit("selectedKeys", SelectedObj.checkedKeys, halfCheckedKeys);
    },
  },
};
</script>