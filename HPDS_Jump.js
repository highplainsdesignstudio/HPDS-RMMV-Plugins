/*:
 * @plugindesc v2.0.0 HPDS Jump plugin for jumping.
 * @author Michael Hernandez | High Plains Design Studio www.highplainsdesignstudio.com
 * 
 * @param Common Event ID
 * @desc This plugin requires a free Common Event. Declare the Common Event ID.
 * @default 1
 * 
 * @param Switch ID
 * @desc This plugin requires a free Switch. Declare the Switch ID.
 * @default 1
 * 
 * @param Jump Distance
 * @desc The default jump distance in the game.
 * @default 3
 *
 * @param Jump SFX
 * @desc The default jump sound effect in the game.
 * @default Jump1
 * 
 * @param Jump SFX Volume
 * @desc The default jump sound effect volume in the game.
 * @default 90
 * 
 * @param Jump SFX Pitch
 * @desc The default jump sound effect pitch in the game.
 * @default 100
 * 
 * @param Jump SFX Pan
 * @desc The default jump sound effect pan in the game.
 * @default 0
 * 
 * @param Jump Cancel SFX
 * @desc The default jump cancel sound effect in the game.
 * @default Cancel1
 * 
 * @param Jump Cancel SFX Volume
 * @desc The default jump cancel sound effect volume in the game.
 * @default 90
 * 
 * @param Jump Cancel SFX Pitch
 * @desc The default jump cancel sound effect pitch in the game.
 * @default 100
 * 
 * @param Jump Cancel SFX Pan
 * @desc The default jump cancel sound effect pan in the game.
 * @default 0
 * 
 * @help 
 * This plugin provides the following plugin commands:
 * 
 * HPDS_Jump true               # Enables the HPDS_Jump_Plugin on. This must be set before the player can jump.
 * HPDS_Jump false              # Disables the HPDS_Jump_Plugin.
 * HPDS_Jump distance X         # Where X is a number - Changes the jump distance.
 * HPDS_Jump sfx Sound1         # Where Sound1 is the name of the new jump sound effect.
 * HPDS_Jump volume X           # Where X is a number - Changes the jump SFX volume.
 * HPDS_Jump pitch X            # Where X is a number - Changes the pitch of the jump SFX.
 * HPDS_Jump pan X              # Where X is a number - Changes the pan of the jump SFX.
 * HPDS_Jump cancelsfx Sound2   # Where Sound2 is the name of the new jump cancel sound effect.
 * HPDS_Jump cancelvolume X     # Where X is a number - Changes the jump cancel SFX volume.
 * HPDS_Jump cancelpitch X      # Where X is a number - Changes the pitch of the jump cancel SFX.
 * HPDS_Jump cancelpan X        # Where X is a number - Changes the pan of the jump cancel SFX
 * 
 */

(function() {

    // HPDS_Jump_Plugin variable declarations.
    HPDS_Jump_Plugin = {};
    HPDS_Jump_Plugin.parameters = PluginManager.parameters("HPDS_Jump");
    HPDS_Jump_Plugin.jumpCommonEventId = parseInt(HPDS_Jump_Plugin.parameters["Common Event ID"]);
    HPDS_Jump_Plugin.switchId = parseInt(HPDS_Jump_Plugin.parameters["Switch ID"]);
    HPDS_Jump_Plugin.jumpDistance = parseInt(HPDS_Jump_Plugin.parameters["Jump Distance"]);
    HPDS_Jump_Plugin.jumpSFX = HPDS_Jump_Plugin.parameters["Jump SFX"];
    HPDS_Jump_Plugin.jumpVolume = parseInt(HPDS_Jump_Plugin.parameters["Jump SFX Volume"]);
    HPDS_Jump_Plugin.jumpPitch = parseInt(HPDS_Jump_Plugin.parameters["Jump SFX Pitch"]);
    HPDS_Jump_Plugin.jumpPan = parseInt(HPDS_Jump_Plugin.parameters["Jump SFX Pan"]);
    HPDS_Jump_Plugin.jumpCancelSFX = HPDS_Jump_Plugin.parameters["Jump Cancel SFX"];
    HPDS_Jump_Plugin.jumpCancelVolume = parseInt(HPDS_Jump_Plugin.parameters["Jump Cancel SFX Volume"]);
    HPDS_Jump_Plugin.jumpCancelPitch = parseInt(HPDS_Jump_Plugin.parameters["Jump Cancel SFX Pitch"]);
    HPDS_Jump_Plugin.jumpCancelPan = parseInt(HPDS_Jump_Plugin.parameters["Jump Cancel SFX Pan"]);

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'HPDS_Jump') {
            switch (args[0]) {
            case 'true':
                $gameSwitches.setValue(HPDS_Jump_Plugin.switchId, true);
                break;
            case 'false':
                $gameSwitches.setValue(HPDS_Jump_Plugin.switchId, false);
                break;
            case 'distance':
                HPDS_Jump_Plugin.jumpDistance = Number(args[1]);
                break;
            case 'sfx':
                HPDS_Jump_Plugin.jumpSFX = args[1];
                break;
            case 'volume':
                HPDS_Jump_Plugin.jumpVolume = Number(args[1]);
                break;
            case 'pitch':
                HPDS_Jump_Plugin.jumpPitch = Number(args[1]);
                break;
            case 'pan':
                HPDS_Jump_Plugin.jumpPan = Number(args[1]);
                break;
            case 'cancelsfx':
                HPDS_Jump_Plugin.jumpCancelSFX = Number(args[1]);
                break;
            case 'cancelvolume':
                HPDS_Jump_Plugin.jumpCancelVolume = Number(args[1]);
                break;
            case 'cancelpitch':
                HPDS_Jump_Plugin.jumpCancelPitch = Number(args[1]);
                break;
            case 'cancelpan':
                HPDS_Jump_Plugin.jumpCancelPan = Number(args[1]);
                break;
            }
        }
    };

    HPDS_Jump_Plugin.jumpCommonEvent = {
        id: HPDS_Jump_Plugin.jumpCommonEventId,
        list: [
            {code: 355, indent: 0, parameters: ["if (Input.isTriggered('ok')) {"]},
            {code: 655, indent: 0, parameters: ["let _direction = $gamePlayer.direction();"]},
            {code: 655, indent: 0, parameters: ["HPDS_Jump_Plugin.jump(_direction); }"]},
            {code: 0, indent: 0, parameters: []}
        ],
        name: "HPDS_Jump",
        switchId: HPDS_Jump_Plugin.switchId,
        trigger: 2
    };

    DataManager.isDatabaseLoaded = function() {
        this.checkError();
        for (var i = 0; i < this._databaseFiles.length; i++) {
            if (!window[this._databaseFiles[i].name]) {
                return false;
            }
        }
        // This is added.
        $dataCommonEvents[HPDS_Jump_Plugin.jumpCommonEventId] = HPDS_Jump_Plugin.jumpCommonEvent;
        // End of added.
        return true;
    };

    /**
     * Check 4 directions and if the tile to be jumped to is something that the player could normally pass to.
     * $gamePlayer.canPass(x,y,dir) may not be the choice for the check. I found that, when jumping to a tile
     * over water, I had to give the player enough jump to jump a second tile after the water. 
     * This is because, the tile is impassable from the direction of the water, so $gamePlayer.canPass(x,y,dir)
     * returns false and cancels the jump.
     */
    _HPDS_checkJumpPossibility = function(direction) {
        var x = $gamePlayer._x;
        var y = $gamePlayer._y;
        switch (direction) {
            case 2:
                direction = 8;
                y += HPDS_Jump_Plugin.jumpDistance;
                break;
            case 4:
                direction = 6;
                x -= HPDS_Jump_Plugin.jumpDistance; 
                break;
            case 6:
                direction = 4;
                x += HPDS_Jump_Plugin.jumpDistance;
                break;
            case 8:
                direction = 2;
                y -= HPDS_Jump_Plugin.jumpDistance;
                break;
        }
        var possible = $gamePlayer.canPass(x, y, direction);
        return possible;
    };

    /**
     * The actual jump processing. 
     */
    HPDS_Jump_Plugin.jump = function(direction) { 
        if(_HPDS_checkJumpPossibility(direction)) {
            switch (direction) {
                case 2:
                    $gamePlayer.jump(0, HPDS_Jump_Plugin.jumpDistance);
                    break;
                case 4:
                    $gamePlayer.jump(-HPDS_Jump_Plugin.jumpDistance, 0); 
                    break;
                case 6:
                    $gamePlayer.jump(HPDS_Jump_Plugin.jumpDistance, 0);
                    break;
                case 8:
                    $gamePlayer.jump(0, -HPDS_Jump_Plugin.jumpDistance);
                    break;
            }
            // play audio too
            AudioManager.playSe({ name: HPDS_Jump_Plugin.jumpSFX, volume: HPDS_Jump_Plugin.jumpVolume, pitch: HPDS_Jump_Plugin.jumpPitch, pan: HPDS_Jump_Plugin.jumpPan });
            return true;
        } else {
            AudioManager.playSe({ name: HPDS_Jump_Plugin.jumpCancelSFX, volume: HPDS_Jump_Plugin.jumpCancelVolume, pitch: HPDS_Jump_Plugin.jumpCancelPitch, pan: HPDS_Jump_Plugin.jumpCancelPan });
            return false;
        }
    };
})();