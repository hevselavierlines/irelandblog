<template>
    <div>
        <ul class="menu">
            <li>
                <router-link to="/" exact>List</router-link>
            </li>

            <li>
                <router-link to="/map">Map</router-link>
            </li>

            <li>
                <router-link to="/about">About</router-link>
            </li>

            <li>
                <router-link to="/contribute">Contribute</router-link>
            </li>
        </ul>

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

        padding-left: 50px;
        overflow: hidden;
        background-color: #333;
        position: fixed;
        z-index: 999;
    }
    .menu li{
        float: left;
        min-width: 100px;
    }
    .menu li a {
        display: block;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
    }
    .menu a:hover {
        background-color: green;
        text-decoration: underline;
    }

    .menu .router-link-active {
        background-color: darkgreen;
    }

    .menuline {
        margin-top: 0px;
    }

    .mainpart {
        margin-top: 50px;
    }

    .copyright {
        font-size: 10px;
    }
</style>