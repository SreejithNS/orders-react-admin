const setLocation = (location) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fb = getFirestore();
        const ref = fb.collection('admin').doc('appSettings');
        ref.update({location})
            .then(()=>dispatch({type:'LOCATION_CHANGED'}))
    }
}
const setPricelist = (pricelist) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fb = getFirestore();
        const ref = fb.collection('admin').doc('appSettings');
        ref.update({pricelist})
            .then(()=>dispatch({type:'PRICELISTCODE_CHANGED'}))
    }
}

export {setLocation,setPricelist }