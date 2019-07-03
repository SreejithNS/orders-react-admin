import React,{Component} from 'react';
import { Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
const generateClassName = createGenerateClassName({productionPrefix: 'mt',seed: 'mt'});




class Bills extends Component {
    state={

    }
    billsList=()=>{
        var bills = this.props.bills;
        var billsList = []
        for(let orderId in bills){
            bills[orderId].orderId = orderId;
            billsList.push(bills[orderId])
        }
        return billsList;
    }
    render(){
        const {bills} = this.props;
        const {billsList} = this;
        return(<div>
              <StylesProvider generateClassName={generateClassName}>
                <MaterialTable 
                    columns={[
                        {title:"Shop Name",field:"shopName"},
                        {title:"Discount",field:"discount",
                            render:(data)=>data.discount?
                                <Typography variant="caption">-{data.discountAmount}</Typography>:
                                <Typography variant="caption">No Discount</Typography>
                        },
                        {title:"Credit",field:"credit",
                            render:(data)=>data.credit?
                                <Typography variant="caption">{data.grandTotal}</Typography>:
                                <Typography variant="caption">No Credit</Typography>
                        },
                        {title:"Billed Amount",field:"grandTotal",type:"currency"},
                    ]}
                    data={bills? billsList() : []}
                    options={{
                        search:false,
                    }}
                    title="Recieved Bills"
                />
              </StylesProvider>  </div>
        ) 
    }
}

export default Bills