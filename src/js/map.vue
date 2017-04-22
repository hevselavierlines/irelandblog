<!-- ol-map.vue -->
<template>
    <div>
        <div id="themap">
        </div>
        <script type="text/x-template" id="modal-template">
            <transition name="blogbox">
                <div class="blogbox-mask">
                    <div class="blogbox-wrapper">
                        <div class="blogbox-hidden" @click="$emit('close')"></div>
                        <button class="btn btn-default buttonclose" @click="$emit('close')">X</button>
                        <div class="blogbox-container" id="modul-container">
                            <div class="blogbox-header">
                                <slot name="header">
                                </slot>
                            </div>

                            <div class="blogbox-body">
                                <slot name="text">
                                </slot>
                                <hr/>
                                <slot name="images">
                                </slot>
                            </div>
                        </div>

                    </div>
                </div>
            </transition>
        </script>
        <modal v-if="selection" @close="selection = null">
            <h3 slot="header">
                {{selection.title}}
            </h3>
            <p slot="text" align="justify" v-html="selection.message"></p>
            <div slot="images" class="row">
                <div class="col-md-4 blogimage" v-for="(image, index) in selection.images">
                    <img class="img-rounded" v-bind:src="image" width="100%">
                </div>
            </div>
        </modal>
    </div>
    <!-- template for the blogbox component -->

</template>

<script>
    import ol from "openlayers";
    import firebase from "./firebase";
    var outsidemap;
    export default  {
        name: "OLMap",
        props: {
            autoCenter: Boolean,
            center: {
                type: Array,
                default: () => {
                    return [-7.933565, 53.473896];
                }
            }
        },
        data: function() {
            return {
                centre: ol.proj.fromLonLat([-7.933565, 53.473896]),
                zoom: 6.7,
                showblogbox: false,
                selection: null
            }
        },
        methods: {
            nothing: function() {

            }
        },

        mounted() {
            this.olmap = new ol.Map({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                target: document.getElementById('themap'),
                view: new ol.View({
                    center: this.centre,
                    zoom: this.zoom
                })
            });
            outsidemap = this.olmap;
            var map = this.olmap;

            var vectorSource = new ol.source.Vector({
                //create empty vector
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon( ({
                    anchor: [0.5, 25],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: '../img/shamrock_small.png'
                }))
            });

            var vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: iconStyle,
            });

            this.olmap.addLayer(vectorLayer);

            this.olmap.on("click", (ev) => {
                const feature = this.olmap.forEachFeatureAtPixel(ev.pixel, (feature) => feature);
                if (feature) {
                    this.selection = feature.O.data;
                    console.log(this.selection);
                    this.showblogbox = true;
                }
            });

            firebase.auth().signInAnonymously().catch(function(error) {
                console.error(error.message);
            }).then(() => {
                window.dispatchEvent(new Event('resize'));
                var index = 0;
                firebase.database().ref('blogs').on('value', (snapshot) =>{
                    snapshot.forEach((childSnapshot) => {
                        var elem = childSnapshot.val();
                        if(
                            elem != null && elem !== undefined
                            && elem.lon != null && elem.lon !== undefined
                            && elem.lat != null && elem.lat !== undefined
                            && (elem.lon < 0.0001 || elem.lon > 0.0001)
                            && (elem.lat < 0.0001 || elem.lat > 0.0001)) {
                                elem.message = elem.message.replace( new RegExp( "\n", "g" ),'<br/>');
                                vectorSource.addFeature(new ol.Feature({
                                    geometry: new ol.geom.Point(ol.proj.transform([elem.lon, elem.lat], 'EPSG:4326',
                                        'EPSG:3857')),
                                    data: elem
                                }));
                        }
                        index++;
                    });
                });
            });
        },
    };
    window.onresize = function()
    {
        var h = window.outerHeight - 250;
        var w = window.outerWidth;

        var mape = document.getElementsByClassName("ol-unselectable")[0];

        if (mape != null && mape !== undefined) {
            mape.setAttribute("height", h);
            mape.setAttribute("width", w);
        }

    };
</script>

<style lang="sass">
    #themap {
        width:100%;
        height:100%;
    }
    .blogbox-mask {
        position: fixed;
        z-index: 9990;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        transition: opacity .3s ease;
        overflow: scroll;
    }

    .blogbox-wrapper {
        display: block;
        vertical-align: middle;
        margin: 5% auto;
        width: 90%;
    }

    .blogbox-hidden{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        overflow: scroll;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .blogbox-container {
        width: 100%;
        padding: 20px 30px;
        background-color: #EEEEEE;
        border-radius: 2px;
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        overflow: scroll;
        z-index: 9998;
    }

    .blogbox-header h3 {
        margin-top: 0;
        color: #3FCC58;
    }

    .blogbox-body {
        margin: 20px 0;
    }
    /*
     * The following styles are auto-applied to elements with
     * transition="blogbox" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the blogbox transition by editing
     * these styles.
     */

    .blogbox-enter {
        opacity: 0;
    }

    .blogbox-leave-active {
        opacity: 0;
    }

    .blogbox-enter .blogbox-container,
    .blogbox-leave-active .blogbox-container {
        opacity: 1.0;
    }

    .buttonclose {
        position: fixed;
        right: 5%;
        top: 10%;
        z-index: 9999;
    }

    @media (min-width: 480px) {
        .buttonclose {
            padding: 8px 16px;
        }
    }
</style>