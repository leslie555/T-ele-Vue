<template>
  <el-dialog :visible="EditVisible" title="修改小区" @close="dialogClose" :center="true" width="700px" append-to-body>
    <el-form :model="EditFormData" label-position="right" label-width="80px" :inline="true">
      <div class="dialog-container form-item-sm">
        <div class="clearfix">
          <el-form-item label="小区名称">
            <el-input v-model="EditFormData.CommunityName" :maxlength="32" @blur="handleBlur"></el-input>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="EditFormData.Location" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix">
          <el-form-item label="所属区域" style="width: 460px;">
            <el-cascader v-model="EditFormData.CityCodeMark" expand-trigger="hover" :options="CityData" separator=""
                         filterable></el-cascader>
          </el-form-item>
        </div>
        <div class="clearfix">
          <div id="community-map" class="community-amap"></div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="SubmitEditForm" :loading="loading">确 定</el-button>
      <el-button type="primary" @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>
  .community-amap {
    width: 600px;
    height: 250px;
    margin-left: 10px;
    margin-bottom: 20px;
  }
</style>
<script>
  /* eslint-disable no-extra-boolean-cast */

  import { CityData, getCityNameByCode, getCodeArrByCode } from '@/utils/CityData'
  import { EditMCommunityInfo } from '@/api/house'
  import { ShowCompanyinfoCityCode } from '../../../../api/system'

  export default ({
    name: 'edit-form',
    data() {
      return {
        CityData,
        EditFormData: {
          CommunityName: '',
          Location: '',
          CityCodeMark: ['', '', ''],
          CityCode: '',
          Longitude: '',
          Latitude: ''
        },
        loading: false,
        EditVisible: false,
        mainCityCode: -1,
        mainCityName: '成都'
      }
    },
    methods: {
      open(obj) {
        this.EditVisible = true
        if (!obj) {
          this.EditFormData = {
            CommunityName: '',
            Location: '',
            CityCodeMark: ['', '', ''],
            CityCode: '',
            Longitude: '',
            Latitude: ''
          }
        } else {
          this.EditFormData = {
            KeyID: obj.KeyID,
            CommunityName: obj.CommunityName,
            Location: obj.Location,
            CityCodeMark: getCodeArrByCode(obj.CityCode),
            CityCode: obj.CityCode,
            Longitude: obj.Longitude,
            Latitude: obj.Latitude
          }
        }
        if (!!this.EditFormData) {
          this.initMap(1)
        } else {
          this.initMap(2)
        }
      },
      handleBlur() {
        if (this.EditFormData.CommunityName) {
          this.searchMapKey()
        }
      },
      initMap(type = 0) {
        if (this.mainCityCode === -1) {
          ShowCompanyinfoCityCode({}).then(({ Data }) => {
            this.mainCityCode = Data || '510102' // 如果没有就默认成都
            const cityArr = getCityNameByCode(this.mainCityCode, 1)
            if (cityArr[1] === '市辖区') {
              this.mainCityName = cityArr[0]
            } else {
              this.mainCityName = cityArr[1]
            }
            this.initMap(type)
          })
          return
        }
        window.initMap = () => {
          this.mapObj = new AMap.Map('community-map')
          this.mapObj.on('click', this.mapClick)
          if (type === 1) {
            this.setCenterAndMark()
          } else if (type === 2) {
            this.searchMapKey(1)
          }
        }
        const url = 'https://webapi.amap.com/maps?v=1.4.14&key=283ff43b64b87f3c7835eb3b73f96e04&callback=initMap'
        const jsapi = document.createElement('script')
        jsapi.charset = 'utf-8'
        jsapi.src = url
        document.head.appendChild(jsapi)
      },
      mapClick(e) {
        this.EditFormData.Longitude = e.lnglat.lng
        this.EditFormData.Latitude = e.lnglat.lat
        this.setCenterAndMark()
      },
      searchMapKey(type = 0) {
        if (!this.EditFormData.CommunityName) return
        AMap.plugin('AMap.Autocomplete', () => {
          const autoOptions = {
            city: this.mainCityName,
            citylimit: true,
            datatype: 'poi'
          }
          var autoComplete = new AMap.Autocomplete(autoOptions)
          autoComplete.search(this.EditFormData.CommunityName, (status, result) => {
            // 搜索成功时，result即是对应的匹配数据
            if (status === 'complete' && result.info === 'OK') {
              const item = result.tips[0]
              this.mapSearchResult = item
              this.$nextTick(() => {
                this.EditFormData.CityCode = item.adcode
                this.EditFormData.CityCodeMark = getCodeArrByCode(item.adcode)
                this.EditFormData.CityName = item.district
                this.EditFormData.Longitude = item.location && item.location.lng
                this.EditFormData.Latitude = item.location && item.location.lat
                // 之前没有经纬度的搜索的重置，点击的不重置
                if (type === 1) {
                  if (typeof item.address === 'string') {
                    this.EditFormData.Location = item.address
                  }
                }
                this.setCenterAndMark()
              })
            }
          })
        })
      },
      setCenterAndMark() {
        if (this.mapMark) {
          this.mapObj.remove(this.mapMark)
        }
        // 设置地图中心点 添加标注
        if (this.EditFormData.Longitude) {
          this.mapMark = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: [this.EditFormData.Longitude, this.EditFormData.Latitude]
          })
          this.mapObj.setZoomAndCenter(16, [this.EditFormData.Longitude, this.EditFormData.Latitude])
          this.mapObj.add(this.mapMark)
        }
      },
      dialogClose() {
        this.EditVisible = false
      },
      SubmitEditForm() {
        const obj = {
          KeyID: this.EditFormData.KeyID,
          CommunityName: this.EditFormData.CommunityName,
          CityName: (() => {
            return getCityNameByCode(this.EditFormData.CityCodeMark)
          })(),
          CityCode: this.EditFormData.CityCode,
          Location: this.EditFormData.Location,
          Longitude: this.EditFormData.Longitude,
          Latitude: this.EditFormData.Latitude
        }
        this.loading = true
        EditMCommunityInfo(obj).then(response => {
          if (response.Code === 0) {
            this.dialogClose()
            this.$emit('SubmitEditForm', obj)
          }
        }).finally(() => {
          this.loading = false
        })
      }
    }
  })
</script>

