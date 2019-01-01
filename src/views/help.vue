<template>
    <div class="help-wrapper">
        <div class="container">
            <div class="content" ref="wrapper">
                <help-aside v-if="helpMenu" :menuList="helpMenu"></help-aside>
                <div class="content-right">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
  import helpList from '../common/config/help/helpMenu'
  import Footers from '../components/footers/footers';
  import HelpAside from '../components/AsideMenu/AsideMenu'
  import { getContentHeight } from "../common/js/common";

  export default {
    name: "help",
    created() {
      this._initPage()
    },
    data() {
      return {
        helpMenu: helpList
      }
    },
    methods: {
      _initPage() {
        this.$nextTick(() => {
          let contentHeight = getContentHeight()
          this.$refs.wrapper.style.minHeight = contentHeight + 'px'
        })
      }
    },
    components: {
      Footers, HelpAside
    }
  }
</script>

<style scoped lang="scss">
    .help-wrapper {
        .content {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 20px 0;
            .content-right {
                flex: 1;
                background-color: $color-white;
            }
        }
    }
</style>
