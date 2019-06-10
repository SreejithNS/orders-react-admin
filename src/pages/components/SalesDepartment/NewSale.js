import React, {Component} from 'react'
import {Paper, Box, Typography,TextField,Grid,Avatar} from "@material-ui/core";
import {Settings as SettingsIcon, AccountCircleOutlined, Edit} from "@material-ui/icons";
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
//import MaterialTable from 'material-table';

const css = {
    content:{
        padding:8
    },
    salesmanField:{
        width:"100%"
    }
}

class NewSale extends Component{
    state={
        chosenSalesman:{},
        salesmanChosen:false,
        salesmanField:'',
        avatarList:[],
        editSalesMan:false
    }
    toggleSalesmanEdit = (entered)=>()=>{this.setState({editSalesMan:entered})}
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
    typeSalesmanName(e){
        if(!this.props.salesmenList && e.target.value === '') return false;
        const {salesmenList} = this.props;
        const inp = e.target.value.toUpperCase().split('');
        var list = [];
        var avatarList = [];
        for(let id in salesmenList){
            const name = salesmenList[id].name.toUpperCase().split('').splice(0,inp.length).join('')
            if(inp.join('') ===  name){list.push({name:salesmenList[id].name,id});avatarList.push({id,src:salesmenList[id].dp});this.setState({salesmanField:e.target.value.toUpperCase(),avatarList:avatarList.splice(0,2)})}
        }
        return list;
    }

    render(){
        const {state,props,toggleSalesmanEdit,resetSalesman} = this;
        const {salesmanChosen/*,chosenSalesman*/,salesmanField,avatarList,editSalesMan} = state;
        return(
            <Paper>
                <Box display="flex" alignItems="center" pl={2} pt={2}>
                    <SettingsIcon mr={1}/><Typography variant="h6" color='textPrimary'>Create Sales</Typography>
                </Box>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={6} sm={3} md={3} m={3}>
                        {(!salesmanChosen || salesmanField === '')?
                        <form noValidate autoComplete="off">
                            <Box display="flex" alignItems="center">
                            <TextField
                                id="newsale-salesman-name"
                                label="Sales Man"
                                value={salesmanField}
                                onChange={this.typeSalesmanName.bind(this)}
                                margin="normal"
                                className={props.classes.salesmanField}
                                variant="filled"
                            />
                            {(avatarList && avatarList.length!==0)?avatarList.map(({src,id},key)=><Avatar alt="Click to choose him" style={{margin:"5px",top:"5px"}} key={key} onClick={this.selectSalesman(id)} src={src} />):''}
                            </Box>
                        </form>:
                        <Box display="flex" onMouseEnter={toggleSalesmanEdit(true)} onMouseLeave={toggleSalesmanEdit(false)} alignItems="center" p={2}>
                            <AccountCircleOutlined mr={1}/><Typography variant="h6" color='textPrimary'>{salesmanField.split(" ")[0]}</Typography>{(editSalesMan)?<Edit onClick={resetSalesman} ml={2}/>:""}
                        </Box>
                        }
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        salesmenList:state.firestore.data.list
    }
}
export default compose(
    firestoreConnect([
        {
            collection:'users',
            where:['salesman','==',true],
            storeAs:"list"
        }
    ]),
    connect(mapStateToProps),
    withStyles(css)
)(NewSale)