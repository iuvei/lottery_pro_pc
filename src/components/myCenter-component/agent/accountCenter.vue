<template>
    <div class="accountCenter-wrapper">
        <div class="input-group">
            <div class="text">开户类型</div>
            <div class="content right">
                <i-switch v-model="accountType" size="large">
                    <span slot="open">代理</span>
                    <span slot="close">会员</span>
                </i-switch>
            </div>
        </div>
        <div class="input-group">
            <div class="text">用户名<span class="must">*</span></div>
            <div class="content right">
                <div class="account-group">
                    <input class="input" v-model="account" placeholder="请输入用户名" maxlength="50"/>
                </div>
            </div>
        </div>
        <div class="input-group">
            <div class="text">登录密码<span class="must">*</span></div>
            <div class="content right">
                <div class="pwd-group">
                    <input class="input" :type="pwdOpen?'text':'password'" v-model="password" placeholder="请输入登录密码"/>
                    <span class="iconfont" :class="pwdOpen?'icon-eye':'icon-eye1'" @click="togglePwdStatus"></span>
                </div>
            </div>
        </div>
        <div class="input-group" v-if="userInfo.rebate">
            <div class="text">返点设置</div>
            <div class="content right">
                <Select v-model="point" style="width:200px" :placeholder="`请设置不超过${userInfo.rebate}%的返点`">
                    <Option v-for="item in pointList" :value="item" :key="item">{{ item }}%</Option>
                </Select>
            </div>
        </div>
        <div class="input-group">
            <div class="text">真实姓名<span class="must">*</span></div>
            <div class="content realname">
                <input class="input" v-model="real_name" placeholder="请输入真实姓名" maxlength="50"/>
            </div>
        </div>
        <div class="input-group">
            <div class="text">昵称</div>
            <div class="content">
                <input class="input" v-model="nickname" placeholder="请输入账户昵称"/>
            </div>
        </div>
        <div class="input-group">
            <div class="text">手机号码</div>
            <div class="content">
                <input class="input" v-model="phone" placeholder="请输入手机号码"/>
            </div>
        </div>
        <div class="input-group">
            <div class="text">QQ号码</div>
            <div class="content">
                <input class="input" v-model="qq" placeholder="请输入QQ号码"/>
            </div>
        </div>
        <div class="input-group">
            <div class="text">个人邮箱</div>
            <div class="content">
                <input class="input" v-model="email" placeholder="请输入个人邮箱"/>
            </div>
        </div>
        <div class="submit-group">
            <button type="button" class="submit-btn" @click="accountSubmitHandle()">执行开户</button>
            <div class="invote-box">
                <div class="code">您的邀请码<span class="num">{{userInfo.invitation_code}}</span></div>
                <button class="copy-btn" @click="copyBtn">复制</button>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {Message} from 'iview'
  import {numORstring, numANDstring} from "../../../common/js/formverify/base";

  export default {
    name: "accountCenter",
    data() {
      return {
        accountType: true,
        account: '',
        password: '',
        point: '',
        nickname: '',
        real_name: '',
        phone: '',
        qq: '',
        email: '',
        pointList: [],
        pwdOpen: false,
        userInfo: ''
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['AGENT_ADD_MEMBER']),
      togglePwdStatus() {
        this.pwdOpen = !this.pwdOpen
      },
      test() {
        if (!numORstring(this.account, '用户名')) {
          return false
        }
        if (!numANDstring(this.password, '密码')) {
          return false
        }
        if (!this.point) {
          Message.error("请设置返点")
          return false
        }
        if (!this.real_name) {
          Message.error("请输入真实姓名")
          return false
        }
        return true
      },
      accountSubmitHandle() {
        if (!this.test()) {
          return
        }
        this.AGENT_ADD_MEMBER({
          is_agent: this.accountType ? '1' : '0',
          username: this.account,
          password: this.password,
          rebate: this.point.split("%")[0] || "0",
          real_name: this.real_name,
          nick_name: this.nick_name,
          qq: this.qq,
          email: this.email,
          mobile: this.phone
        }).then(res => {
          setTimeout(() => {
            this.$router.push('/my/agent/2')
          }, 1500);
        });
      },
      copyBtn() {
        this.$copyText(this.userInfo.invitation_code).then(function (e) {
          Message.success("复制成功")
        }, function (e) {
          Message.error("复制失败")
        })
      },
      _initSelfReturnPoint() {
        let point = 0.0;
        while (point <= parseFloat(this.userInfo.rebate)) {
          this.pointList.push(point.toFixed(1))
          point += 0.1;
        }
      },
      _initPage() {
        this.userInfo = this.$store.state.user.userInfo;
        this._initSelfReturnPoint();
      }
    }
  }
</script>

<style scoped lang="scss">
    .accountCenter-wrapper {
        padding: 20px 25px 46px;
        .input-group {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 45px;
            border-bottom: 1px solid $border-color-gary;
            .text {
                flex: 0 0 77px;
                padding-left: 2px;
                border-right: 2px solid $border-color-gary;
                font-size: $font-size-medium;
                color: $color-black;
                .must {
                    margin-left: 3px;
                    color: #da1d1d;
                }
            }
            .content {
                flex: 1;
                padding: 0 20px 0 18px;
                &.right {
                    text-align: left;
                    .input {
                        text-align: left;
                    }
                }
                > .input {
                    width: 100%;
                    border: none;
                    font-size: $font-size-medium;
                    color: $color-black;
                }
                .ivu-select-selection {
                    border: none;
                }
                .account-group, .pwd-group {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    .input {
                        flex: 1;
                        border: none;
                        font-size: $font-size-medium;
                        color: $color-black;
                    }
                    .iconfont {
                        margin-left: 10px;
                    }
                    .must {
                        margin-left: 9px;
                        color: #da1d1d;
                    }
                }
            }
        }
        .submit-group {
            width: 218px;
            margin: 40px auto 0;
            .submit-btn {
                margin-bottom: 20px;
                @include button-submit-base()
            }
            .invote-box {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                .code {
                    margin-right: 10px;
                    font-size: $font-size-medium;
                    color: $color-black;
                    .num {
                        margin-left: 10px;
                        color: #fd3d4c;
                    }
                }
                .copy-btn {
                    width: 68px;
                    height: 30px;
                    line-height: 30px;
                    border: 1px solid $color-theme;
                    border-radius: 15px;
                    font-size: $font-size-medium;
                    color: $color-theme;
                    background-color: #ffffff;
                    transition: all .3s linear;
                    &:hover {
                        border: 1px solid transparent;
                        color: $color-white;
                        background-color: $theme-color;
                    }
                }
            }
        }
    }
</style>
