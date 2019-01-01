import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = () => import('../views/index')

/* 个人中心 */
const MyCenter = () => import('../views/myCenter/myCenter')
const CenterIndex = () => import('../components/myCenter-component/index')
const UserInfo = () => import('../components/myCenter-component/userinfo')
const Recharge = () => import('../components/myCenter-component/myFinances/recharge')
const MyFinances = () => import('../components/myCenter-component/myFinances/myFinances')
const Withdraw = () => import('../components/myCenter-component/myFinances/withdraw')
const Transfer = () => import('../components/myCenter-component/myFinances/transfer')
const BankCardManage = () => import('../components/myCenter-component/myFinances/bankCardManage')
const MyOrder = () => import('../components/myCenter-component/my-order')
const MoneyLog = () => import('../components/myCenter-component/moneyLog')
const Agent = () => import('../components/myCenter-component/agent/agent')
const AccountCenter = () => import('../components/myCenter-component/agent/accountCenter')
const PopularizeLink = () => import('../components/myCenter-component/agent/popularizeLink')
const UserList = () => import('../components/myCenter-component/agent/userList')
const UserDetail = () => import('../components/myCenter-component/agent/userDetail')
const TeamReport = () => import('../components/myCenter-component/agent/teamReport')
const Announcement = () => import('../components/myCenter-component/messageCenter/announcement')
const MailerList = () => import('../components/myCenter-component/messageCenter/mailer-list')
const MailerListMsg = () => import('../components/myCenter-component/messageCenter/mailer-list-message')
const WagesList = () => import('../components/myCenter-component/agent/wagesList')
const BonusList = () => import('../components/myCenter-component/agent/bonusList')

// 游戏
const GameIndex = () => import('../views/games/index')
const GameTpl = () => import('../components/game/BetTpl')
/* 购彩大厅 */
const LotteryHall = () => import('../views/games/main/lotteryHall')
/* 购彩走势 */
const LotteryNotice = () => import('../views/games/main/lotteryNotice')
const noticeGameList = () => import('../components/game/gameTableList')
const noticeGameListDetail = () => import('../components/game/gameListDetail')
/* 优惠活动 */
const Activity = () => import('../views/activity')
/* 手机购彩 */
const Phone = () => import('../views/phone')
/* 帮助中心 */
const HelpCenter = () => import('../views/help')
const HelpNormal = () => import('../components/help/normal')
const HelpAccount = () => import('../components/help/account')
const HelpPay = () => import('../components/help/pay')
const Rules = () => import('../components/help/rules')
const HelpRule = () => import('../components/help/rule')
const LotteryRule = () => import('../components/help/lottery-rule')
/* 代理加盟 */
const ProxyJoin = () => import('../views/proxyRegister')

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      name: 'toHall',
      component: LotteryHall
    },
    {
      path: '/my',
      name: 'my',
      component: MyCenter,
      children: [{
        path: 'index',
        name: 'indexCenter',
        component: CenterIndex
      }, {
        path: 'info',
        name: 'info',
        component: UserInfo
      }, {
        path: 'finances',
        name: 'finances',
        component: MyFinances,
        children: [{
          path: 'recharge',
          name: 'recharge',
          component: Recharge
        }, {
          path: 'withdraw',
          name: 'withdraw',
          component: Withdraw
        }, {
          path: 'transfer',
          name: 'transfer',
          component: Transfer
        }, {
          path: 'bankCardManage',
          name: 'bankCardManage',
          component: BankCardManage
        }]
      }, {
        path: 'order',
        name: 'order',
        component: MyOrder
      }, {
        path: 'moneylog',
        name: 'moneylog',
        component: MoneyLog
      }, {
        path: 'agent',
        name: 'agent',
        component: Agent,
        children: [{
          path: '0',
          name: '0',
          component: AccountCenter
        }, {
          path: '1',
          name: '1',
          component: PopularizeLink
        }, {
          path: '2',
          name: '2',
          component: UserList
        }, {
          path: '3',
          name: '3',
          component: TeamReport
        }, {
          path: '4',
          name: '4',
          component: WagesList
        }, {
          path: '5',
          name: '5',
          component: BonusList
        }]
      }, {
        path: 'user/detail',
        name: 'users',
        component: UserDetail
      }, {
        path: 'announcement',
        name: 'announcement',
        component: Announcement
      }, {
        path: 'mailerlist',
        name: 'mailerlist',
        component: MailerList
      }, {
        path: 'mailermsg',
        name: 'mailermsg',
        component: MailerListMsg
      }]
    },
    {
      path: '/hall',
      name: 'lotteryHall',
      component: LotteryHall
    },
    {
      path: '/game',
      component: GameIndex,
      children: [
        {
          path: ':game_code',
          component: GameTpl
        }
      ]
    }, {
      path: '/notice',
      name: 'notice',
      component: LotteryNotice,
      children: [{
        path: ':type',
        name: 'gameList',
        component: noticeGameList
      }, {
        path: ':type/:code',
        name: 'gameListDetail',
        component: noticeGameListDetail,
      }]
    }, {
      path: '/activity',
      name: 'activity',
      component: Activity
    }, {
      path: '/phone',
      name: 'phone',
      component: Phone
    }, {
      path: '/help',
      name: 'help',
      component: HelpCenter,
      children: [{
        path: 'normal',
        name: 'normal',
        component: HelpNormal,
      }, {
        path: 'account',
        name: 'account',
        component: HelpAccount,
      }, {
        path: 'pay',
        name: 'pay',
        component: HelpPay,
      }, {
        path: 'rule',
        name: 'rule',
        component: Rules,
        children: [{
          path: '0',
          name: '0',
          component: HelpRule
        }, {
          path: '1',
          name: '1',
          component: LotteryRule
        }]
      }]
    }, {
      path: '/proxyjoin',
      name: 'proxyjoin',
      component: ProxyJoin
    }
  ]
})
