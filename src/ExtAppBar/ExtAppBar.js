import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
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
       <br/>
        <Typography align='center' variant="title" color="inherit">
          Work Items Linking Tool
        </Typography>
        <Typography align='center' variant="subheading" color="inherit">
         (Default link - related | Hold down Ctrl - Child of | Hold down Shift - Parent of)
        </Typography>
        <QuerySelectBox 
          align='right' 
          queryId = {this.props.rightQueryId}
          containerSide="right" 
          className={styles.menuButton} 
          queryList={this.props.queryList} 
          onQuerySelectHandler={this.props.onQuerySelectHandler}
        />
        <QuerySelectBox   
          queryId = {this.props.leftQueryId}
          containerSide="left" 
          queryList={this.props.queryList} 
          onQuerySelectHandler={this.props.onQuerySelectHandler}
          />
    </AppBar>
    )
  }
}
