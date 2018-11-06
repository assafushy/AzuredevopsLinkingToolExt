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
import userImg from './img/userStoryImg.png';


export function imgSelector(wiType){
    
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
    case 'User Story':
      return userImg;
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
