<!-- ol-map.vue -->
<template>
    <div>
        <div id="themap">
        </div>
        <script type="text/x-template" id="modal-template">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <button class="btn btn-default buttonclose" @click="$emit('close')">X</button>
                        <div class="modal-hidden" @click="$emit('close')"></div>
                        <div class="modal-container" id="modul-container" @click="$emit('null')">
                            <div class="modal-header" @click="$emit('null')">
                                <slot name="header">
                                </slot>
                            </div>

                            <div class="modal-body">
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
            <p slot="text" v-html="selection.message"></p>
            <div slot="images" class="row">
                <div class="col-md-4 blogimage" v-for="(image, index) in selection.images">
                    <img class="img-rounded" v-bind:src="image" width="100%">
                </div>
            </div>
        </modal>
    </div>
    <!-- template for the modal component -->

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
                zoom: 7,
                showModal: false,
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
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: 'http://openlayers.org/en/v3.9.0/examples/data/icon.png'
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
                    this.selection = feature.I.data;
                    console.log(this.selection);
                    this.showModal = true;
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
    .modal-mask {
        position: fixed;
        z-index: 9990;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: block;
        transition: opacity .3s ease;
        overflow-y: scroll;
    }

    .modal-wrapper {
        display: block;
        vertical-align: middle;
        overflow: scroll;
    }

    .modal-hidden{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        overflow: auto;
        background-color: rgba(0, 0, 0, .5);
    }

    .modal-container {
        width: 90%;
        margin: 5% auto;
        padding: 20px 30px;
        background-color: #EEEEEE;
        border-radius: 2px;
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        overflow: scroll;
        z-index: 9998;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #3FCC58;
    }

    .modal-body {
        margin: 20px 0;
    }
    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    .buttonclose {
        position: fixed;
        right: 5%;
        top: 5%;
    }
</style>