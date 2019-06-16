import React, {Component,Fragment} from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Paper, Box} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings'
import {withStyles} from '@material-ui/core/styles';
import LoginButton from './components/LoginButton';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import { Switch, Route} from 'react-router-dom';
import NewSale from "./components/SalesDepartment/NewSale";
import SaleDashboard from './components/SalesDepartment/SaleDashboard';
import MaterialTable from 'material-table';
var css = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft:-12,
      marginRight: 20,
    },
    content:{
        padding:8,
        height:90
    },
    toolbox:{
        marginBottom:8
    }
};


class Dashboard extends Component{

        state = {
            pageTitle:'Sales Department'
        }

    render(){
        const {props,state} = this;
        return(
            <Fragment>
            <div className={props.classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                            <IconButton className={props.classes.menuButton} color="inherit" aria-label="Menu"  onClick={props.toggleSideMenu}>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={props.classes.grow}>
                                {state.pageTitle}
                            </Typography>
                            <LoginButton/>
                            </Toolbar>
                        </AppBar>
                    </div>
                <Switch>
                <Route exact path="/sales/">
                    <div className={props.classes.content}>
                        <Paper className={props.classes.toolbox}>
                            <Box display="flex" alignItems="center" pl={2} pt={2}>
                                <SettingsIcon mr={1}/><Typography variant="h6" color='textPrimary'>Sales</Typography>
                            </Box>
                        </Paper>
                        <MaterialTable
                            title="Reports"
                            columns={[
                                {title:"Location",field:"location",searchable:true},
                                {title:"Salesman",field:"salesmanName",searchable:true},
                                {title:"Status",field:"status",searchable:true},
                                {title:"Cash Received",field:"totalAmount",type:"numeric"}
                            ]}
                            data={[
                                {location:"TPT",salesmanName:"Mani",status:"In-Line",totalAmount:42513},
                                {location:"VNB",salesmanName:"Mani",status:"Reported",totalAmount:42513}
                            ]}
                            actions={[
                                rowData => ({
                                    icon: 'edit',
                                    tooltip: 'Delete User',
                                    onClick: (event, rowData) => alert("You want to delete " + rowData.location),
                                    disabled: rowData.status === "Reported"
                                })
                            ]}
                        />
                    </div>
                </Route>
                <Route path='/sales/new'>
                    <NewSale/>
                </Route>
                <Route  path="/sales/:id" render={props => (
                    <SaleDashboard saleId={props.match.params.id}/>
                )}/>
            </Switch>
            </Fragment>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
    }
};

export default compose(
    firestoreConnect([]),
    connect(mapStateToProps),
    withStyles(css)
)(Dashboard)