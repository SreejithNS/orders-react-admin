import React,{Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export default class QuantityDialog extends Component {
  constructor(props){
      super(props);
      this.state = {
        value:undefined
      };
  }

  handleAdd =()=>{
      const {toggle,name,rate,code} = this.props;
      this.props.addItem({
          itemName:name,
          rate,
          itemCode:code,
          quantity:this.state.value,
          amount:Math.round(this.state.value*rate*100)/100
      })
      toggle()
      this.setState({
          value:null
      })
  }

  onChange=(event)=>{
      var value = event.target.value;
      this.setState({value:value});
  }

  render() {
      const {props} = this;
      const {name,weight,rate} = props;
    return (
        <Dialog
          open={props.open}
          onClose={props.toggle}
          TransitionComponent={Transition}
          fullWidth={true}
          maxWidth={"md"}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Quantity</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <b>{name}</b> - <b>Rs.{rate}</b>/packet<br/>Weight: {weight}g
            </DialogContentText>
            <form onSubmit={(e)=>{e.preventDefault();this.handleAdd()}}>
            <TextField
              autoFocus
              margin="dense"
              label="Packets"
              type="number"
              fullWidth
              onChange={this.onChange}
              value={this.state.value}
              placeholder="Enter number of packets"
            />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.toggle} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleAdd} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}