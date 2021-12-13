
//This class holds functions that create animations for player movement plus helper methods
//to perform transitions from one animation to the other (for example go from the idle animation 
//to the moveForward animation)
class PlayerAnimations {

    //Frame rate identical for all animations
    static frameRate = 30

    //Read the player model metaData (see the player_model.js file) to get initial position/rotation of
    //the components of the hierarchy, by their name
    static getInitialJointRotation(player, partName) {
        return player.metaData.get("initial_joint_positions").get(partName).rotation
    }

    static getInitialJointPosition(player, partName) {
        return player.metaData.get("initial_joint_positions").get(partName).position
    }

    static getInitialPosition(player, partName) {
        return player.metaData.get("initial_positions").get(partName).position
    }

    static getInitialRotation(player, partName) {
        return player.metaData.get("initial_positions").get(partName).rotation
    }

    //Read the player model metaData (see the player_model.js file) to get the current position/rotation of
    //the components of the hierarchy, by their name
    static getCurrentJointRotation(player, partName) {
        var mesh = player.metaData.get("parts_map").get(partName)
        return (mesh.rotationQuaternion==null ? BABYLON.Vector3.Zero() : mesh.rotationQuaternion.toEulerAngles())
    }

    static getCurrentJointPosition(player, partName) {
        var mesh = player.metaData.get("parts_map").get(partName)
        return mesh.position
    }

    //ANIMATION DEFINITIONS: all animations are parametric (no "magic numbers") except for the duration of keyframes
    static playerWalkForward(player) {

        var STEP_AMPLITUDE_X = toRadians(15);
        var STEP_AMPLITUDE_Z = toRadians(-10);

        var animationGroup = new BABYLON.AnimationGroup("player_walk_forward_group");

        //HIPS
        var left_hip_forward= new BABYLON.Animation("left_hip_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
        left_hip_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X * 4/3,0.0,STEP_AMPLITUDE_Z*3/4))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X,0.0,STEP_AMPLITUDE_Z*3/4))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X*7/3,0.0,STEP_AMPLITUDE_Z*3/4))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X*4/3,0.0,STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X * 4/3,0.0,STEP_AMPLITUDE_Z*3/4))
            },
        ]);
        animationGroup.addTargetedAnimation(left_hip_forward, GameEngine.scene.getMeshByName("player_left_hip_joint"));

        var right_hip_forward= new BABYLON.Animation("right_hip_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
        right_hip_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X*7/3,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X*4/3,0.0,-STEP_AMPLITUDE_Z/2))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_AMPLITUDE_Z/2))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X*4/3,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X * 7/3,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
        ]);
        animationGroup.addTargetedAnimation(right_hip_forward, GameEngine.scene.getMeshByName("player_right_hip_joint"));
        
        //KNEES
        var STEP_KNEE_AMPLITUDE_X = -STEP_AMPLITUDE_X * 4
        var STEP_KNEE_AMPLITUDE_Z = toRadians(10)
        var left_knee_forward= new BABYLON.Animation("left_knee_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_knee_joint")
        left_knee_forward.setKeys([
            //value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE,0.0,0.0))
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/8,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/4,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/8,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_knee_forward, GameEngine.scene.getMeshByName("player_left_knee_joint"));
        
        var right_knee_forward= new BABYLON.Animation("right_knee_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_knee_joint")
        right_knee_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/4,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/8,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING (RIGHT UP)
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(right_knee_forward, GameEngine.scene.getMeshByName("player_right_knee_joint"));

        //feet
        var STEP_FOOT_AMPLITUDE_X = STEP_AMPLITUDE_X * 4
        var STEP_FOOT_AMPLITUDE_Z = 0
        var left_foot_forward= new BABYLON.Animation("left_foot_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_foot_joint")
        left_foot_forward.setKeys([
            //value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE,0.0,0.0))
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/8,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/16,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/4,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/8,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/8,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_foot_forward, GameEngine.scene.getMeshByName("player_left_foot_joint"));
        
        var right_foot_forward= new BABYLON.Animation("right_foot_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_foot_joint")
        right_foot_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_FOOT_AMPLITUDE_Z/8))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/4,0.0,-STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/8,0.0,-STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/8,0.0,-STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/16,0.0,-STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING (RIGHT UP)
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(0,0.0,-STEP_FOOT_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_FOOT_AMPLITUDE_Z/8))
            },
        ]);
        animationGroup.addTargetedAnimation(right_foot_forward, GameEngine.scene.getMeshByName("player_right_foot_joint"));

        var HIP_BOBBING_AMPLITUDE = 0.02
        var hip_forward = new BABYLON.Animation("hip_walk_forward", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_hip_forward_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        hip_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            },
            {
                //LEFT FORWARD
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //RIGHT PASSING (RIGHT UP)
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
        ]);
        animationGroup.addTargetedAnimation(hip_forward, GameEngine.scene.getMeshByName("player_hip_joint"));


        //SHOULDERS
        var STEP_SHOULDER_AMPLITUDE_X = STEP_AMPLITUDE_X * 1.2
        var STEP_SHOULDER_AMPLITUDE_Z = toRadians(-10)
        var left_shoulder_forward= new BABYLON.Animation("left_shoulder_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*6/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*4/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X*4/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X * 6/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_shoulder_forward, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));
        
        var right_shoulder_forward= new BABYLON.Animation("right_shoulder_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X * 4/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*6/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*4/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X * 4/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(right_shoulder_forward, GameEngine.scene.getMeshByName("player_right_shoulder_joint"));

        //ELBOWS ROTATION
        var left_elbow_walk_forward= new BABYLON.Animation("left_elbow_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_elbow_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_elbow_joint")
        left_elbow_walk_forward.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate, 
                value: initial_left_elbow_rotation
            },
            {
                frame: 1.2 * PlayerAnimations.frameRate, 
                value: initial_left_elbow_rotation
            }
        ]);
        animationGroup.addTargetedAnimation(left_elbow_walk_forward, GameEngine.scene.getMeshByName("player_left_elbow_joint"));

        var right_elbow_walk_forward= new BABYLON.Animation("right_elbow_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_elbow_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_elbow_joint")
        right_elbow_walk_forward.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate, 
                value: initial_right_elbow_rotation
            },
            {
                frame: 1.2 * PlayerAnimations.frameRate, 
                value: initial_right_elbow_rotation
            }
        ]);
        animationGroup.addTargetedAnimation(right_elbow_walk_forward, GameEngine.scene.getMeshByName("player_right_elbow_joint"));

        var LOWER_CHEST_ANGLE_X = toRadians(5)
        var LOWER_CHEST_ANGLE_Y = toRadians(12)
        var LOWER_CHEST_ANGLE_Z = toRadians(2)
        var lower_chest_forward= new BABYLON.Animation("lower_chest_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_rotation = PlayerAnimations.getInitialJointRotation(player, "player_lower_chest_joint")
        lower_chest_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y,LOWER_CHEST_ANGLE_Z/2))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y,LOWER_CHEST_ANGLE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,0.0,0.0))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,-LOWER_CHEST_ANGLE_Y,-LOWER_CHEST_ANGLE_Z/2))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,-LOWER_CHEST_ANGLE_Y,-LOWER_CHEST_ANGLE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,0.0,0.0))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y,LOWER_CHEST_ANGLE_Z/2))
            },
        ]);
        animationGroup.addTargetedAnimation(lower_chest_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        var LOWER_CHEST_OFFSET = 0.03
        var lower_chest_offset_forward= new BABYLON.Animation("lower_chest_offset_walk_forward", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointPosition(player, "player_lower_chest_joint")
        lower_chest_offset_forward.setKeys([
            {
                //FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_OFFSET))
            },
            {
                //FORWARD 
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_OFFSET))
            }
        ]);
        animationGroup.addTargetedAnimation(lower_chest_offset_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        animationGroup.normalize(0,37)
        return animationGroup
        //player.metaData.get("PlayerAnimations").set("player_walk_forward", animationGroup)

    }

    static playerWalkBackward(player) {

        var STEP_AMPLITUDE_X = toRadians(15);
        var STEP_AMPLITUDE_Z = toRadians(-10);

        var animationGroup = new BABYLON.AnimationGroup("player_walk_forward_group");

        //HIPS
        var left_hip_forward= new BABYLON.Animation("left_hip_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
        left_hip_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X * 4/3,0.0,STEP_AMPLITUDE_Z*3/4))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X,0.0,STEP_AMPLITUDE_Z*3/4))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X*5/3,0.0,STEP_AMPLITUDE_Z*3/4))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X*4/3,0.0,STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X * 4/3,0.0,STEP_AMPLITUDE_Z*3/4))
            },
        ]);
        animationGroup.addTargetedAnimation(left_hip_forward, GameEngine.scene.getMeshByName("player_left_hip_joint"));

        var right_hip_forward= new BABYLON.Animation("right_hip_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
        right_hip_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X*5/3,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X*4/3,0.0,-STEP_AMPLITUDE_Z/2))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_AMPLITUDE_Z/2))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X*4/3,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-STEP_AMPLITUDE_X,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X * 5/3,0.0,-STEP_AMPLITUDE_Z*3/4))
            },
        ]);
        animationGroup.addTargetedAnimation(right_hip_forward, GameEngine.scene.getMeshByName("player_right_hip_joint"));
        
        //KNEES
        var STEP_KNEE_AMPLITUDE_X = -STEP_AMPLITUDE_X * 3
        var STEP_KNEE_AMPLITUDE_Z = toRadians(10)
        var left_knee_forward= new BABYLON.Animation("left_knee_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_knee_joint")
        left_knee_forward.setKeys([
            //value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE,0.0,0.0))
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/8,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/4,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/8,0.0,STEP_KNEE_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_knee_forward, GameEngine.scene.getMeshByName("player_left_knee_joint"));
        
        var right_knee_forward= new BABYLON.Animation("right_knee_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_knee_joint")
        right_knee_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/4,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/8,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING (RIGHT UP)
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(STEP_KNEE_AMPLITUDE_X/2,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_KNEE_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(right_knee_forward, GameEngine.scene.getMeshByName("player_right_knee_joint"));

        //feet
        var STEP_FOOT_AMPLITUDE_X = STEP_AMPLITUDE_X * 4
        var STEP_FOOT_AMPLITUDE_Z = 0
        var left_foot_forward= new BABYLON.Animation("left_foot_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_foot_joint")
        left_foot_forward.setKeys([
            //value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE,0.0,0.0))
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(STEP_FOOT_AMPLITUDE_X/8,0.0,STEP_FOOT_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_foot_forward, GameEngine.scene.getMeshByName("player_left_foot_joint"));
        
        var right_foot_forward= new BABYLON.Animation("right_foot_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_foot_joint")
        right_foot_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_FOOT_AMPLITUDE_Z/8))
            },
        ]);
        animationGroup.addTargetedAnimation(right_foot_forward, GameEngine.scene.getMeshByName("player_right_foot_joint"));

        var HIP_BOBBING_AMPLITUDE = 0.02
        var hip_forward = new BABYLON.Animation("hip_walk_forward", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_hip_forward_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        hip_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
        ]);
        animationGroup.addTargetedAnimation(hip_forward, GameEngine.scene.getMeshByName("player_hip_joint"));

        var HIP_BOBBING_AMPLITUDE = 0.02
        var hip_forward = new BABYLON.Animation("hip_walk_forward", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_hip_forward_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        hip_forward.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            },
            {
                //LEFT FORWARD
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
            {
                //RIGHT PASSING (RIGHT UP)
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_hip_forward_position.add(new BABYLON.Vector3(0.0,HIP_BOBBING_AMPLITUDE,0.0))
            },
        ]);
        animationGroup.addTargetedAnimation(hip_forward, GameEngine.scene.getMeshByName("player_hip_joint"));


        //SHOULDERS
        var STEP_SHOULDER_AMPLITUDE_X = -STEP_AMPLITUDE_X * 0.5
        var STEP_SHOULDER_AMPLITUDE_Z = toRadians(-10)
        var left_shoulder_forward= new BABYLON.Animation("left_shoulder_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*6/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*4/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X*4/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X * 6/3,0.0,-STEP_SHOULDER_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_shoulder_forward, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));
        
        var right_shoulder_forward= new BABYLON.Animation("right_shoulder_joint_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X * 4/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT CONTACT
                frame: 0.15 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT PASSING (LEFT UP)
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT FORWARD (RIGHT UP)
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*6/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //LEFT CONTACT
                frame: 0.8 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-STEP_SHOULDER_AMPLITUDE_X*4/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD (LEFT UP)
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(STEP_SHOULDER_AMPLITUDE_X * 4/3,0.0,STEP_SHOULDER_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(right_shoulder_forward, GameEngine.scene.getMeshByName("player_right_shoulder_joint"));

        //ELBOWS ROTATION
        var left_elbow_walk_forward= new BABYLON.Animation("left_elbow_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_elbow_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_elbow_joint")
        left_elbow_walk_forward.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate, 
                value: initial_left_elbow_rotation
            },
            {
                frame: 1.2 * PlayerAnimations.frameRate, 
                value: initial_left_elbow_rotation
            }
        ]);
        animationGroup.addTargetedAnimation(left_elbow_walk_forward, GameEngine.scene.getMeshByName("player_left_elbow_joint"));

        var right_elbow_walk_forward= new BABYLON.Animation("right_elbow_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_elbow_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_elbow_joint")
        right_elbow_walk_forward.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate, 
                value: initial_right_elbow_rotation
            },
            {
                frame: 1.2 * PlayerAnimations.frameRate, 
                value: initial_right_elbow_rotation
            }
        ]);
        animationGroup.addTargetedAnimation(right_elbow_walk_forward, GameEngine.scene.getMeshByName("player_right_elbow_joint"));

        var LOWER_CHEST_ANGLE_X = toRadians(-5)
        var LOWER_CHEST_ANGLE_Y = 0
        var LOWER_CHEST_ANGLE_Z = 0
        var lower_chest_forward= new BABYLON.Animation("lower_chest_walk_forward", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_rotation = PlayerAnimations.getInitialJointRotation(player, "player_lower_chest_joint")
        lower_chest_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y,LOWER_CHEST_ANGLE_Z/2))
            },
            {
                //LEFT PASSING
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y/2,LOWER_CHEST_ANGLE_Z/2))
            },
            {
                //LEFT PASSING
                frame: 0.65 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y,LOWER_CHEST_ANGLE_Z/2))
            },
            {
                //RIGHT PASSING
                frame: 0.9 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y/2,LOWER_CHEST_ANGLE_Z/2))
            },
            {
                //RIGHT FORWARD 
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,LOWER_CHEST_ANGLE_Y,LOWER_CHEST_ANGLE_Z/2))
            },
        ]);
        animationGroup.addTargetedAnimation(lower_chest_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        var LOWER_CHEST_OFFSET = -0.02
        var lower_chest_offset_forward= new BABYLON.Animation("lower_chest_offset_walk_forward", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointPosition(player, "player_lower_chest_joint")
        lower_chest_offset_forward.setKeys([
            {
                //FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_OFFSET))
            }
        ]);
        animationGroup.addTargetedAnimation(lower_chest_offset_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));
        return animationGroup
        //player.metaData.get("PlayerAnimations").set("player_walk_forward", animationGroup)
    }

    //Strife left animation with the possibility (NOT USED) of performing a manual animation blending
    static playerWalkLeft(player, blend_ratio) {
    
        if(!blend_ratio) blend_ratio = 1

        var animationGroup = new BABYLON.AnimationGroup("player_walk_right_group");

        var initial_left_hip_rotation, initial_right_hip_rotation, initial_hip_position;
        if(blend_ratio)
        {
            /*initial_left_hip_rotation = sanitizeRotation(GameEngine.scene.getMeshByName("player_left_hip_joint").rotationQuaternion).multiply(new BABYLON.Vector3(blend_ratio,1.0,blend_ratio))
            initial_right_hip_rotation = sanitizeRotation(GameEngine.scene.getMeshByName("player_right_hip_joint").rotationQuaternion).multiply(new BABYLON.Vector3(blend_ratio,1.0,blend_ratio))
            initial_hip_position = GameEngine.scene.getMeshByName("player_hip_joint").position.multiply(new BABYLON.Vector3(blend_ratio,1.0,1.0))
            */
           
            //initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
            //initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
            initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
            
            initial_left_hip_rotation = BABYLON.Vector3.Zero()
            initial_right_hip_rotation = BABYLON.Vector3.Zero()
            //initial_hip_position = BABYLON.Vector3.Zero()*/
        
        }
        else
        {
            initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
            initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
            initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        }

        //HIPS
        //var STEP_AMPLITUDE_X = -toRadians(45);
        var STEP_AMPLITUDE_X = -toRadians(30 * blend_ratio);
        var STEP_AMPLITUDE_Z = -toRadians(30 * blend_ratio);
        var right_hip = new BABYLON.Animation("right_hip_joint_right", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
        right_hip.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,-STEP_AMPLITUDE_Z/1.5))
            },
            {
                //RIGHT FORWARD 
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,-STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT FORWARD 
                frame: 0.6 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/4,0.0,-STEP_AMPLITUDE_Z/4))
            },
            {
                //RIGHT FORWARD 
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,-STEP_AMPLITUDE_Z/1.5))
            },
        ]);
        animationGroup.addTargetedAnimation(right_hip, GameEngine.scene.getMeshByName("player_right_hip_joint"));

        var left_hip = new BABYLON.Animation("left_hip_joint_left", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
        left_hip.setKeys([
            {
                //left FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,STEP_AMPLITUDE_Z))
            },
            {
                //left FORWARD 
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,STEP_AMPLITUDE_Z/2))
            },
            {
                //left FORWARD 
                frame: 0.6 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/4,0.0,STEP_AMPLITUDE_Z/4))
            },
            {
                //left FORWARD 
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,STEP_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(left_hip, GameEngine.scene.getMeshByName("player_left_hip_joint"));
        
        var HIP_BOBBING_AMPLITUDE_Y = 0.03 * blend_ratio
        var HIP_BOBBING_AMPLITUDE_X = 0
        //var HIP_BOBBING_AMPLITUDE_X = -0.2  * blend_ratio
        var hip = new BABYLON.Animation("hip_walk_right", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        hip.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X,-HIP_BOBBING_AMPLITUDE_Y/2,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 0.3 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X/2,0.0,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 0.6 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X/3,-HIP_BOBBING_AMPLITUDE_Y,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X,-HIP_BOBBING_AMPLITUDE_Y/2,0.0))
            },
        ]);
        animationGroup.addTargetedAnimation(hip, GameEngine.scene.getMeshByName("player_hip_joint"));

        var left_shoulder_right= new BABYLON.Animation("left_shoulder_right", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_position = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_right.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(left_shoulder_right, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));

        var right_shoulder_right= new BABYLON.Animation("right_shoulder_right", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_position = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_right.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(right_shoulder_right, GameEngine.scene.getMeshByName("player_right_shoulder_joint"));

        return animationGroup
        //player.metaData.get("PlayerAnimations").set("player_walk_forward", animationGroup)
    }

    //Strife right animation with the possibility (NOT USED) of performing a manual animation blending
    static playerWalkRight(player, blend_ratio) {
    
        if(!blend_ratio) blend_ratio = 1

        var animationGroup = new BABYLON.AnimationGroup("player_walk_right_group");

        var initial_left_hip_rotation, initial_right_hip_rotation, initial_hip_position;
        if(blend_ratio)
        {
            /*initial_left_hip_rotation = sanitizeRotation(GameEngine.scene.getMeshByName("player_left_hip_joint").rotationQuaternion).multiply(new BABYLON.Vector3(blend_ratio,1.0,blend_ratio))
            initial_right_hip_rotation = sanitizeRotation(GameEngine.scene.getMeshByName("player_right_hip_joint").rotationQuaternion).multiply(new BABYLON.Vector3(blend_ratio,1.0,blend_ratio))
            initial_hip_position = GameEngine.scene.getMeshByName("player_hip_joint").position.multiply(new BABYLON.Vector3(blend_ratio,1.0,1.0))
            */
           
            //initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
            //initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
            initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
            
            initial_left_hip_rotation = BABYLON.Vector3.Zero()
            initial_right_hip_rotation = BABYLON.Vector3.Zero()
            //initial_hip_position = BABYLON.Vector3.Zero()*/
        
        }
        else
        {
            initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
            initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
            initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        }


        //HIPS
        //var STEP_AMPLITUDE_X = -toRadians(45);
        var STEP_AMPLITUDE_X = -toRadians(30 * blend_ratio);
        var STEP_AMPLITUDE_Z = toRadians(30 * blend_ratio) ;
        var left_hip = new BABYLON.Animation("left_hip_joint_right", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        left_hip.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,-STEP_AMPLITUDE_Z/1.5))
            },
            {
                //RIGHT FORWARD 
                frame: 0.4 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,-STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT FORWARD 
                frame: 0.7 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/4,0.0,-STEP_AMPLITUDE_Z/4))
            },
            {
                //RIGHT FORWARD 
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,-STEP_AMPLITUDE_Z/1.5))
            },
        ]);
        animationGroup.addTargetedAnimation(left_hip, GameEngine.scene.getMeshByName("player_left_hip_joint"));

        var right_hip = new BABYLON.Animation("right_hip_joint_right", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        right_hip.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,STEP_AMPLITUDE_Z))
            },
            {
                //RIGHT FORWARD 
                frame: 0.4 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,STEP_AMPLITUDE_Z/2))
            },
            {
                //RIGHT FORWARD 
                frame: 0.7 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/4,0.0,STEP_AMPLITUDE_Z/4))
            },
            {
                //RIGHT FORWARD 
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(STEP_AMPLITUDE_X/2,0.0,STEP_AMPLITUDE_Z))
            },
        ]);
        animationGroup.addTargetedAnimation(right_hip, GameEngine.scene.getMeshByName("player_right_hip_joint"));
        
        var HIP_BOBBING_AMPLITUDE_Y = 0.03 * blend_ratio
        var HIP_BOBBING_AMPLITUDE_X = 0
        //var HIP_BOBBING_AMPLITUDE_X = 0.2  * blend_ratio
        var hip = new BABYLON.Animation("hip_walk_right", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        hip.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X,-HIP_BOBBING_AMPLITUDE_Y/2,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 0.4 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X/2,0.0,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 0.7 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X/3,-HIP_BOBBING_AMPLITUDE_Y,0.0))
            },
            {
                //RIGHT FORWARD
                frame: 1.2 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(HIP_BOBBING_AMPLITUDE_X,-HIP_BOBBING_AMPLITUDE_Y/2,0.0))
            },
        ]);
        animationGroup.addTargetedAnimation(hip, GameEngine.scene.getMeshByName("player_hip_joint"));

        var left_shoulder_left= new BABYLON.Animation("left_shoulder_left", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_position = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_left.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(left_shoulder_left, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));

        var right_shoulder_left= new BABYLON.Animation("right_shoulder_left", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_position = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_left.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(right_shoulder_left, GameEngine.scene.getMeshByName("player_right_shoulder_joint"));

        return animationGroup
        //return BABYLON.AnimationGroup.MakeAnimationAdditive(animationGroup);
        //player.metaData.get("PlayerAnimations").set("player_walk_forward", animationGroup)
    }

    static playerJump(player){
        var SHOULDER_AMPLITUDE = toRadians(90);

        var animationGroup = new BABYLON.AnimationGroup("player_jump_group");        
        var right_shoulder_falling= new BABYLON.Animation("right_shoulder_falling", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_right_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_falling.setKeys([
            {
                frame: 0,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(SHOULDER_AMPLITUDE,0,SHOULDER_AMPLITUDE*1/3))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE/2,0,SHOULDER_AMPLITUDE*1/4)) 
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE,0,SHOULDER_AMPLITUDE*1/3))
            },
        ]);
        animationGroup.addTargetedAnimation(right_shoulder_falling, GameEngine.scene.getMeshByName("player_right_shoulder_joint")); 
               
        var left_shoulder_falling= new BABYLON.Animation("left_shoulder_falling", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_left_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_falling.setKeys([
            {
                frame: 0,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(SHOULDER_AMPLITUDE,0,-SHOULDER_AMPLITUDE*1/3))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE/2,0,-SHOULDER_AMPLITUDE*1/4))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE,0,-SHOULDER_AMPLITUDE*1/3))
            },
        ]);
        animationGroup.addTargetedAnimation(left_shoulder_falling, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));
        
        var HIP_AMPLITUDE_X = toRadians(90);
        var left_hip_jump= new BABYLON.Animation("left_hip_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
        left_hip_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE_X,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE_X*3/4,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(0,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(left_hip_jump, GameEngine.scene.getMeshByName("player_left_hip_joint"));

        var right_hip_jump= new BABYLON.Animation("right_hip_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
        right_hip_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE_X,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE_X*3/4,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(0,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(right_hip_jump, GameEngine.scene.getMeshByName("player_right_hip_joint"));

        var KNEE_AMPLITUDE = toRadians(160);
        var left_knee_jump= new BABYLON.Animation("left_knee_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_left_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_knee_joint")
        left_knee_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE*3/4,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(0,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(left_knee_jump, GameEngine.scene.getMeshByName("player_left_knee_joint"));

        var right_knee_jump= new BABYLON.Animation("right_knee_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_right_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_knee_joint")
        right_knee_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE*3/4,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(0,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(right_knee_jump, GameEngine.scene.getMeshByName("player_right_knee_joint"));

        var foot_AMPLITUDE = toRadians(60);
        var left_foot_jump= new BABYLON.Animation("left_foot_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_left_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_foot_joint")
        left_foot_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-foot_AMPLITUDE,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-foot_AMPLITUDE*3/4,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(0,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(left_foot_jump, GameEngine.scene.getMeshByName("player_left_foot_joint"));

        var right_foot_jump= new BABYLON.Animation("right_foot_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_right_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_foot_joint")
        right_foot_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(-foot_AMPLITUDE,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(-foot_AMPLITUDE*3/4,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(0,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(right_foot_jump, GameEngine.scene.getMeshByName("player_right_foot_joint"));

        var LOWER_CHEST_ANGLE_X = toRadians(60)
        var lower_chest_forward= new BABYLON.Animation("lower_chest_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_lower_chest_rotation = PlayerAnimations.getInitialJointRotation(player, "player_lower_chest_joint")
        lower_chest_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X,0.0,0.0))
            },
            {
                //RIGHT FORWARD 
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(LOWER_CHEST_ANGLE_X/2,0.0,0.0))
            },
            {
                //RIGHT FORWARD 
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_lower_chest_rotation.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(lower_chest_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        var LOWER_CHEST_OFFSET_Y = 0.1
        var LOWER_CHEST_OFFSET_Z = 0.3
        var lower_chest_offset_forward= new BABYLON.Animation("lower_chest_offset_jump", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointPosition(player, "player_lower_chest_joint")
        lower_chest_offset_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,-LOWER_CHEST_OFFSET_Y,LOWER_CHEST_OFFSET_Z))
            },
            {
                //RIGHT FORWARD 
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,-LOWER_CHEST_OFFSET_Y,LOWER_CHEST_OFFSET_Z/2))
            },
            {
                //RIGHT FORWARD 
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(lower_chest_offset_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));
        
        var HIP_OFFSET_Y = 0.5
        var hip_offset_forward= new BABYLON.Animation("hip_offset_jump", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        hip_offset_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(0.0,-HIP_OFFSET_Y,0.0))
            },
            {
                //RIGHT FORWARD 
                frame: 0.4 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(0.0,-HIP_OFFSET_Y*7/6,0.0))
            },
            {
                //RIGHT FORWARD 
                frame: 0.7 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(0.0,-HIP_OFFSET_Y*1/6,0.0))
            },
            {
                //RIGHT FORWARD 
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_hip_position.add(new BABYLON.Vector3(0.0,0.0,0.0))
            }
        ]);
        animationGroup.addTargetedAnimation(hip_offset_forward, GameEngine.scene.getMeshByName("player_hip_joint"));
        
        animationGroup.onAnimationGroupEndObservable.add(function() {
            if(Settings.debugPlayerAnimations) console.log("Applying jump impulse")
            Player.jump()
          });
        
        return animationGroup;
    }

    static playerFall(player){
        var SHOULDER_AMPLITUDE = toRadians(120);

        var animationGroup = new BABYLON.AnimationGroup("player_fall_group");        
        var right_shoulder_falling= new BABYLON.Animation("right_shoulder_falling", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_falling.setKeys([
            {
                frame: 0,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE,0,SHOULDER_AMPLITUDE*1/3))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE*5/6,0,SHOULDER_AMPLITUDE*1/4)) 
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE,0,SHOULDER_AMPLITUDE*1/3))
            },
        ]);
        animationGroup.addTargetedAnimation(right_shoulder_falling, GameEngine.scene.getMeshByName("player_right_shoulder_joint")); 
               
        var left_shoulder_falling= new BABYLON.Animation("left_shoulder_falling", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_falling.setKeys([
            {
                frame: 0,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE,0,-SHOULDER_AMPLITUDE*1/3))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE*5/6,0,-SHOULDER_AMPLITUDE*1/4))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(-SHOULDER_AMPLITUDE,0,-SHOULDER_AMPLITUDE*1/3))
            },
        ]);
        animationGroup.addTargetedAnimation(left_shoulder_falling, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));
                
        var HIP_AMPLITUDE = toRadians(60);
        var KNEE_AMPLITUDE = toRadians(90);
        var left_hip_jump= new BABYLON.Animation("left_hip_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
        left_hip_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE,0,-HIP_AMPLITUDE/3))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE*5/6,0,-HIP_AMPLITUDE/3))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE,0,-HIP_AMPLITUDE/3))
            }
        ]);
        animationGroup.addTargetedAnimation(left_hip_jump, GameEngine.scene.getMeshByName("player_left_hip_joint"));

        var left_knee_jump= new BABYLON.Animation("left_knee_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_knee_joint")
        left_knee_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE*3/4,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE*3/4,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(left_knee_jump, GameEngine.scene.getMeshByName("player_left_knee_joint"));

        var right_hip_jump= new BABYLON.Animation("right_hip_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
        right_hip_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE,0,HIP_AMPLITUDE/3))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE*5/6,0,HIP_AMPLITUDE/3))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(-HIP_AMPLITUDE,0,HIP_AMPLITUDE/3))
            }
        ]);
        animationGroup.addTargetedAnimation(right_hip_jump, GameEngine.scene.getMeshByName("player_right_hip_joint"));

        var right_knee_jump= new BABYLON.Animation("right_knee_joint_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_knee_joint")
        right_knee_jump.setKeys([
            {
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE*3/4,0,0))
            },
            {
                frame: 0.5 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE,0,0))
            },
            {
                frame: 1 * PlayerAnimations.frameRate,
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(-KNEE_AMPLITUDE*3/4,0,0))
            }
        ]);
        animationGroup.addTargetedAnimation(right_knee_jump, GameEngine.scene.getMeshByName("player_right_knee_joint"));

        var lower_chest_fall= new BABYLON.Animation("lower_chest_fall", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
        var initial_lower_chest_rotation = PlayerAnimations.getInitialJointRotation(player, "player_lower_chest_joint")
        lower_chest_fall.setKeys([
            {
                frame: 0, 
                value: initial_lower_chest_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_lower_chest_rotation
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_lower_chest_rotation
        }]);
        animationGroup.addTargetedAnimation(lower_chest_fall, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        var LOWER_CHEST_ANGLE = 0
        var lower_chest_forward= new BABYLON.Animation("lower_chest_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointRotation(player, "player_lower_chest_joint")
        lower_chest_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_ANGLE))
            }
        ]);

        animationGroup.addTargetedAnimation(lower_chest_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));
        var LOWER_CHEST_OFFSET = 0
        var lower_chest_offset_jump= new BABYLON.Animation("lower_chest_offset_jump", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointPosition(player, "player_lower_chest_joint")
        lower_chest_offset_jump.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_OFFSET))
            }
        ]);
        animationGroup.addTargetedAnimation(lower_chest_offset_jump, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        return animationGroup;
    }

    static playerIdle(player) {

        var BREATH_ARM_Z = toRadians(2)
        var BREATH_ARM_MOVE_X = 0.5/100
        var BREATH_ARM_MOVE_Y = 1/100
        var BREATH_ARM_MOVE_Z = 0.5/100
        var BREATH_UPPER_CHEST_X = toRadians(5)
        var BREATH_HEAD_X = BREATH_UPPER_CHEST_X

        var animationGroup = new BABYLON.AnimationGroup("player_idle_group");

        //SHOULDERS ROTATION
        var left_shoulder_idle= new BABYLON.Animation("left_shoulder_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_shoulder_joint")
        left_shoulder_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_shoulder_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_left_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,BREATH_ARM_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_shoulder_rotation
        }]);
        animationGroup.addTargetedAnimation(left_shoulder_idle, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));

        var right_shoulder_idle= new BABYLON.Animation("right_shoulder_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_shoulder_joint")
        right_shoulder_idle.setKeys([
            {
                frame: 0, 
                value: initial_right_shoulder_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_right_shoulder_rotation.add(new BABYLON.Vector3(0.0,0.0,-BREATH_ARM_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_right_shoulder_rotation
        }]);

        //SHOULDERS POSITION
        animationGroup.addTargetedAnimation(right_shoulder_idle, GameEngine.scene.getMeshByName("player_right_shoulder_joint"));
        var left_shoulder_position_idle= new BABYLON.Animation("left_shoulder_position_idle", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_shoulder_position = PlayerAnimations.getInitialJointPosition(player, "player_left_shoulder_joint")
        left_shoulder_position_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_shoulder_position
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_left_shoulder_position.add(new BABYLON.Vector3(-BREATH_ARM_MOVE_X,BREATH_ARM_MOVE_Y,-BREATH_ARM_MOVE_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_shoulder_position
        }]);
        animationGroup.addTargetedAnimation(left_shoulder_position_idle, GameEngine.scene.getMeshByName("player_left_shoulder_joint"));

        var right_shoulder_position_idle= new BABYLON.Animation("right_shoulder_position_idle", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_shoulder_position = PlayerAnimations.getInitialJointPosition(player, "player_right_shoulder_joint")
        right_shoulder_position_idle.setKeys([
            {
                frame: 0, 
                value: initial_right_shoulder_position
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_right_shoulder_position.add(new BABYLON.Vector3(-BREATH_ARM_MOVE_X,BREATH_ARM_MOVE_Y,-BREATH_ARM_MOVE_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_right_shoulder_position
        }]);
        animationGroup.addTargetedAnimation(right_shoulder_position_idle, GameEngine.scene.getMeshByName("player_right_shoulder_joint"));

        var HIP_ROTATION_Z = toRadians(15)
        var HIP_ROTATION_X = toRadians(-10)
        //hipS ROTATION
        var left_hip_idle= new BABYLON.Animation("left_hip_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_hip_joint")
        left_hip_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(HIP_ROTATION_X,0.0,-HIP_ROTATION_Z))
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(HIP_ROTATION_X,0.0,-HIP_ROTATION_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_hip_rotation.add(new BABYLON.Vector3(HIP_ROTATION_X,0.0,-HIP_ROTATION_Z))
        }]);
        animationGroup.addTargetedAnimation(left_hip_idle, GameEngine.scene.getMeshByName("player_left_hip_joint"));

        var right_hip_idle= new BABYLON.Animation("right_hip_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_hip_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_hip_joint")
        right_hip_idle.setKeys([
            {
                frame: 0, 
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(HIP_ROTATION_X,0.0,HIP_ROTATION_Z))
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(HIP_ROTATION_X,0.0,HIP_ROTATION_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_right_hip_rotation.add(new BABYLON.Vector3(HIP_ROTATION_X,0.0,HIP_ROTATION_Z))
        }]);
        animationGroup.addTargetedAnimation(right_hip_idle, GameEngine.scene.getMeshByName("player_right_hip_joint"));

        //kneeS ROTATION
        var KNEE_ROTATION_Z = toRadians(15)
        var KNEE_ROTATION_X = toRadians(-20)
        var left_knee_idle= new BABYLON.Animation("left_knee_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_knee_joint")
        left_knee_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(KNEE_ROTATION_X,0.0,KNEE_ROTATION_Z))
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(KNEE_ROTATION_X,0.0,KNEE_ROTATION_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_knee_rotation.add(new BABYLON.Vector3(KNEE_ROTATION_X,0.0,KNEE_ROTATION_Z))
        }]);
        animationGroup.addTargetedAnimation(left_knee_idle, GameEngine.scene.getMeshByName("player_left_knee_joint"));

        var right_knee_idle= new BABYLON.Animation("right_knee_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_knee_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_knee_joint")
        right_knee_idle.setKeys([
            {
                frame: 0, 
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(KNEE_ROTATION_X,0.0,-KNEE_ROTATION_Z))
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(KNEE_ROTATION_X,0.0,-KNEE_ROTATION_Z))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_right_knee_rotation.add(new BABYLON.Vector3(KNEE_ROTATION_X,0.0,-KNEE_ROTATION_Z))
        }]);
        animationGroup.addTargetedAnimation(right_knee_idle, GameEngine.scene.getMeshByName("player_right_knee_joint"));
        
        //ELBOWS ROTATION
        var left_elbow_idle= new BABYLON.Animation("left_elbow_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_elbow_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_elbow_joint")
        left_elbow_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_elbow_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_left_elbow_rotation.add(new BABYLON.Vector3(-BREATH_ARM_Z*2,0.0,0.0))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_elbow_rotation
        }]);
        animationGroup.addTargetedAnimation(left_elbow_idle, GameEngine.scene.getMeshByName("player_left_elbow_joint"));

        var right_elbow_idle= new BABYLON.Animation("right_elbow_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_elbow_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_elbow_joint")
        right_elbow_idle.setKeys([
            {
                frame: 0, 
                value: initial_right_elbow_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_right_elbow_rotation.add(new BABYLON.Vector3(-BREATH_ARM_Z*2,0.0,0.0))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_right_elbow_rotation
        }]);
        animationGroup.addTargetedAnimation(right_elbow_idle, GameEngine.scene.getMeshByName("player_right_elbow_joint"));

        var FOOT_ROTATION_X = BREATH_ARM_Z*4
        //FEET ROTATION
        var left_foot_idle= new BABYLON.Animation("left_foot_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_left_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_left_foot_joint")
        left_foot_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-FOOT_ROTATION_X,0.0,0.0))
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-FOOT_ROTATION_X,0.0,0.0))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-FOOT_ROTATION_X,0.0,0.0))
        }]);
        animationGroup.addTargetedAnimation(left_foot_idle, GameEngine.scene.getMeshByName("player_left_foot_joint"));

        var right_foot_idle= new BABYLON.Animation("right_foot_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_right_foot_rotation = PlayerAnimations.getInitialJointRotation(player, "player_right_foot_joint")
        right_foot_idle.setKeys([
            {
                frame: 0, 
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-FOOT_ROTATION_X,0.0,0.0))
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_right_foot_rotation.add(new BABYLON.Vector3(-FOOT_ROTATION_X,0.0,0.0))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_left_foot_rotation.add(new BABYLON.Vector3(-FOOT_ROTATION_X,0.0,0.0))
        }]);
        animationGroup.addTargetedAnimation(right_foot_idle, GameEngine.scene.getMeshByName("player_right_foot_joint"));

        //CHEST BREATHING
        var upper_chest_idle= new BABYLON.Animation("upper_chest_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_upper_chest_rotation = PlayerAnimations.getInitialJointRotation(player, "player_upper_chest_joint")
        upper_chest_idle.setKeys([
            {
                frame: 0, 
                value: initial_upper_chest_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_upper_chest_rotation.add(new BABYLON.Vector3(BREATH_UPPER_CHEST_X,0.0,0.0))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_upper_chest_rotation
        }]);
        animationGroup.addTargetedAnimation(upper_chest_idle, GameEngine.scene.getMeshByName("player_upper_chest_joint"));

        var LOWER_CHEST_ANGLE = 0
        var lower_chest_forward= new BABYLON.Animation("lower_chest_jump", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointRotation(player, "player_lower_chest_joint")
        lower_chest_forward.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_ANGLE))
            }
        ]);
        
        animationGroup.addTargetedAnimation(lower_chest_forward, GameEngine.scene.getMeshByName("player_lower_chest_joint"));
        var LOWER_CHEST_OFFSET = 0
        var lower_chest_offset_idle= new BABYLON.Animation("lower_chest_offset_idle", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_lower_chest_position = PlayerAnimations.getInitialJointPosition(player, "player_lower_chest_joint")
        lower_chest_offset_idle.setKeys([
            {
                //RIGHT FORWARD 
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_lower_chest_position.add(new BABYLON.Vector3(0.0,0.0,LOWER_CHEST_OFFSET))
            }
        ]);
        animationGroup.addTargetedAnimation(lower_chest_offset_idle, GameEngine.scene.getMeshByName("player_lower_chest_joint"));

        //NECK BREATHING
        var neck_idle= new BABYLON.Animation("neck_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_neck_rotation = PlayerAnimations.getInitialJointRotation(player, "player_neck_joint")
        neck_idle.setKeys([
            {
                frame: 0, 
                value: initial_neck_rotation
            },{
                frame: 1 * PlayerAnimations.frameRate, 
                value: initial_neck_rotation.add(new BABYLON.Vector3(BREATH_HEAD_X,0.0,0.0))
            },{
                frame: 2 * PlayerAnimations.frameRate, 
                value: initial_neck_rotation
        }]);
        animationGroup.addTargetedAnimation(neck_idle, GameEngine.scene.getMeshByName("player_head"));


        var hip = new BABYLON.Animation("hip_idle", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_hip_position = PlayerAnimations.getInitialPosition(player, "player_hip_joint")
        hip.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_position
            }
        ]);
        animationGroup.addTargetedAnimation(hip, GameEngine.scene.getMeshByName("player_hip_joint"));

        
        var hip_rotation = new BABYLON.Animation("hip_rotation_idle", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);    
        var initial_hip_rotation = PlayerAnimations.getInitialRotation(player, "player_hip_joint")
        hip_rotation.setKeys([
            {
                //RIGHT FORWARD
                frame: 0 * PlayerAnimations.frameRate,
                value: initial_hip_rotation
            },
        ]);
        animationGroup.addTargetedAnimation(hip_rotation, GameEngine.scene.getMeshByName("player_hip_joint"));
        
        return animationGroup        
    }

    // This function performs a transition from the transformations left by the last animation to
    // the first keyframe of a targetAnimationGroup (activating or not the loopMode)
    static transitionToAnimationGroup(player, targetAnimationGroup, loopMode, transitionSpeedRatio, animationSpeedRatio, resumeList) {
        if(resumeList==undefined) resumeList = []
        if(transitionSpeedRatio==undefined) transitionSpeedRatio = 0.5
        if(animationSpeedRatio==undefined) animationSpeedRatio = 1
        var transitionGroup = new BABYLON.AnimationGroup("temporary_transition_group");
        Player.transitionGroup = transitionGroup
        for(var anim of targetAnimationGroup.targetedAnimations)
        {
            var targetMesh = GameEngine.scene.getMeshByName(anim.target.name)
            var targetProperty = anim.animation.targetProperty

            var fromValue;
            switch(targetProperty)
            {
                case "rotation":
                {
                    fromValue = (targetMesh.rotationQuaternion==null ? targetMesh.rotation : targetMesh.rotationQuaternion.toEulerAngles())
                    break;
                }
                case "position":
                {
                    fromValue = targetMesh.position
                    break;
                }
                default:
                {
                    throw "Animation transition for this property is not supported."
                }
            }

            var toValue = anim.animation.getKeys()[0].value
            /*if(targetValueScale)
            {
                if(anim.animation.dataType == BABYLON.Animation.ANIMATIONTYPE_VECTOR3)
                {
                    toValue = toValue.multiply(new BABYLON.Vector3())
                }
            }*/

            var transition_animation= new BABYLON.Animation("", targetProperty, PlayerAnimations.frameRate, anim.animation.dataType, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
            transition_animation.setKeys([
                {
                    frame: 0, 
                    value: fromValue
                },
                {
                    frame: 0.2 * PlayerAnimations.frameRate, 
                    value: toValue
                }
            ]);
            transitionGroup.addTargetedAnimation(transition_animation, targetMesh)
        }


        transitionGroup.onAnimationGroupEndObservable.add(function() {
            if(Settings.debugAnimations) console.log("Starting after transition: "+targetAnimationGroup.name)
            for(var animation of resumeList) 
            {
                animation.play()
            }
            targetAnimationGroup.start(loopMode, animationSpeedRatio)
            Player.transitionGroup = null
          });
        
        transitionGroup.start(false, transitionSpeedRatio)
    }

    //NOT USED (due to some bugs in Babylon): This function performs a transition from the transformations left by the last animation to
    // two the first keyframes of two targetAnimationGroup, by mixing their values (activating or not the loopMode)
    static transitionToAnimationGroups(player, targetAnimationGroup1, targetAnimationGroup2, loopMode, transitionSpeedRatio, animationSpeedRatio) {
        
        var transitionGroup = new BABYLON.AnimationGroup("temporary_transition_group");
        Player.transitionGroup = transitionGroup

        //1) Mix the animations into a map to find overlapping ones
        var tempMeshToAnimationMap = new Map()
        for(var anim1 of targetAnimationGroup1.targetedAnimations)
        {
            if(tempMeshToAnimationMap.get(anim1.target.name))
            {
                tempMeshToAnimationMap.get(anim1.target.name).push(anim1)
            }
            else
            {
                tempMeshToAnimationMap.set(anim1.target.name, [anim1])
                
            }
        }

        for(var anim2 of targetAnimationGroup2.targetedAnimations)
        {
            if(tempMeshToAnimationMap.get(anim2.target.name))
            {
                tempMeshToAnimationMap.get(anim2.target.name).push(anim2)
            }
            else
            {
                tempMeshToAnimationMap.set(anim2.target.name, [anim2])
                console.log(tempMeshToAnimationMap.get(anim2.target.name))
            }
        }

        var toValues = [];
        //2) Find animations referring to the same property of the same mesh and mix them
        for( var [meshName, animations] of tempMeshToAnimationMap)
        {
            var rotation;
            var position;
            for(var anim of animations)
            {
                switch(anim.animation.targetProperty)
                {
                    case "rotation":
                    {
                        if(rotation)
                        {
                            rotation = rotation.add(anim.animation.getKeys()[0].value).subtract(PlayerAnimations.getInitialJointRotation(player, meshName))
                        }
                        else
                        {
                            rotation = anim.animation.getKeys()[0].value.subtract(PlayerAnimations.getInitialJointRotation(player, meshName))
                        }
                        break;
                    }

                    case "position":
                    {
                        if(position)
                        {
                            position = position.add(anim.animation.getKeys()[0].value).subtract(PlayerAnimations.getInitialJointPosition(player, meshName))
                        }
                        else
                        {
                            console.log(meshName)
                            position = anim.animation.getKeys()[0].value.subtract(PlayerAnimations.getInitialJointPosition(player, meshName))
                        }
                        break;
                    }
                    default:
                    {
                        throw "Animation transition for this property is not supported: "+targetProperty+""
                    }
                }
            }
            if(rotation) toValues.push({meshName: meshName, targetProperty: "rotation", value:rotation, dataType: BABYLON.Animation.ANIMATIONTYPE_VECTOR3})
            if(position) toValues.push({meshName: meshName, targetProperty: "position", value:position, dataType: BABYLON.Animation.ANIMATIONTYPE_VECTOR3})
        }

        console.log(toValues)
        //3) Create a group of transition animations
        for(var toValue of toValues)
        {
            var targetMesh = GameEngine.scene.getMeshByName(toValue.meshName)
            var targetProperty = toValue.targetProperty
            
            var fromValue;
            switch(targetProperty)
            {
                case "rotation":
                {
                    fromValue = (targetMesh.rotationQuaternion==null ? targetMesh.rotation : targetMesh.rotationQuaternion.toEulerAngles())
                    break;
                }
                case "position":
                {
                    fromValue = targetMesh.position
                    break;
                }
                default:
                {
                    throw "Animation transition for this property is not supported: "+targetProperty
                }
            }

            var toValue = toValue.value

            var transition_animation= new BABYLON.Animation("", targetProperty, PlayerAnimations.frameRate, toValue.dataType, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
            transition_animation.setKeys([
                {
                    frame: 0, 
                    value: fromValue
                },
                {
                    frame: 0.2 * PlayerAnimations.frameRate, 
                    value: toValue
                }
            ]);
            transitionGroup.addTargetedAnimation(transition_animation, targetMesh)
        }

        //4) Start only the second target animation group (as the first one is supposed to be running already)
        transitionGroup.onAnimationGroupEndObservable.add(function() {
            console.log("Starting after transition: "+targetAnimationGroup2.name)
            targetAnimationGroup2.start(loopMode, animationSpeedRatio)
            Player.transitionGroup = null
          });
        
        if(transitionSpeedRatio==undefined) transitionSpeedRatio = 0.5
        if(animationSpeedRatio==undefined) animationSpeedRatio = 1
        //console.log(transitionGroup)
        transitionGroup.start(false, transitionSpeedRatio)
    }
    

    //NOT USED - This function performs a transition from the transformations left by the last animation to
    // a target idle animation group, restoring the player initial state first, then starting
    //the idle animation (activating or not the loopMode).
    static transitionToIdleState(player, targetIdleGroup, loopMode, speedRatio, holdingObject) {
                
        Player.transitionGroup = transitionGroup
        var transitionGroup = new BABYLON.AnimationGroup("temporary_transition_group");
        for(var [mesh_name, initial_positions] of player.metaData.get("initial_joint_positions"))
        {
            if(mesh_name=="player_collider") continue;
            var targetMesh = GameEngine.scene.getMeshByName(mesh_name)

            //This corrects the Bug in babylon where the rotationQuaternion is reset to null
            var targetRotation = (targetMesh.rotationQuaternion==null ? targetMesh.rotation : targetMesh.rotationQuaternion.toEulerAngles())
            //if(Math.abs(targetRotation.length() - initial_positions.rotation.length())>BABYLON.Epsilon)
            //{
                var transition_rotation= new BABYLON.Animation("", "rotation", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
                transition_rotation.setKeys([
                    {
                        frame: 0, 
                        value: targetRotation
                    },
                    {
                        frame: 0.2 * PlayerAnimations.frameRate, 
                        value: initial_positions.rotation
                    }
                ]);
                transitionGroup.addTargetedAnimation(transition_rotation, targetMesh)
            //}
            //if(Math.abs(targetMesh.position.length() - initial_positions.position.length())>BABYLON.Epsilon)
            //{
                var transition_position= new BABYLON.Animation("", "position", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
                transition_position.setKeys([
                    {
                        frame: 0, 
                        value: targetMesh.position
                    },
                    {
                        frame: 0.2 * PlayerAnimations.frameRate, 
                        value: initial_positions.position
                    }
                ]);
                transitionGroup.addTargetedAnimation(transition_position, targetMesh)
            //}
            /*
            var transition_scaling= new BABYLON.Animation("", "scaling", PlayerAnimations.frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);    
            transition_scaling.setKeys([
                {
                    frame: 0, 
                    value: targetMesh.scaling
                },
                {
                    frame: 1 * PlayerAnimations.frameRate, 
                    value: initial_positions.scaling
                }
            ]);
            transitionGroup.addTargetedAnimation(transition_scaling, targetMesh)*/
        }

        transitionGroup.onAnimationGroupEndObservable.add(function() {
            console.log("Starting after transition: "+targetIdleGroup.name)
            targetIdleGroup.start(loopMode)
            Player.transitionGroup = null
          });
        
        if(speedRatio==undefined) speedRatio = 0.5
        transitionGroup.start(false, speedRatio)
    }
}