//This class acts as an enumeration for possible camera modes
const CameraMode = { FREE:1, FIRST_PERSON:2, THIRD_PERSON:3, MENU_CAMERA:4 };

// This class contains all settings flags used for debug during development
// plus some constants
class Settings {
    static debugLayer = false;
    static debugPhysics = false;
    static showBoundingBox = false;
    static debugPicking = false;
    static debugPlayerAnimations = false;
    static debugCamera = false
    static debugControls = false
    static debugLevels = false
    static debugHighlight = false
    static debugShooters = false;

    static testLevel = false;

    static showNormals = false;
    static showPhysicsViewer = true;
    static defaultCameraMode = CameraMode.FIRST_PERSON
    static inputMap;
    static animatePlayer = true;

    static MenuCameraRotationSpeed = 1

    static FirstPersonSpeed = 6
    static ThirdPersonSpeed = 4

    static lowerCameraRadiusLimit = 2.2
    static upperCameraRadiusLimit = 6
    static cameraRadiusIncrement = 0.00001
    static FirstPersonCameraMinRotationX = toRadians(-89)
    static FirstPersonCameraMaxRotationX = toRadians(89)
    static ThirdPersonCameraMinRotationX = toRadians(-60)
    static ThirdPersonCameraMaxRotationX = toRadians(30)
    static cameraAlphaOffset = toRadians(-90)
    static XMouseSensitivity = 1/500
    static YMouseSensitivity = 1/500
    static invertYMouseAxis = false
    static invertXMouseAxis = false

    static maxPickableObjectDistance = 5
    static minObjectLaunchForces = {base: 5};
    static maxObjectLaunchForces = {base: 15};
    static objectStraightLaunchForce = 50;
    static launchForceIncrements = {base: 0.1};

    static minDespawnHeight = -5
}

// This class contains all key mappings
class KeyMap {
    static forward = "w"
    static left = "a"
    static right = "d"
    static backward = "s"
    static toggleCameraMode = "r"
    static pickObject = "f"
    static jump = " "
    static openMenu = "m"
    static sideView = "t"
}
