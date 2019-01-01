function getCookies() {
  let Cookies = {}
  if (document.cookie != null) {
    document.cookie.split(';').forEach(l => {
      let parts = l.split('=');
      Cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
  }

  return Cookies.token || ""
}

function showUserInfo() {
  $('.header-right')[0].style.display = "none"
  $('.header-right-logined')[0].style.display = "block"
}
function hiddenUserInfo() {
  $('.header-right')[0].style.display = "block"
  $('.header-right-logined')[0].style.display = "none"
}