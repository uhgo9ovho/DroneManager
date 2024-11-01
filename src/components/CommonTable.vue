<template>
  <div class="common-table">
    <div class="table-box">
      <el-table :data="tableList" style="width: 100%" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="showSelection"></el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :show-overflow-tooltip="item.showOverflowTooltip"
          >
        <!-- 表头 slot -->
        <template
              slot="header"
              slot-scope="{ row }"
            >
              <slot
                :name="`${item.prop || item.key}-header`"
                :row="row"
              >
                <div
                  v-if="item.renderHeader"
                  style="padding: 0;line-height: 23px"
                  v-html="item.renderHeader()"
                />
                <template v-else>{{ item.label || item.prop }}</template>
              </slot>
            </template>
          <template v-if="item.slot" v-slot:default="scope">
            <slot
              :name="item.prop"
              :row="scope.row"
              :index="scope.$index"
            ></slot>
          </template>
          <template v-else v-slot:default="scope">
            <div>
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        class="xm-table-pagination"
        background
        :total="+total"
        :layout="pagerLayout"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :current-page="curPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        @prev-click="handlePageChange"
        @next-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    tableList: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    total: {
      type: [Number, String], //正常情况下应该是Number，但是不排除有字符串的情况（防止出现警告）
      default: 0,
    },
    //每页条数
    pageSize: {
      type: Number,
      default: 5,
    },
    //页码
    pageNum: {
      type: Number,
      default: 1,
    },
    //分页布局
    pagerLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    // 分页选择器的选项设置
    pageSizes: {
      type: Array,
      default() {
        return [10, 15, 50, 80, 100];
      },
    },
    //是否显示多选框
    showSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      curPage: 1, //当前页
    };
  },
  methods: {
    /**
     * 改变页数
     */
    handlePageChange(page) {
      const { pageSize, sortBy, sortOrder } = this;
      this.$emit("pageChange", {
        pageNum: page,
        pageSize,
        sorter: { prop: sortBy, order: sortOrder },
      });
    },
    /**
     * 改变每页显示的条数
     */
    handleSizeChange(size) {
      const { sortBy, sortOrder } = this;
      console.log(size);
      
      this.$emit("sizeChange", {
        pageNum: 1,
        pageSize: size,
        sorter: { prop: sortBy, order: sortOrder },
      });
    },
    /**
     * 多选的数据
     */
     handleSelectionChange(e) {
      this.$emit('handleSelectionChange', e)
     }
  },
};
</script>
<style lang="scss">
.common-table {
  .table-box {
    height: calc(100vh - 212px);
  }
  .pagination {
    width: 100%;
    height: 76px;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 !important;
    justify-content: right;
  }
}
</style>