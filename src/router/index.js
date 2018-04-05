import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import App from "@/App"

const login = r => require.ensure([], () => r(require("@/views/login")), "login");
const qx_con = r => require.ensure([], () => r(require("@/views/qx_con")), "qx_con");

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      component:App,
      children:[
        {
          path: "qx-con",
          component: qx_con
        }
      ]
    },
    {
      path:"/login",
      component:login

    }
    
  ]
})
