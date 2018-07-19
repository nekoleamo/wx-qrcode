const readline = require('readline')
const axios = require('axios')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

getType()

let postUrl = ''
let ACCESS_TOKEN = ''
// 1为小程序码接口，2为普通二维码接口
const urlList = [
  'https://api.weixin.qq.com/wxa/getwxacode',
  'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode'
]

function getType () {
  rl.question('===========================\n请选择想要申请的二维码（输入1或2）：\n1.小程序码\n2.普通二维码\n===========================\n', (type) => {
    type = Number(type)
    if (type === 1 || type === 2) {
      postUrl = urlList[type - 1]
      getToken()
    } else {
      console.warn('===========================\n请重新选择申请的二维码\n===========================\n')
      getType()
    }
  })
}

function getToken () {
  rl.question('===========================\n请输入您的ACCESS_TOKEN\n===========================\n', (answer) => {
    if (answer.toString().trim() === '') {
      console.warn('ACCESS_TOKEN不能为空')
      getToken ()
    } else {
      rl.close()
      ACCESS_TOKEN = answer
      getQRCode(postUrl, ACCESS_TOKEN)
    }
  })
}

function getQRCode (url, token) {
  const options = {
    method: 'post',
    url: `${url}?access_token=${token}`,
    data: JSON.stringify({
      path: 'pages/index/index'
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'stream'
  }
  
  axios(options).then((res) => {
    const rs = res.data
    const ws = fs.createWriteStream(`${__dirname}/wx_qrcode_${new Date().getTime()}.png`)
    rs.pipe(ws)
    console.log(`已获取二维码，保存路径为 ${__dirname}`)
  })
}