import moment from 'moment/min/moment-with-locales.min'

export function initOrderItem(data) {
  let win_amout = parseFloat(data.winning_amount) || parseFloat(data.win_amount);
  let status = data.status;
  let statusText = '', statusCode = '';
  let create_time = data.create_time * 1000;
  if (status === '0') {
    statusText = '未结算'
    statusCode = 0
  }
  if (status === '1' && win_amout > 0) {
    statusText = '已中奖'
    statusCode = 1
  }
  if (status === '1' && win_amout < 0) {
    statusText = '未中奖'
    statusCode = 2
  }
  return {
    game_name: data.game_name,
    round: data.round,
    game_full_name: data.full_name,
    content: data.content,
    total_amount: data.amount_total,
    children_winning_amountwin_amount: win_amout,
    winning_amount: data.winning_amount,
    statusText: statusText,
    statusCode: statusCode,
    order_num: data.order_num,
    number: data.number,
    num: data.num,
    amount: data.amount,
    multiple: data.multiple,
    create_time: create_time,
    odds: data.odds,
    rebate: data.rebate
  };
}

export function initOrderDetail(data) {
  let create_time = moment(data.create_time).format('MMMM Do YYYY, h:mm:ss');
  return [
    {title: '订单号', value: data.order_num},
    {title: '彩种', value: data.game_name},
    {title: '期号', value: data.round},
    {title: '玩法', value: data.game_full_name},
    {title: '投注内容', value: data.content},
    {title: '赔率-返点', value: `${data.odds}-${data.rebate}`},
    {title: '开奖号码', value: data.number},
    {title: '注单数', value: data.num},
    {title: '单注金额', value: data.amount},
    {title: '倍数', value: data.multiple},
    {title: '投注总额', value: data.total_amount},
    {title: '中奖金额', value: data.winning_amount},
    {title: '交易时间', value: create_time},
    {title: '状态', value: data.statusText},
    {title: '盈亏', value: data.win_amount},
  ]

}