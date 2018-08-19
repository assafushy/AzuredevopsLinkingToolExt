/*global VSS*/
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import ExtAppBar from './ExtAppBar/ExtAppBar';
import BacklogContainer from './BacklogContainer/BacklogContainer';
import TFSRestActions from './Actions/TFSRestActions';
import Snackbar from '@material-ui/core/Snackbar';

let tfsData = new TFSRestActions();
    
export default class DragAndDropPage extends Component {
  
  constructor(props) {
    super(props)
    tfsData.fetchSharedQueriesData().then((queryList)=>{this.setState({"queryList":queryList})});
    
    this.darggedItemId = null;
    this.overItemId = null;
    this.linkType = 'Related';
    this.successMessage = '';

    this.state = {
      'queryList' : null,
      'leftQueryId':null,
      'rightQueryId':null,
      'leftContainerWiArray': null,
      'rightContainerWiArray': null,
      'linkDescription':'Related',
      'openDragSnackBar':false,
      'openSuccessSnackBar':false

    }
  }//constructor
    
  render(){
    return(
      <div>
        <ExtAppBar 
          queryList={this.state.queryList} 
          leftQueryId={this.state.leftQueryId}
          rightQueryId={this.state.rightQueryId}
          linkType={this.state.linkDescription} 
          onQuerySelectHandler={this.onQuerySelectHandler.bind(this)}
          />
        <Grid  container spacing={0}>
          <Grid item xs={6}>
           <BacklogContainer  handleDragOverEvent= {this.handleDragOverEvent.bind(this)} 
                              handleDragEvent={this.handleDragEvent.bind(this)} 
                              handleDropEvent={this.handleDropEvent.bind(this)}
                              onDragExit={this.successfulLink.bind(this)}
                              wiArray ={this.state.leftContainerWiArray}/>
          </Grid>
          <Grid item xs={6}>
          <BacklogContainer   handleDragOverEvent= {this.handleDragOverEvent.bind(this)} 
                              handleDragEvent={this.handleDragEvent.bind(this)} 
                              handleDropEvent={this.handleDropEvent.bind(this)}
                              wiArray ={this.state.rightContainerWiArray}
                              onDragExit={this.successfulLink.bind(this)}
                              />
          </Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{vertical: 'top',horizontal: 'left'}}
          open={this.state.openDragSnackBar}
          ContentProps={{'aria-describedby': 'message-id'}}
          message={<span id="message-id">currently linking workItem #{this.darggedItemId} as {this.state.linkDescription}</span>}
        />
        <Snackbar
          anchorOrigin={{vertical: 'top',horizontal: 'left'}}
          open={this.state.openSuccessSnackBar}
          onClose={this.onCloseSuccessSnackBar.bind(this)}
          autoHideDuration={6000}
          ContentProps={{'aria-describedby': 'message-id'}}
          message={<span id="message-id">{this.successMessage}</span>}
        />
      </div>
    )
  }//render

  onCloseSuccessSnackBar(){
    this.setState({openSuccessSnackBar:false});
  }//onCloseSuccessSnackBar

  successfulLink(wi1,wi2,error){
    if(error){
      this.successMessage = `Error on link attempt!`;
      this.setState({openSuccessSnackBar:true});
      this.setState({openDragSnackBar:false});
      return false;
    }//if
    if(wi1 === null && wi2 === null){
      this.setState({openDragSnackBar:false});
      return false
    }
    this.successMessage = `sucessfully link ${wi1} to ${wi2}`;
    this.setState({openSuccessSnackBar:true});
  }//successfulLink
  
  handleKeyDown(key){
    // console.log(key)
    switch (key) {
      case 'Shift':
        // console.log(`pressed: ${key} alt`);
        this.linkType = 'Hierarchy-Reverse';
        this.setState({linkDescription:'Parent of'});
        break;
      case 'Control':
        // console.log(`pressed: ${key} Ctrl`);
        this.linkType = 'Hierarchy-Forward';
        this.setState({linkDescription:'Child of'});
        break;
      default:
        // console.log(`defualt press`);
        this.linkType = 'Related';
        this.setState({linkDescription:'Related'});
        break;
    }
  }//handleKeyDown

  handleDragEvent(id,ctrlKey,altKey,shiftKey){
    this.darggedItemId = id;
    if(ctrlKey){this.handleKeyDown('Control');}else{
      if(altKey){this.handleKeyDown('Alt');}else{
        if(shiftKey){this.handleKeyDown('Shift');}else{
          this.handleKeyDown('default');
        }//if
      }//if
    }//if
    this.onCloseSuccessSnackBar();
    this.setState({ openDragSnackBar: true });
  }//handleDragEvent

  handleDragOverEvent(id){
    //console.log(`dargged over: ${id}`)
    this.overItemId = id;
  }//handleDragOverEvent

  async handleDropEvent(){
    await tfsData.addLinkToWi(this.overItemId,this.darggedItemId,this.linkType,this.successfulLink.bind(this));
    
    this.setState({linkDescription:'Related'});
    this.setState({openDragSnackBar:false});
    this.darggedItemId = null;
    this.overItemId = null;

  }//handleDropEvent
  
  async onQuerySelectHandler(id,conatainerSide){
    //console.log(conatainerSide);
    let queryResults = await tfsData.getQueryResultsById(id);
    //console.log(queryResults);
    let wiArray = await tfsData.populateQueryResult(queryResults.workItems);
    //console.log(wiArray)
    if(conatainerSide === "left"){
      this.setState({'leftContainerWiArray':wiArray});
      this.setState({'leftQueryId':id});
    }else{
      this.setState({'rightContainerWiArray':wiArray});
      this.setState({'rightQueryId':id});
    }//if
  }//onQuerySelectHandler
}