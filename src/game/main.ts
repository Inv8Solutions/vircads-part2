
import { Boot } from './scenes/Boot';
import { Intro } from './scenes/Intro';
import { Scene1 } from './scenes/scene_1';
import { Scene2 } from './scenes/scene_2';
import { Scene3 } from './scenes/scene_3';
import { Scene4 } from './scenes/scene_4';
import { Scene5 } from './scenes/scene_5';
import { Scene6 } from './scenes/scene_6';
import { Scene7 } from './scenes/scene_7';
import { Scene8 } from './scenes/scene_8';
import { Scene9 } from './scenes/scene_9';
import { Scene10 } from './scenes/scene_10';
import { Scene11 } from './scenes/scene_11';
import { Scene12 } from './scenes/scene_12';
import { Scene13 } from './scenes/scene_13';
import { Scene14 } from './scenes/scene_14';
import { Scene15 } from './scenes/scene_15';
import { Scene16 } from './scenes/scene_16';
import { Scene17 } from './scenes/scene_17';
import { Scene18 } from './scenes/scene_18';
import { Scene19 } from './scenes/scene_19';
import { Scene20 } from './scenes/scene_20';
import { Scene21 } from './scenes/scene_21';
import { Scene22 } from './scenes/scene_22';
import { Scene23 } from './scenes/scene_23';
import { Scene24 } from './scenes/scene_24';
import { Scene25 } from './scenes/scene_25';
import { Scene26 } from './scenes/scene_26';
import { Scene27 } from './scenes/scene_27';
import { Scene28 } from './scenes/scene_28';
import { Scene29 } from './scenes/scene_29';
import { Scene30 } from './scenes/scene_30';
import { Scene31 } from './scenes/scene_31';
import { Scene32 } from './scenes/scene_32';
import { Scene33 } from './scenes/scene_33';
import { Scene34 } from './scenes/scene_34';
import { Scene35 } from './scenes/scene_35';
import { Scene36 } from './scenes/scene_36';
import { Scene37 } from './scenes/scene_37';
import { Scene38 } from './scenes/scene_38';
import { Scene39 } from './scenes/scene_39';
import { Scene40 } from './scenes/scene_40';
import { Scene41 } from './scenes/scene_41';
import { Scene42 } from './scenes/scene_42';
import { Scene43 } from './scenes/scene_43';
import { Scene44 } from './scenes/scene_44';
import { Scene45 } from './scenes/scene_45';
import { AUTO, Game } from 'phaser';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1600,
    height: 900,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Intro,
        Scene1,
        Scene2,
        Scene3,
        Scene4,
        Scene5,
        Scene6,
        Scene7,
        Scene8,
        Scene9,
        Scene10,
        Scene11,
        Scene12,
        Scene13,
        Scene14,
        Scene15,
        Scene16,
        Scene17,
        Scene18,
        Scene19,
        Scene20,
        Scene21,
        Scene22,
        Scene23,
        Scene24,
        Scene25,
        Scene26,
        Scene27,
        Scene28,
        Scene29,
        Scene30,
        Scene31,
        Scene32,
        Scene33,
        Scene34,
        Scene35
        ,
        Scene36,
        Scene37,
        Scene38,
        Scene39,
        Scene40,
        Scene41,
        Scene42,
        Scene43,
        Scene44,
        Scene45
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
