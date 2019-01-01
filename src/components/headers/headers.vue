<template>
    <div class="headers">
        <div class="header-top">
            <div class="container">
                <div class="header-box">
                    <div class="logo"></div>
                    <div class="header-right" v-if="!logined">
                        <div class="input-group">
                            <input @focus="()=>{this.defaultLightLoginBtn = true}" @blur="()=>{this.defaultLightLoginBtn = false}" type="text" v-model="login_name" class="account" placeholder="输入用户名"
                                   @keydown.13="loginHandle">
                            <input @focus="()=>{this.defaultLightLoginBtn = true}" @blur="()=>{this.defaultLightLoginBtn = false}" type="password" v-model="login_pwd" class="psd" placeholder="输入密码"
                                   @keydown.13="loginHandle">
                        </div>
                        <a href="#" class="trial" @click="testPlayHandle">免费试玩</a>
                        <div class="btn-group">
                            <button type="button" class="btn" :class="defaultLightLoginBtn?'lightBg':''" @click="loginHandle">登录</button>
                            <button type="button" class="btn" :class="defaultLightLoginBtn?'':'lightBg'" @click="registerHandle">注册</button>
                        </div>
                    </div>
                    <div class="header-right-logined" v-if="logined">
                        <div class="login-message">
                            <span class="name">您好: <b>{{userInfo.username}}</b></span>
                            <span class="price">余额: <b>{{$store.getters.balance}}</b></span>
                        </div>
                        <ul class="list">
                            <li class="item">
                                <router-link tag="a" to="/my/index">个人中心</router-link>
                            </li>
                            |
                            <li class="item">
                                <router-link tag="a" to="/my/finances/recharge">充值</router-link>
                            </li>
                            |
                            <li class="item">
                                <router-link tag="a" to="/my/finances/transfer">转账</router-link>
                            </li>
                            |
                            <li class="item">
                                <router-link tag="a" to="/my/finances/withdraw">提现</router-link>
                            </li>
                            |
                            <li class="item">
                                <router-link tag="a" to="/my/order">投注记录</router-link>
                            </li>
                            |
                            <li class="item">
                                <router-link tag="a" to="/help/normal">帮助中心</router-link>
                            </li>
                            |
                            <li class="item">
                                <router-link tag="a" to="/proxyjoin">代理加盟</router-link>
                            </li>
                            |
                            <li class="item"><a href="javascript:;" @click="logoutHandle">退出</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="header-bottom">
            <div class="container">
                <div class="nav">
                    <div class="hot-lottery">热门彩种</div>
                    <ul class="nav-list">
                        <li class="item" v-for="(item, index) in menuList" :key="index">
                            <a v-if="item.other === '1'" :href="item.path">{{item.name}}</a>
                            <router-link :to="item.path" v-if="!item.other" tag="a">{{item.name}}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <user-modal :verifyCodeShouldReload="verifyCodeShouldReload"
                    :modal-type="modalType"
                    :mask='true'
                    :displayModal='displayModal'
                    @setReload="setReload"
                    @closeModal="closeModal"
                    @registerSubmitHandle="registerSubmitHandle"
                    @testPlaySubmitHandle="testPlaySubmitHandle">
        </user-modal>
    </div>
</template>

<script>
  import UserModal from '../../common/base/userModal/userModal'
  import {registerVerify, loginVerify} from "../../common/js/formverify/formverify"
  import navMenu from '../../common/config/navMenu'
  import {mapActions} from 'vuex';

  export default {
    name: "headers",
    props: {
      // logined: {
      //     type: Boolean,
      //     default: false
      // }
    },
    data() {
      return {
        displayModal: false,
        modalType: '',
        login_name: '',
        login_pwd: '',
        verifyCodeShouldReload: false,
        userInfo: '',
        logined: false,
        menuList: navMenu,
        defaultLightLoginBtn: false
      }
    },
    created() {
      var _this = this
      this._initPage()
      this.$bus.on("logout",()=>{
          _this.logoutHandle()
      })
    },
    methods: {
      ...mapActions(['REGISTER', 'LOGOUT', 'LOGIN', 'LOGIN_AS_TOURIST']),
      closeModal() {
        this.displayModal = false
      },
      registerHandle() {
        this.modalType = 'register';
        this.verifyCodeShouldReload = true;
        this.displayModal = true
      },
      testPlayHandle() {
        this.modalType = 'test_play';
        this.verifyCodeShouldReload = true;
        this.displayModal = true
      },
      loginHandle() {
        let username = this.login_name
        let password = this.login_pwd
        let data = {
          username, password
        };
        if (loginVerify(data)) {
          this.LOGIN({
            username: username,
            password: password
          }).then(res => {
            location.reload()
          });
        }
      },
      registerSubmitHandle(data) {
        if (registerVerify(data)) {
          this.REGISTER({
            username: data.register_name,
            password: data.register_pwd,
            invitation_code: data.invitation_code,
            real_name: data.register_realname,
            verify_code: data.register_code,
            verify_key: data.verifyToken
          })
            .then(res => {
              setTimeout(() => {
                location.reload()
              }, 1000)
            })
            .catch(err => {
              //this.verifyCodeShouldReload = true
            })
        }
      },
      testPlaySubmitHandle(data) {
        if (!data.textPlay_code) {
          this.$Message.info('请输入验证码');
          return
        }
        this.LOGIN_AS_TOURIST({
          verify_code: data.textPlay_code,
          verify_key: data.verifyToken
        })
          .then(res => {
            setTimeout(() => {
              location.reload()
            }, 1000)
          })
          .catch(err => {
            this.verifyCodeShouldReload = true
          })
      },
      setReload(bool) {
        this.verifyCodeShouldReload = bool
      },
      logoutHandle() {
        this.LOGOUT().then(res => {
          this.$router.push('/hall')
          this.logined = false
          setTimeout(() => {
            location.reload()
          }, 1000)
        })
      },
      _initPage() {
        if (this.$store.getters.token) {
          this.userInfo = this.$store.state.user.userInfo;
          this.logined = true;
        }
      }
    },
    components: {
      UserModal
    }
  }
</script>

<style scoped lang="scss">
    .headers {
        width: 100%;
        background-color: #ffffff;
        .header-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 64px;
            .logo {
                width: 243px;
                height: 29px;
                background: url("/static/images/logo.png") no-repeat left center;
                background-size: contain;
                color: $gradient-color;
            }
            .header-right {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-end;
                align-items: center;
                .input-group {
                    > input {
                        width: 128px;
                        height: 38px;
                        margin-right: 10px;
                        padding: 0 9px;
                        outline: none;
                        border: 1px solid $border-color-gary;
                        border-radius: 3px;
                        box-sizing: border-box;
                        font-size: $font-size-medium;
                        background-color: #fafbff;
                        vertical-align: middle;
                    }
                }
                .trial {
                    margin: 0 16px 0 6px;
                    font-size: $font-size-medium;
                    color: $theme-color;
                }
                .btn-group {
                    .btn {
                        width: 88px;
                        height: 38px;
                        line-height: 38px;
                        outline: none;
                        border-radius: 3px;
                        box-sizing: border-box;
                        font-size: 14px;
                        cursor: pointer;
                        vertical-align: middle;
                        border: 1px solid $theme-color;
                        margin-right: 10px;
                        background-color: #ffffff;
                        color: $theme-color;
                        transition: all .3s linear;
                        &.lightBg, &:hover {
                            border: 1px solid transparent;
                            background-color: $theme-color;
                            color: $color-white;
                        }
                    }
                }
            }
            .header-right-logined {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-end;
                align-items: center;
                .login-message {
                    margin-right: 11px;
                    font-size: 14px;
                    color: $color-dark;
                    span {
                        b {
                            color: #f61527;
                        }
                        &.name {
                            margin-right: 19px;
                        }
                    }
                }
                .list {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-end;
                    align-items: center;
                    .item {
                        margin: 0 8px;
                        a {
                            font-size: $font-size-medium;
                            color: $color-dark;
                            &:hover {
                                color: $theme-color;
                            }
                        }
                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
        .header-bottom {
            width: 100%;
            height: 40px;
            background: $gradient-color;
            .nav {
                display: flex;
                line-height: 40px;
                flex-flow: row nowrap;
                justify-content: start;
                align-items: center;
                .hot-lottery {
                    width: 220px;
                    height: 100%;
                    text-align: center;
                    font-size: $font-size-medium;
                    color: $color-white;
                }
                .nav-list {
                    .item {
                        display: inline-block;
                        a {
                            display: inline-block;
                            width: 128px;
                            height: 40px;
                            line-height: 40px;
                            text-align: center;
                            font-size: $font-size-medium;
                            color: $color-white;
                            transition: all .3s linear;
                            &:hover, &.router-link-active {
                                background-color: #E41727;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
