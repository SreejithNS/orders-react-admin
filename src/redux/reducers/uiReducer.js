const uiReducer = (state={
    sideMenu:false
},action)=>{
    switch(action.type){
        case 'TOGGLE_SIDEMENU':
        state = {...state,sideMenu:(state.sideMenu)? false:true }
        break;
        case 'OPEN_SIDEMENU':
        state = {...state,sideMenu:true}
        break;
        case 'CLOSE_SIDEMENU':
        state = {...state,sideMenu:false}
        break;
        default:
        break;
    }
    return state
}
export default uiReducer;