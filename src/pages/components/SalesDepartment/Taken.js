import React,{Component} from 'react';
import { Paper, withStyles,Grid, Typography, Chip, Tooltip } from '@material-ui/core';
import Loading from '../Loading';
const css=theme=>{console.log(theme);return {
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
        const {stock} = this.props;
        const {stockList} = this;
        const {root} = this.props.classes
        return(
            <Paper className={root} elevation={0} style={{border:"1px solid #aaa",display:"flex"}}>
                <Grid container alignItems="stretch" justify="space-between" style={{flexGrow:1}}>
                    <Grid item style={{marginLeft:"6px"}} xs={12}>
                        <Typography variant="h6">Taken Items</Typography>
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
                    </Grid>
                </Grid>
            </Paper>
        ) 
    }
}

export default withStyles(css)(Taken)