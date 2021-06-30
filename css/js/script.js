//   '<img  src"' + keyImage + '" width="20" height="20" id="theKey"/>'

//function that works in conjuntion with the css in my style shee to produce a flaslight effect
//updates location of mouse as an event
   

function update(e){

  const x = e.clientX || e.touches[0].clientX
  const y = e.clientY || e.touches[0].clientY

 //triggering style changes here
 document.documentElement.style.setProperty('--cursorX', x + 'px')
 document.documentElement.style.setProperty('--cursorY', y + 'px')
}

$('#container').on('mousemove',update)
$('#container').on('touchmove',update)


let keyImage = ["https://previews.123rf.com/images/piren/piren1703/piren170301299/74444961-the-key-icon-on-a-black-background-.jpg"];

let doorImage = ["https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/130477165/original/6db589535dcda0b4f030da05a538c38694942759/draw-game-backgrounds-in-pixel-style.png"];

let demonImage = ["https://thumbs.gfycat.com/AdoredCleanBonobo-max-1mb.gif"]

let timeLeft = 60;

let timer = $('#Timer');

let timerId; 

const darkRoomTheme = document.getElementById('play');

const playBttn = document.getElementById('buttn');

//allows users to toggle sound
playBttn.addEventListener('click', function() {
 
 if (this.dataset.playing === 'false') {
   darkRoomTheme.play();
   this.dataset.playing = 'true';
 } else if (this.dataset.playing === 'true') {
   darkRoomTheme.pause();
   this.dataset.playing = 'false';
 }
}, false);


//resets game state
function resetGame() {
  timeLeft = 60;
  $('#inventory').children().remove();
  $('.key-location').html('');
  spawnKey();
 }



//opening message
function playAlert() {
     $.confirm({
       theme: 'my-theme',
       title:'DarkRoom',
       content:`Find the keys, Unlock the doors and Beware you're not alone...`,
       buttons: {
         play: {
           keys: ['enter'],
           btnClass: 'btn-warning',
           //hitting enter on play screen or clicking play starts timer and game 
           action: function countdown() {
            if (timeLeft === -1) {
              // clearTimeout(timerId);
              $.confirm({
                theme:'my-theme',
                title: `Game Over!`,
                content: `You've failed to escape in time.`,
                buttons: {
                  restart: {
                    key: ['enter'],
                    btnClass: 'btn-transparent',
                    action: 
                    //reset for within here because of scope issues
                    function resetGameWin() {
                      timeLeft = 60;
                      timerId = setTimeout(countdown, 1000)
                      $('#inventory').children().remove();
                      $('.key-location').html('');
                      spawnKey();
                     },
                  }
                }
              })
            } else {
              //sets timer countdown
              timerId = setTimeout(countdown, 1000);
              timer.html(timeLeft + ' seconds remaining');
              timeLeft--;
            }
          },
  
         },
     }
 })
}
playAlert();

//spawns keys
function spawnKey() {
//in a random spot
 let random = Math.floor(Math.random()* $('.key-location').length) + 1;
 //console.log(random);
 //on the screen
 $('.key-location').eq(random).append('<img src="'  + keyImage +  '" width="30" height="30" id="theKey"/>')    
}
spawnKey();

//spawns door
function spawnDoor() {
 let randomTwo = Math.ceil(Math.random()* $('.key-location').length) + 1;
 //console.log(randomTwo);
 $('.key-location').eq(randomTwo).append('<img src="'  + doorImage +  '" width="30" height="30" id="theDoor"/>')
}

//spawns three monsters 
function spawnMonster() {
let randomThree = Math.floor(Math.random()* $('.key-location').length) + 1;
let randomFour = Math.floor(Math.random()* $('.key-location').length) + 1;
$('.key-location').eq(randomThree).append('<img src="'  + demonImage +  '" width="40" height="40" class="theDemons"/>')
$('.key-location').eq(randomFour).append('<img src="'  + demonImage +  '" width="40" height="40" class="theDemons"/>')

}

//click event on the container of the game
$('#container').on('click', function(e){
e.preventDefault();
e.stopPropagation();
if (timeLeft === -1) {
  return;
}
//if the players invertory contains six keys stop game and alert with message
if ($('#inventory').children().length === 6) {
   $.alert({
     title: 'You Escaped!',
     content: `with ${timeLeft} seconds remaining`,
     theme: 'my-theme',
     buttons: {
       play: {
        key: ['enter'],
        btnClass: 'btn-transparent',
        action: resetGame(),
       }
     }
   })
  //  console.log($('#inventory').children().length)
   return;
}
//append key on click to inventory
if (e.target.id === 'theKey') {
   $('#inventory').prepend(e.target);
   spawnDoor();
   return;
}

//remove target of click and spawn a new key in a random spot then return if the ID of the event was theDoor
if (e.target.id === 'theDoor') {
 e.target.remove();
 spawnMonster();
 spawnKey();
 return;
}

});

//mouseover event that tiggers when you go over a demon
//ps you die
$('#container').mouseover(function (e){
e.preventDefault();
e.stopPropagation();
if (e.target.className === 'theDemons') {
$.alert({
 theme:'my-theme',
 title: `Game Over!`,
 content: `You've been slain by a demon.`,
 buttons: {
   restart: {
    key:['enter'],
     btnClass: 'btn-transparent',
     action: resetGame(),
   }
 }
})
}
})


