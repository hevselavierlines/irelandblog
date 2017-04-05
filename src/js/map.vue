<!-- ol-map.vue -->
<template>
    <div id="themap">
    </div>
</template>

<style scoped>
    #themap {
    }
</style>

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
                zoom: 7
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

            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([-7.933565, 53.473896], 'EPSG:4326',
                    'EPSG:3857')),
                name: 'Null Island',
                website: 'mars.sars'
            });
            vectorSource.addFeature(iconFeature);

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
                    console.log(feature);
                    this.$emit("selfeature", feature);
                }
            });

            vectorSource.addFeature(new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([-7.935, 53.473896], 'EPSG:4326',
                    'EPSG:3857')),
                name: 'sars Island',
                website: 'sars.island'
            }));

            firebase.auth().signInAnonymously().catch(function(error) {
                console.error(error.message);
            }).then(() => {
                window.dispatchEvent(new Event('resize'));
                firebase.database().ref('blogs').on('value', (snapshot) =>{
                    snapshot.forEach((childSnapshot) => {
                        var elem = childSnapshot.val();
                        vectorSource.addFeature(new ol.Feature({
                            geometry: new ol.geom.Point(ol.proj.transform([elem.lon, elem.lat], 'EPSG:4326',
                                'EPSG:3857')),
                            name: elem.title
                        }));
                    });
                });
            });
        },
    };
    window.onresize = function()
    {
        console.log('resize');
        var h = window.outerHeight - 400;
        var w = window.outerWidth;

        var mape = document.getElementsByClassName("ol-unselectable")[0];

        if (mape != null && mape !== undefined) {
            mape.setAttribute("height", h);
            mape.setAttribute("width", w);
        }

    };
    /*
    module.exports = {
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
        mounted() {
            this.olmap = new ol.Map({
                target: this.$el,
                loadTilesWhileAnimating: true,
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([-7.933565, 53.473896]),
                    zoom: 7
                })
            });
            // http://openlayers.org/en/latest/apidoc/ol.Map.html#on
            this.olmap.on("moveend", (evt) => {
                // floating openlayer event to inside the vue's ViewModel
                this.updatecenter(evt);
                this.$emit("moveend", evt);
            });
            if (this.autoCenter)
                this.autocenter();
            this.$on("newmarker", (e) => {
                // como o pai só roda o mounted após todos os filhos,
                // temos que guardar em buffer antes de fazer isso.
                while (this.markerstoadd.length) {
                    let m = this.markerstoadd.pop();
                    this.olmap.addLayer(m);
                }
            });
            // bootstrap
            this.$emit("newmarker");
            this.olmap.on("click", (ev) => {
                const feature = this.olmap.forEachFeatureAtPixel(ev.pixel, (feature) => feature);
                if (feature)
                    this.$emit("selfeature", feature);
            });

        },
        data() {
            return {
                olmap: null,
                thecenter: [],
                markerstoadd: []
            };
        },
        watch: {
            center(e) {
                this.setcenter(e);
            }
        },
        methods: {
            addMarker(marker) {
                this.markerstoadd.push(marker);
                this.$emit("newmarker");
            },
            autocenter() {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        if (this.autoCenter) {
                            const lon = pos.coords.longitude;
                            const lat = pos.coords.latitude;
                            this.setcenter([pos.coords.longitude, pos.coords.latitude]);
                        }
                    }, (err) => {
                        console.log(err);
                    });
                }
            },
            setcenter(latlng) {
                this.thecenter[0] = latlng[0];
                this.thecenter[1] = latlng[1];
                this.olmap.getView().setCenter(ol.proj.fromLonLat(this.thecenter));
            },
            updatecenter(evt) {
                const center = evt.map.getView().getCenter();
                const lonlat = ol.proj.toLonLat(center);
                this.thecenter[0] = lonlat[0];
                this.thecenter[1] = lonlat[1];
            }
        }
    };*/
</script>