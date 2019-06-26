import React, {Component,Fragment} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Toolbar,AppBar,Typography,IconButton} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
//import SettingsIcon from '@material-ui/icons/Settings'
import {withStyles} from '@material-ui/core/styles';
import LoginButton from './components/LoginButton';
import Content from './components/PricelistManager/Content';
import Edit from './components/PricelistManager/Edit'

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
    }
};


class PricelistManager extends Component{

        state = {
            pageTitle:'Pricelist Manager'
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
                <div className={props.classes.content}>
                    <Switch>
                        <Route exact path="/pricelistmanager/">
                          <Content />
                        </Route>
                        <Route  path="/pricelistmanager/edit/:id" render={props => (
                            <Edit code={props.match.params.id}/>
                        )}/>
                    </Switch>
                </div>
            </Fragment>
        )
    }
}

export default withStyles(css)(PricelistManager)