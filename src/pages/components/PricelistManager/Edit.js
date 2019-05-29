import React, {Component} from 'react';

export default class Edit extends Component{
    render(){
        console.log("Edit is rendering")
        return <div>{this.props.code}</div>
    }
}