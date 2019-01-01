<template>
    <div id="app" v-if="finish">
        <Loading v-show="$store.state.app.loading"></Loading>
        <Headers></Headers>
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>
  import Headers from "./components/headers/headers";
  import Loading from "./common/base/loading/loading"
  import {mapActions} from 'vuex'

  export default {
    name: 'app',
    data() {
      return {
        finish: false
      }
    },
    created() {
      this._initPage()
    },
    methods: {
      ...mapActions(['GET_MEMBER_INFO']),
      _initPage() {
        if (!this.$store.getters.token) {
          // Message.error("请登录");
          this.finish = true
          // this.$router.push('/my/index')
          return
        }
        this.GET_MEMBER_INFO({type: 1}).then(res => {
          this.finish = true
        });
      }
    },
    components: {
      Headers, Loading
    }
  }
</script>

<style lang="scss">
    @import url('//at.alicdn.com/t/font_748304_9ifodxe837c.css');
    /*全局修改iview 弹出提示的颜色*/

    /*全局修改滚动条样式*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        background-color: #555;
    }

</style>
