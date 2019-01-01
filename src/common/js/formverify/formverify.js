import {numORstring, numANDstring} from "./base";
import { Message } from 'iview'

export function registerVerify(data) {
    if ( !numORstring(data.register_name, "注册账号")) {
        return false
    }
    if (!numANDstring(data.register_pwd, "注册密码")) {
        return false
    }
    if (!data.register_again_pwd) {
        Message.error('请再次输入密码');
        return false
    }
    if (data.register_pwd !== data.register_again_pwd) {
        Message.error('两次密码输入不正确');
        return false
    }
    if (!data.register_realname) {
        Message.error('请输入真实姓名');
        return false
    }
    if (!data.register_agreeChk) {
        Message.error('请勾选彩票服务条款');
        return false
    }
    return true
}


export function loginVerify(data) {
    if ( numORstring(data.username, "登录账号") && numANDstring(data.password, "登录密码")) {
        return true
    }
}