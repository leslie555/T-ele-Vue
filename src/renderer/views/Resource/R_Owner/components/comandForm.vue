<template>
  <el-dialog
    :visible="ComandVisible"
    @close="close"
    title="指派"
    :center="true"
    width="400px"
    append-to-body
  >
    <el-form>
      <el-form-item label="指派">
        <el-input
          v-model="form.UserName"
          style="width: 200px; margin-right: 10px;"
          :readonly="true"
        ></el-input>
        <select-employee
          :canSelectDep="false"
          allCompany
          v-show="isShowSelect"
          @empChange="getPeople"
        >
          <el-button type="primary" @click="popoverVisible = true" size="mini">选择</el-button>
        </select-employee>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="CommandSomeOne" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SelectEmployee from '@/components/SelectEmployee'
  import { AddAssign } from '@/api/resource'

  export default {
    name: 'comand-form',
    components: {
      SelectEmployee
    },
    data() {
      return {
        form: {
          Full: '',
          UserName: '',
          UserID: '',
          ProfessionID: ''
        },
        btnLoading: false,
        ComandVisible: false,
        isShowSelect: true
      }
    },
    methods: {
      open(KeyID) {
        this.form.ProfessionID = KeyID
        this.btnLoading = false
        this.ComandVisible = true
      },
      close() {
        this.btnLoading = false
        this.form.Full = ''
        this.form.UserName = ''
        this.form.UserID = ''
        this.form.ProfessionID = ''
        this.ComandVisible = false
      },
      getPeople(data) {
        console.log(data)
        this.form.Full = !data.fullID ? data.FullID : data.fullID
        this.form.UserName = !data.label ? data.UserName : data.label
        this.form.UserID = data.EmpID
      },
      CommandSomeOne() {
        this.btnLoading = true
        if (!this.form.Full) {
          this.$message({
            type: 'warning',
            message: '请选择指派人!'
          })
          this.btnLoading = false
        } else {
          AddAssign(this.form)
            .then(res => {
              if (res.Code === 0) {
                this.$message({
                  type: 'success',
                  message: '指派成功!'
                })
                this.btnLoading = false
              }
              this.$emit('changeType', this.form.ProfessionID)
              this.close()
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      }
    }
  }
</script>
  