import React, {Component,Fragment} from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Paper, Box} from "@material-ui/core";
import {Menu} from '@material-ui/icons';
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
import {Redirect} from 'react-router-dom';
import Loading from "./components/Loading";
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
            pageTitle:'Sales Department',
            redirect:false,
            saleId:''
        }
    
        doRedirect=(event, rowData) => this.setState({redirect:true,saleId:rowData.id})

    render(){
        const {props,state,doRedirect} = this;
        const {onsale} = this.props;
        const {saleId,redirect} = this.state;
        return(
            <Fragment>
            <div className={props.classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                            <IconButton className={props.classes.menuButton} color="inherit" aria-label="Menu"  onClick={props.toggleSideMenu}>
                                <Menu />
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
                    {onsale?<div className={props.classes.content}>
                        <Paper className={props.classes.toolbox}>
                            <Box display="flex" alignItems="center" pl={2} pt={2}>
                                <SettingsIcon mr={1}/><Typography variant="h6" color='textPrimary'>Sales</Typography>
                            </Box>
                        </Paper>
                        <MaterialTable
                            title="On Sale"
                            columns={[
                                {title:"Location",field:"location",searchable:true},
                                {title:"Salesman",field:"salesmanName",searchable:true},
                                {title:"Taken",field:"totalAmount",type:'numeric',searchable:true}
                            ]}
                            data={onsale}
                            actions={[
                                rowData => ({
                                    icon:'dashboard',
                                    tooltip: 'Manage',
                                    onClick: doRedirect
                                })
                            ]}
                        />
                        {redirect? <Redirect to={"/sales/"+saleId} />:""}
                    </div>:<Loading/>}
                </Route>
                <Route path='/sales/new'>
                    <NewSale/>
                </Route>
                <Route  path="/sales/:id" render={props => (
                    <SaleDashboard salesId={props.match.params.id}/>
                )}/>
            </Switch>
            </Fragment>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
        onsale:state.firestore.ordered.onsale
    }
};

export default compose(
    firestoreConnect([
        {
            collection:'sales',
            where:[
                ['status','==','On-Sale']
            ],
            storeAs:'onsale'
        }
    ]),
    connect(mapStateToProps),
    withStyles(css)
)(Dashboard)