<template>
  <div class="panel data-list-bottom">
    <div class="data-list-select">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                   v-show="$slots['default']">全选
      </el-checkbox>
      <slot></slot>
    </div>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="currentSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'BottomToolBar',
    props: {
      list: Array,
      pageSize: {
        type: Number,
        default: 10
      },
      handlePageChange: Function,
      beforeLoad: {
        type: Function,
        default: function() {
          return new Promise((r) => r())
        }
      },
      checkedLength: Number,
      tableRefName: {
        type: String,
        default: 'multipleTable'
      },
      renderFirst: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        activeFlag: true,
        currentPage: 1,
        currentSize: this.pageSize,
        total: 0,
        rowsLength: null,
        checkAll: false
      }
    },
    created() {
      if (!this.renderFirst) return
      this.beforeLoad().then(() => {
        this.search(2)
      })
    },
    computed: {
      isIndeterminate: {
        get() {
          if (this.checkedLength === this.rowsLength) {
            this.checkAll = true
          }
          if (this.checkedLength === 0) {
            this.checkAll = false
          }
          return this.checkedLength > 0 && this.checkedLength < this.rowsLength
        },
        set(val) {
          return val
        }
      }
    },
    methods: {
      handleCheckAllChange(flag) {
        this.$parent.$refs[this.tableRefName].toggleAllSelection()
        this.isIndeterminate = false
      },
      handleSizeChange(size) {
        this.currentSize = size
        this.search(2)
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.search(2)
      },
      search(type = 0) {
        // 0 重新搜索 1 activated 搜索  2 分页正常搜索
        if (type === 0) {
          this.reset()
        }
        if (type === 1 && this.activeFlag) {
          this.activeFlag = false
          return
        }
        return this.handlePageChange({
          size: this.currentSize,
          page: this.currentPage
        }).then(data => {
          this.rowsLength = data.rows.length
          this.total = data.records
          // 切换时让table滚动到最上面去
          if (this.$parent.$refs[this.tableRefName]) {
            this.$parent.$refs[this.tableRefName].$el.querySelector('.el-table__body-wrapper').scrollTop = 0
          }
          return data
        })
      },
      reset() {
        this.currentPage = 1
        this.currentSize = this.pageSize
        // this.total = 0
      },
      getTotal() {
        return this.total
      }
    }
  }
</script>
