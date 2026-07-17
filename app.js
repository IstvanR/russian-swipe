/* =========================
   STATE
========================= */

let words = [];

let index = 0;

let showHungarian = true;


/* =========================
   MENU
========================= */

const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");


menuBtn.addEventListener("click", () => {

    menuPanel.classList.toggle("hidden");

});



function openTab(tabId) {

    document.querySelectorAll(".menuTab")
        .forEach(tab => {

            tab.classList.add("hidden");

        });


    document.getElementById(tabId)
        .classList.remove("hidden");

}




/* =========================
   PAGE JUMP
========================= */


function goToPage() {


    const page =
        parseInt(
            document.getElementById("pageInput").value
        );


    if(isNaN(page))
        return;


    let newIndex = page - 1;


    if(newIndex < 0)
        return;


    if(newIndex >= words.length)
        return;


    index = newIndex;

    showHungarian = true;


    render();


    menuPanel.classList.add("hidden");

}



function jumpTo(page){


    if(page < 0)
        return;


    if(page >= words.length)
        return;


    index = page;

    showHungarian = true;


    render();


    menuPanel.classList.add("hidden");

}





/* =========================
   RENDER
========================= */


function render(){


    if(words.length === 0)
        return;



    const item = words[index];



    const label =
        document.getElementById("languageLabel");


    const word =
        document.getElementById("word");


    const button =
        document.getElementById("flipBtn");




    if(showHungarian){


        label.innerText = "MAGYAR";

        word.innerText = item.hu;

        button.innerText =
            "Mutasd az oroszt";


    }
    else{


        label.innerText = "РУССКИЙ";

        word.innerText = item.ru;

        button.innerText =
            "Mutasd a magyart";


    }




    document.getElementById("counter")
        .innerText =
        `${index+1} / ${words.length}`;


}






/* =========================
   FLIP BUTTON
========================= */


document
.getElementById("flipBtn")
.addEventListener("click",()=>{


    showHungarian = !showHungarian;


    render();


});







/* =========================
   NAVIGATION
========================= */


function next(){


    if(index < words.length-1){


        index++;

        render();


    }


}




function prev(){


    if(index > 0){


        index--;

        render();


    }


}







/* =========================
   KEYBOARD
========================= */


document.addEventListener("keydown",e=>{


    if(e.key==="ArrowDown"){

        next();

    }


    if(e.key==="ArrowUp"){

        prev();

    }


    if(e.key===" " || e.key==="Enter"){


        e.preventDefault();


        showHungarian =
            !showHungarian;


        render();


    }


});







/* =========================
   SWIPE
========================= */


let startY = 0;

let startX = 0;



document.addEventListener(
"touchstart",
e=>{


    startY =
    e.touches[0].clientY;


    startX =
    e.touches[0].clientX;


},
{passive:true}
);




document.addEventListener(
"touchend",
e=>{


    let endY =
    e.changedTouches[0].clientY;


    let endX =
    e.changedTouches[0].clientX;



    let diffY =
    startY - endY;



    let diffX =
    startX - endX;



    // túl kicsi mozgás

    if(Math.abs(diffY)<50)
        return;



    // oldalirányú swipe

    if(Math.abs(diffX)>Math.abs(diffY))
        return;




    if(diffY>0){

        next();

    }
    else{

        prev();

    }


},
{passive:true}
);







/* =========================
   MOUSE SWIPE
========================= */


let mouseStartY = 0;



document.addEventListener(
"mousedown",
e=>{


    mouseStartY = e.clientY;


});



document.addEventListener(
"mouseup",
e=>{


    let diff =
    mouseStartY - e.clientY;



    if(Math.abs(diff)<50)
        return;



    if(diff>0){

        next();

    }
    else{

        prev();

    }


});







/* =========================
   CSV LOAD
========================= */


fetch("words.csv")

.then(response=>{


    if(!response.ok){

        throw new Error(
            "words.csv nem található"
        );

    }


    return response.text();


})

.then(text=>{


    const result =
        Papa.parse(
            text,
            {
                skipEmptyLines:true
            }
        );



    words =
    result.data
    .filter(row=>row.length>=3)
    .map(row=>({


        id:row[0],


        hu:row[1].trim(),


        ru:row[2].trim()


    }));



    console.log(
        "Betöltött szavak:",
        words.length
    );



    render();



})

.catch(error=>{


    console.error(error);



    document.getElementById("word")
    .innerText =
    "CSV betöltési hiba";


});