/**
 * Created by Afaci on 27/03/2017.
 */

import axios from "axios";
import firebase from "./firebase";
export default {
    state: {
        loading: 0,
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
            firebase.auth().signInAnonymously().catch(function(error) {
                context.commit('setError', {error: error});
                context.commit('setLoading', 3);
                console.log(error);
            }).then(() => {
                context.commit('setLoading', 1);
                firebase.database().ref('blogs').on('value', (snapshot) =>{
                    let blogEntries = [];
                    snapshot.forEach((childSnapshot) => {
                        var value = childSnapshot.val();
                        value.message = value.message.replace( new RegExp( "\n", "g" ),'<br/>');
                        blogEntries.push(value);
                    });
                    blogEntries.reverse();
                    //this.entries = blogEntries;
                    //loadinginfo.style.display = "none";
                    context.commit('setBlogEntries', {entries: blogEntries});
                    context.commit('setLoading', 4);
                });
            });
        }
    }
}