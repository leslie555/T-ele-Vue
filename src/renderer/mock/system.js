import Mock from 'mockjs'

const actionArr = ['新增', '删除', '修改', '上架']
const EActionName = ['del', 'edit', 'up', 'add']
const action = [
  {
    'KeyID|+1': 1,
    'ActionName|1': actionArr,
    'EActionName|1': EActionName,
    ModuleID: /[0-9]/
  }
]
const mod = [
  {
    'KeyID|+1': 1,
    ModuleName: '@FIRST',
    EModuleName: '123',
    ModuleSort: '2',
    PID: /[1-2]/
  }
]
Mock.mock(new RegExp('/System/GetAllmoduleData'), {
  Code: 0,
  Data: {
    RoleID: 0,
    RoleName: null,
    'Action|20': action,
    'Module|10': mod
  },
  Message: ''
})
Mock.mock(new RegExp('/System/addPermissionItem'), {
  __hash: '26298755',
  __typeFullName:
    'ZJPlatform.Common.Ajax.AjaxJsonData`1[[System.Object]],ZJPlatform.Base',
  IsSuccess: true,
  Code: 0,
  Data: {
    __hash: '66020761',
    __typeFullName:
      'ZF.HouseManager.Model.ModuleAndAction.JurisdictionName,ZF.HouseManager.Common',
    Operation: ['Details', 'Edit', 'Delete', 'Disable'],
    ID: 100505,
    CompanyID: 1051,
    StoreID: 0,
    Name: 'aefrq',
    IsUse: true,
    AddTime: '2018-10-23 11:04:10',
    IsAdmin: false,
    SourcePowerID: 0,
    AssignBelongTo: 'Company',
    Language: 'zh-CN'
  },
  MessageType: 'Info',
  '__type_Data.Operation': 'System.Collections.Generic.List`1[[System.String]]',
  __typeDatetime: ['Data.AddTime']
})
Mock.mock(new RegExp('/System/getPermissionDetails'), {
  __hash: '23978436',
  __typeFullName:
    'ZJPlatform.Common.Ajax.AjaxJsonData`1[[System.Object]],ZJPlatform.Base',
  IsSuccess: true,
  Code: 0,
  Data: [
    {
      __hash: '54628818',
      __typeFullName:
        'ZF.HouseManager.MenuAndButton.JurisdictionResult,ZF.HouseManager.Service',
      Count: 0,
      ID: 100502,
      CompanyID: 1051,
      StoreID: 0,
      JurisdictionID: 100453,
      FModuleID: 10006,
      FModuleName: '房源',
      ModuleID: 10015,
      ModuleName: '共享房源',
      ActionID: ['10005'],
      ActionName: ['预约'],
      IsAdmin: false,
      IsUse: true,
      SourcePowerID: 0,
      AssignBelongTo: 'Company',
      Language: 'zh-CN'
    },
    {
      __hash: '55544662',
      __typeFullName:
        'ZF.HouseManager.MenuAndButton.JurisdictionResult,ZF.HouseManager.Service',
      Count: 0,
      ID: 100503,
      CompanyID: 1051,
      StoreID: 0,
      JurisdictionID: 100453,
      FModuleID: 10007,
      FModuleName: '业主',
      ModuleID: 10016,
      ModuleName: '新增合同',
      ActionID: ['10006', '10007', '10008'],
      ActionName: ['暂存', '现场签字', '保存'],
      IsAdmin: false,
      IsUse: true,
      SourcePowerID: 0,
      AssignBelongTo: 'Company',
      Language: 'zh-CN'
    },
    {
      __hash: '12658998',
      __typeFullName:
        'ZF.HouseManager.MenuAndButton.JurisdictionResult,ZF.HouseManager.Service',
      Count: 0,
      ID: 100504,
      CompanyID: 1051,
      StoreID: 0,
      JurisdictionID: 100453,
      FModuleID: 10007,
      FModuleName: '业主',
      ModuleID: 10017,
      ModuleName: '合同列表',
      ActionID: ['10009'],
      ActionName: ['新增合同'],
      IsAdmin: false,
      IsUse: true,
      SourcePowerID: 0,
      AssignBelongTo: 'Company',
      Language: 'zh-CN'
    },
    {
      __hash: '42523065',
      __typeFullName:
        'ZF.HouseManager.MenuAndButton.JurisdictionResult,ZF.HouseManager.Service',
      Count: 0,
      ID: 100505,
      CompanyID: 1051,
      StoreID: 0,
      JurisdictionID: 100453,
      FModuleID: 10043,
      FModuleName: '平台管理',
      ModuleID: 10046,
      ModuleName: '通知模板',
      ActionID: ['10028'],
      ActionName: ['新增'],
      IsAdmin: false,
      IsUse: true,
      SourcePowerID: 0,
      AssignBelongTo: 'Company',
      Language: 'zh-CN'
    }
  ],
  MessageType: 'Info'
})
Mock.mock(new RegExp('/System/GetSelectPageData'), {
  __hash: '34806532',
  __typeFullName:
    'ZJPlatform.Common.Ajax.AjaxJsonData`1[[System.Object]],ZJPlatform.Base',
  IsSuccess: true,
  Code: 0,
  Data: {
    __hash: '42842245',
    __typeFullName:
      'ZJPlatform.DataBase.PageDataResult`1[[ZF.HouseManager.Model.ModuleAndAction.JurisdictionName,ZF.HouseManager.Common]],ZJPlatform.DataBase',
    IsScrollPage: false,
    AllPage: 1,
    Count: 3,
    Page: 1,
    PerPage: 20,
    Datas: [
      {
        __hash: '2237391',
        Operation: ['Details'],
        ID: 1001,
        CompanyID: 1051,
        StoreID: 0,
        Name: '管理员权限',
        IsUse: true,
        AddTime: '2018-09-14 17:10:49',
        IsAdmin: true,
        SourcePowerID: 0,
        AssignBelongTo: 'Company',
        Language: 'zh-CN'
      },
      {
        __hash: '65013065',
        Operation: ['Details', 'Edit', 'Delete', 'Disable'],
        ID: 100453,
        CompanyID: 1051,
        StoreID: 0,
        Name: 'a',
        IsUse: true,
        AddTime: '2018-10-22 10:25:22',
        IsAdmin: false,
        SourcePowerID: 0,
        AssignBelongTo: 'Company',
        Language: 'zh-CN'
      },
      {
        __hash: '48679910',
        Operation: ['Details', 'Edit', 'Delete', 'Disable'],
        ID: 100454,
        CompanyID: 1051,
        StoreID: 0,
        Name: 'az',
        IsUse: true,
        AddTime: '2018-10-22 11:13:48',
        IsAdmin: false,
        SourcePowerID: 0,
        AssignBelongTo: 'Company',
        Language: 'zh-CN'
      }
    ],
    Orders: [
      {
        __hash: '43780958',
        NeedToField: true,
        Property: 'Language',
        IsAsc: true
      },
      {
        __hash: '42638450',
        NeedToField: true,
        Property: 'ID',
        IsAsc: true
      }
    ],
    SelectColName: 'F_ID'
  },
  MessageType: 'Info',
  '__type_Data.Datas[0].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas[1].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas[2].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas':
    'System.Collections.Generic.List`1[[ZF.HouseManager.Model.ModuleAndAction.JurisdictionName,ZF.HouseManager.Common]]',
  __typeDatetime: [
    'Data.Datas[0].AddTime',
    'Data.Datas[1].AddTime',
    'Data.Datas[2].AddTime'
  ]
})
Mock.mock(new RegExp('/System/PermissionDisable'), {
  __hash: '58626115',
  __typeFullName:
    'ZJPlatform.Common.Ajax.AjaxJsonData`1[[System.Object]],ZJPlatform.Base',
  IsSuccess: true,
  Code: 0,
  Data: {
    __hash: '39797977',
    __typeFullName:
      'ZF.HouseManager.Model.ModuleAndAction.JurisdictionName,ZF.HouseManager.Common',
    Operation: ['Details', 'Edit', 'Delete', 'Enable'],
    ID: 100454,
    CompanyID: 1051,
    StoreID: 0,
    Name: 'az',
    IsUse: false,
    AddTime: '2018-10-22 11:13:48',
    IsAdmin: false,
    SourcePowerID: 0,
    AssignBelongTo: 'Company',
    Language: 'zh-CN'
  },
  MessageType: 'Info',
  '__type_Data.Operation': 'System.Collections.Generic.List`1[[System.String]]',
  __typeDatetime: ['Data.AddTime']
})
Mock.mock(new RegExp('/System/CompayManage/GetAllTableData'), {
  __hash: '59189543',
  __typeFullName:
    'ZJPlatform.Common.Ajax.AjaxJsonData`1[[System.Object]],ZJPlatform.Base',
  IsSuccess: true,
  Code: 0,
  Data: {
    __hash: '53086434',
    __typeFullName:
      'ZJPlatform.DataBase.PageDataResult`1[[ZF.HouseManager.Entitys.EntityStoreInfo,ZF.HouseManager.Entitys]],ZJPlatform.DataBase',
    IsScrollPage: false,
    AllPage: 1,
    Count: 4,
    Page: 1,
    PerPage: 20,
    Datas: [
      {
        __hash: '58226819',
        CompanyID: 1051,
        CompanyName: '弹个房科技公司',
        StoreName: '123',
        CityCode: '110101',
        CityName: '北京市.市辖区.东城区',
        Address: '123',
        Picture: '/Upload/UEditUIUpload/20181016/6367529661432230637710891.jpg',
        TopSendMessage: 0,
        TopShelvesHouse: 0,
        TopOwnerContract: 0,
        TopRentContract: 0,
        CommunityCount: 0,
        PrincipalUserID: 100153,
        PrincipalUserName: '123',
        PrincipalUserPhone: '123',
        HouseNumber: 0,
        PeopleNumber: 2,
        Status: false,
        IsIndependent: false,
        FullID: '1051.100152',
        Operation: ['Edit', 'Disable'],
        AddUserFID: '1001.1051',
        AddUserFName: '管理部.BearLee',
        AddUserID: 1051,
        AddUserName: 'BearLee',
        AddDate: '2018-10-16 14:23:40',
        UpdateUserFID: '1001.1051',
        UpdateUserFName: '管理部.BearLee',
        UpdateUserID: 1051,
        UpdateUserName: 'BearLee',
        UpdateDate: '2018-10-24 09:35:38',
        Deled: false,
        DelUserID: 0,
        ID: 100152,
        ApplyID: 0,
        AuditorID: 0,
        Language: 'zh-CN'
      },
      {
        __hash: '54283931',
        CompanyID: 1051,
        CompanyName: '弹个房科技公司',
        StoreName: '测试部',
        CityCode: '310114',
        CityName: '上海市.市辖区.嘉定区',
        Address: '测试地址',
        Picture: '',
        TopSendMessage: 0,
        TopShelvesHouse: 0,
        TopOwnerContract: 0,
        TopRentContract: 0,
        CommunityCount: 0,
        PrincipalUserID: 100502,
        PrincipalUserName: '邹',
        PrincipalUserPhone: '15908183001',
        HouseNumber: 0,
        PeopleNumber: 6,
        Status: false,
        IsIndependent: true,
        FullID: '1051.100502',
        Operation: ['Edit', 'Disable'],
        AddUserFID: '1001.1051',
        AddUserFName: '管理部.BearLee',
        AddUserID: 1051,
        AddUserName: 'BearLee',
        AddDate: '2018-10-23 09:22:47',
        UpdateUserFID: '1001.1051',
        UpdateUserFName: '管理部.BearLee',
        UpdateUserID: 1051,
        UpdateUserName: 'BearLee',
        UpdateDate: '2018-10-23 09:26:50',
        Deled: false,
        DelUserID: 0,
        ID: 100502,
        ApplyID: 0,
        AuditorID: 0,
        Language: 'zh-CN'
      },
      {
        __hash: '20712378',
        CompanyID: 1051,
        CompanyName: '弹个房科技公司',
        StoreName: '分店',
        CityCode: '360622',
        CityName: '江西省.鹰潭市.余江县',
        Address: '测试地址',
        Picture: '',
        TopSendMessage: 0,
        TopShelvesHouse: 0,
        TopOwnerContract: 0,
        TopRentContract: 0,
        CommunityCount: 0,
        PrincipalUserID: 100502,
        PrincipalUserName: '邹',
        PrincipalUserPhone: '15908183001',
        HouseNumber: 0,
        PeopleNumber: 6,
        Status: true,
        IsIndependent: false,
        FullID: '1051.100503',
        Operation: ['Edit', 'Disable'],
        AddUserFID: '1001.1051',
        AddUserFName: '管理部.BearLee',
        AddUserID: 1051,
        AddUserName: 'BearLee',
        AddDate: '2018-10-23 09:27:32',
        UpdateUserFID: '1001.1051',
        UpdateUserFName: '管理部.BearLee',
        UpdateUserID: 1051,
        UpdateUserName: 'BearLee',
        UpdateDate: '2018-10-23 09:27:32',
        Deled: false,
        DelUserID: 0,
        ID: 100503,
        ApplyID: 0,
        AuditorID: 0,
        Language: 'zh-CN'
      },
      {
        __hash: '47127151',
        CompanyID: 1051,
        CompanyName: '弹个房科技公司',
        StoreName: '测试分店1',
        CityCode: '320611',
        CityName: '江苏省.南通市.港闸区',
        Address: 'xxxxxxxxx',
        Picture: '',
        TopSendMessage: 0,
        TopShelvesHouse: 0,
        TopOwnerContract: 0,
        TopRentContract: 0,
        CommunityCount: 0,
        PrincipalUserID: 100502,
        PrincipalUserName: '邹',
        PrincipalUserPhone: '15908183001',
        HouseNumber: 0,
        PeopleNumber: 2,
        Status: true,
        IsIndependent: false,
        FullID: '1051.100507',
        Operation: ['Edit', 'Disable'],
        AddUserFID: '1001.1051',
        AddUserFName: '管理部.BearLee',
        AddUserID: 1051,
        AddUserName: 'BearLee',
        AddDate: '2018-10-23 09:31:58',
        UpdateUserFID: '1001.1051',
        UpdateUserFName: '管理部.BearLee',
        UpdateUserID: 1051,
        UpdateUserName: 'BearLee',
        UpdateDate: '2018-10-23 09:31:58',
        Deled: false,
        DelUserID: 0,
        ID: 100507,
        ApplyID: 0,
        AuditorID: 0,
        Language: 'zh-CN'
      }
    ],
    Orders: [
      {
        __hash: '56233802',
        NeedToField: true,
        Property: 'Language',
        IsAsc: true
      },
      {
        __hash: '28502236',
        NeedToField: true,
        Property: 'ID',
        IsAsc: true
      }
    ],
    SelectColName: 'F_ID'
  },
  MessageType: 'Info',
  '__type_Data.Datas[0].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas[1].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas[2].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas[3].Operation':
    'System.Collections.Generic.List`1[[System.String]]',
  '__type_Data.Datas':
    'System.Collections.Generic.List`1[[ZF.HouseManager.Entitys.EntityStoreInfo,ZF.HouseManager.Entitys]]',
  __typeDatetime: [
    'Data.Datas[0].AddDate',
    'Data.Datas[0].UpdateDate',
    'Data.Datas[1].AddDate',
    'Data.Datas[1].UpdateDate',
    'Data.Datas[2].AddDate',
    'Data.Datas[2].UpdateDate',
    'Data.Datas[3].AddDate',
    'Data.Datas[3].UpdateDate'
  ]
})
Mock.mock(new RegExp('/System/StaffManage/GetInitData'), {
  Code: 0,
  companies: [
    {
      id: 1,
      label: '满城地产有限公司'
    },
    {
      id: 2,
      label: '金科'
    }
  ],
  departments: [
    {
      id: 100,
      pid: 1,
      label: '管理部'
    },
    {
      id: 101,
      pid: 2,
      label: '市场部'
    },
    {
      id: 10201,
      pid: 1,
      label: '运营部'
    },
    {
      id: 10001,
      pid: 101,
      label: '管理部'
    },
    {
      id: 10101,
      pid: 102,
      label: '市场部'
    },
    {
      id: 10201,
      pid: 101,
      label: '运营部'
    }
  ]
})
