import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import Loading from '../../components/Loading';
import { Paper, Typography, Grid, Box } from '@material-ui/core';
import { AccountCircleSharp, DashboardRounded, PlaceRounded, DateRangeRounded } from '@material-ui/icons';
// import AddItems from './components/AddItems';
import moment from 'moment';
import MaterialTable from 'material-table';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
const generateClassName = createGenerateClassName({
  productionPrefix: 'mt',
  seed: 'mt'
});
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
        const {saleId,data,updateTaken} = this.props;
        return (data)?
            <Paper elevation={0} className={root}>
                <Paper className={detailsCard}>
                    <Box display="flex" justify="center" alignItems="center">
                        <DashboardRounded/>
                        <Typography variant="body1">
                            Sale Dashboard
                        </Typography>
                    </Box>
                    <Grid container justify="center">
                        <Grid item xs={12} sm={3} container display="flex" alignItems="center">
                            <AccountCircleSharp />
                            <Typography variant="subtitle1" color="textPrimary">
                                {data.salesmanName.split(" ")[0]}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3} container display="flex" alignItems="center">
                            <PlaceRounded />
                            <Typography variant="subtitle1" color="textPrimary">
                                {data.location + " | " + data.pricelist}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3} container display="flex" alignItems="center">
                            <DateRangeRounded />
                            <Typography variant="subtitle1" color="textPrimary">
                                {moment(data.date.toString()).format("Do MMM")}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
                <StylesProvider generateClassName={generateClassName}>
                <MaterialTable
                    title="Taken Items"
                    columns={[
                        {title:'Item',field:'itemName'},
                        {title:'Quantity',field:'quantity'},
                        {title:'Amount',field:'amount'}
                    ]}
                    data={data.takenItems}
                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve, reject) => {
                                const data = this.parseData();
                                data.push(newData);
                                updateTaken(data.takenItems,resolve);
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                const data = this.parseData();
                                const index = data.indexOf(oldData)
                                data[index] = newData;
                                //this.setState({ data }, () => resolve());
                                updateTaken(data.takenItems,resolve);
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                let data = this.parseData();
                                const index = data.indexOf(oldData);
                                data.splice(index, 1);
                                //this.setState({ data }, () => resolve());
                                updateTaken(saleId,data.takenItems,resolve);
                            }),
                        }}
                />
                </StylesProvider>
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
        },
        {
            collection:'orders',
            where:['saleId','==',props.saleId],
            storeAs:'sold'
        }
    ]),
    connect(mapStateToProps),
    withStyles(css)
)(SaleDashboard)