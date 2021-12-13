//This class contains materials references(with or without textures) and their
//initialization functions. All materials are initialized at once, before the game
//loads the levels (at the moment the menu background level is loaded) to avoid having
//missing textures when a level is loaded
class Materials {
    static woodMaterial;
    static concreteMaterial;
    static woodTableMaterial;
    static basketBallMaterial;
    static basketBackboardMaterial;
    static woodFloorMaterial;
    static metal0Material;
    static metal1Material;
    static targetMaterial;
    static colliderMaterial;


    //Material initialization functions. Notice that some materials are PBR, so they use a multi-layered
    //texture

    static woodMaterialInit(scene) {
        var material = new BABYLON.PBRMaterial("woodMaterial", scene);
        material.albedoTexture = new BABYLON.Texture("Materials/textures/wood/wood_Color.jpg", scene);
        material.bumpTexture = new BABYLON.Texture("Materials/textures/wood/wood_Normal.jpg", scene);
        material.metallic = 0.15
        material.metallicF0 = 0.2
        material.roughnessTexture = new BABYLON.Texture("Materials/textures/wood/wood_Roughness.jpg", scene);
        material.roughness = 0.55
        material.usePhysicalLightFalloff = false
        material.invertNormalMapY = true
        material.microSurfaceTexture = new BABYLON.Texture("Materials/textures/wood/wood_Displacement.jpg", scene);
        material.bumpStrength = 2.0
        material.ambientColor = new BABYLON.Color3(0.7, 0.7, 0.7);

        return material
    }

    static woodTableMaterialInit(scene) {
        var material = new BABYLON.PBRMaterial("woodTableMaterial", scene);
        material.albedoTexture = new BABYLON.Texture("Materials/textures/woodTable/wood_Color.png", scene);
    }

    static basketBallMaterialInit(scene) {
        
        var material = new BABYLON.StandardMaterial("basketBallMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("Materials/textures/basketball/balldimpled.png", scene);
        return material
    }

    static basketBackboardMaterialInit(scene) {
        
        var material = new BABYLON.StandardMaterial("basketBackboardMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("Materials/textures/basket_backboard/backboard.jpg", scene);
        return material
    }
    static woodFloorMaterialInit(scene) {
        var material = new BABYLON.PBRMaterial("woodFloorMaterial", scene);
        material.albedoTexture = new BABYLON.Texture("Materials/textures/woodFloor/WoodFloor031_2K_Color.jpg", scene);
        material.bumpTexture = new BABYLON.Texture("Materials/textures/woodFloor/WoodFloor031_2K_Normal.jpg", scene);
        material.metallic = 0.15
        material.metallicF0 = 0.2
        material.roughnessTexture = new BABYLON.Texture("Materials/textures/woodFloor/WoodFloor031_2K_Roughness.jpg", scene);
        material.roughness = 0.55
        material.usePhysicalLightFalloff = false
        material.invertNormalMapY = true
        material.microSurfaceTexture = new BABYLON.Texture("Materials/textures/woodFloor/WoodFloor031_2K_Displacement.jpg", scene);
        material.bumpStrength = 2.0
        material.ambientColor = new BABYLON.Color3(0.7, 0.7, 0.7);

        return material
    }

    static metal0MaterialInit(scene) {
        var material = new BABYLON.PBRMaterial("metal0Material", scene);
        //material.albedoTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Color.jpg", scene);
        material.albedoColor = new BABYLON.Color3(0.8,0.8,0.8)
        material.bumpTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Normal.jpg", scene);
        material.metallicTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Metalness.jpg", scene);
        material.metallic = 0.6
        material.metallicF0 = 0.65
        material.roughnessTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Roughness.jpg", scene);
        material.roughness = 0.6
        material.usePhysicalLightFalloff = false
        material.microSurfaceTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Displacement.jpg", scene);
        material.bumpStrength = 2.0
        material.ambientColor = new BABYLON.Color3(0.5, 0.5, 0.5);

        return material
    }

    static metal1MaterialInit(scene) {
        var material = new BABYLON.PBRMaterial("metal1Material", scene);
        material.albedoTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Color.jpg", scene);
        material.bumpTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Normal.jpg", scene);
        material.metallicTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Metalness.jpg", scene);
        material.metallic = 0.6
        material.metallicF0 = 0.65
        material.roughnessTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Roughness.jpg", scene);
        material.roughness = 0.6
        material.usePhysicalLightFalloff = false
        material.microSurfaceTexture = new BABYLON.Texture("Materials/textures/metal1/metal1_Displacement.jpg", scene);
        material.bumpStrength = 2.0
        material.ambientColor = BABYLON.Color3.White();

        return material
    }

    static metalDiamondPlateInit(scene) {
        var material = new BABYLON.PBRMaterial("metalDiamondPlateMaterial", scene);
        material.albedoTexture = new BABYLON.Texture("Materials/textures/metalDiamondPlate/DiamondPlate003_2K_Color.jpg", scene);
        material.bumpTexture = new BABYLON.Texture("Materials/textures/metalDiamondPlate/DiamondPlate003_2K_Normal.jpg", scene);
        material.metallicTexture = new BABYLON.Texture("Materials/textures/metalDiamondPlate/DiamondPlate003_2K_Metalness.jpg", scene);
        material.metallic = 0.6
        material.metallicF0 = 0.65
        material.roughnessTexture = new BABYLON.Texture("Materials/textures/metalDiamondPlate/DiamondPlate003_2K_Roughness.jpg", scene);
        material.roughness = 0.6
        material.usePhysicalLightFalloff = false
        material.microSurfaceTexture = new BABYLON.Texture("Materials/textures/metalDiamondPlate/DiamondPlate003_2K_Displacement.jpg", scene);
        material.bumpStrength = 2.0
        material.ambientColor = BABYLON.Color3.White();

        //Correct the texture scale
        var scale = 15
        material.albedoTexture.uScale=scale;
        material.albedoTexture.vScale=scale;

        material.bumpTexture.uScale=scale;
        material.bumpTexture.vScale=scale;

        material.metallicTexture.uScale=scale;
        material.metallicTexture.vScale=scale;

        material.roughnessTexture.uScale=scale;
        material.roughnessTexture.vScale=scale;
        
        material.microSurfaceTexture.uScale=scale;
        material.microSurfaceTexture.vScale=scale;


        return material
    }

    static target1MaterialInit(scene) {
        
        var material = new BABYLON.StandardMaterial("targetMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("Materials/textures/target/target1.png", scene);
        return material
    }

    static target2MaterialInit(scene) {
        
        var material = new BABYLON.StandardMaterial("targetMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("Materials/textures/target/target2.png", scene);
        return material
    }

    static target3MaterialInit(scene) {
        
        var material = new BABYLON.StandardMaterial("targetMaterial", scene);
        material.diffuseTexture = new BABYLON.Texture("Materials/textures/target/target3.png", scene);
        return material
    }

    static colliderMaterialInit(scene) {
        var material = new BABYLON.StandardMaterial("collider_material", scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 1);
        material.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
        material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        material.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        return material
    }

    //This function initializes each material and holds its reference in a static field
    //of the class
    
    static initMaterials(scene)
    {
        Materials.woodMaterial = Materials.woodMaterialInit(scene)
        Materials.woodTableMaterial = Materials.woodTableMaterialInit(scene)
        Materials.basketBallMaterial = Materials.basketBallMaterialInit(scene)
        Materials.basketBackboardMaterial = Materials.basketBackboardMaterialInit(scene)
        Materials.woodFloorMaterial = Materials.woodFloorMaterialInit(scene)
        Materials.metal0Material = Materials.metal0MaterialInit(scene)
        Materials.metal1Material = Materials.metal1MaterialInit(scene)
        Materials.target1Material = Materials.target1MaterialInit(scene)
        Materials.target2Material = Materials.target2MaterialInit(scene)
        Materials.target3Material = Materials.target3MaterialInit(scene)
        Materials.colliderMaterial = Materials.colliderMaterialInit(scene)
        Materials.metalDiamondPlate = Materials.metalDiamondPlateInit(scene)
    }
}