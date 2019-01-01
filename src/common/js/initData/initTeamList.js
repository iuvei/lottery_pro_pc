import {getYYYY_MM_HH} from "../date";

export function initTeamItem(data) {
  let list = data.map(item => {
    return {
      username: item.username,
      is_agent: item.is_agent,
      formatTime: item.time ? getYYYY_MM_HH(item.time * 1000) : '',
      game_id: item.game_id,
      game_name: item.game_name,
      children_amount_total: (parseFloat(item.amount_total) + parseFloat(item.children_amount_total)).toFixed(3),
      children_valid_total: (parseFloat(item.valid_total) + parseFloat(item.children_valid_total)).toFixed(3),
      children_win_amount: (parseFloat(item.win_amount)+ parseFloat(item.children_win_amount)).toFixed(3),
      children_winning_amount: (parseFloat(item.winning_amount) + parseFloat(item.children_winning_amount)).toFixed(3),
      children_rebate_amount: (parseFloat(item.rebate_amount) + parseFloat(item.children_rebate_amount)).toFixed(3),
      children_rebates: (parseFloat(item.rebates) + parseFloat(item.children_rebates)).toFixed(3),
      children_bill_rows: (parseFloat(item.bill_rows) + parseFloat(item.children_bill_rows)).toFixed(3),
      user_rows: item.children_user_rows || 0,
      team_profit: (parseFloat(item.team_profit)).toFixed(3),
      self_profit: (parseFloat(item.profit)).toFixed(3),
      amount_total: (parseFloat(item.amount_total)).toFixed(3),
      valid_total: (parseFloat(item.valid_total)).toFixed(3),
      win_amount: (parseFloat(item.win_amount)).toFixed(3),
      winning_amount: (parseFloat(item.winning_amount)).toFixed(3),
      rebate_amount: (parseFloat(item.rebate_amount)).toFixed(3),
      rebates: (parseFloat(item.rebates)).toFixed(3),
      bill_rows: (parseFloat(item.bill_rows)).toFixed(3)
    }
  })
  return list
}

export function initTeamDetail(data) {
  return {
    user: data.username,
    teamList: [
      {title: '总盈亏额', value: data.team_profit},
      {title: '投注总额', value: data.children_amount_total},
      {title: '有效投注', value: data.children_valid_total},
      {title: '投注盈利', value: data.children_win_amount},
      {title: '投注奖金', value: data.children_winning_amount},
      {title: '投注返点', value: data.children_rebate_amount + "%"},
      {title: '返点差总额', value: data.children_rebates},
      {title: '注单总数', value: data.children_bill_rows},
      {title: '投注人数', value: data.user_rows}
    ],
    selfList: [
      {title: '总盈亏额', value: data.self_profit},
      {title: '投注总额', value: data.amount_total},
      {title: '有效投注', value: data.valid_total},
      {title: '投注盈利', value: data.win_amount},
      {title: '投注奖金', value: data.winning_amount},
      {title: '投注返点', value: data.rebate_amount + "%"},
      {title: '返点差总额', value: data.rebates},
      {title: '注单总数', value: data.bill_rows}
    ]
  }

}