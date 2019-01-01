<template>
    <div class="userList-wrapper">
        <table class="table">
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>余额</th>
                    <th>奖金</th>
                    <th>返点</th>
                    <th>注册时间</th>
                    <th>备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in userList">
                    <td><span class="icon"
                              :class="item.is_agent == '1'?'icon-agent':'icon-vip'"></span>{{item.username}}</td>
                    <td>￥{{item.balance}}</td>
                    <td>{{item.bonus}}</td>
                    <td>{{item.rebate}}%</td>
                    <td>{{formatTime(item.create_time * 1000)}}</td>
                    <td><router-link :to="`/my/user/detail?id=${item.id}`" tag="button" class="detail-btn">查看详情</router-link></td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <Page :current="nowPage" :total="totalRows" :page-size="pageTotal" show-elevator style="font-size: 12px" @on-change="setPageIndex"/>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import {getYYYY_MM_HH} from "../../../common/js/date";

    export default {
        name: "userList",
        data() {
            return {
                userList: [],
                totalRows: 0,
                nowPage: 1,
                pageTotal: 10
            }
        },
        created() {
            this._initPage()
        },
        methods: {
            ...mapActions(['GET_SUB_AGENT_LIST']),
            formatTime(date) {
                return getYYYY_MM_HH(date);
            },
            getOrderList(pageIndex = 1) {
                this.GET_SUB_AGENT_LIST({
                    rows: this.pageTotal,
                    page: pageIndex
                }).then(res => {
                    if (res.data) {
                      this.totalRows = res.data.total_rows;
                      this.userList = res.data.users;
                    }
                })
            },
            setPageIndex(index) {
                this.linkToPage(index);
            },
            linkToPage(index) {
                this.nowPage = index;
                this.getOrderList(index);
            },
            _initPage() {
                this.linkToPage(1);
            }
        }
    }
</script>

<style scoped lang="scss">
    .userList-wrapper {
        padding: 20px 28px;
        .table {
            width: 100%;
            margin-bottom: 130px;
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
                    td {
                        &:first-child {
                            padding-left: 20px;
                            text-align: left;
                            font-size: $font-size-small;
                            color: $color-dark;
                            .icon {
                                display: inline-block;
                                width: 40px;
                                height: 18px;
                                margin-right: 10px;
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
                            font-weight: bold;
                            color: $color-theme;
                        }
                        &:nth-child(3) {
                            font-size: $font-size-small;
                            font-weight: bold;
                            color: $color-theme;
                        }
                        &:nth-child(4) {
                            font-size: $font-size-small;
                            font-weight: bold;
                            color: $color-theme;
                        }
                        &:nth-child(5) {
                            font-size: $font-size-small-s;
                            color: $color-dark;
                        }
                        &:last-child {
                            .detail-btn {
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
                    }
                }
            }
        }
        .pagination {
            text-align: right;
        }
    }
</style>
