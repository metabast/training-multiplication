const inquirer = require('inquirer');
const figlet = require('figlet');
const _ = require('lodash');

var firstRun, countWin, lostIndex, tables, multiplications, multiplicationsSaved , multiplicationsRunLocked, timer;

class Multi{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.lostCount = 0;
    }

    calculate(){
        return this.x * this.y;
    }
}

function choiceTables()
{
    inquirer.prompt([
        {
            type : "input",
            name: "tables",
            message: "Quelles tables ?"
        }
    ]).then( (answers)=>{
        
        timer = new Date().getTime()
        tables = answers.tables.split(' ')
        multiplications = [];
        multiplicationsSaved = [];
        multiplicationsRunLocked = [];
        tables.forEach( ( multiple, index)=> {
            // [4,6].forEach( (factor) => {
            [4,6,7,8,9,12].forEach( (factor) => {
                multiplications.push(new Multi(Number(multiple), factor));
            } )
        });

        multiplications = _.shuffle(multiplications);
        multiplications.forEach( function(multi, index) {
            multiplicationsSaved.push(multi);
            multiplicationsRunLocked.push(multi);
        });

        lostIndex = []
        countWin = 0;
        next();
    }).catch( (err) =>{

    })
}

function next(){
    console.clear()
    let multiplication = multiplications.shift();

    inquirer.prompt([
        {
            type : "number",
            name: "result",
            message: `${multiplication.x} x ${multiplication.y}`
        }
    ]).then( (answers)=>{

        if(answers.result == multiplication.calculate())
            countWin ++
        else{
            lostIndex.push(multiplicationsSaved.length - multiplications.length  - 1);
        }


        figlet( String(multiplication.calculate()), (err, data) => {
            if(err){}
            console.log(data);
        });

        _.delay( ()=>{
            if(multiplications.length)
                next();
            else{
                if(false){
                    showResult();
                    choiceTables();
                }
                if(countWin < multiplicationsSaved.length)
                    retryFailed();
                else{
                    console.log(multiplicationsRunLocked);
                    console.log('Exercice terminé en ', (new Date().getTime() - timer) *.001, 'secondes' )
                    choiceTables();
                }

            }
        }, 1000 )

    }).catch( (err) =>{

    })

}

function showResult(){
    console.log('Résultat', countWin, '/', multiplicationsSaved.length);
    if(countWin < multiplicationsSaved.length){
        console.log('Revoir : ');
        lostIndex = lostIndex.sort();
        // lostIndex.forEach( (index) =>{
        //     console.log( ' - ' ,tableNum, 'x' ,multiplicationsSaved[index], '=', tableNum*multiplicationsSaved[index]);
        // } )
    }
}

function retryFailed(){
    multiplications = []
    lostIndex.forEach( (index) =>{
        multiplicationsSaved[index].lostCount ++
        multiplications.push(multiplicationsSaved[index]);
    } )
    console.log(multiplicationsRunLocked);
    multiplications = _.shuffle(multiplications);
    multiplicationsSaved = [];
    multiplications.forEach( function(multi, index) {
        multiplicationsSaved.push(multi);
    });
    lostIndex = []
    countWin = 0;

    _.delay( next, 2000 )
}


choiceTables()

