<!-- ol-map.vue -->
<template>
    <div>
        <div id="themap">
        </div>
        <modalblog ref="modal"></modalblog>
        <div style="display: none">{{loading}}</div>
    </div>
</template>

<script>
    import ol from "openlayers";
    import firebase from "./firebase";
    var outsidemap;
    export default  {
        name: "OLMap",
        data: function() {
            return {
                centre: ol.proj.fromLonLat([-7.933565, 53.473896]),
                zoom: 6,
                showblogbox: false,
                selection: null,
                vectorLayer: null,
                iconStyle: null
            }
        },
        components: {
            'modalblog' : require('./modalblog.vue')
        },
        computed: {
            entries: function() {
                console.log('loading entries');
                var fullData = this.$store.state.blogEntries;
                var vectorSource = new ol.source.Vector({
                    //create empty vector
                });
                if(fullData.length > 0) {
                    for(var i = 0; i < fullData.length; i++) {
                        var elem = fullData[i];
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
                    }
                }
                return vectorSource;
            },
            loading: function() {
                var state = this.$store.state.loading;
                if(state == 4 && this.olmap != null) {
                    this.vectorLayer = new ol.layer.Vector({
                        source: this.entries,
                        style: this.iconStyle
                    });
                    this.olmap.addLayer(this.vectorLayer);
                }
                return state;
            }
        },
        mounted: function() {
            this.$store.dispatch("loadBlogEntries");
            var vm = this;
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

            this.iconStyle = new ol.style.Style({
                image: new ol.style.Icon( ({
                    anchor: [0.5, 25],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: './img/shamrock_small.png'
                }))
            });

            vm.olmap.on("click", function (ev) {
                var feature = vm.olmap.forEachFeatureAtPixel(ev.pixel, function (feature) {
                    return feature;
                });
                if (feature) {
                    vm.$refs.modal.appear(feature.O.data);
                }
            });
            vm.olmap.once('postrender', function(event) {
                vm.olmap.updateSize();
            });
            this.olmap.updateSize();
        }
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

<style lang="sass" scoped>
    #themap {
        width:100%;
        height:100%;
    }
</style>