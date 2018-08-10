'use strict';

class ConvertTestStep{
    constructor() {
    this.parameterAndValueMap=new Map();
    }

    getTransferredStepUnit(orginalStepUnit) {
        return this.updateStepUnit(orginalStepUnit);
    };

    setParameterAndValue(variable){ 
        var setValue=this.updateStepUnit(variable.setValue);
        this.parameterAndValueMap.set(variable.parameter,setValue);
    };

    updateStepUnit(orginalStepUnit){
        var updatedStepUnit=orginalStepUnit;
        this.parameterAndValueMap.forEach((value,key)=>{
            if(updatedStepUnit.indexOf(key)>-1){
                updatedStepUnit=updatedStepUnit.replace(new RegExp('\\'+key,'g'),value);
            }
        });
        return updatedStepUnit;
    }

    clearParameters(){
        this.parameterAndValueMap.clear();
    };


}
module.exports=() => new ConvertTestStep()
//module.exports=createConvertTestStep;