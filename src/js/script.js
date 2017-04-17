/**
 * Created by Afaci on 27/03/2017.
 */
import Vue from "vueCommon";
import App from "./app.vue";
import Store from "./store";
import Vuex from "vuex";
import VueRouter from "vue-router";
import List from './list.vue';
import About from './about.vue';
import Map from './map.vue';
import Contribute from './contribute.vue';



// ...
// at some point require vue-openlayers TODO: simplify to require("vue-openlayers")
// ...
// then install the plugin


Vue.use(Vuex);
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: List
        },
        {
            path: '/about',
            component: About
        },
        {
            path: '/map',
            component: Map
        },
        {
            path: '/secure/contribute',
            component: Contribute
        }
    ]
});

Vue.component('modal', {
    template: '#modal-template'
});

new Vue({
    el: "#app",
    router: router,
    store: new Vuex.Store(Store),
    components: {
        App
    },
    template: '<app></app>'
});