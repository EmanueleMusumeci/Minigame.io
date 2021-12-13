//Creates the player hierarchical model, sets its materials, sets its parts as shadow casters
//and saves initial geometric information in its metaData
function createPlayerModel(scene, dimensions, position, rotation, playerColliderWidthFraction, playerColliderHeightFraction) {
    
    var BODY_WIDTH = dimensions.x
    var BODY_HEIGHT = dimensions.y
    var BODY_DEPTH = dimensions.z

    // Our built-in 'sphere' shape.
    var HEAD_HEIGHT = 0.3
    var NECK_HEIGTH = 0.07

    var UPPER_CHEST_HEIGHT = BODY_HEIGHT/3 * 3/7
    var UPPER_CHEST_WIDTH = 0.48
    var UPPER_CHEST_DEPTH = 0.3
    var LOWER_CHEST_HEIGHT = BODY_HEIGHT/3 * 4/7
    var LOWER_CHEST_WIDTH = 0.4
    var LOWER_CHEST_DEPTH = 0.2

    var LEG_LENGTH = BODY_HEIGHT/1.5
    var LEG_WIDTH = UPPER_CHEST_WIDTH/2.8

    var HIP_HEIGHT = LEG_LENGTH/4

    var ARM_WIDTH = 0.2
    var ARM_LENGTH = UPPER_CHEST_HEIGHT+LOWER_CHEST_HEIGHT+HIP_HEIGHT
    var SHOULDER_JOINT_HEIGHT = ARM_LENGTH/6
    //var SHOULDER_JOINT_HEIGHT = ARM_LENGTH/8
    var SHOULDER_JOINT_WIDTH = SHOULDER_JOINT_DEPTH = ARM_WIDTH

    var playerCollider = Physics.createBoxCollider(scene, "player_collider", new BABYLON.Vector3(0,BODY_HEIGHT * playerColliderHeightFraction/2,0), new BABYLON.Vector3(BODY_WIDTH*playerColliderWidthFraction, BODY_HEIGHT * playerColliderHeightFraction, BODY_DEPTH), Settings.showBoundingBox);
    playerCollider.material = Materials.colliderMaterial
    playerCollider.rotation = rotation.clone()
    playerCollider.position = playerCollider.position.add(position)

    var hip = BABYLON.MeshBuilder.CreateSphere("player_hip_joint", {segments: 32, diameterX: UPPER_CHEST_WIDTH/2, diameterY: UPPER_CHEST_HEIGHT/1.5, diameterZ: LOWER_CHEST_DEPTH }, scene);
    hip.parent = playerCollider    
    hip.position.y = BODY_HEIGHT * 15/32
    hip.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)
    //hip.rotate(BABYLON.Axis.Y, toRadians(180), BABYLON.Space.LOCAL)

    var lower_chest = BABYLON.MeshBuilder.CreateSphere("player_lower_chest_joint", {segments: 32, diameterX: LOWER_CHEST_WIDTH, diameterY: LOWER_CHEST_HEIGHT*2, diameterZ: 0.29, slice: 0.5 }, scene);
    lower_chest.parent = hip
    lower_chest.position = new BABYLON.Vector3(0,LOWER_CHEST_HEIGHT/2 + HIP_HEIGHT/2,0)
    lower_chest.rotate(BABYLON.Axis.Z, Math.PI, BABYLON.Space.LOCAL)

    var upper_chest = BABYLON.MeshBuilder.CreateSphere("player_upper_chest_joint", {segments: 32, diameterX: UPPER_CHEST_WIDTH, diameterY: UPPER_CHEST_HEIGHT, diameterZ: UPPER_CHEST_DEPTH = 0.3 }, scene);
    upper_chest.parent = lower_chest
    upper_chest.position = new BABYLON.Vector3(0,-UPPER_CHEST_HEIGHT/7,0)
    upper_chest.rotate(BABYLON.Axis.Z, Math.PI, BABYLON.Space.LOCAL)
    
    /*
    var lower_chest = BABYLON.MeshBuilder.CreateBox("player_lower_chest", {segments: 32, width: LOWER_CHEST_WIDTH, height: LOWER_CHEST_HEIGHT, depth: LOWER_CHEST_DEPTH }, scene);
    lower_chest.parent = upper_chest
    lower_chest.position = new BABYLON.Vector3(0,-UPPER_CHEST_HEIGHT/2-LOWER_CHEST_HEIGHT/5,0)
    */

    var neck_joint = BABYLON.MeshBuilder.CreateSphere("player_neck_joint", {segments: 32, diameterX: 0.08, diameterY: NECK_HEIGTH, diameterZ: 0.08 }, scene);
    neck_joint.parent = upper_chest
    neck_joint.position = new BABYLON.Vector3(0,UPPER_CHEST_HEIGHT/2.2+NECK_HEIGTH/3,0)
    neck_joint.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    var head = BABYLON.MeshBuilder.CreateSphere("player_head", {segments: 32, diameterX: 0.2, diameterY: HEAD_HEIGHT, diameterZ: 0.16 }, scene);
    head.parent = neck_joint
    head.position = new BABYLON.Vector3(0,NECK_HEIGTH/1.8+HEAD_HEIGHT/3,0)
    head.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    /*right ARM*/
    var right_shoulder = BABYLON.MeshBuilder.CreateSphere("player_right_shoulder_joint", {segments: 32, diameterX: SHOULDER_JOINT_WIDTH, diameterY: SHOULDER_JOINT_HEIGHT, diameterZ: SHOULDER_JOINT_DEPTH }, scene);
    right_shoulder.parent = upper_chest
    right_shoulder.position = new BABYLON.Vector3(UPPER_CHEST_WIDTH/2.4,UPPER_CHEST_HEIGHT/12,UPPER_CHEST_DEPTH/22)
    right_shoulder.rotate(BABYLON.Axis.Z, toRadians(25), BABYLON.Space.LOCAL)
    
    var right_arm = BABYLON.MeshBuilder.CreateSphere("player_right_arm", {segments: 32, diameterX: ARM_WIDTH/1.5, diameterY: ARM_LENGTH/3, diameterZ: ARM_WIDTH/1.3 }, scene);
    right_arm.parent = right_shoulder
    right_arm.position = new BABYLON.Vector3(ARM_WIDTH/6,-ARM_LENGTH/8,0)
    right_arm.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    var right_elbow = BABYLON.MeshBuilder.CreateSphere("player_right_elbow_joint", {segments: 32, diameterX: ARM_LENGTH/12, diameterY: ARM_LENGTH/12, diameterZ: ARM_LENGTH/14 }, scene);
    right_elbow.parent = right_arm
    right_elbow.position = new BABYLON.Vector3(0,-ARM_LENGTH/7,0)
    right_elbow.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    right_elbow.rotate(BABYLON.Axis.X, toRadians(-15), BABYLON.Space.LOCAL)
    
    var right_forearm = BABYLON.MeshBuilder.CreateSphere("player_right_forearm", {segments: 32, diameterX: ARM_WIDTH/1.8, diameterY: ARM_LENGTH/4, diameterZ: ARM_WIDTH/1.8 }, scene);
    right_forearm.parent = right_elbow
    right_forearm.position = new BABYLON.Vector3(0,-ARM_LENGTH/8,0)
    right_forearm.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    var right_wrist = BABYLON.MeshBuilder.CreateSphere("player_right_wrist_joint", {segments: 32, diameterX: ARM_LENGTH/16, diameterY: ARM_LENGTH/12, diameterZ: ARM_LENGTH/20 }, scene);
    right_wrist.parent = right_forearm
    right_wrist.position = new BABYLON.Vector3(0,-ARM_LENGTH/8,0)
    //right_wrist.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    right_wrist.rotate(BABYLON.Axis.Y, toRadians(-120), BABYLON.Space.LOCAL)
    //right_wrist.rotate(BABYLON.Axis.X, toRadians(15), BABYLON.Space.LOCAL)

    var right_hand = BABYLON.MeshBuilder.CreateSphere("player_right_hand", {segments: 32, diameterX: ARM_LENGTH/12, diameterY: ARM_LENGTH/6, diameterZ: ARM_LENGTH/16 }, scene);
    right_hand.parent = right_wrist
    right_hand.position = new BABYLON.Vector3(0,-ARM_LENGTH/12,0)
    //right_hand.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    //right_hand.rotate(BABYLON.Axis.Y, toRadians(-120), BABYLON.Space.LOCAL)
    //right_hand.rotate(BABYLON.Axis.X, toRadians(15), BABYLON.Space.LOCAL)
    right_hand.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    /*left ARM*/
    var left_shoulder = BABYLON.MeshBuilder.CreateSphere("player_left_shoulder_joint", {segments: 32, diameterX: SHOULDER_JOINT_WIDTH, diameterY: SHOULDER_JOINT_HEIGHT, diameterZ: SHOULDER_JOINT_DEPTH }, scene);
    left_shoulder.parent = upper_chest
    left_shoulder.position = new BABYLON.Vector3(-UPPER_CHEST_WIDTH/2.4,UPPER_CHEST_HEIGHT/12,UPPER_CHEST_DEPTH/22)
    left_shoulder.rotate(BABYLON.Axis.Z, toRadians(-25), BABYLON.Space.LOCAL)

    var left_arm = BABYLON.MeshBuilder.CreateSphere("player_left_arm", {segments: 32, diameterX: ARM_WIDTH/1.5, diameterY: ARM_LENGTH/3, diameterZ: ARM_WIDTH/1.3 }, scene);
    left_arm.parent = left_shoulder
    left_arm.position = new BABYLON.Vector3(-ARM_WIDTH/6,-ARM_LENGTH/8,0)
    left_arm.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    var left_elbow = BABYLON.MeshBuilder.CreateSphere("player_left_elbow_joint", {segments: 32, diameterX: ARM_LENGTH/12, diameterY: ARM_LENGTH/12, diameterZ: ARM_LENGTH/14 }, scene);
    left_elbow.parent = left_arm
    left_elbow.position = new BABYLON.Vector3(0,-ARM_LENGTH/7,0)
    left_elbow.rotate(BABYLON.Axis.Z, toRadians(15), BABYLON.Space.LOCAL)
    left_elbow.rotate(BABYLON.Axis.X, toRadians(-15), BABYLON.Space.LOCAL)
    
    var left_forearm = BABYLON.MeshBuilder.CreateSphere("player_left_forearm", {segments: 32, diameterX: ARM_WIDTH/1.8, diameterY: ARM_LENGTH/4, diameterZ: ARM_WIDTH/1.8 }, scene);
    left_forearm.parent = left_elbow
    left_forearm.position = new BABYLON.Vector3(0,-ARM_LENGTH/8,0)
    left_forearm.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)

    var left_wrist = BABYLON.MeshBuilder.CreateSphere("player_left_wrist_joint", {segments: 32, diameterX: ARM_LENGTH/16, diameterY: ARM_LENGTH/12, diameterZ: ARM_LENGTH/20 }, scene);
    left_wrist.parent = left_forearm
    left_wrist.position = new BABYLON.Vector3(0,-ARM_LENGTH/8,0)
    //left_wrist.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    left_wrist.rotate(BABYLON.Axis.Y, toRadians(120), BABYLON.Space.LOCAL)
    //left_wrist.rotate(BABYLON.Axis.X, toRadians(15), BABYLON.Space.LOCAL)

    var left_hand = BABYLON.MeshBuilder.CreateSphere("player_left_hand", {segments: 32, diameterX: ARM_LENGTH/12, diameterY: ARM_LENGTH/6, diameterZ: ARM_LENGTH/16 }, scene);
    left_hand.parent = left_wrist
    left_hand.position = new BABYLON.Vector3(0,-ARM_LENGTH/12,0)
    left_hand.rotate(BABYLON.Axis.Z, 0, BABYLON.Space.LOCAL)
    //left_hand.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    //left_hand.rotate(BABYLON.Axis.Y, toRadians(-120), BABYLON.Space.LOCAL)
    //left_hand.rotate(BABYLON.Axis.X, toRadians(15), BABYLON.Space.LOCAL)


    //var hip_vertical = BABYLON.MeshBuilder.CreateSphere("player_hip_joint2", {segments: 32, diameterX: UPPER_CHEST_WIDTH/4, diameterY: UPPER_CHEST_HEIGHT/1.75, diameterZ: LOWER_CHEST_DEPTH/1.75, slice: 0.7 }, scene);
    //hip_vertical.parent = hip_horizontal
    //hip_vertical.position = new BABYLON.Vector3(0,UPPER_CHEST_HEIGHT/4,0)
    //hip_vertical.rotate(BABYLON.Axis.Z, toRadians(90), BABYLON.Space.LOCAL)

    /*right LEG*/
    var right_hip_joint = BABYLON.MeshBuilder.CreateSphere("player_right_hip_joint", {segments: 32, diameterX: LEG_WIDTH/1.1, diameterY: LEG_WIDTH/1.1, diameterZ: LEG_WIDTH/1.1 }, scene);
    right_hip_joint.parent = hip
    right_hip_joint.position = new BABYLON.Vector3(UPPER_CHEST_WIDTH/6,-UPPER_CHEST_HEIGHT/3,0)
    //right_hip_joint.rotate(BABYLON.Axis.Z, toRadians(15), BABYLON.Space.LOCAL)
    //right_leg_hip_joint.rotate(BABYLON.Axis.Y, toRadians(120), BABYLON.Space.LOCAL)
    //right_hip_joint.rotate(BABYLON.Axis.X, toRadians(-7), BABYLON.Space.LOCAL)

    var right_upper_leg = BABYLON.MeshBuilder.CreateSphere("player_right_upper_leg", {segments: 32, diameterX: LEG_WIDTH, diameterY: LEG_LENGTH * 3/8, diameterZ: LEG_WIDTH, slice: 0.7}, scene);
    right_upper_leg.parent = right_hip_joint
    right_upper_leg.position = new BABYLON.Vector3(0,-LEG_LENGTH * 2/16,0)
    right_upper_leg.rotate(BABYLON.Axis.Z, toRadians(180), BABYLON.Space.LOCAL)

    var right_knee = BABYLON.MeshBuilder.CreateSphere("player_right_knee_joint", {segments: 32, diameterX: LEG_LENGTH/14, diameterY: LEG_LENGTH/14, diameterZ: LEG_LENGTH/14 }, scene);
    right_knee.parent = right_upper_leg
    right_knee.position = new BABYLON.Vector3(0,LEG_LENGTH * 3/16,0)
    //right_knee.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    //right_leg_hip_joint.rotate(BABYLON.Axis.Y, toRadians(120), BABYLON.Space.LOCAL)
    //right_knee.rotate(BABYLON.Axis.X, toRadians(-14), BABYLON.Space.LOCAL)

    var right_lower_leg = BABYLON.MeshBuilder.CreateSphere("player_right_lower_leg", {segments: 32, diameterX: LEG_WIDTH/1.5, diameterY: LEG_LENGTH * 3/8, diameterZ: LEG_WIDTH/1.5 }, scene);
    right_lower_leg.parent = right_knee
    right_lower_leg.position = new BABYLON.Vector3(0,LEG_LENGTH * 3/16,0)
    right_lower_leg.rotate(BABYLON.Axis.Z, toRadians(180), BABYLON.Space.LOCAL)

    var right_foot = BABYLON.MeshBuilder.CreateSphere("player_right_foot_joint", {segments: 32, diameterX: LEG_LENGTH/14, diameterY: LEG_LENGTH/20, diameterZ: LEG_LENGTH/7 }, scene);
    right_foot.parent = right_lower_leg
    right_foot.position = new BABYLON.Vector3(0,-LEG_LENGTH * 3/16,LEG_LENGTH/24)
    //right_ankle.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    right_foot.rotate(BABYLON.Axis.Y, toRadians(-5), BABYLON.Space.LOCAL)
    //right_ankle.rotate(BABYLON.Axis.X, toRadians(14), BABYLON.Space.LOCAL)


    /*left LEG*/
    var left_hip_joint = BABYLON.MeshBuilder.CreateSphere("player_left_hip_joint", {segments: 32, diameterX: LEG_WIDTH/1.1, diameterY: LEG_WIDTH/1.1, diameterZ: LEG_WIDTH/1.1 }, scene);
    left_hip_joint.parent = hip
    left_hip_joint.position = new BABYLON.Vector3(-UPPER_CHEST_WIDTH/6,-UPPER_CHEST_HEIGHT/3,0)
    //left_hip_joint.rotate(BABYLON.Axis.Z, toRadians(-15), BABYLON.Space.LOCAL)
    //left_leg_hip_joint.rotate(BABYLON.Axis.Y, toRadians(120), BABYLON.Space.LOCAL)
    //left_hip_joint.rotate(BABYLON.Axis.X, toRadians(-7), BABYLON.Space.LOCAL)

    var left_upper_leg = BABYLON.MeshBuilder.CreateSphere("player_left_upper_leg", {segments: 32, diameterX: LEG_WIDTH, diameterY: LEG_LENGTH * 3/8, diameterZ: LEG_WIDTH, slice: 0.7}, scene);
    left_upper_leg.parent = left_hip_joint
    left_upper_leg.position = new BABYLON.Vector3(0,-LEG_LENGTH * 2/16,0)
    left_upper_leg.rotate(BABYLON.Axis.Z, toRadians(180), BABYLON.Space.LOCAL)

    var left_knee = BABYLON.MeshBuilder.CreateSphere("player_left_knee_joint", {segments: 32, diameterX: LEG_LENGTH/14, diameterY: LEG_LENGTH/14, diameterZ: LEG_LENGTH/14 }, scene);
    left_knee.parent = left_upper_leg
    left_knee.position = new BABYLON.Vector3(0,LEG_LENGTH * 3/16,0)
    //left_knee.rotate(BABYLON.Axis.Z, toRadians(15), BABYLON.Space.LOCAL)
    //left_leg_hip_joint.rotate(BABYLON.Axis.Y, toRadians(120), BABYLON.Space.LOCAL)
    //left_knee.rotate(BABYLON.Axis.X, toRadians(-14), BABYLON.Space.LOCAL)

    var left_lower_leg = BABYLON.MeshBuilder.CreateSphere("player_left_lower_leg", {segments: 32, diameterX: LEG_WIDTH/1.5, diameterY: LEG_LENGTH * 3/8, diameterZ: LEG_WIDTH/1.5 }, scene);
    left_lower_leg.parent = left_knee
    left_lower_leg.position = new BABYLON.Vector3(0,LEG_LENGTH * 3/16,0)
    left_lower_leg.rotate(BABYLON.Axis.Z, toRadians(180), BABYLON.Space.LOCAL)

    var left_foot = BABYLON.MeshBuilder.CreateSphere("player_left_foot_joint", {segments: 32, diameterX: LEG_LENGTH/14, diameterY: LEG_LENGTH/20, diameterZ: LEG_LENGTH/7}, scene);
    left_foot.parent = left_lower_leg
    left_foot.position = new BABYLON.Vector3(0,-LEG_LENGTH * 3/16,LEG_LENGTH/24)
    left_foot.rotate(BABYLON.Axis.Y, toRadians(5), BABYLON.Space.LOCAL)

    
    var bodyMaterial = Materials.woodMaterial

    upper_chest.material = bodyMaterial;
    lower_chest.material = bodyMaterial;
    head.material = bodyMaterial;
    hip.material = bodyMaterial;
    left_arm.material = bodyMaterial;
    left_forearm.material = bodyMaterial;
    left_hand.material = bodyMaterial;
    right_arm.material = bodyMaterial;
    right_forearm.material = bodyMaterial;
    right_hand.material = bodyMaterial;
    left_upper_leg.material = bodyMaterial;
    left_lower_leg.material = bodyMaterial;
    right_upper_leg.material = bodyMaterial;
    right_lower_leg.material = bodyMaterial;

    var jointMaterial = Materials.metal0Material

    neck_joint.material = jointMaterial;
    left_shoulder.material = jointMaterial;
    right_shoulder.material = jointMaterial;
    left_hip_joint.material = jointMaterial;
    right_hip_joint.material = jointMaterial;
    left_elbow.material = jointMaterial;
    right_elbow.material = jointMaterial;
    left_wrist.material = jointMaterial;
    right_wrist.material = jointMaterial;
    left_knee.material = jointMaterial;
    right_knee.material = jointMaterial;
    left_foot.material = jointMaterial;
    right_foot.material = jointMaterial;
    
    makeHierarchyUnpickable(playerCollider)

    //Store initial mesh transformation in the metaData of the collider
    playerCollider.metaData = new Map();
    playerCollider.metaData.set("initial_positions", storeInitialTransformationsInMap(playerCollider, new Map()))
    playerCollider.metaData.set("initial_joint_positions", storeInitialTransformationsInMap(playerCollider, new Map(), "joint"))
    playerCollider.metaData.set("parts_map", mapHierarchyParts(playerCollider, new Map()))
    //playerCollider.metaData.set("animations", new Map())
    //console.log(playerCollider.metaData.get("initial_joint_positions"))

    upper_chest.receiveShadows = true
    lower_chest.receiveShadows = true
    head.receiveShadows = true
    hip.receiveShadows = true
    left_arm.receiveShadows = true;
    left_forearm.receiveShadows = true;
    left_hand.receiveShadows = true;
    right_arm.receiveShadows = true;
    right_forearm.receiveShadows = true;
    right_hand.receiveShadows = true;
    left_upper_leg.receiveShadows = true;
    left_lower_leg.receiveShadows = true;
    right_upper_leg.receiveShadows = true;
    right_lower_leg.receiveShadows = true;
    neck_joint.receiveShadows = true;
    left_shoulder.receiveShadows = true;
    right_shoulder.receiveShadows = true;
    left_hip_joint.receiveShadows = true;
    right_hip_joint.receiveShadows = true;
    left_elbow.receiveShadows = true;
    right_elbow.receiveShadows = true;
    left_wrist.receiveShadows = true;
    right_wrist.receiveShadows = true;
    left_knee.receiveShadows = true;
    right_knee.receiveShadows = true;
    left_foot.receiveShadows = true;
    right_foot.receiveShadows = true;

    GameEngine.addShadows(hip)
    return playerCollider
}

