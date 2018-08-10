'use strict';

const ghostInspectorApiKey='yourKey';
const runSuiteIDs=['The Suite IDs you want to check'];

describe('Get TestCases describe',function(){
    console.log('run default describe');

    it('Get testcases it',function(){
        console.log('run default it');
        var testPlan= require('../Helpers/TestPlan')(runSuiteIDs,ghostInspectorApiKey);
        testPlan.getAllTestCasesInfo()
        browser.waitUntil(function(){return testPlan.checkFinished()},180000,'Can not get test Cases from GhostInspector',1000);
        for (var suite of testPlan.suitesMap) {
            console.log('run suite:');
            describe(suite[0],function(){
                console.log('run describe：'+suite[0]);
                beforeEach('Initialize browser',function(){
                    console.log('run beforeEach');
                    browser.reload();
                });
                var testcasesMap=suite[1];
                for(var testcase of testcasesMap){
                    it(suite[0]+'-'+testcase[0],function(){
                        console.log('run it:'+testcase[0]);
                        var testCaseRunner=require('../Helpers/ExecuteStep')(testcase[1].steps,suite[0],testcase[0]);
                        testCaseRunner.executeTestCase();    
                    });
                }
            });  
        }
    });
});

