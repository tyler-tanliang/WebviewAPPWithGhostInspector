'use strict';
var assert=require('assert');
//var convertorCreator= require('./ConvertTestStep');
var allure=require('wdio-allure-reporter');
var path = require('path');
var fs=require('fs');
require('wdio-screenshot');

class Executor
{
    constructor(orginalTestCaseSteps,suiteName,testcaseName){
    this.testStepConvert= require('./ConvertTestStep')();
    this.orginalTestCaseSteps=orginalTestCaseSteps;
    this.suiteName=suiteName;
    this.testcaseName=testcaseName;
    }

executeTestCase(){
    this.orginalTestCaseSteps.forEach((step,stepIndex)=>{
        try{    
            console.log(step);
            this.executeStep(step,stepIndex);
        }
        catch(e){
            console.log('Meet error:');
            console.log(e);
            var tempfile=path.join(process.cwd(), `screenshots/temp/temp.png`);
            browser.saveViewportScreenshot(tempfile,['image/png']);
            var baseScreenbuffer=fs.readFileSync(tempfile);
            allure.createAttachment('CurrentScreen',baseScreenbuffer,'image/png');
            assert.fail(`Step Failed at step: ${stepIndex}, the reason is: ${e}`);
        }
    }); 
    try{
        console.log('try to check viewport');
        const report =  browser.checkViewport();
        report.forEach(element => {
            console.log(element);
            
        });
        //var tempfile=path.join(process.cwd(), `screenshots/temp/temp.png`);
        var currentScreenfilePath=path.join(process.cwd(), `screenshots/taken/${this.suiteName}-${this.testcaseName}_${browser.desiredCapabilities.platformName} Browser.png`);  
        var currentScreenbuffer=fs.readFileSync(currentScreenfilePath); 
        allure.createAttachment('CurrentScreen',currentScreenbuffer,'image/png');
        this.assertDiff(report);
    }
    catch(e){
        console.log(e);
        // var currentScreenfilePath=path.join(process.cwd(), `screenshots/taken/${this.suiteName}-${this.testcaseName}_${browser.desiredCapabilities.browserName} Browser.png`);  
        // var currentScreenbuffer=fs.readFileSync(currentScreenfilePath); 
        // allure.createAttachment('CurrentScreen',currentScreenbuffer,'image/png');

        var differentScreenfilePath=path.join(process.cwd(), `screenshots/diff/${this.suiteName}-${this.testcaseName}_${browser.desiredCapabilities.platformName} Browser.png`);  
        var differentScreenbuffer=fs.readFileSync(differentScreenfilePath); 
        allure.createAttachment('DifferentScreen',differentScreenbuffer,'image/png');

        var baseScreenfilePathbase=path.join(process.cwd(), `screenshots/reference/${this.suiteName}-${this.testcaseName}_${browser.desiredCapabilities.platformName} Browser.png`);  
        var baseScreenbuffer=fs.readFileSync(baseScreenfilePathbase); 
        allure.createAttachment('BaseLineScreen',baseScreenbuffer,'image/png');

        throw Error('The Screen Check Failed');
    }
};

assertDiff(results){
    results.forEach((result) => assert.ok(result.isWithinMisMatchTolerance));
};

executeStep(orginalStep,stepIndex){
    browser.pause(1000);
    var now=new Date();
    var stepType=orginalStep.type; 
    switch(stepType){
        case "get":
        //ignore the step, we don't need to deal with the url in app
            break;

        case "waitForElementPresent":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.locator.value}`);
            var cssSelector=this.testStepConvert.getTransferredStepUnit(orginalStep.locator.value);
            browser.waitForExist(cssSelector,180000)
            break;

        case "verifyElementPresent":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.locator.value}, negated:${orginalStep.negated}`);
            var cssSelector=this.testStepConvert.getTransferredStepUnit(orginalStep.locator.value);
            var negated=orginalStep.negated;
            var elementIsVisibleStatus=   browser.waitUntil(
                async function(){
                    if(negated)
                    {
                        return !   browser.isVisible(cssSelector);
                    }
                    else
                        return    browser.isVisible(cssSelector);
                    },
                    20000,
                    'The Element is still visible, the css is '+cssSelector,
                    1000
            );
            assert.equal(elementIsVisibleStatus,true);
            break;

        case "store":
            var variable={
                setValue:orginalStep.text,
                parameter:'${'+orginalStep.variable+'}'
            }
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType},${variable.setValue}, ${variable.parameter}`);
            this.testStepConvert.setParameterAndValue(variable);
            break;

        case "storeEval":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.script}`);
            var scriptOfEval=this.testStepConvert.getTransferredStepUnit(orginalStep.script);
            var valueOfParameter=  browser.execute(scriptOfEval).value;
            var variable={
                setValue:valueOfParameter,
                parameter:'${'+orginalStep.variable+'}'
            }
            this.testStepConvert.setParameterAndValue(variable);
            break;

        case "setElementText":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.locator.value},${orginalStep.text}`);
            var cssSelector=this.testStepConvert.getTransferredStepUnit(orginalStep.locator.value);
            var parameterValue=this.testStepConvert.getTransferredStepUnit(orginalStep.text);
            browser.setValue(cssSelector,parameterValue);                    
            break;

        case "clickElement":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.locator.value}`);
            var cssSelector=this.testStepConvert.getTransferredStepUnit(orginalStep.locator.value);
            browser.click(cssSelector);                    
            break;
                    
        case "assertEval":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.script}`);
            var js=this.testStepConvert.getTransferredStepUnit(orginalStep.script.toString());
            var expected=orginalStep.value;
            var returnValue=  browser.execute(js);
            assert.equal(returnValue.value,expected);
            break;
                    
        case "pause":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.waitTime}`);
            var pauseTime=orginalStep.waitTime;
            browser.pause(pauseTime);
            break;
                    
        case "verifyEval":
            allure.createStep(`started@${now}||Step infor: index:${stepIndex}; content:${stepType}, ${orginalStep.script}`);
            var js=this.testStepConvert.getTransferredStepUnit(orginalStep.script);
            browser.execute(js);
            break;
    }
};

// function createExecutor(orginalTestCaseSteps,suiteName,testcaseName){    
//     return new Executor(convertorCreator(),orginalTestCaseSteps,suiteName,testcaseName);
}

module.exports = (orginalTestCaseSteps,suiteName,testcaseName) => new Executor(orginalTestCaseSteps,suiteName,testcaseName)
//module.exports=createExecutor;