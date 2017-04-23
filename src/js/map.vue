<!-- ol-map.vue -->
<template>
    <div>
        <div id="themap">
        </div>
        <modalblog ref="modal"></modalblog>
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
        components: {
            'modalblog' : require('./modalblog.vue')
        },
        mounted() {
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

            var vectorSource = new ol.source.Vector({
                //create empty vector
            });

            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon( ({
                    anchor: [0.5, 25],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: './img/shamrock_small.png'
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
                    vm.$refs.modal.appear(feature.O.data);
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

<style lang="sass" scoped>
    #themap {
        width:100%;
        height:100%;
    }
</style>