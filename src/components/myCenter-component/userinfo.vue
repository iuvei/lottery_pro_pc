<template>
    <div class="userInfo-wrapper">
        <div class="wrapper-title">
            <div class="text"><router-link to="/my/index" tag="span">资料消息 <i class="iconfont icon-jiantou"></i></router-link>个人信息设置</div>
            <div class="btn-group">
                <button type="button" class="btn btn-finish" @click="setInfo" v-if="isSet">完成</button>
                <button type="button" class="btn btn-set" @click="setInfo" v-if="!isSet">修改</button>
            </div>
        </div>
        <div class="info-content">
            <div class="info-group">
                <div class="text">头像</div>
                <div class="value-box text-left">
                    <div class="file-box">
                        <input id="files" type="file" class="file-input" @change="handleFileSelect">
                        <img :src="headImg" alt="" class="headImg">
                        <span class="text">点击上传头像</span>
                    </div>
                </div>
            </div>
            <div class="info-group">
                <div class="text">用户名</div>
                <div class="value-box">
                    <span class="text">{{username || '*'}}</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">昵称</div>
                <div class="value-box">
                    <div v-if="!isSet" class="text">{{nick_name ? nick_name : '设置您的昵称'}}</div>
                    <Input :maxlength="50" type="text" v-if="isSet" class="input" :placeholder="nick_name ? nick_name : '设置您的昵称'" v-model="nick_name" style="width: 200px"></Input>
                </div>
            </div>
            <div class="info-group">
                <div class="text">姓名</div>
                <div class="value-box">
                    <span class="text">{{real_name || '*'}}</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">性别</div>
                <div class="value-box">
                    <div v-if="!isSet" class="text">{{sex == '0'? '男' : '女'}}</div>
                    <Select v-if="isSet" v-model="sex" style="width: 200px">
                        <Option value="0" :key="0">男</Option>
                        <Option value="1" :key="1">女</Option>
                    </Select>
                </div>
            </div>
            <div class="info-group">
                <div class="text">生日</div>
                <div class="value-box">
                    <div v-if="!isSet" class="text">{{birthDay}}</div>
                    <DatePicker type="date" v-if="isSet" :value="birthDay" placeholder="设置您的生日" style="width: 200px" @on-change="setBirthday"></DatePicker>
                </div>
            </div>
            <div class="info-group">
                <div class="text">账户余额</div>
                <div class="value-box">
                    <span class="text text-red text-bold">{{accountBalance || '*'}}</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">会员返点</div>
                <div class="value-box">
                    <span class="text">{{userReturnPoint}}%</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">自身保留返点</div>
                <div class="value-box">
                    <div v-if="!isSet" class="text">{{selfReturnPoint}}%</div>
                    <Select v-if="isSet" v-model="selfReturnPoint" style="width: 200px">
                        <Option v-for="item in selfReturnPointList" :key="item" :value="item">{{item}}</Option>
                    </Select>
                </div>
            </div>
            <div class="info-group">
                <div class="text">上周投注</div>
                <div class="value-box">
                    <span class="text">{{lastWeekBet}}</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">本周投注</div>
                <div class="value-box">
                    <span class="text">{{ thisWeekBet }}</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">登录密码</div>
                <div class="value-box">
                    <span class="text text-red"  @click="setPwdHandle('password')">修改</span>
                </div>
            </div>
            <div class="info-group">
                <div class="text">提现密码</div>
                <div class="value-box">
                    <span class="text text-red"  @click="setPwdHandle('withdrawPassword')">修改</span>
                </div>
            </div>
        </div>
        <pwd-modal v-if="displayModal" :isSettingWithdrawPsd="isSettingWithdrawPsd" :modal-type="modalType" :mask='false' :displayModal='displayModal' @closeModal="closeModal" @passwordSubmit="passwordSubmit" @withdrawPasswordSubmit="withdrawPasswordSubmit"></pwd-modal>
    </div>
</template>

<script>
    import PwdModal from '../../common/base/passwordModal/pwdModal'
    import {numANDstring, number} from "../../common/js/formverify/base";
    import defaultHeadimg from '../../../public/static/images/user_default.png'
    import { mapActions } from 'vuex'

    export default {
        name: "userInfo",
        data() {
            return {
                isSet: false,
                username: '',
                nick_name: '',
                real_name: '',
                sex: "0",
                birthDay: "设置生日",
                accountBalance: '',
                userReturnPoint: '',
                selfReturnPoint: "设置自身保留返点",
                lastWeekBet: '',
                thisWeekBet: '',
                selfReturnPointList: '',
                isSettingWithdrawPsd: false,
                modalType: '',
                displayModal: false,
                userInfo: '',
                headImg: defaultHeadimg
            }
        },
        created() {
            this._initPage()
        },
        methods: {
            ...mapActions(['GET_REBATE_DATA', 'MODIFY_LOGIN_PWD', 'MODIFY_WITHDRAW_PWD', 'UPDATE_USERINFO']),
            setInfo() {
                if (this.isSet) {
                    this.UPDATE_USERINFO({
                        nick_name: this.nick_name,
                        sex: this.sex,
                        birthday: this.birthDay,
                        rebate_diff: this.selfReturnPoint
                    }).then(res => {
                        console.log(res);
                    })
                }
                this.isSet = !this.isSet
            },
            setBirthday(date) {
                this.birthDay = date
            },
            closeModal() {
                this.displayModal = false
            },
            setPwdHandle(type) {
                this.modalType = type;
                this.displayModal = true;
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
            passwordSubmit(data) {
                if (numANDstring(data.oldPwd, '原密码') && numANDstring(data.newPwd, '新密码')) {
                    if (data.newPwd === data.againPwd) {
                        this.MODIFY_LOGIN_PWD({
                            password: data.oldPwd,
                            new_password: data.newPwd
                        }).then(res => {
                            this.displayModal = false
                            //强制退出重新登录, 清空历史输入
                            this.logoutHandle();

                        })
                    } else {
                        this.$Message.error('两次输入密码不一致');
                    }
                }
            },
            withdrawPasswordSubmit(data) {
                if (number(data.againWDPwd, "提现密码") && number(data.newWDPwd, "提现密码")) {
                    if (data.newWDPwd === data.againWDPwd) {
                        this.MODIFY_WITHDRAW_PWD({
                            old_password: data.oldWDPwd,
                            withdraw_password: data.newWDPwd,
                            re_withdraw_password: data.againWDPwd
                        }).then(res => {
                            this.displayModal = false
                        })
                    } else {
                        this.$Message.error('两次输入密码不一致');
                    }
                }
            },
            handleFileSelect(evt) {
                let _this = this;
                let f = document.querySelector('#files').files[0]
                if (!f.type.match('image.*')) {
                    // Vue.$vux.toast.show('请上传图片格式文件')
                    return false
                }
                if (f.size > 524288) {
                    // Vue.$vux.toast.show('图片过大，请重新上传！')
                    return false
                }

                var reader = new FileReader()
                reader.onload = (function(theFile) {
                    return function(e) {
                        _this.headImg = reader.result
                    }
                })(f)
                reader.readAsDataURL(f)
            },
            _initDate(time) {
                let date = new Date(time * 1000);
                let month = String(date.getMonth() + 1).length > 1 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)
                let day = String(date.getDate()).length > 1 ? date.getDate() : "0" + date.getDate()
                return `${date.getFullYear()}-${month}-${day}`
            },
            _initForm(data) {
                this.username = data.username
                this.nick_name = data.nick_name
                this.real_name = data.real_name
                this.sex = data.sex
                this.birthDay = parseInt(data.birthday) ? this._initDate(data.birthday) : '*'
                this.accountBalance = data.balance
                this.userReturnPoint = data.rebate
                this.selfReturnPoint = data.rebate_diff
                this.lastWeekBet = data.bets_last_week
                this.thisWeekBet = data.bets_this_week
                this.isSettingWithdrawPsd = data.isset_withdraw_password
            },
            _initPage() {
                if (!this.$store.getters.token) {
                    return
                }
                this._initForm(this.$store.state.user.userInfo)
                this.GET_REBATE_DATA().then(res => {
                    this.selfReturnPointList = res.data.rebates
                })
            }
        },
        components: {
            PwdModal
        }
    }
</script>

<style lang="scss" scoped>
    .userInfo-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .wrapper-title {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 59px;
            padding: 0 30px 0 19px;
            border-bottom: 1px solid $border-color-gary;
            .text {
                font-size: $font-size-medium-x;
                color: $color-dark;
                span {
                    margin-right: 12px;
                    font-weight: bold;
                    color: $color-black;
                }
            }
            .btn-group {
                .btn {
                    width: 88px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 3px;
                    outline: none;
                    box-sizing: border-box;
                    text-align: center;
                    font-size: $font-size-medium-x;
                    &.btn-set {
                        border: 1px solid $border-color-gary;
                        color: $color-dark;
                    }
                    &.btn-finish {
                        border: 1px solid $color-theme;
                        color: $color-theme;
                    }
                }
            }
        }
        .info-content {
            width: 100%;
            padding: 0 28px;
            .info-group {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                padding: 15px 0 14px;
                border-bottom: 1px solid $border-color-gary;
                >.text {
                    flex: 0 0 107px;
                    width: 107px;
                    line-height: 1.2;
                    border-right: 1px solid $border-color-gary;
                    font-size: $font-size-medium;
                    color: $color-dark;
                }
                .value-box {
                    margin-left: 50px;
                    flex: 1;
                    text-align: right;
                    &.text-left {
                        text-align: left;
                    }
                    .file-box {
                        position: relative;
                        display: inline-block;
                        .file-input {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            left: 0;
                            top: 0;
                            opacity: 0;
                        }
                        .headImg {
                            width: 75px;
                            height: 75px;
                            margin-right: 14px;
                            vertical-align: middle;
                        }
                        .text {
                            font-size: $font-size-small-s;
                            color: $color-gary;
                            vertical-align: middle;
                        }
                    }
                    .input {
                        width: 100%;
                        border: none;
                        text-align: right;
                        font-size: $font-size-medium;
                        color: $color-black;
                    }
                    .text {
                        display: inline-block;
                        text-align: right;
                        font-size: $font-size-medium;
                        color: $color-black;
                        &.text-red {
                            color: $color-theme;
                            cursor: pointer;
                        }
                        &.text-bold {
                            font-weight: bold;
                        }
                    }
                    .menu-text {
                        font-size: $font-size-medium;
                        color: $color-black;
                    }
                }
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }

</style>
