const fs = require('fs')
const path = require('path')
const axios = require('axios')

/* GET home page. */
function index(req, res) {
  const headers = req.headers
  let isMobile = false
  let html
  // 检测userAgent
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      headers['user-agent']
    )
  ) {
    isMobile = true
  }

  html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  res.send(html)
}
exports.index = index

function home(req, res) {
  let Cookies ={};
  if (req.headers.cookie != null) {
    req.headers.cookie.split(';').forEach(l => {
      let parts = l.split('=');
      Cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }
 let param = { "token": Cookies.token, "type": 0 }
  axios({
    url: 'http://lottery.lebole5.com/api/member/info',
    method: 'POST',
    data: JSON.stringify(param)
  }).then( resp => {
    console.log(resp.data.data)
    if (resp.data && resp.data.data) {
      console.log(resp.data.user)
      res.render('home', {navActive: 1, user: resp.data.data.user})
    } else {
      res.render('home', {navActive: 1, user:''})
    }
  }).catch( e => {
    console.log(e)
  })
}
exports.home = home

function more(req, res) {
  res.render('more', { navActive: 4 })
}
exports.more = more

function activity(req, res) {
  res.render('activity', { navActive: 5 })
}
exports.activity = activity

function phone(req, res) {
  res.render('phone', { navActive: 6 })
}
exports.phone = phone


