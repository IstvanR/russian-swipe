let words = [];

let index = 0;

let showHungarian = true;



const menuBtn = document.getElementById("menuBtn");

const menuPanel = document.getElementById("menuPanel");



menuBtn.onclick = () => {

    menuPanel.classList.toggle("hidden");

};



function openTab(id){

    document.querySelectorAll(".menuTab")
    .forEach(x=>x.classList.add("hidden"));


    document.getElementById(id)
    .classList.remove("hidden");

}



function render(){


    if(words.length===0)
        return;


    let item = words[index];


    if(showHungarian){

        document.getElementById("languageLabel").innerText="MAGYAR";

        document.getElementById("word").innerText=item.hu;

        document.getElementById("flipBtn").innerText=
        "Mutasd az oroszt";

    }

    else{


        document.getElementById("languageLabel").innerText="РУССКИЙ";


        document.getElementById("word").innerText=item.ru;


        document.getElementById("flipBtn").innerText=
        "Mutasd a magyart";

    }


    document.getElementById("counter").innerText=
    `${index+1} / ${words.length}`;

}



document.getElementById("flipBtn").onclick=()=>{


    showHungarian=!showHungarian;

    render();

};




function next(){

    if(index < words.length-1){

        index++;

        showHungarian=true;

        render();

    }

}



function prev(){

    if(index>0){

        index--;

        showHungarian=true;

        render();

    }

}




function goToPage(){


    let p=parseInt(
        document.getElementById("pageInput").value
    );


    if(!isNaN(p)){

        index=p-1;

        render();

        menuPanel.classList.add("hidden");

    }

}




function jumpTo(p){

    index=p;

    render();

    menuPanel.classList.add("hidden");

}






document.addEventListener("keydown",e=>{


    if(e.key==="ArrowDown")
        next();


    if(e.key==="ArrowUp")
        prev();


    if(e.key===" ")
    {

        showHungarian=!showHungarian;

        render();

    }


});






fetch("words.csv")

.then(r=>r.text())

.then(text=>{


    console.log(text);


    let data=Papa.parse(text,{
        skipEmptyLines:true
    });


    words=data.data.map(row=>({

        id:row[0],

        hu:row[1],

        ru:row[2]

    }));


    console.log(words);


    render();


})

.catch(e=>{


    console.error(e);


    document.getElementById("word").innerText=
    "CSV betöltési hiba";

});