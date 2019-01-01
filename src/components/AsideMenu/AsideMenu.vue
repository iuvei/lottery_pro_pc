<template>
    <div class="myCenter-aside">
        <div class="aside-nav">
            <div class="first-level-menu" v-for="(item, index) in menuList" :key="item.name">
                <router-link :class="activeIndex !== '' && activeIndex === index ? 'router-link-active':''" class="title" :to="item.path">{{item.name}}</router-link>
                <div class="second-level-menu" v-if="item.children">
                    <router-link v-for="(item2, index) in item.children" :key="index" class="item" :to="item2.path">
                        {{item2.name}}
                    </router-link>
                </div>
            </div>
        </div>
        <div class="aside-QR">
            <div class="qr"></div>
            <div class="text">万游彩票APP手机版</div>
            <div class="text2">专业·安全·保障</div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "myCenter-aside",
    props: {
      menuList: {
        type: Array,
        default: function () {
          return []
        }
      },
      activeIndex: {}
    }
  }
</script>

<style scoped lang="scss">
    .myCenter-aside {
        width: 220px;
        margin-right: 20px;
        .aside-nav {
            width: 100%;
            padding: 19px 18px 19px 0;
            margin-bottom: 10px;
            border: 1px solid $border-color-gary;
            border-radius: 5px;
            background-color: $color-white;
            .first-level-menu {
                .title.router-link-active {
                    border-left: 4px solid $color-theme;
                    color: $color-theme;
                }
                .title {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    height: 34px;
                    line-height: 1;
                    padding-left: 17px;
                    border-left: 4px solid transparent;
                    font-size: $font-size-medium-x;
                    font-weight: bold;
                    color: $color-black;
                    &:hover {
                        color: $color-theme;
                    }
                }
                .second-level-menu {
                    display: flex;
                    flex-flow: column nowrap;
                    padding-top: 12px;
                    margin-bottom: 5px;
                    padding-left: 21px;
                    .item {
                        display: inline-block;
                        position: relative;
                        margin-bottom: 22px;
                        line-height: 1;
                        font-size: $font-size-medium;
                        color: $color-dark;
                        &:hover {
                            color: $color-black;
                        }
                        &:after {
                            position: absolute;
                            content: '';
                            top: 50%;
                            right: 0;
                            transform: translateY(-50%);
                            width: 9px;
                            height: 9px;
                            background: url("../../../public/static/images/menu-arrow-right.png") no-repeat right center;
                            background-size: contain;
                        }
                    }
                }
            }
        }
        .aside-QR {
            width: 100%;
            padding: 25px 20px 22px;
            border: 1px solid $border-color-gary;
            border-radius: 5px;
            text-align: center;
            background-color: $color-white;
            .qr {
                width: 104px;
                height: 104px;
                margin-bottom: 24px;
            }
            .text {
                margin-bottom: 10px;
                font-size: $font-size-medium-x;
                font-weight: bold;
                color: $color-black;
            }
            .text2 {
                font-size: $font-size-medium;
                color: $color-theme;
            }
        }
    }
</style>
