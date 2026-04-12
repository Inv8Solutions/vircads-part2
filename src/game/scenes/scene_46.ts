import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Scene46 extends Scene {
    constructor() { super('scene_46'); }

    create() {
        const { width, height } = this.scale;
        this.add.image(width / 2, height / 2, 'scene_46').setDisplaySize(width, height);

        // Center dialog container for 3D model viewer (pattern copied from scene_25)
        const dialogW = Math.min(900, Math.round(width * 0.7));
        const dialogH = Math.min(620, Math.round(height * 0.7));
        const padding = 14;

        const bg = this.add.graphics().setDepth(1000);
        bg.fillStyle(0x000000, 0.92);
        bg.fillRoundedRect(-dialogW / 2, -dialogH / 2, dialogW, dialogH, 12);

        const title = this.add.text(0, -dialogH / 2 + padding, '3D Model Viewer', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5, 0).setDepth(1001);

        const vpW = dialogW - padding * 2;
        const vpH = dialogH - padding * 2 - 32;
        const viewport = this.add.rectangle(0, 0, vpW, vpH, 0x111111, 0.85).setOrigin(0.5).setDepth(1001);
        viewport.setStrokeStyle(2, 0x444444, 1);

        const hint = this.add.text(0, 0, '3D model viewport (three.js / GLB)', { font: '14px Arial', color: '#cccccc' }).setOrigin(0.5).setDepth(1002);

        const container = this.add.container(width / 2, height / 2, [bg, title, viewport, hint]).setDepth(1000);
        viewport.y = 12;
        hint.y = viewport.y + vpH / 2 - 18;

        const vpBounds = {
            x: width / 2,
            y: height / 2 + viewport.y,
            width: vpW,
            height: vpH
        };
        this.data.set('heartModelViewport', vpBounds);

        const GLB_URL = 'assets/heart_model.glb';
        const ENABLE_3D = true;
        if (ENABLE_3D) {
            this.initThreeOBJ(GLB_URL, vpBounds);
        }

        // Bottom-center dialog: interaction hint
        const botW = Math.min(520, Math.round(width * 0.5));
        const botPad = 10;
        const botText = 'Click and drag inside the 3D viewer to rotate the model';
        const botStyle: Phaser.Types.GameObjects.Text.TextStyle = { font: '15px Arial', color: '#ffffff', wordWrap: { width: botW - botPad * 2 } };
        const botObj = this.add.text(0, 0, botText, botStyle).setOrigin(0.5, 0).setDepth(1002);
        const botH = botPad + botObj.height + botPad;
        const botBg = this.add.graphics().setDepth(1001);
        botBg.fillStyle(0x000000, 0.9);
        botBg.fillRoundedRect(-botW / 2, 0, botW, botH, 8);
        const botY = height - botH - 18;
        const botContainer = this.add.container(width / 2, botY, [botBg, botObj]).setDepth(1002);
        botObj.x = 0; botObj.y = botPad;

        // Side dialogs (sequence of 3) shown around the 3D container
        const sidePad = 12;

        let currentDialog: Phaser.GameObjects.Container | null = null;
        const makeSideDialog = (side: 'left' | 'right', text: string, speakerKey?: string) => {
            if (currentDialog) { currentDialog.destroy(); currentDialog = null; }

            // compute max text width and create text for measurement
            const maxTextW = Math.min(260, Math.round(width * 0.16)) - sidePad * 2;
            const txt = this.add.text(0, 0, text, { font: '16px Arial', color: '#ffffff', wordWrap: { width: maxTextW } }).setOrigin(0.5, 0);

            // avatar (optional) size
            let avatarSize = 0;
            let avatarImg: Phaser.GameObjects.Image | null = null;
            if (speakerKey) {
                avatarSize = Math.min(96, Math.round((Math.min(260, Math.round(width * 0.16))) * 0.6));
                avatarImg = this.add.image(0, 0, speakerKey).setDisplaySize(avatarSize, avatarSize);
            }

            // compute box dimensions wrapping content
            const contentW = Math.max(txt.width, avatarSize);
            const boxW = Math.min(Math.max(contentW + sidePad * 2, 140), Math.round(width * 0.2));
            const contentHeight = txt.height + (avatarSize ? (avatarSize + 8) : 0);
            const boxH = Math.min(Math.max(contentHeight + sidePad * 2, 60), Math.round(vpH * 0.95));

            // background
            const g = this.add.graphics();
            g.fillStyle(0x000000, 0.92);
            g.fillRoundedRect(-boxW / 2, -boxH / 2, boxW, boxH, 8);

            // position children centered inside the box
            if (avatarImg) {
                avatarImg.x = 0;
                avatarImg.y = -boxH / 2 + sidePad + avatarSize / 2;
            }
            txt.x = 0;
            txt.y = -boxH / 2 + sidePad + (avatarSize ? (avatarSize + 8) : 0);

            const x = side === 'left'
                ? Math.round(width / 2 - vpW / 2 - boxW / 2 - 16)
                : Math.round(width / 2 + vpW / 2 + boxW / 2 + 16);

            const children: Phaser.GameObjects.GameObject[] = [g, txt];
            if (avatarImg) children.push(avatarImg);

            const cont = this.add.container(x, Math.round(height / 2), children).setDepth(1003);
            currentDialog = cont;
            return cont;
        };

        // Dialog texts
        const d1 = 'Taking a closer look, it is clear that there is a penetrating wound, aligning with the stab wound examined in the postmortem examination.';
        const d2 = 'Lab Tech: Doctor, I suggest we rotate the heart so we can see the full extent of the injury.';
        const d3 = 'Lab Tech: I will now take the heart and weigh it, doc.';

        // show first dialog (left)
        makeSideDialog('left', d1);

        // Lower-right Next button (steps through dialogs)
        const nextX = width - 96;
        const nextY = height - 72;
        const nbBg = this.add.rectangle(0, 0, 160, 48, 0x000000, 0.85).setOrigin(0.5).setDepth(1005);
        const nbTxt = this.add.text(0, 0, 'Next', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(1006);
        nbBg.setInteractive({ useHandCursor: true });
        const nbContainer = this.add.container(nextX, nextY, [nbBg, nbTxt]).setDepth(1005);

        let dialogStep = 1;
        nbBg.on('pointerdown', () => {
            dialogStep++;
            if (dialogStep === 2) {
                makeSideDialog('right', d2, 'lab_tech');
            } else if (dialogStep === 3) {
                makeSideDialog('right', d3, 'lab_tech');
            } else {
                nbContainer.destroy();
                if (currentDialog) { currentDialog.destroy(); currentDialog = null; }
                this.scene.start('scene_47');
            }
        });

        EventBus.emit('current-scene-ready', this);
    }

    private initThreeOBJ(assetUrl: string, vp: { x: number; y: number; width: number; height: number }) {
        const parent = this.game.canvas.parentElement || document.body;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(vp.width, vp.height);
        renderer.domElement.style.position = 'absolute';
        const canvasRect = this.game.canvas.getBoundingClientRect();
        const left = Math.round(canvasRect.left + vp.x - vp.width / 2 + window.scrollX);
        const top = Math.round(canvasRect.top + vp.y - vp.height / 2 + window.scrollY);
        renderer.domElement.style.left = `${left}px`;
        renderer.domElement.style.top = `${top}px`;
        renderer.domElement.style.pointerEvents = 'auto';
        const gameZStr = window.getComputedStyle(this.game.canvas).zIndex || '0';
        const gameZ = Number.isNaN(parseInt(gameZStr, 10)) ? 0 : parseInt(gameZStr, 10);
        renderer.domElement.style.zIndex = String(gameZ + 1);
        parent.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, vp.width / vp.height, 0.1, 1000);
        camera.position.set(0, 1, 3);

        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        const dir = new THREE.DirectionalLight(0xffffff, 0.9);
        dir.position.set(2, 3, 4);
        scene.add(ambient, dir);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.07;
        controls.screenSpacePanning = false;
        controls.target.set(0, 0, 0);

        const stopPropagation = (e: Event) => { e.stopPropagation(); };
        renderer.domElement.addEventListener('pointerdown', stopPropagation);
        renderer.domElement.addEventListener('pointermove', stopPropagation);
        renderer.domElement.addEventListener('pointerup', stopPropagation);
        renderer.domElement.addEventListener('touchstart', stopPropagation);
        renderer.domElement.addEventListener('touchmove', stopPropagation);
        renderer.domElement.addEventListener('touchend', stopPropagation);

        const loader = new GLTFLoader();
        loader.load(
            assetUrl,
            (gltf) => {
                const model = gltf.scene || gltf.scenes?.[0];
                if (!model) {
                    console.warn('GLTF loaded but no scene found:', assetUrl);
                    return;
                }
                model.position.set(0, 0, 0);
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3()).length();
                const scale = Math.max(0.5, 3.0 / size);
                model.scale.setScalar(scale);
                scene.add(model);
            },
            undefined,
            (err) => { console.warn('GLTF load failed:', assetUrl, err); }
        );

        const update = () => {
            controls.update();
            renderer.render(scene, camera);
        };
        this.events.on('update', update);

        const onWindowResize = () => {
            const canvasRect = this.game.canvas.getBoundingClientRect();
            const left = Math.round(canvasRect.left + vp.x - vp.width / 2 + window.scrollX);
            const top = Math.round(canvasRect.top + vp.y - vp.height / 2 + window.scrollY);
            renderer.domElement.style.left = `${left}px`;
            renderer.domElement.style.top = `${top}px`;
            renderer.setSize(vp.width, vp.height);
            camera.aspect = vp.width / vp.height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onWindowResize);

        this.events.once('shutdown', () => {
            this.events.off('update', update);
            renderer.domElement.removeEventListener('pointerdown', stopPropagation);
            renderer.domElement.removeEventListener('pointermove', stopPropagation);
            renderer.domElement.removeEventListener('pointerup', stopPropagation);
            renderer.domElement.removeEventListener('touchstart', stopPropagation);
            renderer.domElement.removeEventListener('touchmove', stopPropagation);
            renderer.domElement.removeEventListener('touchend', stopPropagation);
            controls.dispose();
            renderer.dispose();
            renderer.domElement.remove();
            window.removeEventListener('resize', onWindowResize);
        });
    }
}

export default Scene46;
