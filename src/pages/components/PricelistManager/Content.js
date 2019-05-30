import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';
import Loading from "../../components/Loading"
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import MaterialTable from 'material-table';
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
    state={
        redirect:false
    }
    edit(plcode){
        this.setState({
            redirect:true,
            plcode
        })
    }
    getPricelists(){
        if(!this.props.pricelists) return false;
        const {pricelists} = this.props;
        var result = [];
        pricelists.map((pricelist)=>{
            var obj = {};
            obj.pricelistCode = pricelist.id;
            return result.push(obj)
        })
        return result
    }
    render(){
        return(
        <div className={this.props.classes.root}>
        <StylesProvider generateClassName={generateClassName}>
            {this.getPricelists()?<MaterialTable
                columns={[
                    { title: 'Code', field: 'pricelistCode' },
                    { title: 'Locations', field: 'location' }
                ]}
                data={this.getPricelists()}
                title={"Pricelist"}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit Pricelist',
                        onClick: (event, rowData) => this.edit(rowData.pricelistCode)
                    }
                ]}
            />:<Loading/>}
            <StylesProvider/>
            {this.state.redirect?<Redirect to={"/pricelistmanager/edit/"+this.state.plcode} />:""}
         </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        pricelists:state.firestore.ordered.pricelists
    }
}

export default compose(connect(mapStateToProps),firestoreConnect([
    {
        collection:'pricelists'
    }
]),withStyles(css))(Content)