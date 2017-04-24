/**
 * Created by Afaci on 27/03/2017.
 */

import axios from "axios";
import firebase from "./firebase";
export default {
    state: {
        loading: 0, //0 init, 1 started, 2 undefined, 3 error, 4 ok
        blogEntries: [],
        error: null
    },

    mutations: {
        setBlogEntries: function(state, payload) {
            state.blogEntries = payload.entries;
        },
        setLoading: function(state, payload) {
            state.loading = payload.loading;
        },
        setError: function(state, payload) {
            state.error = payload.error;
        }
    },
    actions: {
        loadBlogEntries: function(context, payload) {
            var vm = this;
            firebase.auth().signInAnonymously().catch(function(error) {
                context.commit('setError', {error: error});
                context.commit('setLoading', {loading: 3});
                console.error(error);
            }).then(function() {
                context.commit('setLoading', {loading: 1});
                firebase.database().ref('blogs').on('value', function (snapshot) {
                    var blogEntries = [];
                    snapshot.forEach(function (childSnapshot) {
                        var value = childSnapshot.val();
                        value.message = value.message.replace(new RegExp("\n", "g"), '<br/>');
                        blogEntries.push(value);
                    });
                    blogEntries.reverse();
                    context.commit('setBlogEntries', { entries: blogEntries });
                    context.commit('setLoading', { loading: 4 });
                });
            });
        }
    }
}