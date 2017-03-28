<template>
    <div>
        <ul class="menu">
            <li>
                <router-link to="/">TODO</router-link>
            </li>
            <li>
                <router-link to="/about">About</router-link>
            </li>
            <li>
                <router-link to="/map">Map</router-link>
            </li>
        </ul>

        <hr>

        <router-view>

        </router-view>

    </div>
</template>

<style lang="sass" scoped>
    .menu {
        list-style-type: none;
        margin: 0;
        margin-left: 100px;
        margin-right: 100px;
        padding: 0;
        overflow: hidden;
        background-color: #333;
    }
    .menu li{
        float: left;
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
</style>