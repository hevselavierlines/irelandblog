<template>
    <div>
        <div class="row menu">
            <div class="menuicon"><img src="img/shamrock_small.png"/></div>
            <div class="col-md-2 menuelement">
                <router-link to="/" exact>List</router-link>
            </div>
            <div class="col-md-2 menuelement">
                <router-link to="/map">Map</router-link>
            </div>
            <div class="col-md-2 menuelement">
                <router-link to="/calendar">Calendar</router-link>
            </div>
            <div class="col-md-2 menuelement">
                <router-link to="/about">About</router-link>
            </div>
        </div>
        <router-view class="mainpart">

        </router-view>
        <hr>
        <p class="copyright">(c) Manuel Baumgartner</p>
    </div>
</template>


<style lang="sass" scoped>
    .menu {
        left: 0;
        top: 0;
        width: 100%;
        list-style-type: none;
        margin: 0;

        overflow: hidden;
        background-color: black;
        position: fixed;
        z-index: 999;
        height: 50px;
    }
    .menuelement{
        float: left;
        height: 100%;
        min-width: 100px;
        padding-left: 0px;
        padding-right: 0px;
    }
    .menuicon {
        float: left;
        height: 100%;
        padding-left: 0px;
        padding-right: 0px;
        background-color: #12660C;
    }

    @media (max-width: 480px) {
        .menu {
            padding-left: 0px;
        }
        .menuelement {
            min-width: 50px;
        }
        .menuelement a {
            font-size: 10px;
            padding: 14px 16px;
        }
        .menuicon {
            height: 100%;
        }
        .menuicon img {
            height: 80%;
            margin-top: auto;
            margin-bottom: auto;
            vertical-align: middle;
        }
    }

    .menuelement a {
        display: block;
        color: white;
        text-align: center;
        padding: 17px 16px;
        text-decoration: none;
        height: 100%;
    }
    .menu a:hover {
        background-color: #3FCC58;
        text-decoration: underline;
    }

    .menu .router-link-active {
        background-color: #12660C;
    }

    .menuline {
        margin-top: 0px;
    }

    .mainpart {
        margin-top: 40px;
        padding-top:10px;
        padding-bottom: 10px;
    }

    .copyright {
        font-size: 10px;
    }
</style>