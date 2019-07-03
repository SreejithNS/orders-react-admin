import React,{Component} from 'react';
import { Paper, withStyles,Grid, Typography, Chip, Tooltip, IconButton } from '@material-ui/core';
import Loading from '../Loading';
import { LoupeRounded } from '@material-ui/icons';
import SendTopup from './components/SendTopup';
const css=theme=>{return {
    root:{
        padding:6,
        display:'inline-block'
    },
    stockWrap:{
        margin:2,
        borderRadius:8,
        padding:2
    }
}
}
class Taken extends Component {
    state={
        topupDialog:false
    }
    stockList=()=>{
        var stock = this.props.stock;
        var stockList = []
        for(let orderId in stock){
            stock[orderId].orderId = orderId;
            stockList.push(stock[orderId])
        }
        return stockList;
    }
    render(){
        const {stock,amount,saleId,selectedLocation,pricelistCode} = this.props;
        const {stockList} = this;
        const {root} = this.props.classes;
        const {topupDialog} = this.state;
        return(
            <Paper className={root} elevation={0} style={{border:"1px solid #aaa",display:"flex"}}>
                <Grid container alignItems="stretch" justify="space-between" style={{flexGrow:1}}>
                    <Grid item style={{marginLeft:"6px"}} xs={12} container alignItems="center">
                        <Typography variant="h6">Taken Items</Typography>
                        <Tooltip title="Send a Topup">
                            <IconButton onClick={()=>this.setState({topupDialog:true})} aria-label="Delete" style={{margin:1}} size="small">
                                <LoupeRounded fontSize="inherit" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        {(stock === undefined || stock === null)?
                            <Loading/>:
                            stockList().map((item,id)=>
                                <Tooltip key={id} title={item.quantity+"p | ₹"+item.amount}>
                                    <Chip style={{margin:1}} label={item.itemName}/>
                                </Tooltip>
                            )
                        }
                        <Chip style={{margin:1}} label={"Total ₹"+amount}/>
                    </Grid>
                </Grid>
                <SendTopup open={topupDialog} saleId={saleId} handleClose={()=>this.setState({topupDialog:false})} selectedLocation={selectedLocation} pricelistCode={pricelistCode}/>
            </Paper>
        ) 
    }
}

export default withStyles(css)(Taken)