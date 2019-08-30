<template>
  <div class="app-container data-list">
    <el-row type="flex" class="row-bg panel">
      <el-col :span="7">
        <div class="search-panel">
          <input type="text" v-model="SearchName" placeholder="输入小区名搜索"/>
          <el-button type="primary" @click="CommunityList">查询</el-button>
        </div>
        <div class="choice-list">
          <ul>
            <li v-for="city in cities" :key="city.KeyID"><input type="checkbox" :value="city.KeyID" :id="city.KeyID"
                                                                v-model="checkedCities"
                                                                @click="AddCommunityList($event,city.KeyID, city.CommunityName)"/><label
              :for="city.KeyID"></label><a @click="lookInfo(city.KeyID)">{{city.CommunityName }}</a></li>
          </ul>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="choice" v-if="count!==0">
          <h5>已选择 {{count}} 个小区</h5>
          <ul>
            <li v-for="cityMame in checkedCitiesName" :key="cityMame.$index">{{cityMame.Name}}</li>
          </ul>
        </div>
        <div class="reset">
          <el-row>
            <el-col :span="6" class="reset-title" align="right">
              <div class="grid-content bg-purple">表类型</div>
            </el-col>
            <el-col :span="18" class="reset-title" align="center">
              <div class="grid-content bg-purple-light">单价</div>
            </el-col>
          </el-row>
          <el-form label-width="25%" align="center" v-model="PriceTagList" class="demo-ruleForm">
            <el-form-item label="燃气" align="center">
              <div class="price-tag">
                <span>￥</span>
                <input type="number" min="1" max="20" oninput="if(value.length>4)value=value.slice(0,4)"
                       v-model="PriceTagList.GasMeter"/>
                <span>立方米</span>
              </div>
            </el-form-item>
            <el-form-item label="水" align="center">
              <div class="price-tag">
                <span>￥</span>
                <input type="number" min="1" max="20" oninput="if(value.length>4)value=value.slice(0,4)"
                       v-model="PriceTagList.WaterMeter"/>
                <span>吨</span>
              </div>
            </el-form-item>
            <el-form-item label="冷水" align="center">
              <div class="price-tag">
                <span>￥</span>
                <input type="number" min="1" max="20" v-model="PriceTagList.ColdWaterMeter"/>
                <span>吨</span>
              </div>
            </el-form-item>
            <el-form-item label="热水" align="center">
              <div class="price-tag">
                <span>￥</span>
                <input type="number" min="1" max="20" v-model="PriceTagList.HotWaterMeter"/>
                <span>吨</span>
              </div>
            </el-form-item>
            <el-form-item label="电" align="center">
              <div class="price-tag">
                <span>￥</span>
                <input type="number" min="1" max="99" v-model="PriceTagList.ElectricMeter"/>
                <span>度</span>
              </div>
            </el-form-item>
          </el-form>
          <p>特此声明：您承诺将依法定制合理水、电、气、网络等相关费用（费用标准可向国家电网、当地燃气集团、自来水公司、网络服务商等服务提供方咨询）。您知悉，因您违规定制虚高价格导致的一切后果需由您本人承担！</p>
          <el-button type="primary" @click="ResetPrice">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { InsertMeterPriceInfo, SearchPriceByComuID, SelectCommunityList } from '@/api/service'

  export default {
    name: 'MeterReadingConfiguration',
    data() {
      return {
        SearchName: '',
        count: 0,
        checkedCities: [],
        cities: [],
        // 选中的小区
        checkedCitiesName: [],
        // 小区水电
        CommunityPrice: null,
        // 最后选择的小区ID
        PriceTagList: {
          GasMeter: null,
          WaterMeter: null,
          ColdWaterMeter: null,
          HotWaterMeter: null,
          ElectricMeter: null
        }
      }
    },
    created() {
      this.CommunityList()
    },
    methods: {
      // 初始化小区列表
      CommunityList() {
        this.cities = null
        this.checkedCities = []
        this.checkedCitiesName = []
        this.count = 0
        return SelectCommunityList({
          keyword: this.SearchName,
          parm: {
            size: 15,
            Page: 1
          }
        }).then(response => {
          this.cities = response.Data.rows
          if (this.cities.length > 0) {
            this.lookInfo(this.cities[0].KeyID)
          } else {
            this.lookInfo(0)
          }
          console.log(this.cities)
          return response.Data
        })
      },
      // 搜索小区
      SearchPrice() {
        return SearchPriceByComuID({
          communityID: parseInt(this.checkedCommunity)
        }).then(response => {
          console.log(this.PriceTagList)
          this.PriceTagList = response.Data
          console.log(this.PriceTagList)
          return response.Data
        })
      },
      // 设置电价
      ResetPrice() {
        if (this.PriceTagList.GasMeter === '' || this.PriceTagList.WaterMeter === '' ||
          this.PriceTagList.ColdWaterMeter === '' || this.PriceTagList.HotWaterMeter === '' || this.PriceTagList.ElectricMeter === '') {
          this.$message.error('请设置水电气单价')
        } else if (this.PriceTagList.GasMeter > 20 || this.PriceTagList.WaterMeter > 20 ||
          this.PriceTagList.ColdWaterMeter > 20 || this.PriceTagList.HotWaterMeter > 20 || this.PriceTagList.ElectricMeter > 20) {
          this.$message.error('水电气单价不能超过20')
        } else if (this.checkedCities.length <= 0) {
          this.$message.error('请选择要设置水电气单价的小区')
        } else {
          return InsertMeterPriceInfo({
            communityIDs: this.checkedCities,
            priceInfoType: this.PriceTagList
          }).then(response => {
            if (response.Code === 0) {
              this.$message({
                message: '小区水电气价格设置成功',
                type: 'success'
              })
            } else {
              this.$message.error(response.Msg)
            }
            return response.Data
          })
        }
      },
      // 点击查看详水电细配置
      lookInfo(val) {
        this.checkedCommunity = val
        this.SearchPrice()
      },
      // 添加选中的小区
      AddCommunityList(e, val, name) {
        if (e.target.checked) {
          this.checkedCitiesName.push({ 'ID': val, 'Name': name })
          this.checkedCommunity = val
        } else {
          this.checkedCitiesName.forEach((item, index) => {
            if (item.ID === val) {
              this.checkedCitiesName.splice(index, 1)
              return
            }
          })
          this.checkedCommunity = val
        }
        this.count = this.checkedCitiesName.length
      }
    }
  }
</script>

<style scoped>
  .data-list > div {
    height: 100%;
  }

  .el-col-7 {
    margin-right: 10px;
    border: 1px solid #dddddd;
    border-radius: 3px;
    padding: 20px;
    width: 360px;
    font-size: 14px;
    overflow: auto;
  }

  .el-col-17 {
    font-size: 14px;
    overflow: auto;
  }

  /* 左边小区选择项*/

  .search-panel {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }

  .search-panel input[type=text] {
    width: 240px;
    height: 36px;
    border: 1px solid #dddddd;
    border-radius: 3px;
    margin-right: 20px;
    padding: 0 10px;
  }

  .search-panel input[type=text]:focus {
    box-shadow: 0 0 6px #98cdf8;
    outline: none;
    border-color: #389ef2;

  }

  .search-panel .el-button {
    width: 80px;
    height: 36px;
    line-height: 10px;
  }

  .choice-list {
    margin-top: 20px;
  }

  /* 小区列表*/
  .choice-list ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .choice-list ul li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .choice-list ul li a:hover {
    color: #4a87f0;
    transition: all .35s ease-in-out;
  }

  .choice-list label {
    width: 15px;
    margin-right: 10px;
    height: 40px;
    line-height: 40px;
    position: relative;
    cursor: pointer;
  }

  .choice-list input[type=checkbox] {
    position: relative;
    visibility: hidden;
    padding-left: 35px;
    cursor: pointer;
    display: inline-block;
    height: 14px;
    line-height: 14px;
    font-size: 1rem;
  }

  .choice-list label::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 1px solid transparent;
    left: 0px;
    top: 50%;

  }

  .choice-list input[type=checkbox]:not(:checked) + label::after {
    content: '';
    position: absolute;
    height: 14px;
    width: 14px;
    background-color: transparent;
    border: 1px solid #dddddd;
    border-radius: 2px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
  }

  .choice-list input[type="checkbox"]:checked + label::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border: 1px solid #389ef2;
    background-color: #389ef2;
    border-radius: 2px;
    z-index: 0;
  }

  .choice-list input[type="checkbox"]:checked + label::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 1px;
    width: 5px;
    height: 9px;
    border-top: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
    -webkit-transform: rotateZ(38deg);
    transform: rotateZ(38deg);
    -webkit-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
    transition: all .35s ease-in-out;
  }

  /* 右边价格设置*/
  .choice {
    width: 100%;
    border: 1px solid #dddddd;
    border-radius: 3px;
    padding: 20px 20px 0;
    margin-bottom: 10px;
    height: 100px;
    overflow: auto;
  }

  .choice h5 {
    font-size: 14px;
    color: #389ef2;
    font-weight: 400;
  }

  .choice ul {
    list-style: none;
    display: flex;
    justify-items: flex-start;
    padding: 0;
    color: #606266;
    flex-wrap: wrap;
  }

  .choice ul li {
    margin-right: 20px;
    line-height: 20px;
  }

  .reset {
    border: 1px solid #dddddd;
    border-radius: 3px;
    height: 615px;
    overflow: auto;

  }

  .reset-title {
    height: 50px;
    line-height: 50px;
    background-color: #f3f9fe;
    border-bottom: 1px solid #dddddd;
  }

  .demo-ruleForm {
    padding-top: 20px;
  }

  .price-tag {
    border: 1px solid #dddddd;
    display: flex;
    width: 200px;
    justify-content: flex-start;
    line-height: 25px;
    height: 25px;
    margin-top: 7px;
    text-align: center;
  }

  .price-tag span {
    width: 33%;
    text-align: center;
  }

  .price-tag span:first-child {
    border-right: 1px solid #dddddd;
  }

  .price-tag span:last-child {
    border-left: 1px solid #dddddd;
  }

  .price-tag input[type=number] {
    width: 40%;
    border: none;
    outline: none;
    text-align: center;
  }

  .reset > p {
    padding: 20px;
    color: #389ef2;
    letter-spacing: 2px;
    font-size: 12px;
    line-height: 25px;
  }

  .reset > .el-button {
    width: 80px;
    display: block;
    margin: 20px auto;
  }
</style>
