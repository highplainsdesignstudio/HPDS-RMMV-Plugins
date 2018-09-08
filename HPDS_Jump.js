/*:
 * @plugindesc HPDS Jump plugin for jumping.
 * @author Michael Hernandez @ High Plains Design Studio www.highplainsdesignstudio.com
 * 
 * @param Jump Distance
 * @desc The default jump distance in the game.
 * @default 3
 *
 * @param Jump SE
 * @desc The default jump sound effect in the game.
 * @default Jump1
 * 
 * @param Jump SE Volume
 * @desc The default jump sound effect volume in the game.
 * @default 90
 * 
 * @param Jump SE Pitch
 * @desc The default jump sound effect pitch in the game.
 * @default 100
 * 
 * @param Jump SE Pan
 * @desc The default jump sound effect pan in the game.
 * @default 0
 * 
 * @param Jump Cancel SE
 * @desc The default jump cancel sound effect in the game.
 * @default Cancel1
 * 
 * @param Jump Cancel SE Volume
 * @desc The default jump cancel sound effect volume in the game.
 * @default 90
 * 
 * @param Jump Cancel SE Pitch
 * @desc The default jump cancel sound effect pitch in the game.
 * @default 100
 * 
 * @param Jump Cancel SE Pan
 * @desc The default jump cancel sound effect pan in the game.
 * @default 0
 * 
 * @help This plugin does not provide plugin commands.
 */

(function() {

    // HPDS_Jump_Plugin variable declarations.
    HPDS_Jump_Plugin = {};
    HPDS_Jump_Plugin.parameters = PluginManager.parameters("HPDS_Jump");
    HPDS_Jump_Plugin.jumpDistance = parseInt(HPDS_Jump_Plugin.parameters["Jump Distance"]);
    HPDS_Jump_Plugin.jumpSE = HPDS_Jump_Plugin.parameters["Jump SE"];
    HPDS_Jump_Plugin.jumpVolume = parseInt(HPDS_Jump_Plugin.parameters["Jump SE Volume"]);
    HPDS_Jump_Plugin.jumpPitch = parseInt(HPDS_Jump_Plugin.parameters["Jump SE Pitch"]);
    HPDS_Jump_Plugin.jumpPan = parseInt(HPDS_Jump_Plugin.parameters["Jump SE Pan"]);
    HPDS_Jump_Plugin.jumpCancelSE = HPDS_Jump_Plugin.parameters["Jump Cancel SE"];
    HPDS_Jump_Plugin.jumpCancelVolume = parseInt(HPDS_Jump_Plugin.parameters["Jump Cancel SE Volume"]);
    HPDS_Jump_Plugin.jumpCancelPitch = parseInt(HPDS_Jump_Plugin.parameters["Jump Cancel SE Pitch"]);
    HPDS_Jump_Plugin.jumpCancelPan = parseInt(HPDS_Jump_Plugin.parameters["Jump Cancel SE Pan"]);

    Game_Player.prototype.triggerButtonAction = function() {
        if (Input.isTriggered('ok')) {
            if (this.getOnOffVehicle()) {
                return true;
            }
            this.checkEventTriggerHere([0]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
            this.checkEventTriggerThere([0,1,2]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }

            // Try to Jump
            var direction = $gamePlayer.direction();
            HPDS_Jump_Plugin.jump(direction);
        }
        return false;
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
            AudioManager.playSe({ name: HPDS_Jump_Plugin.jumpSE, volume: HPDS_Jump_Plugin.jumpVolume, pitch: HPDS_Jump_Plugin.jumpPitch, pan: HPDS_Jump_Plugin.jumpPan });
        } else {
            AudioManager.playSe({ name: HPDS_Jump_Plugin.jumpCancelSE, volume: HPDS_Jump_Plugin.jumpCancelVolume, pitch: HPDS_Jump_Plugin.jumpCancelPitch, pan: HPDS_Jump_Plugin.jumpCancelPan });
        }
    };
})();