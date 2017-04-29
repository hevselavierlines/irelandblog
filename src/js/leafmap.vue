<template>
    <div>
        <div id="app" style="height: 100%">
            <v-map :zoom=13 :center="[47.413220, -1.219482]">
                <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></v-tilelayer>
                <v-marker :lat-lng="[47.413220, -1.219482]"></v-marker>
            </v-map>
        </div>
    </div>
</template>

<script>
    import Vue2Leaflet from 'vue2-leaflet';

    export default {
        name: 'example',
        components: {
            'v-map': Vue2Leaflet.Map,
            'v-tilelayer' :Vue2Leaflet.TileLayer,
            'v-marker': Vue2Leaflet.Marker
        }
    }
</script>