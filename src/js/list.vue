<template lang="html">
    <div>
        <h1> Todo list </h1>

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
    </div>
</template>

<script>
    export default {
        data : function() {
            return {
                todoText: ''
            }
        },
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
    }
</script>

<style lang="sass" scoped>

</style>