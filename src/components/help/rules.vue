<template>
    <div class="agent-wrapper">
        <div class="agent-tab-box">
            <router-link class="item active" to="/help/rule/0">规则说明</router-link>
            <router-link class="item" to="/help/rule/1">游戏说明</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "rules"
    }
</script>

<style scoped lang="scss">
    .agent-wrapper {
        width: 100%;
        border: 1px solid $border-color-gary;
        border-radius: 5px;
        box-sizing: border-box;
        .agent-tab-box {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-end;
            width: 100%;
            height: 59px;
            padding: 0 28px;
            border-bottom: 1px solid $border-color-gary;
            .item {
                position: relative;
                top: 1px;
                height: 37px;
                margin-right: 68px;
                border-bottom: 1px solid $border-color-gary;
                font-size: 16px;
                font-weight: bold;
                color: $color-black;
                &:hover {
                    color: $color-theme;
                }
                &.router-link-active {
                    color: $color-theme;
                    border-bottom: 2px solid $color-theme;
                }
            }
        }
    }
</style>
