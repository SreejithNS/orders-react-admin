import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function Loading(props) {
  const { classes } = props;
  return (
    <div style={{width:"100%",textAlign:"center"}}>
      <CircularProgress className={classes.progress} />
    </div>
  );
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loading);