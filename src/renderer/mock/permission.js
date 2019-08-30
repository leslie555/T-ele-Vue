const Module = [
  {
    KeyID: 1,
    ModuleName: '房源',
    EModuleName: 'House',
    PID: 0
  },
  {
    KeyID: 2,
    ModuleName: '业主',
    EModuleName: 'Owner',
    PID: 0
  },
  {
    KeyID: 3,
    ModuleName: '财务',
    EModuleName: 'Finance',
    PID: 0
  },
  {
    KeyID: 4,
    ModuleName: '租客',
    EModuleName: 'Tenant',
    PID: 0
  },
  {
    KeyID: 5,
    ModuleName: '平台',
    EModuleName: 'Admin',
    PID: 0
  },
  {
    KeyID: 6,
    ModuleName: '服务',
    EModuleName: 'Service',
    PID: 0
  },
  {
    KeyID: 7,
    ModuleName: '测算',
    EModuleName: 'Calculation',
    PID: 0
  },
  {
    KeyID: 8,
    ModuleName: '审批',
    EModuleName: 'Approval',
    PID: 0
  },
  {
    KeyID: 9,
    ModuleName: '系统',
    EModuleName: 'System',
    PID: 0
  },
  {
    KeyID: 10,
    ModuleName: '房态图',
    EModuleName: 'HouseList',
    PID: 1
  },
  {
    KeyID: 11,
    ModuleName: '共享房源',
    EModuleName: 'ShareHouse',
    PID: 1
  },
  {
    KeyID: 12,
    ModuleName: '小区管理',
    EModuleName: 'CommunityList',
    PID: 1
  }
/*   {
    KeyID: 13,
    ModuleName: '房源配置',
    EModuleName: 'HouseConfig',
    PID: 1
  } */
]

const Action = [
  {
    KeyID: 1,
    ActionName: '预定',
    EActionName: 'Reserve',
    ModuleID: 11
  },
  {
    KeyID: 2,
    ActionName: '预约',
    EActionName: 'Appointment',
    ModuleID: 11
  },
  {
    KeyID: 3,
    ActionName: '修改',
    EActionName: 'Edit',
    ModuleID: 12
  }
]

export { Action, Module }
