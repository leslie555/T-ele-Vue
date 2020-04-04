import axios from 'axios'
import { baseURL } from '../../../config'
const getPerson = function(token, recordType, KeyID, ShareName) {
  // var ZShareID = ''
  // var CShareID = ''
  // var ShareID = ''
  // if (recordType === 5) {
  //   CShareID = ShareName
  // } else if (recordType === 1) {
  //   ZShareID = ShareName
  // } else {
  //   ShareID = ShareName
  // }
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return axios({
    url: baseURL + `/CompanyMethod/ShareInteface?Token=${token}`,
    method: 'post',
    data: {
      Type: recordType,
      KeyID,
      ShareID: ShareName
    },
    config
  })
    .then(({ data }) => {
      if (data.Code === 0) {
        return data
      } else {
        throw new Error(data.Msg)
      }
    })
    .catch(({ message }) => {
      alert(message)
    })
}
export default getPerson
