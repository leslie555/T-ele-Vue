<template>
  <el-dialog
    width="940px"
    append-to-body
    center
    class="has-scroll"
    title="客户调查表"
    :visible.sync="dialogVisible"
  >
    <div class="bills-preview-box" :id="uuid">
      <iframe id="bills-preview" frameborder="0" width="100%" height="100%" :src="url"></iframe>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  /* eslint-disable no-undef */
  import uuid from '@/utils/uuid'
  import { gwUrl } from '@/config'

  export default {
    name: 'SurveyTemplate',
    data() {
      return {
        uuid: uuid(),
        url: '',
        dialogVisible: false
      }
    },
    methods: {
      open(row) {
        this.dialogVisible = true
        this.url = `${gwUrl}/external/M8Survey?to=${this.$store.getters.token}&KeyID=${row.KeyID}`
      },
      close() {
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../../styles/variables';
  @import '../../../../../styles/mixin';
  // @import "style";
  .bills-preview-box {
    height: 600px;
    // overflow: auto;
  }
</style>
