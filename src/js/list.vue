<template lang="html">
    <div class="container-fluid mainlist">
        <ul class="bloglist">
            <li class="blogentry" v-for="entry in entries">
                <table class="table table-striped blogtable" border="0">
                    <tbody>
                    <tr>
                        <td class="blogtitle"><h3>{{entry.title}}</h3>
                            <p class="blogtime">
                                <img src="img/clock.png">
                                {{getTime(entry.createdAt)}}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="blogtext" v-html="entry.message"></td>
                    </tr>
                    <tr>
                        <td class="blogimagestd">
                            <div class="row blogimages">
                                <div class="col-md-4 blogimage" v-for="(image, index) in entry.images" v-if="index < 3">
                                    <lightbox v-bind:album="entry.title" v-bind:src="image">
                                        <img class="blogimageimg img-rounded" v-bind:src="image">
                                    </lightbox>
                                </div>
                                <div class="blogimagehidden"v-for="(image, index) in entry.images" v-if="index >= 3">
                                    <lightbox v-bind:album="entry.title" v-bind:src="image">
                                        <img class="blogimageimghidden" v-bind:src="image">
                                    </lightbox>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </li>
        </ul>
    </div>
</template>

<script>
    import firebase from "./firebase";
    export default {
        data : function() {
            return {
                status: 'unknown',
                todoText: '',
                entries: []
            }
        },
        mounted: function () {
            firebase.auth().signInAnonymously().catch(function(error) {
                console.error(error.message);
                this.status = "error";
            }).then(() => {
                this.status = "signed in";
                firebase.database().ref('blogs').on('value', (snapshot) =>{
                    let blogEntries = [];
                    snapshot.forEach((childSnapshot) => {
                        var value = childSnapshot.val();
                        value.message = value.message.replace( new RegExp( "\n", "g" ),'<br/>');
                        blogEntries.push(value);
                    });
                    blogEntries.reverse();
                    this.entries = blogEntries;

                });
            });
        },
        methods: {
            getTime: function(timestamp) {
                var a = new Date(timestamp);
                var months = ['January','February','March','April','May','June','July',
                    'August','September','October','November','December'];
                var year = a.getFullYear();
                var month = months[a.getMonth()];
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();

                if(date < 10) {
                    date = '0' + date;
                }
                if(hour < 10) {
                    hour = '0' + hour;
                }
                if(min < 10) {
                    min = '0' + min;
                }
                var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
                return time;
            }
        }
    }
</script>

<style lang="sass">
    /*$list-color: #DE7F3E;*/
    $list-color: #CCCCCC;
    $back-color: #12660C;

    .mainlist {
        background-color: $back-color;
    }
    .bloglist {
        list-style-type: none;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 25px;
    }
    .blogentry {
        margin-bottom:25px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .blogentry tr {
        background-color: $list-color;
    }
    .blogtable {
        width: 100%;
    }

    .blogimages {
        list-style-type: none;
        overflow: hidden;
    }
    .blogimages li {
        float: left;
        background-color: transparent;
    }
    .blogimageimg {
        display: block;
        padding: 10px;
        height: auto;
        width: 100%;
    }
    .blogtitle {
        width: 100%;
        background-color: $list-color;
    }

    .blogtitle h3 {
        padding-top: 0;
        padding-left: 10px;
        color: $back-color;
        font-size: 32px;
    }

    .blogtime {
        font-size: 14px;
        color: black;
        padding-left: 10px;
    }

    .blogtime img {
        width: 14px;
    }

    .blogtext {
        text-align: justify;
        padding: 5px 10px;
        width: 100%;
        background-color: $list-color;
    }

    .blogimagestd {
        background-color: $list-color;
    }

    .blogimagehidden {
        display: none;
    }

    @media (max-width: 480px) {
        .bloglist {
            padding-left: 0px;
            padding-right: 0px;
        }

        .blogentry {
            margin-left: 4px;
            margin-right: 4px;
        }

        .blogimageimg {
            margin: 0;
            height: auto;
            width: 100%;
        }
    }

    .lightbox {
        position: fixed !important;
    }
</style>