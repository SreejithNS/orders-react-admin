import React, {Component} from 'react';
import {compose} from 'redux';
import {firestoreConnect} from 'react-redux-firebase';
import {connect} from 'react-redux';
import MaterialTable from 'material-table';
import {withStyles} from '@material-ui/core'
import Loading from '../Loading'

const css =(theme)=>{
    return {
        root:{
            maxWidth:"100%",
            maxHeight:"90%"
        }
    }
}

class Edit extends Component{
    parseData(){
        if(!this.props.data) return false;
        const {data} =this.props
        console.log(data)
        var parsedList = []
        //for(var location in data){
            data["TPT"].map((pack)=>{
                pack.itemslist.map(item=>
                    parsedList.push({location:"TPT",brand:pack.brand,...item})
                )
            })
        //}
        //console.log(parsedList);
        return parsedList;
    }
    render(){
        this.parseData()
        return (<div className={this.props.classes.root}>
            {this.parseData()?<MaterialTable
                columns={[
                    { title: 'Brand', field: 'brand' },
                    { title: 'Zone', field: 'location' },
                    { title: 'Item Code', field: 'itemCode',searchable:true },
                    { title: 'Name', field: 'itemName',searchable:true },
                    { title: 'Weight in g', field: 'itemWeight',type:"numeric"},
                    { title: 'Rate', field: 'itemRate',type:"numeric"}
                ]}
                data={this.parseData()}
                title={this.props.code}
            />:<Loading/>}
            
            </div>
            )
    }
}

const mapStateToProps = (state)=>{
    return {
        data:state.firestore.data.getData
    }
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

export default compose(firestoreConnect(query),connect(mapStateToProps),withStyles(css))(Edit)

/*{this.state.redirect?<Redirect to={"/pricelistmanager/edit/"+this.state.plcode} />:""}*/