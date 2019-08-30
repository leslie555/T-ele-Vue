<template>
  <div class="contract-template">
    <div class="contract-text">
      <p class="contract-statement">尊敬的客户: 凡本公司员工向您收取任何款项，均须出具盖有我公司专用章《收款凭证》方为有效。</p>
      <div class="contract-header">
        <p class="contract-header-title">物业委托代理租赁合同</p>
        <div class="contract-header-content">
          <p>委托方:四川满城房地产经纪有限责任公司</p>
          <p>出租方<span class="ml-5 mr-5">{{ContractContent.PrincipalUserName}}</span>(以下简称甲方)</p>
          <p>承租方<span class="ml-5 mr-5">{{ContractContent.TenantName}}</span>(以下简称乙方)</p>
          <p>
            依据国家有关法律，法规和政策的规定，以成都市房屋土地管理局统一制定的《成都市房屋租赁合同》为样本，双方在平等，自愿的协商一致的基础上，就房屋租赁事宜上，就房屋租赁事项达成一致意见，特订立本合同，供双方履行合同中共同遵守。</p>
        </div>
      </div>
      <div class="contract-list">
        <div class="contract-list-item">
          <p class="contract-list-title">
            第一条：甲方自愿将坐落在<span>{{ContractContent.Location}}</span>住房租予乙方作为<span>住房</span>使用，特立以下条款：</p>
          <div class="contract-list-content">
            <p>
              1、租赁期为<template v-if="ContractContent.Year"><span>{{ContractContent.Year}}</span>年</template><template v-if="ContractContent.Month"><span>{{ContractContent.Month}}</span>月</template><template v-if="ContractContent.Day"><span>{{ContractContent.Day}}</span>天</template>，<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>日起，至<span>{{ContractContent.EndYear}}</span>
              年<span>{{ContractContent.EndMonth}}</span>月<span>{{ContractContent.EndDay}}</span>日止。
            </p>
            <p>2、租赁期满，甲方有权收回全部房屋，乙方应如期交还，乙方如要求续租，需在本合同期满提前一个月向甲方提出书面申请。</p>
            <p>
              3、现在<span>{{ContractContent.LivepeopleNumber}}</span>人。
            </p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第二条：租金及付款方式</p>
          <div class="contract-list-content">
            <p>
              1、租金（不含税）为每月<span>{{ContractContent.HouseRent}}</span>元（人民币）<span>{{ContractContent.HouseRentChinese}}</span>(大写），合同期内租金共计<span>{{ContractContent.Sum}}</span>元(人民币）<span>{{ContractContent.SumChinese}}</span>（大写）。
            </p>
            <p>2、租金按<span>{{ContractContent.PayModel}}个月</span>交纳。</p>
            <p>3、乙方应交纳<span>{{ContractContent.DepositModel}}</span>个月房租作为押金，并
              <span v-if="ContractContent.PayTimeType===0">提前{{ContractContent.PayDays}}天</span>
              <span v-if="ContractContent.PayTimeType===1">固定{{ContractContent.PayDays}}号（每期第一个月）</span>
              <span v-if="ContractContent.PayTimeType===2">固定{{ContractContent.PayDays}}号（每期提前一个月）</span>
              支付下次房租（押金不充当房租，期满后30个工作日内，乙方结算全部费用后退还）。
            </p>
            <p>4、具体付款时间为</p>
            <div class="pay-info">
              <div class="left-pay">
                <p v-if="ContractContent.LeftTenantBill&&ContractContent.LeftTenantBill.length>0"
                   v-for="item in ContractContent.LeftTenantBill">
                  第{{item.NumChinese}}次<span>{{item.Year}}</span>年<span>{{item.Month}}</span>月<span>{{item.Day}}</span>日
                  （¥<span>{{item.PayMoney}}</span>） ；
                </p>
              </div>
              <div class="right-div">
                <p v-if="ContractContent.RightTenantBill&&ContractContent.RightTenantBill.length>0"
                   v-for="item in ContractContent.RightTenantBill">
                  第{{item.NumChinese}}次<span>{{item.Year}}</span>年<span>{{item.Month}}</span>月<span>{{item.Day}}</span>日
                  （¥<span>{{item.PayMoney}}</span>） ；
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第三条：分期注意事项（月付）</p>
          <div class="contract-list-content">
            <p>
              1、办理分期（客户月付房租服务）注意事项：乙方需在签订合同3日内，无条件配合甲方办理分期（月付），如不配合或因个人征信问题导致申请失败，不能办理业务，则按合同约定把房租补齐，或视为违约，甲方有权收回房屋。</p>
            <p>2、租客如果因自己个人征信问题审核拒绝的必须办理季度付。</p>
            <p>3、租客如果因为个人原因造成违约的，必须支付月租金18%的违约金。如果需要重新办理分期必须支付月租金20%的违约金。</p>
            <p>4、如果乙方没有按时还款，逾期天数超过第五天的下午三点，将视为违约处理；如果办理的分期逾期天数超过第七天，将视为违约处理。</p>
          </div>
        </div>
        <div class="contract-list-item contract-list-item-mark">
          <p class="contract-list-title">第四条：其他费用</p>
          <div class="contract-list-content">
            <p>在租赁期内所有的水、电、煤气、电话、有线电视费、卫生费、物管费、乙方按单付费。出租方配置正常的家电及设施维修费由承租人自行承担。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第五条：协议事项</p>
          <div class="contract-list-content">
            <p>
              1、签约之日起，甲乙双方不得解除合同，如甲方中途要求收回房屋，应提前30天通知乙方。甲方应退还剩余房租金，并赔偿两个月的房租金作为违约金。如乙方需要退房，必须提前30天通知甲方解除合同并支付两个月房租作为违约金，甲方退还未满租金。</p>
            <p>2、甲方需要对上述房产具备公平代理之全部法律文件，如房屋产权问题影响乙方在租赁期内的居住使用，所造成的损失由甲方承担。</p>
            <p>
              3、乙方应妥善管理并使用房屋，爱惜房屋内所留家具与电器设备，如有损坏应照价赔偿。房屋内未经甲方同意，乙方不得擅自改变或装修。如有擅改，乙方应还原并赔偿损失。乙方应当面验清房屋内部结构及一切家电是否完好，确认后予以签字认可。</p>
            <p>4、乙方不得在房间内进行违法行为或存放危险物品等，影响公共安全及扰民，否则所造成全部损失由乙方负责，甲方有权收回房屋，并按乙方违约处理，乙方需支付两个月房租作为违约金。</p>
            <p>5、租赁期满同日，乙方应无条件退租，并确保房屋及屋内物品完好无缺（可正常使用）经清点无误并将房屋清理干净后交还甲方。</p>
            <p>6、合同期满同日，如乙方不再续租此房，应提前一个月通知甲方，并配合甲方看房。</p>
            <p>7、乙方退租时应将自己所有家具物品搬迁清楚，不得故意留存占据；如逾期不搬视为乙方放弃其所有权，甲方自行处理。</p>
            <p>8、特别约定：客户交纳房租时，必须交到公司财务部，并索取公司盖章的财务收据，转到公司指定收款账户（并保留转款凭证）否则后果自负。</p>
            <p>
              9、乙方须按合同约定交纳房租，否则每拖欠一天需交纳月租金的4%作为滞纳金，如积累5天甲方有权收回房屋，乙方同意甲方对所租住房屋封门换锁，并按乙方违反本合同第五条第1款处理。乙方的房内物品乙方自愿放弃，不得再向甲方索要。</p>
            <p>10、乙方不得拖欠物管及水电气费，如拖欠此费用达500元，乙方必须在接到电话或短信通知后，三天内缴齐，否则视为违约，甲方可有权收回房屋。</p>
            <p v-if="ContractContent.RentIncludeCost.length>1">
              11、您是否同意甲方为您代缴{{ContractContent.RentIncludeCost}}<span>是</span>。</p>
            <p v-else>11、您是否同意甲方为您代缴水、电、气费<span>否</span>。</p>
            <p>12、乙方在未得到甲方同意前，不得擅自将房屋转借或转移他人使用，否则视为违约，甲方可即时收房屋。</p>
            <p>13、乙方在租用期间，甲方如对房屋进行查看，应向乙方提前通知，乙方应配合甲方。</p>
            <p>14、房屋如因不可抗拒的原因导致甲乙双方的损失，双方互承担责任。</p>
            <p>15、合同期满后，乙方未经甲方同意，乙方不能与甲方业主直接签约，以保障甲方利益，否则视为乙方违约，应赔偿甲方每年四个月租金的违约金。</p>
            <p>16、乙方在居住期间，应妥善注意自身安全，妥善使用屋内设备，甲方已尽到提醒责任。</p>
            <p>17、四川满城房地产经纪有限责任公司郑重提示任何业务员与客户的口头承诺无效。乙方需仔细阅读合租房公约并无条件遵守合租房公约。</p>
            <p>18、乙方在入住七日内，须到房屋所属地办理暂住证。</p>
            <p>19、乙方如要离开房屋，须关闭水、电、气总开关，否则因此而导致的损失由乙方承担。</p>
            <p>20、乙方如果需转租此房屋，必须通知公司同意后才能转租。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第六条：争议的解决</p>
          <div class="contract-list-content">
            <p>凡执行本合同或本合同有关争议，由双方友好协商解决，如协商不成的可向法院提起诉讼。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title"> 第七条：其它</p>
          <div class="contract-list-content">
            <p>1. 本合同各项事宜，共同遵守，本合同如有未尽事宜，本着诚信原则，由甲乙双方协商签订补充协议：本合同及一切补充协议均作本合同有效组成部分，具有同等法律效力。</p>
            <p>2.本合同全部条款乙方应认真阅读认可，并充分理解其含义。</p>
            <p>特别提示：</p>
            <p>
              （1）为了保障您的合法权益，租金务必到本公司营业部门交付，如果有特殊情况不在营业部门交付的，本公司收款人必须出示《房屋租赁合同》原件，盖有公司财务章的收据和个人有效证件，同时请您拨打电话到部门核实是否有该业务员。</p>
            <p>
              （2）当您的权益受到侵害时或对我们的服务有不满之处，请您在第一时间拨打监督投诉电话<span v-if="ContractContent.ComplaintCall">{{ContractContent.ComplaintCall}}</span>，我们将及时为您协调解决。
            </p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第八条：补充条款</p>
          <div class="contract-list-content">
            <p>声明：1、凡向我公司交纳任何款项，需向我公司员工索取盖有财务专用章的正式收据，其余形式我公司一律不予承认，并与我公司无关，特此声明！</p>
            <p>2、把房租打到公司指定账户</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="ContractContent.TenantBillPlan&&ContractContent.TenantBillPlan.length>1" class="table-title">账单计划</div>
      <div v-if="ContractContent.TenantBillPlan&&ContractContent.TenantBillPlan.length>1" class="table-content">
        <table border="0" cellspacing="1" class="table-bill-plan">
          <tr>
            <th class="head-title bill-title">账单期数</th>
            <th class="head-title bill-project">账单项目</th>
            <th class="head-title bill-amount">账单金额（元）</th>
            <th class="head-title bill-type">收支类型</th>
            <th class="head-title bill-date">应付款日</th>
          </tr>
          <template v-for="item in ContractContent.TenantBillPlan">
            <template v-for="(t, index2) in item.BillList">
              <tr class="item-content">
                <td :rowspan="item.BillList.length" v-if="index2 === 0">
                  {{item.Title}}
                  <br>
                  合计:{{item.Total}}
                </td>
                <td>{{t.BillProjectName}}</td>
                <td>{{t.Amount}}</td>
                <td>{{t.InOrOut}}</td>
                <td :rowspan="item.BillList.length" v-if="index2 === 0">
                  {{item.PayDate}}
                </td>
              </tr>
            </template>
          </template>
          <tr v-if="ContractContent.TenantBillPlan&&ContractContent.TenantBillPlan.length>1">
            <td colspan="5" class="total-amount">
              <p>账单总金额:{{ContractContent.TenantTotalAmount}}元</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <div v-if="ContractContent.BookKeep&&ContractContent.BookKeep.length>1" class="table-title">其他记账</div>
      <div v-if="ContractContent.BookKeep&&ContractContent.BookKeep.length>1" class="table-content">
        <table border="0" cellspacing="1" class="table-bill-plan table-other-bill-plan">
          <tr>
            <th class="head-title bill-other-project">项目</th>
            <th class="head-title bill-other-type">收支类型</th>
            <th class="head-title bill-other-amount">记账金额（元）</th>
            <th class="head-title bill-other-date">收支日期</th>
            <th class="head-title bill-other-remark">备注</th>
          </tr>
          <tr v-for="item in ContractContent.BookKeep">
            <td>{{item.BillProjectName}}</td>
            <td>{{item.InOrOut}}</td>
            <td>{{item.Amount}}</td>
            <td>{{item.ReceivablesDate}}</td>
            <td>{{item.Remark}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="sign-div-tenant">
      <div class="sign-content">
        <p class="first-party-sign">甲方（代表人）:{{ContractContent.PrincipalUserName}}</p>
        <!--<p v-else class="first-party">甲方（代表人）:{{ContractContent.PrincipalUserName}}</p>-->
        <div class="first-party-seal">公司盖章:
          <div class="first-party-seal-img">
            <img :src="$ImgUnit.getThumbImgUrl(ContractContent.SealPicURL)"
                 @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SealPicURL))">
          </div>
        </div>
        <p class="clearfix">经纪人:{{ContractContent.PersonInChargeName}}</p>
        <p>经办人电话:{{ContractContent.PersonInChargeTel}}</p>
        <p>店属:{{ContractContent.Store}}</p>
        <p v-if="ContractContent.TenantOutRoom!==''">出房人:{{ContractContent.TenantOutRoom}}</p>
      </div>
      <div class="sign-content">
        <p v-if="ContractContent.PaperType" class="second-party-text">乙方:{{ContractContent.TenantName}}</p>
        <div v-else class="second-party-sign">乙方:
          <div class="second-party-sign-img">
            <img v-if="ContractContent.SignInfo" :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                 @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
          </div>
        </div>
        <p class="clearfix second-party-cardnumber">证件号:{{ContractContent.TenantCard}}</p>
        <!--<p class="second-party-address">户口地/居住地:{{ContractContent.AddressSite}}</p>-->
        <p class="second-party-address">联系电话:{{ContractContent.TenantPhone}}</p>
        <div class="second-party-sign-time">
          签约时间:<p v-if="ContractContent.SignYear!==1&&ContractContent.SignYear!==0">
          <span>{{ContractContent.SignYear }}</span>年<span>{{ContractContent.SignMonth }}</span>月<span>{{ContractContent.SignDay }}</span>日
        </p>
        </div>
      </div>
    </div>
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
