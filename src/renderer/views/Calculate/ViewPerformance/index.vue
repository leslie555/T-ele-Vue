 <template>
  <div class="app-container">
    <!-- 房源信息 -->
    <el-row class="PerFormList panel">
      <p class="PerFormItemTitle">房源信息</p>
      <div class="PerFormItemContentBox">
        <p class="ContentItem">
          <span class="ContentTitle">房源地址:</span>
          <span class="ContentMsg">{{ HouseInfoForm.HouseName }}</span>
        </p>
      </div>
    </el-row>
    <!-- 业主信息 -->
    <el-row class="PerFormList panel">
      <p class="PerFormItemTitle">业主信息</p>
      <div class="PerFormItemContentBox">
        <p class="ContentItem">
          <span class="ContentTitle">业主:</span>
          <span class="ContentMsg">{{ HouseInfoForm.OwnerName }}</span>
          <span class="ContentTitle">业主电话:</span>
          <span class="ContentMsg">{{ HouseInfoForm.OwnerPhone }}</span>
        </p>
        <p class="ContentItem">
          <span class="ContentTitle">第一次签约:</span>
          <span class="ContentMsg">{{ $dateFormat(HouseInfoForm.OwnerContractStartDate) }}&emsp;至&emsp;{{ $dateFormat(HouseInfoForm.OwnerContractEndDate) }}</span>
          <span class="ContentTitle">租金:</span>
          <span class="ContentMsg">{{ HouseInfoForm.TakeHousePrices }}元/月</span>
        </p>
      </div>
    </el-row>
    <!-- 当前租客 -->
    <el-row class="PerFormList panel" v-if="CurInfoForm !== null">
      <p class="PerFormItemTitle">当前租客</p>
      <div class="PerFormItemContentBox">
        <p class="ContentItem">
          <span class="ContentTitle" style="color: #FF4040;">租客:</span>
          <span class="ContentMsg">{{ CurInfoForm.TenantName }}</span>
          <span class="ContentTitle">租客电话:</span>
          <span class="ContentMsg">{{ CurInfoForm.TenantPhone }}</span>
        </p>
        <p class="ContentItem">
          <span class="ContentTitle">合同时间:</span>
          <span class="ContentMsg">{{ $dateFormat(CurInfoForm.TenantContractStartDate) }}&emsp;至&emsp;{{ $dateFormat(CurInfoForm.TenantContractEndDate) }}</span>
          <span class="ContentTitle">租金:</span>
          <span class="ContentMsg">{{ CurInfoForm.TenantRent }}元/月</span>
        </p>
        <p class="ContentItem" style="margin-bottom: 0;">
          <span class="CalcResult ContentTitle">测算结果:</span>
        </p>
        <!-- 预算列表 -->
        <el-row>
          <p class="ContentItem">
            <span class="ContentTitle">测算时间:</span>
            <span class="ContentMsg">{{ !CurInfoForm.HouseAchievement ? '' : $dateFormat(CurInfoForm.HouseAchievement.BudgetTime) }}</span>
          </p>
          <p class="ContentItem">
            <span class="ContentTitle">总业绩:</span>
            <span class="ContentMsg">{{ !CurInfoForm.HouseAchievement ? '' : CurInfoForm.HouseAchievement.BudgetAllAchievement }}元（{{ !CurInfoForm.HouseAchievement ? '' : CurInfoForm.HouseAchievement.BudgetOutAchievement }}元预留，{{ !CurInfoForm.HouseAchievement ? '' : CurInfoForm.HouseAchievement.BudgetInAchievement }}元业务员业绩)</span>
          </p>
          <el-table :data="CurInfoForm.AchievementList" :header-cell-style="{background: '#ECF5FF'}" border>
            <el-table-column label="可入次数" align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}次可入
              </template>
            </el-table-column>
            <el-table-column label="预算金额(元)" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.BudgetInAchievement.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="可入时间" align="center">
              <template slot-scope="scope">
                <span>{{ $dateFormat(scope.row.Time) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="核算金额(元)" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.CheckInAchievement.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="核算时间" align="center">
               <template slot-scope="scope">
                <span>{{ $dateFormat(scope.row.ChecktTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-row>
    <!-- 所有租客 -->
    <el-row class="PerFormList panel">
      <p class="PerFormItemTitle">历史租客</p>
      <div class="PerFormItemContentBox PerFormBorderBox" v-for="perTent in OldInfoFormList" :key="perTent.id">
        <p class="ContentItem">
          <span class="ContentTitle"  style="color: #FF4040;" >租客:</span>
          <span class="ContentMsg">{{ perTent.TenantName }}</span>
          <span class="ContentTitle">租客电话:</span>
          <span class="ContentMsg">{{ perTent.TenantPhone }}</span>
        </p>
        <p class="ContentItem">
          <span class="ContentTitle">合同时间:</span>
          <span class="ContentMsg">{{ $dateFormat(perTent.TenantContractStartDate) }}&emsp;至&emsp;{{ $dateFormat(perTent.TenantContractEndDate) }}</span>
          <span class="ContentTitle">租金:</span>
          <span class="ContentMsg">{{ perTent.TenantRent }}元/月</span>
        </p>
        <p class="ContentItem" style="margin-bottom: 0;">
          <span class="CalcResult ContentTitle">测算结果:</span>
        </p>
        <!-- 预算列表 -->
        <el-row>
          <p class="ContentItem">
            <span class="ContentTitle">测算时间:</span>
            <span class="ContentMsg">{{ !perTent.HouseAchievement ? '' : $dateFormat(perTent.HouseAchievement.BudgetTime) }}</span>
          </p>
          <p class="ContentItem">
            <span class="ContentTitle">总业绩:</span>
            <span class="ContentMsg">{{ !perTent.HouseAchievement ? '' : perTent.HouseAchievement.BudgetAllAchievement }}元（{{ !perTent.HouseAchievement ? '' : perTent.HouseAchievement.BudgetOutAchievement }}元预留，{{ !perTent.HouseAchievement ? '' : perTent.HouseAchievement.BudgetInAchievement }}元业务员业绩)</span>
          </p>
          <el-table :data="perTent.AchievementList" :header-cell-style="{background: '#ECF5FF'}" border>
            <el-table-column label="可入次数" align="center">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}次可入
              </template>
            </el-table-column>
            <el-table-column label="预算金额(元)" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.BudgetInAchievement.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="可入时间" align="center">
              <template slot-scope="scope">
                <span>{{ $dateFormat(scope.row.Time) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="核算金额(元)" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.CheckInAchievement.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="核算时间" align="center">
              <template slot-scope="scope">
                <span>{{ $dateFormat(scope.row.ChecktTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
    </el-row>
  </div>
</template>
<script>
import { FindPerformanceDetail } from '@/api/calculate'

export default {
  name: 'ViewPerformance',
  data() {
    return {
      listData: {
        Address: '龙腾苑-1--54',
        OwnerName: '刘德华',
        OwnerPhone: '13696985874',
          // 业主信息
        OwnerList: [
          {
            id: 1,
            StartDate: new Date(),
            EndDate: new Date(),
            TakeHousePrices: 1234
          },
          {
            id: 2,
            StartDate: new Date(),
            EndDate: new Date(),
            TakeHousePrices: 2500
          }
        ],
        // 租客信息
        TenantList: [
          {
            id: 12,
            StartDate: new Date(),
            EndDate: new Date(),
            TenantRent: 1299,
            TenantName: '成龙',
            TenantPhone: '13880583273',
            Budget: [
              {
                id: 13,
                EndDate: new Date(),
                TotalPerformance: 2200,
                ReservePerformance: 1200,
                TotalTheoreticalPerformance: 1000,
                Accessibles: [
                  {
                    id: 14,
                    AccessiblePerformance: 1500,
                    Time: new Date()
                  }
                ]
              }
            ],
            Calculaty: [
               {
                id: 15,
                EndDate: new Date(),
                TotalPerformance: 2200,
                ReservePerformance: 1200,
                TotalTheoreticalPerformance: 1000,
                Accessibles: [
                  {
                    id: 16,
                    AccessiblePerformance: 1500,
                    Time: new Date()
                  }
                ]
              }
            ]
          },
          {
            id: 12,
            StartDate: new Date(),
            EndDate: new Date(),
            TenantRent: 1299,
            TenantName: '成龙',
            TenantPhone: '13880583273',
            Budget: [
              {
                id: 13,
                EndDate: new Date(),
                TotalPerformance: 2200,
                ReservePerformance: 1200,
                TotalTheoreticalPerformance: 1000,
                Accessibles: [
                  {
                    id: 14,
                    AccessiblePerformance: 1500,
                    Time: new Date()
                  }
                ]
              }
            ],
            Calculaty: [
               {
                id: 15,
                EndDate: new Date(),
                TotalPerformance: 2200,
                ReservePerformance: 1200,
                TotalTheoreticalPerformance: 1000,
                Accessibles: [
                  {
                    id: 16,
                    AccessiblePerformance: 1500,
                    Time: new Date()
                  }
                ]
              }
            ]
          },
          {
            StartDate: new Date(),
            EndDate: new Date(),
            TenantRent: 1299,
            TenantName: '张学友',
            TenantPhone: '13880583273',
            Budget: [
              {
                EndDate: new Date(),
                TotalPerformance: 2200,
                ReservePerformance: 1200,
                TotalTheoreticalPerformance: 1000,
                Accessibles: [
                  {
                    AccessiblePerformance: 1500,
                    Time: new Date()
                  }
                ]
              }
            ],
            Calculaty: [
               {
                EndDate: new Date(),
                TotalPerformance: 2200,
                ReservePerformance: 1200,
                TotalTheoreticalPerformance: 1000,
                Accessibles: [
                  {
                    AccessiblePerformance: 1500,
                    Time: new Date()
                  }
                ]
              }
            ]
          }
        ]
      },
      // 房间信息
      HouseInfoForm: {
        HouseName: '',
        OwnerName: '',
        OwnerPhone: '',
        OwnerContractStartDate: '',
        OwnerContractEndDate: '',
        TakeHousePrices: ''
      },
      // CurInfoForm
      CurInfoForm: {},
      // 历史租客
      OldInfoFormList: []
    }
  },
  created() {
    FindPerformanceDetail({
      HouseID: this.$route.query.HouseID,
      HouseKey: this.$route.query.HouseKey
    }).then(response => {
      console.log(response.Data)
      this.CurInfoForm = response.Data.PerformanceSeeData
      this.HouseInfoForm = response.Data.CalcRequest
      this.OldInfoFormList = response.Data.PerformanceSeeDataList
    })
  }
}
</script>
<style lang='scss' scoped>
  @import 'style'
</style>
