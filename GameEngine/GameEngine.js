
// This class acts as an enumeration for game states
const GameStates = {LOADING:0, MAIN_MENU:1, PLAYING:2, LEVEL_MENU:3}

// The GameEngine class is used:
//1) as a main controller for the "flow" of the game
//2) It also manages the cameras, creating and removing them based on the current game state
//3) It manages key listeners for user input
//4) Allows easy addition, removal of shadows from the shadow generator
class GameEngine {
    static gameState;

    static scene;
    static shadowGenerators = [];

    static levels;
    
    static actionManager;

    static activeCamera;
    static activeCameraMode;
    static forcedCameraMode=false;

    static currentInputsMap;
    static lastPressedInputs;

    static pointerLocked = false;

    static loadMainMenu() {
        GameEngine.gameState = GameStates.MAIN_MENU
        GameEngine.setCameraMode(CameraMode.MENU_CAMERA)
        LevelManager.nextLevel()
        GUI.loadMainMenu()
    }

    static startGame() {
        BABYLON.Engine.audioEngine.audioContext?.resume();
        GameEngine.gameState = GameStates.LOADING
        GameEngine.attachControlListeners()
        canvas.requestPointerLock()
        LevelManager.nextLevel()
        GameEngine.gameState = GameStates.PLAYING
        GUI.nextLevelSound.play()
        GameEngine.setCameraMode(Settings.defaultCameraMode)
        GUI.getCrosshair().show()
    }

    static loadNextLevel() {
        GUI.MainMenu.hide()
        GUI.getHelper().hide()
        GameEngine.gameState = GameStates.LOADING
        GameEngine.attachControlListeners()
        canvas.requestPointerLock()
        LevelManager.nextLevel()
        GameEngine.gameState = GameStates.PLAYING
        GUI.nextLevelSound.play()
        GameEngine.setCameraMode(Settings.defaultCameraMode)
        GUI.getCrosshair().show()
    }

    static levelVictory() {
        GUI.MainMenu.hide()
        GameEngine.currentInputsMap = {}
        GameEngine.repeatedInputs = {}
        GameEngine.detachControlListeners()
        document.exitPointerLock()
        //Player.detachPlayerMovementControls()
        Player.detachPickingTargetCheck()
        Player.detachCameraRotationControls()
        GameEngine.setCameraMode(CameraMode.MENU_CAMERA)
        GameEngine.gameState = GameStates.LOADING
        GUI.MainMenu.show("level_change").startCountdown()
        GUI.getCrosshair().hide()
    }

    static resumeGame() {
        GameEngine.attachControlListeners()
        canvas.requestPointerLock()
        //Player.attachPlayerMovementControls()
        GameEngine.setCameraMode(GameEngine.activeCameraMode)
        GUI.MainMenu.hide()
        GameEngine.gameState = GameStates.PLAYING
        GUI.getHelper()
        if(GameEngine.activeCameraMode == CameraMode.FIRST_PERSON) GUI.getCrosshair().show()
    }

    static pauseGame() {
        GameEngine.gameState = GameStates.LEVEL_MENU
        GameEngine.resetInputs()
        GameEngine.detachControlListeners()
        document.exitPointerLock()
        //Player.detachPlayerMovementControls()
        Player.detachPickingTargetCheck()
        Player.detachCameraRotationControls()
        GameEngine.setCameraMode(CameraMode.MENU_CAMERA)
        GUI.MainMenu.show("level")
        GUI.getHelper().hide()
        GUI.getCrosshair().hide()
    }

    static getActionManager() {
       if(GameEngine.scene.actionManager==undefined) 
       {
            GameEngine.scene.actionManager = new BABYLON.ActionManager(GameEngine.scene);

        }
        return GameEngine.scene.actionManager;
    }

    static resetInputs() {
        GameEngine.currentInputsMap = {}
        GameEngine.repeatedInputs = {}
    }

    static detachControlListeners() {
        GameEngine.scene.onPointerDown = undefined
    }
    static attachControlListeners() {
        
        GameEngine.currentInputsMap = {}

        //Used to detect "second-time" events, to detect "long presses"
        GameEngine.repeatedInputs = {}
        var actionManager = GameEngine.getActionManager()

        //SNIPPET TAKEN ONLINE
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (event) {
            //If it's the second time a KeyDown event is received on this key
            GameEngine.currentInputsMap[event.sourceEvent.key.toLowerCase()] = event.sourceEvent.type == "keydown";
            if(Settings.debugControls) GameEngine.currentInputsMap[event.sourceEvent.key.toLowerCase()]
        }));
        actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (event) {								
            GameEngine.currentInputsMap[event.sourceEvent.key.toLowerCase()] = event.sourceEvent.type == "keydown";								
            GameEngine.repeatedInputs[event.sourceEvent.key.toLowerCase()] = event.sourceEvent.type == "keydown";
            if(Settings.debugControls) console.log(GameEngine.repeatedInputs)
        }));

        //Level menu open/close listener
        try {
            GameEngine.scene.onBeforeRenderObservable.add(()=>{
                if(GameEngine.currentInputsMap[KeyMap.openMenu] && !GameEngine.repeatedInputs[KeyMap.openMenu] && GameEngine.gameState!=GameStates.LOADING){
                    if(GameEngine.gameState == GameStates.PLAYING)
                    {
                        GameEngine.pauseGame()
                    }
                    else if(GameEngine.gameState == GameStates.LEVEL_MENU)
                    {
                        GameEngine.resumeGame()
                        canvas.requestPointerLock()
                    }
                    GameEngine.repeatedInputs[KeyMap.openMenu] = true
                }
            })
        }
        catch(e){console.log(e)}

        //Player side view
        try {
            GameEngine.scene.onBeforeRenderObservable.add(()=>{
                if(GameEngine.currentInputsMap[KeyMap.sideView] && !GameEngine.repeatedInputs[KeyMap.sideView] && GameEngine.gameState==GameStates.PLAYING && GameEngine.activeCameraMode==CameraMode.THIRD_PERSON){
                    if(Settings.debugPlayerAnimations) 
                    {
                        Player.cameraAlphaOffset = toRadians(-90)
                        Settings.debugPlayerAnimations = false
                    }
                    else
                    {
                        Player.cameraAlphaOffset = toRadians(0)
                        Settings.debugPlayerAnimations = true
                    }
                    GameEngine.repeatedInputs[KeyMap.sideView] = true
                }
            })
        }
        catch(e){console.log(e)}
    

        //Define a function to request pointer lock
        canvas.requestPointerLock = canvas.requestPointerLock 
        || canvas.msRequestPointerLock 
        || canvas.mozRequestPointerLock 
        || canvas.webkitRequestPointerLock 
        || false;

        //Define a function to release pointer lock
        document.exitPointerLock = document.exitPointerLock 
        || document.msExitPointerLock 
        || document.mozExitPointerLock 
        || document.webkitExitPointerLock 
        || false;

        GameEngine.scene.onPointerDown = function (evt) {

            if (document.pointerLockElement !== canvas) {
    
                if (!GameEngine.pointerLocked) {
                    if (canvas.requestPointerLock) {
                        canvas.requestPointerLock();
                    }
                }
            }
        };
    
        // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
        var pointerlockchange = function () {
            var locked = 
            document.pointerLockElement || 
            document.mozPointerLockElement || 
            document.webkitPointerLockElement || 
            document.msPointerLockElement || 
            false;
    
            // If the user is already locked
            if (!locked) {
                GameEngine.activeCamera.detachControl(canvas);
                GameEngine.pointerLocked = false;
            } else {
                GameEngine.activeCamera.attachControl(canvas);
                GameEngine.pointerLocked = true;
            }
        };
        

        // Attach events to the document
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    static setCameraMode(cameraMode)
    {
        if(GameEngine.forcedCameraMode) return
        if(Settings.debugCamera) console.log("Switching camera mode to: "+cameraMode)
        if(GameEngine.activeCamera==undefined) throw "No active camera!"
        switch(cameraMode) {
            case CameraMode.FREE: {

                
                Player.detachPickingTargetCheck()
                Player.detachCameraRotationControls()

                GameEngine.activeCameraMode = CameraMode.FREE

                var name = GameEngine.activeCamera.name
                GameEngine.activeCamera.dispose()
                GameEngine.createFreeCamera(name)

                GameEngine.activeCamera.attachControl(canvas, true);
                GUI.getCrosshair().hide()
                break;
            }
            case CameraMode.FIRST_PERSON:  
            {
                GameEngine.activeCameraMode = CameraMode.FIRST_PERSON
                var name = GameEngine.activeCamera.name
                GameEngine.activeCamera.dispose()
                
                GameEngine.createFreeCamera(name)
                Player.attachCamera(GameEngine.activeCamera, cameraMode)
                Player.attachCameraRotationControls(GameEngine.scene, cameraMode)
                Player.attachPickingTargetCheck(GameEngine.activeCamera)
                GUI.getCrosshair().show()
                break;
            }
            case CameraMode.THIRD_PERSON: 
            {
                
                Player.detachPickingTargetCheck()

                Player.cameraAlphaOffset = toRadians(-90)
                GameEngine.activeCameraMode = CameraMode.THIRD_PERSON
                var name = GameEngine.activeCamera.name
                GameEngine.activeCamera.dispose()
                
                GameEngine.createArcRotateCamera(name)
                Player.attachCamera(GameEngine.activeCamera, cameraMode)
                Player.attachCameraRotationControls(GameEngine.scene, cameraMode)
                GUI.getCrosshair().hide()
                break;
            }
            case CameraMode.MENU_CAMERA: {
                GameEngine.activeCamera.dispose()
                GameEngine.createMenuCamera("MenuCamera")
                GUI.getCrosshair().hide()
                break;
            }
            default: 
            {
                throw "Unknown camera mode: "+cameraMode
            }
        }
        Settings.cameraMode = cameraMode
    }

    static changeActiveCamera(scene, newCamera) {
        GameEngine.camera = newCamera
        scene.activeCamera = newCamera
    }

    static createFreeCamera(name) {
        GameEngine.activeCamera = new BABYLON.FreeCamera(name, new BABYLON.Vector3(0,0,0), GameEngine.scene);
        GameEngine.activeCamera.speed = 1
        GameEngine.activeCamera.attachControl(canvas, true);
        
        //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    }

    static createArcRotateCamera(name) {
        GameEngine.activeCamera = new BABYLON.ArcRotateCamera(name, toRadians(-90), toRadians(75), 2, new BABYLON.Vector3.Zero(), GameEngine.scene);
        GameEngine.activeCamera.speed = 1
        GameEngine.activeCamera.attachControl(canvas, true);
    }

    static createMenuCamera(name) {
        GameEngine.activeCamera = new BABYLON.ArcRotateCamera(name, toRadians(-90), toRadians(45), 20, new BABYLON.Vector3.Zero(), GameEngine.scene);
        GameEngine.activeCamera.speed = 1
        
        GameEngine.activeCamera.metaData = {}
        GameEngine.activeCamera.metaData.cameraRotationObserver = GameEngine.scene.onBeforeRenderObservable.add(function(){
            GameEngine.activeCamera.alpha = toRadians((toDegrees(GameEngine.activeCamera.alpha)+Settings.MenuCameraRotationSpeed)%360)
        })

        GameEngine.activeCamera.onDisposeObservable.add(function(){
            GameEngine.scene.onBeforeRenderObservable.remove(GameEngine.activeCamera.metaData.cameraRotationObserver)
        })
    }

    static createArcFollowCamera(name, target) {
        GameEngine.activeCamera = new BABYLON.ArcFollowCamera("Camera", toRadians(-90), toRadians(75), 2, target, GameEngine.scene);
        GameEngine.activeCamera.speed = 1
        GameEngine.activeCamera.attachControl(canvas, true);

        
        //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    }

    static addShadows(object) {
        //console.log(GameEngine.shadowGenerators)
        for(var shadowGenerator of GameEngine.shadowGenerators)
        {
            shadowGenerator.addShadowCaster(object, true)
        }
    }

    static removeShadows(object) {
        //console.log(GameEngine.shadowGenerators)
        for(var shadowGenerator of GameEngine.shadowGenerators)
        {
            shadowGenerator.removeShadowCaster(object, true)
        }
    }
}

