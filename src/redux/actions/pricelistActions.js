const updateData = (code,data,res) =>{
    return (dispatch,getState,{getFirebase,getFirestore})=>{
        const fs = getFirestore();
        fs.collection("pricelists").doc(code).set(data).then(()=>{
            res();
        })
    }
}

export {updateData}