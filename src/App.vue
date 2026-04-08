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

// Order scenes: Boot, Intro, then numeric scenes (scene_1, scene_2, ...), then any other scenes
const allKeys = sceneEntries.map(s => s.key);
const orderedNames = ['Boot', 'Intro'];
const named = orderedNames.filter(n => allKeys.includes(n));
const numeric = allKeys
    .filter(k => /scene_\d+$/.test(k))
    .sort((a, b) => {
        const na = parseInt(a.match(/scene_(\d+)$/)![1], 10);
        const nb = parseInt(b.match(/scene_(\d+)$/)![1], 10);
        return na - nb;
    });
const others = allKeys.filter(k => !named.includes(k) && !numeric.includes(k)).sort((a, b) => a.localeCompare(b));
const scenes = [...named, ...numeric, ...others];

const startScene = (key: string) => {
    const entry = sceneEntries.find(e => e.key === key);
    if (!entry) return;

    // PhaserGame exposes `game` as a ref via defineExpose; get the actual Game instance
    const maybeGame = phaserRef.value?.game;
    const gameObj: Phaser.Game | undefined = maybeGame?.value ?? maybeGame ?? undefined;
    if (!gameObj) return;

    try {
        const sceneSys = (gameObj.scene as any);
        // stop any currently active scenes (so we reliably return)
        try {
            const active = (sceneSys.getScenes ? sceneSys.getScenes(true) : []) || [];
            for (const s of active) {
                const k = s && s.scene && s.scene.key ? s.scene.key : (s.key || null);
                if (k && k !== key) {
                    try { sceneSys.stop(k); } catch (e) {}
                }
            }
        } catch (e) {}

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

    <div style="position:fixed; right:8px; top:8px; background:rgba(0,0,0,0.6); padding:10px; border-radius:6px; color:#fff; z-index:9999; max-height:80vh; width:260px; box-sizing:border-box;">
        <div style="font-weight:600; margin-bottom:6px;">Dev Scenes</div>
        <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-start; max-height:calc(80vh - 36px); overflow-y:auto; padding-right:6px;">
            <div v-for="key in scenes" :key="key">
                <button class="button" @click="startScene(key)">{{ key }}</button>
            </div>
        </div>
    </div>

</template>
