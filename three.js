import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

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

    let cameraSwap = true;

    let pauseOrbits = false;
    let pauseRotations = false;

    let numMult = 0;
    let orbitalSpeed = 0.00001;
    let rotationSpeed = 365.25 * orbitalSpeed;
    let planetSpeeds = 1;

	{
		const color = 0xFFFFFF;
		const intensity = 0.005;
		const light = new THREE.AmbientLight( color, intensity );
		scene.add( light );
	}

    document.addEventListener("keydown", (event) => {
        switch (event.code) {
            case "KeyO": // Pause orbits
                pauseOrbits =! pauseOrbits;
                break;
            case "KeyR": // Pause rotations
                pauseRotations =! pauseRotations;
                break;
            case "KeyF":
                planetSpeeds = planetSpeeds * 2;
                numMult++;
                if(numMult > 15)
                {
                    planetSpeeds = 1;
                    numMult = 0
                }
                console.log({planetSpeeds});
                break;
            case "KeyC":
                cameraSwap =! cameraSwap;
                console.log(cameraSwap);
                break;
        }
    });

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
    spaceShip.position.set(35, 0, 0);
	scene.add( spaceShip );

    CreateSpotLight(spaceShip, 50, 0, 1);

    const rotationObj = new THREE.Group();
    rotationObj.rotateY(1.5);
    spaceShip.add(rotationObj);

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


    const sunOrbit = new THREE.Group();
    const mercuryOrbit = new THREE.Group();
    const earthOrbit = new THREE.Group();
    const venusOrbit = new THREE.Group();
    const marsOrbit = new THREE.Group();
    const astroidOrbit = new THREE.Group();
    const jupiterOrbit = new THREE.Group();
    const saturnOrbit = new THREE.Group();
    const uranusOrbit = new THREE.Group();
    const neptuneOrbit = new THREE.Group();
    scene.add(sunOrbit, mercuryOrbit, venusOrbit, earthOrbit, marsOrbit, astroidOrbit, jupiterOrbit, saturnOrbit, uranusOrbit, neptuneOrbit);

    const sunObj = `objects/sun/sun.obj`;
    const sunMtl = `objects/sun/sun.mtl`;
    load3dObj(sunOrbit, "sun", sunObj, sunMtl, 0.5, [0, 0, 0], false);
	makeLabel(scene, 0, 15, 1000, 200, 'Sun', 'black', false );
    createGlowSprite(sunOrbit, 0, 30);

    CreateSpotLight(mercuryOrbit, 30, 16);
    const mercury = `objects/mercury/mercury.obj`;
    const mercuryMtl = `objects/mercury/mercury.mtl`;
    load3dObj(mercuryOrbit, "mercury", mercury, mercuryMtl, 1.0, [20, 0, 0]);
	makeLabel(mercuryOrbit, 20, 3, 1000, 200, 'Mercury', 'black', false );

    CreateSpotLight(venusOrbit, 10, 28, );
    const venus = `objects/venus/venus.obj`;
    const venusMtl = `objects/venus/venus.mtl`;
    load3dObj(venusOrbit, "venus", venus, venusMtl, 3.0, [30, 0, 0]);
	makeLabel(venusOrbit, 30, 3, 1000, 200, 'Venus', 'black', false );

    CreateSpotLight(earthOrbit, 10, 38);
    const earthTexture = 'objects/earth/Color_Map.jpg';
    const earth = createPlanet(earthOrbit, "earth", 0.7, earthTexture, 40);
    makeLabel(earthOrbit, 40, 3, 1000, 200, 'Earth', 'black', false );

    CreateSpotLight(marsOrbit, 5, 48);
    const mars = `objects/mars/mars.obj`;
    const marsMtl = `objects/mars/mars.mtl`;
    load3dObj(marsOrbit, "mars", mars, marsMtl, 2.0, [50, 0, 0]);
    makeLabel(marsOrbit, 50, 3, 1000, 200, 'Mars', 'black', false );

    const asteroidCount = 2000;   // Number of asteroids
    const innerRadius = 60;       // Inner radius of the belt
    const outerRadius = 80;       // Outer radius of the belt
    
    for (let i = 0; i < asteroidCount; i++) {
        const size = Math.random() * 0.08 + 0.01;
        const angle = Math.random() * Math.PI * 2; // Random angle (0 to 360 degrees)
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius); // Random radius within belt
        
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = (Math.random() - 0.5) * 5; // Slight vertical variation for realism
    
        createAstroid(astroidOrbit, size, [x, y, z]);
    }
    

    CreateSpotLight(jupiterOrbit, 50, 85);
    const jupiterTexture = 'objects/jupiter/jupitermap.jpg';
    const jupiter = createPlanet(jupiterOrbit, "jupiter", 3, jupiterTexture, 95);
    makeLabel(jupiterOrbit, 95, 8, 1000, 200, 'Jupiter', 'black', false );

    CreateSpotLight(saturnOrbit, 50, 100, 1);
    const saturnTexture = 'objects/saturn/saturnmap.jpg';
    const saturnRingTexture = 'objects/saturn/saturnring.png';
    
    const saturnTiltGroup = new THREE.Group();
    saturnTiltGroup.position.set(115, 0, 0); 
    saturnOrbit.add(saturnTiltGroup);        
    
    const saturn = createPlanet(saturnTiltGroup, "saturn", 3, saturnTexture, 0, {
        innerRadius: 4,
        outerRadius: 6.5,
        texture: saturnRingTexture
    });
    
    saturnTiltGroup.rotation.z = THREE.MathUtils.degToRad(27);
    makeLabel(saturnOrbit, 115, 8, 1000, 200, 'Saturn', 'black', false );


    CreateSpotLight(uranusOrbit, 40, 125, 1);
    const uranusTexture = 'objects/uranus/uranus.jpg';
    const uranusRingTexture = 'objects/uranus/uranusring.png';
    
    const uranusTiltGroup = new THREE.Group();
    uranusTiltGroup.position.set(135, 0, 0); 
    uranusOrbit.add(uranusTiltGroup);        
    
    const uranus = createPlanet(uranusTiltGroup, "uranus", 3, uranusTexture, 0, {
        innerRadius: 4,
        outerRadius: 6.5,
        texture: uranusRingTexture
    });
    
    uranusTiltGroup.rotation.z = THREE.MathUtils.degToRad(90);
    makeLabel(uranusOrbit, 135, 8, 1000, 200, 'Uranus', 'black', false );


    CreateSpotLight(neptuneOrbit, 50, 145);
    const neptuneTexture = 'objects/neptune/neptune.jpg';
    const neptune = createPlanet(neptuneOrbit, "neptune", 3, neptuneTexture, 155);
    makeLabel(neptuneOrbit, 155, 8, 1000, 200, 'Neptune', 'black', false );

    const sunGlow = createGlowSprite(scene, 0, 30);
    const mercuryGlow = createGlowSprite(mercuryOrbit, 20, 1);
    const venusGlow = createGlowSprite(venusOrbit, 30, 2.5);
    const earthGlow = createGlowSprite(earthOrbit, 40, 2.5);
    const marsGlow = createGlowSprite(marsOrbit, 50, 2);
    const jupiterGlow = createGlowSprite(jupiterOrbit, 95, 9);
    const saturnGlow = createGlowSprite(saturnOrbit, 115, 9);
    const uranusGlow = createGlowSprite(uranusOrbit, 135, 9);
    const neptuneGlow = createGlowSprite(neptuneOrbit, 155, 9);

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
        updateSpaceshipMovement();

        // Realistic orbital speeds
        if(!pauseOrbits)
        {
            mercuryOrbit.rotation.y += (orbitalSpeed / 0.24) * planetSpeeds;  // Mercury orbits in 0.24 Earth years
            venusOrbit.rotation.y += (orbitalSpeed / 0.62) * planetSpeeds;    // Venus orbits in 0.62 Earth years
            earthOrbit.rotation.y += (orbitalSpeed / 1.00) * planetSpeeds;    // Earth orbits in 1 year
            marsOrbit.rotation.y += (orbitalSpeed / 1.88) * planetSpeeds;     // Mars orbits in 1.88 Earth years
            astroidOrbit.rotation.y += (orbitalSpeed / 4) * planetSpeeds;

            jupiterOrbit.rotation.y += (orbitalSpeed / 11.86) * planetSpeeds; // Jupiter orbits in 11.86 Earth years

            saturnOrbit.rotation.y += (orbitalSpeed / 29.45) * planetSpeeds;  // Saturn orbits in 29.45 Earth years
            saturnTiltGroup.rotation.y -= 1/29.45 * planetSpeeds * orbitalSpeed;

            uranusOrbit.rotation.y += (orbitalSpeed / 84.00) * planetSpeeds;  // Uranus orbits in 84 Earth years
            uranusTiltGroup.rotation.y -= 1/84.00 * planetSpeeds * orbitalSpeed;

            neptuneOrbit.rotation.y += (orbitalSpeed / 165.00) * planetSpeeds;// Neptune orbits in 165 Earth years
        }

        // Rotate all planets inside their orbits (spinning on axis)
        if(!pauseRotations)
        {
            sunOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed / 30 * planetSpeeds);
            mercuryOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed / 58.6 * planetSpeeds);
            venusOrbit.children.forEach(obj => obj.rotation.y -= rotationSpeed / 243 * planetSpeeds);
            earthOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed * planetSpeeds);
            marsOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed / 1.03 * planetSpeeds);
            jupiterOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed / 0.41 * planetSpeeds);
            saturn.obj.rotation.y += rotationSpeed / 0.44 * planetSpeeds;
            uranus.obj.rotation.y += rotationSpeed / 0.72 * planetSpeeds;

            //uranusOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed / 0.72 * planetSpeeds);
            neptuneOrbit.children.forEach(obj => obj.rotation.y += rotationSpeed / 0.67 * planetSpeeds);
        }

        let whichCamera = camera;
        if(cameraSwap)
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
                    console.log(`Mesh assigned name: ${child.name}`);
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

function createPlanet(scene, name, size, texture, position, ring) {
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