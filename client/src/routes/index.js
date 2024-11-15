import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            alias: ['/home', '/homePage', '/trang-chu'],
            component: ()=>  import(/* webpackChunkName: "home" */"@/views/user/Home.vue"),
            name: 'home'
        },
        {
            path: '/cart',
            component: ()=>  import(/* webpackChunkName: "cart" */"@/views/user/Cart.vue"),
            name: 'cart'
        },
        {
            path: '/card/:id',
            component: ()=>  import(/* webpackChunkName: "card" */"@/views/user/Card.vue"),
            name: 'card'
        },
        {
            path: '/login',
            component: ()=>  import(/* webpackChunkName: "login" */"@/views/user/Login.vue"),
            beforeEnter: ((to, from, next )=> {{
                const userLogin = JSON.parse(localStorage.getItem("userLogin")) || {}
                console.log(userLogin);
                
                if (userLogin && to.path === "/login" && userLogin?.role){
                    next("/admin")
                } else {
                    next()
                }
            }}),
            name: 'login'
        },
        {
            path: '/myLike',
            component: ()=>  import(/* webpackChunkName: "myLike" */"@/views/user/MyLike.vue"),
            name: 'myLike'
        },
        {
            path: '/myOrder',
            component: ()=>  import(/* webpackChunkName: "myOrder" */"@/views/user/MyOrder.vue"),
            name: 'myOrder'
        },
        {
            path: '/pay',
            component: ()=>  import(/* webpackChunkName: "pay" */"@/views/user/Pay.vue"),
            name: 'pay'
        },
        {
            path: '/profile',
            component: ()=>  import(/* webpackChunkName: "profile" */"@/views/user/Profile.vue"),
            name: 'profile'
        },
        {
            path: '/register',
            component: ()=>  import(/* webpackChunkName: "register" */"@/views/user/Register.vue"),
            name: 'register'
        },
        {
            path: '/test',
            component: ()=>  import(/* webpackChunkName: "test" */"@/views/user/Test.vue"),
            name: 'test'
        },
        {
            path: '/admin',
            redirect: '/admin/dashboard',
            component: ()=>  import(/* webpackChunkName: "dashboard" */"@/layouts/admin/AdminLayout.vue"),
            beforeEnter: ((to, from, next )=> {                
                
                const userLogin = JSON.parse(localStorage.getItem("userLogin")) || {}
                if (  userLogin?.role){
                    next()
                }  else {
                    next("/login")
                }
            }),
            children: [
                {
                    path: "dashboard",
                    component: ()=>  import(/* webpackChunkName: "orders" */"@/views/admin/Dashboard.vue"),
                    name: 'dashboard'
                },
                {
                    path: 'orders',
                    component: ()=>  import(/* webpackChunkName: "orders" */"@/views/admin/Orders.vue"),
                    name: 'orders'
                },
                {
                    path: 'category',
                    component: ()=>  import(/* webpackChunkName: "category" */"@/views/admin/Category.vue"),
                    name: 'category'
                },
                {
                    path: 'customer',
                    component: ()=>  import(/* webpackChunkName: "customer" */"@/views/admin/Customer.vue"),
                    name: 'customer'
                },
                {
                    path: 'products',
                    component: ()=>  import(/* webpackChunkName: "products" */"@/views/admin/Products.vue"),
                    name: 'products'
                },
                {
                    path: 'setting',
                    component: ()=>  import(/* webpackChunkName: "setting" */"@/views/admin/Setting.vue"),
                    name: 'setting'
                },
            ]
        },
        // {
        //     path: '/user/:id',
        //     component: User,
        //     name: 'user',
        //     redirect: (to) => `/profile/${to.params.id}`
        // },
        // {
        //     path: '/profile/:id',
        //     component: Profile,
        //     name: 'profile'  
        // }
    ]
})

export default router;