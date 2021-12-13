class Player {

    //This class is implemented in a Singleton pattern so only one instance
    //of the player will be accessible at all times.
    static instance;

    //Camera reference, the singleton pattern for the camera is enforced in the
    //GameEngine class
    static camera;
    static cameraOffset;
    static cameraAlphaOffset = Settings.cameraAlphaOffset
    static cameraTargetOffset = new BABYLON.Vector3(0,0,0);

    //Used to restore the initial state of the player
    static initialPosition;
    static initialRotation;
    static dimensions = new BABYLON.Vector3(0.9, 2.1, 0.5)

    static cameraRotation = new BABYLON.Vector3(0,0,0);

    static baseMovementSpeed = Settings.FirstPersonSpeed;
    static baseCameraRotationSpeed = 5;

    //Physics simulation

    //This flag determines wether the player is on the ground
    static onGround = false;
    //This vector determines the direction of the ground "feeler" ray used to detect if the player is on the ground
    static downVector = new BABYLON.Vector3(0,-1,0)
    //Information about the player collider dimensions    
    static playerColliderWidthFraction = 3/4
    static playerColliderHeightFraction = 1/6
    //Used to avoid a falling animation when colliding with objects
    static hitDistanceThresholdForFall = 0.2;
    //Mass and jump impulse magnitude
    static mass = 3
    static jumpForce = 6*Player.mass
    //Used to simulate attrition smoothly between the player and the ground
    static movementDampingFactor = .85;

    //These fields will hold references to the animations
    static walkForwardAnimation;
    static walkBackwardAnimation;
    static walkLeftAnimation;
    static walkRightAnimation;
    static jumpAnimation;
    static fallAnimation;
    static idleAnimation;
    static transitionAnimation=null;

    //Various state variables for the player
    static isIdle = false
    static isFalling = false;
    static isJumping = false;
    //This variable determines if the player is transitioning from an animation
    //to another one
    static transitionGroup = false

    //References to various observers (special event listeners from the Babylon engine)
    static rotationObserver;
    static cameraObserver;
    static movementObserver;

    //Reference to a picked object (if there is one)
    static pickedObject;

    //Reference to a picked object (if there is one)
    static lastTarget;
    //Starting launch force when launching an object
    static objectLaunchForce = Settings.minObjectLaunchForces.base;
    

    //Cleanly despawns a player
    static despawn()
    {
        //Deactivate controls for player (controls will be bound by the GameEngine to the
        //new camera)
        Player.detachPlayerMovementControls()
        Player.detachPickingTargetCheck()
        Player.detachCameraRotationControls()

        //Detach the respawn condition when the player falls off a platform
        Props.detachObservers(Player.instance)

        GameEngine.removeShadows(Player.instance)

        //Properly free camera
        GameEngine.setCameraMode(CameraMode.MENU_CAMERA)
        

        //Destroy the player instance
        Player.instance.dispose(false, false)
        Player.instance = undefined;
    }

    //Cleanly respawns a player
    static respawn()
    {
        if(Player.instance) Player.despawn()
        Player.spawn(GameEngine.scene, Player.initialPosition, Player.initialRotation, true)
        GameEngine.setCameraMode(Settings.defaultCameraMode)
    }

    //Spawns a player
    static spawn(scene, position, rotation, controllable) {
        Player.initialPosition = position
        Player.initialRotation = rotation
        Player.cameraRotation = Player.initialRotation.clone()
        //If we have already created a player, first despawn it, to enforce the singleton pattern
        if(Player.instance != undefined)
        {
            Player.despawn()
        }
        //This function is located in the player_model.js file
        Player.instance = createPlayerModel(scene, Player.dimensions, Player.initialPosition, Player.initialRotation, Player.playerColliderWidthFraction, Player.playerColliderHeightFraction)

        //Create a box collider at the feet of the player. The collider will be lowwer than the player, to avoid toppling over
        //(because it is subject to the Physics engine gravity)
        Physics.createBoxImpostor(scene, Player.instance, {mass: Player.mass, friction: 0, restitution: 0,
            collisionFilterGroup: Physics.collisionFilterGroups.get("player"), 
            collisionFilterMask: Physics.collisionFilterGroups.get("objects") | Physics.collisionFilterGroups.get("ground")}, !Settings.showBoundingBox)
        
        
        if(controllable)
        {
            Player.attachPlayerMovementControls()
        }

        //Bind the animations to their respective fields
        Player.walkForwardAnimation = PlayerAnimations.playerWalkForward(Player.instance)
        Player.walkBackwardAnimation = PlayerAnimations.playerWalkBackward(Player.instance)
        Player.walkLeftAnimation = PlayerAnimations.playerWalkLeft(Player.instance)
        Player.walkRightAnimation = PlayerAnimations.playerWalkRight(Player.instance)
        Player.jumpAnimation = PlayerAnimations.playerJump(Player.instance)
        Player.idleAnimation = PlayerAnimations.playerIdle(Player.instance)
        Player.fallAnimation = PlayerAnimations.playerFall(Player.instance)

        return Player.instance;

    }

    //Cleanly detach player movement controls
    static detachPlayerMovementControls() {
        if(Player.movementObserver) GameEngine.scene.onBeforeRenderObservable.remove(Player.movementObserver)
        Player.movementObserver = undefined
        //Props.detachObservers(Player.instance)
    }
    //Attach player movement controls, that include:
    //1) "Feeler ray" logic that detects wether the player is on the ground or not
    //2) Movement keys handlers
    //3) Animation management logic (including falling animation)
    static attachPlayerMovementControls() {
        
        //Make sure we're not adding this observer twice
        Player.detachPlayerMovementControls()
        

        var hit_distance;

        //Use Babylon's Observable/Observer mechanics to detect and react to inputs
        try {
            Player.movementObserver = GameEngine.scene.onBeforeRenderObservable.add(()=>{

                //Suppress all undesired player rotations (from the Physics engine)
                BABYLON.Quaternion.FromEulerVectorToRef(new BABYLON.Vector3(0,Player.instance.rotationQuaternion.toEulerAngles().y,0), Player.instance.rotationQuaternion)
                Player.instance.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0,0,0))

                //FALL DETECTION
                //Use vertical feeler rays starting from the lower face of the player collider to detect wether
                //the player is jumping/falling or not
                var ray = new BABYLON.Ray(Player.instance.position, Player.downVector, 100);
                var hits = GameEngine.scene.multiPickWithRay(ray, function filter(mesh){return mesh.isPickable});
                
                //Sort hits based on distance
                hits.sort((a, b) => a.distance - b.distance);

                if(Settings.debugJump) console.log(hits)
                if (hits.length && hits[0].pickedMesh){
                    var hit = hits[0];
                    if(hit) hit_distance = hit.distance
                    else hit_distance = 100000
                    //Ignore player collider (sometimes for unknown reasons it is not ignored)
                    if (hit && hit.distance <= Player.dimensions.y*Player.playerColliderHeightFraction/2) {
                        if(Settings.debugJump) console.log("TOUCHING, Min distance: "+Player.dimensions.y*Player.playerColliderHeightFraction/2+", Hit distance: "+hit.distance);
                        Player.onGround = true
                        Player.isFalling=false
                        
                    } else {
                        if(Settings.debugJump) console.log("FALLING, Min distance: "+Player.dimensions.y*Player.playerColliderHeightFraction/2+", Hit distance: "+hit.distance);
                        Player.onGround = false
                        Player.isJumping = false
                    }
                }
                else 
                {
                    Player.onGround=false
                    hit_distance = 100000
                }

                Player.resetAnimationWeights()

                //Manage falling animation BEFORE moving the player so movement animations will not be started if the player is falling
                if(!Player.onGround && !Player.transitionGroup && !Player.isFalling && !Player.isJumping && hit_distance>Player.hitDistanceThresholdForFall)
                {
                    if(Settings.debugPlayerAnimations) console.log("Transitioning to fall")
                    Player.isFalling = true
                    Player.isIdle = false
                    Player.jumpAnimation.stop()
                    Player.walkForwardAnimation.stop()
                    Player.walkBackwardAnimation.stop()
                    Player.walkRightAnimation.stop()
                    Player.walkLeftAnimation.stop()
                    //PlayerAnimations.transitionToIdleState(Player.instance, Player.idleAnimation, true)
                    PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.fallAnimation, true, 1, 1)
                }

                //MOVEMENT KEY HANDLERS and ANIMATION LOGIC

                //The GameEngine holds the currentInputsMap from key to boolean (on/off) and the repeatedInputs map
                //that is "delayed" by one timestep to detect continuous pressing

                //This flag allows stopping animations (except the falling one) if keys are not being pressed
                var keydown = false

                //Toggle first/third person camera key. Also manages the dropping of picked objects
                if(GameEngine.currentInputsMap[KeyMap.toggleCameraMode]){
                    if(Settings.debugControls) console.log("Player: "+GameEngine.repeatedInputs[KeyMap.toggleCameraMode])
                    if(!GameEngine.repeatedInputs[KeyMap.toggleCameraMode])
                    {
                        //Unpick any picked object
                        if(Player.pickedObject)
                        {
                            //Hide the launch charge progress bar in case the player is charging the launch
                            if(Player.objectLaunchForce>Settings.minObjectLaunchForces.base)
                            {
                                GUI.getObjectLaunchForceProgressBar().hide()
                                Player.objectLaunchForce = Settings.minObjectLaunchForces.base
                            }
                            Props.togglePickObject(GameEngine.scene, Player.pickedObject)
                        }

                        //Player movement is slower in third person (to avoid the "sliding" effect of the walking animation)
                        if(Settings.cameraMode==CameraMode.FIRST_PERSON) 
                        {
                            Player.baseMovementSpeed = Settings.ThirdPersonSpeed
                            GameEngine.setCameraMode(CameraMode.THIRD_PERSON)
                        }
                        else if(Settings.cameraMode==CameraMode.THIRD_PERSON) 
                        {
                            Player.baseMovementSpeed = Settings.FirstPersonSpeed
                            GameEngine.setCameraMode(CameraMode.FIRST_PERSON)
                        }
                        GameEngine.repeatedInputs[KeyMap.toggleCameraMode] = true

                        try
                        {
                            Props.disablePickableHighlight(Player.lastTarget)
                        }
                        catch(e){}

                    }
                    keydown=true
                }

                //Forward, backward, left, right movement handlers, together with animation transition logic
                var delta = new BABYLON.Vector3(0.0,0.0,0.0)
                var rotationMatrix = new BABYLON.Matrix();
                Player.instance.rotationQuaternion.toRotationMatrix(rotationMatrix);
                if(GameEngine.currentInputsMap[KeyMap.forward] && !GameEngine.currentInputsMap[KeyMap.backward] /*|| GameEngine.currentInputsMap["ArrowUp"]*/){
                    if(Settings.animatePlayer && !Player.walkForwardAnimation.isStarted &&
                        !Player.transitionGroup && !Player.isFalling && !Player.isJumping)
                    {
                        if(Settings.debugPlayerAnimations) console.log("Starting WALK FORWARD animation")
                        //Make this mutually exclusive with the walkBackward
                        Player.walkBackwardAnimation.stop()

                        Player.walkForwardAnimation.setWeightForAllAnimatables(1)
                        PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.walkForwardAnimation, true)
                    }
                    delta = Player.moveForward(delta, rotationMatrix)
                    keydown=true;
                }
                else
                {
                    if(!Player.transitionGroup && Player.walkForwardAnimation.isStarted) 
                    {
                        if(Settings.debugPlayerAnimations) console.log("Stopping WALK FORWARD animation")
                        Player.walkForwardAnimation.stop()
                    }
                }

                if(GameEngine.currentInputsMap[KeyMap.backward] && !GameEngine.currentInputsMap[KeyMap.forward] /*|| GameEngine.currentInputsMap["ArrowRight"]*/){
                    if(Settings.animatePlayer && !Player.walkBackwardAnimation.isStarted &&
                        !Player.transitionGroup && !Player.isFalling && !Player.isJumping)
                    {
                        if(Settings.debugPlayerAnimations) console.log("Starting WALK BACK animation")

                        //Make this mutually exclusive with the walkForward
                        Player.walkForwardAnimation.stop()

                        Player.walkBackwardAnimation.setWeightForAllAnimatables(1)
                        PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.walkBackwardAnimation, true)
                    }

                    delta = Player.moveBackward(delta, rotationMatrix)
                    keydown=true;
                }
                else
                {
                    if(!Player.transitionGroup && Player.walkBackwardAnimation.isStarted) 
                    {
                        if(Settings.debugPlayerAnimations) console.log("Stopping WALK BACK animation")
                        Player.walkBackwardAnimation.stop()
                    }
                }

                //Side movements. Notice that if these movements are performed together with forward and backward movements,
                //animations are blended (obtaining a diagonal movement effect)
                if(GameEngine.currentInputsMap[KeyMap.left] && !GameEngine.currentInputsMap[KeyMap.right] /*|| GameEngine.currentInputsMap["ArrowLeft"]*/){
                    if(Settings.animatePlayer && !Player.walkLeftAnimation.isStarted &&
                        !Player.transitionGroup && !Player.isFalling && !Player.isJumping)
                    {
                        if(Settings.debugPlayerAnimations) console.log("Starting WALK LEFT animation")
                        
                        var resumeList = []
                        if(Player.walkForwardAnimation.isStarted)
                        {
                            Player.walkForwardAnimation.pause()
                            resumeList.push(Player.walkForwardAnimation)
                        }
                        else if(Player.walkBackwardAnimation.isStarted)
                        {
                            Player.walkBackwardAnimation.pause()
                            resumeList.push(Player.walkBackwardAnimation)
                        }

                        //Make this mutually exclusive with the walkRight
                        Player.walkRightAnimation.stop()
                        PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.walkLeftAnimation, true, 0.8, 1, resumeList)

                    }
                    delta = Player.moveLeft(delta, rotationMatrix)
                    keydown=true;
                }
                else
                {
                    if(!Player.transitionGroup && Player.walkLeftAnimation.isStarted) 
                    {
                        if(Settings.debugPlayerAnimations) console.log("Stopping WALK LEFT animation")
                        Player.walkLeftAnimation.stop()
                    }
                }

                if(GameEngine.currentInputsMap[KeyMap.right] && !GameEngine.currentInputsMap[KeyMap.left] /*|| GameEngine.currentInputsMap["ArrowDown"]*/){
                    if(Settings.animatePlayer && !Player.walkRightAnimation.isStarted &&
                        !Player.transitionGroup && !Player.isFalling && !Player.isJumping)
                    {
                        if(Settings.debugPlayerAnimations) console.log("Starting WALK RIGHT animation")

                        var resumeList = []
                        if(Player.walkForwardAnimation.isStarted)
                        {
                            Player.walkForwardAnimation.pause()
                            resumeList.push(Player.walkForwardAnimation)
                        }
                        else if(Player.walkBackwardAnimation.isStarted)
                        {
                            Player.walkBackwardAnimation.pause()
                            resumeList.push(Player.walkBackwardAnimation)
                        }
                        
                        //Make this mutually exclusive with the walkLeft
                        Player.walkLeftAnimation.stop()
                        PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.walkRightAnimation, true, 0.8, 1, resumeList)
                    }

                    delta = Player.moveRight(delta, rotationMatrix)
                    keydown=true;
                } 
                else
                {
                    if(!Player.transitionGroup && Player.walkRightAnimation.isStarted) 
                    {
                        if(Settings.debugPlayerAnimations) console.log("Stopping WALK RIGHT animation")
                        Player.walkRightAnimation.stop()
                    }
                }

                //Jumping animation. The call to the function that actually applies an impulse to jump is a callback
                //to the animation function, to correctly time it with the animation
                if(GameEngine.currentInputsMap[KeyMap.jump] && Player.onGround){
                    if(Settings.animatePlayer && 
                        !Player.transitionGroup && !Player.isFalling && !Player.isJumping)
                    {
                        if(Settings.debugPlayerAnimations) console.log("Starting JUMP animation")
                        //Make this mutually exclusive with the walkLeft

                        Player.isJumping = true
                        Player.walkForwardAnimation.stop()
                        Player.walkBackwardAnimation.stop()
                        Player.walkRightAnimation.stop()
                        Player.walkLeftAnimation.stop()
                        PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.jumpAnimation, false, 2.0, 6)
                    }

                    keydown=true;
                }

                
                //Falling animation logic
                if(!Player.isFalling && Player.fallAnimation.isStarted) Player.fallAnimation.stop()
                if(!keydown)
                {
                    //If not free-falling go back to idle animation
                    if(!Player.isIdle && !Player.transitionGroup  && !Player.isJumping) 
                    {
                        if(Player.onGround)
                        {
                            if(Settings.debugPlayerAnimations) console.log("Transitioning to idle")
                            Player.isIdle = true
                            Player.fallAnimation.stop()
                            Player.jumpAnimation.stop()
                            PlayerAnimations.transitionToAnimationGroup(Player.instance, Player.idleAnimation, true, 1, 1)
                        }
                    }

                    //Damp player speed when not moving (vanilla attrition proved to be problematic)
                    var speed = Player.instance.physicsImpostor.getLinearVelocity()
                    var verticalSpeed = speed.y
                    speed = speed.scale(Player.movementDampingFactor)
                    speed.y = verticalSpeed
                    Player.instance.physicsImpostor.setLinearVelocity(speed)

                }
                else
                {
                    Player.isIdle = false
                    if(Player.idleAnimation.isStarted) Player.idleAnimation.stop()
                }

                
                //Cutoff velocity if it gets too small when player is slowing down
                if(Player.instance.physicsImpostor.getLinearVelocity().length < BABYLON.Epsilon && Player.onGround) Player.instance.physicsImpostor.setLinearVelocity(new BABYLON.Vector3.Zero())

            })
            
        }catch(e){console.log(e)}

        //Attach a respawn condition when the player falls off the level
        var fallRespawnCondition = function (object) {
            return object.position.y < Settings.minDespawnHeight
        }
        Props.attachObserver(Player.instance, fallRespawnCondition, Player.respawn)
    }

    //Cleanly detach object pick up observers
    static detachPickingTargetCheck() {
        if(Player.pickedObject) Props.togglePickObject(GameEngine.scene, Player.pickedObject) 
        if(Player.pickingObserver) GameEngine.scene.onAfterRenderObservable.remove(Player.pickingObserver)
        Player.pickingObserver = undefined
        if(Player.pickingKeyObserver) GameEngine.scene.onBeforeRenderObservable.remove(Player.pickingKeyObserver)
        Player.pickingKeyObserver = undefined

        GameEngine.currentInputsMap["mousepressed"] = false
        canvas.removeEventListener("mousedown", Player.mouseDownHandler);
        canvas.removeEventListener("mouseup", Player.mouseUpHandler);
    }
    
    //Attach object highlight/pick up observers that use feeler rays to detect object being looked at
    static attachPickingTargetCheck() {
        Player.pickingObserver = GameEngine.scene.onAfterRenderObservable.add((evt)=>{
            
            //Uses a "feeler" ray that detects the object that is currently being looked at by the player
            var currentTarget = pickCurrentAimedTarget(GameEngine.scene, GameEngine.activeCamera)
            //Initialize lastTarget
            if(!Player.lastTarget) Player.lastTarget = currentTarget
            
            //Objects highlight toggle control 
            try{
                //Disable highlight on target if
                if(currentTarget && 
                    (Player.lastTarget!=currentTarget //CASE 1: the aimed target has changed
                    //CASE 2: the target is the same but it has become too far
                    || BABYLON.Vector3.Distance(Player.instance.position,currentTarget.position)>Settings.maxPickableObjectDistance)
                )
                {
                    if(Settings.debugHighlight) console.log("Changed target: "+currentTarget.name)
                    Props.disablePickableHighlight(Player.lastTarget)
                }    
            }
            catch(e){
                //console.log(e)
            }
            
            if(Player.lastTarget!=currentTarget) Player.lastTarget = currentTarget

            try{
                if(currentTarget && currentTarget.metaData.highlighted!=undefined && !currentTarget.metaData.highlighted)
                {
                    if(BABYLON.Vector3.Distance(Player.instance.position,currentTarget.position)<Settings.maxPickableObjectDistance)
                    {
                        Props.enablePickableHighlight(currentTarget)
                    }
                    else if(Settings.debugPicking) console.log(BABYLON.Vector3.Distance(Player.instance.position,currentTarget.position))
                }
            }
            catch(e){
                //console.log(e)
            }
            
        });
        Player.pickingObserver.name = "pickingObserver"
        
        //Objects pick up toggle control 
        Player.pickingKeyObserver = GameEngine.scene.onBeforeRenderObservable.add((evt)=>{
            
            if(GameEngine.currentInputsMap[KeyMap.pickObject] && !GameEngine.repeatedInputs[KeyMap.pickObject])
            {
                GameEngine.repeatedInputs[KeyMap.pickObject] = true
                if(Player.lastTarget)
                {
                    try 
                    {
                        if(Player.pickedObject) Props.togglePickObject(GameEngine.scene, Player.pickedObject) 
                        else Props.togglePickObject(GameEngine.scene, Player.lastTarget)
                    }
                    catch(e){}
                }
                else if(Player.pickedObject) Props.togglePickObject(GameEngine.scene, Player.pickedObject)
            }
            if(GameEngine.currentInputsMap["leftmousepressed"] && !Player.isHoldingShooter())
            {
                Player.chargeLaunch()
            }
        });
        Player.pickingKeyObserver.name = "pickingKeyObserver"
        
        //Having the mousepressed entry of the current inputs map set to true will trigger the launch charge in the 
        //Player.pickingKeyObserver
        canvas.addEventListener("mousedown", Player.mouseDownHandler, false);
        canvas.addEventListener("mouseup", Player.mouseUpHandler, false);

    }

    //Handle object launch charging / shooting
    static mouseDownHandler(event) {
        var shooter = Player.isHoldingShooter();
        if(event.button==0)
        {
            GameEngine.currentInputsMap["leftmousepressed"] = true
            if(shooter)
            {
                var projectile;
                try
                {
                    projectile = Player.pickedObject.metaData.projectile
                }
                catch(e)
                {
                    console.log(e)
                    projectile = Props.defaultProjectile
                }
                Player.shoot(projectile)
            } 
        }
        else if(event.button==2)
        {
            if(!shooter)
            {
                Player.launchChargedBall(true)
            }
        }
    }
    
    //Handle charged launch
    static mouseUpHandler(event) {
        if(event.button==0)
        {
            if(!Player.isHoldingShooter())
            {
                GameEngine.currentInputsMap["leftmousepressed"] = false
                Player.launchChargedBall()
            }
        }
    }

    //Determine if the held object has the "shooter" flag saved in its metaData
    static isHoldingShooter() {
        var shooter;
        try {
            shooter = Player.pickedObject.metaData.shooter
        }
        catch(e)
        {
            console.log(e)
            shooter = false;
        }
        return shooter;
    }

    //Charge the launch of an object
    static chargeLaunch() {
                
        if(Player.pickedObject)
        {
            if(Settings.debugPicking) console.log(GameEngine.currentInputsMap["leftmousepressed"])
            try 
            {
                if(Player.objectLaunchForce < Settings.maxObjectLaunchForces.base) Player.objectLaunchForce += Settings.launchForceIncrements.base
                if(Settings.debugPicking) console.log(Player.objectLaunchForce)
                GUI.getObjectLaunchForceProgressBar().show(Player.objectLaunchForce, Settings.maxObjectLaunchForces.base, Settings.minObjectLaunchForces.base)
            }
            catch(e){}
        }
    }

    //Launches the ball with the current accumulated force. StraightLaunch will trigger a higher force launche
    // to launch the ball ideally straight
    static launchChargedBall(straightLaunch) {
        
        if(Player.pickedObject)
        {
            try 
            {
                if(straightLaunch) Props.togglePickObject(GameEngine.scene, Player.pickedObject, Settings.objectStraightLaunchForce)
                else Props.togglePickObject(GameEngine.scene, Player.pickedObject, Player.objectLaunchForce)
                Player.objectLaunchForce = Settings.minObjectLaunchForces.base
                GUI.getObjectLaunchForceProgressBar().hide()
            }
            catch(e){}
        }
    }

    //Shoot a projectile from the shooter
    static shoot(projectileSpawnFunction) {
        
        if(Player.pickedObject)
        {
            try 
            {
                if(Settings.debugShooters) console.log("SHOOT")
                var launchForce = Settings.objectStraightLaunchForce
                var direction = GameEngine.activeCamera.getTarget().subtract(GameEngine.activeCamera.position)
                direction = direction.multiply(new BABYLON.Vector3(launchForce,launchForce,launchForce))
                var initialPosition = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0.0,0.0,0.5), Player.pickedObject.getWorldMatrix())
                var projectile = projectileSpawnFunction(GameEngine.scene, initialPosition, GameEngine.activeCamera.rotation)
                projectile.physicsImpostor.setLinearVelocity(direction)
            }
            catch(e){
                console.log(e)
            }
        }

    }

    /*
    static detachCameraZoomControls() {
        
        window.addEventListener("wheel", Player.mouseWheelHandler);
    }
    static attachCameraZoomControls() {
        window.addEventListener("wheel", Player.mouseWheelHandler, false);
    }
    static mouseWheelHandler(event) {
        console.info(event.deltaY)
        if(event.deltaY>0)
        {
            if(GameEngine.activeCamera.radius<Settings.upperCameraRadiusLimit && GameEngine.activeCameraMode==CameraMode.THIRD_PERSON)
            {
                console.log(GameEngine.activeCamera.radius)
                var cameraOffsetDelta = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0,0,BABYLON.Epsilon), GameEngine.activeCamera.computeWorldMatrix())
                Player.cameraOffset = Player.cameraOffset.add(cameraOffsetDelta)
            }
        }
        else if(event.deltaY<0)
        {
            if(GameEngine.activeCamera.radius>Settings.lowerCameraRadiusLimit && GameEngine.activeCameraMode==CameraMode.THIRD_PERSON)
            {
                console.log(GameEngine.activeCamera.radius)
                var cameraOffsetDelta = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(0,0,BABYLON.Epsilon), GameEngine.activeCamera.computeWorldMatrix())
                Player.cameraOffset = Player.cameraOffset.subtract(cameraOffsetDelta)
            }
        }
    }*/

    //Cleanly detach the camera rotation observer
    static detachCameraRotationControls() {
        //Player.detachCameraZoomControls()
        if(Player.rotationObserver) GameEngine.scene.onPointerObservable.remove(Player.rotationObserver)
        Player.rotationObserver = undefined
        if(Player.cameraObserver) GameEngine.scene.onBeforeRenderObservable.remove(Player.cameraObserver)
        Player.cameraObserver = undefined
    }
    //Attach an observer for the rotation of the camera, that follows the movements of the mouse and rotates
    //the camera accordingly. To have a flawless camera movement tracking, this is done asynchronously in two different
    //observers.
    static attachCameraRotationControls() {
        
        //make sure we're not adding this observer twice
        Player.detachCameraRotationControls()
        // Mouse movement events
        try {
        //This first Observer controls camera rotation by tracking mouse movements across the canvas
        Player.rotationObserver = GameEngine.scene.onPointerObservable.add((evt)=>{
            if(evt.type == BABYLON.PointerEventTypes.POINTERMOVE && GameEngine.pointerLocked){
                var rotationY, rotationX;

                if(Settings.invertYMouseAxis) rotationY = Player.cameraRotation.y-evt.event.movementX/Settings.YMouseSensitivity
                else rotationY = Player.cameraRotation.y+evt.event.movementX * Settings.YMouseSensitivity

                if(Settings.invertXMouseAxis) rotationX = Player.cameraRotation.x-evt.event.movementY/Settings.XMouseSensitivity
                else rotationX = Player.cameraRotation.x+evt.event.movementY * Settings.XMouseSensitivity

                if(Settings.cameraMode==CameraMode.FIRST_PERSON)
                {
                    Player.cameraRotation.x = BABYLON.Scalar.Clamp(rotationX, Settings.FirstPersonCameraMinRotationX, Settings.FirstPersonCameraMaxRotationX)
                }
                else
                {
                    Player.cameraRotation.x = BABYLON.Scalar.Clamp(rotationX, Settings.ThirdPersonCameraMinRotationX, Settings.ThirdPersonCameraMaxRotationX)
                }
                Player.cameraRotation.y = rotationY
                BABYLON.Quaternion.FromEulerVectorToRef(new BABYLON.Vector3(0,Player.cameraRotation.y,0), Player.instance.rotationQuaternion)
            }
        })
        Player.rotationObserver.name = "rotationObserver"

        //This second Observer actually updates the camera to its latest position/rotation
        Player.cameraObserver = GameEngine.scene.onBeforeRenderObservable.add(()=>{
            if(Settings.cameraMode==CameraMode.FIRST_PERSON) {

                Player.camera.position = BABYLON.Vector3.TransformCoordinates(Player.cameraOffset, Player.instance.getWorldMatrix());
                
                Player.camera.rotation = new BABYLON.Vector3(Player.cameraRotation.x,Player.cameraRotation.y,0)
            }
            else
            {
                Player.camera.position = Player.instance.position.add(Player.cameraOffset)         
                Player.camera.setTarget(Player.instance.position.add(Player.cameraTargetOffset))

                Player.camera.alpha = -Player.cameraRotation.y + Player.cameraAlphaOffset
                Player.camera.beta = -Player.cameraRotation.x + toRadians(90)

            }
        })
        Player.cameraObserver.name = "cameraObserver"

        }catch(e){console.log(e)}
    }

    //This function "attaches" a camera to the player so that it will follow the player when it moves around
    //It has a different behavior in First and Third person
    static attachCamera(camera, cameraMode) {
        if(cameraMode==CameraMode.FIRST_PERSON) {
            var offset = new BABYLON.Vector3(0,Player.dimensions.y - Player.dimensions.y/4,0.55);
            
            Player.camera = camera
            Player.cameraOffset = offset
            Player.camera.position = Player.instance.position.add(Player.cameraOffset)
            Player.camera.minZ = 0.1
            
            Player.cameraRotation.x = BABYLON.Scalar.Clamp(Player.cameraRotation.x, Settings.FirstPersonCameraMinRotationX, Settings.FirstPersonCameraMaxRotationX)
            
        }
        else
        {
            var offset, target_offset;
            offset = new BABYLON.Vector3(0.0,3.0,-5.0);
            target_offset = new BABYLON.Vector3(0.0,2.0,0.0)
            Player.camera = camera
            Player.cameraOffset = offset
            Player.cameraTargetOffset = target_offset
            Player.camera.position = Player.instance.position.add(Player.cameraOffset)

            camera.radius = 4
            

            Player.cameraRotation.x = BABYLON.Scalar.Clamp(Player.cameraRotation.x, Settings.ThirdPersonCameraMinRotationX, Settings.ThirdPersonCameraMaxRotationX)

        }
    }

    //The following functions update the player position/rotation when it moves accordin to user inputs
    static moveForward(delta, rotationMatrix) {
        var speed = Player.baseMovementSpeed

        //Half speed during animation transition
        //if(Player.transitionGroup) speed /= 2

        var localDelta = new BABYLON.Vector3(0.0, 0.0, speed);
        
        var rotationMatrix = new BABYLON.Matrix();
        Player.instance.rotationQuaternion.toRotationMatrix(rotationMatrix);
        localDelta = BABYLON.Vector3.TransformCoordinates(localDelta, rotationMatrix);
        delta.addInPlace(localDelta)
        delta.y = Player.instance.physicsImpostor.getLinearVelocity().y
        Player.instance.physicsImpostor.setLinearVelocity(delta)
        //delta = multiplyVector3WithScalar(delta, 0.01)
        //Player.instance.moveWithCollisions(delta)
        return delta
        
    }
    
    static moveLeft(delta, rotationMatrix) {
        var speed = Player.baseMovementSpeed/2
        
        //Half speed during animation transition
        //if(Player.transitionGroup) speed /= 2

        var localDelta = new BABYLON.Vector3(-speed, 0.0, 0.0);

        localDelta = BABYLON.Vector3.TransformCoordinates(localDelta, rotationMatrix);
        delta.addInPlace(localDelta)
        delta.y = Player.instance.physicsImpostor.getLinearVelocity().y
        Player.instance.physicsImpostor.setLinearVelocity(delta)
        return delta
    }

    static moveRight(delta, rotationMatrix) {
        var speed = Player.baseMovementSpeed/2

        //Half speed during animation transition
        //if(Player.transitionGroup) speed /= 2

        var localDelta = new BABYLON.Vector3(speed, 0.0, 0.0);

        localDelta = BABYLON.Vector3.TransformCoordinates(localDelta, rotationMatrix);
        delta.addInPlace(localDelta)
        delta.y = Player.instance.physicsImpostor.getLinearVelocity().y
        Player.instance.physicsImpostor.setLinearVelocity(delta)
        return delta
    }

    static moveBackward(delta, rotationMatrix) {
        var speed = Player.baseMovementSpeed/2

        //Half speed during animation transition
        //if(Player.transitionGroup) speed /= 2

        var localDelta = new BABYLON.Vector3(0.0, 0.0, -Player.baseMovementSpeed);
        localDelta = BABYLON.Vector3.TransformCoordinates(localDelta, rotationMatrix);
        delta.addInPlace(localDelta)
        delta.y = Player.instance.physicsImpostor.getLinearVelocity().y
        Player.instance.physicsImpostor.setLinearVelocity(delta)
        return delta
    }

    //Apply an impulse to the player physicscImpostor to obtain a jump
    static jump() {
        Player.instance.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,Player.jumpForce,0), Player.instance.position)
        //The jumping state is limited to the animation of jumping and the application of the impulse
        //then it becomes a "falling" state
        Player.isJumping = false
    }

    //NOT USED - Resets animation blending weights
    static resetAnimationWeights(){
        
        Player.walkForwardAnimation.setWeightForAllAnimatables(1)
        Player.walkBackwardAnimation.setWeightForAllAnimatables(1)
        Player.walkLeftAnimation.setWeightForAllAnimatables(1)
        Player.walkRightAnimation.setWeightForAllAnimatables(1)
        Player.jumpAnimation.setWeightForAllAnimatables(1)
        Player.idleAnimation.setWeightForAllAnimatables(1)
        Player.fallAnimation.setWeightForAllAnimatables(1)
    }

    static stopWalkingAnimations() {
        Player.walkForwardAnimation.stop()
        Player.walkBackwardAnimation.stop()
        Player.walkRightAnimation.stop()
        Player.walkLeftAnimation.stop()
    }
}
