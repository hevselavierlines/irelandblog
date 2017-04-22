<template lang="html">
    <div class="maincalendar">
        <full-calendar :events="entries" lang="en"></full-calendar>
    </div>
</template>
<script>
export default {
    components : {
        'full-calendar': require('vue-fullcalendar')
    },
    mounted: function () {
        this.$store.dispatch("loadBlogEntries");
    },
    methods: {
        getTime: function(timestamp) {
            var a = new Date(timestamp);
            var year = a.getFullYear();
            var month = a.getMonth() + 1;
            var date = a.getDate();
//start : '2016-08-25'
            if(month < 10) {
                month = '0' + month;
            }
            if(date < 10) {
                date = '0' + date;
            }
            var time = year + "-" + month + "-" + date;
            return time;
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
                        end: time
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

<style lang="sass">
    /*$list-color: #DE7F3E;*/
    $list-color: #CCCCCC;
    $back-color: #12660C;

    .maincalendar {
        background-color: $back-color;
    }

    .event-item {
        background-color: $back-color !important;
        color: white !important;
    }

    .comp-full-calendar {
        max-width: 100% !important;
        margin: 25px 35px !important;
        padding: 20px 0 !important;
        background-color: $list-color !important;
    }

    @media (max-width: 640px) {
        .comp-full-calendar {
            margin: 25px 0 !important;
        }
    }
</style>