import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


export default class QuerySelectBox extends Component {
  
  menuItemFactory(queryList){
   //console.log(queryList)
    if(queryList){
      return queryList.map((listItem)=>{
        return <MenuItem value={listItem.id}>{listItem.queryName}</MenuItem>;
      });
    }else{
      return <MenuItem value={null}>fetching data...</MenuItem>
    }
  }
  
  render() {
    return (
      <div>
        <InputLabel htmlFor="age-simple">Selected query {this.props.containerSide} :  </InputLabel>
        <Select
          value={this.props.queryId}
          onChange={(event)=>{
                            this.props.onQuerySelectHandler(event.target.value,this.props.containerSide);
                          }}
        >

          {this.menuItemFactory(this.props.queryList)}
        </Select>
      </div>
    )
  }
}
