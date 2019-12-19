<template>
  <div>
    <el-dialog title="处理完成" :center="true" :width="dialogWidth" append-to-body :visible.sync="dialogFormVisible">
      <div>
        <!-- <div>保洁图片</div> -->
         <div class="clearfix form-item-md">
           <el-form ref="form" :model="form">
            <el-form-item>
              <upload-file title="保洁图片" ref="uploadFile" :img-list="form.ImgList"></upload-file>
            </el-form-item>
            <el-form-item label="保洁备注">
             <el-input
                type="textarea"
                :rows="4"
                placeholder="请填写备注"
                v-model="form.Remark">
             </el-input>
            </el-form-item>
          </el-form>
         </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { UploadFile } from '@/components/UploadFile'
import { EditCleaning } from '@/api/purchase'
export default {
  name: 'CompleteDialog',
  components: {
    UploadFile
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '600px',
      form: {
        ImgList: [],
        Remark: ''
      },
      RepeatImglist: [],
      list: {}
    }
  },
  methods: {
    open(dataList) {
      this.list = this.$deepCopy(dataList)
      this.RepeatImglist = this.$deepCopy(this.form.ImgList)
      // this.form.RepeatImglist = this.$deepCopy()
      console.log('传过来的dataList数据', dataList)
      this.dialogFormVisible = true
    },
    submitBtn() {
      console.log(this.form)
      const item = this.form.ImgList.map(res => {
        return res.KeyID
      })
      const id = item.join(',')
      const imgArrList = this.$DiffArrFn(this.RepeatImglist, this.form.ImgList, ['KeyID'])
      EditCleaning({
        KeyID: this.list.KeyID,
        State: this.list.State,
        CleaningIDSum: id, // 图片id
        CleaningImg: imgArrList, // 图片集合
        CleaningRemark: this.form.Remark // 备注
      }).then(res => {
        console.log(res)
        this.dialogFormVisible = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-textarea {
  width: 85%;
}
</style>