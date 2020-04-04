<template>
  <div class="date-picker-range">
    <el-date-picker
      v-model="StartTime"
      type="date"
      :value-format="valueFormat"
      @change="changeStartTime"
      :clearable="false"
      :picker-options="pickerStartOptions"
      :placeholder="startPlaceholder">
    </el-date-picker>
    <span>{{rangeSeparator}}</span>
    <el-date-picker
      v-model="EndTime"
      type="date"
      :value-format="valueFormat"
      @change="changeEndTime"
      :clearable="false"
      :picker-options="pickerEndOptions"
      :placeholder="endPlaceholder">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: 'DatePickerRange',
    props: {
      value: {
        type: Array,
        default: []
      },
      day: {
        type: Number,
        default: 0
      },
      valueFormat: {
        type: String,
        default: 'yyyy-MM-dd 00:00:00'
      },
      startPlaceholder: {
        type: String,
        default: '开始日期'
      },
      endPlaceholder: {
        type: String,
        default: '结束日期'
      },
      min: {
        type: String,
        default: ''
      },
      max: {
        type: String,
        default: ''
      },
      rangeSeparator: {
        type: String,
        default: '至'
      }
    },
    watch: {
      value: {
        handler: function(newValue, oldValue) {
          // 约定不能让外部value存在只有一个值的情况
          if (this.mark) {
            this.mark = false
          } else if (typeof newValue === 'object') {
            this.StartTime = newValue[0]
            this.EndTime = newValue[1]
            if (!newValue[0] && newValue[1] || newValue[0] && !newValue[1]) {
              this.change()
            }
          }
        },
        immediate: true
      }
    },
    data() {
      const _self = this
      return {
        mark: false,
        StartTime: '',
        EndTime: '',
        pickerStartOptions: {
          disabledDate(time) {
            if (_self.min) {
              return time.getTime() < new Date(_self.min).getTime()
            } else if (_self.max) {
              return _self.timeN(time, _self.day) > new Date(_self.max).getTime()
            } else {
              return false
            }
          }
        },
        pickerEndOptions: {
          disabledDate(time) {
            let flag1 = false
            let flag2 = false
            if (_self.min) {
              flag1 = time.getTime() < new Date(_self.min).getTime()
            }
            if (_self.max) {
              flag2 = time.getTime() > new Date(_self.max).getTime()
            }
            return time.getTime() < _self.timeN(_self.StartTime, _self.day) || flag1 || flag2
          },
          shortcuts: [
            {
              text: '半年',
              onClick(picker) {
                picker.$emit('pick', _self.endTimeButton(6))
              }
            },
            {
              text: '一年',
              onClick(picker) {
                picker.$emit('pick', _self.endTimeButton(12))
              }
            },
            {
              text: '两年',
              onClick(picker) {
                picker.$emit('pick', _self.endTimeButton(24))
              }
            },
            {
              text: '三年',
              onClick(picker) {
                picker.$emit('pick', _self.endTimeButton(36))
              }
            },
            {
              text: '四年',
              onClick(picker) {
                picker.$emit('pick', _self.endTimeButton(48))
              }
            },
            {
              text: '五年',
              onClick(picker) {
                picker.$emit('pick', _self.endTimeButton(60))
              }
            }
          ]
        }
      }
    },
    methods: {
      timeN(time, n) {
        return new Date(time).setDate(new Date(time).getDate() + n)
      },
      changeStartTime(time) {
        if (new Date(time).getTime() > this.timeN(this.EndTime, -this.day)) {
          this.EndTime = this.$dateFormat(this.timeN(time, this.day), this.valueFormat)
        }
        this.change()
      },
      changeEndTime(time) {
        this.change()
      },
      change() {
        this.validate()
        if (this.StartTime && this.EndTime) {
          this.$emit('input', [this.StartTime, this.EndTime])
          this.$emit('change', [this.StartTime, this.EndTime])
        } else if (!this.StartTime && !this.EndTime) {
          this.$emit('input', [])
          this.$emit('change', [])
        } else {
          this.mark = true // 这种情况下不应该去清空 start或者end
          this.$emit('input', [])
          this.$emit('change', [])
        }
      },
      endTimeButton(month) {
        if (!this.StartTime) {
          this.StartTime = this.$dateFormat(new Date(), this.valueFormat)
        }
        const date = new Date(this.StartTime)
        date.setMonth(date.getMonth() + month)
        date.setDate(date.getDate() - 1)
        this.EndTime = this.$dateFormat(date, this.valueFormat)
        // this.change()
        return this.EndTime
      },
      validate() {
        if (this.max && new Date(this.EndTime).getTime() > new Date(this.max).getTime()) {
          this.EndTime = this.max
        }
        if (this.min && new Date(this.StartTime).getTime() < new Date(this.min).getTime()) {
          this.StartTime = this.min
        }
      }
    }
  }
</script>

<style lang="scss">
  .el-picker-panel__sidebar {
    width: 80px !important;
  }

  .el-picker-panel__sidebar + .el-picker-panel__body {
    margin-left: 80px !important;
  }

  .el-date-picker.has-sidebar {
    width: 408px !important;
  }
</style>
