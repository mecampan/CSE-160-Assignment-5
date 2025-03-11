// Credits
// SpaceShip Hud Provided by EdgeC https://www.deviantart.com/edgec/art/Dragonclaw-Armor-HUD-341243746
// Spaceship Model Provided by javier8 https://free3d.com/3d-model/low-poly-spaceship-37605.html
// Sun Model Provided by printable_models https://free3d.com/3d-model/sun-v2--446713.html
// Mercury Model Provided by gerhald3d https://free3d.com/3d-model/mercury-photorealistic-1k-260439.html
// Earth Model Provided by themi97 https://free3d.com/3d-model/photorealistic-earth-98256.html
// Mars Model Provided by gerhald3d https://free3d.com/3d-model/mars-photorealistic-2k-671043.html
// Jupiter Model Provided by ali_alkendi https://free3d.com/3d-model/jupiter-planet-4448.html
// Saturn Model Provided by ali_alkendi https://free3d.com/3d-model/saturn-planet-8840.html
// Saturn Ring Texture Provided by Niko22966 https://www.deviantart.com/niko22966/art/Rings-of-Saturn-419585311
// Uranus Model Provided by jmbosch https://free3d.com/3d-model/uranus-75291.html
// Uranus Ring Texture Provided by blackstaviru64 https://favpng.com/png_view/uranus-the-trooth-texture-mapping-planet-mykolaiv-png/0rw9hFBt
// Neptune Model Provided by jmbosch https://free3d.com/3d-model/neptune-82847.html

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

function main() 
{
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 10000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 80 );

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

    let orbitalSpeed = 0.00001;
    let rotationSpeed = 365.25 * orbitalSpeed;
    
    const settings = { 
        planetSpeeds: 1,
        orbitsPaused: false,
        rotationsPaused: false,
        cameraSwap: false,
        planetLabels: true,
        hudOpacity: 0.5,

        orbits: "Pause Orbits",
        rotations: "Pause Rotations",
        labels: "Hide Planet Labels",
        camera: "Ship View",
    
        pauseOrbits: function() {
            settings.orbitsPaused = !settings.orbitsPaused;
            settings.orbits = settings.orbitsPaused ? "Resume Orbits" : "Pause Orbits";
            updateGUI();
        },
    
        pauseRotations: function() {
            settings.rotationsPaused = !settings.rotationsPaused;
            settings.rotations = settings.rotationsPaused ? "Resume Rotations" : "Pause Rotations";
            updateGUI();
        },

        showPlanetLabels: function() {
            settings.planetLabels = !settings.planetLabels;
            settings.labels = settings.planetLabels ? "Hide Planet Labels" : "Show Planet Labels";
        
            Object.values(planetLabels).forEach(label => {
                label.visible = settings.planetLabels;
            });
        
            updateGUI();
        },        

        swapCameras: function() {
            settings.cameraSwap = !settings.cameraSwap;
            settings.camera = settings.cameraSwap ? "Space View" : "Ship View";
            overlayPlane.visible = settings.cameraSwap? true : false;
            updateGUI();
        }
    };
    const gui = new GUI();

    // Create a folder for planet controls
    const planetFolder = gui.addFolder('Planet Controls');
    planetFolder.add(settings, 'planetSpeeds', 0, 5000).name("Fast Forward");
    const orbitsControl = planetFolder.add(settings, 'pauseOrbits').name(settings.orbits);
    const rotationsControl = planetFolder.add(settings, 'pauseRotations').name(settings.rotations);
    const labelControl = planetFolder.add(settings, 'showPlanetLabels').name(settings.labels);
    planetFolder.open(); // Open by default (optional)
    
    // Create a separate folder for camera & HUD controls
    const cameraHUDfolder = gui.addFolder('Camera & HUD');
    const cameraControl = cameraHUDfolder.add(settings, 'swapCameras').name(settings.camera);
    cameraHUDfolder.add(settings, 'hudOpacity', 0, 1, 0.05).name("Ship HUD Opacity").onChange((value) => {
        overlayMaterial.opacity = value;
    });
    cameraHUDfolder.open(); // Open by default (optional)
    
    // Function to update GUI element names dynamically
    function updateGUI() {
        orbitsControl.name(settings.orbits);
        rotationsControl.name(settings.rotations);
        labelControl.name(settings.labels);
        cameraControl.name(settings.camera);
    }
    
	{
		const color = 0xFFFFFF;
		const intensity = 0.005;
		const light = new THREE.AmbientLight( color, intensity );
		scene.add( light );
	}

	{
		const loader = new THREE.CubeTextureLoader();
		const texture = loader.load( [
			'images/stars.jpg',
			'images/stars.jpg',
			'images/stars.jpg',
			'images/stars.jpg',
			'images/stars.jpg',
			'images/stars.jpg'
		] );
		scene.background = texture;
	}

	{
		const mtlLoader = new MTLLoader();
		mtlLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill/windmill-fixed.mtl', ( mtl ) => 
        {
			mtl.preload();
			const objLoader = new OBJLoader();
			mtl.materials.Material.side = THREE.DoubleSide;
			objLoader.setMaterials( mtl );
			objLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill/windmill.obj', ( root ) => 
            {
				//scene.add( root );
			} );
		} );
	}
    
	function resizeRendererToDisplaySize( renderer ) 
    {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) 
			renderer.setSize( width, height, false );
		
		return needResize;
	}
    

    const spaceShip = new THREE.Group();
    spaceShip.position.set(32, 0, 5);
    spaceShip.rotation.y = 19.5;
	scene.add( spaceShip );

	{
		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.PointLight( color, intensity );
        light.position.set(0, 0, 1);
		spaceShip.add( light );
	}

    const rotationObj = new THREE.Group();
    rotationObj.rotateY(1.5);
    spaceShip.add(rotationObj);

    const textureLoader = new THREE.TextureLoader();
    const overlayMaterial = new THREE.MeshBasicMaterial({ 
        map: null,  // Start with null until texture loads
        transparent: true, 
        opacity: settings.hudOpacity,
        side: THREE.DoubleSide 
    });
    
    const overlayGeometry = new THREE.PlaneGeometry(3, 1.5);
    overlayGeometry.attributes.uv.needsUpdate = true; // Ensure correct mapping
    
    const overlayPlane = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlayPlane.position.set(2, 0, 0);
    overlayPlane.rotateY(1.6);
    overlayPlane.visible = false;
    overlayPlane.raycast = () => {}; // Disables raycasting on the overlay
    spaceShip.add(overlayPlane);
    
    // Load texture and apply it
    textureLoader.load('images/spaceShipHud.png', function(texture) {
        overlayMaterial.map = texture;
        overlayMaterial.needsUpdate = true;
    });


    const spaceshipObj = `objects/spaceship/spaceship.obj`;
    const spaceshipMtl = `objects/spaceship/spaceship.mtl`;
    load3dObj(rotationObj, "spaceShip", spaceshipObj, spaceshipMtl, 0.2, [0, 0, 0], true);
	
    const camera2 = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera2.position.set(0.3, 0, 0);
    camera2.lookAt(new THREE.Vector3(90, 0, 0));
    spaceShip.add(camera2);

    // Spaceship movement variables
    let velocity = new THREE.Vector3();  // Current velocity
    let acceleration = new THREE.Vector3(); // Current acceleration
    const maxSpeed = 0.1;  // Max speed limit
    const accelerationRate = 0.01 / 3; // Acceleration increment
    const dragFactor = 0.98; // Drag to gradually slow down
    const shipRotation = THREE.MathUtils.degToRad(1); // Rotation speed

    // Track which keys are currently held down
    const keys = {};

    // Event listeners to track key state
    document.addEventListener("keydown", (event) => keys[event.code] = true);
    document.addEventListener("keyup", (event) => keys[event.code] = false);

    function updateSpaceshipMovement() {
        // Reset acceleration
        acceleration.set(0, 0, 0);

        // Get the ship's local forward direction (X-axis)
        const forward = new THREE.Vector3(1, 0, 0); 
        forward.applyQuaternion(spaceShip.quaternion); // Align with ship's rotation

        // Apply acceleration based on keys held down
        if (keys["KeyW"]) { // Move forward
            acceleration.addScaledVector(forward, accelerationRate);
        }
        if (keys["KeyS"]) { // Move backward
            acceleration.addScaledVector(forward, -accelerationRate);
        }
        if (keys["KeyA"]) { // Rotate left
            spaceShip.rotateY(shipRotation);
        }
        if (keys["KeyD"]) { // Rotate right
            spaceShip.rotateY(-shipRotation);
        }

        // Apply acceleration to velocity
        velocity.add(acceleration);

        // Clamp velocity to max speed
        velocity.clampLength(0, maxSpeed);

        // Apply velocity to spaceship position
        spaceShip.position.add(velocity);

        // Apply drag to gradually slow down
        velocity.multiplyScalar(dragFactor);
    }
    const planetData = [
        { name: "sun", distance: 0 },
        { name: "mercury", distance: 20 },
        { name: "venus", distance: 30 },
        { name: "earth", distance: 40 },
        { name: "mars", distance: 50 },
        { name: "jupiter", distance: 100 },
        { name: "saturn", distance: 120 },
        { name: "uranus", distance: 140 },
        { name: "neptune", distance: 160 },

        { name: "astroid", distance: 0 },
        { name: "kupier", distance: 0 },
    ];
    
    // Store references in an object
    const planetGroups = {};
    
    planetData.forEach(planet => {
        const orbit = new THREE.Group();        // Main orbit container
        const location = new THREE.Group();     // Holds the planet's position
        const rotation = new THREE.Group();     // Handles planet rotation
    
        location.position.set(planet.distance, 0, 0); // Set the orbital distance
    
        // Structure:
        // orbit -> location -> rotation (which holds the planet model)
        orbit.add(location);
        location.add(rotation);
    
        // Store references for easy access later
        planetGroups[planet.name] = { orbit, location, rotation };
    
        // Add to the scene
        scene.add(orbit);
    });

    const astroidBelt = createAstroids(planetGroups["astroid"].location, 5000, 70, 90);    
    const kuiperBelt = createAstroids(planetGroups["kupier"].location, 10000, 175, 200);    

    const sunObj = `objects/sun/sun.obj`;
    const sunMtl = `objects/sun/sun.mtl`;
    load3dObj(planetGroups["sun"].rotation, "sun", sunObj, sunMtl, 0.5, [0, 0, 0], false);
    createGlowSprite(planetGroups["sun"].location, 0, 30);

    CreateSpotLight(planetGroups["mercury"].location, 30, -4);
    const mercury = `objects/mercury/mercury.obj`;
    const mercuryMtl = `objects/mercury/mercury.mtl`;
    const mercuryObj = load3dObj(planetGroups["mercury"].rotation, "mercury", mercury, mercuryMtl, 1.0, [0, 0, 0]);

    CreateSpotLight(planetGroups["venus"].location, 10, -2);
    const venus = `objects/venus/venus.obj`;
    const venusMtl = `objects/venus/venus.mtl`;
    const venusObj = load3dObj(planetGroups["venus"].rotation, "venus", venus, venusMtl, 3.0, [0, 0, 0]);

    CreateSpotLight(planetGroups["earth"].location, 10, -2);
    const earthTexture = 'objects/earth/Color_Map.jpg';
    const earth = createPlanet(planetGroups["earth"].rotation, "earth", 0.7, earthTexture, 0);

    CreateSpotLight(planetGroups["mars"].location, 5, -2);
    const mars = `objects/mars/mars.obj`;
    const marsMtl = `objects/mars/mars.mtl`;
    const marsObj = load3dObj(planetGroups["mars"].rotation, "mars", mars, marsMtl, 2.0, [0, 0, 0]);

    
    CreateSpotLight(planetGroups["jupiter"].location, 50, -10);
    const jupiterTexture = 'objects/jupiter/jupitermap.jpg';
    const jupiter = createPlanet(planetGroups["jupiter"].rotation, "jupiter", 3, jupiterTexture);

    CreateSpotLight(planetGroups["saturn"].location, 50, -15, 1);
    const saturnTexture = 'objects/saturn/saturnmap.jpg';
    const saturnRingTexture = 'objects/saturn/saturnring.png';
    
    const saturnTiltGroup = new THREE.Group();
    saturnTiltGroup.position.set(0, 0, 0); 
    planetGroups["saturn"].rotation.add(saturnTiltGroup);        
    
    const saturn = createPlanet(saturnTiltGroup, "saturn", 3, saturnTexture, 0, {
        innerRadius: 4,
        outerRadius: 6.5,
        texture: saturnRingTexture
    });
    
    saturnTiltGroup.rotation.z = THREE.MathUtils.degToRad(27);


    CreateSpotLight(planetGroups["uranus"].location, 40, -10, 1);
    const uranusTexture = 'objects/uranus/uranus.jpg';
    const uranusRingTexture = 'objects/uranus/uranusring.png';
    
    const uranusTiltGroup = new THREE.Group();
    uranusTiltGroup.position.set(0, 0, 0); 
    planetGroups["uranus"].rotation.add(uranusTiltGroup);        
    
    const uranus = createPlanet(uranusTiltGroup, "uranus", 3, uranusTexture, 0, {
        innerRadius: 4,
        outerRadius: 6.5,
        texture: uranusRingTexture
    });
    
    uranusTiltGroup.rotation.z = THREE.MathUtils.degToRad(90);


    CreateSpotLight(planetGroups["neptune"].location, 50, -15);
    const neptuneTexture = 'objects/neptune/neptune.jpg';
    const neptune = createPlanet(planetGroups["neptune"].rotation, "neptune", 3, neptuneTexture, 0);


    const sunGlow = createGlowSprite(planetGroups["sun"].location, 0, 30);
    const mercuryGlow = createGlowSprite(planetGroups["mercury"].location, 0, 1);
    const venusGlow = createGlowSprite(planetGroups["venus"].location, 0, 2.5);
    const earthGlow = createGlowSprite(planetGroups["earth"].location, 0, 2.5);
    const marsGlow = createGlowSprite(planetGroups["mars"].location, 0, 2);
    const jupiterGlow = createGlowSprite(planetGroups["jupiter"].location, 0, 9);
    const saturnGlow = createGlowSprite(planetGroups["saturn"].location, 0, 9);
    const uranusGlow = createGlowSprite(planetGroups["uranus"].location, 0, 9);
    const neptuneGlow = createGlowSprite(planetGroups["neptune"].location, 0, 9);

    const glowSprites = {
        sun: sunGlow,
        mercury: mercuryGlow,
        venus: venusGlow,
        earth: earthGlow,
        mars: marsGlow,
        jupiter: jupiterGlow,
        saturn: saturnGlow,
        uranus: uranusGlow,
        neptune: neptuneGlow
    };

    const planetLabels = {
        sun: makeLabel(planetGroups["sun"].location, 0, 15, 1000, 200, 'Sun', 'black', false),
        mercury: makeLabel(planetGroups["mercury"].location, 0, 3, 1000, 200, 'Mercury', 'black', false),
        venus: makeLabel(planetGroups["venus"].location, 0, 3, 1000, 200, 'Venus', 'black', false),
        earth: makeLabel(planetGroups["earth"].location, 0, 3, 1000, 200, 'Earth', 'black', false),
        mars: makeLabel(planetGroups["mars"].location, 0, 3, 1000, 200, 'Mars', 'black', false),
        jupiter: makeLabel(planetGroups["jupiter"].location, 0, 8, 1000, 200, 'Jupiter', 'black', false),
        saturn: makeLabel(planetGroups["saturn"].location, 0, 8, 1000, 200, 'Saturn', 'black', false),
        uranus: makeLabel(planetGroups["uranus"].location, 0, 8, 1000, 200, 'Uranus', 'black', false),
        neptune: makeLabel(planetGroups["neptune"].location, 0, 8, 1000, 200, 'Neptune', 'black', false),
    };
    
    // Ensure all labels exist before updating visibility
    Object.keys(planetLabels).forEach(key => {
        if (!planetLabels[key]) {
            console.warn(`Missing label for: ${key}`);
        }
    });

    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
        }
    
        pick(normalizedPosition, scene, camera) {
            // Reset all glow sprites (hide them)
            Object.values(glowSprites).forEach(sprite => sprite.visible = false);
    
            // Cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            
            if (intersectedObjects.length) {
                this.pickedObject = intersectedObjects[0].object;
                const objectName = this.pickedObject.name.toLowerCase(); // Ensure match with glowSprites keys
    
                // If a glow sprite exists for this object, show it
                if (glowSprites[objectName]) {
                    glowSprites[objectName].visible = true;
                }
            }
        }
    }

	const pickPosition = { x: 0, y: 0 };
	const pickHelper = new PickHelper();
	clearPickPosition();

	function render(time) 
    {
        let planetSpeeds = settings.planetSpeeds;
        
        updateSpaceshipMovement();

        // Realistic orbital speeds
        if(!settings.orbitsPaused)
        {
            planetGroups["mercury"].orbit.rotation.y += (orbitalSpeed / 0.24) * planetSpeeds;  // Mercury orbits in 0.24 Earth years
            planetGroups["venus"].orbit.rotation.y += (orbitalSpeed / 0.62) * planetSpeeds;    // Venus orbits in 0.62 Earth years
            planetGroups["earth"].orbit.rotation.y += (orbitalSpeed / 1.00) * planetSpeeds;    // Earth orbits in 1 year
            planetGroups["mars"].orbit.rotation.y += (orbitalSpeed / 1.88) * planetSpeeds;     // Mars orbits in 1.88 Earth years
            planetGroups["jupiter"].orbit.rotation.y += (orbitalSpeed / 11.86) * planetSpeeds; // Jupiter orbits in 11.86 Earth years

            planetGroups["saturn"].orbit.rotation.y += (orbitalSpeed / 29.45) * planetSpeeds;  // Saturn orbits in 29.45 Earth years
            saturnTiltGroup.rotation.y -= 1/29.45 * planetSpeeds * orbitalSpeed;

            planetGroups["uranus"].orbit.rotation.y += (orbitalSpeed / 84.00) * planetSpeeds;  // Uranus orbits in 84 Earth years
            uranusTiltGroup.rotation.y -= 1/84.00 * planetSpeeds * orbitalSpeed;

            planetGroups["neptune"].orbit.rotation.y += (orbitalSpeed / 165.00) * planetSpeeds;// Neptune orbits in 165 Earth years
            
            planetGroups["astroid"].orbit.rotation.y += (orbitalSpeed / 2) * planetSpeeds;
            planetGroups["kupier"].orbit.rotation.y += (orbitalSpeed / 4) * planetSpeeds;
        }

        // Rotate all planets inside their orbits (spinning on axis)
        if(!settings.rotationsPaused)
        {
            planetGroups["sun"].rotation.children.forEach(obj => obj.rotation.y += rotationSpeed / 30 * planetSpeeds);
            planetGroups["mercury"].rotation.children.forEach(obj => obj.rotation.y += rotationSpeed / 58.6 * planetSpeeds);
            planetGroups["venus"].rotation.children.forEach(obj => obj.rotation.y -= rotationSpeed / 243 * planetSpeeds);
            planetGroups["earth"].rotation.children.forEach(obj => obj.rotation.y += rotationSpeed * planetSpeeds);
            planetGroups["mars"].rotation.children.forEach(obj => obj.rotation.y += rotationSpeed / 1.03 * planetSpeeds);
            planetGroups["jupiter"].rotation.children.forEach(obj => obj.rotation.y += rotationSpeed / 0.41 * planetSpeeds);
            saturn.obj.rotation.y += rotationSpeed / 0.44 * planetSpeeds;
            uranus.obj.rotation.y += rotationSpeed / 0.72 * planetSpeeds;

            planetGroups["uranus"].rotation.children.forEach(obj => obj.rotation.x += rotationSpeed / 0.72 * planetSpeeds);
            planetGroups["neptune"].rotation.children.forEach(obj => obj.rotation.y += rotationSpeed / 0.67 * planetSpeeds);
        }

        let whichCamera = camera;
        if(settings.cameraSwap)
        {
            whichCamera = camera2;
        }

		if ( resizeRendererToDisplaySize( renderer ) ) 
        {
			const canvas = renderer.domElement;
			whichCamera.aspect = canvas.clientWidth / canvas.clientHeight;
			whichCamera.updateProjectionMatrix();
		}

		pickHelper.pick( pickPosition, scene, whichCamera, time );
		renderer.render( scene, whichCamera );

		requestAnimationFrame( render );
	}

	requestAnimationFrame( render );

	function getCanvasRelativePosition( event ) {

		const rect = canvas.getBoundingClientRect();
		return {
			x: ( event.clientX - rect.left ) * canvas.width / rect.width,
			y: ( event.clientY - rect.top ) * canvas.height / rect.height,
		};

	}

	function setPickPosition( event ) 
    {
		const pos = getCanvasRelativePosition( event );
		pickPosition.x = ( pos.x / canvas.width ) * 2 - 1;
		pickPosition.y = ( pos.y / canvas.height ) * - 2 + 1; // note we flip Y
	}

	function clearPickPosition() {

		// unlike the mouse which always has a position
		// if the user stops touching the screen we want
		// to stop picking. For now we just pick a value
		// unlikely to pick something
		pickPosition.x = - 100000;
		pickPosition.y = - 100000;

	}

	window.addEventListener( 'mousemove', setPickPosition );
	window.addEventListener( 'mouseout', clearPickPosition );
	window.addEventListener( 'mouseleave', clearPickPosition );

	window.addEventListener( 'touchstart', ( event ) => {

		// prevent the window from scrolling
		event.preventDefault();
		setPickPosition( event.touches[ 0 ] );

	}, { passive: false } );

	window.addEventListener( 'touchmove', ( event ) => {

		setPickPosition( event.touches[ 0 ] );

	} );

	window.addEventListener( 'touchend', clearPickPosition );

}

main();

function CreateSpotLight(orbit, intensity, position, hieght = 0, color = 0xFFFFFF)
{
    const light = new THREE.SpotLight(
        color,   // Color
        intensity,          // Intensity (Brightness)
        20,        // Distance (Falloff starts here)
        Math.PI / 2, // Angle (Spread of the light cone)
        0.5,        // Penumbra (Soft edges, 0 = sharp, 1 = very soft)
        2           // Decay (Falloff exponent, higher = faster dimming)
    );
    light.position.set(position, hieght, 0); // Set light’s position slightly above and behind Saturn
    light.target.position.set(position + 1, 0, 0); // Ensure the light points at Saturn
    orbit.add(light);
    orbit.add(light.target);
}

function load3dObj(scene, name, objPath, mtlPath, scale = 1, translate = [0, 0, 0], useLighting = true) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load(objPath, (root) => {
            root.name = name;
            root.scale.set(scale, scale, scale);
            root.position.set(translate[0], translate[1], translate[2]);

            let named = false; // Track if at least one mesh was named

            root.traverse((child) => {
                if (child.isMesh && !named) {
                    child.name = name; // Assign the name to the first mesh found
                    named = true; // Stop after naming the first mesh
                }
            });

            if (!named) {
                console.warn(`No mesh found in ${name}, setting root name only.`);
            }

            // If this is the Sun, force `MeshBasicMaterial` to prevent lighting effects
            if (!useLighting) {
                root.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshBasicMaterial({
                            map: child.material.map, // Keep existing texture
                        });
                    }
                });
            }

            scene.add(root);
        });
    });
}

function createPlanet(scene, name, size, texture, position = 0, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const textureLoader = new THREE.TextureLoader();
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.name = name;

    const obj = new THREE.Object3D();
    obj.name = name; // Assign the name to the entire planet object
    obj.add(mesh);

    if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 64);
        const ringMat = new THREE.MeshStandardMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide,
            transparent: true
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(0, 0, 0);
        ringMesh.rotation.x = -Math.PI / 2;
        obj.add(ringMesh);
    }

    obj.position.set(position, 0, 0);
    scene.add(obj);
    return { mesh, obj };
}

function createAstroids(scene, count, innerRadius, outerRadius) {
    const geometry = new THREE.DodecahedronGeometry(0.1); // Low-poly asteroid
    const material = new THREE.MeshBasicMaterial({ color: 0x888888 });

    // Instanced mesh for performance
    const kuiperBelt = new THREE.InstancedMesh(geometry, material, count);
    
    const dummy = new THREE.Object3D(); // Dummy object for transformations

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius); // Random radius
        
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = (Math.random() - 0.5) * 5; // Small vertical variation

        // Apply transformations using dummy object
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        kuiperBelt.setMatrixAt(i, dummy.matrix);
    }

    scene.add(kuiperBelt);
    return kuiperBelt;
}

function createAstroid(scene, size, position, texture = null)
{
    const geo = new THREE.SphereGeometry(size, 5, 5);
    const textureLoader = new THREE.TextureLoader();
    
    const mat = new THREE.MeshBasicMaterial(
        texture ? { map: textureLoader.load(texture) } : { color: 0x888888 } // Default gray color if no texture
    );

    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    obj.position.set(position[0], position[1], position[2]);
    scene.add(obj);
}


function makeLabel(scene, x, y, labelWidth, size, name, color = 'blue', rect = true) {
    const canvas = makeLabelCanvas(labelWidth, size, name, color, rect);
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const label = new THREE.Sprite(labelMaterial);
    
    label.position.set(x, y, 0); // Directly set position on label itself

    // Scale label size relative to its canvas dimensions
    label.scale.set(canvas.width * 0.01, canvas.height * 0.01, 1);

    scene.add(label);
    return label;
}

function makeLabelCanvas(baseWidth, size, name, color, rect) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${size}px bold sans-serif`;

    const textWidth = ctx.measureText(name).width;
    const width = baseWidth + 4;
    const height = size + 4;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.font = `${size}px bold sans-serif`;

    if(rect)
    {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(name, width / 2, height / 2);

    return ctx.canvas;
}

function createGlowSprite(scene, location, size) {
    // Create a circular canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Draw a soft glowing circle
    const gradient = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');  // Bright center
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');    // Fade out
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();

    // Convert to a texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    // Create a sprite
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Set position and size
    sprite.position.set(location, 0, 0);
    sprite.scale.set(size, size, 1);
    sprite.visible = false; // Default: Hidden until hovered

    // Add glow sprite to the scene (not parented to planets)
    scene.add(sprite);

    return sprite; // Return the created sprite
}