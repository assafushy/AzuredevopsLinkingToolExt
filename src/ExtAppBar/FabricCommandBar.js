import React,{Component} from 'react';
import { CommandBar} from 'office-ui-fabric-react/lib/CommandBar';



class FabricCommandBar extends Component {
  
  generateQueryItems(queryArray,containerSide){
    
    let queryItems=[];
    
      queryArray.forEach((query) => {
        
        let item =  {
          key: query.id,
          name: query.queryName,
          onClick:()=>{ this.props.onQuerySelectHandler(query.id,containerSide);}
        }
        queryItems.push(item);
      });//forEach
      
      return [
        {
          key: 'newItem',
          name: 'Please Select A Query',
          cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
          iconProps: {
            iconName: 'Add'
          },
          ariaLabel: 'New. Use left and right arrow keys to navigate',
          subMenuProps: {
            items: queryItems
          }
        },{
          key: 'Refresh',
          name: 'Refresh',
          iconProps: {
            iconName: 'Refresh'
          },
          onClick: () => {
            if(containerSide == 'left'){this.props.onQuerySelectHandler(this.props.leftQueryId,containerSide);};
            if(containerSide == 'right'){this.props.onQuerySelectHandler(this.props.rightQueryId,containerSide);}
            }
        },{
          key: 'Expand',
          name: 'Expand All',
          iconProps: {
            iconName: 'ExploreContent'
          },
          onClick: () => {
            this.props.handleExpandAndCollapse('expand',containerSide)
            }
        },{
          key: 'Expand',
          name: 'Collapse All',
          iconProps: {
            iconName: 'CollapseContent'
          },
          onClick: () => {
            this.props.handleExpandAndCollapse('collapse',containerSide)
            }
        }
      ]; 
  }//generateQueryItems

  render() {
    return (
      <div>
        <div align="center" background-color="rgb(244, 244, 244)">
        <br/>
          <strong padding="10" margin="10">Work Items DnD Linking Tool - (Default link - Child of | Hold down Ctrl - Tests | Hold down Shift - Covers)</strong>
        </div>
         <CommandBar
          items={this.generateQueryItems(this.props.queryList,"left")}       
          farItems={this.generateQueryItems(this.props.queryList,"right")}
          ariaLabel={'Use left and right arrow keys to navigate between commands'}
        />
      </div>
    );
  }

}//class



export default FabricCommandBar;
