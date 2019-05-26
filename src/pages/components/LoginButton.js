import React, { Component, Fragment } from "react";
import {Button} from "@material-ui/core";
import {connect} from "react-redux";
import {signIn} from "../../redux/actions/authActions";
import {AccountCircle} from "@material-ui/icons"
class LoginButton extends Component {
    render(){
        const {props} = this;
        return(
        <Fragment>
            {
                (!props.user.userLogged)?
                    <Button color="inherit" onClick={()=>props.login()}>Login</Button> :
                    <Button color="inherit" style={{textTransform:"capitalize"}}><AccountCircle />{props.user.user.name.split(" ")[0]}</Button>
            }
        </Fragment>
        )
    }
}
const stateToProps = (state)=>{
    return {
            user:state.user
        }
}
const dispatchToProps = (dispatch)=>{
    return{
        login:()=>{dispatch(signIn())}
    }
}

export default connect(stateToProps,dispatchToProps)(LoginButton);