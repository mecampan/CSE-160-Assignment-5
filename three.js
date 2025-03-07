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
	camera.position.set( 0, 10, 20 );

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

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
			'images/px.jpg',
			'images/nx.jpg',
			'images/py.jpg',
			'images/ny.jpg',
			'images/pz.jpg',
			'images/nz.jpg'
		] );
		//scene.background = texture;
	}

	{
		const color = 0xFFFFFF;
		const intensity = 0.2;
		const light = new THREE.AmbientLight( color, intensity );
		scene.add( light );
	}

	{
		const color = 0xFFFFFF;
		const intensity = 150;
		const light = new THREE.PointLight( color, intensity );
		light.position.set( 0, 0, 0 );
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

    const windmillObj = `objects/windmill_001/windmill_001.obj`;
    const windmillMat = `objects/windmill_001/windmill_001.mtl`;
    //load3dObj(scene, windmillObj, windmillMat);

    const sunObj = `objects/sun/sun.obj`;
    const sunMtl = `objects/sun/sun.mtl`;
    load3dObj(scene, sunObj, sunMtl, [0.1, 0.1, 0.1]);

    const mercuryOrbit = new THREE.Group();
scene.add(mercuryOrbit); // Attach to the scene

    const mercury = `objects/mercury/mercury.obj`;
    const mercuryMtl = `objects/mercury/mercury.mtl`;
    load3dObj(mercuryOrbit, mercury, mercuryMtl, [2.0, 2.0, 2.0], [10, 0, 0]);

	function render(time) 
    {
        time *= 0.001; // Convert time to seconds

        // Rotate Mercury's orbit group around the Sun
        mercuryOrbit.rotation.y += 0.01; 

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

function load3dObj(scene, objPath, mtlPath, scale = [1, 1, 1], translate = [0, 0, 0])
{
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (mtl) => 
    {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load(objPath, (root) => 
        {
            //root.rotation.x = -Math.PI / 2; // Rotate the model upright
            root.scale.set(scale[0], scale[1], scale[2]); // Increase size by 5x
            root.position.set(translate[0], translate[1], translate[2]);
            scene.add(root);
        });
    });
}


main();