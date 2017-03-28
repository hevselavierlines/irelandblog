<!-- ol-map.vue -->
<template>
    <div id="themap">
        <slot></slot>
    </div>
</template>

<style scoped>
    #themap {
        width:90%;
        height:90%;
        margin-left:5%;
        margin-right:5%;
    }
</style>

<script>
    const ol = require("openlayers");
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
                    /* geolocation is available */
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
    };
</script>