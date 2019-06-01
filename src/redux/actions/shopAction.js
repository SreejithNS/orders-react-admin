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
const uploadCsv = (data,next)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const db = getFirestore();
        var batch = db.batch();
        data.map((doc) => {
            var docRef = db.collection("shops").doc(); //automatically generate unique id
            return batch.set(docRef, doc);
        });
        batch.commit().then(next)
    }
}
const bulkDelete = (data,next)=>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const db = getFirestore();
        var batch = db.batch();
        data.map((doc) => {
            var docRef = db.collection("shops").doc(doc.id); //automatically generate unique id
            return batch.delete(docRef);
        });
        batch.commit().then(next)
    }
}
export {updateShop,deleteShop,newShop,uploadCsv,bulkDelete}