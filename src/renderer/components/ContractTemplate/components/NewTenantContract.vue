<template>
  <div class="contract-template">
    <div class="contract-text">
      <div class="contract-header">
        <p class="contract-header-title">物业委托代理租赁合同</p>
        <div class="contract-header-content">
          <div class="header-content">
            <p>出租方：<span>{{ ContractContent.CompanyName }}</span>(以下简称甲方)</p>
          </div>
          <p>委托方：<span>{{ ContractContent.OwnerName }}</span>（以下简称乙方）</p>
          <div class="header-content">
            <p>承租方：<span>{{ContractContent.TenantName}}</span>(以下简称丙方)</p>
            <p>身份证号：<span>{{ContractContent.TenantCard}}</span></p>
          </div>
          <p>依据国家有关法律、法规和政策的规定，以成都市房屋土地管理局统一制定的《成都市房屋租赁合同》为样本，双方在平等、自愿、协商一致的基础上，就房屋租赁事项达成一致意见，特订立本合同，以资双方共同遵守。</p>
        </div>
      </div>
      <div class="contract-list">
        <div class="contract-list-item contract-location">
          <p class="contract-list-title">第一条：甲方自愿将坐落在 &nbsp;<span>{{
            ContractContent.CityName +
            ContractContent.CommunityName +
            ContractContent.CommunityLocation +
            ContractContent.Property +
            ContractContent.Building +
            ContractContent.UnitNumber +
            ContractContent.RoomNumber +
            ContractContent.RoomName
            }}</span>&nbsp;住房租予丙方作为居住使用，特立以下条款：</p>
          <div class="contract-list-content">
            <p>
              1、租赁期为
              <template v-if="ContractContent.Year"><span>{{ContractContent.Year}}</span>年</template>
              <template v-if="ContractContent.Month"><span>{{ContractContent.Month}}</span>月</template>
              <template v-if="ContractContent.Day"><span>{{ContractContent.Day}}</span>天</template>
              ，自<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>日起至<span>{{ContractContent.EndYear}}</span>
              年<span>{{ContractContent.EndMonth}}</span>月<span>{{ContractContent.EndDay}}</span>日止。
            </p>
            <p>2、租赁期满，甲方有权收回全部房屋，丙方应如期交还，丙方如需要续租，需在本合同期满提前一个月向甲方提出书面申请。</p>
            <p>3、现住<span>{{ContractContent.LivepeopleNumber}}</span>人，最多居住<span>{{ContractContent.MaxLivepeopleNumber}}</span> 人。登记人员与入住人员不符合的，甲方有权清退丙方并按照丙方违约处理
            </p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第二条：租金及付款方式</p>
          <div class="contract-list-content">
            <p>1、租金（不含税）为每月<span>{{ContractContent.HouseRent}}</span>元，人民币<span>{{ContractContent.HouseRentChinese}}</span>（大写），合同期内租金共计<span>{{ContractContent.HouseRentTotal}}</span>元，人民币<span>{{ContractContent.HouseRentTotalChinese}}</span>（大写）。
            </p>
            <p>2、租金按<span>{{ContractContent.PayModel}}</span>个月缴纳，物业费、卫生费、有线电视费按照租金形式缴纳。</p>
            <p>3、丙方应缴纳<span>{{ContractContent.HouseDeposit}}</span>元人民币<span>{{ContractContent.HouseDepositChinese}}</span>（大写）作为押金，并
              <span v-if="ContractContent.PayTimeType===0">提前{{ContractContent.PayDays}}天</span>
              <span v-if="ContractContent.PayTimeType===1">固定{{ContractContent.PayDays}}号（每期第一个月）</span>
              <span v-if="ContractContent.PayTimeType===2">固定{{ContractContent.PayDays}}号（每期提前一个月）</span>
              支付下次房租（押金不充当房租，期满后30个工作日，丙方结算全部费用后退还。）
            </p>
            <p>4、具体付款时间及金额为</p>
            <div>
              <p v-if="ContractContent.TenantBill&&ContractContent.TenantBill.length>0"
                 v-for="(item,index) in ContractContent.TenantBill">
                第{{item.NumChinese}}次租金支付时间：<span>{{item.Year}}</span>年<span>{{item.Month}}</span>月<span>{{item.Day}}</span>日，金额
                ¥<span>{{item.PayMoney}}</span>
                <template v-if="index!==ContractContent.TenantBill.length-1 && ContractContent.RentIncludeCost.length>0">，每月
                  <template v-for="item in ContractContent.RentIncludeCost">
                    {{item.name}}¥<span>{{item.amount}}</span>
                  </template>
                </template>。
              </p>
            </div>
          </div>
        </div>
        <div class="contract-list-item contract-list-item-mark">
          <p class="contract-list-title">第三条：其他费用</p>
          <div class="contract-list-content">
            <p>在租赁期内所有的水、电、煤气、电话，丙方按单据自行缴费。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第四条：协议事项</p>
          <div class="contract-list-content">
            <p>1、签约之日起，甲丙双方不得解除合同，如甲方中途要求收回房屋，应提前30天通知丙方。甲方应退还剩余房租金，并赔偿两个月的房租金作为违约金。如丙方需要退房，必须提前30天通知甲方解除合同并支付两个月房租作为违约金，甲方退还未满租金。</p>
            <p>2、甲方应当保证其拥有上述房屋的权属证明，如房屋产权问题影响丙方在租赁期内的居住使用，所造成的损失由甲方承担。</p>
            <p>3、丙方应妥善管理并合理使用房屋，爱惜房屋内所留家具与电器设备，如有损坏需照价赔偿。未经甲方同意，丙方不得擅自改变或装修。如有擅改，丙方应还原并赔偿损失。丙方应当面验清房屋内部结构及一切家电是否完好，确认后予以签字认可。</p>
            <p>4、丙方不得在房间内进行违法行为或存放危险物品等，影响公共安全及扰民，否则所造成全部损失由丙方负责，甲方有权收回房屋，并按丙方违约处理，丙方需支付两个月房租作为违约金。</p>
            <p>5、租赁期满同日，丙方应无条件退房，并确保房屋及屋内物品完好无缺（可正常使用）经清点无误并将房屋清理干净后交还甲方，否则甲方有权从丙方中押金中扣除维修费及保洁费用。</p>
            <p>6、租赁合同期限即将届满，如丙方不再续租此屋，应提前一个月通知甲方，并配合甲方看房。</p>
            <p>7、丙方退租时应将自己所有家具物品搬迁完毕，不得故意留存占据；如逾期不搬视为丙方放弃其所有权，甲方自行处理。</p>
            <p>8、特别约定：丙方缴纳房租时，必须交到甲方财务部（或转到甲方指定账户）且保留转款凭证，并向甲方索取盖章的财务收据，否则后果自负。</p>
            <p>9、丙方须按合同约定缴纳房租，否则每拖欠一天需交纳月租金的4%作为违约金，如累计5天甲方有权收回房屋，丙方同意甲方对所租住房屋封门换锁，并按丙方违反本合同第四条第1款处理。丙方的房内物品丙方自愿放弃，不得再向甲方索要。</p>
            <p>10、丙方不得拖欠物管及水电气费，如拖欠此费用达500元，丙方必须在接到电话或短信通知后，三天内缴齐，否则视为违约，甲方可有权收回房屋。</p>
            <p v-if="ContractContent.RentIncludeCost.length>1">
              11、丙方是否同意乙方为丙方代缴{{ContractContent.RentIncludeCost}}<span>是</span>。</p>
            <p v-else>11.丙方是否同意乙方为丙方代缴水、电、气费<span>否</span>。</p>
            <p>12、丙方在未得到甲方同意前，不得擅自将房屋转借或转移他人使用，否则视为违约，甲方可即时收房屋。</p>
            <p>13、丙方在租用期间，甲方如对房屋进行查看，应向丙方提前通知，丙方应配合甲方。</p>
            <p>14、房屋如因不可抗拒的原因导致甲丙双方的损失，双方互不承担责任。</p>
            <p>15、合同期满后，丙方未经甲方同意，丙方不能与甲方业主直接签约，以保障甲方利益，否则视为丙方违约，应赔偿甲方每年四个月租金的违约金。</p>
            <p>16、丙方在居住期间，应妥善注意自身安全，妥善使用屋内设备、设施，甲方已尽到提醒责任。</p>
            <p>17、丙方不得在此房养宠物，否则视为丙方违约，甲方有权收回房屋。</p>
            <p>18、丙方在入住七日内，须到房屋所属地派出所备案并登记个人信息。</p>
            <p>19、丙方如要离开房屋，须关闭水、电、气总开关，否则因此而导致的损失由丙方承担。</p>
            <p>20、丙方如果需转租此房屋，必须通知甲方书面同意后才能转租。新租客必须与甲方重新签订租赁合同。</p>
            <p>21、房屋出现被征收或者迁拆的情况下，甲方有权利无条件解除租赁合同。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第五条：争议的解决</p>
          <div class="contract-list-content">
            <p> 凡执行本合同或本合同有关争议，由双方友好协商解决，如协商不成的可向法院提起诉讼。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title"> 第六条：其他</p>
          <div class="contract-list-content">
            <p>1、本合同各项事宜，共同遵守，本合同如有未尽事宜，本着诚信原则，由甲丙双方协商签订补充协议：本合同及一切补充协议均作本合同有效组成部分，具有同等法律效力。</p>
            <p>2、本合同全部条款丙方应认真阅读认可，并充分理解其含义。</p>
            <p class="text-bold">特别提示：</p>
            <p>
              （1）为了保障丙方的合法权益，租金务必到甲方营业部门交付，如果有特殊情况不在营业部门交付的，甲方收款人必须出示«房屋租赁合同»原件、盖有甲方财务章的收据和个人有效证件，同时请丙方拨打电话到部门核实是否有该业务员。</p>
            <p>
              （2）当丙方的权益受到侵害时或对我们的服务有不满之处，请丙方在第一时间拨打监督投诉电话（店经理）<span v-if="ContractContent.ComplaintCall">{{ContractContent.ComplaintCall}}</span>，我们将及时为丙方协调解决。
            </p>
            <!-- <p class="text-bold">业务经办人员的口头承诺均为无效承诺，请丙方认真阅读并遵守本租赁合同约定的条款，以免带来经济损失，造成不必要的纠纷。</p> -->
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title"> 第七条：补充条款</p>
          <div class="contract-list-content">
            <p class="text-bold">1、凡向甲方缴纳任何款项，均需向甲方公司员工索取盖有财务专用章的正式收据，其余形式甲方公司一律不予承认，并与甲方公司无关，特此声明！
             </p>
             <div class="content-p" v-if="ContractContent.PaperType">丙方签名：{{ContractContent.TenantName}}</div>
              <div v-else class="first-party-seal content-p content-weight">丙方签名：
                <div class="second-party-seal-img">
                  <img :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                      @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
                </div>
              </div>
             <p class="text-bold">2、把房租打到甲方指定账户：</p>
             <div v-if="ContractContent.WaterandelectricityPreview && ContractContent.WaterandelectricityPreview.length>1" class="contract-list-table">
               <table border="1" border-collapse="collapse" style="width: 100%">
                 <tr>
                   <th>名称</th>
                   <th>卡号</th>
                   <th class="head-title init-data">初始数据</th>
                   <th class="head-title end-data">终止数据</th>
                   <th class="head-title is-settle">是否结算</th>
                 </tr>
                 <tr v-for="(item, index) in ContractContent.WaterandelectricityPreview" :key="index">
                  <td>{{item.ExpenseName}}</td>
                  <td>{{item.CardNumber}}</td>
                  <td>{{item.InitialData}}</td>
                  <td>{{item.TerminateData}}</td>
                  <td>{{item.IsSettle===0?'否':'是'}}</td>
                 
                </tr>
               </table>
             </div>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title"> 附加条款</p>
          <div class="contract-list-content">
            <p style="text-indent: 30px">{{ContractContent.ContractRemark.length>0?ContractContent.ContractRemark:'无'}} </p>
          </div>
        </div>
      </div>
    </div>
    <div class="sign-div-tenant">
      <div class="sign-container">
        <div class="sign-content">
          <div v-if="ContractContent.PaperType" class="sign-text">甲方盖章: {{ContractContent.OwnerName}}</div>
          <div v-else class="first-party-seal">甲方盖章: 
            <div class="first-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.OwnerSignInfo)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.OwnerSignInfo))">
            </div>
          </div>
          <div class="sign-text">经纪人（签名）:{{ContractContent.BrokerSignInfo}}</div>
          <div class="sign-text">店属负责人电话：{{ContractContent.StoreCompanyName + ContractContent.PrincipalUserPhone}}</div>
        </div>
        <!-- <div class="sign-content">
          <div v-if="ContractContent.PaperType" class="sign-text">乙方:{{ContractContent.CompanyName}}</div>
          <div v-else class="first-party-seal">乙方:
            <div class="first-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.CompanyNameUrl)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.CompanyNameUrl))">
            </div>
          </div>
          <div class="sign-text">承办人签字:{{ContractContent.UndertakerName}}</div>
        </div> -->
        <div class="sign-content">
          <div v-if="ContractContent.PaperType" class="sign-text">丙方（签名）:{{ContractContent.TenantName}}</div>
          <div v-else class="first-party-seal">丙方（盖章）:
            <div class="first-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
            </div>
          </div>
          <div class="sign-text">户口地/居住地: {{ContractContent.TenantName}}</div>
          <div class="sign-text">联系电话: {{ContractContent.TenantName}}</div>
          <div class="sign-text">签约时间:
            <span v-if="ContractContent.ContractYear">
              <span>{{ContractContent.ContractYear }}</span>年
              <span>{{ContractContent.ContractMonth }}</span>月
              <span>{{ContractContent.ContractDay }}</span>日
            </span>
          </div>
        </div>
      </div>
      <!-- <div class="sign-time">
        <div class="sign-time-container">
          签约时间:<p v-if="ContractContent.ContractYear">
          <span>{{ContractContent.ContractYear }}</span>年
          <span>{{ContractContent.ContractMonth }}</span>月
          <span>{{ContractContent.ContractDay }}</span>日</p>
        </div>
      </div> -->
      <div class="contract-list-content">
        <p class="content-p">郑重提示：任何经纪人员与客户口头承诺无效!（例：合同期问题）</p>
        <div class="content-weight">客户签字：
          <span v-if="ContractContent.PaperType">{{ContractContent.TenantName}}</span>
          <div v-else>
            <div class="second-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                    @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
            </div>
          </div>
          </div>
          
      </div>
      
    </div>
    <div class="equiment-list">
      <div class="equiment-title">合同附件: 房屋附属设施设备清单</div>
      <div class="appendix-info">
        <p class="info-title">1、装修情况</p>
        <p class="info-text">{{ContractContent.DecorationList.length>0?ContractContent.DecorationList:'无'}}</p>
      </div>
      <div class="appendix-info">
        <p class="info-title">2、固定设施</p>
        <p class="info-text">{{ '无' }}</p>
      </div>
      <div class="appendix-info">
        <p class="info-title">3、电器家具</p>
        <p class="info-text">{{ContractContent.EquipmentList.length>0?ContractContent.EquipmentList:'无'}}</p>
      </div>
      <div class="appendix-info">
        <p class="info-title">4、郑重承诺</p>
      </div>
      <div class="confirm-info">
        <p class="info-text">丙方已确认本房屋内设施、设备完好使用，在租赁期内，因使用出现设施设备损坏问题，由丙方自行承担维修费用。</p>
        <div class="sign-info">
          <div class="sign-info-container">
            <div class="sign-text">
              <div v-if="ContractContent.PaperType" class="sign-text">
                <p class="sign-title">丙方签字: </p>
                {{ContractContent.TenantName}}</div>
              <div v-else class="first-party-seal">
                <p class="sign-title">丙方签字: </p>
                <div class="first-party-seal-img">
                  <img :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                       @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
                </div>
              </div>
            </div>
            <div class="sign-time">
              <div class="sign-time-container">
                <p class="sign-title">签约时间: </p>
                <p v-if="ContractContent.ContractYear">
                  <span>{{ContractContent.ContractYear }}</span>年
                  <span>{{ContractContent.ContractMonth }}</span>月
                  <span>{{ContractContent.ContractDay }}</span>日</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="house-equipment">-->
      <!--<div class="equipment-title">合同附件：房屋附属设施清单</div>-->
      <!--<div class="house-equipment-container">-->
        <!--<p v-for="(item,index) in ContractContent.HouseEquipment">-->
          <!--{{index+1}}、{{item.regionName}}：{{item.equipmentInfo}}-->
        <!--</p>-->
        <!--<div class="sign-container">-->
          <!--<div v-if="ContractContent.PaperType" class="second-party-text">乙方:{{ContractContent.TenantName}}</div>-->
          <!--<div v-else class="second-party-sign">乙方:-->
            <!--<div class="second-party-sign-img">-->
              <!--<img v-if="ContractContent.SignInfo" :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"-->
                   <!--@click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'TenantContract',
    props: {
      ContractContent: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style.scss";
</style>
