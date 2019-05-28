import React, {Component,Fragment} from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Paper, List, ListItem, ListItemText, Chip, Box} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings'
import {withStyles} from '@material-ui/core/styles';
import LoginButton from './components/LoginButton';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
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


class Dashboard extends Component{

        state = {
            pageTitle:'Dashboard'
        }

    render(){
        const {props,state} = this;
        const {admin} = this.props;
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
                    <Paper m={6}>
                    <Box display="flex" pl={2} pt={2}>
                        <SettingsIcon/><Typography variant="body1" color='textPrimary'>Configuration</Typography>
                    </Box>
                        <List>
                            <ListItem>
                                <ListItemText>Location: {admin?admin.appSettings.location:""}</ListItemText>
                            </ListItem>
                        </List>
                    </Paper>
                </div>
            </Fragment>
        )
    }
}
const mapStateToProps = (state)=>{
    return {
        admin:state.firestore.data.admin
    }
};

export default compose(
    firestoreConnect([
        {collection:'admin'}
    ]),
    connect(mapStateToProps,null),
    withStyles(css)
)(Dashboard)