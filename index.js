const inquirer = require('inquirer');
const figlet = require('figlet');
const _ = require('lodash');

var cycle, cycle, countWin, lostIndex, cycleSav, tableNum, tables, multiplications, multiplicationsSave;

class Vector2{
    constructor(x, y){
        this.x = x;
        this.y = y;
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
        console.log(answers.tables.length);
        if(answers.tables.length == 1)
            choiceTable(answers.tables);
        else{
            tables = answers.tables.split('')
            console.log(tables);
            multiplications = [];
            multiplicationsSave = [];
            tables.forEach( ( multiple, index)=> {
                [4,6,7,8,9,12].forEach( (factor) => {
                    multiplications.push(new Vector2(Number(multiple), factor));
                } )
            });

            multiplications = _.shuffle(multiplications);
            multiplicationsSave = _.clone(multiplications);
        }
        next();
        // tableNum = Number(answers.table);
        // cycle = _.shuffle([4,6,7,8,9,12]);
        // cycleSaved = _.clone(cycle);
        // lostIndex = []
        // countWin = 0;
        // next();
    }).catch( (err) =>{

    })
}

function choiceTable(){
    inquirer.prompt([
        {
            type : "input",
            name: "table",
            message: "Quelle table ?"
        }
    ]).then( (answers)=>{
        tableNum = Number(answers.table);
        cycle = _.shuffle([4,6,7,8,9,12]);
        cycleSaved = _.clone(cycle);
        lostIndex = []
        countWin = 0;
        next();
    }).catch( (err) =>{

    })
}

function next(){
    console.clear()
    let randNum = cycle.shift()

    inquirer.prompt([
        {
            type : "number",
            name: "result",
            message: `${tableNum} x ${randNum}`
        }
    ]).then( (answers)=>{

        if(answers.result == tableNum*randNum)
            countWin ++
        else{
            lostIndex.push(cycleSaved.length - cycle.length  - 1);
        }


        figlet( String(tableNum*randNum), (err, data) => {
            if(err){}
            console.log(data);
        });

        _.delay( ()=>{
            if(cycle.length)
                next();
            else{
                if(false){
                    showResult();
                    choiceTable();
                }
                if(countWin < cycleSaved.length)
                    retryFailed();
                else
                    choiceTable();

            }
        }, 1000 )

        // inquirer.prompt([
        // {
        //     type : "input",
        //     name: "next",
        //     message: "next (enter)"
        // }
        // ]).then( (answers)=>{

        //     if(cycle.length)
        //         next();
        //     else{
        //         console.log(countWin, '/', cycleSaved.length);
        //         choiceTable();
        //     }
        // }).catch( (err) =>{
        // })

    }).catch( (err) =>{

    })

}

function showResult(){
    console.log('Résultat', countWin, '/', cycleSaved.length);
    if(countWin < cycleSaved.length){
        console.log('Revoir : ');
        lostIndex = lostIndex.sort();
        lostIndex.forEach( (index) =>{
            console.log( ' - ' ,tableNum, 'x' ,cycleSaved[index], '=', tableNum*cycleSaved[index]);
        } )
    }
}

function retryFailed(){
    cycle = []
    lostIndex.forEach( (index) =>{
        cycle.push(cycleSaved[index]);
    } )
    cycle = _.shuffle(cycle);
    cycleSaved = _.clone(cycle);
    lostIndex = []
    countWin = 0;

    next();
}


choiceTables()

