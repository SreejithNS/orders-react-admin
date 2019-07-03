import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddItems from './AddItems';
import { SendSharp, LoupeRounded } from '@material-ui/icons';
import firebase from './../../../../config/firebaseConfig';
import Loading from '../../Loading';
import { Typography, Box } from '@material-ui/core';

class SendTopup extends React.Component {
    state={
        loading:false,
        sendability:true,
        containerItems:[],
        totalAmount:0
    }
    updateContainer = (payload)=>{
        this.setState({
            ...payload
        })
    }
    sendability=()=>{
        const {containerItems,totalAmount,loading} = this.state;
        if(containerItems.length < 1 || totalAmount === 0) return true;
        if(containerItems.findIndex(item=>item.quantity === 0) !== -1) return true;
        if(loading) return true;
        return false;
    }
    send=()=>{
        this.setState({loading:true});
        const {saleId} = this.props;
        const {containerItems} = this.state;
        var docRef = firebase.firestore().collection("sales").doc(saleId);
        firebase.firestore().runTransaction((transaction)=>{
                return transaction.get(docRef).then((doc)=>{
                const data = doc.data();
                var containerReturn = data.containerReturn;
                var takenItems = data.takenItems;
                var totalAmount = data.totalAmount;
                    containerItems.forEach((topupItem)=>{
                    //eslint-disable-next-line    
                    var index = takenItems.findIndex(takenItem => takenItem.itemCode === topupItem.itemCode);
                    if(index === -1){
                        takenItems.push(topupItem);
                        containerReturn.push(topupItem);
                    }else{
                        takenItems[index].quantity += topupItem.quantity;
                        takenItems[index].amount += topupItem.amount;
                        containerReturn[index].quantity += topupItem.quantity;
                        containerReturn[index].amount += topupItem.amount;
                    }
                    totalAmount += parseInt(topupItem.amount);
                    })
                return transaction.update(docRef,{
                    takenItems,containerReturn,totalAmount
                })
                });
            }).then(()=>{this.setState({loading:false,containerItems:[],totalAmount:0});return this.props.handleClose()})
            .catch(()=>this.setState({loading:false}))
    }
    render() {
        const {props,updateContainer,sendability,send} = this;
        const {totalAmount,containerItems,loading} = this.state;
        const {selectedLocation,pricelistCode} = props;
        return (
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">
                <Box display="flex" alignItems="center">
                    <LoupeRounded fontSizeInherit style={{marginRight:2}}/>
                    <Typography variant="subtitle1">Send Topup</Typography>
                </Box>
            </DialogTitle>
            <DialogContent>
                <AddItems location={selectedLocation} totalAmount={totalAmount} pricelistCode={pricelistCode} containerItems={containerItems} updateContainer={updateContainer} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} disabled={loading} color="primary">
                    Cancel
                </Button>
                <Button onClick={send} color="primary" disabled={sendability()} autoFocus>
                    Send
                    {loading?<Loading/>:<SendSharp fontSize="small"/>}
                </Button>
            </DialogActions>
            </Dialog>
        );
    }
}

export default SendTopup;

