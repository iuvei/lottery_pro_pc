<template>
    <div class="agent-wrapper">
        <div class="agent-tab-box">
            <router-link class="item active" to="/my/agent/0">开户中心</router-link>
            <router-link class="item" to="/my/agent/1">推广链接</router-link>
            <router-link class="item" to="/my/agent/2">用户列表</router-link>
            <router-link class="item" to="/my/agent/3">团队报表</router-link>
            <router-link class="item" to="/my/agent/4">日工资</router-link>
            <router-link class="item" to="/my/agent/5">分红</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "agent"
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
