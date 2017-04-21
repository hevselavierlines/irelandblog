<template lang="html">
    <div>
        <div class="container-fluid mainlist">
            <ul class="bloglist">
                <li class="blogentry">
                    <table class="table table-striped blogtable" border="0">
                        <tbody>
                        <tr>
                            <td class="blogtitle">
                                <h3>About Me</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="blogimagestd">
                                <img src="img/blogimage.jpg" class="img-circle">
                            </td>
                        </tr>
                        <tr>
                            <td class="blogtext">
                                <table class="table table-striped blogtexttable">
                                    <tr>
                                        <td class="blogtextleft">Name</td>
                                        <td class="blogtextright">Manuel Baumgartner</td>
                                    </tr>
                                    <tr>
                                        <td class="blogtextleft">Place</td>
                                        <td class="blogtextright">Hagenberg im M&uuml;hlkreis, Austria</td>
                                    </tr>
                                    <tr>
                                        <td class="blogtextleft">Birthday</td>
                                        <td class="blogtextright">22/01/1994</td>
                                    </tr>
                                    <tr>
                                        <td class="blogtextleft">Languages</td>
                                        <td class="blogtextright">German (Lv. C2), English (Lv. C1), Dutch (Lv. A1)</td>
                                    </tr>
                                </table>
                                <p>I am Manuel Baumgartner a student of
                                    University of Applied Sciences Hagenberg<br/>
                                    This blog is about my semester abroad in Ireland. It is from August 2017 to December 2017.
                                    Before this day all posts are from my last student exchange 2015 and 2016.</p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </li>
            </ul>
        </div>
    </div>
</template>

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
        display: inline-block;
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
        font-size: 22px;
    }

    .blogimagestd {
        background-color: $list-color;
    }

    .blogimagestd img {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        display: block;
        max-height: 60%;
        max-width: 100%;
    }

    .blogtextleft {
        font-weight: bold;
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

        .blogtext {
            font-size: 14px;
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
    }

    @media (min-width: 480px) {
        .buttonclose {
            padding: 8px 16px;
        }
    }
</style>