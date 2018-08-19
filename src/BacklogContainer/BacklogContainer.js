import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import reqImg from './img/reqImg.png';  
// WorkItem ICD :
//   ID: Number
//   Title: String
//   Type:String
//   State:String
//   NumOfLinks:Number

export default class BacklogContainer extends Component {
 
  wiListFactory(wiArray){
    console.log(wiArray)
    if(wiArray){
      return wiArray.map((wi)=>{
        return  <div
                  draggable
                  onDragStart={(e)=>{console.log(e);  this.props.handleDragEvent(wi.id,e.ctrlKey,e.altKey,e.shiftKey)}}                    
                  onDragOver={(e)=>{
                    this.props.handleDragOverEvent(wi.id)
                    e.stopPropagation();
                    e.preventDefault();}}
                  onDrop={(e)=>{this.props.handleDropEvent()}}
                  >
                <ListItem button component="a" href="#simple-list">
                <div ><img height="20" width="20" src={reqImg} /></div>
                  <ListItemText primary={wi.title} />
                </ListItem>
                <Divider/>
                </div>;
      });
    }else{
      return <h4 align="center"> waiting for data....</h4>;
    }
  }

 
  render() {
    return (
      <List style={{maxHeight: '100%', overflow: 'auto'}} component="nav">
      {this.wiListFactory(this.props.wiArray)}
     </List> 
    )
  }
}
