import React, {Component, Fragment} from 'react';
//import {withStyles} from '@material-ui/core/styles';
import {Typography, Paper} from '@material-ui/core'
import {firestoreConnect} from 'react-redux-firebase';
import {compose} from "redux";
import {connect} from "react-redux";
import {Button, Chip} from "@material-ui/core";
import QuantityDialog from "./QuantityDialog";
import Loading from "../../../components/Loading";

class AddItems extends Component {
    state={
        dialogOpen:false
    }
    toggle(){
        this.setState({
            dialogOpen:!this.state.dialogOpen
        })
    }
    pricelistParser=()=>{
        var groupBy = function(xs, key) {return xs.reduce(function(rv, x) {(rv[x[key]] = rv[x[key]] || []).push(x);return rv;}, {});};
        const {props} =this;
        if(!props.pricelist) return false
        const {pricelist,location} = props;
        var parsedData = []
        for(var brand in pricelist[location]){
            for(var itemGroup in pricelist[location][brand]){
                // eslint-disable-next-line
                pricelist[location][brand][itemGroup].map(item=>parsedData.push(item))
            }
        }
        parsedData = groupBy(parsedData,"itemGroup");
        var itemsGroup = [];
        for(var group in parsedData) itemsGroup.push(group);
        return {parsedData,itemsGroup};
    }

    selectItem(event){
        event.preventDefault();
        event.persist();
        var code,name,weight,rate;
        code   = event.currentTarget.attributes.code.value;
        weight = parseInt(event.currentTarget.attributes.weight.value);
        rate   = parseInt(event.currentTarget.attributes.rate.value);
        name   = event.currentTarget.attributes.itemname.value;
        this.setState({
            dialogOpen:true,
            selectedItem:{code,weight,rate,name}
        })
    }

    addItem=(item)=>{
        var newList = [...this.props.containerItems,item];
        var newTotal = this.props.totalAmount+item.amount;
        this.props.updateContainer({
            containerItems:newList,
            totalAmount:newTotal
        })
    }
    tempList(){
        if(this.props.containerItems.length === 0) return ''
        return this.props.containerItems.map((item,key)=>
            <Chip
                label={item.itemName+" - "+item.amount}
                key={key}
                onDelete={(e)=>this.handleChipDelete(e,key)}
                style={{margin:"3px"}}
                color="primary"
            />
        )
    }
    handleChipDelete(e,key){
        e.preventDefault();
        var newList = this.props.containerItems;
        var totalAmount = this.props.totalAmount - this.props.containerItems[key].amount
        newList.splice(key,1)
        this.props.updateContainer({containerItems:newList,totalAmount});
    }
    render(){
        const data = this.pricelistParser();
        return(
            <Fragment>
                <Paper style={{margin:"5px",padding:"12px"}} elevation={0}>
                {(data)?
                    data.itemsGroup.map((groupName,key)=>
                    <Fragment  key={key}>
                    <Typography variant="body1" color="textPrimary">{groupName}</Typography>
                    {data.parsedData[groupName].map((item,key)=>
                        <Button
                        key={key}
                        variant="outlined"
                        code={item.itemCode}
                        itemname={item.itemName}
                        weight={item.itemWeight}
                        rate={item.itemRate}
                        style={{margin:"3px"}}
                        onClick={(e)=>this.selectItem(e)}
                        >
                        {item.itemName}
                        </Button>
                    )}<br/>
                    </Fragment>
                    )
                    :<Loading/>}
                </Paper>
            <Paper style={{margin:"6px 8px",padding:"12px",transition:"1s"}} elevation={(this.tempList()!=='')?4:0}>
                {(this.tempList() !== '')?
                    <Fragment>
                    <Typography
                        variant="body2"
                        style={{marginLeft:"3px"}}
                        color="textSecondary"
                        >
                    Items in your order:
                    </Typography>
                    {this.tempList()}
                    </Fragment>
                :""}
            </Paper>
                <QuantityDialog
                    addItem={this.addItem.bind(this)}
                    open={this.state.dialogOpen}
                    toggle={this.toggle.bind(this)} {...this.state.selectedItem}
                />
            </Fragment>
        )
    }
}

const stateToProps = (state) =>{
    return{
        pricelist:state.firestore.data.plist
    }
}

export default  compose(
    connect(stateToProps),
    firestoreConnect(props=>[
        {
            collection:"pricelists",
            doc:props.pricelistCode,
            storeAs:"plist"
        }
    ])
)(AddItems)