import $ from "jquery";


// Utilitiy functions
function log() { console.log(arguments); }
function radToDeg(input) {
    return input * (180 / Math.PI);
}
function degToRad(input) {
    return input * (Math.PI / 180);
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -




// Application
class Application {
    constructor() {
        this.setupFPSMonitor();
        this.setupBabylon();
        this.setupLights();
        this.setupScene();
        this.setupEventListeners();
    }

    setupFPSMonitor() {
        //https://github.com/darsain/fpsmeter/wiki/Options
        this.stats = new FPSMeter(document.getElementById("fps"), {
            heat: 1,
            graph: 0,
            history: 0
        });
    }

    setupBabylon() {
        this.canvas = document.getElementById("renderOutput");

        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.runRenderLoop(this.render.bind(this));

        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color3.FromHexString("#000000");

        //ArcRotateCamera(name, alpha, beta, radius, target, scene)
        // BabylonJS has poor defaults with ArcCam, this will allow x,y and z to work correctly  
        this.camera = new BABYLON.ArcRotateCamera("Camera", degToRad(-90), degToRad(90), 10, BABYLON.Vector3.Zero(), this.scene);
        this.camera.wheelPrecision  = 100;
        this.camera.attachControl(this.canvas, true);
    }

    render() {
        if (this.earth) {
            this.earth.rotation.y += degToRad(-0.01);
        }

        if (this.earthSky) {
            this.earthSky.rotation.y += degToRad(-0.015);
        }

        if (this.scene) {
            this.scene.render();
        }

        if (this.stats) {
            this.stats.tick();
        }
    }

    setupLights() {
        // DirectionalLight(name, direction, scene)
        this.light1 = new BABYLON.DirectionalLight("DirLight1", new BABYLON.Vector3(0, 0, 1), this.scene);
        this.light1.intensity = 1;
    }

    setupScene() {
        // Skybox
        this.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        this.skyboxMaterial.backFaceCulling = false;
        this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skyboxes/purple_nebula/skybox", this.scene);
        this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        this.skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.skyboxMaterial.checkReadyOnlyOnce = true;
        this.skyboxMaterial.disableLighting = true;

        this.skybox = BABYLON.Mesh.CreateBox("skyBox", 200.0, this.scene);
        this.skybox.material = this.skyboxMaterial;


        // Earth
        let earthMaterial = new BABYLON.StandardMaterial("EarthMaterial", this.scene);
        earthMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/earth/earth_2048x1024_02.jpg", this.scene);
        earthMaterial.bumpTexture = new BABYLON.Texture('assets/textures/earth/earth_2048x1024_02_normal.jpg', this.scene);
        //earthMaterial.specularTexture = new BABYLON.Texture('assets/textures/earth/earth_2048x1024_specular.gif', this.scene);
        let specV = 0.1;
        earthMaterial.specularColor = new BABYLON.Color3(specV, specV, specV);
        earthMaterial.checkReadyOnlyOnce = true;
        //earthMaterial.bumpTexture.invertNormalMapX = true;
        //earthMaterial.bumpTexture.invertNormalMapY = true;
        //earthMaterial.wireframe = true;

        this.earth = BABYLON.Mesh.CreateSphere("Earth", 24.0, 6.0, this.scene);
        this.earth.position = new BABYLON.Vector3(0, 0, 0);
        this.earth.rotation.z = degToRad(180); // upside down for some reason
        this.earth.material = earthMaterial;

        // Earth Sky
        //https://doc.babylonjs.com/tutorials/Materials
        let earthSkyMaterial = new BABYLON.StandardMaterial("EarthSkyMaterial", this.scene);
        earthSkyMaterial.opacityTexture = new BABYLON.Texture("assets/textures/earth/clouds_2048x1024.png", this.scene);
        //earthSkyMaterial.diffuseTexture.hasAlpha = true;
        //earthSkyMaterial.checkReadyOnlyOnce = true;
        //earthSkyMaterial.backFaceCulling = true;
        //earthSkyMaterial.wireframe = true;
        //earthSkyMaterial.alpha = 0.7;

        this.earthSky = BABYLON.Mesh.CreateSphere("Sky", 24.0, 6.1, this.scene);
        this.earthSky.material = earthSkyMaterial;
        this.earthSky.position = new BABYLON.Vector3(0, 0, 0);


    }

    setupEventListeners() {
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
$(function () {
    log("Darcey@AllForTheCode.co.uk Developer Tests");

    let app = new Application();
});
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -