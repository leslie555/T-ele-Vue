<template>
	<el-dialog
		ref="dialog"
		:visible="addOrganizationVisible"
		@close="dialogClose"
		append-to-body
		@open="handleOpen"
		:title="dialogTitle"
		:center="true"
		width="480px"
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
			<div class="dialog-container form-item-md">
				<div class="clearfix">
					<el-form-item label="组织名字" prop="SysName">
						<el-input v-model="form.SysName" :maxlength="40"></el-input>
					</el-form-item>
					<el-form-item label="组织别名" prop="Sysalias">
						<el-input v-model="form.Sysalias" :maxlength="40"></el-input>
					</el-form-item>
				</div>
				<div class="clearfix">
					<el-form-item label="组织架构" prop="PID">
						<el-cascader
							:disabled="isEdit"
							ref="cascader"
							separator=">"
							expand-trigger="hover"
							:options="treeData"
							@expand-change="handleParentChange"
							:props="defaultOptions"
							v-model="form.PID"
						></el-cascader>
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
  import { findNodeByArr, getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
  import { AddStaffSys, UpdateStaffSys } from '@/api/system'

  export default {
  	props: {
  		addOrganizationVisible: Boolean,
  		treeData: Array,
  		curOrganizationKeyID: Number,
  		editOrganizationData: Object
  	},
  	name: 'addStaff',
  	data() {
  		return {
  			btnLoading: false,
  			isEdit: false,
  			defaultOptions: {
  				label: 'SysName',
  				value: 'KeyID'
  			},
  			form: {
  				SysName: '',
  				Sysalias: '',
  				PID: []
  			},
  			dialogTitle: '',
  			rules: {
  				SysName: [{ required: true, message: '请选择组织名字', trigger: 'blur' }],
  				Sysalias: [{ required: true, message: '请选择组织别名', trigger: 'blur' }],
  				PID: [{ required: true, message: '请选择组织架构', trigger: 'change' }]
  			},
  			orginPID: 0, // 初始PID 用于判断是否移动组织架构
  			markDisbale: false
  		}
  	},
  	methods: {
  		dialogClose() {
  			this.$emit('close')
  		},
  		submitAddedForm() {
  			this.$refs.form.validate(valid => {
  				if (valid) {
  					this.btnLoading = true
  					let Organ = '' // 组织层级名称
  					const node = findNodeByArr(
  						this.treeData,
  						this.form.PID,
  						node => {
  							Organ += node.SysName + '>'
  						},
  						this.defaultOptions
  					)
  					Organ += this.form.SysName
  					if (this.isEdit) {
  						UpdateStaffSys({
  							...this.form,
  							PID: node.KeyID,
  							Organ,
  							LvNumber: node.LvNumber + 1 // 组织级别
  						}).then(({ Data }) => {
  							this.btnLoading = false
  							this.$message.success('修改成功')
  							this.$emit('editedOrganization', Data, this.orginPID)
  							this.dialogClose()
  						})
  					} else {
  						AddStaffSys({
  							...this.form,
  							PID: node.KeyID,
  							Organ,
  							LvNumber: node.LvNumber + 1 // 组织级别
  						})
  							.then(({ Data }) => {
  								this.btnLoading = false
  								this.$message.success('新增成功')
  								this.$emit('addedOrganization', Data)
  								this.dialogClose()
  							})
  							.finally(() => {
  								this.btnLoading = false
  							})
  					}
  				}
  			})
  		},
  		handleOpen() {
  			this.isEdit = !!this.editOrganizationData
  			const res =
  				this.curOrganizationKeyID &&
  				getTreeNodeByValue(
  					this.treeData,
  					this.curOrganizationKeyID,
  					this.defaultOptions
  				)
  			if (this.isEdit) {
  				this.dialogTitle = '修改组织'
  				Object.assign(this.form, this.editOrganizationData)
  				res.pathArr.pop()
  				this.orginPID = res.pathArr[res.pathArr.length - 1]
  			} else {
  				this.dialogTitle = '新增组织'
  				this.form = {
  					SysName: '',
  					Sysalias: '',
  					PID: []
  				}
  			}
  			this.form.PID = res ? res.pathArr : []
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
  						findNodeByArr(this.treeData, val, null, this.defaultOptions).children
  					) {
  						// 如果为叶子节点则不添加onclick
  						this.$refs.cascader.handlePick(val)
  					} else {
  						this.markDisbale = false
  					}
  				}
  			}
  		}
  	}
  }
</script>
