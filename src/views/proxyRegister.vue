<template>
    <div>
        <div class="container">
            <div class="proxy-register-wrapper" ref="wrapper">
                <div class="wrapper-title">
                    <span class="text">代理加盟</span>
                    <span class="login">已有代理账户？<span class="login-text">立即登录</span></span>
                </div>
                <div class="content">
                    <div class="form">
                        <div class="input-group">
                            <div class="text">用户名</div>
                            <input maxlength="16" class="input" v-model="register_name" type="text" placeholder="4-16个字母或数字">
                        </div>
                        <div class="input-group">
                            <div class="text">密码</div>
                            <input maxlength="16" class="input" v-model="register_pwd" type="password" placeholder="4-16个同时包含字母或数字的组合">
                        </div>
                        <div class="input-group">
                            <div class="text">确认密码</div>
                            <input maxlength="16" class="input" v-model="register_again_pwd" type="password" placeholder="确认输入密码">
                        </div>
                        <div class="input-group">
                            <div class="text">真实姓名</div>
                            <input maxlength="50" class="input" v-model="register_realname" type="text" placeholder="真实姓名">
                        </div>
                        <div class="input-group">
                            <div class="text">邀请码</div>
                            <input maxlength="10" class="input" v-model="invitation_code" type="text" placeholder="请填写邀请码">
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
                                :class="register_name && register_pwd && register_again_pwd && register_code && register_agreeChk? 'selected':'ban'"
                                class="submit" @click="register_submit_handle">立即注册
                        </button>
                        <div class="other-group">
                            <Checkbox v-model="register_agreeChk" class="checkbox-group"> 已阅读并同意<span class="text-red">《彩票服务条款》</span>
                            </Checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
  import Footers from '../components/footers/footers';
  import {getContentHeight} from "../common/js/common";
  import {numORstring, numANDstring} from "../common/js/formverify/base";
  import {Message} from 'iview'
  import ImgVerify from '../common/base/v-img-verify/v-img-verify'
  import {mapActions} from 'vuex'

  export default {
    name: "proxyRegister",
    data() {
      return {
        register_name: '',
        register_pwd: '',
        register_again_pwd: '',
        register_realname: '',
        invitation_code: '',
        register_code: '',
        verifyCodeShouldReload: '',
        register_agreeChk: '',
        verifyToken: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['REGISTER']),
      verifyAccount() {
        if (!numORstring(this.register_name, "注册账号")) {
          return false
        }
        if (!numANDstring(this.register_pwd, "注册密码")) {
          return false
        }
        if (!this.register_again_pwd) {
          Message.error('请输入密码');
          return false
        }
        if (this.register_pwd !== this.register_again_pwd) {
          Message.error('两次密码输入不正确');
          return false
        }
        if (!this.register_realname) {
          Message.error('请输入真实姓名');
          return false
        }
        if (!this.register_code) {
          Message.error('请输入验证码');
          return false
        }
        if (!this.register_agreeChk) {
          Message.error('请勾选彩票服务条款');
          return false
        }
        return true
      },
      register_submit_handle() {
        if (!this.verifyAccount()) {
          return
        }
        this.REGISTER({
          username: this.register_name,
          password: this.register_pwd,
          real_name: this.register_realname,
          invitation_code: this.invitation_code,
          verify_code: this.register_code,
          verify_key: this.verifyToken
        })
          .then(res => {
            location.reload()
            //推广码
            console.log(res.promotion_code)
          })
          .catch(err => {
            this.verifyCodeShouldReload = true
          })
      },
      getVerifyToken(key) {
        this.verifyToken = key
      },
      setReload(bool) {
        this.verifyCodeShouldReload = bool
      },
      _initPage() {
        this.$nextTick(() => {
          let contentHeight = getContentHeight()
          this.$refs.wrapper.style.minHeight = contentHeight + 'px'
        })
      }
    },
    components: {
      Footers, ImgVerify
    }
  }
</script>

<style scoped lang="scss">
    .proxy-register-wrapper {
        width: 100%;
        margin: 20px 0;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        background-color: #ffffff;
        .wrapper-title {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 59px;
            padding: 0 28px;
            border-bottom: 1px solid $border-color-gary;
            .text {
                position: relative;
                top: 1px;
                display: inline-block;
                height: 100%;
                line-height: 59px;
                border-bottom: 2px solid $color-theme;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-theme;
            }
            .login {
                font-size: $font-size-medium;
                color: $color-dark;
                .login-text {
                    color: $color-theme;
                    cursor: pointer;
                }
            }
        }
        .content {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            width: 100%;
            .form {
                width: 340px;
                padding: 20px;
                box-sizing: initial;
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
                    .checkbox-group {
                        font-size: $font-size-medium;
                    }
                }
            }
        }
    }
</style>
