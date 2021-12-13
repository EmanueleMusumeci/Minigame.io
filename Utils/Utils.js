function toRadians(degrees) {return degrees * Math.PI / 180}
function toDegrees(radians) {return radians * 180 / Math.PI}

//Debug function that prints info about a hierarchical mesh
function printMeshTree(root, depth)
{
    if(mesh==null) return
    console.log("_".repeat(depth)+mesh.name)
    for(mesh of root.getChildren())
    {
        printMeshTree(mesh)
    }
}

function getMeshHeight(mesh) {
    return mesh.getBoundingInfo().boundingBox.extendSize.y*2
}

function getMeshWidth(mesh) {
    return mesh.getBoundingInfo().boundingBox.extendSize.x*2
}

function getMeshDepth(mesh) {
    return mesh.getBoundingInfo().boundingBox.extendSize.z*2
}

//snippet taken from https://doc.babylonjs.com/snippets/normals
//for debug purposes
function showNormalLines(mesh, size, color, sc) {
    if(normalLines!=undefined)
    {
        normalLines.dispose()
        normalLines = undefined
    }
    var normals = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    color = color || BABYLON.Color3.White();
    sc = sc || scene;
    size = size || 1;

    var lines = [];
    for (var i = 0; i < normals.length; i += 3) {
        var v1 = BABYLON.Vector3.FromArray(positions, i);
        var v2 = v1.add(BABYLON.Vector3.FromArray(normals, i).scaleInPlace(size));
        lines.push([v1.add(mesh.position), v2.add(mesh.position)]);
    }
    normalLines = BABYLON.MeshBuilder.CreateLineSystem("normalLines", {lines: lines}, sc);
    normalLines.color = color;
}

//NOT USED - Code snippet found on https://doc.babylonjs.com/resources/baking_transformations
function bakeTransformationsForNormals(mesh) {
    var indices = mesh.getIndices();
    var normals = mesh.getVerticesData(VertexBuffer.NormalKind);
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    mesh.updateVerticesData(BABYLON.VertexBuffer.NormalKind, normals, false, false);
}

function bakeTransformations(mesh) {
    mesh.bakeTransformIntoVertices(mesh.getWorldMatrix());
}

function makeHierarchyUnpickable(mesh) {
    if(mesh) mesh.isPickable = false;
    else return
    for(var child of mesh.getChildren())
    {
        makeHierarchyUnpickable(child)
    }
}

//This function is used in the creation of the player model to store geometric info
//in the mesh metaData
function storeInitialTransformationsInMap(mesh, map, containing) {
    if(mesh==null || mesh==undefined) return map

    var rotation = sanitizeRotation(mesh.rotationQuaternion)
    
    if(containing!=undefined)
    {
        if(mesh.name.includes(containing)) 
        {
            map.set(mesh.name, {rotation: rotation, position: mesh.position, scale:mesh.scaling})
        }
    }
    else map.set(mesh.name, {rotation: rotation, position: mesh.position, scale:mesh.scaling})

    for(var child of mesh.getChildren())
    {
        map=storeInitialTransformationsInMap(child,map, containing)
    }

    return map
}

//Avoids a bug in Babylon that sets rotationQuaternions of unrotated meshes to null
function sanitizeRotation(rotationQuaternion)
{
    return (rotationQuaternion==null ? BABYLON.Vector3.Zero() : rotationQuaternion.toEulerAngles())
}

//Maps mesh instances of hierarchical mesh to their names
function mapHierarchyParts(mesh, map, containing) {
    if(mesh==null || mesh==undefined) return map
    
    if(containing!=undefined)
    {
        if(mesh.name.includes(containing)) 
        {
            map.set(mesh.name, mesh)
        }
    }
    else map.set(mesh.name, mesh)
    for(var child of mesh.getChildren())
    {
        map=mapHierarchyParts(child,map, containing)
    }

    return map
}

//Chooses a unique name starting from a basename and adding a number at the end
function chooseUniqueName(scene, baseName)
{
    var number=0
    var name = baseName+"_"+number
    while(scene.getMeshByName(name))
    {
        number+=1
        name = baseName+"_"+number
    }

    return name
}

//Using a feeler ray, detects the object in front of the camera (used in the highlight/pick up logic)
function pickCurrentAimedTarget (scene, camera) {
    var ray = new BABYLON.Ray(camera.position, camera.getTarget().subtract(camera.position));
    var pickInfo = scene.pickWithRay(ray);
    // if we actually hit something with our ray we do something
    //console.log(pickInfo)
    if (pickInfo.hit) {
        //console.log("You are looking at: " + pickInfo.pickedMesh.name);
        return pickInfo.pickedMesh
    }
    return undefined   
}

//SNIPPET TAKEN FROM https://www.html5gamedevs.com/topic/15079-rotating-a-vector/
function rotateVector(vect, quat) {
    var matr = new BABYLON.Matrix();
    quat.toRotationMatrix(matr);
    var rotatedvect = BABYLON.Vector3.TransformCoordinates(vect, matr);
    return rotatedvect;
}

function multiplyVector3WithScalar(vector, scalar)
{
    return vector.multiply(new BABYLON.Vector3(scalar,scalar,scalar))
}

//Generates random numbers
function generateRandom(from, to, integer)
{
    if(integer) return Math.floor(Math.random() * (to - from + 1)) + from;
    else return Math.random() * (to - from + 1) + from
}