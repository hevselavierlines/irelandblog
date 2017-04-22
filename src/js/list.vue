<template lang="html" v-el="template">
    <div>
        <div class="loadinginfo" id="loadinginfo" v-if="loading < 4">
            Loading...
        <img src="img/spinner.gif" height="100px"/></div>
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
                <div class="modal-hidden" @click="hideModal(true)"></div>
                <div class="modal-container" id="modul-container">
                    <button type="button" class="close buttonclose" aria-label="Close" @click="hideModal(true)">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <a href="#" class="picture-before" v-on:click.prevent="lastPicture">
                        <img id="picturebefore" src="img/prev.png" ref="picturebefore">
                    </a>
                    <a href="#" class="picture-next" v-on:click.prevent="nextPicture">
                        <img id="picturenext" src="img/next.png" ref="picturenext">
                    </a>
                    <img class="modal-picture" id="modal-picture" v-bind:src="currentPicture">
                    <div id="picturenumber" class="picture-number">
                        <span class="badge">{{currentId + 1}}/{{currentLength}}</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data : function() {
            return {
                status: 'unknown',
                todoText: '',
                selection: null,
                currentPicture: "",
                currentId: -1,
                currentLength: -1,
                modal: null
            }
        },
        mounted: function () {
            var loadinginfo = document.getElementById("loadinginfo");
            this.$store.dispatch("loadBlogEntries");

            this.modal = document.getElementById("modal-mask");
            this.hideModal(false);

            window.addEventListener('keyup', this.keyEvent);
        },
        computed: {
            entries: function() {
                return this.$store.state.blogEntries;
            },
            loading: function() {
                return this.$store.state.loading;
            }
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
                        this.changePicture();
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
                        this.changePicture();
                    } else {
                        this.currentId = this.selection.images.length - 1;
                    }
                    this.checkArrows();
                }
            },
            changePicture: function() {
                var pictureBox = document.getElementById("modal-picture");
                var lastPic = true;
                var alpha = 1.0;
                var curPicture = this.currentPicture;
                var nextPicture = this.selection.images[this.currentId];
                var t2 = null;
                function fadeOutPicture() {
                    alpha -= 0.05;
                    if(alpha <= 0.1) {
                        alpha = 0.1;
                        clearInterval(t);
                        applyPicture();
                    }
                    pictureBox.style.opacity = alpha;
                }

                var t = setInterval(fadeOutPicture, 10);

                function applyPicture() {
                    pictureBox.setAttribute("src", nextPicture);
                    pictureBox.onload = function() {
                        t2 = setInterval(fadeInPicture, 10);
                    };
                }
                function fadeInPicture() {
                    alpha += 0.05;
                    if(alpha >= 1.0) {
                        alpha = 1.0;
                        clearInterval(t2);
                    }
                    pictureBox.style.opacity = alpha;
                }
            },
            showPicture: function(blog, pictureId) {
                if(this.selection == null) {
                    this.showModal();
                }
                this.selection = blog;
                this.currentId = pictureId;
                this.currentPicture = blog.images[pictureId];
                this.currentLength = blog.images.length;
                this.checkArrows();
            },
            showModal: function() {
                var elem=this.modal;
                var alpha = 0;
                elem.style.opacity = alpha;
                elem.style.display = "block";

                function moreVisible()
                {
                    if(alpha >= 1) {
                        clearInterval(t);
                    }
                    alpha += 0.05;
                    elem.style.opacity = alpha;
                    elem.style.filter="alpha(opacity="+(alpha*100)+")";
                }

                var t=setInterval(moreVisible, 20);
            },
            hideModal: function(animated) {
                var elem=this.modal;
                var alpha = 1.0;
                this.selection = null;
                elem.style.opacity = alpha;
                elem.style.display = "block";

                if(animated) {
                    function lessVisible() {
                        if (alpha <= 0) {
                            clearInterval(t);
                            elem.style.display = "none";
                        }
                        alpha -= 0.05;
                        elem.style.opacity = alpha;
                        elem.style.filter = "alpha(opacity=" + (alpha * 100) + ")";
                    }

                    var t = setInterval(lessVisible, 25);
                } else {
                    elem.style.display = "none";
                }
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

    .loadinginfo {
        width: 100%;
        height: 100px;
        text-align: center;
        vertical-align: middle;
        margin-top: auto;
        margin-bottom: auto;
    }
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
        box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
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
        overflow:auto;
        background-color: rgba(0, 0, 0, 0.5);
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
        position: absolute;
        padding: 20px;
        background-color: #EEEEEE;
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        z-index: 9990;
        top: 3%;
        bottom: 3%;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        max-width: 1000px;

        vertical-align: middle;
        border-radius: 6px;
    }


    .picture-before {
        float: left;
        display: block;
        position: absolute;
        left: 0;
        height: 100%;
        width: 50%;
        z-index: 9900;
        top: 1%;
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
        height: 100%;
        width: 50%;
        right: 0;
        z-index: 9900;
        top: 1%;
        bottom: 1%;
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
        margin-top: auto;
        margin-bottom: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
        vertical-align: middle;
    }

    .picture-number {
        position: absolute;
        width: 100%;
        bottom: 12px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        font-size: 12px;
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
        width: 50px;
        height: 50px;

        border-radius: 4px;
    }

    @media (max-width: 1000px) {
        .picture-next {
            margin-left: 0;
            right: 0;
        }

        .modal-picture {
            max-height: 90%;
        }
    }

    @media (max-width: 640px) {
        .buttonclose {
            top: auto;
            bottom: 5%;
            right: 1%;
            left: 1%;
            width: 98%;
            height: 35px;
            position: absolute;

            background-color: #c0c0c0;
            opacity: 1.0;
        }

        .modal-container {
            padding-left: 0;
            padding-right: 0;
            padding-top: auto;
            height: 95%;
        }


        .picture-next {
            height: 95%
        }

        .picture-before {
            height: 95%;
        }
    }

    @media (max-width: 480px) {
        .buttonclose {
            top: auto;
            bottom: 11%;
            right: 1%;
            left: 1%;
            width: 98%;
            height: 50px;
            position: absolute;
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