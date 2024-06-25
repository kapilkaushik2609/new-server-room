import * as THREE from 'three';
import { GLTFLoader } from 'node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';
class ModelPawn extends PawnBehavior {
    setup() {
      
        let trm = this.service("ThreeRenderManager");
        let group = this.shape;

        if (this.actor._cardData.toneMappingExposure !== undefined) {
            trm.renderer.toneMappingExposure = this.actor._cardData.toneMappingExposure;
        } 
       

        // Initialize DRACOLoader
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/');

        // Set DRACOLoader as an extension to GLTFLoader
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
        

        this.lights = [];
        let particles = [];

        const loadModelPromise = new Promise((resolve, reject) => {
            gltfLoader.load(
                './assets/Server room .glb',
                (gltf) => {
                    const model = gltf.scene;

                    model.position.set(0, -1.6, 0);
                    const scaleFactor = 2;
                    model.scale.set(scaleFactor, scaleFactor, scaleFactor);

                    group.add(model);
                    console.log(model);

                    resolve(model);
                },
                null,
                (error) => {
                    console.error('Error loading GLTF model:', error);
                    reject(error);
                }
              
            );
 
        });

        loadModelPromise.then((model) => {
            const colors = [0xff0e00, 0xff7100, 0xffde2d, 0xfbffff, 0x80f2ff, 0x01aeff, 0x0029ff];

            // Shuffle the colors array to randomize the order
            for (let i = colors.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [colors[i], colors[j]] = [colors[j], colors[i]];
            }

            let colorIndex = 0;

            const originalMaterials = new Map();

            function traverseAndColor(object, restore = false) {
                if (object.isMesh) {
                    if (restore) {
                        const originalMaterial = originalMaterials.get(object);
                        if (originalMaterial) {
                            object.material = originalMaterial;
                        }
                    } else {
                        if (!originalMaterials.has(object)) {
                            originalMaterials.set(object, object.material);
                        }
                        const color = colors[colorIndex % colors.length];
                        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
                        object.material = material;
                        colorIndex++;
                    }
                }


                object.children.forEach((child, index) => {
                    if (index >= 1) { // Only affect children with an index of 2 or higher
                        traverseAndColor(child, restore);
                    }
                });
            }
            function traverseAndColor1(object, restore = false) {
                if (object.isMesh) {
                    if (restore) {
                        const originalMaterial = originalMaterials.get(object);
                        if (originalMaterial) {
                            object.material = originalMaterial;
                        }
                    } else {
                        if (!originalMaterials.has(object)) {
                            originalMaterials.set(object, object.material);
                        }
                        const color = colors[colorIndex % colors.length];
                        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
                        object.material = material;
                        colorIndex++;
                    }
                }

                object.children.forEach((child, index) => {
                    if (index >= 1) { // Only affect children with an index of 2 or higher
                        traverseAndColor1(child, restore);
                    }
                });
            }

            function traverseAndColor2(object, texturePath, restore = false) {
                if (object.isMesh) {
                    if (restore) {
                        const originalMaterial = originalMaterials.get(object);
                        if (originalMaterial) {
                            object.material = originalMaterial;
                        }
                    } else {
                        if (!originalMaterials.has(object)) {
                            originalMaterials.set(object, object.material);
                        }
                        const textureLoader = new THREE.TextureLoader();
                        textureLoader.load(texturePath, (texture) => {
                            const material = new THREE.MeshBasicMaterial({
                                map: texture,
                                transparent: true,
                                opacity: 0.6
                            });
                            object.material = material;
                        });
                    }
                }
            
                object.children.forEach((child) => {
                    traverseAndColor2(child, texturePath, restore);
                });
            }

            function traverseAndColor3(object, restore = false) {
                if (object.isMesh) {
                    if (restore) {
                        const originalMaterial = originalMaterials.get(object);
                        if (originalMaterial) {
                            object.material = originalMaterial;
                        }
                    } else {
                        if (!originalMaterials.has(object)) {
                            originalMaterials.set(object, object.material);
                        }
                        const color = colors[colorIndex % colors.length];
                        const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
                        object.material = material;
                        colorIndex++;
                    }
                }


                object.children.forEach((child, index) => {
                    if (index >= 1) { // Only affect children with an index of 2 or higher
                        traverseAndColor3(child, restore);
                    }
                });
            }
            function createTemperatureSimulation(group, THREE, xRange, yRange, zRange) {
                const particleCount = 3000;
                const particles = [];
            
                // Create temperature particles
                for (let i = 0; i < particleCount; i++) {
                    const particle = new THREE.Mesh(
                        new THREE.SphereGeometry(0.02, 1, 1),
                        new THREE.MeshBasicMaterial({ color: 0xffffff }) // Initial color
                    );
            
                    particle.position.set(
                        xRange[0] + Math.random() * xRange[1],
                        -Math.random() * yRange,
                        zRange[0] + Math.random() * zRange[1]
                    );
            
                    // Assign temperature based on height (warmer at the top, cooler at the bottom)
                    const temperature = (particle.position.y / 3) * 255; // Scale from 0 to 255 for color representation
                    particle.material.color.setRGB(temperature / 255, 0, (255 - temperature) / 255);
            
                    particles.push(particle);
                    group.add(particle);
                }
            
                // Function to remove temperature particles
                function removeParticles() {
                    particles.forEach(particle => {
                        group.remove(particle); // Remove particle from the group
                    });
                    particles.length = 0; // Clear the array
                }
            
                // Function to update temperature particles
                function updateTemperature() {
                    particles.forEach(particle => {
                        // Move particles upward
                        particle.position.y += 0.01;
            
                        // Simulate temperature diffusion or other effects here
            
                        // For simplicity, let's just randomly adjust temperature colors
                        const temperature = (particle.position.y / 3) * 255; // Scale from 0 to 255 for color representation
                        particle.material.color.setRGB(temperature / 255, 0, (255 - temperature) / 255);
            
                        // Reset temperature particle position if it goes beyond certain height
                        if (particle.position.y > 3) {
                            particle.position.y = -Math.random() * 3; // Reset to the bottom
                        }
                    });
            
                    // Schedule next update
                    requestAnimationFrame(updateTemperature);
                }
            
                // Start the temperature simulation
                updateTemperature();
            
                // Return an object with a remove function to clean up particles
                return {
                    remove: removeParticles
                };
            }
            
            function init() {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer();
            
                renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);
            
                const group = new THREE.Group();
                scene.add(group);
            
                // Adjust the camera position to view the simulation
                camera.position.set(5, 5, 20);
                camera.lookAt(5, 0, 5); // Looking at the center of the room
            
                function animate() {
                    requestAnimationFrame(animate);
                    updateTemperature(); // Update temperature particles
                    renderer.render(scene, camera);
                }
            
                // Consolidated update function for all particles
                function updateTemperature() {
                    group.children.forEach(particles => {
                        particles.children.forEach(particle => {
                            // Move particles upward
                            particle.position.y += 0.01;
            
                            // Simulate temperature diffusion or other effects here
            
                            // Randomly adjust temperature colors
                            const temperature = (particle.position.y / 3) * 255; // Scale from 0 to 255 for color representation
                            particle.material.color.setRGB(temperature / 255, 0, (255 - temperature) / 255);
            
                            // Reset temperature particle position if it goes beyond certain height
                            if (particle.position.y > 3) {
                                particle.position.y = -Math.random() * 3; // Reset to the bottom
                            }
                        });
                    });
                }
            
                animate();
            }
            
            init();
        
            if (!window.gui) {
                window.gui = new dat.GUI();
                var obj = {
                    traverseAndColor: JSON.parse(localStorage.getItem('traverseAndColor')) || false // Initial state of the checkbox from localStorage
                };
            
                window.gui.add(obj, 'traverseAndColor').name('Server Temp').onChange(function(value) {
                    localStorage.setItem('traverseAndColor', value); // Save state to localStorage
                    if (value) {
                        for (let i = 0; i <= 74; i++) {
                            if (i >= 5 && i <= 19) {
                                continue;
                            }
                            // Reset colorIndex for each row
                            colorIndex = i - 1;
                            for (let j = 2; j <= 13; j++) {
                                traverseAndColor(model.children[i].children[j], false);
                            }
                        }
                    } else {
                        for (let i = 0; i <= 74; i++) {
                            if (i >= 5 && i <= 19) {
                                continue;
                            }
                            for (let j = 2; j <= 13; j++) {
                                traverseAndColor(model.children[i].children[j], true);
                            }
                        }
                    }
                });
            
                var obj1 = {
                    traverseAndColor1: JSON.parse(localStorage.getItem('traverseAndColor1')) || false // Initial state of the checkbox from localStorage
                };
            
                window.gui.add(obj1, 'traverseAndColor1').name('Rack wise Temp').onChange(function(value) {
                    localStorage.setItem('traverseAndColor1', value); // Save state to localStorage
                    if (value) {
                        for (let i = 0; i <= 74; i++) {
                            if (i >= 5 && i <= 19) {
                                continue;
                            }
                            // Reset colorIndex for each row
                            colorIndex = i;
                            traverseAndColor1(model.children[i].children[1], false);
                            traverseAndColor1(model.children[i].children[1].children[0], false);
                        }
                    } else {
                        for (let i = 0; i <= 74; i++) {
                            if (i >= 5 && i <= 19) {
                                continue;
                            }
                            traverseAndColor1(model.children[i].children[1], true);
                            traverseAndColor1(model.children[i].children[1].children[0], true);
                        }
                    }
                });
            
                const obj2 = {
                    traverseAndColor2: JSON.parse(localStorage.getItem('traverseAndColor2')) || false // Initial state of the checkbox from localStorage
                };
            
                const texturePaths = [
                    './assets/images/Texture.jpg',
                    './assets/images/Texture1.jpg',
                    './assets/images/Texture2.jpg',
                    './assets/images/Texture3.jpg',
                    './assets/images/Texture5.jpg'
                ];
            
                window.gui.add(obj2, 'traverseAndColor2').name('CFD').onChange(function(value) {
                    localStorage.setItem('traverseAndColor2', value); // Save state to localStorage
                    const applyOrRestore = (start, end, texturePath, restore) => {
                        for (let i = start; i <= end; i++) {
                            traverseAndColor2(model.children[17].children[i], texturePath, restore);
                        }
                    };
            
                    if (value) {
                        applyOrRestore(0, 10, texturePaths[0], false);
                        applyOrRestore(11, 22, texturePaths[1], false);
                        applyOrRestore(23, 34, texturePaths[2], false);
                        applyOrRestore(35, 46, texturePaths[3], false);
                        applyOrRestore(47, 59, texturePaths[4], false);
                    } else {
                        applyOrRestore(0, 10, '', true);
                        applyOrRestore(11, 22, '', true);
                        applyOrRestore(23, 34, '', true);
                        applyOrRestore(35, 46, '', true);
                        applyOrRestore(47, 59, '', true);
                    }
                });
            
                var obj3 = {
                    traverseAndColor3: JSON.parse(localStorage.getItem('traverseAndColor3')) || false // Initial state of the checkbox from localStorage
                };
            
                window.gui.add(obj3, 'traverseAndColor3').name('Hvac Convection').onChange(function(value) {
                    localStorage.setItem('traverseAndColor3', value); // Save state to localStorage
                    if (value) {
                        for (let i = 0; i <= 267; i++) {
                            colorIndex = i - 1;
                            traverseAndColor3(model.children[75].children[i], false);
                        }
                    } else {
                        for (let i = 0; i <= 267; i++) {
                            traverseAndColor3(model.children[75].children[i], true);
                        }
                    }
                });
            
                const obj6 = {
                    createTemperatureSimulation: JSON.parse(localStorage.getItem('createTemperatureSimulation')) || false // Initial state of the checkbox from localStorage
                };
            
                let temperatureSimulations = []; // Store all simulation instances
            
                // Define ranges for each simulation
                const simulationRanges = [
                    [[3, 7.2], 5, [-2, 7]],
                    [[13, 5.5], 5, [-2, 7]],
                    [[-13, 1], 5, [-2, 7]],
                    [[0.1, -9], 5, [-2, 7]],
                    [[3, 7.2], 5, [8.5, 8.5]],
                    [[13, 5.5], 5, [8.5, 8.5]],
                    [[-13, 1], 5, [8.5, 8.5]],
                    [[0.1, -9], 5, [8.5, 8.5]]
                ];
            
                // GUI event handler
                window.gui.add(obj6, 'createTemperatureSimulation').name('Air Flow').onChange(function(value) {
                    localStorage.setItem('createTemperatureSimulation', value); // Save state to localStorage
                    if (value) {
                        // Iterate over each range and create simulations
                        simulationRanges.forEach(range => {
                            const simulation = createTemperatureSimulation(group, THREE, ...range);
                            temperatureSimulations.push(simulation);
                        });
                    } else {
                        // Remove all simulations
                        temperatureSimulations.forEach(simulation => {
                            simulation.remove(); // Call the remove function for each simulation
                        });
                        temperatureSimulations = []; // Clear the array
                    }
                });
            
                // Initialize the checkboxes based on localStorage values
                if (obj.traverseAndColor) {
                    obj.traverseAndColor = !obj.traverseAndColor; // Toggle to trigger onChange
                    window.gui.__controllers[0].setValue(!obj.traverseAndColor); // Set back to original value
                }
                if (obj1.traverseAndColor1) {
                    obj1.traverseAndColor1 = !obj1.traverseAndColor1; // Toggle to trigger onChange
                    window.gui.__controllers[1].setValue(!obj1.traverseAndColor1); // Set back to original value
                }
                if (obj2.traverseAndColor2) {
                    obj2.traverseAndColor2 = !obj2.traverseAndColor2; // Toggle to trigger onChange
                    window.gui.__controllers[2].setValue(!obj2.traverseAndColor2); // Set back to original value
                }
                if (obj3.traverseAndColor3) {
                    obj3.traverseAndColor3 = !obj3.traverseAndColor3; // Toggle to trigger onChange
                    window.gui.__controllers[3].setValue(!obj3.traverseAndColor3); // Set back to original value
                }
                if (obj6.createTemperatureSimulation) {
                    obj6.createTemperatureSimulation = !obj6.createTemperatureSimulation; // Toggle to trigger onChange
                    window.gui.__controllers[4].setValue(!obj6.createTemperatureSimulation); // Set back to original value
                }
            }


            
            
            
        }).catch((error) => {
            console.error('Error loading GLTF model:', error);
        });
       
        this.listen("updateShape", "updateShape");
    }
   
    
    
    teardown() {
        console.log("teardown lights");
     
        let scene = this.service("ThreeRenderManager").scene;
        scene.background?.dispose();
        scene.environment?.dispose();
        scene.background = null;
        scene.environment = null;

        // Dispose particle system
        if (this.particleSystem) {
            this.shape.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
    }

    updateShape(options) {
        this.constructBackground(options);
    }

    update(_time) {
        if (this.csm) this.csm.update();
    }
}

export default {
    modules: [{
        name: "Model2",
        pawnBehaviors: [ModelPawn]
    }]
};



// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
// import * as dat from 'dat.gui';

// class ModelPawn extends PawnBehavior {
//     setup() {
//         let trm = this.service("ThreeRenderManager");
//         let group = this.shape;

//         if (this.actor._cardData.toneMappingExposure !== undefined) {
//             trm.renderer.toneMappingExposure = this.actor._cardData.toneMappingExposure;
//         } 

//         const dracoLoader = new THREE.DRACOLoader();
//         dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/');
//         const gltfLoader = new THREE.GLTFLoader();
//         gltfLoader.setDRACOLoader(dracoLoader);

//         this.lights = [];
//         let particles = [];

//         const loadModelPromise = new Promise((resolve, reject) => {
//             gltfLoader.load(
//                 './assets/Server room .glb',
//                 (gltf) => {
//                     const model = gltf.scene;
//                     model.position.set(0, -1.6, 0);
//                     const scaleFactor = 2;
//                     model.scale.set(scaleFactor, scaleFactor, scaleFactor);

//                     group.add(model);
//                     resolve(model);
//                 },
//                 null,
//                 (error) => {
//                     console.error('Error loading GLTF model:', error);
//                     reject(error);
//                 }
//             );
//         });

//         loadModelPromise.then((model) => {
//             const colors = [0xff0e00, 0xff7100, 0xffde2d, 0xfbffff, 0x80f2ff, 0x01aeff, 0x0029ff];
//             for (let i = colors.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [colors[i], colors[j]] = [colors[j], colors[i]];
//             }

//             let colorIndex = 0;
//             const originalMaterials = new Map();

//             function traverseAndColor(object, restore = false) {
//                 if (object.isMesh) {
//                     if (restore) {
//                         const originalMaterial = originalMaterials.get(object);
//                         if (originalMaterial) {
//                             object.material = originalMaterial;
//                         }
//                     } else {
//                         if (!originalMaterials.has(object)) {
//                             originalMaterials.set(object, object.material);
//                         }
//                         const color = colors[colorIndex % colors.length];
//                         const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
//                         object.material = material;
//                         colorIndex++;
//                     }
//                 }
//                 object.children.forEach((child, index) => {
//                     if (index >= 1) {
//                         traverseAndColor(child, restore);
//                     }
//                 });
//             }

//             function traverseAndColor1(object, restore = false) {
//                 if (object.isMesh) {
//                     if (restore) {
//                         const originalMaterial = originalMaterials.get(object);
//                         if (originalMaterial) {
//                             object.material = originalMaterial;
//                         }
//                     } else {
//                         if (!originalMaterials.has(object)) {
//                             originalMaterials.set(object, object.material);
//                         }
//                         const color = colors[colorIndex % colors.length];
//                         const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
//                         object.material = material;
//                         colorIndex++;
//                     }
//                 }
//                 object.children.forEach((child, index) => {
//                     if (index >= 1) {
//                         traverseAndColor1(child, restore);
//                     }
//                 });
//             }

//             function traverseAndColor2(object, texturePath, restore = false) {
//                 if (object.isMesh) {
//                     if (restore) {
//                         const originalMaterial = originalMaterials.get(object);
//                         if (originalMaterial) {
//                             object.material = originalMaterial;
//                         }
//                     } else {
//                         if (!originalMaterials.has(object)) {
//                             originalMaterials.set(object, object.material);
//                         }
//                         const textureLoader = new THREE.TextureLoader();
//                         textureLoader.load(texturePath, (texture) => {
//                             const material = new THREE.MeshBasicMaterial({
//                                 map: texture,
//                                 transparent: true,
//                                 opacity: 0.6
//                             });
//                             object.material = material;
//                         });
//                     }
//                 }
//                 object.children.forEach((child) => {
//                     traverseAndColor2(child, texturePath, restore);
//                 });
//             }

//             function traverseAndColor3(object, restore = false) {
//                 if (object.isMesh) {
//                     if (restore) {
//                         const originalMaterial = originalMaterials.get(object);
//                         if (originalMaterial) {
//                             object.material = originalMaterial;
//                         }
//                     } else {
//                         if (!originalMaterials.has(object)) {
//                             originalMaterials.set(object, object.material);
//                         }
//                         const color = colors[colorIndex % colors.length];
//                         const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
//                         object.material = material;
//                         colorIndex++;
//                     }
//                 }
//                 object.children.forEach((child, index) => {
//                     if (index >= 1) {
//                         traverseAndColor3(child, restore);
//                     }
//                 });
//             }

//             function createTemperatureSimulation(group, THREE, xRange, yRange, zRange) {
//                 const particleCount = 3000;
//                 const particles = [];
//                 for (let i = 0; i < particleCount; i++) {
//                     const particle = new THREE.Mesh(
//                         new THREE.SphereGeometry(0.02, 1, 1),
//                         new THREE.MeshBasicMaterial({ color: 0xffffff })
//                     );
//                     particle.position.set(
//                         xRange[0] + Math.random() * xRange[1],
//                         -Math.random() * yRange,
//                         zRange[0] + Math.random() * zRange[1]
//                     );
//                     const temperature = (particle.position.y / 3) * 255;
//                     particle.material.color.setRGB(temperature / 255, 0, (255 - temperature) / 255);
//                     particles.push(particle);
//                     group.add(particle);
//                 }

//                 function removeParticles() {
//                     particles.forEach(particle => {
//                         group.remove(particle);
//                     });
//                     particles.length = 0;
//                 }

//                 function updateTemperature() {
//                     particles.forEach(particle => {
//                         particle.position.y += 0.01;
//                         const temperature = (particle.position.y / 3) * 255;
//                         particle.material.color.setRGB(temperature / 255, 0, (255 - temperature) / 255);
//                         if (particle.position.y > 3) {
//                             particle.position.y = -Math.random() * 3;
//                         }
//                     });
//                     requestAnimationFrame(updateTemperature);
//                 }

//                 updateTemperature();

//                 return {
//                     remove: removeParticles
//                 };
//             }

//             function init() {
//                 const scene = new THREE.Scene();
//                 const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//                 const renderer = new THREE.WebGLRenderer();
//                 renderer.setSize(window.innerWidth, window.innerHeight);
//                 document.body.appendChild(renderer.domElement);

//                 const group = new THREE.Group();
//                 scene.add(group);
//                 camera.position.set(5, 5, 20);
//                 camera.lookAt(5, 0, 5);

//                 function animate() {
//                     requestAnimationFrame(animate);
//                     updateTemperature();
//                     renderer.render(scene, camera);
//                 }

//                 function updateTemperature() {
//                     group.children.forEach(particles => {
//                         particles.children.forEach(particle => {
//                             particle.position.y += 0.01;
//                             const temperature = (particle.position.y / 3) * 255;
//                             particle.material.color.setRGB(temperature / 255, 0, (255 - temperature) / 255);
//                             if (particle.position.y > 3) {
//                                 particle.position.y = -Math.random() * 3;
//                             }
//                         });
//                     });
//                 }

//                 animate();
//             }

//             init();

//             if (!window.gui) {
//                 window.gui = new dat.GUI();
//                 var obj = {
//                     traverseAndColor: JSON.parse(localStorage.getItem('traverseAndColor')) || false
//                 };

//                 window.gui.add(obj, 'traverseAndColor').name('Server Temp').onChange(function(value) {
//                     localStorage.setItem('traverseAndColor', value);
//                     if (value) {
//                         for (let i = 0; i <= 74; i++) {
//                             if (i >= 5 && i <= 19) {
//                                 continue;
//                             }
//                             colorIndex = i - 1;
//                             for (let j = 2; j <= 13; j++) {
//                                 traverseAndColor(model.children[i].children[j], false);
//                             }
//                         }
//                     } else {
//                         for (let i = 0; i <= 74; i++) {
//                             if (i >= 5 && i <= 19) {
//                                 continue;
//                             }
//                             for (let j = 2; j <= 13;j++) {
//                                 traverseAndColor(model.children[i].children[j], true);
//                             }
//                         }
//                     }
//                 });

//                 var obj1 = {
//                     traverseAndColor1: JSON.parse(localStorage.getItem('traverseAndColor1')) || false
//                 };

//                 window.gui.add(obj1, 'traverseAndColor1').name('Server Capacity').onChange(function(value) {
//                     localStorage.setItem('traverseAndColor1', value);
//                     if (value) {
//                         for (let i = 0; i <= 74; i++) {
//                             if (i >= 5 && i <= 19) {
//                                 continue;
//                             }
//                             colorIndex = i - 1;
//                             for (let j = 2; j <= 13;j++) {
//                                 traverseAndColor1(model.children[i].children[j], false);
//                             }
//                         }
//                     } else {
//                         for (let i = 0; i <= 74; i++) {
//                             if (i >= 5 && i <= 19) {
//                                 continue;
//                             }
//                             for (let j = 2; j <= 13;j++) {
//                                 traverseAndColor1(model.children[i].children[j], true);
//                             }
//                         }
//                     }
//                 });

//                 var obj2 = {
//                     traverseAndColor2: JSON.parse(localStorage.getItem('traverseAndColor2')) || false
//                 };

//                 window.gui.add(obj2, 'traverseAndColor2').name('Server Power Consumption').onChange(function(value) {
//                     localStorage.setItem('traverseAndColor2', value);
//                     if (value) {
//                         const texturePath = './assets/Normal Server.jpg';
//                         for (let i = 0; i <= 74; i++) {
//                             if (i >= 5 && i <= 19) {
//                                 continue;
//                             }
//                             colorIndex = i - 1;
//                             for (let j = 2; j <= 13; j++) {
//                                 traverseAndColor2(model.children[i].children[j], texturePath, false);
//                             }
//                         }
//                     } else {
//                         const texturePath = './assets/Normal Server.jpg';
//                         for (let i = 0; i <= 74; i++) {
//                             if (i >= 5 && i <= 19) {
//                                 continue;
//                             }
//                             for (let j = 2; j <= 13;j++) {
//                                 traverseAndColor2(model.children[i].children[j], texturePath, true);
//                             }
//                         }
//                     }
//                 });

//                 var obj3 = {
//                     traverseAndColor3: JSON.parse(localStorage.getItem('traverseAndColor3')) || false
//                 };

//                 window.gui.add(obj3, 'traverseAndColor3').name('Server Heat Generation').onChange(function(value) {
//                     localStorage.setItem('traverseAndColor3', value);
//                     if (value) {
//                         const temperatureSimulation = createTemperatureSimulation(group, THREE, [0, 8], 5, [0, 4]);
//                     } else {
//                         // Remove the particles when the checkbox is unchecked
//                         const temperatureSimulation = createTemperatureSimulation(group, THREE, [0, 8], 5, [0, 4]);
//                         temperatureSimulation.remove();
//                     }
//                 });

//                 let highlightedObject = null; // Define highlightedObject variable

//         const onDocumentMouseClick = (event) => {
//             event.preventDefault();

//             const mouse = new THREE.Vector2(
//                 (event.clientX / window.innerWidth) * 2 - 1,
//                 -(event.clientY / window.innerHeight) * 2 + 1
//             );

//             const raycaster = new THREE.Raycaster();
//             raycaster.setFromCamera(mouse, trm.camera);

//             const intersects = raycaster.intersectObjects(group.children, true);

//             if (intersects.length > 0) {
//                 // Reset previously highlighted object
//                 if (highlightedObject) {
//                     resetObjectMaterial(highlightedObject);
//                 }

//                 const clickedObject = intersects[0].object;
//                 highlightObject(clickedObject);
//                 displayServerInfo(clickedObject);
//             }
//         };

//         const displayServerInfo = (server) => {
//             const serverInfo = document.getElementById('serverInfo');
//             serverInfo.innerHTML = `
//                 <h3>Server Info</h3>
//                 <p>ID: ${server.uuid}</p>
//                 <p>Name: ${server.name}</p>
//                 <p>Position: ${server.position.toArray().map(coord => coord.toFixed(2)).join(', ')}</p>
//                 <p>Rotation: ${[
//                     server.rotation.x.toFixed(2),
//                     server.rotation.y.toFixed(2),
//                     server.rotation.z.toFixed(2)
//                 ].join(', ')}</p>
//             `;
//         };

//         const highlightObject = (object) => {
//             // Store original material
//             if (!originalMaterials.has(object)) {
//                 originalMaterials.set(object, object.material);
//             }

//             // Set highlight material
//             const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//             object.material = highlightMaterial;

//             // Store highlighted object
//             highlightedObject = object;
//         };

//         const resetObjectMaterial = (object) => {
//             // Reset to original material
//             const originalMaterial = originalMaterials.get(object);
//             if (originalMaterial) {
//                 object.material = originalMaterial;
//             }
//         };

//         // Add click event listener to the document
//         document.addEventListener('click', onDocumentMouseClick, false);
        
                
//             }
//         });
//     }
// }

// export default {
//     modules: [
//         {
//             name: "Model2",
//             pawnBehaviors: [ModelPawn],
//         }
//     ]
// }
