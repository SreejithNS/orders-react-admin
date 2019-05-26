const signIn = () =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const firebase = getFirebase();
        const firestore = getFirestore();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var user = result.user;
            var uid = user.uid;
            var name = user.displayName;
            var dp = user.photoURL
            var email = user.email || "notprovided"
            dispatch({
                type:"USER_LOGGED",
                payload:{uid,name}
            })
            return firestore.collection('users').doc(uid).set({
                name,dp,email,shop:true
            })
            }).then(()=>{
                dispatch({type:"USER_DATA_UPDATED"})
            })

        }
}
const signOut = () =>{
    return (dispatch,getState,{getFirebase})=>{
        const firebase = getFirebase();
        firebase.auth().signOut().then(function() {
            dispatch({
                type:"USER_LOGGED_OUT"
            })
        })
}
}

export {signIn,signOut}