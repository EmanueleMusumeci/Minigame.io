
//This class acts as an interface to the Physics engine in order to reuse the code
//to create physics impostors and to enforce a singleton pattern on the physics engine
class Physics {
    static physicsViewer;
    static gravityVector = new BABYLON.Vector3(0, -9.81, 0);
    static collisionFilterGroups = new Map()

    //Engine initialization
    static init(scene, framerate)
    {
        scene.enablePhysics(Physics.gravityVector, new BABYLON.CannonJSPlugin());
        var engine = scene.getPhysicsEngine()
        Physics.collisionFilterGroups.set("ground", 1)
        Physics.collisionFilterGroups.set("objects", 2)
        Physics.collisionFilterGroups.set("player", 4)
        return engine
    }

    //Creates the viewer used to debug the physics impostors
    static viewer()
    {
        Physics.physicsViewer = new BABYLON.Debug.PhysicsViewer();
    }

    static addToViewer(mesh) {
        if(Physics.physicsViewer != undefined) Physics.physicsViewer.showImpostor(mesh.physicsImpostor, mesh)
    }
    
    //The following functions create physics impostors
    static createBoxImpostor(scene, entity, options, hideOnViewer) {
        entity.physicsImpostor = new BABYLON.PhysicsImpostor(entity, BABYLON.PhysicsImpostor.BoxImpostor, options, scene);
        if(Physics.physicsViewer!=undefined || hideOnViewer!=false) Physics.addToViewer(entity);
    }
    static createCylinderImpostor(scene, entity, options, hideOnViewer) {
        entity.physicsImpostor = new BABYLON.PhysicsImpostor(entity, BABYLON.PhysicsImpostor.CylinderImpostor, options, scene);
        if(Physics.physicsViewer!=undefined || hideOnViewer!=false) Physics.addToViewer(entity);
    }
    static createSphereImpostor(scene, entity, options) {
        entity.physicsImpostor = new BABYLON.PhysicsImpostor(entity, BABYLON.PhysicsImpostor.SphereImpostor, options, scene);
        if(Physics.physicsViewer!=undefined || hideOnViewer!=false) Physics.addToViewer(entity);
    }
    static createMeshImpostor(scene, entity, options) {
        entity.physicsImpostor = new BABYLON.PhysicsImpostor(entity, BABYLON.PhysicsImpostor.MeshImpostor, options, scene);
        if(Physics.physicsViewer!=undefined || hideOnViewer!=false) Physics.addToViewer(entity);
    }
    
    //The following functions create bounding boxes to act as colliders for complex meshes
    static createBoxCollider(scene, name, position, dimensions, visible) {
        var boxCollider = BABYLON.MeshBuilder.CreateBox(name, {height: dimensions.y, width: dimensions.x, depth: dimensions.z}, scene);
        boxCollider.position = position
        
        if(visible!=true) boxCollider.visibility = 0;
        else boxCollider.visibility = 0.5

        return boxCollider;

    }

    static createBoxColliderForMesh(scene, mesh, width, height, depth, visible) {
        
        var boxCollider = BABYLON.MeshBuilder.CreateBox(mesh.id+"_collider", {height: height, width: width, depth: depth}, scene);
        boxCollider.position = mesh.getAbsolutePosition() 
        
        if(visible!=true) boxCollider.visibility = 0;
        else boxCollider.visibility = 0.5

        return boxCollider;
    
    }
    
    static createMeshColliderForMesh(scene, mesh, position, visible) {
        
        var collider = mesh.clone(mesh.id+"_collider")
        if(position==undefined) boxCollider.position = mesh.getAbsolutePosition() 
        else boxCollider.position = position

        if(visible!=true) boxCollider.visibility = 0;
        else boxCollider.visibility = 0.5
        
    
        return collider;
    
    }
    
    static createSphereColliderForMesh(scene, mesh, radius, visible) {
    
        var sphereCollider = BABYLON.MeshBuilder.CreateSphere(mesh.id+"_collider", {diameter: radius*2}, scene);
        sphereCollider.position = mesh.getAbsolutePosition()

        if(visible!=true) boxCollider.visibility = 0;
        else boxCollider.visibility = 0.5
        
    
        return sphereCollider;
    }
    
    //NOT USED - recursively creates physics impostors on each node of a hierarchical mesh (proved to be problematic)
    static createBoxCompoundBody(scene, root, addImpostors) {
        //NOTICE: position is relative to parent if root is a child node
        var width = getMeshWidth(root)
        var height = getMeshHeight(root)
        var depth = getMeshDepth(root)
        var collider; 
        if(root.parent) collider = Physics.createBoxColliderForMesh(scene, root, width, height, depth)
        else collider = new BABYLON.Mesh(root.id+"_collider", scene);
        collider.addChild(root)
        for(var child of root.getChildren(null, true)) {
            if(child==null) continue;
    
            var childCollider = Physics.createBoxCompoundBody(scene,child, addImpostors);
            collider.addChild(childCollider)
        }
        if(addImpostors) {
            var ignoreParent = (true ? root.parent : false)
            Physics.createPhysicsImpostor(scene, collider, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0.1, ignoreParent: true})
        }
        
        return collider;
    }
    
    //NOT USED - creates physics impostors on each node of a hierarchical mesh (proved to be problematic)
    static createPhysicalColliderForMesh(scene, mesh, visible) {
        //NOTICE: position is relative to parent if root is a child node
        var width = getMeshWidth(mesh)
        var height = getMeshHeight(mesh)
        var depth = getMeshDepth(mesh)
        var collider = Physics.createBoxColliderForMesh(scene, mesh, width, height, depth, visible);
        collider.addChild(mesh)
        mesh.position = new BABYLON.Vector3(0,0,0)
        Physics.createBoxImpostor(scene, collider, {mass: 0.1}, !visible)
        return collider
    }
    
}

