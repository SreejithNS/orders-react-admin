const userReducer = (state = {
    userLogged:false,
    user:{},
    profile:false
},action)=>{
    switch (action.type){
        case "SET_USERNAME":
        state = {
            ...state,
            user:{
                name:action.payload
            }
        }
        break;
        case "USER_DATA_UPDATED":
        state = {
            ...state,
            profile:true
        }
        break;
        case "USER_LOGGED":
        state = {
            ...state,
            userLogged:true,
            user:action.payload
        }
        break;
        case "USER_LOGGED_OUT":
        state = {
            ...state,
            userLogged:false,
            user:{}
        }
        break;
        default:
        break;
    }
    return state;
}
export default userReducer;