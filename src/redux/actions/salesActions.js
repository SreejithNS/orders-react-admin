const newSale = (data,next) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("sales").add(data).then((doc)=>{
            next(doc.id);
        })
    }
}
const updateTaken = (id,salesman,data,res) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("sales").doc(id).set(data).then(()=>{
           res();
        })
    }
}
export {newSale,updateTaken};