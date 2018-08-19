import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import QuerySelectBox from '../QuerySelectBox/QuerySelectBox';


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export default class ExtAppBar extends Component {
  render() {
    
    return (
      <AppBar position="static" color="default">
        <div align='right'>
          <QuerySelectBox align='right' containerSide="right" className={styles.menuButton} queryList={this.props.queryList} onQuerySelectHandler={this.props.onQuerySelectHandler}/>
        </div>
        <Typography align='center' variant="title" color="inherit">
          Current Link Type - {this.props.linkType}
        </Typography>
        <QuerySelectBox   containerSide="left" queryList={this.props.queryList} onQuerySelectHandler={this.props.onQuerySelectHandler}/>
    </AppBar>
    )
  }
}
