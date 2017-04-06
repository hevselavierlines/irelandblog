<template lang="html">
    <div class="container-fluid mainlist">
        <ul class="bloglist">
            <li class="blogentry" v-for="entry in entries">
                <table class="table table-striped blogtable" border="0">
                    <tbody>
                    <tr>
                        <td class="blogtitle">{{entry.title}}</td>
                    </tr>
                    <tr>
                        <td class="blogtext" v-html="entry.message"></td>
                    </tr>
                    <tr>
                        <td class="blogimagestd">
                            <div class="row blogimages">
                                <div class="col-md-4 blogimage" v-for="(image, index) in entry.images" v-if="index < 3">
                                    <img class="blogimageimg img-rounded" v-bind:src="image">
                                </div>
                                <div class="blogimagehidden"v-for="(image, index) in entry.images" v-if="index >= 3">
                                    <img class="blogimageimghidden" v-bind:src="image">
                                </div>
                            </div>
                            <!--
                            <ul class="blogimages">
                                <li class="blogimage" v-for="(image, index) in entry.images" v-if="index < 3">
                                    <img class="blogimageimg img-rounded" v-bind:src="image">
                                </li>
                            </ul>-->
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
        /*
        methods: {
            addTodo: function(text) {
                if(text && text.length) {
                    this.$store.dispatch('addTodo', {text: text});
                    this.todoText = '';
                }
            },
            deleteTodo: function(id) {
                if(id) {
                    this.$store.dispatch('removeTodo', {id: id});
                }
            },
            setDone: function(todo) {
                if(todo) {
                    this.$store.dispatch('setDone', {id: todo.id, done: !todo.done});
                }
            }
        },
        computed: {
            todos: function() {
                return this.$store.state.todos;
            }
        },
        mounted: function() {
            this.$store.dispatch("loadTodos");

        }
        */
        mounted: function () {
            firebase.auth().signInAnonymously().catch(function(error) {
                console.error(error.message);
                this.status = "error";
            }).then(() => {
                this.status = "signed in";
                firebase.database().ref('blogs').on('value', (snapshot) =>{
                    let newMessages = [];
                    snapshot.forEach((childSnapshot) => {
                        var value = childSnapshot.val();
                        console.log(value);
                        value.message = value.message.replace( new RegExp( "\n", "g" ),'<br/>');
                        newMessages.push(value);
                    });
                    this.entries = newMessages;
                });
            });
            /*this.entries = [
                {
                    title: "Giant's causeway",
                    message: "empty now",
                    lon: -5.5534,
                    lat: 45.3345,
                    images: [
                        "https://firebasestorage.googleapis.com/v0/b/irelandblog-bc379.appspot.com/o/IMG_2622.JPG?alt=media&token=351abb18-2744-4d5d-8140-58fa0ee68cd8",
                        "https://firebasestorage.googleapis.com/v0/b/irelandblog-bc379.appspot.com/o/IMG_2622.JPG?alt=media&token=351abb18-2744-4d5d-8140-58fa0ee68cd8",
                        "https://firebasestorage.googleapis.com/v0/b/irelandblog-bc379.appspot.com/o/IMG_2622.JPG?alt=media&token=351abb18-2744-4d5d-8140-58fa0ee68cd8"
                    ]
                },

                {
                    title: "Giant's causeway",
                    message: "empty now",
                    lon: -5.5534,
                    lat: 45.3345,
                    images: [
                        "https://firebasestorage.googleapis.com/v0/b/irelandblog-bc379.appspot.com/o/IMG_2622.JPG?alt=media&token=351abb18-2744-4d5d-8140-58fa0ee68cd8",
                        "https://firebasestorage.googleapis.com/v0/b/irelandblog-bc379.appspot.com/o/IMG_2622.JPG?alt=media&token=351abb18-2744-4d5d-8140-58fa0ee68cd8",
                        "https://firebasestorage.googleapis.com/v0/b/irelandblog-bc379.appspot.com/o/IMG_2622.JPG?alt=media&token=351abb18-2744-4d5d-8140-58fa0ee68cd8"
                    ]
                }
            ];*/
        }
    }
</script>

<style lang="sass" scoped>
    .mainlist {
        background-color: #12660C;
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
        margin: 10px;
        height: 180px;
    }
    .blogtitle {
        padding: 16px 10px;
        width: 100%;
        background-color: #DE7F3E;
        color: black;
        font-size: 24px;
    }
    .blogtext {
        text-align: justify;
        padding: 5px 10px;
        width: 100%;
        background-color: #DE7F3E;
    }

    .blogimagestd {
        background-color: #DE7F3E;
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
</style>