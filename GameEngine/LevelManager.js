//This class holds the level creation functions and the level changing mechanism.
//After a first "round" where all levels are shown in their basic form, it loads a sequence
//of randomly chosen levels that are theirselves randomized (in a way that is defined by the level itself).
//This system is built to add levels modularly. 
class LevelManager {
    //Level 0 is the Menu
    static currentLevelNumber = 0;
    static currentLevel;
    static levels;
    //During the first round levels are not randomized
    static firstRound = true;
    static randomization = false;

    //Loads/sets elements that are common to all levels
    static loadDefaultElements() {
        Materials.initMaterials(GameEngine.scene)
        GameEngine.scene.ambientColor = new BABYLON.Color3(.2, .2, .2);
        Props.skyBox(GameEngine.scene)
        Props.sun(GameEngine.scene)
    }
    
    //Loads the level that is used as a background for the menu
    static MenuBackGroundLevel(randomize) {
        //If this is the first loaded level, load the default elements

        var levelObjects = []
        //Player.spawn(GameEngine.scene, new BABYLON.Vector3(0,0,0), true)
        //levelObjects.push(Props.standardLevelPlatform(GameEngine.scene, 10, 10, new BABYLON.Color3(0.5,0.5,0.5)))
        levelObjects.push(Props.standardLevelCircularPlatform(GameEngine.scene, 10, new BABYLON.Color3(0.7,0.7,0.7)))
        //levelObjects.push(Props.pickableSphere(GameEngine.scene, new BABYLON.Vector3(0,1,1)))
        levelObjects.push(Props.basket(GameEngine.scene, new BABYLON.Vector3(0,0.5,-3.5), new BABYLON.Vector3(0, toRadians(180), 0), true))

        levelObjects.push(Props.basketBall(GameEngine.scene, new BABYLON.Vector3(0,4,0)))
        GameEngine.setCameraMode(CameraMode.MENU_CAMERA)

        //Player.despawn()

        return {name: "testLevel", levelObjects: levelObjects}
    }

    //Loads the test level
    static loadTestLevel(randomize) {
        //If this is the first loaded level, load the default elements

        var levelObjects = []
        Player.spawn(GameEngine.scene, new BABYLON.Vector3(0,1,0), new BABYLON.Vector3(0, toRadians(180), 0), true)
        levelObjects.push(Props.standardLevelPlatform(GameEngine.scene, 40, 100))
        levelObjects.push(Props.table(GameEngine.scene, new BABYLON.Vector3(0.0,1.7,-2.0), new BABYLON.Vector3(0, 0, 0)))
        levelObjects.push(Props.pistol(GameEngine.scene, new BABYLON.Vector3(0.0,3,-2.0), new BABYLON.Vector3(0, toRadians(-90), toRadians(90))))
        levelObjects.push(Props.target(GameEngine.scene, new BABYLON.Vector3(0.0,3,-10.0), new BABYLON.Vector3(toRadians(90), 0, 0)))

        //Player.despawn()

        return {name: "testLevel", levelObjects: levelObjects}
    }

    //Loads the shooting range level. Its randomization consists in the number, position, size and texture of the targets,
    //all disposed radially around the level platform
    static shootingRangeLevel(randomize) {
        
        var PLATFORM_DIAMETER = 20

        var scoreObjective;
        var targetsAtSameTime;
        if(randomize) 
        {
            targetsAtSameTime = generateRandom(2,5,true)
            scoreObjective = generateRandom(2,15,true)
        }
        else
        {
            targetsAtSameTime = 2
            scoreObjective = 2
        }
        var levelObjects = []
        Player.spawn(GameEngine.scene, new BABYLON.Vector3(0,1.5,0), new BABYLON.Vector3(0, toRadians(180), 0), true)
        //levelObjects.push(Props.standardLevelPlatform(GameEngine.scene, PLATFORM_SIZE_X, PLATFORM_SIZE_Z, new BABYLON.Color3(0.3,0.3,0.3)))
        levelObjects.push(Props.standardLevelCircularPlatform(GameEngine.scene, PLATFORM_DIAMETER, new BABYLON.Color3(0.5,0.5,0.5), Materials.metalDiamondPlate))
        levelObjects.push(Props.table(GameEngine.scene, new BABYLON.Vector3(0.0,1.7,-2.0), new BABYLON.Vector3(0, 0, 0)))
        levelObjects.push(Props.pistol(GameEngine.scene, new BABYLON.Vector3(0.0,3,-2.0), new BABYLON.Vector3(0, toRadians(-90), toRadians(90))))

        var level = {name: "shootingRangeLevel", levelObjects: levelObjects, scoredPoints: 0, scoreObjective:scoreObjective, completed: false, currentTargets: [], targetsAtSameTime: targetsAtSameTime}

        level.sounds = {}
        level.sounds.gunshot = new BABYLON.Sound("gunshot", "Sounds/gunshot.wav", GameEngine.scene,null,{volume: 0.3});
        level.sounds.point = new BABYLON.Sound("point", "Sounds/point.wav", GameEngine.scene);
        level.sounds.victory = new BABYLON.Sound("victory", "Sounds/victory.wav", GameEngine.scene);

        level.scorePoint = function() {
            level.scoredPoints += 1
            GUI.getScoreOverlay().setValue(level.scoredPoints)
            if(level.scoredPoints >= scoreObjective && !level.completed)
            {
                level.completed = true
                level.sounds.victory.play()
                GUI.getScoreOverlay().hide()
                GameEngine.levelVictory()
            }
            else
            {
                level.sounds.point.play()
            }
        }

        level.randomizedTarget = function(size, distance) {
            var diameter = 2;
            if(size)
            {
                diameter = generateRandom(2,3)
            }

            var distance;
            if(distance)
            {
                distance = generateRandom(PLATFORM_DIAMETER/2,PLATFORM_DIAMETER*2)
            }
            else distance = PLATFORM_DIAMETER

            var randomPosition;
            var done = false;
            var angle;
            while(!done)
            {
                angle = generateRandom(-45,-135)
                var posX = Math.cos(toRadians(angle)) * distance
                var posZ = Math.sin(toRadians(angle)) * distance
                randomPosition = new BABYLON.Vector3(posX, generateRandom(0.75,3), posZ)
                //console.log(randomPosition)
                done = true;
                for(var target of level.currentTargets)
                {
                    if(BABYLON.Vector3.Distance(randomPosition,target.position) < diameter) 
                    {
                        done = false
                        break;
                    }
                }
            }

            return Props.target(GameEngine.scene, randomPosition, new BABYLON.Vector3(toRadians(90), toRadians(90-angle), 0), diameter)
        }

        level.nextTarget = function(ignoreScoreLimit) {

            //Do not spawn more targets than required to finish the level
            if(level.currentTargets.length >= level.scoreObjective && !ignoreScoreLimit) return
            
            var target;
            if(randomize)
            {
                //Randomize target position, size, distance
                target = level.randomizedTarget(true,true,true)
            }
            else
            {
                //Fixed target size and distance, randomize position
                target = level.randomizedTarget()
            }
            level.currentTargets.push(target)
            level.levelObjects.push(target)
            return target
        }

        //Spawn the first targets
        for(var i=0; i<targetsAtSameTime; i+=1)
        {
            levelObjects.push(level.nextTarget(true))
        }

        GUI.getScoreOverlay("Targets hit: ",level.scoreObjective).setValue(0)
        
        if(!LevelManager.randomization) GUI.getHelper("To pick up the pistol, look at it and press F when you see the highlight. The press LeftMouse to shoot.")

        return level
    }

    //Basketball level. The basic form features a simple basket. The randomized version places
    //baskets radially around the level platform, at random positions/heights
    static basketballLevel(randomize) {

        //var PLATFORM_SIZE_X = 20
        //var PLATFORM_SIZE_Z = 20
        var PLATFORM_DIAMETER = 20

        var levelMode;
        if(randomize) levelMode = generateRandom(0,4, true)
        else levelMode = 0

        var scoreObjective;
        var numBaskets;
        if(levelMode > 0) 
        {
            scoreObjective = generateRandom(2,5, true)
            numBaskets = scoreObjective
        }
        else 
        {
            numBaskets = 1
            scoreObjective = 1
        }

        var level = {name: "basketballLevel", levelObjects: [], scoredPoints: 0, completed: false, baskets: [], scoreObjective: scoreObjective, scored:[]}

        level.sounds = {}
        level.sounds.ballBounce1 = new BABYLON.Sound("gunshot", "Sounds/ballBounce1.wav", GameEngine.scene, null, {volume: 0.7, spatialSound: true, maxDistance: 10});
        level.sounds.point = new BABYLON.Sound("point", "Sounds/point.wav", GameEngine.scene);
        level.sounds.victory = new BABYLON.Sound("victory", "Sounds/victory.wav", GameEngine.scene);

        level.generateRandomBasket = function() {
            var minDistanceBetweenBaskets = 4
            var randomPosition;
            var done = false;

            var angle = 270;
            if(levelMode==0) randomPosition = new BABYLON.Vector3(0.0,0.5,-8.0)
            else
            {
                while(!done)
                {
                    angle = generateRandom(0,-180)
                    var posX = Math.cos(toRadians(angle)) * PLATFORM_DIAMETER/2
                    var posZ = Math.sin(toRadians(angle)) * PLATFORM_DIAMETER/2
                    randomPosition = new BABYLON.Vector3(posX, generateRandom(4,6), posZ)
                    done = true;
                    for(var basket of level.baskets)
                    {
                        if(BABYLON.Vector3.Distance(randomPosition,basket.position) < minDistanceBetweenBaskets) 
                        {
                            done = false
                            break;
                        }
                    }
                }

            }

            if(!LevelManager.randomization) GUI.getHelper("To pick up the ball, look at it and press F when you see the highlight.\nTo charge the launch, keep LeftMouse pressed, then release it to launch.")
            
            return Props.basket(GameEngine.scene, randomPosition, new BABYLON.Vector3(0, toRadians(90-angle), 0), levelMode==0)
        }

        Player.spawn(GameEngine.scene, new BABYLON.Vector3(0,1,8), new BABYLON.Vector3(0, toRadians(180), 0), true)
        level.levelObjects.push(Props.standardLevelCircularPlatform(GameEngine.scene, PLATFORM_DIAMETER, new BABYLON.Color3(0.5,0.5,0.5), Materials.woodFloorMaterial))
        //level.levelObjects.push(Props.standardLevelPlatform(GameEngine.scene, PLATFORM_SIZE_X, PLATFORM_SIZE_Z, undefined, Materials.woodFloorMaterial(GameEngine.scene, "basket_platform_material")))
        for(var i=0; i<numBaskets; i+=1)
        {
            var basket = level.generateRandomBasket()
            level.levelObjects.push(basket)
            level.baskets.push(basket)
        }
        level.levelObjects.push(Props.basketBall(GameEngine.scene, new BABYLON.Vector3(0,2,5), undefined, undefined, true))

        level.score = function(basket) {
            for(var scored of level.scored)
            {
                if(scored==basket.uniqueId) return
            }
            level.scored.push(basket.uniqueId)
            level.scoredPoints += 1
            GUI.getScoreOverlay().setValue(level.scoredPoints)
            if(level.scoredPoints >= level.scoreObjective && !level.completed)
            {
                level.completed = true
                level.sounds.victory.play()
                GUI.getScoreOverlay().hide()
                GameEngine.levelVictory()
            }
            else
            {
                level.sounds.point.play()
            }
        }

        GUI.getScoreOverlay("Points scored: ",level.scoreObjective).setValue(0)

        return level
    }

    //Initialize the level list
    static initializeLevels(scene) {
        LevelManager.loadDefaultElements()
        if(Settings.testLevel) LevelManager.levels = [LevelManager.loadTestLevel]
        else LevelManager.levels = [LevelManager.shootingRangeLevel,LevelManager.basketballLevel]
        //else LevelManager.levels = [LevelManager.basketballLevel]
        //else LevelManager.levels = [LevelManager.shootingRangeLevel]
    }

    //Load the level that acts as a background to the main menu
    static loadMenuLevel(scene)
    {
        LevelManager.initializeLevels(scene)
        LevelManager.currentLevel = LevelManager.MenuBackGroundLevel()
        LevelManager.currentLevelNumber = -1
    }

    //NOT USED - Load a level
    static loadLevel(levelNumber, scene) {

        console.log("HI")
        if(LevelManager.levels == undefined) 
        {
        }
        if(levelNumber>LevelManager.levels.length || levelNumber<0) {throw "Level "+levelNumber+" doesn't exist!"}
        
        LevelManager.currentLevel = LevelManager.levels[levelNumber](LevelManager.randomization)
        LevelManager.currentLevelNumber = levelNumber
    }
    
    //Load the next level (after loading all the levels on a list it chooses the following ones randomly
    //and randomizes them)
    static nextLevel(scene) {

        if(LevelManager.levels == undefined) 
        {
            LevelManager.loadMenuLevel(scene)
            LevelManager.currentLevelNumber += 1
        }
        else 
        {
            LevelManager.destroyLevel(LevelManager.currentLevel)
            
            var levelNumber;
            if(LevelManager.randomization)
            {
                LevelManager.currentLevelNumber = LevelManager.randomLevel(false)
                LevelManager.currentLevel = LevelManager.levels[LevelManager.currentLevelNumber](true)
            }
            else
            {
                LevelManager.currentLevel = LevelManager.levels[LevelManager.currentLevelNumber](false)
                if(LevelManager.currentLevelNumber==LevelManager.levels.length-1) LevelManager.randomization = true
                if(LevelManager.currentLevelNumber<LevelManager.levels.length-1) LevelManager.currentLevelNumber +=1
            }
            
        }
    }

    static testingLevel(scene) {
        LevelManager.loadLevel(0, scene)
    }

    //Despawn all objects of a level
    static destroyLevel() {
        if(Player.instance) Player.despawn()
        for(var object of LevelManager.currentLevel.levelObjects)
        {
            Props.despawn(object)
        }
    }

    //Choose a random level
    static randomLevel(includeCurrentLevel) {
        var random;
        var found = false
        while(!found)
        {
            random = generateRandom(0,LevelManager.levels.length-1,true)
            if((!includeCurrentLevel && random != LevelManager.currentLevelNumber) || includeCurrentLevel || LevelManager.levels.length == 1) found = true
        }
        return random;
    }

}
