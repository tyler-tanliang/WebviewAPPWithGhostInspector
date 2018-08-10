'use strict'


const https = require('https');

class TestPlan{
    constructor(suiteIDs,ghostInspectorApiKey){
        this.suites=suiteIDs;    
        this.ghostInspectorApiKey=ghostInspectorApiKey;
        this.suitesMap=new Map();
        this.allFinished=[];        
    }
    

    checkFinished(){
        var finished=true;
        this.allFinished.forEach(everyCheck => {
            finished=everyCheck&finished;
        });
        return finished;
    }

    getAllTestCasesInfo(){
        for(var i=0;i<this.suites.length;i++)
        {
            this.allFinished.push(false);
        }
        console.log('getAllTestCasesInfo');
        for(var i=0;i<this.suites.length;i++){
            this.getTestCaseListInformation(this.suites[i],i);
        }
    }

    getTestCaseListInformation(suiteID,suiteNumber){
        https.get(`https://api.ghostinspector.com/v1/suites/${suiteID}/tests/?apiKey=${this.ghostInspectorApiKey}`, res=>{
            this.getTestCaseListInformationCallBack(res,suiteNumber);
        });
    }

    getTestCaseListInformationCallBack(res,suiteNumber){
        var testcasesMap=new Map();
        let json='';
        res.on('data', (data) => {
            json+=data;
          });
    
        res.on('end',()=>{
            let result='';
            result = JSON.parse(json);
            if(result!=='' && result.data.length>0){
                var suiteName=result.data[0].suite.name;
                result.data.forEach((element,index,array) => {
                    let testcaseJson='';
                    https.get(`https://api.ghostinspector.com/v1/tests/${element._id}/export/selenium-json/?apiKey=${this.ghostInspectorApiKey}`, (res) => {
                        console.log('get test case from ghost inspector');
                        res.on('data', (data) => {
                            testcaseJson+=data;
                            });
                        let testcaseResult='';
                        res.on('end',()=>{
                            testcaseResult = JSON.parse(testcaseJson);
                            testcasesMap.set(element.name,testcaseResult);
                            if(index===array.length-1){
                                console.log('one suite is get finished');
                                this.allFinished[suiteNumber]=true;
                                console.log(this.allFinished[suiteNumber]);
                        }
                        });
                    })
                });
                this.suitesMap.set(suiteName,testcasesMap);
            }        
        });
    }

}

module.exports = (suiteIDs,ghostInspectorApiKey) => new TestPlan(suiteIDs,ghostInspectorApiKey)