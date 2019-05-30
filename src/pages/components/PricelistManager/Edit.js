import React, {Component} from 'react';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import MaterialTable from 'material-table';
import {withStyles} from '@material-ui/core'
import Loading from '../Loading'

import {updateData} from '../../../redux/actions/pricelistActions';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
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

class Edit extends Component{
    state={
        data:[]
    }
    parseData(){
        if(!this.props.data) return false;
        const {data} =this.props
        var parsedData = []
        for(var location in data){
            for(var brand in data[location]){
                for(var itemGroup in data[location][brand]){
                     data[location][brand][itemGroup].map(data=>parsedData.push(data))
                }
            }
        }
        return parsedData
    }
    packData(data){
        var groupBy = function(xs, key) {return xs.reduce(function(rv, x) {(rv[x[key]] = rv[x[key]] || []).push(x);return rv;}, {});};
        var locationParsed = groupBy(data,"location");
        for(var location in locationParsed){
            locationParsed[location] = groupBy(locationParsed[location],"brand")
            for(var brand in locationParsed[location]){
                locationParsed[location][brand] = groupBy(locationParsed[location][brand],"itemGroup");
            }
        }
        return locationParsed
    }
    render(){
        return (
            <div className={this.props.classes.root}>
            <StylesProvider generateClassName={generateClassName}>
            {this.parseData()?<MaterialTable
                columns={[
                    { title: 'Brand', field: 'brand' },
                    { title: 'Zone', field: 'location' },
                    { title: 'Item Group', field: 'itemGroup' },
                    { title: 'Item Code', field: 'itemCode',searchable:true },
                    { title: 'Name', field: 'itemName',searchable:true },
                    { title: 'Weight in g', field: 'itemWeight',type:"numeric"},
                    { title: 'Rate', field: 'itemRate',type:"numeric"}
                ]}
                data={this.parseData()}
                title={this.props.code}
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            const data = this.parseData();
                            data.push(newData);
                            this.props.updateData(this.props.code,this.packData(data),resolve);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            const data = this.parseData();
                            const index = data.indexOf(oldData)
                            data[index] = newData;
                            //this.setState({ data }, () => resolve());
                            this.props.updateData(this.props.code,this.packData(data),resolve);
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {

                            let data = this.parseData();
                            const index = data.indexOf(oldData);
                            data.splice(index, 1);
                            //this.setState({ data }, () => resolve());
                            this.props.updateData(this.props.code,this.packData(data),resolve);
                        }),
                    }}
            />:<Loading/>}
            </StylesProvider>
            </div>
            )
    }
}

const mapStateToProps = (state)=>{
    return {
        data:state.firestore.data.getData
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {updateData:(code,data,res)=>dispatch(updateData(code,data,res))}
}
const query = (props)=>{
    return [
        {
            collection:"pricelists",
            doc:props.code,
            storeAs:"getData"
        }
    ]
};

export default compose(firestoreConnect(query),connect(mapStateToProps,mapDispatchToProps),withStyles(css))(Edit)

/*{this.state.redirect?<Redirect to={"/pricelistmanager/edit/"+this.state.plcode} />:""}*/