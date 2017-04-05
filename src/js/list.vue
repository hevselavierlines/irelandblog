<template lang="html">
    <div>
        <ul class="bloglist">
            <li class="blogentry" v-for="entry in entries">
                <table class="blogtable" border="0">
                    <tr>
                        <td class="blogtitle">{{entry.title}}</td>
                    </tr>
                    <tr>
                        <td class="blogtext">{{entry.message}}</td>
                    </tr>
                    <tr>
                        <td>
                            <ul class="blogimages">
                                <li class="blogimage" v-for="(image, index) in entry.images" v-if="index < 3">
                                    <img class="blogimageimg" v-bind:src="image" height="200px">
                                </li>
                            </ul>
                        </td>
                    </tr>
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
                        newMessages.push(childSnapshot.val());
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
    .bloglist .blogentry:nth-child(odd) {
        background-color: #00C20D;
    }
    .bloglist .blogentry:nth-child(even) {
        background-color: #B8B8B8;
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
        padding-left: 10px;
        padding-right: 10px;
        padding: 10px;
    }
    .blogtitle {
        padding: 16px 10px;
        width: 100%;
        background-color: darkgrey;
        color: black;
        font-size: 24px;
    }
    .blogtext {
        text-align: justify;
        padding: 5px 10px;
        width: 100%;
    }
</style>