import Vue from "vue";
import { Message } from 'iview'

export function numORstring(val, text) {
    let reg = /^[A-Za-z0-9]{4,16}$/
    if (reg.test(val)) {
        return true
    } else {
        Message.error(text + '需要输入4-16位字母或数字');
        return false
    }
}

export function numANDstring(val, text) {
    let reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{4,16}$/
    if (reg.test(val)) {
        return true
    } else {
        Message.error(text + '需要4-16个同时包含字母或数字的组合');
        return false
    }
}

export function fourTOfixteen(val, text) {
    let len = String(val).length;
    if (len >= 4 && len <= 16) {
        return true
    } else {
        Message.error(text + '需要输入4-16位');
        return false
    }
}

export function number(val, text) {
    let reg = /^\d{6}$/
    if (reg.test(val)) {
        return true
    } else {
        Message.error(text + '需要6位数字');
        return false
    }
}

// 校验银行卡
export function bankCard(val) {
    let value = String(val)
    if (value.length >=16 && val.length <= 20) {
        return true
    } else {
        return false
    }
}