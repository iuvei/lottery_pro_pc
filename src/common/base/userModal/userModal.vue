<template>
    <div v-show="displayModal || promotion_code">
        <div class="user-wrapper">
            <div class="register-group group" v-if="modalType === 'register' || promotion_code">
                <span class="close-btn iconfont icon-guanbi" @click="closeModalHandle"></span>
                <div class="wg-logo"></div>
                <div class="title">立即加入-信誉保障</div>
                <div class="input-group">
                    <div class="text">邀请码</div>
                    <input maxlength="10" class="input" v-model="invitation_code" type="text" placeholder="请输入邀请码（非必填）">
                </div>
                <div class="input-group">
                    <div class="text">推广码</div>
                    <input maxlength="10" :disabled="promotion_code"class="input" v-model="promotion_code" type="text" placeholder="请输入推广码（非必填）">
                </div>
                <div class="input-group">
                    <div class="text">用户名</div>
                    <input maxlength="16" class="input" v-model="register_name" type="text" placeholder="4-16个字母或数字">
                </div>
                <div class="input-group">
                    <div class="text">密码</div>
                    <input maxlength="16" class="input" v-model="register_pwd" type="password"
                           placeholder="4-16个同时包含字母或数字的组合">
                </div>
                <div class="input-group">
                    <div class="text">确认密码</div>
                    <input maxlength="16" class="input" v-model="register_again_pwd" type="password"
                           placeholder="确认输入密码">
                </div>
                <div class="input-group">
                    <div class="text">真实姓名</div>
                    <input maxlength="50" class="input" v-model="register_realname" type="text" placeholder="真实姓名">
                </div>
                <div class="input-group code-group">
                    <div class="text">验证码</div>
                    <div class="code-box">
                        <input maxlength="4" class="input" v-model="register_code" type="text" placeholder="请输入验证码">
                        <ImgVerify class="code" :shouldReload="verifyCodeShouldReload" @setReload="setReload"
                                   @getVerifyToken="getVerifyToken"/>
                    </div>
                </div>
                <button type="button"
                        :class="register_name && register_pwd && register_again_pwd && register_realname && register_code && register_agreeChk? 'selected':'ban'"
                        class="submit" @click="register_submit_handle">立即注册
                </button>
                <div class="other-group">
                    <Checkbox v-model="register_agreeChk" class="checkbox-group"> 已阅读并同意<span
                            class="text-red">《彩票服务条款》</span></Checkbox>
                    <div class="has-account">
                        已有账户
                        <span class="text-red" @click="closeModalHandle">登录</span>
                    </div>
                </div>
            </div>
            <div class="test-play-group group" v-if="modalType === 'test_play'">
                <span class="close-btn iconfont icon-guanbi" @click="closeModalHandle"></span>
                <div class="wg-logo"></div>
                <div class="text">试玩账号只供玩家熟悉游戏。不允许充值和提款，且不享有参加优惠活动的权利，有效时间为<span class="text-red">72</span>小时</div>
                <div class="code-box">
                    <input @keydown.13="testPlaySubmitHandle" maxlength="4" class="input" v-model="textPlay_code"
                           type="text" placeholder="请输入验证码">
                    <ImgVerify class="code" :shouldReload="verifyCodeShouldReload" @setReload="setReload"
                               @getVerifyToken="getVerifyToken"/>
                </div>
                <div class="btn-group">
                    <button type="button" @click="closeModalHandle">取消</button>
                    <button type="button" @click="testPlaySubmitHandle" class="textPlay-btn">立即试玩</button>
                </div>
            </div>
        </div>
        <div class="mask" v-show="mask"></div>
    </div>
</template>

<script>
  import ImgVerify from '../v-img-verify/v-img-verify'
  import { findGetParameter } from '../../../util/filters'

  export default {
    name: "userModal",
    props: {
      mask: {
        type: Boolean,
        default: true
      },
      modalType: {
        type: String,
        default: ''
      },
      displayModal: {
        type: Boolean,
        default: false
      },
      verifyCodeShouldReload: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        register_agreeChk: false,       //       /*  注册同意按钮
        register_name: '',    //            注册账户
        register_pwd: '',    //             注册密码
        register_again_pwd: '',    //       注册确认密码
        register_realname: '',
        invitation_code: '',
        promotion_code: '',
        is_agent: 0,
        register_code: '',    //            注册验证码
        textPlay_code: '',     //            试玩验证码
      }
    },
    methods: {
      closeModalHandle() {
        this.register_name = '';
        this.register_pwd = '';
        this.register_again_pwd = '';
        this.register_realname = '';
        this.register_code = '';
        this.invitation_code = ''
        this.promotion_code = ''
        this.register_agreeChk = false;
        this.is_agent = 0;
        this.$emit('closeModal');
      },
      register_submit_handle() {
        let data = {
          invitation_code: this.invitation_code,
          promotion_code: this.promotion_code,
          register_name: this.register_name,
          register_pwd: this.register_pwd,
          register_again_pwd: this.register_again_pwd,
          register_realname: this.register_realname,
          register_code: this.register_code,
          verifyToken: this.verifyToken,
          register_agreeChk: this.register_agreeChk,
          is_agent: this.is_agent
        };
        this.$emit('registerSubmitHandle', data)
      },
      testPlaySubmitHandle() {
        let data = {
          textPlay_code: this.textPlay_code,
          verifyToken: this.verifyToken,
        };
        this.$emit('testPlaySubmitHandle', data)
      },
      getVerifyToken(key) {
        this.verifyToken = key
      },
      setReload(bool) {
        this.$emit('setReload', bool);
      }
    },
    created(){
         this.promotion_code = findGetParameter("code")
         this.is_agent = parseInt(findGetParameter("type"))
    },
    components: {
      ImgVerify
    }
  }
</script>

<style scoped lang="scss">
    .user-wrapper {
        .text-red {
            color: $color-theme;
        }
        .group {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 0 14px #A4A6BC;
            z-index: 9999;
            &.register-group {
                width: 438px;
                padding: 48px 48px 52px;
                box-sizing: border-box;
                .close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    font-size: 20px;
                    color: $color-theme;
                    cursor: pointer;
                }
                .wg-logo {
                    width: 205px;
                    height: 26px;
                    margin-bottom: 20px;
                    background: url("../../../../public/static/images/logo.png") no-repeat center center;
                    background-size: contain;
                }
                .title {
                    margin-bottom: 20px;
                    font-size: $font-size-large;
                    color: $color-black;
                }
                .input-group {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    width: 100%;
                    height: 36px;
                    padding: 0 10px;
                    margin-bottom: 20px;
                    border: 1px solid $border-color-gary;
                    border-radius: 3px;
                    .text {
                        flex: 0 0 66px;
                        border-right: 1px solid $border-color-gary;
                        font-size: $font-size-medium;
                        color: $color-black;
                    }
                    > .input {
                        flex: 1;
                        padding-left: 10px;
                        border: none;
                        font-size: $font-size-medium;
                        color: $color-black;
                    }
                    &.code-group {
                        padding-right: 0;
                        .code-box {
                            flex: 1;
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: flex-start;
                            align-items: center;
                            .input {
                                flex: 1;
                                padding-left: 10px;
                                border: none;
                                font-size: $font-size-medium;
                                color: $color-black;
                            }
                            .code {
                                flex: 0 0 100px;
                                height: 36px;
                                line-height: 36px;
                                text-align: center;
                                font-size: $font-size-medium;
                                color: $color-white;
                                background-color: #d8d8d8;
                            }
                        }
                    }
                }
                .submit {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    border: 1px solid $border-color-gary;
                    margin: 20px 0 13px;
                    text-align: center;
                    font-size: $font-size-medium;
                    color: $color-white;
                    background-color: #666666;
                    &.selected {
                        border: 1px solid transparent;
                        background-color: $theme-color;
                    }
                    &.ban {
                        cursor: not-allowed;
                    }
                }
                .other-group {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    font-size: $font-size-medium;
                    .text-red {
                        color: $color-theme;
                        cursor: pointer;
                    }
                    .checkbox-group {
                        font-size: $font-size-medium;
                    }
                    .has-account {
                        font-size: $font-size-medium;
                        color: $color-dark;
                    }
                }
            }
            &.test-play-group {
                width: 438px;
                padding: 48px 48px 52px;
                box-sizing: border-box;
                .close-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    font-size: 20px;
                    color: $color-theme;
                    cursor: pointer;
                }
                .wg-logo {
                    width: 205px;
                    height: 26px;
                    margin-bottom: 48px;
                    background: url("../../../../public/static/images/logo.png") no-repeat center center;
                    background-size: contain;
                }
                .text {
                    margin-bottom: 25px;
                    line-height: 1.8;
                    font-size: $font-size-medium-x;
                    color: $color-dark;
                }
                .code-box {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    height: 36px;
                    border: 1px solid $border-color-gary;
                    margin-bottom: 20px;
                    .input {
                        flex: 1;
                        padding-left: 10px;
                        border: none;
                        font-size: $font-size-medium;
                        color: $color-black;
                    }
                    .code {
                        flex: 0 0 120px;
                        height: 36px;
                        line-height: 36px;
                        text-align: center;
                        font-size: $font-size-medium;
                        color: $color-white;
                        background-color: #d8d8d8;
                    }
                }
                .btn-group {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    button {
                        width: 164px;
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid $color-theme;
                        text-align: center;
                        font-size: $font-size-medium;
                        color: $color-theme;
                        background-color: $color-white;
                        &.textPlay-btn {
                            border: 1px solid transparent;
                            color: $color-white;
                            background-color: $color-theme;
                        }
                    }
                }
            }
        }
    }

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
</style>
