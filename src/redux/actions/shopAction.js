const updateShop = (id,data,res) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("shops").doc(id).set(data).then(()=>{
            res();
        })
    }
}
const deleteShop = (id,res) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("shops").doc(id).delete().then(()=>{
            res();
        })
    }
}
const newShop = (data,res) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("shops").doc().set(data).then(()=>{
            res();
        })
    }
}
export {updateShop,deleteShop,newShop}