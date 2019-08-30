import Mock from 'mockjs'

Mock.mock(new RegExp('/user/login'), {
  Code: 0,
  Data: {
    Token: 'asdfalsjfla',
    UserName: 'zhangsan',
    AvaTar: 'https://www.runoob.com/wp-content/uploads/2015/07/2b0c39c7e7a80d5a784c8c2ca63cde17.png'
  }
})
