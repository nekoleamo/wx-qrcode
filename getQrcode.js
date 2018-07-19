const readline = require('readline')
const axios = require('axios')
const fs = require('fs')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

getToken()

let ACCESS_TOKEN = ''

function getQRCode (token) {
  const options = {
    method: 'post',
    url: `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${token}`,
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

  
function getToken () {
  rl.question('请输入您的ACCESS_TOKEN\n', (answer) => {
    if (answer.toString().trim() === '') {
      console.log('ACCESS_TOKEN不能为空')
      getToken ()
    } else {
      rl.close()
      ACCESS_TOKEN = answer
      getQRCode(ACCESS_TOKEN)
    }
  })
}