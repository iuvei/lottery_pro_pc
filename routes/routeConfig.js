const routes = require("./index.js");


/**设置路由*/
function setRoute(app) {
  app.get('/home', routes.home)
  app.get('/more', routes.more)
  app.get('/phone', routes.phone)
  app.get('/activity', routes.activity)
  app.get('*', routes.index)
}

exports.setRoute = setRoute;
