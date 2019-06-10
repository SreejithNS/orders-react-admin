import React, {Component} from 'react'
import {Paper, Box, Typography,TextField,Grid,Avatar} from "@material-ui/core";
import {Settings as SettingsIcon} from "@material-ui/icons";
import {withStyles} from '@material-ui/core/styles';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import MaterialTable from 'material-table';

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
        avatarList:new Map()
    }
    typeSalesmanName(e){
        if(!this.props.salesmenList) return false;
        const {salesmenList} = this.props;
        const inp = e.target.value.toUpperCase().split('');
        var list = [];
        var avatarList = new Map();
        for(let id in salesmenList){
            const name = salesmenList[id].name.toUpperCase().split('').splice(0,inp.length).join('')
            if(inp.join('') ===  name){list.push({name:salesmenList[id].name,id});avatarList.set(id,salesmenList[id].dp);this.setState({salesmanField:e.target.value.toUpperCase(),avatarList:avatarList})}
        }
        console.log("SUGGESTION\n\t",list)//return list;
    }

    render(){
        const {state,props} = this;
        const {salesmanChosen,chosenSalesman,salesmanField,avatarList} = state;
        console.log("Avatar",(avatarList && avatarList.size!==0))
        return(
            <Paper>
                <Box display="flex" alignItems="center" pl={2} pt={2}>
                    <SettingsIcon mr={1}/><Typography variant="h6" color='textPrimary'>Create Sales</Typography>
                </Box>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={6} sm={3} md={3} m={3}>
                        {(!salesmanChosen || salesmanField === '')?
                        <form noValidate autoComplete="off">
                            <TextField
                                id="newsale-salesman-name"
                                label="Sales Man"
                                value={salesmanField}
                                onChange={this.typeSalesmanName.bind(this)}
                                margin="normal"
                                className={props.classes.salesmanField}
                                variant="filled"
                            /><br/>
                            {(avatarList && avatarList.size!==0)?avatarList.forEach((src,id)=><Avatar alt="Click to choose him" key={id} src={src} />):''}
                            <Avatar src="https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"/>
                        </form>:
                        <Box display="flex" alignItems="center" pl={2} pt={2}>
                            <SettingsIcon mr={1}/><Typography variant="h6" color='textPrimary'>Saleman Name</Typography>
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