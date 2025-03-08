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
	controls.target.set( 50, 5, 0 );
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

    let pauseOrbits = true;
    let pauseRotations = false;

    let orbitalSpeed = 0.0001;
    let planetSpeeds = 1;

	{
		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		//scene.add( mesh );
	}

	const boxWidth = 1;
	const boxHeight = 1;
	const boxDepth = 1;
	const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );

	function makeInstance( geometry, color, x ) 
    {
		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;
	}

	/*
    const cubes = [
		makeInstance( geometry, 0x44aa88, 0 ),
		makeInstance( geometry, 0x8844aa, - 2 ),
		makeInstance( geometry, 0xaa8844, 2 ),
	];
    */

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
		const color = 0xFFFFFF;
		const intensity = 0.005;//0.005;
		const light = new THREE.AmbientLight( color, intensity );
		scene.add( light );
	}
    

	{
		const color = 0xFFFFFF;
		const intensity = 1000;
		const light = new THREE.SpotLight( color, intensity );
		light.position.set( 0, 10, 0 );
		light.target.position.set( - 5, 0, 0 );
		//scene.add( light );
		//scene.add( light.target );

		function updateLight() 
        {
			//light.target.updateMatrixWorld();
		}

		//updateLight();
	}

    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 4, sphereRadius + 2, 0);
        //scene.add(mesh);
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
    
    const cameraSpeed = 5;

    document.addEventListener("keydown", (event) => {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction); // Get the forward direction the camera is facing
        const right = new THREE.Vector3().crossVectors(camera.up, direction).normalize(); // Get right direction
    
        switch (event.code) {
            case "KeyW": // Move forward
                camera.position.addScaledVector(direction, cameraSpeed);
                break;
            case "KeyS": // Move backward
                camera.position.addScaledVector(direction, -cameraSpeed);
                break;
            case "KeyA": // Move left
                camera.position.addScaledVector(right, cameraSpeed);
                break;
            case "KeyD": // Move right
                camera.position.addScaledVector(right, -cameraSpeed);
                break;
            case "KeyO": // Pause orbits
                pauseOrbits =! pauseOrbits;
                break;
            case "KeyR": // Pause rotations
                pauseRotations =! pauseRotations;
                break;
            case "KeyF":
                planetSpeeds = planetSpeeds * 2;
                if(planetSpeeds > 512)
                {
                    planetSpeeds = 1;
                }
                console.log({planetSpeeds});
                break;
        }
    });
    
    
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
    load3dObj(sunOrbit, sunObj, sunMtl, [0.5, 0.5, 0.5]);
    
    CreateSpotLight(mercuryOrbit, 20, 6);
    const mercury = `objects/mercury/mercury.obj`;
    const mercuryMtl = `objects/mercury/mercury.mtl`;
    load3dObj(mercuryOrbit, mercury, mercuryMtl, [1.0, 1.0, 1.0], [10, 0, 0]);

    CreateSpotLight(venusOrbit, 2, 16);
    const venus = `objects/venus/venus.obj`;
    const venusMtl = `objects/venus/venus.mtl`;
    load3dObj(venusOrbit, venus, venusMtl, [3.0, 3.0, 3.0], [20, 0, 0]);

    CreateSpotLight(earthOrbit, 5, 26);
    const earthTexture = 'objects/earth/Color_Map.jpg';
    const earth = createPlanet(earthOrbit, 0.7, earthTexture, 30);
    
    CreateSpotLight(marsOrbit, 10, 36);
    const mars = `objects/mars/mars.obj`;
    const marsMtl = `objects/mars/mars.mtl`;
    load3dObj(marsOrbit, mars, marsMtl, [2.0, 2.0, 2.0], [40, 0, 0]);

    CreateSpotLight(jupiterOrbit, 50, 50);
    const jupiterTexture = 'objects/jupiter/jupitermap.jpg';
    const jupiter = createPlanet(jupiterOrbit, 3, jupiterTexture, 60);

    CreateSpotLight(saturnOrbit, 50, 65, 1);
    const saturnTexture = 'objects/saturn/saturnmap.jpg';
    const saturnRingTexture = 'objects/saturn/saturnring.png';
    
    // Create a parent group for Saturn's axial tilt
    const saturnTiltGroup = new THREE.Group();
    saturnTiltGroup.position.set(80, 0, 0);  // Move tilt group to Saturn's orbit
    saturnOrbit.add(saturnTiltGroup);        // Attach it inside the orbit
    
    // Create Saturn inside the tilt group (positioned at 0,0,0 inside it)
    const saturn = createPlanet(saturnTiltGroup, 3, saturnTexture, 0, {
        innerRadius: 4,
        outerRadius: 6.5,
        texture: saturnRingTexture
    });
    
    // Apply tilt to the parent group (27° like real Saturn)
    saturnTiltGroup.rotation.z = THREE.MathUtils.degToRad(27);
    
    CreateSpotLight(uranusOrbit, 40, 90, 1);
    const uranusTexture = 'objects/uranus/uranus.jpg';
    const uranusRingTexture = 'objects/uranus/uranusring.png';
    const uranus = createPlanet(uranusOrbit, 3, uranusTexture, 100, {
        innerRadius: 4,
        outerRadius: 6.5,
        texture: uranusRingTexture
    });

    CreateSpotLight(neptuneOrbit, 50, 110);
    const neptuneTexture = 'objects/neptune/neptune.jpg';
    const neptune = createPlanet(neptuneOrbit, 3, neptuneTexture, 120);

	function render(time) 
    {
        // Realistic orbital speeds
        if(!pauseOrbits)
        {
            mercuryOrbit.rotation.y += 1/0.24 * planetSpeeds * orbitalSpeed;
            venusOrbit.rotation.y += 1/0.62 * planetSpeeds * orbitalSpeed;
            earthOrbit.rotation.y += 1 * planetSpeeds * orbitalSpeed;
            marsOrbit.rotation.y += 1/1.88 * planetSpeeds * orbitalSpeed;
            jupiterOrbit.rotation.y += 1/11.86 * planetSpeeds * orbitalSpeed;
            saturnOrbit.rotation.y += 1/29.45 * planetSpeeds * orbitalSpeed;

            // Counteract orbital rotation so tilt remains constant in space
            saturnTiltGroup.rotation.y -= 1/29.45 * planetSpeeds * orbitalSpeed;
            uranusOrbit.rotation.y += 1/84 * planetSpeeds * orbitalSpeed;
            neptuneOrbit.rotation.y += 1/165 * planetSpeeds * orbitalSpeed;
        }

        // Rotate all planets inside their orbits (spinning on axis)
        if(!pauseRotations)
        {
            sunOrbit.children.forEach(obj => obj.rotation.y += 0.002 * planetSpeeds);
            mercuryOrbit.children.forEach(obj => obj.rotation.y += 0.0008 * planetSpeeds);
            venusOrbit.children.forEach(obj => obj.rotation.y += 0.015 * planetSpeeds);
            earthOrbit.children.forEach(obj => obj.rotation.y += 0.01 * planetSpeeds);
            marsOrbit.children.forEach(obj => obj.rotation.y += 0.008 * planetSpeeds);
            jupiterOrbit.children.forEach(obj => obj.rotation.y += 0.004 * planetSpeeds);
            saturn.obj.rotation.y += 0.003 * planetSpeeds;
            uranusOrbit.children.forEach(obj => obj.rotation.y += 0.002 * planetSpeeds);
            neptuneOrbit.children.forEach(obj => obj.rotation.y += 0.001 * planetSpeeds);
        }

		if ( resizeRendererToDisplaySize( renderer ) ) 
        {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}

	requestAnimationFrame( render );
}

main();

function CreateSpotLight(orbit, intensity, position, hieght = 0)
{
    const light = new THREE.SpotLight(
        0xFFFFFF,   // Color
        intensity,          // Intensity (Brightness)
        20,        // Distance (Falloff starts here)
        Math.PI / 2, // Angle (Spread of the light cone)
        0.5,        // Penumbra (Soft edges, 0 = sharp, 1 = very soft)
        2           // Decay (Falloff exponent, higher = faster dimming)
    );
    light.position.set(position, hieght, 0); // Set light’s position slightly above and behind Saturn
    light.target.position.set(position + 1, 0, 0); // Ensure the light points at Saturn
    orbit.add(light);
    orbit.add(light.target); // Important: Add target so it moves with the orbit
}

function load3dObj(scene, objPath, mtlPath, scale = [1, 1, 1], translate = [0, 0, 0]) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load(objPath, (root) => {
            root.scale.set(scale[0], scale[1], scale[2]);
            root.position.set(translate[0], translate[1], translate[2]);

            // If this is the Sun, force `MeshBasicMaterial` to prevent lighting effects
            if (objPath.includes("sun")) {
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

function createPlanet(scene, size, texture, position, ring) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const textureLoader = new THREE.TextureLoader();
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);

    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            64
        );
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