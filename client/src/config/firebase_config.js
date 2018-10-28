import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyAlRpGQL-iX0UOv2Wssir2bIIKaYpPG-iw",
    authDomain: "react-social-network-7e88b.firebaseapp.com",
    databaseURL: "https://react-social-network-7e88b.firebaseio.com",
    projectId: "react-social-network-7e88b",
    storageBucket: "react-social-network-7e88b.appspot.com",
    messagingSenderId: "906593123724"
};

const app = firebase.initializeApp(config);
firebase.firestore().settings({timestampsInSnapshots: true})

export {app}
