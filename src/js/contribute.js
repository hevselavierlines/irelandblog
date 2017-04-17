/**
 * Created by Afaci on 27/03/2017.
 */
import Vue from "vueCommon";
import Contribute from './contribute.vue';

// ...
// at some point require vue-openlayers TODO: simplify to require("vue-openlayers")
// ...
// then install the plugin

new Vue({
    el: "#app",
    components: {
        Contribute
    },
    template: '<contribute></contribute>'
});