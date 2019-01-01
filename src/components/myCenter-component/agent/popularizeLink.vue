<template>
    <div class="popularizeLink-wrapper">
        <div class="pay-tab">
            <span class="item online" @click="switchTab(1)" :class="switchTxt === 1? 'active' :''">代理</span>
            <span class="item outline" @click="switchTab(0)" :class="switchTxt === 0? 'active' :''">会员</span>
        </div>
        <div class="content-one">
            <div class="submit-group">
                <div class="input-group">
                    <div class="text">当前返点:</div>
                    <span class="num">{{defaultPoint}}%</span>
                </div>
                <div class="input-group select-box">
                    <div class="text">下级返点:</div>
                    <Select class="select" v-model="point">
                        <Option v-for="item in pointList" :value="item" :key="item">{{ item }}%</Option>
                    </Select>
                </div>
                <div class="btn-group">
                    <button class="submit-btn" @click="pointConfigHandle">一键设置</button>
                </div>
                <div class="tips" @click="showTips = true">操作说明</div>
                <Modal v-model="showTips" width="360">
                    <p slot="header" style="color:#f30c1e;text-align:center">
                        <Icon type="md-help-circle"></Icon>
                        <span>操作说明</span>
                    </p>
                    <div style="text-align:left">
                        <p>1.一键返点设置完成后,页面下方将会显示自主注册链接地址,请注意链接地址会不定期的进行更新</p>
                        <p>2.下级返点为给下级设置的返点比例</p>
                    </div>
                    <div slot="footer">
                        <Button type="error" size="large" long :loading="modal_loading" @click="showTips = false">确定</Button>
                    </div>
                </Modal>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>用户类型</th>
                        <th>返点</th>
                        <th>链接</th>
                        <th>复制</th>
                        <th>删除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="userList" v-for="item in userList" :key="item.id">
                        <td>
                            <span class="icon" :class="item.type == '1'?'icon-agent':'icon-vip'"></span>
                        </td>
                        <td>{{item.rebate}}%</td>
                        <td>{{domain + '?code=' + item.code + "&type="+item.type}}</td>
                        <td><button class="copy-btn" @click="copyUrl(item.code,item.type)">复制</button></td>
                        <td><span class="iconfont icon-lajitong" @click="delItem(item.id)"></span></td>
                    </tr>
                    <tr v-if="!userList" class="no-data">
                        <td colspan="5">暂无数据</td>
                    </tr>
                </tbody>
            </table>
            <!--<Table width="550" height="200" border :columns="userColumns" :data="userList"></Table>-->
            <div class="pagination">
                <Page :current="nowPage" :total="totalRows" :page-size="pageTotal" show-elevator style="font-size: 12px" @on-change="setPageIndex"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { Message } from 'iview'

    export default {
        name: "popularizeLink",
        data() {
            return {
                switchTxt: 1,
                defaultPoint: '',
                point: '',
                pointList: [],
                userList: [],
                userInfo: '',
                domain: '',
                showTips: false,
                totalRows: 0,
                nowPage: 1,
                pageTotal: 10
            }
        },
        created() {
            this._initPage()
        },
        methods: {
            ...mapActions(['GET_PROMOTION_INFO', 'SET_PROMOTION_INFO', 'DELETE_PROMOTION_INFO']),
            switchTab(name) {
                if (this.switchTxt === name) {
                    return
                }
                this.point = '';
                this.switchTxt = name;
            },
            pointConfigHandle() {
                if (this.point) {
                    this.SET_PROMOTION_INFO({
                        type: this.switchTxt,
                        rebate: this.point
                    }).then(res => {
                        this.userList = res.data.promotions;
                        this.domain = res.data.promotion_domain;
                    })
                }

            },
            delItem(id) {
                this.DELETE_PROMOTION_INFO({id: id}).then(res => {
                    this.userList = res.data.promotions;
                    this.domain = res.data.promotion_domain;
                })
            },
            copyUrl(code, type) {
                let url = this.domain + '?code=' + code + "&type="+type;
                this.$copyText(url).then(function (e) {
                    Message.success("复制成功")
                }, function (e) {
                    Message.error("复制失败")
                })
            },
            getUsetList(pageIndex = 1) {
                this.GET_PROMOTION_INFO({
                    rows: this.pageTotal,
                    page: pageIndex
                }).then(res => {
                    this.userList = res.data.promotions;
                    this.domain = res.data.promotion_domain;
                    this.totalRows = res.data.total_rows;
                    this.pageTotal = res.data.rows;
                });
            },
            setPageIndex(index) {
                this.linkToPage(index);
            },
            linkToPage(index) {
                this.nowPage = index;
                this.getUsetList(index);
            },
            _initPage() {
                this.linkToPage(1)
                this.pointList = this.$store.state.user.userInfo.rebates
                this.defaultPoint = this.$store.state.user.userInfo.rebate
            }
        }
    }
</script>

<style scoped lang="scss">
    .popularizeLink-wrapper {
        padding: 20px 28px;
        min-height: 500px;
        .pay-tab {
            border-bottom: 1px solid $theme-color;
            margin-bottom: 22px;
            .item {
                display: inline-block;
                width: 88px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
                font-size: $font-size-medium;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                background-color: #ebecf3;
                color: $color-black;
                &.active {
                    background-color: $theme-color;
                    color: $color-white;
                }
            }
        }
        .content-one {
            margin-top: 25px;
            .submit-group {
                width: 300px;
                margin: 0 auto 42px;
                .input-group {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    margin-bottom: 13px;
                    &.select-box {
                        margin-bottom: 40px;
                    }
                    .text {
                        flex: 0 0 105px;
                        font-size: $font-size-medium;
                        color: $color-dark;
                    }
                    .num {
                        flex: 1;
                        margin-left: 8px;
                        font-size: $font-size-medium;
                        color: $color-theme;
                        vertical-align: middle;
                    }
                    .select {
                        flex: 1;
                        margin-left: 8px;
                    }
                }
                .btn-group {
                    margin-bottom: 16px;
                    text-align: center;
                    .submit-btn {
                        @include button-submit-base()
                    }
                }
                .tips {
                    text-align: center;
                    font-size: $font-size-small;
                    color: $color-theme;
                    cursor: pointer;
                }
            }
            .table {
                width: 100%;
                text-align: center;
                tr th,  tr td { border:1px solid $border-color-gary; }
                thead {
                    tr {
                        height: 37px;
                        line-height: 37px;
                        background-color: #fafbff;
                        th {
                            font-size: $font-size-medium-x;
                            color: $color-dark;
                        }
                    }
                }
                tbody {
                    tr {
                        height: 37px;
                        line-height: 37px;
                        &.no-data{
                            @include noData()
                        }
                        td {
                            &:first-child {
                                .icon {
                                    display: inline-block;
                                    width: 40px;
                                    height: 18px;
                                    vertical-align: middle;
                                    &.icon-agent {
                                        background: url("../../../../public/static/images/agent-icon.png") no-repeat center center;
                                        background-size: contain;
                                    }
                                    &.icon-vip {
                                        background: url("../../../../public/static/images/vip-icon.png") no-repeat center center;
                                        background-size: contain;
                                    }
                                }
                            }
                            &:nth-child(2) {
                                font-size: $font-size-small;
                                color: $color-theme;
                            }
                            &:nth-child(3) {
                                font-size: $font-size-medium;
                                color: $color-dark;
                            }
                            &:nth-child(4) {
                                .copy-btn {
                                    width: 88px;
                                    height: 30px;
                                    line-height: 30px;
                                    border: 1px solid $color-theme;
                                    border-radius: 15px;
                                    font-size: $font-size-small;
                                    color: $color-theme;
                                    background-color: #ffffff;
                                    transition: all 0.3s ease-in-out;
                                    &:hover {
                                        border: 1px solid transparent;
                                        color: $color-white;
                                        background-color: $theme-color;
                                    }
                                }
                            }
                            &:last-child .iconfont {
                                font-size: 24px;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
            .pagination {
                margin-top: 25px;
                text-align: right;
            }
        }

    }
</style>
