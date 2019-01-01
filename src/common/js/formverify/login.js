import {numORstring, numANDstring} from "./base";
import { Message } from 'iview'

export function loginVerify(data) {
    if ( numORstring(data.register_name, "注册账号") && numANDstring(data.register_pwd, "注册密码")) {
        if (data.register_again_pwd) {
            if (data.register_pwd === data.register_again_pwd) {
                if (data.register_agreeChk) {
                    return true
                } else {
                    Message.error('请勾选彩票服务条款');
                }
            } else {
                Message.error('两次密码输入不正确');
            }
        } else {
            Message.error('请再次输入密码');
        }
    }
}