<template>
  <div>
    <div class="clearfix">
      <el-form-item label="房屋设备清单">
        <el-button type="primary" size="mini" @click="selectGoods" :disabled="disabled">选择</el-button>
        <el-button type="primary" size="mini" @click="addGoods" :disabled="disabled">添加</el-button>
      </el-form-item>
    </div>
    <div class="clearfix input-box" v-show="list.length>0">
      <div class="input-single" v-for="(item, index) in list" :key="index">
        <div class="input-handle">
          <input type="text" class="name" maxlength="8" v-model="item.EquipmentName" placeholder="设备名称" @blur="handleBlur(item)"
                 :disabled="disabled">
          <span @click="subNum(item)">-</span>
          <input type="number" class="number" v-model="item.EquipmentNumber"
                 @blur="$positive(item,'EquipmentNumber',1,true,1000)"
                 :disabled="disabled"
          >
          <span @click="addNum(item)">+</span>
        </div>
        <i class="iconfont icon-shanjianmoren" @click="subGoods(index)" v-if="!disabled"></i>
      </div>
    </div>
    <el-dialog append-to-body :visible.sync="visible" title="选择房屋设备清单" width="640px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllFlag" @change="checkAll">全选</el-checkbox>
      <el-checkbox-group v-model="checkedList" class="equipment-checklist" @change="checkItem">
        <el-checkbox v-for="(item,index) in equipments" :key="index" :label="item"></el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      validateMin: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        visible: false,
        equipments: ['电视机', '洗衣机', '微波炉', '热水器', '冰箱', '炉具', '抽油烟机', '消毒柜', '床头柜', '衣柜', '餐桌', '床', '窗帘', '沙发', '空调', '茶几', '电路', '灯具', '漏水', '厨房设备', '卫生间设备', '电视柜'],
        checkedList: [],
        checkAllFlag: false,
        isIndeterminate: true
      }
    },
    methods: {
      checkAll(val) {
        this.checkedList = val ? this.equipments : []
        this.isIndeterminate = false
      },
      checkItem(val) {
        const checkedCount = val.length
        this.checkAllFlag = checkedCount === this.equipments.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.equipments.length
      },
      addGoods() {
        this.list.push({
          EquipmentName: '',
          EquipmentNumber: 1
        })
      },
      subGoods(index) {
        this.list.splice(index, 1)
      },
      subNum(item) {
        if (this.disabled) return
        if (item.EquipmentNumber > 1) {
          item.EquipmentNumber--
        }
      },
      addNum(item) {
        if (this.disabled) return
        item.EquipmentNumber++
      },
      getValue() {
        return this.list.slice()
      },
      validate() {
        if (this.list.some(v => {
          return !v.EquipmentName || v.EquipmentNumber < this.validateMin
        })) {
          return false
        } else {
          return true
        }
      },
      selectGoods() {
        this.visible = true
        const checkedList = []
        this.list.map(v => {
          if (this.equipments.find(x => x === v.EquipmentName)) {
            checkedList.push(v.EquipmentName)
          }
        })
        this.checkedList = checkedList
      },
      handleCancel() {
        this.visible = false
      },
      handleConfirm() {
        // 删除勾掉的系统配置项目
        const cloneArr = this.$deepCopy(this.list)
        let count = 0
        cloneArr.map((x, i) => {
          if (this.equipments.find(v => v === x.EquipmentName) && !this.checkedList.find(v => v === x.EquipmentName)) {
            // 是系统的
            this.list.splice(i - count++, 1)
          }
        })
        // 新增多勾选的
        this.checkedList.map(x => {
          if (!this.list.find(v => v.EquipmentName === x)) {
            this.list.push({
              EquipmentName: x,
              EquipmentNumber: 1
            })
          }
        })
        this.visible = false
      },
      handleBlur(item) {
        // 判断重复 就清空
        let count = 0
        for (let i = 0; i < this.list.length; i++) {
          if (item.EquipmentName === this.list[i].EquipmentName) {
            count++
          }
        }
        if (count > 1) {
          item.EquipmentName = ''
          this.$message.error('已经存在该设备')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "style";
</style>
