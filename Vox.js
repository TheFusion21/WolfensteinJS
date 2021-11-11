var worldMap;
var MapSize = 64;
//FOR THE PLAYER
var Cos90;
var Sin90;
//SCREEN
var canvas, context;
var w = 320;
var h = 200;
var sh = h-48;
var sw = w-16;
var framerate  = 1000;
var lastFPS = 0;
//TIME
var time = 0;
var oldTime = 0;
var deltaTime;

//INPUT
var keys = [];
//TEXTURES
var TexSize = 64;
var Images = {};
//GameObjects
var Player;
var Objects = [];
var Zbuffer = [];
var spriteOrder = [];
var spriteDistance = [];
var currentScene;
var lvl = 0;

//DEBUG
var DEBUG = true;
var DEBUG_KEY = KeyCode.F9;//F9
var DEBUG_FONT_KEY = KeyCode.LeftShift;
var DEBUG_KEYUP = true;
var DEBUG_DRAWCALLS = 0;
var DEBUG_lastWorkTime = 0;
var DEBUG_refreshTime = 0;
//MenuStuff
var isMenu = false;
var targetState = 0;
var prevState = [];
var State = 0;
var opac = 0;
var Faded = false;
var stateTimer = 0;
var showtime = 10;
var opacSpeed1 = 1;
var opacSpeed2 = 4;

var MainMenuIndex = 0;
var MainMenuList = [];

var NewGameIndex = 0;
var NewGameList = [];

var ControlMenuIndex = 0;
var ControlMenuList = [];
var sensitivity = 1;

var DifMenuIndex = 2;
var DifMenuList = [];

var ReadThisIndex = 0;
var ReadThisList = [];

var LoadGameIndex = 0;
var LoadGameCount = 10;

var ScoreList = [];
var HighScoreList = [];

var ControlsIndexX = 0;
var ControlsIndexY = 0;
var ControlsList = [];
var ControlsOffset = 0;
var ControlsMaxLines = 10;

var MoveDown = false;
var timeThreshold = 0.4;
var curTime = 0;
var cookie;
window.requestAnimFrame = (function(callback) {return function(callback) {window.setTimeout(callback, 1000/framerate);};})();

window.onload = function()
{
    time = Date.now();

    Cookies.loadCookies();
    if(Cookies.exsistCookie("Controls"))
    {
        Controls = Cookies.getCookie("Controls");
    }
    if(Cookies.exsistCookie("MouseSense"))
    {
        sensitivity = Cookies.getCookie("MouseSense");
    }
    //ADD CANVAS AND LOAD CONTEXT
    if(window.innerHeight > window.innerWidth)
        document.body.innerHTML += '<canvas id="myCanvas" width="' + w + '" height="' + h +'" style="width: ' + window.innerWidth + 'px;height:' + window.innerWidth*.625 +'px;"></canvas>';
    else
    {
        if( window.innerHeight*1.6 > window.innerWidth)
        {
            document.body.innerHTML += '<canvas id="myCanvas" width="' + w + '" height="' + h +'" style="width: ' + window.innerWidth + 'px;height:' + window.innerWidth*.625 +'px;"></canvas>';
        }
        else
            document.body.innerHTML += '<canvas id="myCanvas" width="' + w + '" height="' + h +'" style="width: ' + window.innerHeight*1.6 + 'px;height:' + window.innerHeight +'px;"></canvas>';
    }
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    Input.Init();
    //INPUT LISTENERS
    document.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });
    
    loadImages({
        TexturesDark: 'assets/imgs/TexturesDark.png',
        TexturesBright: 'assets/imgs/Textures.png',
        Frame: 'assets/imgs/Frame.png',
        Hud: 'assets/imgs/HUD.png',
        Weapons: 'assets/imgs/Weapons.png',
        Objects: 'assets/imgs/Objects.png',
        Guard: 'assets/imgs/Guard.png',
        Pre: 'assets/imgs/Pre.png',
        MenuGUI: 'assets/imgs/MenuGUI.png',
        MenuGUI2: 'assets/imgs/MenuGUI2.png',
        MenuBG: 'assets/imgs/MenuBG.png',
        MenuPanel: 'assets/imgs/MenuPanel.png',
        Fonts1: 'assets/imgs/Fonts.png',
        Fonts2: 'assets/imgs/Fonts2.png',
        Fonts3: 'assets/imgs/Fonts3.png',
        Fonts4: 'assets/imgs/Fonts4.png',
        Fonts5: 'assets/imgs/Fonts5.png',
        Fonts6: 'assets/imgs/Fonts6.png',
        Fonts7: 'assets/imgs/Fonts7.png',
        Fonts8: 'assets/imgs/Fonts8.png',
        Fonts9: 'assets/imgs/Fonts9.png',
        Fonts10: 'assets/imgs/Fonts10.png',
        Fonts11: 'assets/imgs/Fonts11.png'
    }, function()
    {
        MainMenuList = [
            {text: "New Game", state: "", action: function() {targetState = 6;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Sound", state: "disabled", action: function() {}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Control", state: "", action: function() {targetState = 4;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Load Game", state: "", action: function() {targetState = 9;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Save Game", state: "disabled", action: function() {}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Change View", state: "disabled", action: function() {}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Read This!", state: "", action: function() {targetState = 8;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "View Scores", state: "", action: function() {targetState = 10;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Back to Demo", state: "disabled", action: function() {}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}}
        ];
        ControlMenuList = [
            {text: "Mouse Enabled", state: "", action: function() 
                {
                    ControlMenuList[0].enable = !ControlMenuList[0].enable
                    ControlMenuList[2].state = (ControlMenuList[0].enable ? "" : "disabled")
                    Cookies.setCookie("Mouse", ControlMenuList[0].enable);
                }
                , enable: (Cookies.exsistCookie("Mouse") ? (Cookies.getCookie("Mouse") ? true : false) : true), font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Joystick Enabled", state: "", action: function()
                {
                    ControlMenuList[1].enable = !ControlMenuList[1].enable;
                    Cookies.setCookie("Joystick", ControlMenuList[1].enable);
                }, enable: (Cookies.exsistCookie("Joystick") ? (Cookies.getCookie("Joystick") ? true : false) : true), font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Mouse Sensitivity", state: (Cookies.exsistCookie("Mouse") ? (Cookies.getCookie("Mouse") ? "" : "disabled") : ""), action: function() {targetState = 5;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Customize controls", state: "", action: function() {targetState = 11;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}}
        ]
        NewGameList = [
            {text: "Episode 1\nEscape from Wolfenstein", state: "", action: function() {targetState = 7;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Episode 2\nOperation: Eisenfaust", state: "", action: function() {targetState = 7;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Episode 3\nDie, Fuhrer, Die!", state: "", action: function() {targetState = 7;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Episode 4\nA Dark Secret", state: "", action: function() {targetState = 7;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Episode 5\nTrail of the Madman", state: "", action: function() {targetState = 7;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Episode 6\nConfrontation", state: "", action: function() {targetState = 7;prevState.push(State);}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
        ]
        DifMenuList = [
            {text: "Can I play, Daddy?", state: "", action: function() {targetState = "game";}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Don't hurt me.", state: "", action: function() {targetState = "game";}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "Bring 'em on!", state: "", action: function() {targetState = "game";}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
            {text: "I am Death incarnate!", state: "", action: function() {targetState = "game";}, font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}}
        ]
        ReadThisList = [
            [
                {text: "QUICK COMMAND REFERENCE", x: 16, y: 17, font: Images.Fonts8},
                {text: "Arrows move. Ctrl shoots. Alt strafes.\n\nF1   Help\nF2   Save game (F8 for Quick save)\nF3   Load game (F9 for Quick load)\nF4   Sound menu\nF5   Resize view window\nF6   Controls menu\nF7   End Game\nF10  Exit to Dos\n\nRead on for more information.", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "TABLE OF CONTENTS", x: 96, y: 37, font: Images.Fonts8},
                {text: "STORY\nCONTROLS\nABOUT\n\nMORE WOLFENSTEIN!\n\nFOREIGN ORDERS", x: 80, y: 67, font: Images.Fonts7},
                {text: "Id", x: 122, y: 87, font: Images.Fonts9},
                {text: "ORDERING", x: 80, y: 97, font: Images.Fonts10},
                {text: "SOFTWARE CREATIONS", x: 80, y: 117, font: Images.Fonts4},
                {text: ". . . . . . . . . . . . . 3", x: 120, y: 67, font: Images.Fonts7, fontSize:5},
                {text: ". . . . . . . . . . 6", x: 144, y: 77, font: Images.Fonts7, fontSize:5},
                {text: ". . . . . . . . . . 12", x: 144, y: 87, font: Images.Fonts7, fontSize:5},
                {text: ". . . . . . . . . . . 16", x: 136, y: 97, font: Images.Fonts7, fontSize:5},
                {text: ". . . 19", x: 200, y: 107, font: Images.Fonts7, fontSize:5},
                {text: "24", x: 224, y: 117, font: Images.Fonts7, fontSize:5},
                {text: ". . . . . 28", x: 184, y: 127, font: Images.Fonts7, fontSize:5}
            ],
            [
                {img: Images.Pre, sx: 104, sy: 88, sw: 96, sh:88, x: 16, y:66},
                {img: Images.MenuGUI, sx: 379, sy: 146, sw: 176, sh:48, x: 72, y:12},
                {text: "You stand oer the guard\'s\nbody, grabbing frantically\nfor his gun. You\'re not\nsure if the other guards\nheard his muffled scream.\nDeep in the belly of a Nazi\ndungeaon, you\'ve only\na knife, a gun, and you wits\nto aid your escape.", x: 120, y: 68, font: Images.Fonts7}
            ],
            [
                {img: Images.MenuGUI, sx: 0, sy: 0, sw: 112, sh:56, x: 16, y:16},
                {text: "Just a few weeks ago\nyou were on a\nreconnaissance mission of\nextreme importance.\nYou were to infiltrate\nthe Nazi fortress and", x: 136, y: 17, font: Images.Fonts7},
                {text: "find the plans for Operation Eisenfaust.\nCaptured in your attempt, you were taken\nto their prison, and awaited your\nexecution.  Only you know where the plans\nare kept, and the Allies will face a great\ndefeat if you don\'t escape!  You must face\nthe horrors of the prison keep known as\nWolfenstein.", x: 16, y: 77, font: Images.Fonts7}
            ],
            [
                {img: Images.Pre, sx: 200, sy: 89, sw: 120, sh:80, x: 16, y:16},
                {text: "Captain William J. \"B.J.\"\nBlazkowicz, you\'ve got a\ngun and eight floors of\nhell to get through.\nGood luck!", x: 144, y: 17, font: Images.Fonts7},
                {text: "Hey, if you make it, you\'ll have something\nto tell your grandkids about . . . .\n\nIf you don\'t, at least you\'ll go out in a\nblaze of glory!", x: 16, y: 107, font: Images.Fonts7}
            ],
            [
                {text: "CONTROLS", x: 88, y: 17, font: Images.Fonts8},
                {img: Images.MenuGUI, sx: 235, sy: 0, sw: 64, sh:56, x: 16, y:16},
                {text: "In Wolfenstein 3-D, you can use\nthe keyboard, mouse, joystick,\norGravis PC Gamepad.", x: 88, y: 37, font: Images.Fonts7},
                {text: "To move around the menus, use the arrow\nkeys to move from item to item, then\npress\nalways backs out. You can press the first\nletter of a menu item to go to that item.\n\nOr use the mouse, joystick, or Gamepad--\nthey word, too!", x: 16, y: 77, font: Images.Fonts7},
                {text: "Enter", x: 58, y: 97, font: Images.Fonts10},
                {text: "Esc", x: 246, y: 97, font: Images.Fonts10},
                {text: "to select that item.", x: 100, y: 97, font: Images.Fonts7}
            ],
            [
                {img: Images.MenuGUI, sx: 113, sy: 0, sw: 120, sh:32, x: 16, y:20},
                {text: "Once you are in the\ngame, use the arrow\nkeys to move. Hold\ndown Shift to run fast.", x: 144, y: 17, font: Images.Fonts7},
                {text: "Press Ctrl to fire you weapon.\n\nUse Alt with the left and right arrows to\nslide side to side instead of turning left or\nright. This is called \"Strafe Mode.\"\n\nPress Space to Open Doors and activate\nelevators to go to the next floor of the\nkeep.", x: 16, y: 67, font: Images.Fonts7},
                {text: "Shift", x: 183, y: 47, font: Images.Fonts10},
                {text: "Ctrl", x: 58, y: 67, font: Images.Fonts10},
                {text: "Alt", x: 44, y: 87, font: Images.Fonts10},
                {text: "Space", x: 58, y: 127, font: Images.Fonts10}
            ],
            [
                {img: Images.MenuGUI, sx: 235, sy: 0, sw: 64, sh:56, x: 16, y:16},
                {text: "When using the mouse or\njoystick, use button 1 to shoot,\n button 2 to strafe.", x: 88, y: 17, font: Images.Fonts7},
                {text: "With a three-button mouse, use the third\button to open doors.\n\nGravis PC Gamepads have a fourth button,\nuseful as a run button", x: 16, y: 77, font: Images.Fonts7}
            ],
            [
                {text: "Once you have more than one weapon, the\nkeys 1-4 choose the weapons:", x: 16, y: 17, font: Images.Fonts7},
                {img: Images.MenuGUI, sx: 0, sy: 57, sw: 96, sh:48, x: 104, y:50},
                {text: "Holding down the fire button is fun, but\nshort bursts save bullets.", x: 16, y: 117, font: Images.Fonts7}
            ],
            [
                {text: "Some walls in the prison can be pushed\nback to reveal hidden rooms. Hold down\nSpace to push the wall in front of you.\nJust think of Space as the Use key. It will\nuse doors, use elevators, and so on.", x: 16, y: 17, font: Images.Fonts7},
                {img: Images.MenuGUI, sx: 202, sy: 33, sw: 32, sh:16, x: 16, y:74},
                {text: "There are locked doors in the castle\nthat require either a gold or silver", x: 56, y: 77, font: Images.Fonts7},
                {text: "key. It will be somewhere on the floor you're on.", x: 16, y: 97, font: Images.Fonts7},
                {img: Images.MenuGUI, sx: 113, sy: 33, sw: 88, sh:16, x: 8, y:124},
                {text: "If you find you health\ndropping, pick up some food", x: 104, y: 127, font: Images.Fonts7},
                {text: "or first aid. You'll find you're damaged\nmore when shot at close range", x: 16, y: 147, font: Images.Fonts7}
            ],
            [
                {img: Images.MenuGUI, sx: 113, sy: 50, sw: 104, sh:48, x: 16, y:16},
                {text: "Pick up the ammo left\nbehind when you toast\nsomeone.  For instance,\nperforate an SS--free\nmachine gun!", x: 128, y: 17, font: Images.Fonts7},
                {text: "You get a free guy every 40,000 points,\nso collect those treasures! (You can have a\nmaximum of nine lives.)\n\nWhen you get killed, you lose everything but\nyour gun and start at the beginning of the\nfloor you were on.", x: 16, y: 87, font: Images.Fonts7}
            ],
            [
                {text: "ABOUT Id SOFTWARE", x: 16, y: 17, font: Images.Fonts8},
                {text: "Id", x: 58, y: 17, font: Images.Fonts10},
                {text: "Yes, that's Id, as in the id, ego and\nsuperego in the psyche.  We think\nshareware is a fine alternative to the high\nprices of commercial vendors.  For under\ntwelve dollars a game, you can get the\nhottest, fastest texture-mapped game\navailable.  How can you beat that?", x: 16, y: 37, font: Images.Fonts7},
                {text: "We'll answer that question in a\nfew months. . . .", x: 16, y: 117, font: Images.Fonts10},
                {img: Images.MenuGUI, sx: 322, sy: 146, sw: 56, sh:48, x: 240, y:116}
            ],
            [
                {text: "Id Software is . . .", x: 16, y: 17, font: Images.Fonts8},
                {text: "PROGRAMMERS", x: 16, y: 37, font: Images.Fonts10},
                {text: "John Carmack\nJohn Romero", x: 16, y: 47, font: Images.Fonts7},
                {text: "ARTIST", x: 16, y: 77, font: Images.Fonts10},
                {text: "Adrian Carmack", x: 16, y: 87, font: Images.Fonts7},
                {text: "CREATIVE DIRECTOR", x: 16, y: 107, font: Images.Fonts10},
                {text: "Tom Hall", x: 16, y: 117, font: Images.Fonts7},
                {img: Images.MenuGUI, sx: 322, sy: 146, sw: 56, sh:48, x: 240, y:116}
            ],
            [
                {text: "Id Software is . . .", x: 16, y: 17, font: Images.Fonts8},
                {text: "MANUAL DESIGN", x: 16, y: 37, font: Images.Fonts10},
                {text: "Kevin Cloud", x: 16, y: 47, font: Images.Fonts7},
                {text: "CHIEF OPERATING OFFICER", x: 16, y: 67, font: Images.Fonts10},
                {text: "Jay Wilbur", x: 16, y: 77, font: Images.Fonts7},
                {img: Images.MenuGUI, sx: 322, sy: 146, sw: 56, sh:48, x: 240, y:116}
            ],
            [
                {text: "CONTRIBUTORS", x: 16, y: 17, font: Images.Fonts8},
                {text: "COMPOSER", x: 16, y: 37, font: Images.Fonts10},
                {text: "Robert Prince", x: 16, y: 47, font: Images.Fonts7},
                {text: "ADDITIONAL PROGRAMMING", x: 16, y: 67, font: Images.Fonts10},
                {text: "Jason Blochowiak", x: 16, y: 77, font: Images.Fonts7}
            ],
            [
                {text: "ORDERING WOLFENSTEIN 3-D", x: 16, y: 17, font: Images.Fonts8},
                {text: "Don't miss the next two exciting episodes:", x: 16, y: 37, font: Images.Fonts7},
                {text: "Operation: Eisenfaust", x: 16, y: 57, font: Images.Fonts10},
                {text: "Fight an evil army of undead killing\nmachines, the hideous experiments of the\nmaniacal Dr. Schabbs!  Then battle the\ndeadly Doctor himself!", x: 16, y: 67, font: Images.Fonts7},
                {text: "Die, Fuhrer, Die!", x: 16, y: 117, font: Images.Fonts10},
                {text: "With the Third Reich crumbling around him,\nHitler seems bent on taking the world with\nhim.  You must charge his gigantic bunker,\nfind him, and end the evil one and for all!", x: 16, y: 127, font: Images.Fonts7}
            ],
            [
                {text: "ORDERING WOLFENSTEIN 3-D", x: 16, y: 17, font: Images.Fonts8},
                {text: "Register now and receive:\n* All three exciting adventures\n* All digitized sounds\n* New graphics and enemies\n* Cool 16-page manual\n* The Secret Cheat password\n* Exciting new bonus game\n\nTo order, call toll free:\n    1-800-426-3123\n(Visa and MasterCard Welcome)\nOrder all three adventures for only $35,\nplus $4 shipping.", x: 16, y: 37, font: Images.Fonts7},
                {img: Images.MenuGUI, sx: 300, sy: 0, sw: 64, sh:32, x: 224, y:50},
                {img: Images.MenuGUI, sx: 300, sy: 33, sw: 64, sh:32, x: 224, y:100},
                
            ],
            [
                {text: "ORDERING INFORMATION", x: 16, y: 17, font: Images.Fonts8},
                {text: "Please specify disk size:   5.25\"  or  3.5\"\n\nPlease indicate if you have high-density disk\ndrives.\n\nTo order send $35, plus $4 shipping, USA\nfunds, to:\n\n  Apogee Software\n  P.O. Box 496389\n  Garland, TX 75049-6389  (USA)\n\nOr CALL NOW toll free: 1-800-426-3123", x: 16, y: 37, font: Images.Fonts7},
            ],
            [
                {text: "ALSO AVAILABLE", x: 16, y: 17, font: Images.Fonts8},
                {text: "Ready for a real challenge?  Available right\nnow are three more episodes of\nWolfenstein 3-D: the Nacturnal Mission! In\nthis prequel, B.J. must stop a Nazi plan for\nchemical warfare. Don't miss an\naction-packed second of it!\n\nNocturnal Missions\nBoth trilogies\nHint Book\n\nWhat hint book? See the next page!", x: 16, y: 37, font: Images.Fonts7},
                {text: "Wolfenstein 3-D: the Nocturnal Missions!", x: 16, y: 57, font: Images.Fonts10},
                {text: "$20 + $4 S&H\n$50 + $4 S&H\n$10", x: 152, y: 107, font: Images.Fonts7}

            ],
            [
                {text: "WOLFENSTEIN HINT BOOK!", x: 16, y: 17, font: Images.Fonts8},
                {text: "If you want to know every nook and\ncranny of every level, get the Wolfenstein\n3-D Hint Book for only $10!  All six episodes\nare shown in exquisite detail.\n\nIt's also filled with fun facts about Id and\nthe developement of Wolfenstein 3-D.  Find\nout secrets about B.J. Blazkowicz and get\ncool tips. Snazzy!", x: 16, y: 37, font: Images.Fonts7},
                {text: "Wolfenstein", x: 223, y: 47, font: Images.Fonts10},
                {text: "3-D Hint Book", x: 16, y: 57, font: Images.Fonts10}
            ],
            [
                {text: "NOCTURNAL MISSIONS (Wolf 1-3 Required)", x: 16, y: 17, font: Images.Fonts8},
                {text: "Episode Four: A Dark Secret", x: 16, y: 37, font: Images.Fonts10},
                {text: "Intelligence has uncovered a Nazi plot for\nlarge scale chemical warfare.  You must\neliminate maniac scientist Otto Giftmacher.", x: 16, y: 47, font: Images.Fonts7},
                {text: "Episode Five: Trail of the Madman", x: 16, y: 87, font: Images.Fonts10},
                {text: "The scientist is dead but the plans are in\nmotion. Explore the dark dungeon and find\nthe plans, man!", x: 16, y: 97, font: Images.Fonts7},
                {text: "Episode Six: Controntation", x: 16, y: 137, font: Images.Fonts10},
                {text: "Prepare for the final battle with General\nFettgesicht, organizer of the chemical war!", x: 16, y: 147, font: Images.Fonts7}
            ],
            [
                {text: "SPEAR OF DESTINY", x: 16, y: 17, font: Images.Fonts8},
                {text: "This new, incredibly challenging Wolfenstein\nadventure boasts twenty levels, four tough\nbosses, plus new graphics and music for\nthe most amazing Wolfenstein yet!\n\nThe Spear of Destiny--legend has it that\nwith this spear no force may be defeated\ninbattle. BJ must fight the forces in\nCastle Nuremberg and wrest the Spear\nfrom Adolf's clutches!\n\nGet this amazing adventure for only $35\nfrom Apogee!", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {img: Images.MenuGUI2, sx: 0, sy: 0, sw: 256, sh:143, x: 16, y:17}
            ],
            [
                {text: "USE YOUR FAX MACHINE TO ORDER!", x: 16, y: 17, font: Images.Fonts8},
                {text: "You can now use your FAX machine to\noder your favorite Apogee games quickly\nand easily.\n\nSimply print out the ORDER.FRM file, fill it\nout and Fax it to us or prompt\nprocessing.\n\nFAX Orders: (214) 278-4670", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "THE OFFICIAL APOGEE BBS", x: 16, y: 17, font: Images.Fonts8},
                {text: "The SOFWARE CREATION BBS is the home\nBBS for the latest Apogee games. Check\nout our Free \'Apogee\' file section for new\nreleases and updates.\n\nBBS phone lines:\n  (508) 365-2359\n  (508) 368-4137\n  (508) 368-7036\n\nHome of the Apogee BBS Network!\nA Major Multi-LIne BBS.", x: 16, y: 37, font: Images.Fonts7},
                {text: "2400 baud\n2400-14.4K USR\n2400-14.4K V.32", x: 144, y: 97, font: Images.Fonts7}
            ],
            [
                {text: "APOGEE ON AMERICA ONLINE!", x: 16, y: 17, font: Images.Fonts8},
                {text: "America Online (AOL) is host of the Apogee\nForum, where you can get new Apogee\ngames. Use the Apogee message areas to\ntalk and exchange ideas, comments and\nsecrets with our designers and other\nplayers.  If you're already a member,\nafter you log on, use the keyword\n\"Apogee\" (Ctrl-K) to go to the Apogee area.\n\nIf you'd like to know how to join, please\ncall toll free: 1-800-827-6364. Please ask\nfor extension 6131. You'll get the FREE\nstartup kit.", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "WATCH OUT!", x: 16, y: 17, font: Images.Fonts8},
                {text: "Apogee now has their own official section\non Exec-PC, the world's largest bulletin\nboard. All the hottest new shareware\ngames are there!\n\nLook in the section named \"Apogee Games\nCollection.\"  (Currently in file collection \"R\".)\n\nCall (414) 789-4210 with your modem to\njoin the fun on Exec-PC!", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "FOREIGN CUSTOMERS", x: 16, y: 17, font: Images.Fonts8},
                {text: "The following screens list our dealers\noutside the United States: Australia, Canada\nand the United Kingdom.  These are official\nApogee dealers with the latest games and\nupdates.\n\nIf your country is not listed, you may\norder directly from Apogee by phone:", x: 16, y: 37, font: Images.Fonts7},
                {text: "(214) 278-5655", x: 104, y: 127, font: Images.Fonts7}
            ],
            [
                {text: "AUSTRALIAN CUSTOMERS (1 of 3)", x: 16, y: 17, font: Images.Fonts8},
                {text: " BudgetWare\n P.O. Box 496\n Newtown, NSW  2042\n\nTRILOGY PRICE: $45 + $5 shipping.\n      ALL SIX: $65 + $5 shipping.\n\n Phone:\n Toll free:\n Fax:\n CompuServe:71520,1475\n\nUse MasterCard, Visa, Bankcard, cheques.", x: 16, y: 37, font: Images.Fonts7},
                {text: "(02) 519-4233\n(008) 022-064\n(02) 516-4236", x: 96, y: 107, font: Images.Fonts7}
            ],
            [
                {text: "AUSTRALIA (2 of 3)", x: 16, y: 17, font: Images.Fonts8},
                {text: " Manaccom\n 9 Camford Str.\n Milton, QLD  4064\n\nTRILOGY PRICE: $45 + $5 shipping.\n      ALL SIX: $65 + $5 shipping.\n Phone:\n Toll free:\n Fax:\n CompuServe:71520,1475\n\nUse MasterCard, Visa, Bankcard, AmEx,\ncheques.", x: 16, y: 37, font: Images.Fonts7},
                {text: "(07) 368-2366\n(008) 022-064\n(07) 369-7589", x: 96, y: 97, font: Images.Fonts7}
            ],
            [
                {text: "AUSTRALIA (3 of 3)", x: 16, y: 17, font: Images.Fonts8},
                {text: " Vision Shareware\n 4/146 Greenhill Rd.\n Parkside SA 5063\n\nTRILOGY PRICE: $45 + $5 shipping.\n      ALL SIX: $65 + $5 shipping.\n\n Phone:\n Toll free:\n Fax:\n CompuServe:71520,1475\n\nUse MasterCard, Visa, Bankcard, cheques.", x: 16, y: 37, font: Images.Fonts7},
                {text: "(08) 373-4469\n(008) 807 486\n(08) 373-4482", x: 96, y: 107, font: Images.Fonts7}
            ],
            [
                {text: "CANADIAN CUSTOMERS", x: 16, y: 17, font: Images.Fonts8},
                {text: " Distant Markets\n Box 1149\n 194 - 3803 Calgary Trail S.\n Edmonton, Alb.  T6J 5M8\n CANADA\n\nTRILOGY PRICE: $47 Canadian.\n      ALL SIX: $70 Canadian.\n\n Orders:\n Inquiries:\n Fax:\nUse MasterCard, Visa or money orders.", x: 16, y: 37, font: Images.Fonts7},
                {text: "1-800-661-7383\n(403) 436-3009\n1-800-661-9756", x: 84, y: 127, font: Images.Fonts7}
            ],
            [
                {text: "UNITED KINGDOM CUSTOMERS", x: 16, y: 17, font: Images.Fonts8},
                {text: " Precision Software Applications\n Unit 3, Valley Court Offices\n Lower Rd.\n Croydon, Near Royston\n Herts. SG8 0HF, United Kingdom\n\nTRILOGY PRICE: 29# + VAT + 2 P&P\n      ALL SIX: 44# + VAT + 2 P&P\n\n Phone:\n FAX:\nCredit cards, Access, or cheques. Make\ncheques payable to PSA.", x: 16, y: 37, font: Images.Fonts7},
                {text: "+44 (0) 223 208 288\n+44 (0) 223 208 089", x: 62, y: 127, font: Images.Fonts7}
            ],
            [
                {text: "NEW ZEALAND CUSTOMERS", x: 16, y: 17, font: Images.Fonts8},
                {text: " PC-SIG New Zealand\n P.O. BOX 90088\n Victoria Street West\n Auckland, New Zealand\n\nTRILOGY PRICE: $85 (including shipping, etc.)\n      ALL SIX: $120\n\n Phone:\n Fax:\n\nUse Visa, Mastercard, Amex, Diners", x: 16, y: 37, font: Images.Fonts7},
                {text: "3600-500\n3600-800", x: 68, y: 117, font: Images.Fonts7}
            ],
            [
                {text: "DANISH CUSTOMERS", x: 16, y: 17, font: Images.Fonts8},
                {text: " Prof. Shareware Danmark\n Benlose Skel 4 G\n DK-4100 Ringsted Denmark\n\nTRILOGY PRICE: kr. 277,00 (includes shipping)\n      ALL SIX: kr. 390,00\n\n Phone:\n Fax:\nUse Visa, Mastercard, cheques.", x: 16, y: 37, font: Images.Fonts7},
                {text: "(+45) 53 51 90 42\n(+45) 53 61 93 91", x: 72, y: 107, font: Images.Fonts7}
            ],
            [
                {text: "A FRIENDLY REMINDER", x: 16, y: 17, font: Images.Fonts8},
                {text: "Episode One is shareware.  The other five\nepisodes are not: they are only available\nfrom Apogee or authorized dealers.  Please\ndo not distribute episodes two through six.\nIt's easy to do, but the next game will\njust cost more if you do it.\n\nPlease report any illegal selling and\ndistribution of this game to Apogee by\ncalling 1-800-GAME123.  Or call the SPA\nPiracy Hotline: 1-800-388-PIR8.", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "ABOUT APOGEE", x: 16, y: 17, font: Images.Fonts8},
                {text: "Our goal is to establish Apogee as the\nleading distributor of commercial quality\nshareware games. With enthusiasm and\ndedication, we think our goal can be\nachieved.\n\nHowever,  we need your support.\nShareware is not free software.\n\nWe thank you in advance for your\ncontribution to the growing shareware\ncommunity. Your honesty pays . . . .", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "QUOTES FROM THE GUYS", x: 16, y: 17, font: Images.Fonts8},
                {text: "Here's some quotes from the Id guys:\n\nAdrian Carmack, Master of the Pixel:\n\"Okay, now for the CGA version . . . NOT!\"\n\n\nJohn Carmack, Technical Director:\n\"I just mapped video memory into User\nAdress Space on my Color NeXTStation!\"", x: 16, y: 37, font: Images.Fonts7}
            ],
            [
                {text: "QUOTES FROM THE GUYS", x: 16, y: 17, font: Images.Fonts8},
                {text: "John Romero, Programming Director:\n\"I really need to work on my Total Time of\n5:20 for Episode One.  I was messing\naround too much in those rooms.\"\n\n\nTom Hall, Creative Director:\n\"Ya don't bring a pistol to a machine gun\nfight.\"\n(Since i'm typing this, I'd like to plug John\nBlackwell's F.Godmom game. It's a great\npuzzle game.  Look for his new 4.0 version\nonline!)", x: 16, y: 37, font: Images.Fonts7},
                {text: "F.Godmom", x: 89, y: 137, font: Images.Fonts10}
            ],
            [
                {text: "AUTO-BACKSCRATCHING", x: 16, y: 17, font: Images.Fonts8},
                {text: "Other Id games also available from Apogee:", x: 16, y: 37, font: Images.Fonts7},
                {text: "Commander Keen", x: 16, y: 57, font: Images.Fonts10},
                {text: "\"Invasion of the Vorticons\": $30 for trilogy\n\n\"Goodbye, Galaxy!\": $35 for two episodes\n\n\"Aliens Ate My BabySitter!\": $35\n(That's our commercial game.)\n\nSuper Keen Fun Pack: $90 (for all 6)\n\nCall 1-800-Game123 for information.", x: 16, y: 67, font: Images.Fonts7}
            ],
            [
                {text: "CONCLUSION", x: 16, y: 17, font: Images.Fonts8},
                {text: "Thanks for playing Wolfenstein 3-D.  Please\nsupport Id's efforts in making ground-\nbreaking software abailable at shareware\nprices.", x: 16, y: 37, font: Images.Fonts7},
                {img: Images.Pre, sx: 200, sy: 89, sw: 120, sh:80, x: 16, y:80},
                {text: "Now, go get 'em!\n\n(ESC to return to\nmenu.)", x: 144, y: 107, font: Images.Fonts7}
            ]
        ]
        ScoreList = [
            {name: "id software-\'92", level:1, score:10000},
            {name: "Adrian Carmack", level:1, score:10000},
            {name: "John Carmack", level:1, score:10000},
            {name: "Kevin Cloud", level:1, score:10000},
            {name: "Tom Hall", level:1, score:10000},
            {name: "John Romero", level:1, score:10000},
            {name: "Jay Wilbur", level:1, score:10000}
        ]
        //TODO: einfügen der fehlenden steurungen und scroll funktioniert, da nötig
        ControlsList = [
            [
                {text: "Lwrd",  state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Rwrd", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Fwrd", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Bkwrd", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Left", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Right", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Open", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Fire", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Wpn 1", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Wpn 2", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Wpn 3", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "Wpn 4", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "NxtWpn", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: "PrvWpn", state: "", font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}}
            ],
            [
                {text: function(){return Input.getKeyCodeByVal(Controls.Lwrd[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Lwrd[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Rwrd[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Rwrd[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Fwrd[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Fwrd[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Bkwrd[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Bkwrd[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Left[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Left[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Right[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Right[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Open[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Open[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Fire[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Fire[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn1[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn1[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn2[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn2[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn3[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn3[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn4[0]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn4[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.NxtWpn[0]);}, state: "", action: function() {Input.WaitForInput(Controls.NxtWpn[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.PrevWpn[0]);}, state: "", action: function() {Input.WaitForInput(Controls.PrevWpn[0]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}}
            ],
            [
                {text: function(){return Input.getKeyCodeByVal(Controls.Lwrd[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Lwrd[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Rwrd[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Rwrd[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Fwrd[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Fwrd[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Bkwrd[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Bkwrd[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Left[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Left[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Right[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Right[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Open[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Open[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Fire[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Fire[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn1[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn1[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn2[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn2[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn3[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn3[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.Wpn4[1]);}, state: "", action: function() {Input.WaitForInput(Controls.Wpn4[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.NxtWpn[1]);}, state: "", action: function() {Input.WaitForInput(Controls.NxtWpn[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}},
                {text: function(){return Input.getKeyCodeByVal(Controls.PrevWpn[1]);}, state: "", action: function() {Input.WaitForInput(Controls.PrevWpn[1]);},
                font: {"disabled" : Images.Fonts2, "normal": Images.Fonts1, "hover": Images.Fonts3}}
            ]
        ]
        do
        {
            var HighestScore = 0;
            var TheID = 0;
            for(var ScoreEntry = 0;ScoreEntry<ScoreList.length;ScoreEntry++)
            {
                if(ScoreList[ScoreEntry].score > HighestScore)
                {
                    HighestScore = ScoreList[ScoreEntry].score;
                    TheID = ScoreEntry;
                }
            }
            HighScoreList.push(ScoreList[TheID]);
            ScoreList.splice(TheID, 1);
        }
        while(HighScoreList.length < 7 && ScoreList.length > 0)
        currentScene = SceneMenu;
        //START LOOP
        loop();
    });
}

function loadLevel()
{
    worldMap = Maps[lvl]["level"];
    //load Objects
    for(var i = 0;i<Maps[lvl]["objects"].length;i++)
    {
        Objects.push(new object(Maps[lvl]["objects"][i].x, Maps[lvl]["objects"][i].y, Maps[lvl]["objects"][i].ix, Maps[lvl]["objects"][i].iy));
    }
    for(var i = 0;i<Maps[lvl]["enemies"].length;i++)
    {
        var nE = new normalEnemy(Maps[lvl]["enemies"][i].x, Maps[lvl]["enemies"][i].y, Maps[lvl]["enemies"][i].type);
		console.log(i);
        for(var key in Maps[lvl]["enemies"][i]) {
			
            nE[key] = Maps[lvl]["enemies"][i][key];
            console.log(key + " -> " + Maps[lvl]["enemies"][i][key]);
        }
        Objects.push(nE);
    }
    Player = new player(findSpawn(), {x: -1, y: 0}, {x: 0, y:0.66});
}

function findSpawn()
{
    for(var x = 0;x < 64;x++)
    {
        for(var y = 0;y < 64;y++)
        {
            if(worldMap[x][y] == -1)
            {
                //REPLACE IT WITH SPACE
                worldMap[x][y] = 0;
                //SET PLAYERS POSITION WITH CORRECTION OFFSET
                return {x: x+.5,  y: y+.5};
            }
        }
    }
}

//https://www.youtube.com/watch?v=KeU2pyfBz1E
function loadImages(sources, callback)
{
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        Images[src] = new Image();
        Images[src].onload = function() {
            if(++loadedImages >= numImages) {callback();}
        };
        Images[src].src = sources[src];
    }
}

function Background()
{
    context.fillStyle = "#383838";
    context.fillRect(0, 0, w-16, sh/2);
    context.fillStyle = "#707070";
    context.fillRect(0, sh/2, w-16, sh/2);
}

function drawVert()
{
    
    for(var x = 0;x < sw;x++)
    {
        var cameraX = 2.0 * x / sw -1.0;
        var rayPosX = Player.pos.x;
        var rayPosY = Player.pos.y;
        var rayDirX = Player.dir.x + Player.plane.x * cameraX;
        var rayDirY = Player.dir.y + Player.plane.y * cameraX;

        var mapX = Math.floor(rayPosX);
        var mapY = Math.floor(rayPosY);

        var sideDistX, sideDistY;

        var deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
        var deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));
        var perpWallDist = 0;

        var stepX, stepY;

        var hit = 0;
        var side;

        if(rayDirX < 0)
        {
            stepX = -1;
            sideDistX = (rayPosX - mapX) * deltaDistX;
        }
        else
        {
            stepX = 1;
            sideDistX = (mapX + 1.0 - rayPosX) * deltaDistX;
        }
        if (rayDirY < 0)
        {
            stepY = -1;
            sideDistY = (rayPosY - mapY) * deltaDistY;
        }
        else
        {
            stepY = 1;
            sideDistY = (mapY + 1.0 - rayPosY) * deltaDistY;
        }
        var lastBlock = -1;
        var texNum = 0;
        var lastStepX = 0;
        var lastStepY = 0;
        while(hit == 0)
        {
            if(mapX < 0)mapX = 0;
            if(mapX >= MapSize)mapX = MapSize-1;
            if(mapY < 0)mapY = 0;
            if(mapY >= MapSize)mapY = MapSize-1;
            if(worldMap[mapX][mapY] > 0 && worldMap[mapX][mapY] < 49)
            {
                hit = 1;
                texNum = worldMap[mapX][mapY];
            }
            if(lastBlock >= 49 && lastBlock <= 50)
            {
                if(hit == 1)
                    texNum = 50;
            }
            if(worldMap[mapX][mapY] >= 49 && worldMap[mapX][mapY] < 50)
            {
                texNum = 49;
                hit = 1;
            }
            if(hit == 0)
            {
                lastBlock = worldMap[mapX][mapY];
                if(sideDistX < sideDistY)
                {
                    sideDistX += deltaDistX;
                    mapX += stepX;
                    lastStepX = -stepX/2;
                    lastStepY = 0;
                    side = 0;
                }
                else
                {
                    sideDistY += deltaDistY;
                    mapY += stepY;
                    lastStepX = 0;
                    lastStepY = -stepY/2;
                    side = 1;
                }
            }
        }
        if (side == 0)  perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;
        else            perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;
        Zbuffer[x] = perpWallDist;
        

        var lineHeight = sh/perpWallDist;
        

        var drawStart = Math.floor(-lineHeight / 2 + sh / 2);
        var drawEnd = Math.floor(lineHeight / 2 + sh / 2);

        

        var WallX;
        if(side == 0)   WallX = rayPosY + perpWallDist * rayDirY;
        else            WallX = rayPosX + perpWallDist * rayDirX;
        WallX -= Math.floor(WallX);

        var texX = Math.floor(WallX * TexSize);
        if(side == 0 && rayDirX > 0) texX = TexSize - texX - 1;
        if(side == 1 && rayDirY < 0) texX = TexSize - texX - 1;

        var yy = 0;
        var xx = 0;
        var i = texNum-1;
        while(i >= 6)
        {
            i-=6;
            yy++;
        }
        xx = i;
        if(side == 1)
        {
            context.drawImage(Images.TexturesDark, xx*TexSize+texX, yy*TexSize, 1, TexSize, x, drawStart, 1, drawEnd-drawStart);
        }
        else
        {
            context.drawImage(Images.TexturesBright, xx*TexSize+texX, yy*TexSize, 1, TexSize, x, drawStart, 1, drawEnd-drawStart);
        }
        
    }
}

function updateObjects()
{
    for(var i = 0;i<Objects.length;i++)
    {
        if(Objects[i].update != undefined)
        {
            Objects[i].update();
        }
    }
}

function drawObjects()
{
    
    for(var i = 0;i<Objects.length;i++)
    {
        spriteOrder[i] = i;
        spriteDistance[i] = ((Player.pos.x - Objects[i].x) * (Player.pos.x - Objects[i].x) + (Player.pos.y - Objects[i].y) * (Player.pos.y - Objects[i].y));
    }
    combSort();

    for(var i = 0;i<Objects.length;i++)
    {
        var spriteX = Objects[spriteOrder[i]].x - Player.pos.x;
        var spriteY = Objects[spriteOrder[i]].y - Player.pos.y;

        var invDet = 1.0 / (Player.plane.x * Player.dir.y - Player.dir.x * Player.plane.y);

        var transformX = invDet * (Player.dir.y * spriteX - Player.dir.x * spriteY);
        var transformY = invDet * (-Player.plane.y * spriteX + Player.plane.x * spriteY);

        var spriteScreenX = Math.round((sw / 2) * (1 + transformX / transformY));


        //calculate height of the sprite on screen
        var spriteSize = Math.abs(Math.round(sh / transformY));
        var drawStartY = -spriteSize / 2 + sh / 2;

        //calculate width of the sprite
        var drawStartX = Math.round(-spriteSize / 2 + spriteScreenX);
        var drawEndX = Math.round(spriteSize / 2 + spriteScreenX);

        for(var stripe = drawStartX; stripe < drawEndX; stripe++)
        {
            var texX = Math.round((stripe - drawStartX) * TexSize / spriteSize);
            //the conditions in the if are:
            //1) it's in front of camera plane so you don't see things behind you
            //2) it's on the screen (left)
            //3) it's on the screen (right)
            //4) Zbuffer, with perpendicular distance
            if(transformY > 0 && stripe >= 0 && stripe < sw && transformY < Zbuffer[stripe])
            {
                if(Objects[spriteOrder[i]].constructor.toString().includes("object"))
                {
                    context.drawImage(Images.Objects, Objects[spriteOrder[i]].ix*TexSize+texX, Objects[spriteOrder[i]].iy*TexSize, 1, TexSize, stripe, drawStartY, 1, spriteSize);
                }
                else
                {
                    Objects[spriteOrder[i]].drawEnemy(texX, stripe, drawStartY, spriteSize);
                }
            }
        }
    }
}

function Inputs()
{
    Input.Update();
    if(Input.GetKey(DEBUG_KEY))
    {
        if(DEBUG_KEYUP)
        {
            if(Input.GetKey(DEBUG_KEY) && Input.GetKey(DEBUG_FONT_KEY))
            {
                prevState.push(State);
                targetState = 99;
            }
            else if(Input.GetKey(DEBUG_KEY))
            {
                DEBUG = !DEBUG;
            }
            DEBUG_KEYUP = false;
        }
    }
    else
    {
        DEBUG_KEYUP = true;
    }
}

function GUI()
{
    
    context.drawImage(Images.Frame, 0, 0);
    //weapon symbol
    context.drawImage(Images.Hud, 72, 58+Player.Weapon.cur*24, 48, 24, 255, 170, 48, 24);
    //weapon ammo
    if(Player.Weapon.cur != 0){
        drawDigitsOnHud(Player.Weapon.ammo[Player.Weapon.cur-1], 232, 176);
    }
    //health
    drawDigitsOnHud(Player.health, 192, 176);
    //lives
    drawDigitsOnHud2(Player.lives, 116, 176);
    //score
    drawDigitsOnHud(Player.score, 96, 176);
    //lvl
    drawDigitsOnHud(lvl+1, 32, 176);
    //face
    var faceX = 8;
    for(var i = 0;i<Player.health;i+=99/7)
    {
        faceX--;
    }
    context.beginPath();
    context.rect(134, 165, 30, 31);
    context.fillStyle = '#494949';
    context.fill();
    context.drawImage(Images.Hud, Math.floor(Player.curFrameX) * 24, 40 + faceX*31, 24, 32, 136, 165, 24, 31);
    //DEBUG
    if(DEBUG)
    {
        for(var x = -48;x<48;x++)
        {
            for(var y = -32;y<32;y++)
            {
                
                if(y == 0 && x == 0)
                {
                    context.beginPath();
                    context.rect(9+16+y, 164+16+x, 1, 1);
                    context.fillStyle = '#00cc00';
                    context.fill();
                    continue;
                }
                if(Math.floor(Player.pos.x) + x >= worldMap.length || Math.floor(Player.pos.x) + x < 0
                || Math.floor(Player.pos.y) + y >= worldMap[0].length || Math.floor(Player.pos.y) + y < 0)
                {
                    context.beginPath();
                    context.rect(9+16+y, 164+16+x, 1, 1);
                    context.fillStyle = '#000000';
                    context.fill();
                }
                else
                {
                    if(worldMap[Math.floor(Player.pos.x) + x][Math.floor(Player.pos.y) + y] == 0)
                    {
                        context.beginPath();
                        context.rect(9+16+y, 164+16+x, 1, 1);
                        context.fillStyle = '#383838';
                        context.fill();
                    }
                    else
                    {
                        context.beginPath();
                        context.rect(9+16+y, 164+16+x, 1, 1);
                        context.fillStyle = '#ffffff';
                        context.fill();
                    }
                }
                for(var i = 0;i<Objects.length;i++)
                {
                    if(Objects[i].constructor.name != "object")
                    {
                        if(Math.floor(Objects[i].x) == Math.floor(Player.pos.x) + x && Math.floor(Objects[i].y) == Math.floor(Player.pos.y) + y)
                        {
                            context.beginPath();
                            context.rect(9+16+y, 164+16+x, 1, 1);
                            context.fillStyle = '#cc0000';
                            context.fill();
                        }
                    }
                }
            }
        }
    }
}
//draw left digits
function drawDigitsOnHud(number, rx, ty)
{
    var string = number.toString();
    for(var i = 0;i<string.length;i++)
    {
        context.drawImage(Images.Hud, 72+parseInt(string[i])*8, 40, 8, 16, rx-parseInt(string.length-i)*8, ty, 8, 16);
    }
}
//draw center digits
function drawDigitsOnHud2(number, cx, ty)
{
    var string = number.toString();
    for(var i = 0;i<string.length;i++)
    {
        context.drawImage(Images.Hud, 72+parseInt(string[i])*8, 40, 8, 16, cx-parseInt(string.length-i)*4, ty, 8, 16);
    }
}

function BigTextToCanvas(string, x, y, fontImg)
{
    var lineSpace = 13;
    var offset = 0;
    var line = 0;
    for(var i = 0;i<string.length;i++)
    {
        switch(string[i])
        {
            case "a":
                context.drawImage(fontImg, 200, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "b":
                context.drawImage(fontImg, 211, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "c":
                context.drawImage(fontImg, 222, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "d":
                context.drawImage(fontImg, 233, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "e":
                context.drawImage(fontImg, 244, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "f":
                context.drawImage(fontImg, 255, 34, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case "g":
                context.drawImage(fontImg, 264, 34, 9, 12, x+offset,y+line*lineSpace, 9, 12);
                offset += 10;
                break;
            case "h":
                context.drawImage(fontImg, 275, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "i":
                context.drawImage(fontImg, 286, 34, 4, 10, x+offset,y+line*lineSpace, 4, 10);
                offset += 5;
                break;
            case "j":
                context.drawImage(fontImg, 292, 34, 5, 12, x+offset,y+line*lineSpace, 5, 12);
                offset += 6;
                break;
            case "k":
                context.drawImage(fontImg, 299, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "l":
                context.drawImage(fontImg, 310, 34, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "m":
                context.drawImage(fontImg, 315, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "n":
                context.drawImage(fontImg, 328, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "o":
                context.drawImage(fontImg, 339, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "p":
                context.drawImage(fontImg, 350, 34, 9, 12, x+offset,y+line*lineSpace, 9, 12);
                offset += 10;
                break;
            case "q":
                context.drawImage(fontImg, 361, 34, 9, 12, x+offset,y+line*lineSpace, 9, 12);
                offset += 10;
                break;
            case "r":
                context.drawImage(fontImg, 372, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "s":
                context.drawImage(fontImg, 383, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "t":
                context.drawImage(fontImg, 394, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "u":
                context.drawImage(fontImg, 405, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "v":
                context.drawImage(fontImg, 416, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "w":
                context.drawImage(fontImg, 427, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "x":
                context.drawImage(fontImg, 440, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "y":
                context.drawImage(fontImg, 451, 34, 9, 12, x+offset,y+line*lineSpace, 9, 12);
                offset += 10;
                break;
            case "z":
                context.drawImage(fontImg, 462, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case ":":
                context.drawImage(fontImg, 245, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "!":
                context.drawImage(fontImg, 0, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "\"":
                context.drawImage(fontImg, 5, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case "#":
                context.drawImage(fontImg, 14, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "$":
                context.drawImage(fontImg, 25, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "%":
                context.drawImage(fontImg, 36, 21, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "&":
                context.drawImage(fontImg, 50, 21, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "´":
                context.drawImage(fontImg, 63, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "(":
                context.drawImage(fontImg, 68, 21, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case ")":
                context.drawImage(fontImg, 75, 21, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case "*":
                context.drawImage(fontImg, 82, 21, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "+":
                context.drawImage(fontImg, 95, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case ",":
                context.drawImage(fontImg, 107, 21, 3, 12, x+offset,y+line*lineSpace, 3, 12);
                offset += 4;
                break;
            case "-":
                context.drawImage(fontImg, 112, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case ".":
                context.drawImage(fontImg, 121, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "/":
                context.drawImage(fontImg, 126, 21, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "0":
                context.drawImage(fontImg, 139, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "1":
                context.drawImage(fontImg, 150, 21, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case "2":
                context.drawImage(fontImg, 157, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "3":
                context.drawImage(fontImg, 168, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "4":
                context.drawImage(fontImg, 179, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "5":
                context.drawImage(fontImg, 190, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "6":
                context.drawImage(fontImg, 201, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "7":
                context.drawImage(fontImg, 212, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "8":
                context.drawImage(fontImg, 223, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "9":
                context.drawImage(fontImg, 234, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case ":":
                context.drawImage(fontImg, 245, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case ";":
                context.drawImage(fontImg, 250, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "<":
                context.drawImage(fontImg, 255, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case "=":
                context.drawImage(fontImg, 264, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case ">":
                context.drawImage(fontImg, 273, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case "?":
                context.drawImage(fontImg, 282, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "@":
                context.drawImage(fontImg, 293, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "A":
                context.drawImage(fontImg, 304, 21, 9, 10, x+offset, y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "B":
                context.drawImage(fontImg, 315, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "C":
                context.drawImage(fontImg, 326, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "D":
                context.drawImage(fontImg, 337, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "E":
                context.drawImage(fontImg, 348, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "F":
                context.drawImage(fontImg, 359, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "G":
                context.drawImage(fontImg, 370, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "H":
                context.drawImage(fontImg, 381, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "I":
                context.drawImage(fontImg, 392, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "J":
                context.drawImage(fontImg, 397, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "K":
                context.drawImage(fontImg, 408, 21, 10, 10, x+offset,y+line*lineSpace, 10, 10);
                offset += 11;
                break;
            case "L":
                context.drawImage(fontImg, 420, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "M":
                context.drawImage(fontImg, 431, 21, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "N":
                context.drawImage(fontImg, 0, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "O":
                context.drawImage(fontImg, 11, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "P":
                context.drawImage(fontImg, 22, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "Q":
                context.drawImage(fontImg, 33, 34, 9, 12, x+offset,y+line*lineSpace, 9, 12);
                offset += 10;
                break;
            case "R":
                context.drawImage(fontImg, 44, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "S":
                context.drawImage(fontImg, 55, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "T":
                context.drawImage(fontImg, 66, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "U":
                context.drawImage(fontImg, 77, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "V":
                context.drawImage(fontImg, 88, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "W":
                context.drawImage(fontImg, 99, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "X":
                context.drawImage(fontImg, 112, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "Y":
                context.drawImage(fontImg, 123, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "Z":
                context.drawImage(fontImg, 134, 34, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "[":
                context.drawImage(fontImg, 145, 34, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case "\\":
                context.drawImage(fontImg, 152, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "]":
                context.drawImage(fontImg, 165, 34, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case "^":
                context.drawImage(fontImg, 172, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "_":
                context.drawImage(fontImg, 185, 34, 7, 12, x+offset,y+line*lineSpace, 7, 12);
                offset += 8;
                break;
            case "`":
                context.drawImage(fontImg, 194, 34, 4, 10, x+offset,y+line*lineSpace, 4, 10);
                offset += 5;
                break;
            case "{":
                context.drawImage(fontImg, 473, 34, 7, 11, x+offset,y+line*lineSpace, 7, 11);
                offset += 8;
                break;
            case "|":
                context.drawImage(fontImg, 482, 34, 3, 12, x+offset,y+line*lineSpace, 3, 12);
                offset += 4;
                break;
            case "}":
                context.drawImage(fontImg, 487, 34, 7, 11, x+offset,y+line*lineSpace, 7, 11);
                offset += 8;
                break;
            case "~":
                context.drawImage(fontImg, 496, 34, 13, 10, x+offset,y+line*lineSpace, 13, 10);
                offset += 14;
                break;
            case "°":
                context.drawImage(fontImg, 511, 34, 15, 10, x+offset,y+line*lineSpace, 15, 10);
                offset += 16;
                break;
            case " ":
                offset += 8;
                break;
            case "\n":
                line++;
                offset = 0;
                break;
        }
    }
}

function SmallTextToCanvas(string, x, y, fontImg, spaceSize = 7)
{
    string = string + "";
    var lineSpace = 10;
    var offset = 0;
    var line = 0;
    for(var i = 0;i<string.length;i++)
    {
        switch(string[i])
        {
            case "a":
                context.drawImage(fontImg, 44, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "b":
                context.drawImage(fontImg, 52, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "c":
                context.drawImage(fontImg, 60, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "d":
                context.drawImage(fontImg, 68, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "e":
                context.drawImage(fontImg, 76, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "f":
                context.drawImage(fontImg, 84, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "g":
                context.drawImage(fontImg, 92, 10, 6, 8, x+offset,y+line*lineSpace, 6, 8);
                offset += 7;
                break;
            case "h":
                context.drawImage(fontImg, 100, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "i":
                context.drawImage(fontImg, 108, 10, 2, 7, x+offset,y+line*lineSpace, 2, 7);
                offset += 3;
                break;
            case "j":
                context.drawImage(fontImg, 112, 10, 5, 8, x+offset,y+line*lineSpace, 5, 8);
                offset += 6;
                break;
            case "k":
                context.drawImage(fontImg, 119, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "l":
                context.drawImage(fontImg, 127, 10, 2, 7, x+offset,y+line*lineSpace, 2, 7);
                offset += 3;
                break;
            case "m":
                context.drawImage(fontImg, 131, 10, 10, 7, x+offset,y+line*lineSpace, 10, 7);
                offset += 11;
                break;
            case "n":
                context.drawImage(fontImg, 143, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "o":
                context.drawImage(fontImg, 151, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "p":
                context.drawImage(fontImg, 159, 10, 6, 8, x+offset,y+line*lineSpace, 6, 8);
                offset += 7;
                break;
            case "q":
                context.drawImage(fontImg, 167, 10, 6, 8, x+offset,y+line*lineSpace, 6, 8);
                offset += 7;
                break;
            case "r":
                context.drawImage(fontImg, 175, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "s":
                context.drawImage(fontImg, 183, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "t":
                context.drawImage(fontImg, 191, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "u":
                context.drawImage(fontImg, 199, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "v":
                context.drawImage(fontImg, 207, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "w":
                context.drawImage(fontImg, 215, 10, 10, 7, x+offset,y+line*lineSpace, 10, 7);
                offset += 11;
                break;
            case "x":
                context.drawImage(fontImg, 227, 10, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "y":
                context.drawImage(fontImg, 236, 10, 6, 8, x+offset,y+line*lineSpace, 6, 8);
                offset += 7;
                break;
            case "z":
                context.drawImage(fontImg, 244, 10, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case ":":
                context.drawImage(fontImg, 188, 0, 2, 7, x+offset,y+line*lineSpace, 2, 7);
                offset += 3;
                break;
            case "!":
                context.drawImage(fontImg, 0, 0, 2, 7, x+offset,y+line*lineSpace, 2, 7);
                offset += 3;
                break;
            case "\"":
                context.drawImage(fontImg, 4, 0, 5, 7, x+offset,y+line*lineSpace, 5, 7);
                offset += 6;
                break;
            case "#":
                context.drawImage(fontImg, 11, 0, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "$":
                context.drawImage(fontImg, 20, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "%":
                context.drawImage(fontImg, 28, 0, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "&":
                context.drawImage(fontImg, 37, 0, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "\'":
                context.drawImage(fontImg, 46, 0, 3, 7, x+offset,y+line*lineSpace, 3, 7);
                offset += 4;
                break;
            case "(":
                context.drawImage(fontImg, 51, 0, 4, 7, x+offset,y+line*lineSpace, 4, 7);
                offset += 5;
                break;
            case ")":
                context.drawImage(fontImg, 57, 0, 4, 7, x+offset,y+line*lineSpace, 4, 7);
                offset += 5;
                break;
            case "*":
                context.drawImage(fontImg, 63, 0, 8, 7, x+offset,y+line*lineSpace, 8, 7);
                offset += 9;
                break;
            case "+":
                context.drawImage(fontImg, 73, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case ",":
                context.drawImage(fontImg, 81, 0, 4, 8, x+offset,y+line*lineSpace, 4, 8);
                offset += 5;
                break;
            case "-":
                context.drawImage(fontImg, 87, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case ".":
                context.drawImage(fontImg, 95, 0, 2, 7, x+offset,y+line*lineSpace, 2, 7);
                offset += 3;
                break;
            case "/":
                context.drawImage(fontImg, 99, 0, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "0":
                context.drawImage(fontImg, 108, 0, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "1":
                context.drawImage(fontImg, 117, 0, 4, 7, x+offset,y+line*lineSpace, 4, 7);
                offset += 5;
                break;
            case "2":
                context.drawImage(fontImg, 123, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "3":
                context.drawImage(fontImg, 131, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "4":
                context.drawImage(fontImg, 139, 0, 7, 7, x+offset,y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "5":
                context.drawImage(fontImg, 148, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "6":
                context.drawImage(fontImg, 156, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "7":
                context.drawImage(fontImg, 164, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "8":
                context.drawImage(fontImg, 172, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "9":
                context.drawImage(fontImg, 180, 0, 6, 7, x+offset,y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case ":":
                context.drawImage(fontImg, 245, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case ";":
                context.drawImage(fontImg, 250, 21, 3, 10, x+offset,y+line*lineSpace, 3, 10);
                offset += 4;
                break;
            case "<":
                context.drawImage(fontImg, 255, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case "=":
                context.drawImage(fontImg, 264, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case ">":
                context.drawImage(fontImg, 273, 21, 7, 10, x+offset,y+line*lineSpace, 7, 10);
                offset += 8;
                break;
            case "?":
                context.drawImage(fontImg, 220, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 10;
                break;
            case "@":
                context.drawImage(fontImg, 293, 21, 9, 10, x+offset,y+line*lineSpace, 9, 10);
                offset += 10;
                break;
            case "A":
                context.drawImage(fontImg, 237, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "B":
                context.drawImage(fontImg, 245, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "C":
                context.drawImage(fontImg, 253, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "D":
                context.drawImage(fontImg, 261, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "E":
                context.drawImage(fontImg, 269, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "F":
                context.drawImage(fontImg, 277, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "G":
                context.drawImage(fontImg, 285, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "H":
                context.drawImage(fontImg, 293, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "I":
                context.drawImage(fontImg, 301, 0, 4, 7, x+offset, y+line*lineSpace, 4, 7);
                offset += 5;
                break;
            case "J":
                context.drawImage(fontImg, 307, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "K":
                context.drawImage(fontImg, 315, 0, 7, 7, x+offset, y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "L":
                context.drawImage(fontImg, 324, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "M":
                context.drawImage(fontImg, 332, 0, 7, 7, x+offset, y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "N":
                context.drawImage(fontImg, 341, 0, 7, 7, x+offset, y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "O":
                context.drawImage(fontImg, 350, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "P":
                context.drawImage(fontImg, 358, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "Q":
                context.drawImage(fontImg, 366, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "R":
                context.drawImage(fontImg, 374, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "S":
                context.drawImage(fontImg, 382, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "T":
                context.drawImage(fontImg, 390, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "U":
                context.drawImage(fontImg, 398, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "V":
                context.drawImage(fontImg, 406, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "W":
                context.drawImage(fontImg, 414, 0, 7, 7, x+offset, y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "X":
                context.drawImage(fontImg, 423, 0, 7, 7, x+offset, y+line*lineSpace, 7, 7);
                offset += 8;
                break;
            case "Y":
                context.drawImage(fontImg, 432, 0, 6, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "Z":
                context.drawImage(fontImg, 440, 0, 7, 7, x+offset, y+line*lineSpace, 6, 7);
                offset += 7;
                break;
            case "[":
                context.drawImage(fontImg, 145, 34, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case "\\":
                context.drawImage(fontImg, 152, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "]":
                context.drawImage(fontImg, 165, 34, 5, 10, x+offset,y+line*lineSpace, 5, 10);
                offset += 6;
                break;
            case "^":
                context.drawImage(fontImg, 172, 34, 11, 10, x+offset,y+line*lineSpace, 11, 10);
                offset += 12;
                break;
            case "_":
                context.drawImage(fontImg, 185, 34, 7, 12, x+offset,y+line*lineSpace, 7, 12);
                offset += 8;
                break;
            case "`":
                context.drawImage(fontImg, 194, 34, 4, 10, x+offset,y+line*lineSpace, 4, 10);
                offset += 5;
                break;
            case "{":
                context.drawImage(fontImg, 473, 34, 7, 11, x+offset,y+line*lineSpace, 7, 11);
                offset += 8;
                break;
            case "|":
                context.drawImage(fontImg, 482, 34, 3, 12, x+offset,y+line*lineSpace, 3, 12);
                offset += 4;
                break;
            case "}":
                context.drawImage(fontImg, 487, 34, 7, 11, x+offset,y+line*lineSpace, 7, 11);
                offset += 8;
                break;
            case "~":
                context.drawImage(fontImg, 496, 34, 13, 10, x+offset,y+line*lineSpace, 13, 10);
                offset += 14;
                break;
            case "°":
                context.drawImage(fontImg, 511, 34, 15, 10, x+offset,y+line*lineSpace, 15, 10);
                offset += 16;
                break;
            case " ":
                offset += spaceSize;
                break;
            case "\n":
                line++;
                offset = 0;
                break;
        }
    }
}

function SceneWorld()
{
    
    if(opac <= 0)
    {
        Inputs();
        Player.getInputs();
        
    }
    else
    {
        opac -= deltaTime*opacSpeed1;
    }
    context.translate(8, 4);
    Background();

    updateObjects();
    Player.update();

    drawVert();
    drawObjects();
    Player.draw();

    
    context.translate(-8, -4);
    GUI();

    context.beginPath();
    context.rect(0, 0, w, h);
    context.fillStyle = 'rgba(0, 0, 0, ' + Math.round(opac * 10000)/10000 + ')';
    context.fill();
}

function SceneMenu()
{
    Inputs();
    if(State == 3)
    {
        //MENU
        //loadLevel();
        context.drawImage(Images.MenuBG, 0, 0, w, h, 0, 0, w, h);
        context.drawImage(Images.MenuGUI, 365, 0, 152, 47, 81, 0, 152, 47);
        context.drawImage(Images.MenuPanel, 0, 0, 179, 137, 68, 52, 179, 137);
        var gap = 13;
        context.drawImage(Images.MenuGUI, 0, 375, 23, 16, 73, 53+MainMenuIndex*gap, 23, 16);
        for(var i = 0;i<MainMenuList.length;i++)
        {
            if(MainMenuList[i].state == "disabled")
            {
                BigTextToCanvas(MainMenuList[i].text, 100, 56+gap*i, MainMenuList[i].font[MainMenuList[i].state]);
            }
            else
            {
                if(i == MainMenuIndex)
                {
                    BigTextToCanvas(MainMenuList[i].text, 100, 56+gap*i, MainMenuList[i].font["hover"]);
                }
                else
                {
                    BigTextToCanvas(MainMenuList[i].text, 100, 56+gap*i, MainMenuList[i].font["normal"]);
                }
            }
        }
        if(Input.GetKey(KeyCode.UpArrow) || Input.GetAxes("GP Axis 1") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                do{
                    MainMenuIndex--;
                    if(MainMenuIndex < 0)
                    {
                        MainMenuIndex = MainMenuList.length+MainMenuIndex;
                    }
                }
                while(MainMenuList[MainMenuIndex].state == "disabled");
                if(MainMenuIndex < 0)
                {
                    MainMenuIndex = MainMenuList.length+MainMenuIndex;
                }
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.DwnArrow) || Input.GetAxes("GP Axis 1") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                do
                {
                    MainMenuIndex++;
                    MainMenuIndex=MainMenuIndex%(MainMenuList.length);
                }
                while(MainMenuList[MainMenuIndex].state == "disabled");
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKeyDown(KeyCode.Return) || Input.GetJoystickKeyDown(GPKeyCodes.A))
        {
            if(!MoveDown)
            {   
                if(MainMenuList[MainMenuIndex].action != null)
                    MainMenuList[MainMenuIndex].action();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 4)
    {
        context.drawImage(Images.MenuBG, 0, 0, w, h, 0, 0, w, h);
        context.drawImage(Images.MenuGUI, 365, 49, 144, 47, 80, 0, 144, 47);
        //Custom MenuPanel like Original
        context.drawImage(Images.MenuPanel, 0, 0, 151, 50, 16, 65, 151, 50);
        context.drawImage(Images.MenuPanel, 0, 102, 151, 35, 16, 115, 151, 35);

        context.drawImage(Images.MenuPanel, 28, 0, 151, 50, 150, 65, 151, 50);
        context.drawImage(Images.MenuPanel, 28, 102, 151, 50, 150, 115, 151, 50);
        var gap = 13;
        context.drawImage(Images.MenuGUI, 0, 375, 23, 16, 25, 68+ControlMenuIndex*gap, 23, 16);
        for(var i = 0;i<ControlMenuList.length;i++)
        {
            if(ControlMenuList[i].enable != null)
            {
                if(ControlMenuList[i].enable)
                    context.drawImage(Images.MenuGUI, 0, 409, 23, 8, 56, 73+i*gap, 23, 8);
                else
                    context.drawImage(Images.MenuGUI, 0, 418, 23, 8, 56, 73+i*gap, 23, 8);
            }
            if(ControlMenuList[i].state == "disabled")
            {
                BigTextToCanvas(ControlMenuList[i].text, 80, 71+gap*i, ControlMenuList[i].font[ControlMenuList[i].state]);
            }
            else
            {
                if(i == ControlMenuIndex)
                {
                    BigTextToCanvas(ControlMenuList[i].text, 80, 71+gap*i, ControlMenuList[i].font["hover"]);
                }
                else
                {
                    BigTextToCanvas(ControlMenuList[i].text, 80, 71+gap*i, ControlMenuList[i].font["normal"]);
                }
            }
        }
        if(Input.GetKey(KeyCode.UpArrow) || Input.GetAxes("GP Axis 1") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                do{
                    ControlMenuIndex--;
                    if(ControlMenuIndex < 0)
                    {
                        ControlMenuIndex = ControlMenuList.length+ControlMenuIndex;
                    }
                }
                while(ControlMenuList[ControlMenuIndex].state == "disabled");
                if(ControlMenuIndex < 0)
                {
                    ControlMenuIndex = ControlMenuList.length+ControlMenuIndex;
                }
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.DwnArrow) || Input.GetAxes("GP Axis 1") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                do
                {
                    ControlMenuIndex++;
                    ControlMenuIndex=ControlMenuIndex%(ControlMenuList.length);
                }
                while(ControlMenuList[ControlMenuIndex].state == "disabled");
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKeyDown(KeyCode.Return) || Input.GetJoystickKeyDown(GPKeyCodes.A))
        {
            if(!MoveDown)
            {
                if(ControlMenuList[ControlMenuIndex].action != null)
                    ControlMenuList[ControlMenuIndex].action();
                MoveDown = true;
            }
        }
        else if(Input.GetKey(KeyCode.Escape) || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 5)
    {
        context.beginPath();
        context.rect(0, 0, w, h);
        context.fillStyle = '#8A0000';
        context.fill();

        //Custom MenuPanel like Original
        context.drawImage(Images.MenuPanel, 0, 0, 151, 16, 10, 80, 151, 16);
        context.drawImage(Images.MenuPanel, 0, 122, 151, 15, 10, 96, 151, 15);

        context.drawImage(Images.MenuPanel, 29, 0, 151, 16, 161, 80, 151, 16);
        context.drawImage(Images.MenuPanel, 29, 122, 151, 15, 161, 96, 151, 15);

        BigTextToCanvas("Adjust Mouse Sensitivity", 50, 83, Images.Fonts6);
        BigTextToCanvas("Slow", 14, 96, Images.Fonts1);
        BigTextToCanvas("Fast", 269, 96, Images.Fonts1);

        context.drawImage(Images.MenuGUI, 173, 381, 2, 11, 60, 97, 2, 11);
        context.drawImage(Images.MenuGUI, 174, 381, 19, 11, 61, 97, 199, 11);
        context.drawImage(Images.MenuGUI, 192, 381, 2, 11, 259, 97, 2, 11);

        context.drawImage(Images.MenuGUI, 0, 358, 103, 16, 113, 184, 103, 16);
        if(sensitivity > 2)
        {
            sensitivity = 2;
        }
        else if(sensitivity < 1)
        {
            sensitivity = 1;
        }
        var pos = ((sensitivity-1)/(2-1))*(10-0)+0;
        context.drawImage(Images.MenuGUI, 173, 368, 21, 11, 60+pos*18, 97, 21, 11);//60-240

        if(Input.GetKey(KeyCode.LftArrow) || Input.GetAxes("GP Axis 0") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                sensitivity-=.1;
                if(sensitivity > 2)
                {
                    sensitivity = 2;
                }
                else if(sensitivity < 1)
                {
                    sensitivity = 1;
                }
                Cookies.setCookie("MouseSense", sensitivity)
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.RgtArrow) || Input.GetAxes("GP Axis 0") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                sensitivity+=.1;
                if(sensitivity > 2)
                {
                    sensitivity = 2;
                }
                else if(sensitivity < 1)
                {
                    sensitivity = 1;
                }
                Cookies.setCookie("MouseSense", sensitivity)
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.Escape) || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;

            curTime = 0;
        }
        
    }
    else if(State == 6)
    {
        context.beginPath();
        context.rect(0, 0, w, h);
        context.fillStyle = '#8A0000';
        context.fill();

        context.drawImage(Images.MenuPanel, 0, 0, 150, 80, 6, 19, 150, 80);
        context.drawImage(Images.MenuPanel, 0, 54, 150, 83, 6, 99, 150, 83);

        context.drawImage(Images.MenuPanel, 20, 0, 159, 80, 156, 19, 159, 80);
        context.drawImage(Images.MenuPanel, 20, 54, 159, 83, 156, 99, 159, 83);

        context.drawImage(Images.MenuGUI, 0, 358, 103, 16, 113, 184, 103, 16);

        
        var gap = 13;

        context.drawImage(Images.MenuGUI, 0, 375, 23, 16, 9, 21+NewGameIndex*gap*2, 23, 16);
        for(var i = 0;i<NewGameList.length;i++)
        {
            if(NewGameList[i].state == "disabled")
            {
                BigTextToCanvas(NewGameList[i].text, 98, 24+gap*i*2, NewGameList[i].font[NewGameList[i].state]);
            }
            else
            {
                if(i == NewGameIndex)
                {
                    BigTextToCanvas(NewGameList[i].text, 98, 24+gap*i*2, NewGameList[i].font["hover"]);
                }
                else
                {
                    BigTextToCanvas(NewGameList[i].text, 98, 24+gap*i*2, NewGameList[i].font["normal"]);
                }
            }
        }
        var index = 0;
        for(var x = 0;x<3;x++)
        {
            for(var y = 0;y<2;y++)
            {
                context.drawImage(Images.MenuGUI, 172 + 49*x, 307 + 25*y, 48, 24, 40, 23+index*gap*2, 48, 24);
                index++;
            }
        }
        if(Input.GetKey(KeyCode.UpArrow) || Input.GetAxes("GP Axis 1") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                do{
                    NewGameIndex--;
                    if(NewGameIndex < 0)
                    {
                        NewGameIndex = NewGameList.length+NewGameIndex;
                    }
                }
                while(NewGameList[NewGameIndex].state == "disabled");
                if(NewGameIndex < 0)
                {
                    NewGameIndex = NewGameList.length+NewGameIndex;
                }
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.DwnArrow) || Input.GetAxes("GP Axis 1") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                do
                {
                    NewGameIndex++;
                    NewGameIndex=NewGameIndex%(NewGameList.length);
                }
                while(NewGameList[NewGameIndex].state == "disabled");
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKeyDown(KeyCode.Return) || Input.GetJoystickKeyDown(GPKeyCodes.A))
        {
            if(!MoveDown)
            {
                if(NewGameList[NewGameIndex].action)
                    NewGameList[NewGameIndex].action();
                MoveDown = true;
            }
        }
        else if(Input.GetKey(KeyCode.Escape) || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 7)
    {
        context.beginPath();
        context.rect(0, 0, w, h);
        context.fillStyle = '#8A0000';
        context.fill();

        //Custom MenuPanel like Original
        context.drawImage(Images.MenuPanel, 0, 0, 113, 34, 45, 90, 113, 34);
        context.drawImage(Images.MenuPanel, 0, 103, 113, 34, 45, 124, 113, 34);

        context.drawImage(Images.MenuPanel, 66, 0, 113, 34, 158, 90, 113, 34);
        context.drawImage(Images.MenuPanel, 66, 103, 113, 34, 158, 124, 113, 34);

        BigTextToCanvas("How tough are you?", 70, 69, Images.Fonts6);

        context.drawImage(Images.MenuGUI, 0, 358, 103, 16, 113, 184, 103, 16);

        var gap = 13;
        context.drawImage(Images.MenuGUI, 0, 375, 23, 16, 49, 98+DifMenuIndex*gap, 23, 16);

        context.drawImage(Images.Hud, 72, 152 + DifMenuIndex*32, 24, 32, 232, 107, 24, 32);
        for(var i = 0;i<DifMenuList.length;i++)
        {
            if(DifMenuList[i].state == "disabled")
            {
                BigTextToCanvas(DifMenuList[i].text, 74, 101+gap*i, DifMenuList[i].font[DifMenuList[i].state]);
            }
            else
            {
                if(i == DifMenuIndex)
                {
                    BigTextToCanvas(DifMenuList[i].text, 74, 101+gap*i, DifMenuList[i].font["hover"]);
                }
                else
                {
                    BigTextToCanvas(DifMenuList[i].text, 74, 101+gap*i, DifMenuList[i].font["normal"]);
                }
            }
        }
        if(Input.GetKey(KeyCode.UpArrow) || Input.GetAxes("GP Axis 1") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                do{
                    DifMenuIndex--;
                    if(DifMenuIndex < 0)
                    {
                        DifMenuIndex = DifMenuList.length+DifMenuIndex;
                    }
                }
                while(DifMenuList[DifMenuIndex].state == "disabled");
                if(DifMenuIndex < 0)
                {
                    DifMenuIndex = DifMenuList.length+DifMenuIndex;
                }
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.DwnArrow) || Input.GetAxes("GP Axis 1") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                do
                {
                    DifMenuIndex++;
                    DifMenuIndex=DifMenuIndex%(DifMenuList.length);
                }
                while(DifMenuList[DifMenuIndex].state == "disabled");
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKeyDown(KeyCode.Return) || Input.GetJoystickKeyDown(GPKeyCodes.A))
        {
            if(!MoveDown)
            {
                if(DifMenuList[DifMenuIndex].action != null)
                    DifMenuList[DifMenuIndex].action();
                MoveDown = true;
            }
        }
        else if(Input.GetKey(KeyCode.Escape) || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 8)
    {
        context.beginPath();
        context.rect(0, 0, w, h);
        context.fillStyle = '#DFDFDF';
        context.fill();

        context.drawImage(Images.MenuGUI, 330, 206, 8, 192, 0, 8, 8, 192);
        context.drawImage(Images.MenuGUI, 321, 206, 8, 192, 312, 8, 8, 192);
        context.drawImage(Images.MenuGUI, 259, 400, 304, 24, 8, 176, 304, 24);
        context.drawImage(Images.MenuGUI, 243, 425, 320, 8, 0, 0, 320, 8);

        SmallTextToCanvas("pg " + (ReadThisIndex+1) +" of 41", 213, 184, Images.Fonts2, 5);

        for(var i = 0;i<ReadThisList[ReadThisIndex].length;i++)
        {
            if(ReadThisList[ReadThisIndex][i].text != null)
            {
                if(ReadThisList[ReadThisIndex][i].fontSize != null)
                    SmallTextToCanvas(ReadThisList[ReadThisIndex][i].text, ReadThisList[ReadThisIndex][i].x, ReadThisList[ReadThisIndex][i].y, ReadThisList[ReadThisIndex][i].font, ReadThisList[ReadThisIndex][i].fontSize);
                else
                    SmallTextToCanvas(ReadThisList[ReadThisIndex][i].text, ReadThisList[ReadThisIndex][i].x, ReadThisList[ReadThisIndex][i].y, ReadThisList[ReadThisIndex][i].font);
            }
            else if(ReadThisList[ReadThisIndex][i].img != null)
                context.drawImage(ReadThisList[ReadThisIndex][i].img, ReadThisList[ReadThisIndex][i].sx, ReadThisList[ReadThisIndex][i].sy, ReadThisList[ReadThisIndex][i].sw, ReadThisList[ReadThisIndex][i].sh, ReadThisList[ReadThisIndex][i].x, ReadThisList[ReadThisIndex][i].y, ReadThisList[ReadThisIndex][i].sw, ReadThisList[ReadThisIndex][i].sh);
        }
        if(Input.GetKey(KeyCode.LftArrow) || Input.GetAxes("GP Axis 0") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                if(ReadThisIndex > 0)
                    ReadThisIndex--;
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.RgtArrow) || Input.GetAxes("GP Axis 0") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                if(ReadThisIndex < ReadThisList.length-1)
                    ReadThisIndex++;
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.Escape)  || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 9)
    {
        context.drawImage(Images.MenuBG, 0, 0, w, h, 0, 0, w, h);
        context.drawImage(Images.MenuGUI, 347, 196, 216, 47, 56, 0, 216, 47);
        //Custom MenuPanel like Original
        context.drawImage(Images.MenuPanel, 0, 0, 175, 70, 75, 50, 175, 70);
        context.drawImage(Images.MenuPanel, 0, 66, 175, 71, 75, 120, 175, 71);

        context.drawImage(Images.MenuPanel, 178, 0, 1, 70, 250, 50, 1, 70);
        context.drawImage(Images.MenuPanel, 178, 66, 1, 71, 250, 120, 1, 71);
        var gap = 13;

        context.drawImage(Images.MenuGUI, 0, 375, 23, 16, 80, 53+LoadGameIndex*gap, 23, 16);
        for(var i = 0;i<LoadGameCount;i++)
        {
            if(i == LoadGameIndex)
            {
                context.drawImage(Images.MenuGUI2, 0, 156, 137, 12, 109, 55+i*gap, 137, 12);
                if(/*SAVEGAME EXSISTS*/false)
                {
                    
                }
                else
                {
                    SmallTextToCanvas("- empty -", 141, 57+i*gap, Images.Fonts3);
                }
            }
            else
            {
                context.drawImage(Images.MenuGUI2, 0, 144, 137, 12, 109, 55+i*gap, 137, 12);
                if(/*SAVEGAME EXSISTS*/false)
                {
                    
                }
                else
                {
                    SmallTextToCanvas("- empty -", 141, 57+i*gap, Images.Fonts1);
                }
            }
            
        }
        if(Input.GetKey(KeyCode.UpArrow) || Input.GetAxes("GP Axis 1") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                LoadGameIndex--;
                if(LoadGameIndex < 0)
                {
                    LoadGameIndex = LoadGameCount+LoadGameIndex;
                }
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.DwnArrow) || Input.GetAxes("GP Axis 1") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                LoadGameIndex++;
                LoadGameIndex=LoadGameIndex%LoadGameCount;
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKeyDown(KeyCode.Return) || Input.GetJoystickKeyDown(GPKeyCodes.A))
        {
            if(!MoveDown)
            {
                /*if(ControlMenuList[LoadGameIndex].action != null)
                    ControlMenuList[LoadGameIndex].action();*/
                MoveDown = true;
            }
        }
        else if(Input.GetKey(KeyCode.Escape) || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 10)
    {
        context.drawImage(Images.MenuBG, 0, 0, w, h, 0, 0, w, h);
        context.beginPath();
        context.rect(109, 192, 102, 7);
        context.fillStyle = '#880000';
        context.fill();
        context.drawImage(Images.MenuGUI, 339, 294, 224, 55, 48, 0, 224, 55);
        context.drawImage(Images.MenuGUI, 257, 357, 27, 7, 34, 68, 27, 7);
        context.drawImage(Images.MenuGUI, 224, 357, 27, 7, 162, 68, 27, 7);
        context.drawImage(Images.MenuGUI, 289, 357, 28, 7, 225, 68, 28, 7);
        var gap = 16;
        for(var i = 0;i<HighScoreList.length;i++)
        {
            SmallTextToCanvas(HighScoreList[i].name, 27, 77+i*gap, Images.Fonts11);
            SmallTextToCanvas(HighScoreList[i].level, 170, 77+i*gap, Images.Fonts11);
            SmallTextToCanvas(HighScoreList[i].score, 226, 77+i*gap, Images.Fonts11);
        }
        if(Input.GetKey(KeyCode.Escape)  || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            
        }
    }
    else if(State == 11)
    {
        context.drawImage(Images.MenuBG, 0, 0, w, h, 0, 0, w, h);
        context.drawImage(Images.MenuGUI, 368, 98, 149, 47, 80, 0, 149, 47);
        //Custom MenuPanel like Original
        context.drawImage(Images.MenuPanel, 0, 0, 155, 82, 5, 61, 155, 82);
        context.drawImage(Images.MenuPanel, 0, 78, 155, 59, 5, 122, 155, 59);

        context.drawImage(Images.MenuPanel, 23, 0, 156, 72, 160, 61, 156, 72);
        context.drawImage(Images.MenuPanel, 23, 78, 156, 59, 160, 122, 156, 59);

        
        BigTextToCanvas("Primary", 96, 48, Images.Fonts5);
        BigTextToCanvas("Secondary", 190, 48, Images.Fonts5);

        var gap = 13;
        var columns = [
            36,106,212
        ]
        while(62+ControlsIndexY*gap+gap+ControlsOffset >= 189)
        {
            ControlsOffset-=gap;
        }
        while(62+ControlsIndexY*gap+ControlsOffset < 61)
        {
            ControlsOffset+=gap;
        }
        context.drawImage(Images.MenuGUI, 0, 377, 23, 11, 9, 62+ControlsIndexY*gap+ControlsOffset, 23, 11);
        
        for(var x = 0;x<ControlsList.length;x++)
        {
            for(var y = 0;y<ControlsList[x].length;y++)
            {
                if(63+gap*(1+y)+ControlsOffset >= 189
                || 63+gap*y+ControlsOffset <= 61 )
                {
                    continue;
                }
                if(x == 0)
                {
                    if(y == ControlsIndexY)
                    {
                        BigTextToCanvas(ControlsList[x][y].text, columns[x], 63+gap*y+ControlsOffset, ControlsList[x][y].font["hover"]);
                    }
                    else
                    {
                        BigTextToCanvas(ControlsList[x][y].text, columns[x], 63+gap*y+ControlsOffset, ControlsList[x][y].font["normal"]);
                    }
                }
                else
                {
                    if(x == ControlsIndexX+1 && y == ControlsIndexY)
                    {
                        BigTextToCanvas(ControlsList[x][y].text(), columns[x], 63+gap*y+ControlsOffset, ControlsList[x][y].font["hover"]);
                    }
                    else
                    {
                        BigTextToCanvas(ControlsList[x][y].text(), columns[x], 63+gap*y+ControlsOffset, ControlsList[x][y].font["normal"]);
                    }
                }
            }
            
        }
        
        if(Input.GetKey(KeyCode.UpArrow) || Input.GetAxes("GP Axis 1") < -1+Input.GamepadThreshold)
        {   

            if(!MoveDown)
            {
                do{
                    ControlsIndexY--;
                    if(ControlsIndexY < 0)
                    {
                        ControlsIndexY = ControlsList[0].length+ControlsIndexY;
                    }
                }
                while(ControlsList[0][ControlsIndexY].state == "disabled");
                if(ControlsIndexY < 0)
                {
                    ControlsIndexY = ControlsList[0].length+ControlsIndexY;
                }
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.DwnArrow) || Input.GetAxes("GP Axis 1") > 1-Input.GamepadThreshold)
        {
            
            if(!MoveDown)
            {
                do
                {
                    ControlsIndexY++;
                    ControlsIndexY=ControlsIndexY%(ControlsList[0].length);
                }
                while(ControlsList[0][ControlsIndexY].state == "disabled");
                MoveDown = true;
            }
            else
            {
                curTime += deltaTime;
                if(curTime > timeThreshold)
                {
                    curTime = 0;
                    MoveDown = false;
                }
            }
        }
        else if(Input.GetKey(KeyCode.LftArrow) || Input.GetAxes("GP Axis 0") < -1+Input.GamepadThreshold)
        {
            if(ControlsIndexX > 0)
            {
                ControlsIndexX--;
            }
        }
        else if(Input.GetKey(KeyCode.RgtArrow) || Input.GetAxes("GP Axis 0") > 1-Input.GamepadThreshold)
        {
            if(ControlsIndexX < 1)
            {
                ControlsIndexX++;
            }
        }
        else if(Input.GetKeyDown(KeyCode.Return) || Input.GetJoystickKeyDown(GPKeyCodes.A))
        {
            if(!MoveDown)
            {   
                if(ControlsList[ControlsIndexX+1][ControlsIndexY].action != null)
                    ControlsList[ControlsIndexX+1][ControlsIndexY].action();
                MoveDown = true;
            }
        }
        else if(Input.GetKey(KeyCode.Escape)  || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
            curTime = 0;
        }
    }
    else if(State == 99)
    {
        BigTextToCanvas("This is to test if every character is displayed correctly\nwith the BigTextToCanvas function", 4, 4, Images.Fonts4);

        BigTextToCanvas("ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n!\"#$%&´()*+,-./0123456789\n:;<=>?@[\]^_`{|}~°", 4, 48, Images.Fonts1);
        if(Input.GetKey(KeyCode.Escape)  || Input.GetJoystickKeyDown(GPKeyCodes.B))
        {
            if(!MoveDown)
            {
                targetState = prevState.pop();
                MoveDown = true;
            }
        }
        else if(targetState == State)
        {
            MoveDown = false;
        }
    }
    if(State < 1 && targetState < 1 && State > -2 && targetState > -2)
    {
        if(State == 0)
        {
            context.drawImage(Images.Pre, 0, 176, w, h, 0, 0, w, h);
        }
        else if(State == -1)
        {
            context.drawImage(Images.MenuGUI, 0, 106, w, h, 0, 0, w, h);
        }
        if(stateTimer < showtime)
        {
            stateTimer += deltaTime;
            for(var kc in KeyCode)
            {
                if(Input.GetKey(KeyCode[kc]))
                {
                    targetState = 3;
                    stateTimer = showtime;
                }
            }
            for(var kc in GPKeyCodes)
            {
                if(Input.GetJoystickKey(GPKeyCodes[kc]))
                {
                    targetState = 3;
                    stateTimer = showtime;
                }
            }
        }
        else
        {
            if(State == 0)
                targetState = -1;
            else if(State == -1)
                targetState = 0;
            stateTimer = 0;
        }
    }
    if(targetState != State || Faded)
    {
        if(Faded)
        {
            opac -= deltaTime * (State < 1 ? opacSpeed1 : opacSpeed2);
            if(opac <= 0)
            {
                opac = 0;
                Faded = false;

                if(State > 0)isMenu = true;
                else isMenu = false;

                stateTimer = 0;
            }
        }
        else
        {
            opac += deltaTime * (State < 1 ? opacSpeed1 : opacSpeed2);
            if(opac >= 1)
            {
                opac = 1;
                Faded = true;
                if(targetState == "game")
                {
                    currentScene = SceneWorld;
                    loadLevel();
                }
                else
                {
                    State = targetState;
                }
            }
        }
    }
    context.beginPath();
    context.rect(0, 0, w, h);
    //TODO: FIX FADE 
    if(targetState > 0 && State > 0 && isMenu)
        context.fillStyle = 'rgba(136, 0, 0, ' + Math.round(opac * 10000)/10000 + ')';
    else
    {
        context.fillStyle = 'rgba(0, 0, 0, ' + Math.round(opac * 10000)/10000 + ')';
    }
    context.fill();
}

function combSort()
{
    var newSpriteDist = spriteDistance;
    var newOrder = spriteOrder;
    var gap = Objects.length;
    var swapped = false;
    while(gap > 1 || swapped)
    {
        gap = (gap * 10) / 13;
        if(gap == 9 || gap == 10) gap == 11;
        if(gap < 1) gap = 1;
        swapped = false;
        for(var i = 0;i<Objects.length - gap;i++)
        {
            var j = i + gap;
            if(newSpriteDist[i] < newSpriteDist[j])
            {
                var n = newSpriteDist[i];
                newSpriteDist[i] = newSpriteDist[j];
                newSpriteDist[j] = n;
                var n2 = newOrder[i];
                newOrder[i] = newOrder[j];
                newOrder[j] = n2;
                swapped = true;
            }
        }
    }
    spriteDistance = newSpriteDist;
    spriteOrder = newOrder;
}

function loop()
{
    var timeBegin = Date.now();
    requestAnimFrame(function(){loop();});
    oldTime = time;
    time = Date.now();
    deltaTime = (time - oldTime)/1000;
    currentScene();
    if(DEBUG)
    {
        
        SmallTextToCanvas("FPS: " + Math.round(lastFPS), 3, 3, Images.Fonts4);
        SmallTextToCanvas("FRAMETIME: " + (DEBUG_lastWorkTime) + "MS", 52, 3, Images.Fonts4);

        var gap = 8;
        var line = 0;
        for(var curkc in KeyCode)
        {
            if(Input.GetKey(KeyCode[curkc]))
            {
                SmallTextToCanvas(curkc, 3, 11+line*gap, Images.Fonts4);
                line++;
            }
        }
        if(DEBUG_refreshTime > 1)
        {
            lastFPS = 1/deltaTime;
            var timeEnd = Date.now();
            DEBUG_lastWorkTime = timeEnd-timeBegin;
            DEBUG_refreshTime = 0;
        }
        else
        {
            DEBUG_refreshTime+=deltaTime;
        }
    }
}