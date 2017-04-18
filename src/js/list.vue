<template lang="html" v-el="template">
    <div>
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
                                    <a href="#" v-on:click.prevent="showPicture(entry, index)">
                                        <img class="blogimageimg img-rounded"
                                             v-bind:src="image">
                                    </a>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </li>
        </ul>
    </div>
        <transition name="modal">
            <div class="modal-mask" id="modal-mask">
                <div class="modal-hidden" @click="hideModal()"></div>
                <div class="modal-container" id="modul-container">
                    <button class="btn btn-default buttonclose" @click="hideModal()">X</button>
                    <a href="#" class="picture-before" v-on:click.prevent="lastPicture">
                        <img id="picturebefore" src="img/prev.png" ref="picturebefore">
                    </a>
                    <a href="#" class="picture-next" v-on:click.prevent="nextPicture">
                        <img id="picturenext" src="img/next.png" ref="picturenext">
                    </a>
                    <img class="modal-picture" v-bind:src="currentPicture">
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import firebase from "./firebase";
    export default {
        data : function() {
            return {
                status: 'unknown',
                todoText: '',
                entries: [],
                selection: null,
                currentPicture: "",
                currentId: -1,
                modal: null
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

            this.modal = document.getElementById("modal-mask");
            this.hideModal();

            window.addEventListener('keyup', this.keyEvent);
        },
        methods: {
            keyEvent: function(e) {
                if(e.keyCode == 37) {
                    this.lastPicture(null);
                } else if(e.keyCode == 39) {
                    this.nextPicture(null);
                }
            },
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
            },
            lastPicture: function(event) {
                if(this.selection != null) {
                    this.currentId -= 1;
                    if (this.currentId >= 0) {
                        this.currentPicture = this.selection.images[this.currentId];
                    } else {
                        this.currentId = 0;
                    }

                    this.checkArrows();
                }
            },
            nextPicture: function(event) {
                if(this.selection != null) {
                    this.currentId += 1;
                    if (this.currentId < this.selection.images.length) {
                        this.currentPicture = this.selection.images[this.currentId];
                    } else {
                        this.currentId = this.selection.images.length - 1;
                    }

                    this.checkArrows();
                }
            },
            showPicture: function(blog, pictureId) {
                if(this.selection == null) {
                    this.showModal();
                }
                this.selection = blog;
                this.currentId = pictureId;
                this.currentPicture = blog.images[pictureId];

                this.checkArrows();
            },
            showModal: function() {
                this.modal.style.display = "block";
            },
            hideModal: function() {
                this.modal.style.display = "none";
                this.selection = null;
            },
            checkArrows: function() {
                var pictureId = this.currentId;
                if(pictureId == 0) {
                    document.getElementById("picturebefore").style.visibility = "hidden";
                    document.getElementById("picturenext").style.visibility = "visible";
                } else if(pictureId == this.selection.images.length - 1) {
                    document.getElementById("picturebefore").style.visibility = "visible";
                    document.getElementById("picturenext").style.visibility = "hidden";
                } else {
                    document.getElementById("picturebefore").style.visibility = "visible";
                    document.getElementById("picturenext").style.visibility = "visible";
                }
            }
        }
    }
</script>

<style lang="sass" scoped>
    /*$list-color: #DE7F3E;*/
    $list-color: #CCCCCC;
    $back-color: #12660C;
    $next-url: 'img/next.png';

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

        opacity: 1.0;
        -webkit-transition: opacity 0.6s;
        -moz-transition: opacity 0.6s;
        -o-transition: opacity 0.6s;
        transition: opacity 0.6s;

        cursor: hand;
    }

    .blogimageimg:hover {
        opacity: 0.75;
        cursor: hand;
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

        .modal-container {
            height: auto;
            max-height: 100%;
        }
    }

    /* start of the custom lightbox*/

    .modal-mask {
        position: fixed;
        z-index: 9990;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        transition: opacity .3s ease;

        display: block;
        vertical-align: middle;
        margin-top: 3%;
        margin-bottom: 3%;
        margin-left: auto;
        margin-right: auto;
        max-width: 1000px;
        overflow:auto;
    }

    .modal-hidden{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-container {
        padding: 20px;
        background-color: #EEEEEE;
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        z-index: 9990;
        height: 100%;
        margin: auto;

        vertical-align: middle;
        border-radius: 6px;
    }


    .picture-before {
        float: left;
        display: block;
        position: absolute;
        left: 0%;
        height: 100%;
        width: 50%;
        z-index: 9900;
        top: 0%;
        visibility: visible;

        opacity: 0;
        -webkit-transition: opacity 0.6s;
        -moz-transition: opacity 0.6s;
        -o-transition: opacity 0.6s;
        transition: opacity 0.6s;
    }

    .picture-before:hover {
        opacity: 1.0;
    }

    .picture-before img {
        left: 0%;
        cursor: pointer;
        position: absolute;
        top: 50%;
        width: auto;
        margin-top: -32px;
    }

    .picture-next {
        float: right;
        display: block;
        position: absolute;
        right: 0%;
        height: 100%;
        width: 50%;
        z-index: 9900;
        top: 0%;
        visibility: visible;

        opacity: 0;
        -webkit-transition: opacity 0.6s;
        -moz-transition: opacity 0.6s;
        -o-transition: opacity 0.6s;
        transition: opacity 0.6s;
    }

    .picture-next:hover {
        opacity: 1.0;
    }

    .picture-next img {
        right: 0%;
        cursor: pointer;
        position: absolute;
        top: 50%;
        width: auto;
        margin-top: -32px;
    }

    .modal-picture {
        max-width: 100%;
        max-height: 100%;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
        vertical-align: middle;
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
        position: absolute;
        z-index: 9999;
        float: right;

        top: 1%;
        right: 1%;
        bottom: auto;
        left: auto;
        width: 50px;
        height: 40px;
    }

    @media (max-width: 480px) {
        .buttonclose {
            top: auto;
            bottom: 11%;
            right: 1%;
            left: 1%;
            width: 98%;
            height: 50px;
        }

        .modal-container {
            padding-left: 0;
            padding-right: 0;
            padding-top: auto;
            height: 90%;
        }

        .picture-next {
            height: 90%
        }

        .picture-before {
            height: 90%;
        }
    }
</style>