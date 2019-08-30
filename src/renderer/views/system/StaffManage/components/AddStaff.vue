<template>
  <el-dialog
    ref="dialog"
    :visible="addStaffVisible"
    @close="dialogClose"
    append-to-body
    @open="handleOpen"
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
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="form.idCard" placeholder="请输入身份证号" :maxlength="18"></el-input>
            <transition name="el-zoom-in-top">
              <div
                v-if="IdentityData.status==='01'"
                class="el-form-item-success"
              >{{IdentityData.msg}}</div>
            </transition>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="组织架构" prop="structure">
            <el-cascader
              ref="cascader"
              separator=">"
              expand-trigger="hover"
              :options="tree"
              @active-item-change="handleParentChange"
              :props="defaultOptions"
              v-model="form.structure"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="联系方式" prop="Tel">
            <el-input v-model="form.Tel" placeholder="请输入联系方式" :maxlength="11"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="角色权限">
            <select-role :role-arr="roleArr" :options="options" @change="handleRoleChange"></select-role>
          </el-form-item>
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
  import { addStaffData, editStaffData } from '@/api/system'
  import SelectRole from '../../components/SelectRole.vue'
  import { findNodeByArr } from '@/utils/getStructure/findNodeByArr'
  import { validatePhone } from '@/utils/validate/rulevalidator'
  import { getAccessConsigData } from '@/api/system'

  export default {
    props: {
      addStaffVisible: Boolean,
      treeData: Array,
      editingData: Object,
      depStructure: Array
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
        //   validateIDCard({ idCard: this.form.idCard, Name: this.form.UserName }).then(res => {
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
        defaultOptions: {
          value: 'id'
        },
        form: {},
        tree: [],
        isEdit: false,
        depFullID: '',
        dialogTitle: '',
        rules: {
          UserName: [
            { required: true, message: '请输入员工姓名', trigger: 'blur' }
          ],
          Tel: [
            { required: true, message: '请输入员工电话', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          structure: [
            { required: true, message: '请输入组织架构', trigger: 'change' }
          ],
          idCard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { validator: validateCardID, trigger: 'blur' }
          ]
        },
        organization: [],
        roleArr: [],
        options: [],
        oldIDSum: [],
        newIDSum: [],
        existRoles: [],
        IdentityData: {} // 身份验证之后返回的身份信息
      }
    },
    computed: {
      userinfo() {
        return this.$store.getters.userinfo
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
      getFullID(structArr) {
        this.organization = []
        let isFirst = true
        let flag = true
        findNodeByArr(this.tree, structArr, node => {
          if (node.type === 'BusinessID') {
            this.form.FullID = node.id + ''
          } else if (node.type === 'CompanyID') {
            this.form.CorporationName = node.label // 获取到最后一级的公司的名字
            if (isFirst) {
              this.form.FullID += '-' + node.id
              isFirst = false
            } else {
              this.form.FullID += '.' + node.id
            }
          } else {
            if (flag) {
              this.form.FullID += '-' + node.id
              flag = false
            } else {
              this.form.FullID += '.' + node.id
            }
          }
          this.organization.push(node.label)
        })
        this.depFullID = this.form.FullID
      },
      submitAddedForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            debugger
            this.btnLoading = true
            const idStr = this.form.FullID + '-'
            const idArr = idStr.match(/\d+-/g)
            this.form.BusinessID = parseInt(idArr[0])
            if (idArr.length < 3 && parseInt(idArr[idArr.length - 1]) > 1000000) { // 当最后一个为部门且总共深度为两层,认为是直属企业的部门
              this.form.CompanyID = 0
              this.form.FullID = this.form.FullID.replace('-', '-0-')
              this.form.DepartmentID = parseInt(idArr[1])
            } else {
              this.form.CompanyID = parseInt(idArr[1])
              this.form.DepartmentID = parseInt(idArr[2])
            }
            this.form.PID = this.form.DepartmentID
              ? this.form.DepartmentID
              : this.form.CompanyID
            this.form.Organization = this.organization.join('>')
            // debugger
            this.form.IDSum = this.$DiffArrFn(this.oldIDSum, this.newIDSum, [
              'RoleID'
            ])
            console.log(this.form)
            if (this.isEdit) {
              this.form.FullID += '-' + this.form.KeyID
              editStaffData(this.form)
                .then(res => {
                  this.dialogClose()
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  debugger
                  // this.form.IDSum = this.newIDSum
                  this.$emit('editedStaff', res.Data, this.depFullID)
                })
                .catch(res => {
                  this.btnLoading = false
                })
            } else {
              this.form.FullID += '-*'
              addStaffData(this.form)
                .then(res => {
                  this.dialogClose()
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.$emit('addedStaff', res.Data, this.depFullID)
                })
                .catch(res => {
                  this.btnLoading = false
                })
            }
          }
        })
      },
      handleOpen() {
        this.btnLoading = false
        this.IdentityData = {}
        this.isEdit = Object.keys(this.editingData).length
        if (this.isEdit) {
          this.dialogTitle = '修改员工'
          this.form = this.$deepCopy(this.editingData)
          this.oldIDSum = this.form.IDSum.map(v => {
            return {
              KeyID: v.RoleID,
              RoleID: v.RoleID
            }
          })
          this.form.structure = this.form.FullID.match(/\d+/g).map(val => +val)
          if (this.form.DepartmentID !== 0) { // 部门ID为0则为公司负责人,则不需要剔除本身
            this.form.structure.pop()
          }
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
            idCard: '',
            Organization: [],
            structure: this.depStructure
          }
          this.options = [...this.existRoles]
          this.roleArr = []
        }
        this.tree = this.$deepCopy(this.treeData)
        this.filter(this.tree)
        if (this.form.structure.length) {
          this.handleChange(this.form.structure)
        } // 如果组织结构有默认值,执行一次点击函数
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      },
      handleChange(val) {
        console.log(this.$refs.cascader)
        this.form.FullID = ''
        this.getFullID(val)
      },
      handleParentChange(val) {
        this.$refs.cascader.menu.$el.onclick = (e) => {
          if (e.srcElement.nodeName === 'LI') {
            if (val[val.length - 1] > 100000 && findNodeByArr(this.tree, val).children) { // val最后一项大于100000代表是部门,且如果为叶子节点则不添加onclick
              this.$refs.cascader.handlePick(val)
            }
          }
        }
      },
      filter(tree) {
        for (let i = 0; i < tree.length; i++) {
          const val = tree[i]
          if (!val.children && val.type === 'CompanyID') {
            val.disabled = true
          } else if (val.children) {
            this.filter(val.children)
          }
        }
      },
      handleNameBlur() {
        // 名字Input失去焦点时验证身份证号合法性
        const idCardFiled = this.$refs['form'].$children.find(val => val.label === '身份证号')
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
