import React, { Component } from 'react';
import {DetailsList,DetailsListLayoutMode} from 'office-ui-fabric-react/lib/DetailsList';
import bugImg from '../Actions/img/bugImg.png';  

let columnList = [
    {
      key: 'ID',
      name: 'ID',
      fieldName: 'ID',
      minWidth: 10,
      maxWidth: 20,
      isResizable:true,
      ariaLabel: 'Operations for name',
    },
    {
      key: 'Title',
      name: 'Title',
      fieldName: 'Title',
      minWidth: 100,
      maxWidth: 500,
      isResizable: true,
      ariaLabel: 'Operations for value',
      onRender: (item) => {
        return <div >
                    <img src={bugImg} width="30" height="30"/> - 
                    <p>{item.Title}</p>
                </div>
      }
    }
  ];


class FabricFlatContainer extends Component {  
   
    render() {
        return (
            <div>
                <DetailsList
                    items={[{ID:1,Title:"set middle ware function based on"}]}
                    columns={columnList}
                    // setKey="set"
                    layoutMode={DetailsListLayoutMode.fixedColumns}
                    // selection={this._selection}
                    // selectionPreservedOnEmptyClick={true}
                    // componentRef={this._detailsList}
                    // ariaLabelForSelectionColumn="Toggle selection"
                    // ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    // onItemInvoked={this._onItemInvoked}
                />     
            </div>
        );
    }
}


export default FabricFlatContainer;
