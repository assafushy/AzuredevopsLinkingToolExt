import React, { Component } from 'react';
import {DetailsList,DetailsListLayoutMode,Selection} from 'office-ui-fabric-react/lib/DetailsList'; 
import styled from 'styled-components';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import {Icon} from 'office-ui-fabric-react/lib/Icon';
import {imgSelector} from '../Actions/ImgGenerator';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import { ScrollablePane, IScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import _ from 'lodash';

initializeIcons();

const TitleWrapper = styled.div`
  display:flex
  flexDirection: row,
  justifyContent: space-between;
`;


let categorizeLinks = (wiRelations)=>{
  let relCategories = {
    'parent':0,
    'child':0,
    'covers':0,
    'coveredBy':0,
    'tests':0,
    'testedBy':0
  }

    wiRelations.forEach((rel)=>{
      switch(rel.rel){
        case "System.LinkTypes.Hierarchy-Reverse":
          relCategories.parent = relCategories.parent + 1;
          break;
        case "System.LinkTypes.Hierarchy-Forward":
          relCategories.child = relCategories.child + 1;
          break;
        case "System.LinkTypes.Elisra.CoveredBy-Forward":
          relCategories.coveredBy = relCategories.coveredBy + 1;
          break;
        case "System.LinkTypes.Elisra.CoveredBy-Reverse":
          relCategories.covers = relCategories.covers + 1;
          break;
        case 'Microsoft.VSTS.Common.TestedBy-Reverse':
          relCategories.tests = relCategories.tests + 1;
          break;
        case 'Microsoft.VSTS.Common.TestedBy-Forward':
          relCategories.testedBy = relCategories.testedBy + 1;
          break;
        }
    })

    return relCategories;
}//categorizeLinks


class FabricDirectLinksContainer extends Component {  
   
  constructor(){
    super();
    let  _selection;  
  }

  _selection = new Selection();
  

  columnList = [
    {
      key: 'id',
      name: 'ID',
      fieldName: 'id',
      minWidth: 10,
      maxWidth: 20,
      isResizable:true,
      ariaLabel: 'WorkItem ID',
    },
    {
      key: 'title',
      name: 'Title',
      fieldName: 'title',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      ariaLabel: 'WorkItem title',
      onRender: (item) => {
        let img = imgSelector(item.type);
        let space = `-------------`;
        let expandIcon = '';
        
        (item.isExpanded)?expandIcon = 'chevronDown':expandIcon = 'chevronRight';

        return <TitleWrapper>
                    {(item.depth)?<div>{space}</div>:null}
                    {(item.isParent)?
                    <div onClick={()=>{this.props.handleToggleVisible(item.id)}} width="20" height="20">
                      <Icon iconName={expandIcon}/>
                    </div>
                    :
                    null
                    }
                    <img src={img} width="20" height="20"/>
                    <p >{item.title}</p>
                </TitleWrapper>
      }//onRender
    },
    {
        key: 'Parent',
        name: 'Parent',
        fieldName: 'Parent',
        minWidth: 20,
        maxWidth: 50,
        isResizable: true,
        ariaLabel: 'WorkItem Parent links',
        onRender: (item) => {
          
          let links = categorizeLinks(item.relations);
           return( 
                <div align='center' padding='5'>
                  <p>{links.parent}</p>
                </div>
           )
        }
    },{
      key: 'Children',
      name: 'Children',
      fieldName: 'Children',
      minWidth: 20,
      maxWidth: 50,
      isResizable: true,
      ariaLabel: 'WorkItem Parent links',
      onRender: (item) => {
        
        let links = categorizeLinks(item.relations);
         return( 
              <div align='center' padding='5'>
                <p>{links.child}</p>
              </div>
         )
      }
  },{
    key: 'Covers',
    name: 'Covers',
    fieldName: 'Covers',
    minWidth: 20,
    maxWidth: 50,
    isResizable: true,
    ariaLabel: 'WorkItem Covers links',
    onRender: (item) => {
      
      let links = categorizeLinks(item.relations);
       return( 
            <div align='center' padding='5'>
              <p>{links.Covers}</p>
            </div>
       )
    }
},{
  key: 'Covered by',
  name: 'Covered by',
  fieldName: 'Covered by',
  minWidth: 20,
  maxWidth: 50,
  isResizable: true,
  ariaLabel: 'WorkItem Covered by links',
  onRender: (item) => {
    
    let links = categorizeLinks(item.relations);
     return( 
          <div align='center' padding='5'>
            <p>{links.coveredBy}</p>
          </div>
     )
  }
},{
  key: 'Tests',
  name: 'Tests',
  fieldName: 'Tests',
  minWidth: 20,
  maxWidth: 50,
  isResizable: true,
  ariaLabel: 'WorkItem Tests links',
  onRender: (item) => {
    
    let links = categorizeLinks(item.relations);
     return( 
          <div align='center' padding='5'>
            <p>{links.tests}</p>
          </div>
     )
  }
},{
  key: 'Tested by',
  name: 'Tested by',
  fieldName: 'Tested by',
  minWidth: 20,
  maxWidth: 50,
  isResizable: true,
  ariaLabel: 'WorkItem Tested by links',
  onRender: (item) => {
    
    let links = categorizeLinks(item.relations);
     return( 
          <div align='center' padding='5'>
            <p>{links.TestedBy}</p>
          </div>
     )
  }
}];

  styles = ()=>{
    return {maxHeight: '100%',  overflow: 'auto'};
  }//styles

  _getDragDropEvents(){
      return {
        canDrop: (dropContext, dragContext) => {
          return true;
        },
        canDrag: (item) => {
          return true;
        },
        onDragEnter: (item, event) => {
          return 'dragEnter';
        }, // return string is the css classes that will be added to the entering element.
        onDragLeave: (item, event) => {
          return ;
        },
        onDrop: (item, event) => {
          console.log(item);
          console.log(this.props);
          this.props.handleDropEvent(item.id);
          // console.log(event)
        },
        onDragStart: (item, itemIndex, selectedItems, event) => {
          this.props.handleDragEvent(item.id,event.ctrlKey,event.altKey,event.shiftKey);
        },
        onDragEnd: (item, event) => {
         this.props.handleDragEnd();
        }
      };
  }//_getDragDropEvents

  wiFactory(wiList){
    let wiForRender = [];

    wiList.forEach(wi=>{
    if (wi.visible) { 
      wiForRender.push(wi);
      if (wi.children) {
        wi.children.forEach(wi=>{
          if (wi.visible) {
          wi.depth = 1; 
          wiForRender.push(wi);
          }//if
        })//foreach
      }//if
    }//if
    })//foreach
    return wiForRender;
  }//wiFactory

  render() {
      return (
          <div style={{
            height: '80vh',
            width:'100%',
            overflow:'true',
            position: 'relative'
          }}>
            <ScrollablePane scrollbarVisibility={ScrollbarVisibility.always}>
              <DetailsList
                  items={this.wiFactory(this.props.wiArray)}
                  columns={this.columnList}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selection={this._selection}
                  dragDropEvents={this._getDragDropEvents()}
                  styles={{root:{height:'100%',overflow: 'auto'}}}
                  onRenderDetailsHeader={this.onRenderDetailsHeader}
                  // setKey="set"
                  // selectionPreservedOnEmptyClick={true}
                  // componentRef={this._detailsList}
                  // ariaLabelForSelectionColumn="Toggle selection"
                  // ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                  // onItemInvoked={()=>{console.log("selected")}}
                  />     
            </ScrollablePane>
          </div>
      );
  }//render

  onRenderDetailsHeader(props, defaultRender){
    return (
      <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
        {defaultRender({...props})}
      </Sticky>
    );
  }//onRenderDetailsHeader

}


export default FabricDirectLinksContainer;
