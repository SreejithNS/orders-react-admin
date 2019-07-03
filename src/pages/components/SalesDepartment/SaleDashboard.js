import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import Loading from '../Loading';
import { Paper, Typography, Grid, Button} from '@material-ui/core';
import { PlaceRounded, DateRangeRounded } from '@material-ui/icons';
import Bills from './components/Bills';
import Taken from './Taken';
import Container from './components/Container';
import {updateTaken} from '../../../redux/actions/salesActions';
import moment from 'moment';
// import {Redirect} from 'react-router-dom';
const css ={
    root:{
        paddingTop:"8px"
    },
    detailsCard:{
        margin:"4px",
        padding:"4px"
    }
}

class SaleDashboard extends Component{
    state={
        
    }
    render(){
        const {root,detailsCard} = this.props.classes;
        const {data,bills,salesId} = this.props;
        return (data)?
            <Paper elevation={0} className={root}>
                <Paper className={detailsCard}>
                  <Grid container justify="space-between"> 
                    <Grid item xs={6} container justify="center">
                        <Grid item xs={12} container display="flex" alignItems="center">
                         {/*<AccountCircleSharp />*/}
                            <Typography variant="subtitle1" color="textSecondary">
                                Sales Man: 
                            </Typography>
                            <Typography variant="subtitle1" color="textPrimary">
                                {data.salesmanName}
                            </Typography>
                        </Grid>
                        <Grid item xs container display="flex" alignItems="center">
                            <PlaceRounded />
                            <Typography variant="subtitle1" color="textPrimary">
                                {data.location + " | " + data.pricelist}
                            </Typography>
                        </Grid>
                        <Grid item xs container display="flex" alignItems="center">
                            <DateRangeRounded />
                            <Typography variant="subtitle1" color="textPrimary">
                                {moment(data.date.toDate().toString()).format("Do MMM")}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} container display="flex" justify="flex-start">
                         <Button variant="outlined">update container</Button> 
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Taken stock={data.takenItems} saleId={salesId} amount={data.totalAmount} pricelistCode={data.pricelist} selectedLocation={data.location}/>
                    </Grid>
                  </Grid>  
                </Paper>
                <Grid container alignItems="flex-start">
                    <Grid item xs={9} style={{padding:6}}>
                        <Bills bills={bills}/>
                    </Grid>
                    <Grid item xs={3} style={{padding:6}}>
                        <Container creditAmount={data.creditAmount} containerReturn={data.containerReturn} returnAmount={data.returnAmount} discountAmount={data.discountAmount}/>
                    </Grid>
                </Grid>
            </Paper>
            :<Loading/>
    }
}
const mapStateToProps = (state)=>{
    return {
        data:state.firestore.data.sale,
        bills:state.firestore.data.bills
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        updateTaken:(a,b,c)=>dispatch(updateTaken(a,b,c))
    }
}
export default compose(
    firestoreConnect((props)=>[
        {
            collection:'sales',
            doc:props.salesId,
            storeAs:"sale"
        },
        {
            collection:'orders',
            orderBy:['date','desc'],
            where: [
                ['saleId', '==', props.salesId]
            ],
            storeAs:'bills'
        }
    ]),
    connect(mapStateToProps,mapDispatchToProps),
    withStyles(css)
)(SaleDashboard)