import React, { Component } from 'react';
import {imgSelector} from '../Actions/ImgGenerator'
import styled from 'styled-components';

const ListItem = styled.div`
maging:8px;
border: 1px solid lightgrey`;

// WorkItem ICD :
//   ID: Number
//   Title: String
//   Type:String
//   State:String
//   NumOfLinks:Number

export default class DirectLinksContainer extends Component {
 
  
  render() {
    return (<ListItem> <img/> nothing here</ListItem> 
    )
  }//render
}
