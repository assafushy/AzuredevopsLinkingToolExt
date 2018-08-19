import React, { Component } from 'react'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


export default class QuerySelectBox extends Component {
  
  menuItemFactory(queryList){
   console.log(queryList)
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
        <InputLabel htmlFor="age-simple">Query Select</InputLabel>
        <Select
          value={10}
          onChange={(event)=>{
                            console.log(`selected query id : ${event.target.value}`);
                            this.props.onQuerySelectHandler(event.target.value,this.props.containerSide);
                          }}
        >

          {this.menuItemFactory(this.props.queryList)}
        </Select>
      </div>
    )
  }
}
