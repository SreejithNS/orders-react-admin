import React, {Component,Fragment} from 'react';
import MaterialTable from 'material-table';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import {withStyles,Paper,Button} from '@material-ui/core';
import {updateShop,deleteShop,newShop,uploadCsv,bulkDelete} from '../../../redux/actions/shopAction';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
import Snack from './Snack'
import Papa from 'papaparse';
const generateClassName = createGenerateClassName({
  productionPrefix: 'mt',
  seed: 'mt'
});

const css =(theme)=>{
    return {
        root:{
            maxWidth:"100%",
            maxHeight:"90%"
        }
    }
}

class Content extends Component{
    state={
        snack:false,
        message:"",
        multipleDelete:false
    }
    snackClose=()=>this.setState({snack:false,message:""})
    multipleDeleteToggle=()=>this.setState({multipleDelete:!this.state.multipleDelete})
    parse(e){
    const {uid,name} = this.props.user;
    const {uploadCsv} = this.props;
    const setState = this.setState.bind(this)
    Papa.parse(e.target.files[0], {
        dynamicTyping:true,
        header:true,
        skipEmptyLines:true,
        complete: function(data) {
            var populated = [];
            data.data.map((shop)=>{
                shop.createdBy = uid;
                shop.creatorName = name;
                return populated.push(shop)
            })
            uploadCsv(populated,()=> setState({snack:true,message:"Your Shop list from CSV file has been uploaded."}))
        }
    });
    }
    render(){
        return (
        <Fragment>
        <Paper style={{padding:"6px",marginBottom:"4px"}}>
        <input
            style={{display:'none'}}
            id="raised-button-file"
            type="file"
            accept="text/csv"
            onChange={this.parse.bind(this)}
        />
        <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span">
            Upload
        </Button>
        </label>
        <Button onClick={this.multipleDeleteToggle} marginLeft={2} variant="outlined" color={this.state.multipleDelete?"secondary":"primary"} component="span">
            multiple Delete
        </Button></Paper>
        <div className={this.props.classes.root}>
            <StylesProvider generateClassName={generateClassName}>
                <MaterialTable
                columns={[
                    { title: 'Shop Name', field: 'name' , searchable:true},
                    { title: 'Location', field: 'location', searchable:true}
                ]}
                data={this.props.shops}
                title="Shops"
                options={{
                  selection: this.state.multipleDelete
                }}
                actions={(this.state.multipleDelete)?[
                    {
                        tooltip: 'Remove All Selected Shops',
                        icon: 'delete',
                        onClick: (evt, data) => this.props.bulkDelete(data,()=>this.setState({snack:true,message:"Shops deleted"}))
                    }
                ]:[]}
                editable={(this.state.multipleDelete)?{}:{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                const data = this.props.shops;
                                const index = data.indexOf(oldData)
                                const id = data[index].id
                                //this.setState({ data }, () => resolve());
                                this.props.updateShop(id,newData,resolve);
                        }),
                        onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            this.props.newShop(newData,resolve);
                        }),
                        onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            //let data = this.parseData();
                            //const index = data.indexOf(oldData);
                            //this.setState({ data }, () => resolve());
                            this.props.deleteShop(oldData.id,resolve);
                        })
                    }}
                />
            </StylesProvider>
        </div>
        <Snack open={this.state.snack} message={this.state.message} close={this.snackClose}/>
        </Fragment>
        )

    }
};
const mapDispatchToProps = (dispatch)=>{
    return {
        updateShop:(id,data,res)=>dispatch(updateShop(id,data,res)),
        newShop:(data,res)=>dispatch(newShop(data,res)),
        deleteShop:(id,res)=>dispatch(deleteShop(id,res)),
        uploadCsv:(data,next)=>dispatch(uploadCsv(data,next)),
        bulkDelete:(data,next)=>dispatch(bulkDelete(data,next))
    }
}

const mapStateToProps = (state)=>({
       shops: state.firestore.ordered.shops,
       user:state.user.user
    }
)

export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
    {
        collection:'shops',

    }
]),withStyles(css))(Content)