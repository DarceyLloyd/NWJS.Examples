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
        this.camera = new BABYLON.ArcRotateCamera("Camera", degToRad(-90), degToRad(90), 30, BABYLON.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
    }

    render() {
        if (this.videoSphere) {
            this.videoSphere.rotation.z -= degToRad(0.75);
            this.videoSphere.rotation.y += degToRad(1);
        }
        
        if (this.videoCube) {
            this.videoCube.rotation.z += degToRad(0.75);
            this.videoCube.rotation.x -= degToRad(1);
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
        // this.light1.diffuse = new BABYLON.Color3(1, 1, 1);
        // this.light1.specular = new BABYLON.Color3(1, 1, 1);
        // this.light1.specularAmount = 0.5;
        // this.light1.intensity = 1.0;

        // this.light2 = new BABYLON.DirectionalLight("DirLight1", new BABYLON.Vector3(0, 1, 0), this.scene);
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


        // https://doc.babylonjs.com/classes/2.4/VideoTexture
        // new VideoTexture(name, urlsOrVideo, HTMLVideoElement, scene, generateMipMaps, invertY, samplingMode)

        // Video material
        this.videoMat = new BABYLON.StandardMaterial("VideoMaterial", this.scene);
        this.videoMat.diffuseTexture = new BABYLON.VideoTexture("video", ["assets/videos/v1.mp4", "assets/videos/v1.webm"], this.scene, false);
        this.videoMat.specularColor = BABYLON.Color3.Black(); // Turns off the light reflect 
        this.videoMat.backFaceCulling = false;

        // Mesh's to apply the video material to
        // No W,H,SegW,SegH control WTF Babylon!
        this.videoPlane = BABYLON.Mesh.CreatePlane("VideoPlane", 10, this.scene);
        this.videoPlane.material = this.videoMat;

        // No SegW,SegH control WTF Babylon!
        this.videoSphere = BABYLON.Mesh.CreateSphere("VideoSphere", 7, 9.0, this.scene);
        this.videoSphere.material = this.videoMat;
        this.videoSphere.position.x = -10;

        // No W,H,D, SegW, SegH control! Babylon WTF!
        this.videoCube = BABYLON.Mesh.CreateBox("Cube", 7.0, this.scene);
        this.videoCube.material = this.videoMat;
        this.videoCube.position.x = 10;
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