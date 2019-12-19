<template>
	<el-form-item v-if="!isEmpty" label="组织架构" prop="FullIDNew">
		<el-cascader
			ref="cascader"
			separator=">"
			:clearable="!IsRequired"
			expand-trigger="hover"
			:options="treeData"
			@change="handleChange"
			@active-item-change="handleParentChange"
			:props="defaultOptions"
			v-model="organID"
		></el-cascader>
	</el-form-item>
</template>

<script>
  import { findNodeByArr, getTreeNodeByValue } from '@/utils/arrUtil/treeArr'
  import { mapState } from 'vuex'

  export default {
  	name: 'SelectOrganization',
  	props: {
  		value: String,
  		type: {
  			type: Number,
  			default: 1
  		}
  	},
  	data() {
  		return {
  			defaultOptions: {
  				label: 'SysName',
  				value: 'KeyID'
  			},
  			markDisbale: false
  		}
  	},
  	computed: {
  		...mapState({
  			treeData: state => state.organizationTree.treeData,
  			isEmpty: state => state.organizationTree.isEmpty,
  			IsRequired: state => state.user.userinfo.IsRequired // 新组织是否必须默认
  		}),
  		organID: {
  			get() {
  				const value = parseInt(this.value.split('-').pop())
  				if (value) {
  					return getTreeNodeByValue(this.treeData, value, this.defaultOptions)
  						.pathArr
  				} else {
  					return []
  				}
  			},
  			set(val) {
  				const node = findNodeByArr(
  					this.treeData,
  					val,
  					undefined,
  					this.defaultOptions
  				)
  				this.$emit('input', node ? node.FullID : '')
  			}
  		}
  	},
  	methods: {
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
  		},
  		createTree(tree, data) {
  			if (!tree.length) return
  			tree.forEach(val => {
  				const children = data.filter(v => v.PID === val.KeyID)
  				if (children.length) {
  					val.children = children
  				}
  				this.createTree(children, data)
  			})
  			return tree
  		}
  	},
  	created() {
  		if (this.type !== 2 && this.IsRequired && !this.isEmpty) {
  			const value = parseInt(this.treeData[0].FullID.split('-').pop())
  			this.organID = value
  				? getTreeNodeByValue(this.treeData, value, this.defaultOptions).pathArr
  				: []
  		}
  	},
  	mounted() {
  		this.$store.dispatch('initOrganization', this.type)
  	}
  }
</script>

<style>
</style>