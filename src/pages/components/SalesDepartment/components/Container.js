import React, {Component} from 'react';
import {Grid,withStyles,Typography, Paper, Box} from "@material-ui/core";

const css = theme => {
    return {
        root:{
            padding:6
        },
        itemBox:{
            padding:6,
            borderRadius:6,
            backgroundColor:theme.palette.primary.main,
            flexDirection:'column',
            flexGrow:1,
            justifyContent:'space-between'
        }
    }
}

class Container extends Component {
    state={

    }
    render(){
        const {containerReturn,returnAmount,discountAmount,creditAmount} = this.props;
        const {root,itemBox} = this.props.classes
        return (<div>
            <Paper className={root}>
            <Grid container spacing={1} justify="space-around">
                <Grid item xs={12}>
                    <Typography variant="h6">Container</Typography>
                </Grid>
                <Grid item container spacing={1} xs={12} justify="space-around">
                    {containerReturn.map((item,key)=>
                        <Grid key={key} item xs={6} md={4} container justify="space-around" >
                            <Box display="flex" className={itemBox}>
                                <Typography variant="caption" style={{color:"#fff"}}>{item.itemName}</Typography>
                                <Typography variant="h5" style={{color:"#fff",textAlign:'right'}}>{item.quantity}</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
                <Grid item container spacing={1} xs={12} justify="space-around">
                    <Grid item xs={12} md={6} container justify="space-around" >
                        <Box display="flex" className={itemBox}>
                            <Typography variant="caption" style={{color:"#fff"}}>Total Discount</Typography>
                            <Typography variant="h5" style={{color:"#fff",textAlign:'right'}}>₹{discountAmount}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} container justify="space-around" >
                        <Box display="flex" className={itemBox}>
                            <Typography variant="caption" style={{color:"#fff"}}>Total Credits</Typography>
                            <Typography variant="h5" style={{color:"#fff",textAlign:'right'}}>₹{creditAmount}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} container justify="space-around" >
                        <Box display="flex" className={itemBox}>
                            <Typography variant="caption" style={{color:"#fff"}}>Total Return</Typography>
                            <Typography variant="h5" style={{color:"#fff",textAlign:'right'}}>₹{returnAmount}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            </Paper>
            </div>
        )
    }
}

export default withStyles(css)(Container);