class NumericValuesAnimator {
    //The array could be also a class
    //Position can be an atribute
    public animateValue(array: any, position: any): void{
        
        const result = this.useLetters(Number.parseInt(array[position]));
        array[position] = "0";
        const top : number = result[0];
        const letter : string = result[1];

        let increment: number = 1;
        let duration = this.setDuration(top);
        
        if (top >= 100){
          increment = 9;
        }
    
        let count = 0;
        let diff: number;

        let intervalId = setInterval(() => {
          array[position] = count + letter;
          count = count + increment;
          diff = top - count;

          if (diff < 100){
            increment = 1;
          }

          if(count >= top){
            array[position] = count + letter;
            clearInterval(intervalId);
          }
        }, duration);
        
        
    }

    private setDuration(top: number): number{

      let coc : number = 2.5;
      if (top >= 250){
        coc = 60;
      }else if (top >= 100){
        coc = 30;
      }else if (top >= 50){
        coc = 20;
      }else if (top >= 25){
        coc = 10;
      }else if (top >= 10){
        coc = 5;
      }
      return ((999 - top)/(coc)) + 1;
    }


    public useLetters(value: number): any[]{
        let letter = "";

        if ((value >= 1000)&&(value < 1000000)){
            letter = "K";
            value = Math.floor(value / 1000);

        }else if ((value >= 1000000)&&(value < 1000000000 )) {
            letter = "M";
            value = Math.floor(value / 1000000);

        }else if (value >= 1000000000){
            letter = "B";
            value = Math.floor(value / 1000000000);
        }

        return [value, letter];
    }

}
export const numericAnimator = new NumericValuesAnimator();
