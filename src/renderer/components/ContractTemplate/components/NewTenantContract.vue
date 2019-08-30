<template>
  <div class="contract-template">
    <div class="contract-text">
      <div class="contract-header">
        <p class="contract-header-title">房屋租赁合同</p>
        <div class="contract-header-content">
          <div class="header-content">
            <p>房屋所有权人：<span>{{ContractContent.HouseOwnershipName}}</span>(以下简称甲方)</p>
            <p>身份证号：<span>{{ContractContent.HouseOwnershipIDCard}}</span></p>
          </div>
          <p>房屋运营管理方：<span>{{ContractContent.CompanyName}}</span>（以下简称乙方）</p>
          <div class="header-content">
            <p>业务承办人：<span>{{ContractContent.UndertakerName}}</span></p>
            <p>联络电话：<span>{{ContractContent.UndertakerPhone}}</span></p>
          </div>
          <div class="header-content">
            <p>房屋承租人：<span>{{ContractContent.TenantName}}</span>(以下简称丙方)</p>
            <p>身份证号：<span>{{ContractContent.TenantCard}}</span></p>
          </div>
          <p>联络电话：<span>{{ContractContent.TenantPhone}}</span></p>
          <p>
            依据国家有关法律、法规和政策的规定，以成都市房屋土地管理局统一制定的《成都市房屋租赁合同》为样本，双方在平等、自愿、协商一致的基础上，甲乙丙三方就房屋租赁事项达成一致意见，特订立本合同，以资三方共同遵守。</p>
        </div>
      </div>
      <div class="contract-list">
        <div class="contract-list-item">
          <p class="contract-list-title">第一条：乙方基于与甲方签订的《房屋租赁运营管理委托协议》，代为行使甲方的房屋租赁管理权利，将坐落在<span>{{ContractContent.Location}}</span>租予丙方作为居住使用，并约定如下：</p>
          <div class="contract-list-content">
            <p>
              1.房屋租赁期限为
              <template v-if="ContractContent.Year"><span>{{ContractContent.Year}}</span>年</template>
              <template v-if="ContractContent.Month"><span>{{ContractContent.Month}}</span>月</template>
              <template v-if="ContractContent.Day"><span>{{ContractContent.Day}}</span>天</template>
              ，自<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>日起至<span>{{ContractContent.EndYear}}</span>
              年<span>{{ContractContent.EndMonth}}</span>月<span>{{ContractContent.EndDay}}</span>日止。
            </p>
            <p>2.房屋租赁期满，乙方有权收回房屋，丙方应如期交还，丙方如需要续租，应在本合同期满提前一个月向乙方提出书面申请。</p>
            <p>3．丙方承诺房屋居住人员为<span>{{ContractContent.LivepeopleNumber}}</span>人，最多居住<span>{{ContractContent.MaxLivepeopleNumber}}</span> 人。如乙方发现丙方登记人员数量与入住人员不符合的，乙方有权清退丙方并按照丙方违约处理。
            </p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第二条：租金及付款方式</p>
          <div class="contract-list-content">
            <p>1．每月房屋租金为<span>{{ContractContent.HouseRent}}</span>元，大写人民币<span>{{ContractContent.HouseRentChinese}}</span>（不含税），合同期内租金共计<span>{{ContractContent.Sum}}</span>元，大写人民币<span>{{ContractContent.SumChinese}}</span>。
            </p>
            <p>2.丙方同意房屋租金按<span>{{ContractContent.PayModel}}</span>个月缴纳，物业费、卫生费、有线电视费、宽带费等房屋使用费用，按租金缴纳时间一并缴纳。</p>
            <p>3.丙方应缴纳<span>{{ContractContent.Pledge}}</span>元大写人民币<span>{{ContractContent.PledgeStr}}</span>作为押金，并
              <span v-if="ContractContent.PayTimeType===0">提前{{ContractContent.PayDays}}天</span>
              <span v-if="ContractContent.PayTimeType===1">固定{{ContractContent.PayDays}}号（每期第一个月）</span>
              <span v-if="ContractContent.PayTimeType===2">固定{{ContractContent.PayDays}}号（每期提前一个月）</span>
              支付下次房租，丙方缴纳的押金不得冲抵应缴纳的租金，房屋租赁期满后30个工作日内，在丙方结清房屋使用产生的全部费用后，由乙方无息退还。
            </p>
            <p>4．后续租金具体付款时间及金额为</p>
            <div>
              <p v-if="ContractContent.TenantBill&&ContractContent.TenantBill.length>0"
                 v-for="(item,index) in ContractContent.TenantBill">
                第{{item.NumChinese}}次租金支付时间：<span>{{item.Year}}</span>年<span>{{item.Month}}</span>月<span>{{item.Day}}</span>日，金额
                ¥<span>{{item.PayMoney}}</span>
                <template v-if="index!==ContractContent.TenantBill.length-1 && ContractContent.BillRentIncludeCost.length>0">，每月
                  <template v-for="item in ContractContent.BillRentIncludeCost">
                    {{item.name}}¥<span>{{item.amount}}</span>
                  </template></template>。
              </p>
            </div>
          </div>
        </div>
        <div class="contract-list-item contract-list-item-mark">
          <p class="contract-list-title">第三条：其他费用</p>
          <div class="contract-list-content">
            <p>在租赁期内使用的水、电、煤气、宽带，由丙方按单据自行缴费。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第四条：协议事项</p>
          <div class="contract-list-content">
            <p>1．本合同签约后，各方均不得任意解除合同，如甲方中途要求收回房屋，应提前30天通知丙方，并应退还丙方剩余房租金，并赔偿丙方两个月的房租金作为违约金。如丙方要求解约退房，必须提前30天通知乙方，并支付两个月房租作为违约金，甲方退还丙方剩余未到期租金。</p>
            <p>2．甲方应当保证其拥有上述房屋的权属证明，如房屋产权问题影响丙方在租赁期内的居住使用，所造成的损失由甲方承担全部赔偿责任。</p>
            <p>3．丙方应妥善管理并合理使用房屋，爱惜房屋内所有家具与电器设备，如有损坏需照价赔偿。未经甲方同意，丙方不得擅自改变或装修，如经发现丙方有擅自改动装修的，丙方应还原并赔偿损失，丙方应当面验清房屋内部结构及一切家电是否完好，确认后予以签字认可。</p>
            <p>4．丙方不得在房间内进行违法行为或存放危险物品等，影响公共安全及扰民，否则所造成全部损失由丙方负责，乙方有权收回房屋，并按丙方违约处理，丙方需支付两个月房租作为违约金。</p>
            <p>5．租赁期满同日，丙方应无条件退房，并确保房屋及屋内设备物品完好无缺可正常使用，经乙方清点无误并将房屋清理干净后交还甲方，否则乙方有权从丙方缴纳的押金中扣除维修费及保洁费用。</p>
            <p>6．租赁合同期限届满前，如丙方不再续租，应提前一个月通知乙方，并配合乙方所带领的其他承租人看房。</p>
            <p>7．丙方退租时应将自己所有家具物品搬迁完毕，不得故意留存占据；如逾期不搬视为丙方放弃其所有权，由乙方自行处理。</p>
            <p>8．特别约定：丙方缴纳房租时，应根据乙方提供的缴纳方式进行缴纳（包含但不限于线上线下），且保留转款凭证或支付证明，并由乙方出具租金缴款证明，不得将租金直接支付给予业务人员，否则后果自负。</p>
            <p>9．丙方应按合同约定按时缴纳房屋租金，逾期支付房租的，每天按应支付租金的4%计算滞纳金，如逾期支付超过5天，乙方有权收回房屋，并对丙方所租住房屋封门换锁，并按丙方违反本合同第四条第1款处理，房内物品视同丙方自愿放弃，不得再向乙方索要，丙方不得提出异议。</p>
            <p>10．丙方不得拖欠物管及水电气费，如拖欠此费用达500元，丙方必须在接到电话或短信通知后，三天内缴齐，否则视为违约，乙方有权单方面解除收本合同，并收回房屋。</p>
            <p v-if="ContractContent.RentIncludeCost.length>1">
              11.丙方是否同意乙方为丙方代缴{{ContractContent.RentIncludeCost}}<span>是</span>。</p>
            <p v-else>11.丙方是否同意乙方为丙方代缴水、电、气费<span>否</span>。</p>
            <p>12．丙方在未得到乙方同意前，不得擅自将房屋转借或转移他人使用，否则视为丙方违约，乙方有权立即收回房屋，并按丙方违约处理。</p>
            <p>13．在房屋租赁期间，乙方如有需要对房屋进行检查查看时，应提前通知丙方，丙方有义务积极配合。</p>
            <p>14．房屋如因不可抗拒的原因导致各方权利损失的，各方互不承担责任。</p>
            <p>15．房屋租赁合同期满后，丙方未经乙方同意，不得与甲方直接签订房屋租赁合同，以保障乙方运营管理利益，否则视为丙方违约，乙方有权要求丙方按每年四个月的租金金额赔偿违约金。</p>
            <p>16．丙方在居住期间，应妥善注意自身安全，妥善使用屋内设备、设施，乙方已尽到提醒责任，如发生意外与乙方无关。</p>
            <p>17．丙方不得在房屋内饲养任何宠物，否则视为丙方违约，乙方有权收回房屋。</p>
            <p>18．丙方在入住七日内，须到房屋所在地派出所以及物管处进行流动人口暂住备案并登记个人信息。</p>
            <p>19．丙方如需长时间离开房屋，应检查并关闭水、电、气总开关，否则因此而导致的损失由丙方承担。</p>
            <p>20．丙方如果需转租此房屋，必须通知乙方，经乙方书面同意后才能转租，丙方寻找的承租人须与乙方重新签订房屋租赁合同。</p>
            <p>21．房屋如发生政府征收或者迁拆等不可抗力情况，乙方有权利单方面解除本租赁合同，退还丙方尚未到期的剩余租金，丙方不得要求其他赔偿。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第五条：争议的解决</p>
          <div class="contract-list-content">
            <p> 本合同执行过程或本合同内容有争议的，由双方友好协商解决，如协商不成的，可向房屋所在地的人民法院提起仲裁或诉讼。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title"> 第六条：其他</p>
          <div class="contract-list-content">
            <p>1．本合同内约定的各项事宜，三方应共同遵守，如有未尽事宜，本着诚信原则，由各方协商签订补充协议：本合同及一切补充协议均作本合同有效组成部分，具有同等法律效力。</p>
            <p>2．本合同全部条款丙方应认真阅读认可，并充分理解其含义，附件内容为本协议不可分割的部分，具有同等法律效用。</p>
            <p class="text-bold">特别提示：</p>
            <p>
              1.为了保障丙方的合法权益，租金务必通过乙方指定的方式进行缴纳，建议尽量采用线上支付方式缴纳租金，如有特殊情况，无法进行线上缴纳的，应要求乙方收款人员出具《房屋租赁合同》原件、盖有乙方财务章的专用收款收据和收款人个人有效证件，同时请丙方拨打服务电话核实乙方是否有该收款人员。</p>
            <p>
              2.当丙方的权益受到侵害时或对我们的服务有不满之处，请丙方在第一时间拨打租客服务电话<span v-if="ContractContent.ComplaintCall">{{ContractContent.ComplaintCall}}</span>，或通过租客服务公众号进行反应，我们将及时为丙方协调解决。
            </p>
            <p class="text-bold">业务经办人员的口头承诺均为无效承诺，请丙方认真阅读并遵守本租赁合同约定的条款，以免带来经济损失，造成不必要的纠纷。</p>
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
          <div v-if="ContractContent.PaperType" class="sign-text">甲方:{{ContractContent.HouseOwnershipName}}</div>
          <div v-else class="first-party-seal">甲方:
            <div class="first-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.HouseOwnershipUrl)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.HouseOwnershipUrl))">
            </div>
          </div>
          <div class="sign-text">代理人签字:{{ContractContent.ProxyName}}</div>
        </div>
        <div class="sign-content">
          <div v-if="ContractContent.PaperType" class="sign-text">乙方:{{ContractContent.CompanyName}}</div>
          <div v-else class="first-party-seal">乙方:
            <div class="first-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.CompanyNameUrl)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.CompanyNameUrl))">
            </div>
          </div>
          <div class="sign-text">承办人签字:{{ContractContent.UndertakerName}}</div>
        </div>
        <div class="sign-content">
          <div v-if="ContractContent.PaperType" class="sign-text">丙方:{{ContractContent.TenantName}}</div>
          <div v-else class="first-party-seal">丙方:
            <div class="first-party-seal-img">
              <img :src="$ImgUnit.getThumbImgUrl(ContractContent.TenantNameUrl)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.TenantNameUrl))">
            </div>
          </div>
          <div class="sign-text">签字:{{ContractContent.TenantName}}</div>
        </div>
      </div>
      <div class="sign-time">
        <div class="sign-time-container">
          签约时间:<p v-if="ContractContent.SignYear">
          <span>{{ContractContent.SignYear }}</span>年
          <span>{{ContractContent.SignMonth }}</span>月
          <span>{{ContractContent.SignDay }}</span>日</p>
        </div>
      </div>
    </div>
    <div class="equiment-list">
      <div class="equiment-title">合同附件: 房屋附属设施设备清单</div>
      <div class="appendix-info">
        <p class="info-title">装修情况</p>
        <p class="info-text">{{ContractContent.DecName.length>0?ContractContent.DecName:'无'}}</p>
      </div>
      <div class="appendix-info">
        <p class="info-title">家具清单</p>
        <p class="info-text">{{ContractContent.EquipmentList.length>0?ContractContent.EquipmentList:'无'}}</p>
      </div>
      <div class="confirm-info">
        <p class="info-text">丙方已确认本房屋内设施、设备完好使用，在租赁期内，因使用出现设施设备损坏问题，由丙方自行承担维修费用。</p>
        <div class="sign-info">
          <div class="sign-info-container">
            <div class="sign-text">
              <div v-if="ContractContent.PaperType" class="sign-text">
                <p class="sign-title">丙方签字:</p>
                {{ContractContent.TenantName}}</div>
              <div v-else class="first-party-seal">
                <p class="sign-title">丙方签字:</p>
                <div class="first-party-seal-img">
                  <img :src="$ImgUnit.getThumbImgUrl(ContractContent.TenantNameUrl)"
                       @click="$seeImage($ImgUnit.getImgUrl(ContractContent.TenantNameUrl))">
                </div>
              </div>
            </div>
            <div class="sign-time">
              <div class="sign-time-container">
                <p class="sign-title">签约时间:</p>
                <p v-if="ContractContent.SignYear">
                  <span>{{ContractContent.SignYear }}</span>年
                  <span>{{ContractContent.SignMonth }}</span>月
                  <span>{{ContractContent.SignDay }}</span>日</p>
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
