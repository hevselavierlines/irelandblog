/**
 * Created by Afaci on 27/03/2017.
 */

import axios from "axios";
import firebase from "./firebase";
export default {
    state: {
        loading: 0,
        blogEntries: []
    },

    mutations: {
        setBlogEntries: function(state, payload) {
            state.blogEntries = payload.entries;
        },
        setLoading: function(state, payload) {
            state.loading = payload.loading;
        }
    },
    actions: {
        loadBlogEntries: function(context, payload) {
            firebase.auth().signInAnonymously().catch(function(error) {
                console.error(error.message);
                //this.status = "error";
                context.commit('setLoading', 3);
            }).then(() => {
                //this.status = "signed in";
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