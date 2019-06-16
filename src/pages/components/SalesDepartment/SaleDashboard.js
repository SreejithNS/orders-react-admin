import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import Loading from '../../components/Loading';
import { Paper, Typography, Grid, Box } from '@material-ui/core';
import { AccountCircleSharp, DashboardRounded } from '@material-ui/icons';
// import AddItems from './components/AddItems';
// import moment from 'moment';
// import {newSale} from '../../../redux/actions/salesActions';
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
        const {data} = this.props;
        return (data)?
            <Paper elevation={0} className={root}>
                <Paper className={detailsCard}>
                    <Box display="flex" justify="center" alignItems="center">
                        <DashboardRounded/>
                        <Typography variant="body1">
                            Sale Dashboard
                        </Typography>
                    </Box>
                    <Grid container>
                        <Grid item container display="flex" alignItems="center">
                            <AccountCircleSharp />
                            <Typography variant="subtitle1" color="textPrimary">
                                {data.salesmanName.split(" ")[0]}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Paper>
            :<Loading/>
    }
}
const mapStateToProps = (state)=>{
    return {
        data:state.firestore.data.sale
    }
}
export default compose(
    firestoreConnect((props)=>[
        {
            collection:'sales',
            doc:props.saleId,
            storeAs:"sale"
        }
    ]),
    connect(mapStateToProps),
    withStyles(css)
)(SaleDashboard)