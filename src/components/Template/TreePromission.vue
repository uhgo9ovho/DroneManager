<template>
  <div class="tree-promission">
    <el-tree
      ref="tree"
      :data="data"
      node-key="menuId"
      :props="defaultProps"
      :show-checkbox="showCheckbox"
      highlight-current
      :default-checked-keys="checkedKeys"
      @check="currentChecked"
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
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "menuName",
      },
    };
  },
  methods: {
    currentChecked(nodeObj, SelectedObj) {
      console.log(nodeObj, SelectedObj);
      this.$emit('selectedKeys', SelectedObj.checkedKeys)
    }
  },
};
</script>