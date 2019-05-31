import React, {Component} from 'react';
import MaterialTable from 'material-table';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {updateShop,deleteShop,newShop} from '../../../redux/actions/shopAction';
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

class Content extends Component{
    render(){
        return (
        <div className={this.props.classes.root}>
            <StylesProvider generateClassName={generateClassName}>
                <MaterialTable
                columns={[
                    { title: 'Shop Name', field: 'name' , searchable:true},
                    { title: 'Location', field: 'location', searchable:true}
                ]}
                data={this.props.shops}
                title="Shops"
                editable={{
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
                            let data = this.parseData();
                            const index = data.indexOf(oldData);
                            //this.setState({ data }, () => resolve());
                            this.props.deleteShop(data[index].id,resolve);
                        })
                    }}
                />
            </StylesProvider>
        </div>
        )

    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        updateShop:(id,data,res)=>dispatch(updateShop(id,data,res)),
        newShop:(data,res)=>dispatch(newShop(data,res)),
        deleteShop:(id,res)=>dispatch(deleteShop(id,res))
    }
}

const mapStateToProps = (state)=>({
       shops: state.firestore.ordered.shops
    }
)

export default compose(connect(mapStateToProps,mapDispatchToProps),firestoreConnect([
    {
        collection:'shops',

    }
]),withStyles(css))(Content)