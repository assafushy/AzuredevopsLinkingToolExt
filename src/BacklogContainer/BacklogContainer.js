import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import bugImg from './img/bugImg.png';  
import changeImg from './img/changeImg.png';  
import epicImg from './img/epicImg.png';  
import featImg from './img/featImg.png';  
import issuImg from './img/issuImg.png';  
import reqImg from './img/reqImg.png';  
import reviewImg from './img/reviewImg.png';  
import riskImg from './img/riskImg.png';  
import taskImg from './img/taskImg.png';  
import testImg from './img/testImg.png';  

// WorkItem ICD :
//   ID: Number
//   Title: String
//   Type:String
//   State:String
//   NumOfLinks:Number

export default class BacklogContainer extends Component {
 
  imgSelector(wiType){
    
    switch (wiType) {
      case 'Bug':
        return bugImg;
      case 'Change Request':
        return changeImg;
      case 'Epic':
        return epicImg;
      case 'Feature':
        return featImg;
      case 'Issue':
        return issuImg;
      case 'Requirement':
        return reqImg;
      case 'Review':
        return reviewImg;
      case 'Risk':
        return riskImg;
      case 'Task':
         return taskImg;
      case 'Test Case':
        return testImg;
      default:
        return null
    }//switch
  }//imgSelector

  wiListFactory(wiArray){
    //console.log(wiArray)
    if(wiArray){
      return wiArray.map((wi)=>{

        let img = this.imgSelector(wi.type);

        return  <div
                  draggable
                  onDragStart={(e)=>{this.props.handleDragEvent(wi.id,e.ctrlKey,e.altKey,e.shiftKey)}}                    
                  onDragOver={(e)=>{
                    this.props.handleDragOverEvent(wi.id)
                    e.stopPropagation();
                    e.preventDefault();}}
                  onDrop={(e)=>{this.props.handleDropEvent()}}
                  >
                <ListItem button component="a" href="#simple-list">
                <div ><img height="20" width="20" src={img} /></div>
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
