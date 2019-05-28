import React, {Component} from "react";
import ReactDOM from 'react-dom';
import { setLocation,setPricelist } from "../../../redux/actions/settingsActions"
import { connect } from "react-redux";
import {  Paper, Typography, withStyles, Select, OutlinedInput, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText } from "@material-ui/core";
import { compose } from "redux";
import {firestoreConnect} from 'react-redux-firebase';
import Loading from "../../components/Loading"
const css =(theme)=>{
    return{
        content:{
            padding:8
        },
        formControl: {
            margin: theme.spacing.unit,
            minWidth: 120,
        }
    }
}

class Pricelist extends Component {
    state={
        labelWidth:0
    }

    getPricelists(){
        if(!this.props.admin || !this.props.pricelists) return <Loading/>
        const {pricelists} = this.props;
        var priceLists = [];
        for(var pricelist in pricelists){
            priceLists.push(pricelist)
        }
        return priceLists
    }
    getLocations(){
        if(!this.props.admin || !this.props.pricelists) return <Loading/>
        const {pricelists,admin} = this.props;
        const pricelistCode = admin.appSettings.pricelist;
        var locations = [];
        for(var place in pricelists[pricelistCode]){
            locations.push(place)
        }
        return locations
    }

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
        });
    }
    render(){
        const {props} = this;
        const {classes} = props
        
         return(
            <Paper className={classes.content}>
                <Typography variant="subtitle1" color="textSecondary">
                    Location
                </Typography>
                <List>
                <ListItem>
                <ListItemText>Pricelist</ListItemText>
                 <FormControl variant="outlined" className={classes.formControl}>
                <Select
                    value={(props.admin)?props.admin.appSettings.pricelist:"Loading"}
                    id="outlines-pricelist-simple"
                    onChange={(event)=>props.setPricelist(event.target.value)}
                    input={
                    <OutlinedInput
                        labelWidth={this.state.labelWidth}
                        name="pricelist"
                        id="outlined-pricelist-simple"
                    />
                    }
                >
                {Array.isArray(this.getPricelists())?this.getPricelists().map(pricelist=><MenuItem value={pricelist}>{pricelist}</MenuItem>):this.getPricelists()}
                </Select>
                </FormControl>
                
                </ListItem>
                <ListItem>
                <ListItemText>Location</ListItemText>
               <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel
                    ref={ref => {
                    this.InputLabelRef = ref;
                    }}
                    htmlFor="outlined-location-simple"
                >
                    {props.pricelistCode}
                </InputLabel>
                <Select
                    value={(props.admin)?props.admin.appSettings.location:"Loading"}
                    id="outlines-location-simple"
                    onChange={(event)=>props.setLocation(event.target.value)}
                    input={
                    <OutlinedInput
                        labelWidth={this.state.labelWidth}
                        name="location"
                        id="outlined-location-simple"
                    />
                    }
                >
                {Array.isArray(this.getLocations())?this.getLocations().map(place=><MenuItem value={place}>{place}</MenuItem>):this.getLocations()}
                </Select>
                </FormControl>
                </ListItem>
                </List>
            </Paper>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        pricelists:state.firestore.data.pricelists,
        admin:state.firestore.data.admin
    }
}
const mapDispatchToProps = (dispatch)=>{
    return{
        setLocation:(name)=>dispatch(setLocation(name)),
        setPricelist:(name)=>dispatch(setPricelist(name))
    }
}

export default compose(connect(mapStateToProps,mapDispatchToProps), firestoreConnect([
    {
        collection:"pricelists"
    },
    {
        collection:'admin'
    }
]) ,withStyles(css))(Pricelist)