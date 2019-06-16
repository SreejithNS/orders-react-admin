import React, {Component} from 'react'
import {Paper, Box, Typography,TextField,Grid,Avatar, FormControl, Select, InputLabel, FormHelperText, MenuItem, Input, Button} from "@material-ui/core";
import {AccountCircleOutlined, Edit, PlaceSharp, BusinessCenter, DateRangeSharp, AccountBalanceWalletRounded} from "@material-ui/icons";
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import Loading from '../../components/Loading';
import AddItems from './components/AddItems';
import moment from 'moment';
import {newSale} from '../../../redux/actions/salesActions';
import {Redirect} from 'react-router-dom';
//import MaterialTable from 'material-table';

const css = {
    content:{
        padding:8
    },
    salesmanField:{
        maxWidth:"300px",
        width:"100%",
        marginRight:"4px"
    }
}

class NewSale extends Component{
    state={

        //Salesman Select
        chosenSalesman:{},
        salesmanChosen:false,
        salesmanField:'',
        avatarList:[],
        editSalesMan:false,

        //Location Select
        locationSelected:false,
        selectedLocation:'',
        editLocation:false,

        //Container
        containerItems:[],
        totalAmount:0,

        //
        redirect:false,
    }
    toggleSalesmanEdit = (entered)=>()=>{this.setState({editSalesMan:entered})}
    toggleLocationEdit = (entered)=>()=>{this.setState({editLocation:entered})}
    resetLocation =()=>this.setState({
        locationSelected:false,
        selectLocation:""
    })
    resetSalesman =()=>this.setState({
        chosenSalesman:{},
        salesmanChosen:false,
        avatarList:[]
    })
    selectSalesman = (id) => (e)=>{
        const {salesmenList} = this.props;
        return this.setState({
            salesmanChosen:true,
            salesmanField:salesmenList[id].name,
            chosenSalesman:salesmenList[id]
        })
    }
    getLocation=()=>{
        if(!this.props.settings || !this.props.pricelists) return <Loading/>
        const {settings,pricelists} = this.props;
        var locations=[];
        for(var location in pricelists[settings.pricelist]) locations.push(location)
        return locations;
    }
    selectLocation =(e)=>{
        const location = e.target.value;
        console.log("selectlocation",location)
        if(location) this.setState({
            locationSelected:true,
            selectedLocation:location
        })
    }
    typeSalesmanName(e){
        if(!this.props.salesmenList && e.target.value === '') return false;
        const {salesmenList} = this.props;
        const inp = e.target.value.toUpperCase().split('');
        var list = [];
        var avatarList = [];
        for(let id in salesmenList){
            const name = salesmenList[id].name.toUpperCase().split('').splice(0,inp.length).join('')
            if(inp.join('') === name){list.push({name:salesmenList[id].name,id});avatarList.push({id,src:salesmenList[id].dp});this.setState({salesmanField:e.target.value.toUpperCase(),avatarList:avatarList.splice(0,2)})}
        }
        return list;
    }
    updateContainer = (payload)=>{
        this.setState({
            ...payload
        })
    }
    redirect=(id)=>{
        this.setState({redirect:true,salesId:id})
    }
    startSale=()=>{
        const {chosenSalesman,selectedLocation,containerItems,totalAmount} = this.state;
        const {newSale,settings} = this.props;
        newSale({
            salesmanName:chosenSalesman.name,
            salesman:chosenSalesman,
            takenItems:containerItems,
            totalAmount,
            location:selectedLocation,
            pricelist:settings.pricelist,
            date:new Date(),
            status:'On-Sale',
            containerReturn:containerItems
        },this.redirect)
    }
    render(){
        const {
            state,
            props,
            toggleSalesmanEdit,
            resetSalesman,
            selectLocation,
            getLocation,
            resetLocation,
            toggleLocationEdit,
            updateContainer,
            startSale
        } = this;
        const {
            salesmanChosen,
            /*chosenSalesman,*/
            salesmanField,
            avatarList,
            editSalesMan,
            editLocation,
            selectedLocation,
            locationSelected,
            containerItems,
            totalAmount,
            redirect,
            salesId
        } = state;
        const {settings} = this.props;
        return(
            <Paper>
                <Box container display="flex" justifyContent="center">
                    <Box display="flex" alignItems="center" m={2}>
                        <BusinessCenter mr={1}/>
                        <Typography variant="h6" color='textPrimary'>Create Sales</Typography>
                    </Box>
                </Box>
                <Grid container direction="row" justify="space-around" alignItems="center" style={{margin:"5px 0px"}}>
                    <Grid item xs={6} sm={3} md={3} m={3} justifyContent="center">
                        {(!salesmanChosen || salesmanField === '')?
                        <form noValidate style={{display:"flex"}} autoComplete="off">
                            <Box display="flex" alignItems="center">
                            <TextField
                                id="newsale-salesman-name"
                                label="Sales Man"
                                value={salesmanField}
                                onChange={this.typeSalesmanName.bind(this)}
                                margin="dense"
                                className={props.classes.salesmanField}
                                variant="filled"
                            />
                            {(avatarList && avatarList.length!==0)?avatarList.map(({src,id},key)=><Avatar alt="Click to choose him" style={{margin:"5px",top:"5px",cursor:"pointer"}} key={key} onClick={this.selectSalesman(id)} src={src} />):''}
                            </Box>
                        </form>:
                        <Box display="flex" onMouseEnter={toggleSalesmanEdit(true)} onMouseLeave={toggleSalesmanEdit(false)} alignItems="center" p={2}>
                            <AccountCircleOutlined mr={1}/><Typography variant="h6" color='textPrimary'>{salesmanField.split(" ")[0]}</Typography>{(editSalesMan)?<Edit onClick={resetSalesman} style={{cursor:"pointer"}} ml={2}/>:""}
                        </Box>
                        }
                    </Grid>
                    <Grid item container xs={6} sm={3} md={3} m={3} justifyContent="center">
                    {locationSelected?
                        <Box display="flex" onMouseEnter={toggleLocationEdit(true)} onMouseLeave={toggleLocationEdit(false)} alignItems="center" p={2}>
                         <PlaceSharp mr={1}/>
                         <Typography variant="h6" color='textPrimary'>{selectedLocation}</Typography>
                         {(editLocation)?<Edit onClick={resetLocation} style={{cursor:"pointer"}} ml={2}/>:""}
                        </Box>
                    :""}
                    {(!Array.isArray(getLocation())||locationSelected)?(locationSelected)?"":<Loading/>:
                        <form>
                            <FormControl>
                                <InputLabel htmlFor="location-helper">Location</InputLabel>
                                <Select
                                    value={selectedLocation}
                                    onChange={selectLocation}
                                    input={<Input name="location" id="location-helper" />}
                                >
                                <MenuItem value="">
                                    <em>Select</em>
                                </MenuItem>
                                    {getLocation().map((location,key)=>
                                        <MenuItem key={key} value={location}>{location}</MenuItem>
                                    )}
                                </Select>
                                <FormHelperText>Locations from {settings?settings.pricelist:""}</FormHelperText>
                            </FormControl>
                        </form>
                    }
                    </Grid>

                    <Grid item container alignItems="center" xs={12} style={{padding:"8px"}}>
                    <DateRangeSharp />
                    <Typography color="textPrimary" fontSizeInherit variant="caption">
                        {moment(new Date().toString()).format("DD-MM-YYYY")}
                    </Typography>
                    </Grid>

                    <Grid item container xs={12}>
                    {(salesmanChosen && locationSelected)?
                    <AddItems location={selectedLocation} totalAmount={totalAmount} pricelistCode={settings.pricelist} containerItems={containerItems} updateContainer={updateContainer} />
                    :
                    <Typography color="textSecondary" variant="caption">
                        Choose the salesman and location
                    </Typography>
                    }
                    </Grid>

                    <Grid item container alignItems="center" xs={12} style={{padding:"8px"}}>
                        <AccountBalanceWalletRounded />
                        <Typography color="textPrimary" fontSizeInherit variant="caption">
                            {(containerItems.length > 0)?totalAmount:"Add some items"}
                        </Typography>
                    </Grid>
                </Grid>
                <Button variant="outlined" onClick={startSale}>Start Sales</Button>
                {redirect? <Redirect to={"/sales/"+salesId} />:""}
            </Paper>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        salesmenList:state.firestore.data.list,
        pricelists:state.firestore.data.pricelists,
        settings:state.firestore.data.settings
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        newSale:(data,next)=>dispatch(newSale(data,next))
    }
}
export default compose(
    firestoreConnect([
        {
            collection:'users',
            where:['salesman','==',true],
            storeAs:"list"
        },
        {
            collection:"pricelists",
            storeAs:'pricelists'
        },
        {
            collection:'admin',
            doc:"appSettings",
            storeAs:"settings"
        }
    ]),
    connect(mapStateToProps,mapDispatchToProps),
    withStyles(css)
)(NewSale)