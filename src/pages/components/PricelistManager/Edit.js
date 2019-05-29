import React, {Component} from 'react';

export default class Edit extends Component{
    constructor(props){
        super(props);
    }
    render(){
        console.log("Edit is rendering")
        return <div>{this.props.code}</div>
    }
}