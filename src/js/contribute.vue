<template>
    <div v-if="nologin">
        <h2>Please login to continue</h2>
        <form v-on:submit.prevent="login(username, password)">
            Username: <input type="text" v-model="username"><br/>
            Password: <input type="password" v-model="password"><br/>
            <button type="submit">Login</button>
        </form>
    </div>

    <div v-else class="forminfo">
        <form v-on:submit.prevent="send(title, message)">
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" class="form-control" v-model="title" id="title">
            </div>
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea class="form-control" rows="5" v-model="message" title="message"></textarea>
            </div>
            <div class="form-group">
                <label>Location:</label>
                <input type="number" id="latitude" step="any">
                <input type="number" id="longitude" step="any">
            </div>
            <div class="form-group">
                <label for="file">Pictures:</label>
                <input type="file" multiple id="file" @change="onFileChange" class="fileupload">
            </div>

            <button class="btn btn-default" type="submit">Post</button>
        </form>

        <div class="progress" id="progress">
            <div id="progress-bar" class="progress-bar" role="progressbar" aria-valuenow="70"
                 aria-valuemin="0" aria-valuemax="100" style="width:100%">
                Push post-button to start
            </div>
        </div>
        <div v-if="status != null">
            {{status}}
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
                status: null
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
                this.status = null;
                var progressBar = document.getElementById("progress");
                progressBar.style.visibility = "visible";
                var progress = document.getElementById("progress-bar");
                progress.style.width = '0%';
                progress.innerText = 0 + "/" + this.images.length;

                this.sendSingleImage(0, this.images.length, []);
            },
            sendDb: function(imageURLs) {
                var unix = (new Date()).getTime();
                var latitude = parseFloat(document.getElementById("latitude").value);
                var longitude = parseFloat(document.getElementById("longitude").value);
                if(isNaN(latitude)) {
                    latitude = 0.0;
                }
                if(isNaN(longitude)) {
                    longitude = 0.0;
                }
                var sending = {
                    title: this.title,
                    message: this.message,
                    images: imageURLs,
                    createdAt: unix,
                    lat: latitude,
                    lon: longitude
                };
                console.log(sending);
                const blogs = firebase.database().ref('blogs').push();
                blogs.set(sending).catch(function(error) {
                    console.error(error);
                    statusMessage = "Error uploading " + error;
                }).then(() => {
                    var progressBar = document.getElementById("progress");
                    var progress = document.getElementById("progress-bar");
                    progressBar.style.visibility = "hidden";
                    progress.style.width = "0%";
                });
            },
            sendSingleImage: function(currentId, maxId, imageURLs) {
                var loc_image = this.images;
                var loc_sendSingleImage = this.sendSingleImage;
                var loc_sendDb = this.sendDb;
                axios.post('http://www.appc.at/irishblog/blogimage.php', this.images[currentId])
                    .then(function(response) {
                        console.log(response.data);
                        var downloadURL = response.data.image;
                        imageURLs.push(downloadURL);

                        var progress = document.getElementById("progress-bar");
                        var width = (imageURLs.length / maxId) * 100.0;
                        progress.style.width = width + '%';
                        progress.innerText = imageURLs.length + "/" + maxId;

                        if(imageURLs.length < loc_image.length) {
                            loc_sendSingleImage(currentId + 1, maxId, imageURLs);
                        } else {
                            loc_sendDb(imageURLs);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        statusMessage = "Error " + error;
                    });
            }

            /*send: function(title, message) {
                this.status = null;
                var imageURLs = [];
                firebase.auth().signInAnonymously().catch(function(error) {
                    console.error(error.message);
                }).then(() => {
                    this.status = "signed in";
                    console.log(title + "/" + message);
                    var latitude = parseFloat(document.getElementById("latitude").value);
                    var longitude = parseFloat(document.getElementById("longitude").value);
                    var statusMessage = this.status;
                    var imagesLength = this.images.length;
                    var progressBar = document.getElementById("progress");
                    progressBar.style.visibility = "visible";
                    var progress = document.getElementById("progress-bar");
                    var completeMessage = this.complete;
                    for(var i = 0; i < imagesLength; i++) {
                        var unix = (new Date()).getTime();

                        axios.post('http://www.appc.at/irishblog/blogimage.php', this.images[i])
                            .then(function (response) {
                                console.log(response);
                                var downloadURL = response.data.image;
                                imageURLs.push(downloadURL);
                                var width = (imageURLs.length / imagesLength) * 100.0;
                                progress.style.width = width + '%';
                                progress.innerText = imageURLs.length + "/" + imagesLength;
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
                                        statusMessage = "Error uploading " + error;
                                    }).then(() => {
                                        progressBar.style.visibility = "hidden";
                                        progress.style.width = "0%";
                                        statusMessage = "Upload successful!";
                                    });

                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                statusMessage = "Error " + error;
                            });
                    }

                });

            }*/

        },
        mounted: function() {
            var progressBar = document.getElementById("progress");
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
    .forminfo {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 50px;
    }
</style>