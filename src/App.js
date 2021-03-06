/*global VSS*/
import React, { Component } from 'react';
import _ from 'lodash';
import Grid from '@material-ui/core/Grid';
import FabricCommandBar from './ExtAppBar/FabricCommandBar';
import FabricDirectLinksContainer from './DirectLinksContainer/FabricDirectLinksContainer'
import TFSRestActions from './Actions/TFSRestActions';
import Snackbar from '@material-ui/core/Snackbar';
import FabricFlatContainer from './BacklogContainer/FabricFlatContainer';
import FabricTreeContainer from './FabricTreeContainer/FabricTreeContainer';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
let tfsData = new TFSRestActions();
    

export default class App extends Component {
  
  constructor(props) {
    super(props)
    
    tfsData.fetchSharedQueriesData().then((queryList)=>{this.setState({"queryList":queryList})});

    this.darggedItemId = null;
    this.overItemId = null;
    this.linkType = 'Related';
    this.successMessage = '';

    this.state = {
      'queryList' : [],
      'leftQueryResultType':null,
      'rightQueryResultType':null,
      'leftQueryId':null,
      'rightQueryId':null,
      'leftContainerWiArray': [],
      'rightContainerWiArray': [],
      'linkDescription':'Related',
      'openDragSnackBar':false,
      'openSuccessSnackBar':false,
      'isLoadingLeft':false,
      'isLoadingRight':false
    }
  }//constructor
    
  leftContainerFactory(queryResultType){
    switch (queryResultType) {
      case 1:
       return  <FabricFlatContainer  
                containerSide='left'
                wiArray ={this.state.leftContainerWiArray}
                handleDragEvent={this.handleDragEvent.bind(this)}
                handleDragEnd={this.handleDragEnd.bind(this)} 
                handleDropEvent={this.handleDropEvent.bind(this)}/> 
      case 2:
        return <FabricTreeContainer 
                containerSide='left'
                wiArray = {this.state.leftContainerWiArray}
                handleDragEvent={this.handleDragEvent.bind(this)} 
                handleDragEnd={this.handleDragEnd.bind(this)} 
                handleDropEvent={this.handleDropEvent.bind(this)}
                handleToggleVisible={this.toggleVisibilityTree.bind(this)}/>;  
      case 3:
        return <FabricDirectLinksContainer 
                containerSide='left'
                wiArray = {this.state.leftContainerWiArray}
                handleDragEvent={this.handleDragEvent.bind(this)} 
                handleDragEnd={this.handleDragEnd.bind(this)} 
                handleDropEvent={this.handleDropEvent.bind(this)}
                handleToggleVisible={this.toggleVisibility.bind(this)}/>;

      default:
        break;
    }
  }

  rightContainerFactory(queryResultType){
    switch (queryResultType) {
      case 1:
        return <FabricFlatContainer 
                containerSide='right'
                wiArray = {this.state.rightContainerWiArray}
                handleDragEvent={this.handleDragEvent.bind(this)}
                handleDragEnd={this.handleDragEnd.bind(this)}  
                handleDropEvent={this.handleDropEvent.bind(this)}/>;
      case 2:
        return <FabricTreeContainer 
                containerSide='right'
                wiArray = {this.state.rightContainerWiArray}
                handleDragEvent={this.handleDragEvent.bind(this)} 
                handleDragEnd={this.handleDragEnd.bind(this)} 
                handleDropEvent={this.handleDropEvent.bind(this)}
                handleToggleVisible={this.toggleVisibilityTree.bind(this)}/>;  
      case 3:
        return <FabricDirectLinksContainer 
                containerSide='right'
                wiArray = {this.state.rightContainerWiArray}
                handleDragEvent={this.handleDragEvent.bind(this)}
                handleDragEnd={this.handleDragEnd.bind(this)}  
                handleDropEvent={this.handleDropEvent.bind(this)}
                handleToggleVisible={this.toggleVisibility.bind(this)}/>;
      default:
        break;
    }
  }

  render(){
    return(
      <div>
        <FabricCommandBar
           queryList={this.state.queryList} 
           leftQueryId={this.state.leftQueryId}
           rightQueryId={this.state.rightQueryId}
           linkType={this.state.linkDescription} 
           onQuerySelectHandler={this.onQuerySelectHandler.bind(this)}
           handleExpandAndCollapse ={this.expandCollapseAll.bind(this)}
        />
        <Grid  container spacing={0}>
          <Grid item xs={6}>
            {(this.state.isLoadingLeft)?
              <Spinner style={{position:'fixed',top:'50%',left:'25%',zIndex:999}} size={SpinnerSize.large} />
            :
            null
            }
            {this.leftContainerFactory(this.state.leftQueryResultType)}
          </Grid>
          <Grid item xs={6}>
            {(this.state.isLoadingRight)?
              <Spinner style={{position:'fixed',top:'50%',right:'25%',zIndex:999}} size={SpinnerSize.large} />
              :
              null
            }
            {this.rightContainerFactory(this.state.rightQueryResultType)}
          </Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{vertical: 'top',horizontal: 'left'}}
          open={this.state.openDragSnackBar}
          ContentProps={{'aria-describedby': 'message-id'}}
          message={<span id="message-id"> linking #{this.darggedItemId} as {this.state.linkDescription}</span>}
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
    if(wi1.id === null && wi2.id === null){
      this.setState({openDragSnackBar:false});
      return false
    }

    this.updateLinksData(wi1,wi2,'right');
    this.updateLinksData(wi1,wi2,'left');
    this.successMessage = `sucessfully link ${wi1.id} to ${wi2.id}`;
    this.setState({openSuccessSnackBar:true});
  }//successfulLink

  handleKeyDown(key){
    // console.log(key)
    switch (key) {
      case 'Shift':
        // console.log(`pressed: ${key} alt`);
        this.linkType = 'Elisra.CoveredBy-Forward';
        this.setState({linkDescription:'Covers'});
        break;
      case 'Control':
        // console.log(`pressed: ${key} Ctrl`);
        this.linkType = 'Microsoft.VSTS.Common.TestedBy-Reverse';
        this.setState({linkDescription:'Tests'});
        break;
      default:
        // console.log(`defualt press`);
        this.linkType = 'System.LinkTypes.Hierarchy-Forward';
        this.setState({linkDescription:'Child of'});
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
    this.setState({openDragSnackBar:true });
    // return true;
  }//handleDragEvent

  async handleDragEnd(){
    this.setState({linkDescription:'Child of'});
    this.setState({openDragSnackBar:false});
    this.darggedItemId = null;
    this.overItemId = null;
  }//handleDragEnd

  async handleDropEvent(id){
    
    console.log(`inside handle drop`);
    this.overItemId = id;
    
    await tfsData.addLinkToWi(this.overItemId,this.darggedItemId,this.linkType,this.successfulLink.bind(this));
    
    this.setState({linkDescription:'Child of'});
    this.setState({openDragSnackBar:false});
    this.darggedItemId = null;
    this.overItemId = null;

  }//handleDropEvent
  
  async onQuerySelectHandler(id,conatainerSide){
    if(conatainerSide==='left'){this.setState({isLoadingLeft:true})}
    if(conatainerSide==='right'){this.setState({isLoadingRight:true})}
    //console.log(conatainerSide);
    let queryResults = await tfsData.getQueryResultsById(id);
   
    console.log(queryResults);
    let wiArray = await tfsData.populateQueryResult(queryResults);
    
    //console.log(wiArray)
    if(conatainerSide === "left"){
      this.setState({'leftQueryResultType':queryResults.queryType});
      this.setState({'leftContainerWiArray':wiArray});
      this.setState({'leftQueryId':id});
      console.log(`leftQuery Type is : ${this.state.queryType}`);
    }else{
      this.setState({'rightQueryResultType':queryResults.queryType});
      this.setState({'rightContainerWiArray':wiArray});
      this.setState({'rightQueryId':id});
    }//if

    if(conatainerSide==='left'){this.setState({isLoadingLeft:false})}
    if(conatainerSide==='right'){this.setState({isLoadingRight:false})}

  }//onQuerySelectHandler

  toggleVisibility(wiId,containerSide){
    let visibleUpdateWiArray;
    if(containerSide === 'left'){visibleUpdateWiArray = this.state.leftContainerWiArray;}
    if(containerSide === 'right'){visibleUpdateWiArray = this.state.rightContainerWiArray;}
    let indexToToggle = _.findIndex(visibleUpdateWiArray,(o)=>{return o.id == wiId});
    
    if (indexToToggle != -1) {
      if(visibleUpdateWiArray[indexToToggle].isExpanded){
        visibleUpdateWiArray[indexToToggle].isExpanded=false
      }else{
        visibleUpdateWiArray[indexToToggle].isExpanded=true;
      }//if

      visibleUpdateWiArray[indexToToggle].children.forEach(wi => {
        if(wi.visible){
          wi.visible=false;
        }else{
          wi.visible=true;
        }//if
      });//foreach
    }//if
    
    this.setState({leftContainerWiArray:visibleUpdateWiArray});
  }//toggleVisibility

  toggleVisibilityTree(wiId,containerSide){
    let visibleUpdateWiArray;
    if(containerSide === 'left'){visibleUpdateWiArray = this.state.leftContainerWiArray;}
    if(containerSide === 'right'){visibleUpdateWiArray = this.state.rightContainerWiArray;}
    
    let indexToToggle = _.findIndex(visibleUpdateWiArray,(o)=>{return o.id == wiId});
    
    if (indexToToggle != -1) {
      
      if(visibleUpdateWiArray[indexToToggle].isExpanded){
        visibleUpdateWiArray[indexToToggle].isExpanded=false
      }else{
        visibleUpdateWiArray[indexToToggle].isExpanded=true;
      }//if

      visibleUpdateWiArray.forEach(wi => {
        if(wi.parentId === wiId){
          
          if(wi.visible){
            wi.visible=false;
          }else{
            wi.visible=true;
          }//if
        
        }//if
      
      });//foreach

    }//if
    
    this.setState({leftContainerWiArray:visibleUpdateWiArray});
  }//toggleVisibility

  updateLinksData(wiData1,wiData2,containerSide){
    
    let wiArray;

    if(containerSide=='right'){wiArray = this.state.leftContainerWiArray;}
    if(containerSide=='left'){wiArray = this.state.rightContainerWiArray;}

    wiArray.forEach((wi,i)=>{
      if(wi.id == wiData1.id){
        wiArray[i].relations = wiData1.relations;
      }
      if(wi.id == wiData2.id){
        wiArray[i].relations = wiData2.relations;
      }
    });
    
    if(containerSide=='right'){this.setState({rightContainerWiArray:wiArray})}
    if(containerSide=='left'){this.setState({leftContainerWiArray:wiArray})}
  }//updateLinksData

  expandCollapseAll(action,containerSide){
    console.log(action + '  '  + containerSide);
    let wiArray = [];
    if(containerSide === 'left'){wiArray = this.state.leftContainerWiArray;}
    if(containerSide === 'right'){wiArray = this.state.rightContainerWiArray;}

    for (let index = 0; index < wiArray.length; index++) {
      if(wiArray[index].depth !== 0 ){
        if(action === 'expand'){wiArray[index].visible = false;wiArray[index].isExpanded = false}
        if(action === 'collapse'){wiArray[index].visible = true;wiArray[index].isExpanded = true}
      }
    }

    if(containerSide === 'left'){this.setState({leftContainerWiArray:wiArray})}
    if(containerSide === 'right'){this.setState({rightContainerWiArray:wiArray})}
  }

}