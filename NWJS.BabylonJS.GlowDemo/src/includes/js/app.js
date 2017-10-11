import $ from "jquery";
//require("./eash.js");

var time = 0;

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
        this.camera.wheelPrecision = 100;
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

        //Eash shader requires this
        var shd = document.createElement('div');
        shd.setAttribute("id", "shaders");
        shd.setAttribute("style", "display:none");

        if (document.getElementById('shaders') == null)
            document.body.appendChild(shd);
        else document.getElementById('shaders').innerHTML = "";


        // Earth
        let earthMaterial = new BABYLON.StandardMaterial("EarthMaterial", this.scene);
        this.earth = BABYLON.Mesh.CreateSphere("Earth", 24.0, 6.0, this.scene);
        this.earth.position = new BABYLON.Vector3(0, 0, 0);
        this.earth.rotation.z = degToRad(180); // upside down for some reason
        //this.earth.material = earthMaterial;
        this.earth.material = eash.shader(eash.solid(0xffffff, 0.1), this.scene);
        //this.earth.material = eash.shader(eash.solid(0xffffff)+eash.fresnel({nrm:eash.normals.flat}), this.scene);


        var renderTarget = new BABYLON.RenderTargetTexture("depth", 512, this.scene);
        renderTarget.renderList.push(this.earth);
        this.scene.customRenderTargets.push(renderTarget);
        
        /*
        renderTarget.onBeforeRender = function () {
            for (var index = 0; index < renderTarget.renderList.length; index++) {
                renderTarget.renderList[index]._savedMaterial = renderTarget.renderList[index].material;
                renderTarget.renderList[index].material = renderTarget.renderList[index].helperMaterial;
            }
        }

        renderTarget.onAfterRender = function () {
            for (var index = 0; index < renderTarget.renderList.length; index++) {

                renderTarget.renderList[index].material = renderTarget.renderList[index]._savedMaterial;
            }
        }

        eash.linerPostProcess(eash.cameraLayer(1), this.camera, {
            apply: function (ef) {
                ef.setTexture('ref1', renderTarget);
            }
        });
        */

        var pps1 = eash.linerPostProcess(eash.ppsMap(0), this.camera);

        eash.linerPostProcess(eash.cameraLayer(1), this.camera, {
            apply: function (ef) {
                ef.setTexture('ref1', renderTarget);
            }
        });

        eash.linerPostProcess(eash.directionBlur({
            dir: { x: 1., y: 0.0 }, custom: function (dir, step, alpha) {
                return eash.reference('ref', eash.cameraShot({ uv: 'uv+' + dir }))
                    + eash.replace({ type: black, area: 0, opacity: 0.48, mat: eash.solid(0x000000, 0.0) })
                    + eash.replace({ type: white, area: 0, opacity: 0.7, mat: eash.solid(0xffffff, 1.0) })
                    ;
            }, percent: 10.
        }), this.camera, { scale: 0.75 });

        eash.linerPostProcess(eash.directionBlur({ dir: { x: 0., y: 1.0 }, percent: 10. }), this.camera, { scale: 0.75 });
        var pps2 = eash.linerPostProcess(eash.directionBlur({ dir: { x: 0., y: 1.0 }, percent: 10. }), this.camera, { scale: 0.75 });


        eash.linerPostProcess(eash.multi([eash.cameraLayer(2), { r: eash.cameraShot(), e: 3.0 }]), this.camera, {
            apply: function (ef) {
                ef.setTextureFromPostProcess('ref2', pps1);
            }
        });


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