<template>
  <el-dialog
    ref="dialog"
    :visible="addStaffVisible"
    @close="dialogClose"
    append-to-body
    @open="handleOpen"
    @closed="showOrgan=false"
    :title="dialogTitle"
    :center="true"
    width="640px"
  >
    <el-form
      :model="form"
      ref="form"
      inline
      :rules="rules"
      label-position="right"
      label-width="80px"
      status-icon
    >
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="员工姓名" prop="UserName">
            <el-input
              v-model="form.UserName"
              placeholder="请输入员工姓名"
              @blur="handleNameBlur"
              :maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="CardID">
            <el-input v-model="form.CardID" placeholder="请输入身份证号" :maxlength="18"></el-input>
            <transition name="el-zoom-in-top">
              <div
                v-if="IdentityData.status==='01'"
                class="el-form-item-success"
              >{{IdentityData.msg}}</div>
            </transition>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="组织架构" prop="PID">
            <el-cascader
              v-if="showOrgan"
              ref="cascader"
              separator=">"
              expand-trigger="hover"
              :options="treeData"
              @active-item-change="handleParentChange"
              :props="defaultOptions"
              v-model="form.PID"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="联系方式" prop="Tel">
            <el-input v-model="form.Tel" placeholder="请输入联系方式" :maxlength="11"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="员工级别" prop="Lv">
            <el-select v-if="$isCompanyBoss" v-model="form.Lv" placeholder="请选择">
              <el-option
                v-for="item in LvOptions"
                :key="item.Value"
                :label="item.Description"
                :value="item.Value"
              ></el-option>
            </el-select>
            <el-select v-else :value="5" disabled>
              <el-option label="普通员工" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色权限">
            <select-role
              v-if="$isCompanyBoss"
              :role-arr="roleArr"
              :options="options"
              @change="handleRoleChange"
            ></select-role>
            <el-select v-else :value="28" disabled>
              <el-option label="业务员" :value="28"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="密 码">
            <el-input v-model="form.LoginPwd" placeholder="000000" :maxlength="20"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="submitAddedForm">确 定</el-button>
      <el-button type="primary" @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-form-item-success {
    color: #33cc99;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
</style>


<script>
  import {
    AddStaffSysEmployeeinfo,
    UpdateStaffSysEmployeeinfo
  } from '@/api/system'
  import SelectRole from '../../components/SelectRole.vue'
  import { findNodeByArr, getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
  import { validatePhone } from '@/utils/validate/rulevalidator'
  import { getAccessConsigData } from '@/api/system'

  export default {
    props: {
      addStaffVisible: Boolean,
      treeData: Array,
      editingData: Object,
      curSelectedOrgan: Number
    },
    name: 'addStaff',
    components: {
      SelectRole
    },
    data() {
      const validateCardID = (rule, value, callback) => {
        callback()
        // TODO
        // this.IdentityData = {}
        // if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
        //   // callback()
        //   validateIDCard({ CardID: this.form.CardID, Name: this.form.UserName }).then(res => {
        //     const data = JSON.parse(res.Data)
        //     this.IdentityData = data
        //     if (data.status === '01') {
        //       callback()
        //     } else {
        //       callback(new Error(data.msg))
        //     }
        //   })
        // } else {
        //   callback(new Error('身份证号格式不正确'))
        // }
      }
      return {
        btnLoading: false,
        showOrgan: false,
        defaultOptions: {
          label: 'SysName',
          value: 'KeyID'
        },
        form: {},
        isEdit: false,
        dialogTitle: '',
        rules: {
          UserName: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' }
          ],
          Tel: [
            { required: true, message: '请输入员工电话', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          PID: [{ required: true, message: '请输入组织架构', trigger: 'change' }],
          CardID: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { validator: validateCardID, trigger: 'blur' }
          ],
          Lv: this.$isCompanyBoss
            ? [{ required: true, message: '请选择员工级别', trigger: 'change' }]
            : []
        },
        roleArr: [],
        options: [],
        oldIDSum: [],
        newIDSum: [],
        existRoles: [],
        IdentityData: {}, // 身份验证之后返回的身份信息
        markDisbale: false
      }
    },
    computed: {
      LvOptions() {
        return this.$EnumData.getEnumListByKey('StaffLevel')
      }
    },
    methods: {
      dialogClose() {
        this.$emit('close')
      },
      handleRoleChange(val) {
        this.newIDSum = val.map(v => {
          return {
            KeyID: v,
            RoleID: v
          }
        })
      },
      submitAddedForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.btnLoading = true
            const form = { ...this.form }
            if (this.$isCompanyBoss) {
              form.IDSum = this.$DiffArrFn(this.oldIDSum, this.newIDSum, [
                'RoleID'
              ])
            } else {
              form.IDSum = {
                KeyID: 28,
                RoleID: 28,
                RoleName: '业务员',
                ModifyStatus: this.isEdit ? 0 : 1
              }
              form.Lv = 5
            }
            form.PID = form.PID[form.PID.length - 1]
            console.log(form)
            if (this.isEdit) {
              UpdateStaffSysEmployeeinfo(form)
                .then(res => {
                  this.dialogClose()
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  const nodeRes = getTreeNodeByValue(
                    this.treeData,
                    res.Data.PID,
                    this.defaultOptions
                  )
                  this.$emit('editedStaff', res.Data, nodeRes.pathArr)
                })
                .catch(res => {
                  this.btnLoading = false
                })
            } else {
              AddStaffSysEmployeeinfo(form)
                .then(res => {
                  this.dialogClose()
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  const nodeRes = getTreeNodeByValue(
                    this.treeData,
                    res.Data.PID,
                    this.defaultOptions
                  )
                  this.$emit('addedStaff', res.Data, nodeRes.pathArr)
                })
                .catch(res => {
                  this.btnLoading = false
                })
            }
          }
        })
      },
      handleOpen() {
        this.showOrgan = true
        this.btnLoading = false
        this.IdentityData = {}
        this.isEdit = !!this.editingData
        if (this.isEdit) {
          this.dialogTitle = '修改员工'
          this.form = this.$deepCopy(this.editingData)
          this.form.PID = getTreeNodeByValue(
            this.treeData,
            this.form.PID,
            this.defaultOptions
          ).pathArr
          this.oldIDSum = this.form.IDSum.map(v => {
            return {
              KeyID: v.RoleID,
              RoleID: v.RoleID
            }
          })
          this.roleArr = this.form.IDSum.map(v => v.RoleID)
          const options = [...this.existRoles]
          const roleIDs = options.map(v => v.value)
          this.form.IDSum.forEach(val => {
            if (!roleIDs.includes(val.RoleID)) {
              options.push({
                label: val.RoleName,
                value: val.RoleID,
                disabled: true
              })
            }
          })
          this.options = options
          this.handleRoleChange(this.roleArr)
        } else {
          this.dialogTitle = '新增员工'
          this.form = {
            UserName: '',
            Tel: '',
            LoginPwd: '',
            IDSum: [],
            FullID: '',
            CardID: '',
            Organization: '',
            PID: []
          }
          const res =
            this.curSelectedOrgan &&
            getTreeNodeByValue(
              this.treeData,
              this.curSelectedOrgan,
              this.defaultOptions
            )
          this.form.PID = res ? res.pathArr : []
          this.options = [...this.existRoles]
          this.roleArr = []
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      },
      handleChange(val) {
        if (
          val.length === 1 &&
          !findNodeByArr(this.treeData, val, null, this.defaultOptions).children
        ) {
          this.markDisbale = true
        }
        this.$emit('change', val)
      },
      handleParentChange(val) {
        this.$refs.cascader.menu.$el.onclick = e => {
          if (e.srcElement.nodeName === 'LI') {
            if (
              !this.markDisbale &&
              findNodeByArr(this.treeData, val, null, this.defaultOptions)
                .children
            ) {
              // 如果为叶子节点则不添加onclick
              this.$refs.cascader.handlePick(val)
            } else {
              this.markDisbale = false
            }
          }
        }
      },
      handleNameBlur() {
        // 名字Input失去焦点时验证身份证号合法性
        const idCardFiled = this.$refs['form'].$children.find(
          val => val.label === '身份证号'
        )
        if (idCardFiled.fieldValue) {
          idCardFiled.validate('blur')
        }
      }
    },
    created() {
      getAccessConsigData({
        Keyword: '',
        parm: {
          size: 1000,
          page: 1
        }
      }).then(res => {
        this.existRoles = res.Data.rows.map(v => {
          return {
            label: v.RoleName,
            value: v.KeyID
          }
        })
      })
    }
  }
</script>
