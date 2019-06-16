const newSale = (data,next) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("sales").add(data).then((doc)=>{
            next(doc.id);
        })
    }
}
export {newSale};