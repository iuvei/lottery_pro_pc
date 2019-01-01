<template>
    <div>
        <div class="lotteryNotice-wrapper" ref="wrapper">
            <div class="container">
                <div class="first-tab-meun">
                    <router-link to="/notice/all"  class="first-tab-item" :class="switchId === 'all'? 'active' :''">全部</router-link>
                    <router-link :to="`/notice/${item.type}`" class="first-tab-item" :class="switchId === item.type? 'active' :''" v-for="item in gameList" :key="item.type">{{item.name}}</router-link>
                </div>
                <div class="second-tab-menu">
                    <router-link :to="`/notice/${switchId}/${item.game_code}`"  class="second-tab-item" :class="secondSwitchId ===item.game_code?'selected':''" v-for="item in gameTypeList" :key="item.game_code">{{item.name}}</router-link>
                </div>
                <div class="gameLog-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import {getContentHeight} from "../../../common/js/common";
    import Footers from '../../../components/footers/footers'

    export default {
        name: "lotteryNotice",
        data() {
            return {
                switchId: 'all',
                secondSwitchId: '',
                gameList: [],
                gameTypeList: []
            }
        },
        created(){
            this._initPage()
        },
        methods: {
            ...mapActions(['GET_GAME_LIST']),
            _getGameList() {
                let gameInfo = this.$store.state.game.gameInfo;
                this.gameList = gameInfo;
                if (this.switchId === 'all') {
                    gameInfo.map(item => {
                        this.gameTypeList.push(...item.includes.map(item1 => {
                            return {
                                name: item1.name,
                                game_code: item1.game_code
                            }
                        }))
                    });
                } else {
                    let data = gameInfo.filter(item => {
                        return item.type === this.switchId
                    })
                    this.gameTypeList = data[0].includes
                }
            },
            _initPage() {
                this.$nextTick(() => {
                    let contentHeight = getContentHeight()
                    this.$refs.wrapper.style.minHeight = contentHeight + 'px'
                })
                this.switchId = this.$route.params.type ? this.$route.params.type : this.switchId;
                this.secondSwitchId = this.$route.params.code
                this._getGameList()
            }
        },
        components: {
            Footers
        }
    }
</script>

<style scoped lang="scss">
    .lotteryNotice-wrapper {
        background-color: #ffffff;
        .first-tab-meun {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            margin-top: 10px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            border: 1px solid $border-color-gary;
            border-bottom: 1px solid $theme-color;
            background-color: #f8f9fd;
            .first-tab-item {
                display: inline-block;
                /*width: 90px;*/
                height: 33px;
                line-height: 33px;
                padding: 0 25px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-black;
                &:first-child {
                    border-top-left-radius: 5px;
                }
                &.active, &:hover {
                    color: $color-white;
                    background-color: $theme-color;
                }
            }
        }
        .second-tab-menu {
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            border-bottom: 1px solid $border-color-gary;
            padding: 5px 6px;
            .second-tab-item {
                display: inline-block;
                height: 24px;
                line-height: 24px;
                margin-right: 16px;
                padding: 0 10px;
                border: 1px solid transparent;
                border-radius: 3px;
                text-align: center;
                font-size: $font-size-small;
                color: $color-black;
                &:hover {
                    color: $color-theme;
                }
                &.selected {
                    border: 1px solid $color-theme;
                    color: $color-theme;
                }
            }
        }
        .gameLog-content {
            width: 100%;
            padding: 20px 0 35px;
        }
    }

</style>
