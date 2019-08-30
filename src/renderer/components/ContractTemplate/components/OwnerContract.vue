<template>
  <div class="contract-template">
    <div class="contract-text">
      <p class="contract-statement">尊敬的客户: 凡本公司员工向您收取任何款项，均须出具盖有我公司专用章《收款凭证》方为有效。</p>
      <div class="contract-header">
        <p class="contract-header-title">物业管理委托书</p>
        <div class="contract-header-content">
          <p>甲方（委托方）：<span>{{ContractContent.OwnerName}}</span></p>
          <p>证件类型及编号：<span>{{ContractContent.IDType}}&nbsp;{{ContractContent.OwnerIDCard}}</span></p>
          <p>联系电话：<span>{{ContractContent.OwnerPhone}}</span></p>
          <p>通讯地址：<span v-if="ContractContent.ContractAddress">{{ContractContent.ContractAddress}}</span></p>
          <!--<div class="first-party-div">-->
            <!--<div class="first-party-info1">-->
              <!--<p>甲方（委托方）：<span>{{ContractContent.OwnerName}}</span></p>-->
              <!--<p>证件类型及编号：<span>{{ContractContent.IDType}}&nbsp;{{ContractContent.OwnerIDCard}}</span></p>-->
            <!--</div>-->
            <!--<div class="first-party-info2">-->
              <!--<p>通讯地址：<span v-if="ContractContent.ContractAddress">{{ContractContent.ContractAddress}}</span></p>-->
              <!--<p>联系电话：<span>{{ContractContent.OwnerPhone}}</span></p>-->
            <!--</div>-->
          <!--</div>-->
          <p>乙方（管理方）：<span>四川满城房地产经纪有限责任公司</span></p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;根据《中华人民共和国合同法》 、《中华人民共和国房地产管理法》
            及其他有关法律、法规规定，甲乙双方在平等自愿协商一致的基础上，就下列房屋委托管理事项达成如下协议：</p>
          <p>签约提示</p>
          <p>1、签订合同前，甲方应当向乙方出示房屋所有权证及其他有关证书和证明文件，乙方留存相关资料复印件。</p>
          <p>2、甲乙双方在自愿、公平及诚信实用的原则上订立本合同。</p>
        </div>
      </div>
      <div class="contract-list">
        <div class="contract-list-item">
          <p class="contract-list-title">第一条 基本情况</p>
          <div class="contract-list-content">
            <p>
              1、房屋位置：<span>{{ContractContent.Location}}</span>建筑面积<span>{{ContractContent.HouseArea}}</span>平方米。
            </p>
            <p>2、甲方自愿将以上房屋交于乙方管理。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第二条 委托权限 </p>
          <div class="contract-list-content">
            <p>
              甲方确认甲方将该房屋独家委托乙方全权管理并对外出租，为便于房屋出租，乙方代为甲方提供房屋装修、家具家电配置及管理服务。乙方代甲方与承租人签署租赁合同并收取押金，租金等。乙方从代收租金中支付甲方固定租金回报及扣除代甲方垫付的装修、家具、家电配置费用后，剩余部分为乙方的管理服务费。甲方认可因乙方为房屋提供了装修、配置、卫生、管理等增值房屋并垫付相关费用从而造成一定的成本支出。乙方对外租赁收取的租金可高于乙方向甲方支付的固定租金回报，乙方对外租赁租金标准及承租方由乙方自行决定，甲方不得干涉。无论乙方代收租金是否高于固定租金回报，乙方都须按约定向甲方支付固定租金回报，房屋装修（不破坏甲方主体结构）、家具、家电配置及管理服务均由乙方承担。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第三条 委托期 </p>
          <div class="contract-list-content">
            <p>
              1、委托期为<template v-if="ContractContent.Year"><span>{{ContractContent.Year}}</span>年</template><template v-if="ContractContent.Month"><span>{{ContractContent.Month}}</span>月</template><template v-if="ContractContent.Day"><span>{{ContractContent.Day}}</span>天</template>，自<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>日起，至<span>{{ContractContent.EndYear}}</span>年<span>{{ContractContent.EndMonth}}</span>月<span>{{ContractContent.EndDay}}</span>日止，合同委托期满，根据客户需要，乙方有权原价续租每年不超过三个月时间。
            </p>
            <p>2、委托期满，在同等条件下，乙方有优先续约权。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第四条 管理房屋固定回报租金</p>
          <div class="contract-list-content">
            <p>1、甲乙双方协商，乙方管理甲方房屋，每月固定租金回报为人民币：<span>{{ContractContent.InitialPrice}}</span>元&nbsp;大写：<span>{{ContractContent.InitialPriceChinese}}</span>。
              <!--一年共计人民币<span>{{ContractContent.Total}}</span>元 大写：<span>{{ContractContent.TotalChinese}}</span>。</p>-->
            <p>2、在合同有效期内，房屋租金不予调整。</p>
            <p v-if="ContractContent.CollectionType===0||ContractContent.CollectionType===1">
              3、代管理房屋租金，可选择（a、到乙方公司所在地领取；b、乙方汇入甲方指定账户）（若甲方中途更改账号须及时书面通知乙方，否则责任由甲方承担）。
            </p>
            <p v-if="ContractContent.CollectionType===2">
              3、代管理房屋租金，可选择（a、到乙方公司所在地领取；b、乙方汇入甲方指定账户）微信账号<span>{{ContractContent.ReceiveAccount}}</span>微信名字<span>{{ContractContent.ReceivePeopleName}}</span>（若甲方中途更改账号须及时书面通知乙方，否则责任由甲方承担）。
            </p>
            <p v-if="ContractContent.CollectionType===3">
              3、代管理房屋租金，可选择（a、到乙方公司所在地领取；b、乙方汇入甲方指定账户）支付宝账号<span>{{ContractContent.ReceiveAccount}}</span>支付宝名字<span>{{ContractContent.ReceivePeopleName}}</span>（若甲方中途更改账号须及时书面通知乙方，否则责任由甲方承担）。
            </p>
            <p v-if="ContractContent.CollectionType===4">
              3、代管理房屋租金，可选择（a、到乙方公司所在地领取；b、乙方汇入甲方指定账户）开户行<span>{{ContractContent.BankName}}{{ContractContent.OpenBankName}}</span>转款账户名称<span>{{ContractContent.ReceiveAccount}}</span>账号<span>{{ContractContent.BankAccount}}</span>（若甲方中途更改账号须及时书面通知乙方，否则责任由甲方承担）。
            </p>
            <p>4、如甲方所留账号为{{ContractContent.City}}以外账号，则手续费由甲方承担。</p>
            <p>
              5、甲方于<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>日前，将该房屋交付给乙方，如逾期交付，甲方每日承担日房租的双倍作为违约金。
            </p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第五条 其它费用</p>
          <div class="contract-list-content">
            <p>１、在租赁期内，如房屋所在地进行公共设施改造。如：小区建设、电力增容等所需交纳的相关费用由甲方负担。</p>
            <p>２、在乙方付租日期内，房屋内所发生的水、电、煤气、光纤及物管费、卫生费由乙方承担，其它费用由甲方承担。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第六条 甲方的权利及义务</p>
          <div class="contract-list-content">
            <p>１、在管理期间，甲方不得无故收回房屋，如甲方中途要求收回房屋，乙方有权拒绝。</p>
            <p>２、甲方如有特殊情况确要收回房屋，则做违约论，应提前两个月通知乙方，以便乙方善后客户，并赔偿乙方合同期内剩余房租的双倍作为违约金（本条款，甲乙双方对等）。</p>
            <p>３、甲方保证向乙方提供的房屋产权证明和本人身份证明真实有效，否则甲方承担相应的法律责任。</p>
            <p>４、甲方保证该房屋没有产权纠纷，且甲方有权处分，否则产生的法律责任由甲方承担。</p>
            <p>５、甲方总计给乙方<span>{{ ContractContent.FreeDays }}</span>天，作为乙方寻找客户的时间，此期间甲方不收取以下费用：包括房租，物管费，光纤费，卫生费。
            </p>
            <p>６、双方约定，合同期内，如因甲方以任何原因中途收回房屋，则每年的免租期由甲方承担，乙方有权扣除。</p>
            <p>７、甲方在交房时，须对房内设施检查修缮。</p>
            <p>８、甲方须按照国家现行的法律法规委托乙方依法出租房屋。</p>
            <p>９、如因甲方改变本合同所约定的联系方式，甲方有义务及时告知乙方，因甲方原因，乙方联系不上甲方，乙方可延期付款，直至联系上甲方为止，甲方不得据此向乙方提出赔偿。</p>
            <p>10、甲方须在签订本合同七日内，到房屋所属地派出所办理《治安责任保证书》。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第七条 乙方的权利义务</p>
          <div class="contract-list-content">
            <p>１、乙方在管理期间，不得利用此房进行任何违反法律禁止的活动，否则一切后果由乙方自负，甲方有权收回房屋。</p>
            <p>２、乙方应按本合同规定，按时给甲方支付房屋租金。</p>
            <p>３、在管理期间，乙方应及时安排客户看房。</p>
            <p>
              ４、在管理期间，如房屋设施属人为损坏，由乙方及时维修，如属于房屋本身装修的问题而导致的损坏和一切后果均由甲方负责。若房屋及屋内设施属自然损坏影响乙方居住，例如房内漏水等，甲方应尽快予以解决，从影响居住之日起至修好之日止，此期间乙方不付房租，维修费用由甲方承担。</p>
            <p>５、管理期间，房屋租户如有更换，乙方负责房内各项费用结算及设施清点。</p>
            <p>６、管理期间，房屋因自然损坏，乙方应及时通知甲方修缮。</p>
            <p>７、管理期满，乙方交房时，结清房内各项费用及清点家具电器等设施。</p>
            <p>８、合同期满后，甲方未经乙方同意，两个月内不得与乙方客户签约，否则视甲方违约，违约金为最后一个月租金的双倍。</p>
            <p>9、房屋维修，乙方有权根据房屋出租的实际需要，选择是否为房屋配置家电，窗帘及挂饰等物品，装修配置风格及标准等事宜由乙方自行选择决定，甲方应积极予以配合，不得干涉。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第八条 其它</p>
          <div class="contract-list-content">
            <p>１、房屋如因不可抗拒的因素导致损毁或造成损失，甲乙双方互不承担责任。</p>
            <p>２、本合同如有未尽事宜，由甲乙双方协商解决，并签订补充协议。补充协议与本合同有冲突的地方，以补充协议为准。</p>
            <p>３、在委托期间，因乙方努力工作，出租价格高于本合同规定价格，高出部分视为甲方付于乙方的管理费用，低出部分由乙方补齐。</p>
            <p>４、本合同自双方签字或盖章后生效，合同文本一式两份，甲乙双方各一份，任何一方不得单方面修改或取消本合同。</p>
            <p>５、本合同在履行中如发生争议，双方应协商解决；协商不成，可向人民法院起诉。</p>
            <p>６、本合同附件：房屋所有权证复印件或房屋买卖合同复印件，业主身份证复印件。</p>
          </div>
        </div>
      </div>
      <div class="contract-supply">
        <p class="contract-supply-title">补充条款</p>
        <p class="contract-supply-desc">具体付款日期（遇节假日顺延，不再另行通知）</p>
        <div class="supply-list">
          <div class="supply-item">
            <div class="supply-list-content">
              <p v-if="ContractContent.OwnerBill.length>0" v-for="item in ContractContent.OwnerBill">（{{item.Num}}）
                第{{item.NumChinese}}次付款<span>{{item.EndYear}}</span>年<span>{{item.EndMonth}}</span>月<span>{{item.EndDay}}</span>日，共计<span>{{item.PayMoney}}</span>元。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sign-div-owner">
      <div class="sign-content">
        <p v-if="ContractContent.PaperType" class="first-party">甲方（代表人）:<span>{{ContractContent.OwnerName}}</span></p>
        <div v-else class="first-party">甲方（代表人）:
          <div class="first-party-img">
            <img v-if="ContractContent.SignInfo" :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                 @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
          </div>
        </div>
        <p class="clearfix first-party-cardnumber">证件号码:<span>{{ContractContent.OwnerIDCard}}</span></p>
        <p>业主电话:<span>{{ContractContent.OwnerPhone}}</span></p>
        <p>经办人电话:<span>{{ContractContent.PersonInChargeTel}}</span></p>
      </div>
      <div class="sign-content">
        <div class="second-party">乙方:
          <div class="second-party-img">
            <img :src="$ImgUnit.getThumbImgUrl(ContractContent.SealPicURL)"
                 @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SealPicURL))">
          </div>
        </div>
        <p class="clearfix">经办人:<span>{{ContractContent.PersonInChargeName}}</span></p>
        <p>客服专线:<span>{{ContractContent.CompanyTEL }}</span></p>
        <p>店属及电话:<span>{{ContractContent.Store }} {{ContractContent.BusinessTel }}</span></p>
        <div class="second-party-sign-time">
          签约时间:<p v-if="ContractContent.ContractYear!==1&&ContractContent.ContractYear!==0"><span>{{ContractContent.ContractYear }}</span>年<span>{{ContractContent.ContractMonth }}</span>月<span>{{ContractContent.ContractDay }}</span>日</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OwnerContract',
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
