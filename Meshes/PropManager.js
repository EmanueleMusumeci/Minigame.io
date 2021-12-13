
// This class holds all methods for creation of objects used in the game
// It also implements a custom CONDITION -> FUNCTION system through the use
// of Observables/Observers used for custom event-triggered functions (like the
// respawning of objects that fall of the map)
class Props {

    //This will hold a map from mesh uniqueId to a list of inline objects that hold:
    //1) a reference to a list of conditions
    //2) a reference to a function 
    static objectToObserver;

    //This method enforces a singleton pattern on the map, on its first call attaches an onBeforeRenderObservable observer that
    //executes a certain function under specific conditions
    static attachObserver(object, triggerCondition, func) {
        //Create the instance if it does not exist
        if(!Props.objectToObserver) Props.objectToObserver = new Map();

        //If the entry already exists
        if(Props.objectToObserver.has(object.uniqueId)) {
            Props.objectToObserver.get(object.uniqueId).triggerConditions.push(triggerCondition)
            Props.objectToObserver.get(object.uniqueId).triggeredFunctions.push(func)
        }
        else
        {
            Props.objectToObserver.set(object.uniqueId, 
                {
                    triggerConditions: [triggerCondition],
                    triggeredFunctions: [func],
                    observer: GameEngine.scene.onBeforeRenderObservable.add((evt)=>{
                        var objectEntry = Props.objectToObserver.get(object.uniqueId)
                        var i=0
                        for(var condition of objectEntry.triggerConditions)
                            {
                                if(condition(object)) objectEntry.triggeredFunctions[i](object)
                                i+=1
                            }
                        }
                    ) 
                }
            )
        }
    }
    //detach all registered "condition-checkers" from the method above from the object
    static detachObservers(object) {
        if(!Props.objectToObserver || !Props.objectToObserver.has(object.uniqueId)) return
        
        //Remove the observer
        GameEngine.scene.onBeforeRenderObservable.remove(Props.objectToObserver.get(object.uniqueId).observer)

        //Remove the map entry
        Props.objectToObserver.delete(object.uniqueId)
    }

    //Enforces a singleton pattern on a "Highlight layer", that will provide a highlight to objects being looked at
    static pickableHighlight;
    static getPickableHighlight()
    {
        if(!Props.pickableHighlight)
         {

            Props.pickableHighlight = new BABYLON.HighlightLayer("pickable_objects_highlight", GameEngine.scene)
            Props.pickableHighlight.blurHorizontalSize = 2;	
            Props.pickableHighlight.blurVerticalSize = 2;
         }
         return Props.pickableHighlight
    }

    //Functions to create various props. Some props (like the pistol projectiles) trigger some events under specific conditions
    //Some props use the "metaData" field to store custom informations about the object    
    static standardLevelPlatform(scene, width, depth, color, material) {
        var platform = BABYLON.MeshBuilder.CreateBox("standardLevelPlatform", {height: 0.5, width: width, depth: depth, updatable: true});
        if(material)
        {
            platform.material = material;
        }
        else
        {
            platform.material = new BABYLON.StandardMaterial("platformMaterial", scene);
            platform.material.diffuseColor = color
            platform.material.specularColor = color

        }
        Physics.createBoxImpostor(scene, platform, {mass:0, friction: 1.0,
            collisionFilterGroup: Physics.collisionFilterGroups.get("ground"), 
            collisionFilterMask: Physics.collisionFilterGroups.get("objects") | Physics.collisionFilterGroups.get("player")})
        
        //This one is used by the altitude detection ray for the falling animation
        //The flag for actual picking up the object is explicitly stored in the objects "metaData"
        platform.isPickable = true
        platform.receiveShadows = true

        return platform
    }
    
    static standardLevelCircularPlatform(scene, diameter, color, material) {
        var platform = BABYLON.MeshBuilder.CreateCylinder("standardLevelPlatform", {height: 0.5, diameter: diameter});
        if(material)
        {
            platform.material = material;
        }
        else
        {
            platform.material = new BABYLON.StandardMaterial("platformMaterial", scene);
            platform.material.diffuseColor = color
            platform.material.specularColor = color

        }
        Physics.createCylinderImpostor(scene, platform, {mass:0, friction: 1.0,
            collisionFilterGroup: Physics.collisionFilterGroups.get("ground"), 
            collisionFilterMask: Physics.collisionFilterGroups.get("objects") | Physics.collisionFilterGroups.get("player")})
        
        //This one is used by the altitude detection ray for the falling animation
        //The flag for actual picking up the object is explicitly stored in the objects "metaData"
        platform.isPickable = true
        platform.receiveShadows = true

        //GameEngine.addShadows(platform)
        return platform
    }

    static skyBox(scene) {
        var skyBox  = BABYLON.Mesh.CreateBox('SkyBox', 10000, scene, false, BABYLON.Mesh.BACKSIDE);
        skyBox.material = new BABYLON.SkyMaterial('sky', scene);
        skyBox.material.inclination = -0.35;


        skyBox.isPickable = false
        return skyBox
    }

    static sun(scene, noShadow) {
                
        // Light
        var sunLight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(0, -1, -1), scene);
        sunLight.diffuse = new BABYLON.Color3(1, 1, 1);
        sunLight.specular = new BABYLON.Color3(0.2, 0.2, 0.1);
        sunLight.ambient = new BABYLON.Color3(0.2, 0.2, 0.1);

        //Even if counter-intuitive, the position of the directional light is needed for shadow maps
        sunLight.position.y = 30
        sunLight.position.z = 30
        
        if(!noShadow)
        {
            var shadowGenerator = new BABYLON.ShadowGenerator(1024, sunLight)
            shadowGenerator.usePercentageCloserFiltering  = false;
            shadowGenerator.useBlurExponentialShadowMap  = true;
            shadowGenerator.forceBackFacesOnly = true;
            shadowGenerator.depthScale = 20000;
            shadowGenerator.transparencyShadow = true
            shadowGenerator.blurKernel = 6;
            shadowGenerator.useKernelBlur = true;
    
            GameEngine.shadowGenerators.push(shadowGenerator);
            sunLight.shadowMinZ = 0.1;
            sunLight.shadowMaxZ = 1000000;
    
            sunLight.onDisposeObservable.add(function(){
                shadowGenerator.dispose();
            });
        }

        return sunLight
    }

    static pickableSphere(scene, position, rotation, options) {
        
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()

        var name = chooseUniqueName(scene, "pickableBall")
        // Grabbable Object

        var pickableBall;
        if(!options) pickableBall = BABYLON.Mesh.CreateSphere(name, 5,0.8, scene);
        else pickableBall = BABYLON.MeshBuilder.CreateSphere(name, options, scene);

        //This one is used by the altitude detection ray for the falling animation
        pickableBall.isPickable = true

        pickableBall.material = new BABYLON.StandardMaterial(pickableBall.name+"_material", scene);
        pickableBall.material.diffuseColor = new BABYLON.Color3(1, .5, 0);

        pickableBall.receiveShadows = true

        pickableBall.position = position;
        pickableBall.rotation = rotation;

        pickableBall.checkCollisions = true;
        pickableBall.actionManager = new BABYLON.ActionManager(scene);
        pickableBall.physicsImpostor = new BABYLON.PhysicsImpostor(pickableBall, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.5, restitution: 2.0, friction: 5.0 }, scene);
        
        //This data is used to controlled the state of the ball
        pickableBall.metaData = {
            highlighted: false, picked: false, pickable: true, 
            originalMass: 0.5, originalPosition: pickableBall.position, originalRotationQuaternion: pickableBall.rotationQuaternion,
            originalMaterial: pickableBall.material
        }

        //Add a respawn condition when the object falls off the platform
        var fallRespawnCondition = function (object) {
            return object.position.y < Settings.minDespawnHeight
        }
        Props.attachObserver(pickableBall, fallRespawnCondition, Props.respawn)
        //Props.detachDespawnableObserver(pickableBall)
        
        GameEngine.addShadows(pickableBall)

        return pickableBall
    }

    static pickableBox(scene, position, rotation, options) {
        
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()

        var name = chooseUniqueName(scene, "pickableBox")
        // Grabbable Object

        var pickableBox;
        if(!options) pickableBox = BABYLON.Mesh.CreateBox(name, 1, scene);
        else pickableBox = BABYLON.MeshBuilder.CreateBox(name, options, scene);

        //This one is used by the altitude detection ray for the falling animation
        pickableBox.isPickable = true

        pickableBox.material = new BABYLON.StandardMaterial(pickableBox.name+"_material", scene);
        pickableBox.material.diffuseColor = new BABYLON.Color3(1, .5, 0);

        pickableBox.receiveShadows = true

        pickableBox.position = position;
        pickableBox.rotation = rotation;

        pickableBox.checkCollisions = true;
        pickableBox.actionManager = new BABYLON.ActionManager(scene);
        pickableBox.physicsImpostor = new BABYLON.PhysicsImpostor(pickableBox, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.5, restitution: 2.0, friction: 5.0 }, scene);
        
        //This data is used to controll the state of the ball
        pickableBox.metaData = {highlighted: false, picked: false, pickable: true, 
            originalMass: 0.5, originalPosition: pickableBox.position, originalRotationQuaternion: pickableBox.rotationQuaternion,
            originalMaterial: pickableBox.material
        }

        GameEngine.addShadows(pickableBox)

        return pickableBox
    }

    static defaultProjectile(scene, position, rotation, options) {
        
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()

        var name = chooseUniqueName(scene, "projectile")
        // Grabbable Object

        var projectile_head = BABYLON.MeshBuilder.CreateSphere(name, {diameter:0.05}, scene);
        //This one is used by the altitude detection ray for the player falling animation
        projectile_head.isPickable = false
        projectile_head.material = new BABYLON.StandardMaterial(projectile_head.name+"_material", scene);
        projectile_head.material.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0);
        projectile_head.material.specularColor = new BABYLON.Color3(0.9, 0.7, 0);
        projectile_head.receiveShadows = false
        projectile_head.position = position;
        projectile_head.rotation = rotation;
        projectile_head.checkCollisions = true;
        projectile_head.physicsImpostor = new BABYLON.PhysicsImpostor(projectile_head, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.05, restitution: 0, friction: 5.0 }, scene);
        
        var projectile = BABYLON.MeshBuilder.CreateCylinder(name, {diameterTop:0.05, diameterBottom: 0.05, height: 0.1}, scene);
        //This one is used by the altitude detection ray for the player falling animation
        projectile.isPickable = false
        projectile.material = new BABYLON.StandardMaterial(projectile.name+"_material", scene);
        projectile.material.diffuseColor = new BABYLON.Color3(0.9, 0.7, 0);
        projectile.material.specularColor = new BABYLON.Color3(0.9, 0.7, 0);
        projectile.receiveShadows = false
        projectile.position = new BABYLON.Vector3(0.0,0.0,-0.05);
        projectile.rotation = new BABYLON.Vector3(toRadians(90),0,0);
        projectile.checkCollisions = true;
        projectile.parent = projectile_head

        //This data is used to controlled the state of the ball
        projectile_head.metaData = {
            highlighted: false, picked: false, pickable: true, 
            originalMass: 0.05, originalPosition: projectile_head.position, originalRotationQuaternion: projectile_head.rotationQuaternion,
            originalMaterial: projectile_head.material, onCollideRegistered: []
        }

        //Add a despawn condition when the object falls off the platform
        var fallRespawnCondition = function (object) {
            return object.position.y < Settings.minDespawnHeight
        }
        Props.attachObserver(projectile_head, fallRespawnCondition, Props.despawn)

        //Detects when a target is hit and in that case it despawns it and scores a point
        var hitTarget = function (object) {
            //console.log(LevelManager.currentLevel.currentTargets)
            for(var target of LevelManager.currentLevel.currentTargets)
            {
                if(target.isDisposed()) continue
                if(object.intersectsMesh(target, true)) 
                {
                    Props.despawn(target)
                    return true
                }
            }
            return false
        }
        var targetHitHandler = function(object) {
            
            LevelManager.currentLevel.scorePoint()
            LevelManager.currentLevel.nextTarget()
            Props.despawn(object)
        }
        Props.attachObserver(projectile_head, hitTarget, targetHitHandler)

        GameEngine.addShadows(projectile_head)

        //This is to fix those projectiles that sometimes remain trapped in the target
        //(they will get despawned with all the other level props)
        LevelManager.currentLevel.levelObjects.push(projectile_head)

        //Play the shot sound before returning
        LevelManager.currentLevel.sounds.gunshot.play()

        return projectile_head
    }

    static basketBall(scene, position, rotation, options, attachSounds) {
        
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()

        var name = "basketBall"
        // Grabbable Object

        var basketBall;
        if(!options) basketBall = BABYLON.Mesh.CreateSphere(name, 5,0.8, scene);
        else basketBall = BABYLON.MeshBuilder.CreateSphere(name, options, scene);

        //This one is used by the altitude detection ray for the falling animation
        basketBall.isPickable = true

        basketBall.material = Materials.basketBallMaterial
        basketBall.receiveShadows = true

        basketBall.position = position;
        basketBall.rotation = rotation;

        basketBall.checkCollisions = true;
        basketBall.actionManager = new BABYLON.ActionManager(scene);
        basketBall.physicsImpostor = new BABYLON.PhysicsImpostor(basketBall, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0.5, restitution: 4, friction: 5.0 }, scene);
        
        //This data is used to controlled the state of the ball
        basketBall.metaData = {
            highlighted: false, picked: false, pickable: true, 
            originalMass: 0.5, originalPosition: basketBall.position, originalRotationQuaternion: basketBall.rotationQuaternion,
            originalMaterial: basketBall.material
        }

        //Add a respawn condition when the object falls off the platform
        var fallRespawnCondition = function (object) {
            return object.position.y < Settings.minDespawnHeight
        }
        Props.attachObserver(basketBall, fallRespawnCondition, Props.respawn)
        //Props.detachDespawnableObserver(basketBall)
        
        GameEngine.addShadows(basketBall)

        if(attachSounds)
        {
            basketBall.actionManager = new BABYLON.ActionManager(GameEngine.scene);
            basketBall.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: GameEngine.scene.getMeshByName("standardLevelPlatform")
            }, function () {
                LevelManager.currentLevel.sounds.ballBounce1.attachToMesh(basketBall)
                LevelManager.currentLevel.sounds.ballBounce1.play()
                }));
    
   
            if(GameEngine.scene.getMeshByName("basket_frame_base"))
            {
                basketBall.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: GameEngine.scene.getMeshByName("basket_frame_base")
                }, function () {
                    LevelManager.currentLevel.sounds.ballBounce1.attachToMesh(basketBall)
                    LevelManager.currentLevel.sounds.ballBounce1.play()
                    }));
        
                basketBall.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: GameEngine.scene.getMeshByName("basket_frame_stand")
                }, function () {
                    LevelManager.currentLevel.sounds.ballBounce1.attachToMesh(basketBall)
                    LevelManager.currentLevel.sounds.ballBounce1.play()
                    }));
            }

            //Covers also the case in which level is randomized
            for(var object of scene.meshes)
            {
                console.log(object.name)
                if(object.name.includes("hoop") || object.name.includes("board") || object.name.includes("frame_base") || object.name.includes("standardLevelPlatform") || object.name.includes("frame_stand"))
                {
                    basketBall.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                        parameter: object
                    }, function () {
                        LevelManager.currentLevel.sounds.ballBounce1.attachToMesh(basketBall)
                        LevelManager.currentLevel.sounds.ballBounce1.play()
                        }));    
                }
            }
        }
        

        return basketBall
    }

    
    //The basket has a hidden collider in its hoop (visible by select the "Show colliders" option in the options page)
    //to detect when a point is scored
    static basket(scene, position, rotation, pedestal) {
                
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()

        var BASE_WIDTH = 3
        var BASE_HEIGHT = 0.2
        var BASE_DEPTH = BASE_WIDTH/2

        var STAND_HEIGHT = BASE_HEIGHT*15

        var BOARD_HEIGHT = BASE_WIDTH * 3/4
        var BOARD_DEPTH = BASE_WIDTH/20

        var hoop_color = new BABYLON.Color3(0.5,0.2,0.0)

        if(pedestal)
        {
            var frame_base = BABYLON.MeshBuilder.CreateBox("basket_frame_base", {width: BASE_WIDTH, height: BASE_HEIGHT, depth: BASE_DEPTH}, scene);
            frame_base.position = position;
            frame_base.rotation = rotation
            frame_base.material = new BABYLON.StandardMaterial(frame_base.name+"_material",scene);
            frame_base.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
            frame_base.physicsImpostor = new BABYLON.PhysicsImpostor(frame_base, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.2 }, scene);
    
            var frame_stand = BABYLON.MeshBuilder.CreateBox("basket_frame_stand", {width: BASE_WIDTH/12, height: STAND_HEIGHT, depth: BASE_WIDTH/12}, scene);
            frame_stand.position = new BABYLON.Vector3(0,STAND_HEIGHT/2 + BASE_HEIGHT/2,0);
            frame_stand.material = new BABYLON.StandardMaterial(frame_stand.name+"_material",scene);
            frame_stand.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
            frame_stand.physicsImpostor = new BABYLON.PhysicsImpostor(frame_stand, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.2 }, scene);
            frame_stand.parent = frame_base
        }

        var customPerFaceUV = [];
        for (var i = 0; i < 6; i++) {
            customPerFaceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }
        customPerFaceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);

        var basket_board = BABYLON.MeshBuilder.CreateBox("basket_board", {width: BOARD_HEIGHT, height: BOARD_HEIGHT, depth: BOARD_DEPTH, faceUV: customPerFaceUV}, scene);
        basket_board.position = new BABYLON.Vector3(0,STAND_HEIGHT/2 + BOARD_HEIGHT/2,0);
        if(!pedestal) 
        {
            basket_board.rotation = rotation
            basket_board.position = position
        }
        //basket_board.material = new BABYLON.StandardMaterial(basket_board.name+"_material",scene);
        //basket_board.material.diffuseColor = new BABYLON.Color3(1,1,1)


        basket_board.material = Materials.basketBackboardMaterial
        basket_board.physicsImpostor = new BABYLON.PhysicsImpostor(basket_board, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.2 }, scene);
        if(pedestal) basket_board.parent = frame_stand

        var diameter = 1.5;
        var hoop_depth = 0.1;
        var hoop_height = 0.2;
        var tessellation = 20;
        //var inner = BABYLON.Mesh.CreateCylinder("", hoop_height, diameter-hoop_depth, diameter-hoop_depth, tessellation, 1, scene);
        var inner = BABYLON.MeshBuilder.CreateCylinder("", {diameterTop: diameter-hoop_depth, diameterBottom: diameter-hoop_depth, 
            height:hoop_height, tessellation: tessellation, subdivisions: 1}, scene);

        //var outer = BABYLON.Mesh.CreateCylinder("", hoop_height, diameter, diameter, tessellation, 1, scene);
        var outer = BABYLON.MeshBuilder.CreateCylinder("", {diameterTop: diameter, diameterBottom: diameter, 
            height:hoop_height, tessellation: tessellation, subdivisions: 1}, scene);
        
        var hoop_inner = BABYLON.CSG.FromMesh(inner);
        var hoop_outer = BABYLON.CSG.FromMesh(outer);
        var subCSG = hoop_outer.subtract(hoop_inner);
        
        var hoop = subCSG.toMesh("hoop", new BABYLON.StandardMaterial("hoop_material"), scene);
        hoop.material.diffuseColor = new BABYLON.Color3(0.5,0.2,0.0)
        hoop.position = new BABYLON.Vector3(0, -BOARD_HEIGHT/4, -diameter/2);
        hoop.physicsImpostor = new BABYLON.PhysicsImpostor(hoop, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0.1, restitution: 0.2 }, scene);
        hoop.parent = basket_board

        var hoop_score_collider = BABYLON.MeshBuilder.CreateCylinder("hoop_score_collider", {diameterTop: diameter-diameter/2, diameterBottom: diameter-diameter/2, 
            height:hoop_height/2, subdivisions: 1}, scene);
        hoop_score_collider.parent = hoop
        hoop_score_collider.isVisible = Settings.debugPhysics
        
        //Add a score condition when the hoop collider is hit by a basketball
        var basketBallScore = function (object) {
            var basketBall = GameEngine.scene.getMeshByName("basketBall")
            if(!basketBall) return false
            
            //In order to score a point, the ball has to:
            //1) Intersect the collider
            //2) Be near the "center" of said collider
            //3) Not be picked up
            //4) Have a negative vertical speed
            if(object.intersectsMesh(basketBall, false) && 
            basketBall.physicsImpostor.getLinearVelocity().y<0 
            && Math.abs(basketBall.position.y-object.getAbsolutePosition().y)<hoop_height/4
            && !basketBall.metaData.picked
            )
            {
                LevelManager.currentLevel.score(object)
                return true;
            }
        }
        var despawnBasketWithoutPedestal = function (object) {
            //despawn it to avoid scoring other points
            try{
                Props.despawn(object.parent.parent)
            }catch(e){console.log}
        }
        var despawnBasketWithPedestal = function (object) {
            try{
                Props.despawn(object.parent.parent.parent.parent)
            }catch(e){}
        }
        var nothing = function(){}
        if(pedestal) Props.attachObserver(hoop_score_collider, basketBallScore, nothing)
        else Props.attachObserver(hoop_score_collider, basketBallScore, despawnBasketWithoutPedestal)

        scene.removeMesh(inner);
        scene.removeMesh(outer);

        if(pedestal)
        {
            GameEngine.addShadows(frame_base)
            return frame_base
        }
        else
        {
            GameEngine.addShadows(basket_board)
            return basket_board
        }
    }
    
    static table(scene, position, rotation)
    {
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()
        
        var TABLE_WIDTH = 1.5
        var TABLE_HEIGHT = 0.05
        var TABLE_DEPTH = 1

        var TABLE_LEG_HEIGHT = TABLE_HEIGHT*15

        var table_collider = Physics.createBoxCollider(scene, "table_collider", position, new BABYLON.Vector3(TABLE_WIDTH,TABLE_HEIGHT + TABLE_LEG_HEIGHT,TABLE_DEPTH*6/5), Settings.showBoundingBox);
        table_collider.material = Materials.colliderMaterial
        //table_collider.physicsImpostor = new BABYLON.PhysicsImpostor(table_collider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.1, restitution: 0.2 }, scene);
        Physics.createBoxImpostor(GameEngine.scene, table_collider, { mass: 1, friction: 0.1, restitution: 0.2 })
        
        var table = BABYLON.MeshBuilder.CreateBox("table", {width: TABLE_WIDTH, height: TABLE_HEIGHT, depth: TABLE_DEPTH}, scene);
        table.position = new BABYLON.Vector3(0, (TABLE_LEG_HEIGHT)/2, 0);
        //table.material = new BABYLON.StandardMaterial(table.name+"_material",scene);
        //table.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
        table.parent = table_collider

        var table_leg1 = BABYLON.MeshBuilder.CreateBox("table_leg1", {width: TABLE_WIDTH/8, height: TABLE_LEG_HEIGHT, depth: TABLE_DEPTH/8}, scene);
        table_leg1.position = new BABYLON.Vector3(-TABLE_WIDTH* 6/16, -TABLE_HEIGHT/2 -TABLE_LEG_HEIGHT/2, TABLE_DEPTH*6/16);
        //table_leg1.material = new BABYLON.StandardMaterial(table_leg1.name+"_material",scene);
        //table_leg1.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
        table_leg1.parent = table

        var table_leg2 = BABYLON.MeshBuilder.CreateBox("table_leg2", {width: TABLE_WIDTH/8, height: TABLE_LEG_HEIGHT, depth: TABLE_DEPTH/8}, scene);
        table_leg2.position = new BABYLON.Vector3(TABLE_WIDTH* 6/16, -TABLE_HEIGHT/2 -TABLE_LEG_HEIGHT/2, -TABLE_DEPTH*6/16);
        //table_leg2.material = new BABYLON.StandardMaterial(table_leg2.name+"_material",scene);
        //table_leg2.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
        table_leg2.parent = table

        var table_leg3 = BABYLON.MeshBuilder.CreateBox("table_leg3", {width: TABLE_WIDTH/8, height: TABLE_LEG_HEIGHT, depth: TABLE_DEPTH/8}, scene);
        table_leg3.position = new BABYLON.Vector3(-TABLE_WIDTH* 6/16, -TABLE_HEIGHT/2 -TABLE_LEG_HEIGHT/2, -TABLE_DEPTH*6/16);
        //table_leg3.material = new BABYLON.StandardMaterial(table_leg3.name+"_material",scene);
        //table_leg3.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
        table_leg3.parent = table

        var table_leg4 = BABYLON.MeshBuilder.CreateBox("table_leg4", {width: TABLE_WIDTH/8, height: TABLE_LEG_HEIGHT, depth: TABLE_DEPTH/8}, scene);
        table_leg4.position = new BABYLON.Vector3(TABLE_WIDTH* 6/16, -TABLE_HEIGHT/2 -TABLE_LEG_HEIGHT/2, TABLE_DEPTH*6/16);
        //table_leg4.material = new BABYLON.StandardMaterial(table_leg4.name+"_material",scene);
        //table_leg4.material.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5)
        table_leg4.parent = table

        table.material = Materials.metal1Material
        table_leg1.material = Materials.metal1Material
        table_leg2.material = Materials.metal1Material
        table_leg3.material = Materials.metal1Material
        table_leg4.material = Materials.metal1Material

        table.receiveShadows = true
        table_leg1.receiveShadows = true
        table_leg2.receiveShadows = true
        table_leg3.receiveShadows = true
        table_leg4.receiveShadows = true

        GameEngine.addShadows(table)
        GameEngine.addShadows(table_leg1)
        GameEngine.addShadows(table_leg2)
        GameEngine.addShadows(table_leg3)
        GameEngine.addShadows(table_leg4)

        return table_collider

    }

    //Shooting range target
    static target(scene, position, rotation, diameter)
    {
        var TARGET_DIAMETER;
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()
        if(!diameter) TARGET_DIAMETER = 1.5
        else TARGET_DIAMETER = diameter
        
        var TARGET_DEPTH = 0.05

        var name = chooseUniqueName(scene, "target")

        //var target_collider = BABYLON.MeshBuilder.CreateCylinder(name+"_collider", {diameterTop: TARGET_DIAMETER, diameterBottom: TARGET_DIAMETER, height: TARGET_DEPTH*16}, scene);
        var target_collider = BABYLON.MeshBuilder.CreateSphere(name+"_collider", {diameter: TARGET_DIAMETER}, scene);
        target_collider.position = position
        target_collider.rotation = rotation
        target_collider.material = Materials.colliderMaterial
        target_collider.isVisible = Settings.debugPhysics
        target_collider.physicsImpostor = new BABYLON.PhysicsImpostor(target_collider, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, friction: 0.1, restitution: 0.2 }, scene);

        /*var customPerFaceUV = [];
        for (var i = 0; i < 6; i++) {
            customPerFaceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }
        customPerFaceUV[1] = new BABYLON.Vector4(0, 0, 1, 1);

        var target = BABYLON.MeshBuilder.CreateCylinder(name, {diameterTop: TARGET_DIAMETER, diameterBottom: TARGET_DIAMETER, height: TARGET_DEPTH, faceUV: customPerFaceUV}, scene);*/
        
        var target = BABYLON.MeshBuilder.CreateCylinder(name, {diameterTop: TARGET_DIAMETER, diameterBottom: TARGET_DIAMETER, height: TARGET_DEPTH}, scene);
        target.position = new BABYLON.Vector3(0.0,-TARGET_DEPTH*4,0.0)
        var material_number = generateRandom(1,3,true)
        switch(material_number)
        {
            case 1: 
            {
                target.material = Materials.target1Material
                break;
            }
            case 2: 
            {
                target.material = Materials.target2Material
                break;
            }
            case 3: 
            {
                target.material = Materials.target3Material
                break;
            }
        }
        target.parent = target_collider

        target.receiveShadows = true

        GameEngine.addShadows(target)

        return target_collider
    }

    static pistol(scene, position, rotation)
    {  
        if(!position) position = BABYLON.Vector3.Zero()
        if(!rotation) rotation = BABYLON.Vector3.Zero()

        var FRAME_WIDTH = 0.04
        var FRAME_HEIGHT = 0.04
        var FRAME_DEPTH = 0.18

        var HANDLE_WIDTH = FRAME_WIDTH*5/6
        var HANDLE_HEIGHT = FRAME_DEPTH*2/3
        var HANDLE_DEPTH = FRAME_HEIGHT

        var HAMMER_WIDTH = FRAME_WIDTH/2
        var HAMMER_HEIGHT = FRAME_HEIGHT/2
        var HAMMER_DEPTH = FRAME_DEPTH/8

        var pistol_collider = Physics.createBoxCollider(scene, "pistol_collider", position, new BABYLON.Vector3(FRAME_WIDTH,FRAME_HEIGHT*3/2 + HANDLE_HEIGHT,FRAME_DEPTH*6/5), Settings.showBoundingBox);
        pistol_collider.material = Materials.colliderMaterial
        pistol_collider.rotation = rotation.clone()
        //pistol_collider.physicsImpostor = new BABYLON.PhysicsImpostor(pistol_collider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.1, friction: 0.1, restitution: 0.2 }, scene);
        Physics.createBoxImpostor(GameEngine.scene, pistol_collider, { mass: 0.1, friction: 0.1, restitution: 0.2 })

        var pistol_frame = BABYLON.MeshBuilder.CreateBox("pistol_frame", {width: FRAME_WIDTH, height: FRAME_HEIGHT, depth: FRAME_DEPTH}, scene);
        pistol_frame.position = new BABYLON.Vector3(0,(FRAME_HEIGHT+HANDLE_HEIGHT)/4,0);
        pistol_frame.material = new BABYLON.StandardMaterial(pistol_frame.name+"_material",scene);
        pistol_frame.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.8)
        pistol_frame.material.specularColor = new BABYLON.Color3(1,1,1)
        pistol_frame.parent = pistol_collider

        var pistol_slider1 = BABYLON.MeshBuilder.CreateCylinder("pistol_slider1", {diameterTop: FRAME_WIDTH, diameterBottom: FRAME_WIDTH, height: FRAME_DEPTH*7/8, arc: 0.5}, scene);
        pistol_slider1.position = new BABYLON.Vector3(0,FRAME_HEIGHT/2,FRAME_DEPTH/16);
        pistol_slider1.rotation = new BABYLON.Vector3(toRadians(90),0,0);
        pistol_slider1.material = new BABYLON.StandardMaterial(pistol_slider1.name+"_material",scene);
        pistol_slider1.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.8)
        pistol_slider1.material.specularColor = new BABYLON.Color3(1,1,1)
        pistol_slider1.parent = pistol_frame

        var pistol_slider2 = BABYLON.MeshBuilder.CreateCylinder("pistol_slider2", {diameterTop: FRAME_WIDTH, diameterBottom: FRAME_WIDTH*2/3, height: FRAME_DEPTH/8, arc: 0.5}, scene);
        pistol_slider2.position = new BABYLON.Vector3(0,FRAME_HEIGHT/2,-FRAME_DEPTH/2.3);
        pistol_slider2.rotation = new BABYLON.Vector3(toRadians(90),0,0);
        pistol_slider2.material = new BABYLON.StandardMaterial(pistol_slider2.name+"_material",scene);
        pistol_slider2.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.8)
        pistol_slider2.material.specularColor = new BABYLON.Color3(1,1,1)
        pistol_slider2.parent = pistol_frame
        
        var pistol_muzzle = BABYLON.MeshBuilder.CreateCylinder("pistol_muzzle", {diameterTop: FRAME_WIDTH/2, diameterBottom: FRAME_WIDTH/2, height: FRAME_DEPTH/8}, scene);
        pistol_muzzle.position = new BABYLON.Vector3(0,0,FRAME_DEPTH/2);
        pistol_muzzle.rotation = new BABYLON.Vector3(toRadians(90),0,0);
        pistol_muzzle.material = new BABYLON.StandardMaterial(pistol_muzzle.name+"_material",scene);
        pistol_muzzle.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.8)
        pistol_muzzle.material.specularColor = new BABYLON.Color3(1,1,1)
        pistol_muzzle.parent = pistol_frame

        var pistol_handle = BABYLON.MeshBuilder.CreateBox("pistol_handle", {width: HANDLE_WIDTH, height: HANDLE_HEIGHT, depth: HANDLE_DEPTH}, scene);
        pistol_handle.rotation = new BABYLON.Vector3(toRadians(15),0,0);
        pistol_handle.position = new BABYLON.Vector3(0,-FRAME_HEIGHT/2 - HANDLE_HEIGHT/3,-FRAME_DEPTH/2.5);
        pistol_handle.material = new BABYLON.StandardMaterial(pistol_handle.name+"_material",scene);
        pistol_handle.material.diffuseColor = new BABYLON.Color3(0.2,0.2,0.2)
        pistol_handle.parent = pistol_frame
        
        var pistol_sight = BABYLON.MeshBuilder.CreateBox("pistol_sight", {width: FRAME_WIDTH/4, height: FRAME_HEIGHT/3, depth: FRAME_DEPTH/10}, scene);
        pistol_sight.position = new BABYLON.Vector3(0,FRAME_DEPTH * 4/10,-FRAME_HEIGHT/2 -FRAME_HEIGHT/14);
        pistol_sight.material = new BABYLON.StandardMaterial(pistol_sight.name+"_material",scene);
        pistol_sight.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.8)
        pistol_sight.material.specularColor = new BABYLON.Color3(1,1,1)
        pistol_sight.parent = pistol_slider1

        var pistol_hammer = BABYLON.MeshBuilder.CreateBox("pistol_hammer", {width: FRAME_WIDTH/4, height: FRAME_HEIGHT/3, depth: FRAME_DEPTH/9}, scene);
        pistol_hammer.position = new BABYLON.Vector3(0,FRAME_HEIGHT*5/6,-FRAME_DEPTH/2.3);
        pistol_hammer.rotation = new BABYLON.Vector3(toRadians(15),0,0);
        pistol_hammer.material = new BABYLON.StandardMaterial(pistol_hammer.name+"_material",scene);
        pistol_hammer.material.diffuseColor = new BABYLON.Color3(0.8,0.8,0.8)
        pistol_hammer.material.specularColor = new BABYLON.Color3(1,1,1)
        pistol_hammer.parent = pistol_frame

        
        var trigger_guard_color = new BABYLON.Color3(0.8,0.8,0.8)
        var diameter = FRAME_WIDTH;
        var trigger_guard_depth = 0.005;
        var trigger_guard_height = FRAME_WIDTH/4;
        var tessellation = 20;
        //var inner = BABYLON.Mesh.CreateCylinder("", trigger_guard_height, diameter-trigger_guard_depth, diameter-trigger_guard_depth, tessellation, 1, scene);
        var inner = BABYLON.MeshBuilder.CreateCylinder("", {diameterTop: diameter-trigger_guard_depth, diameterBottom: diameter-trigger_guard_depth, 
            height:trigger_guard_height, tessellation: tessellation, subdivisions: 1, arc: 0.6}, scene);

        //var outer = BABYLON.Mesh.CreateCylinder("", trigger_guard_height, diameter, diameter, tessellation, 1, scene);
        var outer = BABYLON.MeshBuilder.CreateCylinder("", {diameterTop: diameter, diameterBottom: diameter, 
            height:trigger_guard_height, tessellation: tessellation, subdivisions: 1, arc: 0.6}, scene);
        
        var trigger_guard_inner = BABYLON.CSG.FromMesh(inner);
        var trigger_guard_outer = BABYLON.CSG.FromMesh(outer);
        var subCSG = trigger_guard_outer.subtract(trigger_guard_inner);
        
        scene.removeMesh(inner);
        scene.removeMesh(outer);

        var trigger_guard = subCSG.toMesh("trigger_guard", new BABYLON.StandardMaterial("trigger_guard_material"), scene);
        trigger_guard.material.diffuseColor = trigger_guard_color
        trigger_guard.material.specularColor = new BABYLON.Color3(1,1,1)
        trigger_guard.rotation = new BABYLON.Vector3(toRadians(-30), toRadians(180), toRadians(90));
        trigger_guard.position = new BABYLON.Vector3(0, -FRAME_HEIGHT/2 - diameter/3, -diameter*5/6);
        trigger_guard.parent = pistol_frame

        var trigger = subCSG.toMesh("trigger", new BABYLON.StandardMaterial("trigger_material"), scene);
        trigger.material.diffuseColor = trigger_guard_color
        trigger.material.specularColor = new BABYLON.Color3(1,1,1)
        trigger.rotation = new BABYLON.Vector3(toRadians(-190), toRadians(180), toRadians(90));
        trigger.position = new BABYLON.Vector3(0, -FRAME_HEIGHT/1.9, -diameter*2/3);
        trigger.parent = pistol_frame

        //Pistol parts metaData, to determine whats pickable and what is not
        pistol_collider.metaData = {
            highlighted: false, picked: false, pickable: true, shooter:true, projectile: Props.defaultProjectile, 
            originalMass: 0.5, originalPosition: pistol_collider.position, originalRotationQuaternion: pistol_collider.rotationQuaternion,
            originalMaterial: pistol_collider.material
        }
        pistol_frame.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_frame.position, originalRotationQuaternion: pistol_frame.rotationQuaternion,
            originalMaterial: pistol_frame.material
        }
        pistol_handle.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_handle.position, originalRotationQuaternion: pistol_handle.rotationQuaternion,
            originalMaterial: pistol_handle.material
        }
        pistol_hammer.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_hammer.position, originalRotationQuaternion: pistol_hammer.rotationQuaternion,
            originalMaterial: pistol_hammer.material
        }
        pistol_slider1.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_slider1.position, originalRotationQuaternion: pistol_slider1.rotationQuaternion,
            originalMaterial: pistol_slider1.material
        }
        pistol_slider2.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_slider2.position, originalRotationQuaternion: pistol_slider2.rotationQuaternion,
            originalMaterial: pistol_slider2.material
        }
        pistol_muzzle.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_muzzle.position, originalRotationQuaternion: pistol_muzzle.rotationQuaternion,
            originalMaterial: pistol_muzzle.material
        }
        pistol_sight.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: pistol_sight.position, originalRotationQuaternion: pistol_sight.rotationQuaternion,
            originalMaterial: pistol_sight.material
        }
        trigger_guard.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: trigger_guard.position, originalRotationQuaternion: trigger_guard.rotationQuaternion,
            originalMaterial: trigger_guard.material
        }
        trigger.metaData = {
            highlighted: false, picked: false, pickable: false, 
            originalMass: 0.5, originalPosition: trigger.position, originalRotationQuaternion: trigger.rotationQuaternion,
            originalMaterial: trigger.material
        }


        //Add a respawn condition when the object falls off the platform
        var fallRespawnCondition = function (object) {
            return object.position.y < Settings.minDespawnHeight
        }
        Props.attachObserver(pistol_collider, fallRespawnCondition, Props.respawn)


        GameEngine.addShadows(pistol_frame)
        return pistol_collider  
    }

    //This function allows picking up/dropping an object and "attaches" it to the camera, so that its position
    //and rotation are updated according to the camera position/rotation (or detaches it if it was already picked up)
    static togglePickObject(scene, object, launchForce)
    {
        var pickedObjectOffsetFromCamera;
        try{
            if(object.metaData.shooter) pickedObjectOffsetFromCamera = new BABYLON.Vector3(0.3,-0.2,1.0)
            else pickedObjectOffsetFromCamera = new BABYLON.Vector3(0.0,0.0,3.0)
        }catch(e){
            //console.log(e)
            pickedObjectOffsetFromCamera = new BABYLON.Vector3(0.0,0.0,3.0)
        }
        
        try{
            if(object.metaData.pickable)
            {
                if(!object.metaData.picked)
                {
                    if(GUI.getHelper().isVisible) GUI.getHelper().hide()
                    if(Settings.debugPicking) console.log("Pick up")
                    object.metaData.picked = true
                    if(Settings.debugPicking) object.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
                    Player.pickedObject = object;
                    object.metaData.objectPositionObserver = scene.onBeforeRenderObservable.add((evt)=>{
                        object.position = BABYLON.Vector3.TransformCoordinates(pickedObjectOffsetFromCamera, GameEngine.activeCamera.computeWorldMatrix())
                        BABYLON.Quaternion.FromEulerVectorToRef(Player.cameraRotation, object.rotationQuaternion)
                        object.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion.Zero())
                    });
                                
                                
                }
                else
                {
                    object.metaData.picked = false
                    if(Settings.debugPicking) object.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                    if(object.metaData.objectPositionObserver) scene.onBeforeRenderObservable.remove(object.metaData.objectPositionObserver)

                    if(Settings.debugHighlight) console.log("Drop")
                    if(launchForce) 
                    {
                        var direction = GameEngine.activeCamera.getTarget().subtract(GameEngine.activeCamera.position)
                        direction = direction.multiply(new BABYLON.Vector3(launchForce,launchForce,launchForce))
                        object.physicsImpostor.setLinearVelocity(direction)
                    }
                    else object.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero())

                    Props.disablePickableHighlight(object)
                    Player.pickedObject = undefined;
                }
            }
        }
        catch(e){
            //console.log(e)
        }
    }

    //Enable/Disable an object highlight
    static enablePickableHighlight(object)
    {
        if(object.metaData.highlighted!=undefined && !object.metaData.highlighted)
        {
            if(Settings.debugHighlight) console.log("Adding highlight")
            Props.getPickableHighlight().addMesh(object, new BABYLON.Color3(1,1,1), false);
            object.metaData.highlighted = true
            if(Settings.debugHighlight) console.log("Added mesh: "+object.name)
            for(var child of object.getChildren())
            {
                Props.enablePickableHighlight(child)
            }
        }
    }
    static disablePickableHighlight(object)
    {
        if(object.metaData.highlighted)
        {
            if(Settings.debugHighlight) console.log("Removing highlight")
            object.metaData.highlighted = false 
            Props.getPickableHighlight().removeMesh(object);
            if(Settings.debugHighlight) console.log("Removed mesh: "+object.name)
            for(var child of object.getChildren())
            {
                Props.disablePickableHighlight(child)
            }
        }
    }

    //Respawn an object
    static respawn(object)
    {
        if(!object.metaData || !object.metaData.originalMass || !object.metaData.originalMaterial 
            || !object.metaData.originalPosition || !object.metaData.originalRotationQuaternion) throw "Not enough information about object initial state to respaw"
        
        object.position = object.metaData.originalPosition
        object.rotationQuaternion = object.metaData.originalRotationQuaternion
        object.material = object.metaData.originalMaterial
        object.physicsImpostor.mass = object.metaData.originalMass
        object.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero())
        object.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero())
        if(Settings.debugLevels) console.log(object.name + " respawned")  
        
        GameEngine.removeShadows(object)
        GameEngine.addShadows(object)
    }

    //Despawn an object
    static despawn(object)
    {
        Props.detachObservers(object)
        object.dispose()
        if(Settings.debugLevels) console.log(object.name + " despawned")          
    }
}
