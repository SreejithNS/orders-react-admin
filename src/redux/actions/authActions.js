const signIn = () =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const firebase = getFirebase();
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            dispatch({
                type:"USER_LOGGED",
                payload:{...result.user}
            })
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