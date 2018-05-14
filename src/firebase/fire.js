import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyBTjNRoIVtdeKu4SsbGzSYjBIA2cFuPzzs",
    authDomain: "mznt-app.firebaseapp.com",
    databaseURL: "https://mznt-app.firebaseio.com",
    projectId: "mznt-app",
    storageBucket: "mznt-app.appspot.com",
    messagingSenderId: "616860408101"
};

var fire = firebase.initializeApp(config);

const auth = fire.auth();
const db = fire.database();
const storage = fire.storage();

export {
    auth,
    db,
    storage
};