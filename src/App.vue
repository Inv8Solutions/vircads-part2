<script setup lang="ts">
import Phaser from 'phaser';
import { ref, toRaw } from 'vue';
import PhaserGame from './PhaserGame.vue';

// References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref<any>();

// keep some existing helpers (optional)
const spritePosition = ref({ x: 0, y: 0 });

// Change / helper functions that interact with the current Phaser scene
const changeScene = () => {
    const scene = toRaw(phaserRef.value?.scene) as any;
    if (scene && typeof scene.changeScene === 'function') scene.changeScene();
}

const moveSprite = () => {
    const scene = toRaw(phaserRef.value?.scene) as any;
    if (scene && typeof scene.moveLogo === 'function') {
        scene.moveLogo(({ x, y }: { x: number; y: number }) => { spritePosition.value = { x, y }; });
    }
}

const addSprite = () => {
    const scene = toRaw(phaserRef.value?.scene) as Phaser.Scene | undefined;
    if (!scene) return;
    const x = Phaser.Math.Between(64, scene.scale.width - 64);
    const y = Phaser.Math.Between(64, scene.scale.height - 64);
    const star = scene.add.sprite(x, y, 'star');
    scene.add.tween({ targets: star, duration: 500 + Math.random() * 1000, alpha: 0, yoyo: true, repeat: -1 });
}

// Event emitted from the PhaserGame component
const currentScene = (scene: any) => {
    // example: update UI state when scene changes
}

// Dynamically import all scene modules from the scenes folder (Vite)
const modules = import.meta.glob('./game/scenes/*.ts', { eager: true }) as Record<string, any>;

type SceneEntry = { key: string; cls: any };
const sceneEntries: SceneEntry[] = Object.entries(modules).map(([path, mod]) => {
    const file = path.split('/').pop() || path;
    const key = file.replace(/\.(ts|js)x?$/, '');
    // pick first exported function/class
    const exported = Object.values(mod).find((v: any) => typeof v === 'function');
    return { key, cls: exported };
}).filter(e => e.cls);

const scenes = sceneEntries.map(s => s.key);

const startScene = (key: string) => {
    const entry = sceneEntries.find(e => e.key === key);
    if (!entry) return;

    // PhaserGame exposes `game` as a ref via defineExpose; get the actual Game instance
    const maybeGame = phaserRef.value?.game;
    const gameObj: Phaser.Game | undefined = maybeGame?.value ?? maybeGame ?? undefined;
    if (!gameObj) return;

    try {
        const sceneSys = (gameObj.scene as any);
        // register scene class if not present
        try {
            const existing = sceneSys.getScene?.(key);
            if (!existing && entry.cls) sceneSys.add(key, entry.cls, false);
        } catch (e) {
            if (entry.cls) {
                try { sceneSys.add(key, entry.cls, false); } catch (e) {}
            }
        }

        sceneSys.start(key);
    } catch (e) {}
}

</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />

    <div style="position:fixed; right:8px; top:8px; background:rgba(0,0,0,0.6); padding:10px; border-radius:6px; color:#fff; z-index:9999;">
        <div style="font-weight:600; margin-bottom:6px;">Dev Scenes</div>
        <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-start;">
            <div v-for="key in scenes" :key="key">
                <button class="button" @click="startScene(key)">{{ key }}</button>
            </div>
        </div>
    </div>

</template>
