/**
 * Created by Afaci on 01/04/2017.
 */
import Firebase from "../../node_modules/firebase/app";
import Auth from '../../node_modules/firebase/auth';
import Database from '../../node_modules/firebase/database';
import Storage from '../../node_modules/firebase/storage'
import Config from "./firebase.config";

export default Firebase.initializeApp(Config);