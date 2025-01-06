<template>
  <div class="tree-promission">
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      @node-click="handleNodeClick"
      :show-checkbox="showCheckbox"
      highlight-current
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
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>