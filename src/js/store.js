/**
 * Created by Afaci on 27/03/2017.
 */

import axios from "axios";
export default {
    state: {
        todos: [],
        loading: false
    },
    mutations: {
        setLoading: function(state, loading) {
            state.loading = loading;
        },
        setTodos: function(state, payload) {
            state.todos = payload.todos;
        },
        setError: function(state, payload) {
            state.error = message;
        }
    },
    actions: {
        loadTodos: function(context, payload) {
            context.commit('setLoading', true);
            axios.get('http://localhost:8080/todos')
                .then((result) => {
                    //set todos
                    context.commit('setTodos', {todos: result.data.data});
                    context.commit('setLoading', false);
                }).catch((error) => {
                    //set error
                    context.commit('setError', error.message);
                    context.commit('setLoading', false);
                });
        },
        addTodo: function(context, payload) {
            context.commit('setLoading', true);
            axios.post('http://localhost:8080/todos', {
                title: payload.text
            }).then((result) => {
                context.commit('setTodos', {todos: result.data.data});
                context.commit('setLoading', false);
            }).catch(error => {
                //set error
                context.commit('setError', error.message);
                context.commit('setLoading', false);
            });
        },
        removeTodo: function(context, payload) {
            context.commit('setLoading', true);
            axios.delete('http://localhost:8080/todos/' + payload.id)
                .then((result) => {
                    //set todos
                    context.commit('setTodos', {todos: result.data.data});
                    context.commit('setLoading', false);
                }).catch((error) => {
                    //set error
                    context.commit('setError', error.message);
                    context.commit('setLoading', false);
                });
        },
        setDone: function(context, payload) {
            context.commit('setLoading', true);
            axios.put('http://localhost:8080/todos/' + (payload.id) + '/' + ((payload.done) ? 'true' : 'false')).then((result) => {
                context.commit('setTodos', {todos: result.data.data});
                context.commit('setLoading', false);
            }).catch(error => {
                //set error
                context.commit('setError', error.message);
                context.commit('setLoading', false);
            });
        }
    }
}