<template>
	<el-dialog
		ref="dialog"
		:visible="moveStaffVisible"
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
					<el-form-item label="员工" prop="EmpID">
						<el-select
							v-model="form.EmpID"
							filterable
							remote
							reserve-keyword
							placeholder="请输入员工姓名或电话"
							:remote-method="EmpInfoRemoteMethod"
							:loading="EmpLoading"
						>
							<el-option
								v-for="item in EmpInfoRes"
								:key="item.KeyID"
								:label="item.UserName"
								:value="item.KeyID"
							>
								<span style="float: left">{{ item.UserName }}</span>
								<span
									style="float: right; color: #8492a6; font-size: 13px;margin-right: 20px"
								>{{ item.Tel }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="clearfix">
					<el-form-item label="组织架构" prop="staffKeyID">
						<el-cascader
							ref="cascader"
							separator=">"
							expand-trigger="hover"
							:options="treeData"
							@active-item-change="handleParentChange"
							:props="defaultOptions"
							v-model="form.staffKeyID"
						></el-cascader>
					</el-form-item>
				</div>
				<div class="clearfix">
					<el-form-item label="员工级别" prop="Lv">
						<el-select v-model="form.Lv" placeholder="请选择">
							<el-option
								v-for="item in LvOptions"
								:key="item.Value"
								:label="item.Description"
								:value="item.Value"
							></el-option>
						</el-select>
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
  import { ShowStaffSysEmpList, UpdateEmployeeinfoStaffSys } from '@/api/system'

  export default {
  	props: {
  		moveStaffVisible: Boolean,
  		treeData: Array,
  		curOrganizationKeyID: Number
  	},
  	name: 'addStaff',
  	data() {
  		return {
  			btnLoading: false,
  			EmpLoading: false,
  			defaultOptions: {
  				label: 'SysName',
  				value: 'KeyID'
  			},
  			form: {
  				EmpID: '',
  				staffKeyID: [],
  				Lv: ''
  			},
  			EmpInfoRes: [],
  			dialogTitle: '新增人员',
  			rules: {
  				EmpID: [{ required: true, message: '请选择员工', trigger: 'change' }],
  				staffKeyID: [
  					{ required: true, message: '请选择组织架构', trigger: 'change' }
  				],
  				Lv: [{ required: true, message: '请选择员工级别', trigger: 'change' }]
  			},
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
  			this.$refs.form.resetFields()
  			this.$emit('close')
  		},
  		EmpInfoRemoteMethod(query) {
  			if (query !== '') {
  				this.EmpLoading = true
  				ShowStaffSysEmpList({
  					parm: {
  						page: 1,
  						size: 10
  					},
  					Keyword: query
  				}).then(({ Data }) => {
  					this.EmpLoading = false
  					this.EmpInfoRes = Data
  				})
  			} else {
  				this.EmpInfoRes = []
  			}
  		},
  		submitAddedForm() {
  			this.$refs.form.validate(valid => {
  				if (valid) {
  					this.btnLoading = true
  					UpdateEmployeeinfoStaffSys({
  						...this.form,
  						staffKeyID: this.form.staffKeyID[this.form.staffKeyID.length - 1]
  					})
  						.then(res => {
  							this.$message.success('新增成功')
  							const nodeRes = getTreeNodeByValue(
  								this.treeData,
  								res.Data.PID,
  								this.defaultOptions
  							)
  							this.$emit('movedStaff', res.Data, nodeRes.pathArr)
  							this.dialogClose()
  						})
  						.finally(() => {
  							this.btnLoading = false
  						})
  				}
  			})
  		},
  		handleOpen() {
  			const res =
  				this.curOrganizationKeyID &&
  				getTreeNodeByValue(
  					this.treeData,
  					this.curOrganizationKeyID,
  					this.defaultOptions
  				)
  			this.form.staffKeyID = res ? res.pathArr : []
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
