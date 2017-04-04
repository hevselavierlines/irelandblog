<template lang="html">
    <div>
        <h1> Blog List </h1>
        <!--
        <p>Loading: {{$store.state.loading}}</p>
        <div v-if="$store.state.error">{{$state.store.error}}</div>
        <ul>
            <li v-for="todo in todos">
                <input type="checkbox" v-bind:checked="todo.done" v-on:click="setDone(todo)">
                {{todo.title}}<br/>
                <small><button v-on:click="deleteTodo(todo.id)">delete</button></small>
            </li>
        </ul>

        <form v-on:submit.prevent="addTodo(todoText)">
            <input v-model="todoText">
            <button type="submit">Add</button>
        </form>
        -->
        <ul class="bloglist">
            <li class="blogentry" v-for="entry in entries">
                <h3>{{entry.title}}</h3>
                <p>{{entry.message}}</p>
                <ul class="blogimages">
                     <li class="blogimage" v-for="(image, index) in entry.images" v-if="index < 3">
                         <img class="blogimageimg" v-bind:src="image" height="200px">
                     </li>
                </ul>
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
    }
    .blogimages {
        list-style-type: none;
        overflow: hidden;
    }
    .blogimages li {
        float: left;
    }
    .blogimageimg {
        display: block;
        margin-left: 10px;
        margin-right: 10px;
    }
</style>