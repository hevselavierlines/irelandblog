<template>
    <div v-if="nologin">
        <h2>Please login to continue</h2>
        <form v-on:submit.prevent="login(username, password)">
            Username: <input type="text" v-model="username"><br/>
            Password: <input type="password" v-model="password"><br/>
            <button type="submit">Login</button>
        </form>
    </div>

    <div v-else>
        <form v-on:submit.prevent="send(title, message)">
            Title: <input type="text" v-model="title"><br/>
            Message: <input type="text" v-model="message"><br/>
            Location:
                <input type="number" id="latitude" step="any">
                <input type="number" id="longitude" step="any"><br/>
            Pictures:
                <input type="file" multiple id="file" @change="onFileChange" class="fileupload">

            <button type="submit">Post</button>
        </form>

        <div id="myProgress">
            <div id="myBar"></div>
        </div>
    </div>
</template>

<script>
    import firebase from "./firebase";
    import axios from "axios";
    export default {
        data: function() {
            return {
                nologin: false,
                username: '',
                password: '',
                pictures: ['', ''],
                title: '',
                message: '',
                images:[],
                status: "unknown"
            }
        },
        methods: {
            login: function(username, password) {
                if(username == 'admin' && password=='admin') {
                    this.nologin = false;
                }
                console.log(username + "/" + password);

            },
            onFileChange: function(e) {
                this.images = [];
                for (var i = 0; i < e.target.files.length; i++) {
                    this.createImage(e.target.files[i]);
                }
                console.log(this.images);
                //this.createImage(e.target.files[0]);
            },
            createImage: function(file) {
                var reader = new FileReader();

                reader.onload = (e) => {
                    var image = e.target.result;
                    this.images.push(image);
                };
                reader.readAsDataURL(file);
            },
            send: function(title, message) {
                var imageURLs = [];
                firebase.auth().signInAnonymously().catch(function(error) {
                    console.error(error.message);
                }).then(() => {
                    this.status = "signed in";
                    console.log(title + "/" + message);
                    var storageRef = firebase.storage().ref();
                    var latitude = parseFloat(document.getElementById("latitude").value);
                    var longitude = parseFloat(document.getElementById("longitude").value);

                    var imagesLength = this.images.length;
                    var progressBar = document.getElementById("myProgress");
                    progressBar.style.visibility = "visible";
                    var progress = document.getElementById("myBar");
                    for(var i = 0; i < imagesLength; i++) {
                        var unix = (new Date()).getTime();

                        axios.post('http://www.appc.at/irishblog/blogimage.php', this.images[i])
                            .then(function (response) {
                                console.log(response);
                                var downloadURL = response.data.image;
                                imageURLs.push(downloadURL);
                                var width = (imageURLs.length / imagesLength) * 100.0;
                                progress.style.width = width + '%';
                                if(imageURLs.length == imagesLength) {
                                    var sending = {
                                        title: title,
                                        message: message,
                                        images: imageURLs,
                                        createdAt: unix,
                                        lat: latitude,
                                        lon: longitude
                                    };
                                    const blogs = firebase.database().ref('blogs').push();
                                    blogs.set(sending).catch(function(error) {
                                        console.error(error);
                                    }).then(() => {
                                        console.log('writing complete', sending);
                                    });
                                    progressBar.style.visibility = "hidden";
                                    progress.style.width = "0%";
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                });

            }

        },
        mounted: function() {
            var progressBar = document.getElementById("myProgress");
            progressBar.style.visibility = "hidden";

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(location) {
                        document.getElementById("latitude").value = location.coords.latitude;
                        document.getElementById("longitude").value = location.coords.longitude;
                    }
                );
            }
        }
    }
</script>

<style lang="sass" scoped>
    #myProgress {
        width: 100%;
        background-color: grey;
    }
    #myBar {
        width: 0%;
        height: 30px;
        background-color: blue;
    }
</style>