import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import App from "@/App"

const login = r => require.ensure([], () => r(require("@/views/login")), "login");
const qx_con = r => require.ensure([], () => r(require("@/views/qx_con")), "qx_con");
const userManage = r => require.ensure([], () => r(require("@/views/userManage")), "userManage");
const categoryManage = r => require.ensure([], () => r(require("@/views/categoryManage")), "categoryManage");
const keywords = r => require.ensure([], () => r(require("@/views/keywords")), "keywords");
const articleManage= r => require.ensure([], () => r(require("@/views/articleManage")), "articleManage");
const articleList= r => require.ensure([], () => r(require("@/views/articleManage/articleList")), "articleList");
const newArticle= r => require.ensure([], () => r(require("@/views/articleManage/newArticle")), "newArticle");
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
        },
        {
          path:"userManage",
          component:userManage
        },
        {
          path:"categoryManage",
          component:categoryManage
        },
        {
          path:"keywords",
          component:keywords
        },
        {
          path:"articleManage",
          component:articleManage,
          children:[
            {
              path:"",
              component:articleList
            },
            {
              path:"newArticle",
              component:newArticle
            },
            
          ]
        }
      ]
    },
    {
      path:"/login",
      component:login

    }
    
  ]
})
