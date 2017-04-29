<template lang="html">
    <div class="maincalendar">
        <full-calendar :events="entries" lang="en" @eventClick="eventClick"></full-calendar>
        <modalblog ref="modal"></modalblog>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            showblogbox: false,
            selection: null
        }
    },
    components : {
        'full-calendar': require('vue-fullcalendar'),
        'modalblog' : require('./modalblog.vue')
    },
    mounted: function () {
        this.$store.dispatch("loadBlogEntries");
        window.scrollTo(0, 0);
    },
    methods: {
        getTime: function(timestamp) {
            var a = new Date(timestamp);
            var year = a.getFullYear();
            var month = a.getMonth() + 1;
            var date = a.getDate();
            if(month < 10) {
                month = '0' + month;
            }
            if(date < 10) {
                date = '0' + date;
            }
            var time = year + "-" + month + "-" + date;
            return time;
        },
        eventClick: function(event, jsEvent, pos) {
            this.$refs.modal.appear(event.data);
        }
    },
    computed: {
        entries: function() {
            var fullData = this.$store.state.blogEntries;
            if(fullData.length > 0) {

                var dates = [];
                for(var i = 0; i < fullData.length; i++) {
                    var elem = fullData[i];
                    var time = this.getTime(elem.createdAt);
                    dates.push({
                       title: elem.title,
                        start: time,
                        end: time,
                        data: elem
                    });
                }
                return dates;
            } else {
                return [];
            }
        }
    }
}
</script>

<style lang="sass" scoped>
    /*$list-color: #DE7F3E;*/
    $list-color: #CCCCCC;
    $back-color: #12660C;

    .maincalendar {
        background-color: $back-color;
    }
</style>