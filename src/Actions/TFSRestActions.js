/*global VSS*/
  
export default class TFSRestActions {

// PAT = encodePat("ouphoofiwhtbsl3houzxg6qocgos7bwsxpxcvaq4vtk6yxdcnksa")
  constructor(){
    let wiClient;
    let workItemContracts;
    this.init().then(()=>{console.log(`initlized`)});
  }

  init(){
    return new Promise((resolve,reject)=>{
      VSS.require(["TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/Services"],
      async (workItemClient, workItemContracts)=> {
        this.wiClient = await workItemClient.getClient();
        this.workItemContracts = workItemContracts;
        resolve();
      })//require
    })  
  }//init

  async getQueryResultsById(id){
    let queryResults = await this.wiClient.queryById(id);
    // console.log(`queryResults : ${JSON.stringify(queryResults)}`)
    return queryResults;
  }//getQueryResultsById

  async populateQueryResult(resultsArray){
    let wiPopulatedArray = [];
    wiPopulatedArray = await Promise.all(resultsArray.map(async (wi)=>{
      let wiData = await this.wiClient.getWorkItem(wi.id);
      //console.log(JSON.stringify(wiData));
      return{
        id: wiData.id,
        title: wiData.fields["System.Title"],
        type:wiData.fields["System.WorkItemType"],
        url:wiData.url
      } 
    }));

    // console.log(`populated wi array : ${JSON.stringify(wiPopulatedArray)}`);
    return wiPopulatedArray;
  }

  async fetchSharedQueriesData(){
    return new Promise(async (resolve,reject)=>{
      VSS.require(["TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/Services"],
        async (workItemClient, workItemContracts)=> {
          let wiClient = await workItemClient.getClient();
  
          let queries = await wiClient.getQueries(VSS.getWebContext().project.id, workItemContracts.QueryExpand.All, 2, null);
                  
          let sharedQueries = queries.find( (query)=> { return query.name === "Shared Queries"; });
          let sharedQueriesArray = [sharedQueries];
  
          let queryListObject = [];
  
          // console.log(`name of query root :${sharedQueriesArray[0].children}`);
          
          sharedQueriesArray[0].children.forEach((query)=>{
            
           if(query.isFolder === true){
            query.children.forEach((childQuery)=>{
              let newObj = {
                "queryName":childQuery.name,
                "wiql":childQuery.wiql,
                "id":childQuery.id
              }
              queryListObject.push(newObj);
            });
           }else{
            let newObj = {
              "queryName":query.name,
              "wiql":query.wiql,
              "id":query.id
            }
            queryListObject.push(newObj);
           }
   
            // console.log(JSON.stringify(query));  
            // console.log("---");
            // console.log("---")
            // console.log("---")
            
          })//foreach
          // console.log(queryListObject);
          resolve(queryListObject);
       });//VSS.require
    })//Promise
  }//getSharedQueriesData

  async addLinkToWi(wi1,wi2,linkType,success){
    try{
      await this.wiClient.updateWorkItem(
        [{
          "op": "add",
          "path": "/relations/-",
          "value": {
            "rel": `System.LinkTypes.${linkType}`,
            "url": `https://assafushy.visualstudio.com/_apis/wit/workItems/${wi2}`,
            "attributes": {
              "comment": "Making a new link for the dependency"
              }
            }
          }
        ],wi1); 
      }catch(error){
        // console.log(JSON.stringify(error))
        success(null,null,error);
        return false;
      }   
      success(wi1,wi2);
  }//addLinkToWi

}