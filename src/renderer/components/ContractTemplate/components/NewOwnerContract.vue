<template>
  <div class="contract-template">
    <div class="contract-text">
      <div class="contract-header">
        <p class="contract-header-title">房屋租赁运营管理委托协议</p>
        <div class="contract-header-content">
          <div class="header-content">
            <p>甲方（委托方）：<span>{{ContractContent.OwnerName}}</span></p>
            <p>证件类型及编号：<span>{{ContractContent.IDType}}&nbsp;{{ContractContent.OwnerIDCard}}</span></p>
          </div>
          <div class="header-content">
            <p>通讯地址：<span v-if="ContractContent.ContractAddress">{{ContractContent.ContractAddress}}</span></p>
            <p>联系电话：<span>{{ContractContent.OwnerPhone}}</span></p>
          </div>
          <p>乙方（受托方）：<span>{{ContractContent.CompanyName}}</span></p>
          <p>承办人：<span>{{ContractContent.UndertakerName}}</span></p>
          <p>业务部门：<span>{{ContractContent.DepartmentName}}</span></p>
          <p>联络电话：<span>{{ContractContent.UndertakerPhone}}</span></p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp; 根据《中华人民共和国本协议法》
            、《中华人民共和国城市房地产管理法》及其他有关法律、法规规定，甲乙双方在平等自愿协商一致的基础上，就下列房屋租赁运营管理委托事项达成如下协议：</p>
          <p class="text-bold">签约提示</p>
          <p>1．签订本协议前，甲方应当向乙方出示房屋所有权证及其他有关证书和证明文件，乙方留存相关资料复印件。</p>
          <p>2．甲乙双方基于自愿、公平及诚实守信的原则签订本协议。</p>
        </div>
      </div>
      <div class="contract-list">
        <div class="contract-list-item">
          <p class="contract-list-title">第一条 基本情况</p>
          <div class="contract-list-content">
            <p>
              1.房屋位置：<span>{{ContractContent.Location}}</span>，房屋建筑面积<span>{{ContractContent.HouseArea}}</span>平方米（如房屋所有权证标示）。
            </p>
            <p>2.甲方自愿将上述房屋委托乙方进行租赁运营及管理。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第二条 委托权限 </p>
          <div class="contract-list-content">
            <p>1．甲方同意将该房屋独家委托给予乙方全权负责租赁运营管理并得对外出租，为便于房屋出租，乙方可根据需要为甲方提供房屋装修、家具家电配置及管理服务。</p>
            <p>2．乙方及甲方共同与房屋承租人签署租赁协议，甲方同意由乙方向房屋承租人收取租赁押金、房屋租金、物业管理费、水电气费及其他房屋使用应支付的费用。</p>
            <p>3．乙方所收取的房屋租金，除按约定支付甲方固定租金外，得根据实际状况扣除乙方为甲方垫付的房屋装修、家具、家电配置等费用后，剩余部分为乙方的管理服务费。</p>
            <p>
              4．因乙方为房屋提供了装修、配置、卫生、管理等增值服务，并垫付各项相关费用，从而产生一定的成本支出，因此，甲方同意乙方对外租赁房屋时所收取的房屋租金可高于乙方向甲方支付的固定租金，乙方对外租赁房屋的租金标准由乙方自行与房屋承租人进行约定，甲方不得干涉。</p>
            <p>5．无论乙方所收取的房屋租金是否高于应支付给予甲方的固定租金，乙方都须按约定按时向甲方支付固定租金。</p>
            <p>6．房屋装修（不破坏甲方主体结构）、家具、家电配置费用由甲乙双方根据实际需要自行协商。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第三条 委托期 </p>
          <div class="contract-list-content">
            <p>
              1、双方约定该房屋的租赁运营委托期限为
              <template v-if="ContractContent.Year"><span>{{ContractContent.Year}}</span>年</template>
              <template v-if="ContractContent.Month"><span>{{ContractContent.Month}}</span>月</template>
              <template v-if="ContractContent.Day"><span>{{ContractContent.Day}}</span>天</template>
              ，即自<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>日起，至<span>{{ContractContent.EndYear}}</span>年<span>{{ContractContent.EndMonth}}</span>月<span>{{ContractContent.EndDay}}</span>日止，本协议委托期满，乙方有权根据房屋承租人的需要，每年按约定的固定租金金额续租三个月。
            </p>
            <p>2．委托期满，在同等条件下，乙方拥有优先续约权。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第四条 房屋固定租金及支付方式</p>
          <div class="contract-list-content">
            <p>1.甲乙双方约定该房屋的固定月租金金额为人民币：<span>{{ContractContent.InitialPrice}}</span>元&nbsp;大写：<span>{{ContractContent.InitialPriceChinese}}</span>。
            <p>2．甲乙双方约定房屋固定租金按<span>{{$EnumData.getEnumDesByValue('PayCycle', ContractContent.PayCycle)}}</span>支付，如遇特殊情况（包含但不限于逢年过节或国家政策调整、市场变化）乙方有权调整为按月支付，乙方调整支付时间时应提前以书面或电话形式通知甲方，并在每月固定租金金额基础上上浮2%支付给予甲方。
            </p>
            <p>3．在本协议委托期限内，房屋固定租金不予调整。</p>
            <p>4．房屋固定租金，甲方可选择（a、到乙方公司所在地领取；b、乙方汇入甲方指定账户）。</p>
            <p v-if="ContractContent.CollectionType===0||ContractContent.CollectionType===1">
              5.甲方指定收款账户为：现金。
            </p>
            <p v-if="ContractContent.CollectionType===2">
              5.甲方指定收款账户为：微信账号<span>{{ContractContent.ReceiveAccount}}</span>微信名字<span>{{ContractContent.ReceivePeopleName}}</span>。
            </p>
            <p v-if="ContractContent.CollectionType===3">
              5.甲方指定收款账户为：支付宝账号<span>{{ContractContent.ReceiveAccount}}</span>支付宝名字<span>{{ContractContent.ReceivePeopleName}}</span>。
            </p>
            <p v-if="ContractContent.CollectionType===4">
              5.甲方指定收款账户为：开户行<span>{{ContractContent.BankName}}{{ContractContent.OpenBankName}}</span>户名<span>{{ContractContent.ReceiveAccount}}</span>账号<span>{{ContractContent.BankAccount}}</span>。
            </p>
            <p class="text-bold">若甲方中途更改账号须及时以书面方式通知乙方，否则延迟支付的责任由甲方自行承担。</p>
            <p>
              6、甲方应于<span>{{ContractContent.StartYear}}</span>年<span>{{ContractContent.StartMonth}}</span>月<span>{{ContractContent.StartDay}}</span>前，结清房屋原来使用产生的各项费用，结清房屋原来使用产生的各项费用后，将该房屋交付给乙方，如逾期交付，甲方按每日房租的双倍金额做为违约金，赔偿乙方的损失。
            </p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第五条 其他费用</p>
          <div class="contract-list-content">
            <p>1.在本协议委托期限内，如房屋所在地进行公共设施改造，如：小区建设、电力增容等，所需交纳的相关费用由甲方负担。</p>
            <p>2．在甲方将房屋交付给予乙方后，在本协议委托期限内，房屋使用所产生的水电气、光纤及物管费、卫生费由乙方及房屋承租人承担，其他费用由甲方承担。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第六条 甲方的权利及义务</p>
          <div class="contract-list-content">
            <p>1．在本协议委托期限内，甲方不得无故要求收回房屋，如甲方中途要求收回房屋，乙方有权拒绝。</p>
            <p>
              2．甲方如遇特殊情况（仅限于不可抗力或房屋出售、政府拆迁）确实需要收回房屋，应提前两个月以书面通知乙方，以便乙方妥善安排房屋承租人，同时按甲方违约进行处理，甲方同意赔偿乙方壹个月的固定租金做为违约金，同时甲方还应赔偿乙方对该房屋进行的投入装修改造等费用（包括但不限于乙方因此对其他方承担的违约责任，如房屋承租人清退等）。</p>
            <p>3．甲方保证向乙方提供的房屋产权证明和本人身份证明真实有效，否则由甲方承担相应的法律责任。</p>
            <p>4．甲方保证该房屋没有产权纠纷，且甲方拥有该房屋的合法处置权并有权委托给予乙方运营管理，否则产生的法律责任由甲方承担。</p>
            <p>5．甲方同意在委托期限内每年给予乙方<span>{{ ContractContent.FreeDays }}</span>天，作为乙方寻找房屋承租人的时间，此期间甲方同意不收取以下费用：包含房屋固定租金，物管费，光纤费，卫生费、水电气费。
            </p>
            <p>6．双方约定，本协议委托期限内，如甲方以任何原因收回房屋，则每年的免租期由甲方承担，乙方有权扣除每年免租期应支付的固定租金金额。</p>
            <p>7.甲方将房屋移交给予乙方时，应对房屋设施检查修缮，并配合乙方对房内设施设备检查，保证完好可正常使用的状态下移交给予乙方。</p>
            <p>8．甲方须按照国家现行的法律法规，委托乙方依法进行房屋租赁运营管理，获得应得的租金收入。</p>
            <p>9．如甲方改变本协议所约定的联系方式，甲方有义务及时告知乙方，因甲方原因，导致乙方无法及时联系甲方的，乙方有权延期支付当月固定租金，直至联系上甲方为止，甲方不得据此向乙方提出赔偿。</p>
            <p>10.甲方须签订本本协议七日内，到房屋所属地派出所办理《治安责任保证书》。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第七条 乙方的权利义务</p>
          <div class="contract-list-content">
            <p>1. 乙方在委托期限内，不得利用该房屋进行任何违反法律的活动，否则由乙方承担相关的法律责任，同时甲方有权收回该房屋。</p>
            <p>2．乙方应按本协议约定，按时向甲方支付房屋固定租金。</p>
            <p>3．在委托期限内，乙方应积极对外招租，并及时安排意向承租人看房，确保该房屋能完成租赁。</p>
            <p>
              4．在委托期限内，如房屋设施因人为使用造成损坏，由乙方及时进行维修，如属于房屋装修问题或空气质量问题与自然损坏，导致该房屋无法出租或影响房屋承租人居住的，甲方应尽快予以解决，从影响居住之日起至维护完成之日止，此期间乙方有权不支付固定租金，维修产生的费用由甲方自行承担，如造成其他的相关损失均由甲方负责赔偿。</p>
            <p>5．管理期间，房屋租户如有更换，乙方负责房内各项费用结算及设施清点。</p>
            <p>6．在委托期限内，房屋因自然损坏，乙方应及时通知甲方进行修缮，以确保该房屋的正常居住使用功能。</p>
            <p>7．本协议委托期限到期时，乙方应自行结清该房屋使用产生的各项费用，清点家具电器等设施是否完好，将该房屋按约定时间约定的状态交还给予甲方。</p>
            <p>8. 本在委托期限期满后，甲方未经乙方同意，两个月内不得与乙方原有房屋承租人签订房屋租赁协议，否则视同甲方违约，违约金为最后一个月固定租金的双倍。</p>
            <p>9．乙方有权根据该房屋租赁的实际需要，选择是否为该房屋配置家电，窗帘及软装、绿植、挂饰等物品，装修配置风格及标准等事宜由乙方自行选择决定，甲方应积极予以配合，不得干涉。 </p>
            <p>10．如乙方违反本协议约定的，乙方同意赔偿甲方壹个月的固定租金做为违约金。</p>
          </div>
        </div>
        <div class="contract-list-item">
          <p class="contract-list-title">第八条 其它</p>
          <div class="contract-list-content">
            <p>1. 房屋如因不可抗力的因素导致毁损或造成损失，甲乙双方互不承担责任。</p>
            <p>2．本协议如有未尽事宜，由甲乙双方协商解决，并签订补充协议，补充协议与本协议有抵触的地方，以补充协议为准。</p>
            <p>3．本协议自甲乙双方签字或盖章后生效，本协议一式两份，甲乙双方各执一份，任何一方不得单方面修改或解除本协议。</p>
            <p>4．本协议在履行过程中如发生争议，双方应尽量协商解决；协商不成，可向乙方所在地的人民法院提起诉讼。</p>
            <p>5．本协议附件：包含房屋所有权证复印件或商品房买卖合同复印件、房屋所有权人身份证复印件、房屋设备清单、房屋水电气度数数据、物管相关费用结清支付凭证、房屋固定租金支付时间表。</p>
          </div>
        </div>
        <div v-if="ContractContent.ContractRemark" class="contract-list-item">
          <p class="contract-list-title">补充条款:</p>
          <div class="contract-list-content">
            <p style="text-indent: 30px;">{{&nbsp;&nbsp;ContractContent.ContractRemark}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="sign-div-owner">
      <div class="sign-container">
        <div class="sign-content">
          <div class="sign-party">
            <p class="sign-title">甲方（签字）：</p>
            <p v-if="ContractContent.PaperType">{{ContractContent.OwnerName}}</p>
            <div v-else class="first-party-img">
              <img v-if="ContractContent.SignInfo" :src="$ImgUnit.getThumbImgUrl(ContractContent.SignInfo)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SignInfo))">
            </div>
          </div>
        </div>
        <div class="sign-content">
          <div class="sign-party">
            <p class="sign-title">乙方（盖章）：</p>
            <div class="sign-party-img">
              <img v-if="ContractContent.SealPicURL" :src="$ImgUnit.getThumbImgUrl(ContractContent.SealPicURL)"
                   @click="$seeImage($ImgUnit.getImgUrl(ContractContent.SealPicURL))">
            </div>
          </div>
          <div class="sign-party">
            <p class="sign-title">承办人（签字）：</p>
            <!--<div v-if="!ContractContent.PaperType" class="sign-party-img">-->
              <!--<img v-if="ContractContent.UndertakerNameUrl" :src="$ImgUnit.getThumbImgUrl(ContractContent.UndertakerNameUrl)"-->
                   <!--@click="$seeImage($ImgUnit.getImgUrl(ContractContent.UndertakerNameUrl))">-->
            <!--</div>-->
            <p :style="{  marginBottom: '50px' }">{{ContractContent.UndertakerName}}</p>
          </div>
          <div class="sign-party">
            <p class="sign-title">服务电话：</p>
            <span>{{ContractContent.ServiceCall}}</span>
          </div>
        </div>
      </div>
      <div class="sign-time">
        <div class="sign-time-container">
          签约时间：<p v-if="ContractContent.OwnerSignYear">
            <span>{{ContractContent.OwnerSignYear }}</span>年
            <span>{{ContractContent.OwnerSignMonth }}</span>月
            <span>{{ContractContent.OwnerSignDay }}</span>日
          </p>
        </div>
      </div>
    </div>
    <div class="appendix-container">
      <div class="appendix-content house-equipment">
        <p class="appendix-title">本协议附件：1、房屋设备清单</p>
        <div class="appendix-table-container house-equipment-container">
            <div v-if="ContractContent.EquipmentPreview && ContractContent.EquipmentPreview.length> 0" class="table-content">
              <table border="0" cellspacing="1" class="appendix-table">
                <tr>
                  <th class="head-title equipment-name">设备名称</th>
                  <th class="head-title equipment-number">数量</th>
                  <th class="head-title equipment-remark">设备情况</th>
                  <th class="head-title receive-sign">接收确认签字</th>
                </tr>
                <tr v-for="item in ContractContent.EquipmentPreview">
                  <td>{{item.EquipmentName}}</td>
                  <td>{{item.EquipmentNumber}}</td>
                  <td>{{item.EquipmentCondition&&item.EquipmentCondition.length>0?item.EquipmentCondition:'无'}}</td>
                  <td>{{item.EmployeeName}}</td>
                </tr>
              </table>
            </div>
        </div>
      </div>
      <div class="appendix-content house-Utilities">
        <p class="appendix-title">本协议附件：2、房屋水电气度数数据</p>
        <div class="appendix-table-container waterelect-table-container">
          <div v-if="ContractContent.WaterandelectricityPreview && ContractContent.WaterandelectricityPreview.length>1" class="table-content">
          <table border="0" cellspacing="1" class="appendix-table">
            <tr>
              <th class="head-title waterelect-data">水电气数据</th>
              <th class="head-title init-data">初始数据</th>
              <th class="head-title end-data">终止数据</th>
              <th class="head-title is-settle">是否结清</th>
              <th class="head-title waterelect-number">卡号</th>
            </tr>
            <tr v-for="item in ContractContent.WaterandelectricityPreview">
              <td>{{item.ExpenseName}}</td>
              <td>{{item.InitialData}}</td>
              <td>{{item.TerminateData}}</td>
              <td>{{item.IsSettle===0?'否':'是'}}</td>
              <td>{{item.CardNumber}}</td>
            </tr>
          </table>
        </div>
        </div>
        <div class="appendix-table-container other-fee-table-container">
          <div v-if="ContractContent.OtherPreview && ContractContent.OtherPreview.length>0" class="table-content">
            <table border="0" cellspacing="1" class="appendix-table">
              <tr>
                <th class="head-title other-fee">其他费用</th>
                <th class="head-title is-settle">是否结清</th>
                <th class="head-title settle-date">结清日期</th>
                <th class="head-title other-remark">备注</th>
              </tr>
              <tr v-for="item in ContractContent.OtherPreview">
                <td>{{item.ExpenseName}}</td>
                <td>{{item.IsSettle===0?'否':'是'}}</td>
                <td>{{item.SettleDate?$dateFormat(item.SettleDate):''}}</td>
                <td>{{item.Remark}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="appendix-content contract-supply">
        <p class="appendix-title">本协议附件：3、固定租金支付时间表</p>
        <div class="supply-list">
          <div class="supply-item">
            <div class="supply-list-content">
              <p v-if="ContractContent.OwnerBill.length>0" v-for="item in ContractContent.OwnerBill">（{{item.Num}}）
                第{{item.NumChinese}}次付款<span>{{item.EndYear}}</span>年<span>{{item.EndMonth}}</span>月<span>{{item.EndDay}}</span>日¥<span>{{item.PayMoney}}</span>。
              </p>
            </div>
          </div>
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
