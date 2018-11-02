/*global VSS*/
import _ from 'lodash';

export default class TFSRestActions {

  // PAT = encodePat("ouphoofiwhtbsl3houzxg6qocgos7bwsxpxcvaq4vtk6yxdcnksa")
  constructor() {
    let wiClient;
    let workItemContracts;
    this.init().then(() => {
      console.log(`initlized`)
    });
  } //constructor

  init() {
    return new Promise((resolve, reject) => {
      VSS.require(["TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/Services"],
        async (workItemClient, workItemContracts) => {
          this.wiClient = await workItemClient.getClient();
          this.workItemContracts = workItemContracts;
          console.log(this.workItemContracts);
          resolve();
        }) //require
    })
  } //init

  async getQueryResultsById(id) {
    console.log(id);
    let queryResults = await this.wiClient.queryById(id);
    // console.log(`queryResults : ${JSON.stringify(queryResults)}`)
    return queryResults;
  } //getQueryResultsById

  async populateWorkItemDataById(id, isParent = false,depthlvl=0,wiParentId=null) {

    let wiData = await this.wiClient.getWorkItem(id, null, null, this.workItemContracts.WorkItemExpand[1]);

    return ({
      id: wiData.id,
      title: wiData.fields["System.Title"],
      type: wiData.fields["System.WorkItemType"],
      url: wiData._links.html.href,
      relations: wiData.relations,
      depth:depthlvl,
      isParent: isParent,
      parentId: wiParentId,
      children: [],
      visible: true,
      isExpanded: true
    });
  } //populateWorkItemDataById

  async populateQueryResult(resultsArray) {
    console.log(JSON.stringify(resultsArray));
    let wiPopulatedArray = [];
    console.log(resultsArray.queryType)
    switch (resultsArray.queryType) {
      case 1:
        console.log(`flat query results`);
        wiPopulatedArray = await Promise.all(resultsArray.workItems.sort((a, b) => {
          return a.id < b.id
        }).map(async (wi) => {
          let wiData = await this.populateWorkItemDataById(wi.id);
          return wiData;
        }));
        break;
      case 2:
        console.log(`tree query results`);
        console.log(JSON.stringify(resultsArray));
        
        for (let index = 0; index < resultsArray.workItemRelations.length; index++) {
          const wi = resultsArray.workItemRelations[index];
          if (!wi.source) {
            let wiData = await this.populateWorkItemDataById(wi.target.id);
            console.log(`source : ${wi.target.id}`);
            await wiPopulatedArray.push(wiData);
          }else{
            console.log(`searching for ${wi.source.id}`)
            let i = _.findIndex(wiPopulatedArray, (o) => {
              return o.id == wi.source.id;
            });//findIndex
            console.log(`found in index ${i}`)
            if (i == -1) {
              console.log(`No element was found!`);
            } else {
              console.log(`populating ${wi.target.id}`)
              wiPopulatedArray[i].isParent = true;
              
              ///need to make the find index and the populate async to get the performance needed
             
              let wiData = await this.populateWorkItemDataById(wi.target.id,false,wiPopulatedArray[i].depth+1,wi.source.id);
              console.log(`done populating ${wi.target.id}`)
              wiPopulatedArray.push(wiData);
            }
          }          
        }
        console.log(wiPopulatedArray);
        break;
      case 3:
        console.log(`Direct Links populate function`);
        await Promise.all(resultsArray.workItemRelations.map(async (wi) => {
          if (!wi.source) {
            let wiData = await this.populateWorkItemDataById(wi.target.id);
            // console.log(`source : ${wi.target.id}`);
            wiPopulatedArray.push(wiData);
          }
        }));
        wiPopulatedArray = _.sortBy(wiPopulatedArray, (o) => {
          return o.id
        });
        await Promise.all(resultsArray.workItemRelations.map(async (wi) => {
          if (wi.source) {
            // console.log(wi.source.id);
            let i = _.findIndex(wiPopulatedArray, (o) => {
              return o.id == wi.source.id;
            });
            if (i == -1) {
              // console.log(i);
            } else {
              // console.log(`index is: ${i}`);
              wiPopulatedArray[i].children.push(await this.populateWorkItemDataById(wi.target.id, false,1));
            }
          }
        })); //map
        // console.log(JSON.stringify(wiPopulatedArray));
        break;
      default:
        break;
    }
    return wiPopulatedArray;
  } //populateQueryResult

  async iterateWorkItemsArray(WIarray,wi){
    WIarray.forEach(async (element,index)=>{
      if(WIarray[index].id === wi.source.id){
        WIarray[index].children.push(await this.populateWorkItemDataById(wi.target.id,false,1))
      }//if
      if(WIarray[index].children){
        WIarray[index].children = this.iterateWorkItemsArray(WIarray[index].children,wi);
      }//if
    })//foEach  
    return WIarray;
  }//iterateWorkItemsArray

  async fetchSharedQueriesData() {
    return new Promise(async (resolve, reject) => {
      VSS.require(["TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/Services"],
        async (workItemClient, workItemContracts) => {
          let wiClient = await workItemClient.getClient();

          let queries = await wiClient.getQueries(VSS.getWebContext().project.id, workItemContracts.QueryExpand.All, 2, null);

          let sharedQueries = queries.find((query) => {
            return query.name === "Shared Queries";
          });
          let sharedQueriesArray = [sharedQueries];

          let queryListObject = [];

          // console.log(`name of query root :${sharedQueriesArray[0].children}`);

          sharedQueriesArray[0].children.forEach((query) => {

            if (query.isFolder === true) {
              query.children.forEach((childQuery) => {
                let newObj = {
                  "queryName": childQuery.name,
                  "wiql": childQuery.wiql,
                  "id": childQuery.id
                }
                queryListObject.push(newObj);
              });
            } else {
              let newObj = {
                "queryName": query.name,
                "wiql": query.wiql,
                "id": query.id
              }
              queryListObject.push(newObj);
            }

            // console.log(JSON.stringify(query));  
            // console.log("---");
            // console.log("---")
            // console.log("---")

          }) //foreach
          // console.log(queryListObject);
          resolve(queryListObject);
        }); //VSS.require
    }) //Promise
  } //getSharedQueriesData

  async addLinkToWi(wi1, wi2, linkType, success) {
    try {
      // tested by - ctrl
      // need to display links count by type

      await this.wiClient.updateWorkItem(
        [{
          "op": "add",
          "path": "/relations/-",
          "value": {
            "rel": `${linkType}`,
            "url": `https://assafushy.visualstudio.com/_apis/wit/workItems/${wi2}`,
            "attributes": {
              "comment": "Making a new link for the dependency"
            }
          }
        }], wi1);
    } catch (error) {
      // console.log(JSON.stringify(error))
      success(null, null, error);
      return false;
    }

    let wi1Data = await this.wiClient.getWorkItem(wi1, null, null, this.workItemContracts.WorkItemExpand[1]);
    let wi2Data = await this.wiClient.getWorkItem(wi2, null, null, this.workItemContracts.WorkItemExpand[1]);
    success(wi1Data, wi2Data);

  } //addLinkToWi

}