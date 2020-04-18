
export class CompMeasPreparation {

    prepareDataFromCompMeasRequest(p_componentMeasures: any): any{

      
        
      
        let measuresCombinedString: string = "";
        let resp : string;
        for(let resComp of p_componentMeasures){   
            resp = JSON.stringify(resComp).replace("[",",");
            resp = resp.replace(/]$/,"");        
            measuresCombinedString = measuresCombinedString + resp;
        } 

        measuresCombinedString = measuresCombinedString.replace(",","[");
        measuresCombinedString = measuresCombinedString + "]";
        let measuresCombinedJson = JSON.parse(measuresCombinedString);

        return measuresCombinedJson;

      
    }


    joinComponentsANDProjectsMeasures(p_projectMeasures:any, p_componentMeasures:any): any{
     

        let compIndex: number = 0;
        let projIndex: number = 0;
        let componentsMeasures: any = [];    
        let prevProjId: number = p_projectMeasures[0]['idproject'];
    
        for (let comp of p_componentMeasures){
    
          componentsMeasures[compIndex] = comp;
          compIndex = compIndex + 1;
          
    
          if (prevProjId != comp['idproject']){       
            p_projectMeasures[projIndex]['component'] = componentsMeasures;
    
            projIndex = projIndex + 1;
            prevProjId = comp['idproject'];
            componentsMeasures = [];
            compIndex = 0;
          }
        }
        p_projectMeasures[projIndex]['component'] = componentsMeasures;
    
        return p_projectMeasures;
      
        
      
        
  }
    
}
