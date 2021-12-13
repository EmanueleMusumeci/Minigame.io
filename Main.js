
//Engine initialization
var canvas = document.getElementById("renderCanvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

//engine.loadingScreen = GUI.createLoadingScreen();

//Scene initialization
var createScene = function () {

    // Create the scene space
    GameEngine.scene = new BABYLON.Scene(engine);
    GameEngine.scene.preventDefaultOnPointerDown = false;
    if(Settings.debugLayer) GameEngine.scene.debugLayer.show();

    var engine = Physics.init(GameEngine.scene, 30)
    if(Settings.debugPhysics) Physics.viewer()

    //This camera will be replaced once the menu is rendered or the player is spawned    
    GameEngine.createFreeCamera("PlayerCamera")
    
    //If in testing mode, the testing level will be loaded
    if(Settings.testLevel) 
    {   
        LevelManager.initializeLevels()
        LevelManager.nextLevel()
        GameEngine.startGame()
    }
    //else the main menu will be rendered
    else GameEngine.loadMainMenu()

};

createScene()

//Render function
var render = function(){
    GameEngine.scene.render();
};

//Render loop
GameEngine.scene.executeWhenReady(function(){

    engine.runRenderLoop(function () {
    render();
    })
});

//Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});