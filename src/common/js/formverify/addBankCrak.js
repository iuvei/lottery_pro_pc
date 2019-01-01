import { Message } from 'iview'
import {bankCard} from "./base";

export function addBankCardVerity(data) {
    if (!data.bankName) {
        Message.error('请选择添加的银行');
        return false
    }
    if (!bankCard(data.bankCardNum)) {
        Message.error('请输入16到20位银行卡号');
        return false
    }
    if (data.bankCardNum !== data.bankCardNumAgain) {
        Message.error('再次输入的卡号不一致');
        return false
    }
    if (!data.bankAddress) {
        Message.error('请填写银行卡对应开户行');
        return false
    }
    return true
}