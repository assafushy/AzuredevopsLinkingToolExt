import React, { Component } from 'react';
import {DetailsList,DetailsListLayoutMode,Selection} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';  
import styled from 'styled-components';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import {imgSelector} from '../Actions/ImgGenerator';


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

let columnList = [
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
      maxWidth: 500,
      isResizable: true,
      ariaLabel: 'WorkItem title',
      onRender: (item) => {
        let img = imgSelector(item.type);
        return <TitleWrapper>
                    <img src={img} width="30" height="30"/>
                    <p > - {item.title}</p>
                </TitleWrapper>
      }//onRender
    },
    {
        key: 'Links',
        name: 'Links',
        fieldName: 'Links',
        minWidth: 100,
        maxWidth: 500,
        isResizable: true,
        ariaLabel: 'WorkItem links status',
        onRender: (item) => {
          
          let links = categorizeLinks(item.relations);
           return( 
              <TitleWrapper>
                <div align='center' padding='5'>
                  <p><strong>Parent</strong></p>
                  <p>{links.parent}</p>
                </div>
                <div align='center'>
                  <p><strong>Child</strong></p>
                  <p>{links.child}</p>
                </div>
                <div align='center'>
                  <p><strong>Covers</strong></p>
                  <p>{links.covers}</p>
                </div>
                <div align='center'>
                  <p><strong>Covered by</strong></p>
                  <p>{links.coveredBy}</p>
                </div>
                <div align='center'>
                  <p><strong>Tests</strong></p>
                  <p>{links.tests}</p>
                </div>
                <div align='center'>
                  <p><strong>Tested by</strong></p>
                  <p>{links.testedBy}</p>
                </div>
              </TitleWrapper>
           )
        }
    }
  ];


class FabricFlatContainer extends Component {  
   
  constructor(){
    super();
    let  _selection;
  }
  _selection = new Selection();
  
  styles = ()=>{
    return {maxHeight: '100%',  overflow: 'auto'};
  }

  _getDragDropEvents(){
      return {
        canDrop: (dropContext, dragContext) => {
          return true;
        },
        canDrag: (item) => {
          return true;
        },
        onDragEnter: (item, event) => {
          console.log(`dragenterItem ${JSON.stringify(item)}`);
          console.log(`dragEnterEvent ${JSON.stringify(event)}`)
          return 'dragEnter';
        }, // return string is the css classes that will be added to the entering element.
        onDragLeave: (item, event) => {
          return ;
        },
        onDrop: (item, event) => {
          console.log(item);
          console.log(event)
        },
        onDragStart: (item, itemIndex, selectedItems, event) => {
          console.log(`item: ${JSON.stringify(item)}`);
          console.log(`itemIndex: ${JSON.stringify(itemIndex)}`);
          console.log(`selectedItems: ${JSON.stringify(selectedItems)}`);
          console.log(`event: ${JSON.stringify(event)}`);
          
          // this.props.handleDragEvent()

        },
        onDragEnd: (item, event) => {
          console.log("drag ended")
        }
      };
  }//_getDragDropEvents

  render() {
      return (
          <div>
              <DetailsList
                  items={this.props.wiArray}
                  columns={columnList}
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selection={this._selection}
                  dragDropEvents={this._getDragDropEvents()}
                  styles={{root:{maxHeight: '100%',  overflow: 'auto'}}}
                  // setKey="set"
                  // selectionPreservedOnEmptyClick={true}
                  // componentRef={this._detailsList}
                  // ariaLabelForSelectionColumn="Toggle selection"
                  // ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                  // onItemInvoked={()=>{console.log("selected")}}
                  />     
          </div>
      );
  }
}


export default FabricFlatContainer;