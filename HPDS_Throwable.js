//=============================================================================
// HPDS_Throwable.js
//=============================================================================
/**
 *  * v1.1.0
 * UPDATES: 
 * - Removed code that was left for debugging.
 * - A sound effect can now be added using <se:name> in event note.
 * - Throwable distance can now be set using <throwable:x> where x is a number.
 * - The event's reset page has been updated to work for distances greater than 1. 
 *
 */

/*:
 * @plugindesc A plugin that allows the user to pickup and throw items.
 * @author Michael Hernandez @ High Plains Design Studio www.highplainsdesignstudio.com
 * @help An event can be made throwable by placing a tag in the event's note.
 * To use, place following tags in the event's note. No spaces.
 * <throwable:X>
 * <se:name>
 * Where X is a number and name is the name of a sound effect. 
 * No event pages can be added to a throwable event.
 * 
 */

 (function() {
    // Plugin global variable.
    var HPDS_Throwable_Plugin = {};

    // This section checks meta tags for game events.
    // Start with alias of Game_Event.prototype.initialize.
    var _Game_Event_Init = Game_Event.prototype.initialize;

    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_Init.call(this, mapId, eventId);
      
        /**
         * As each Game_Event is initialized, its note can be accessed from the 
         * $dataMap.events[eventId].meta variables. 
         */

        if($dataMap.events[eventId].meta.throwable) {
            // save original event variables - needs tweaking and testing in order to determine what variables should be saved and used. 
            var image = $dataMap.events[eventId].pages[0].image;
            var dFix = $dataMap.events[eventId].pages[0].directionFix;

            // save additional meta variables
            HPDS_Throwable_Plugin._throwableDistance = parseInt($dataMap.events[eventId].meta.throwable);
            HPDS_Throwable_Plugin._throwSE = $dataMap.events[eventId].meta.se;

            // Set HPDS_Throwable_Plugin._throwableDistance to 1 if it is NaN or 0 or negative.
            if(isNaN(HPDS_Throwable_Plugin._throwableDistance) || HPDS_Throwable_Plugin._throwableDistance <= 0) {
                HPDS_Throwable_Plugin._throwableDistance = 1;
            }
            // set the list objects to replace the evt.jump(x,y) distances. These variables are used in list parameters; 
            // in particular, addThrowableList2() uses them in order to call the event jump command.
            HPDS_Throwable_Plugin._throwUp = "evt.jump(0," + HPDS_Throwable_Plugin._throwableDistance.toString() + ");";
            HPDS_Throwable_Plugin._throwLeft = "evt.jump(-" + HPDS_Throwable_Plugin._throwableDistance.toString() + ",0);";
            HPDS_Throwable_Plugin._throwRight = "evt.jump(" + HPDS_Throwable_Plugin._throwableDistance.toString() + ",0);";
            HPDS_Throwable_Plugin._throwDown = "evt.jump(0,-" + HPDS_Throwable_Plugin._throwableDistance.toString() + ");";
            
            // if the <throwable> tag is found in an event note, add new pages to the event.
            $dataMap.events[eventId].pages[0].list = addThrowableList1();
            $dataMap.events[eventId].pages[1] = {
                conditions: {
                    actorId: 1,
                    actorValid: false,
                    itemId: 1,
                    itemValid: false,
                    selfSwitchCh: "A",
                    selfSwitchValid: true,
                    switch1Id: 1,
                    switch1Valid: false,
                    switch2Id: 1,
                    switch2Valid: false,
                    variableId: 1,
                    variableValid: false,
                    variableValue: 0
                },
                directionFix: dFix,
                image: image,
                list: addThrowableList2(),
                moveFrequency: $dataMap.events[eventId].pages[0].moveFrequency,
                moveRoute: $dataMap.events[eventId].pages[0].moveRoute,
                moveSpeed: $dataMap.events[eventId].pages[0].moveSpeed,
                movetype: $dataMap.events[eventId].pages[0].movetype,
                priorityType: $dataMap.events[eventId].pages[0].priorityType,
                stepAnime: $dataMap.events[eventId].pages[0].stepAnime,
                through: $dataMap.events[eventId].pages[0].through,
                trigger: 4,
                walkAnime: $dataMap.events[eventId].pages[0].walkAnime
            };
            $dataMap.events[eventId].pages[2] = {
                conditions: {
                    actorId: 1,
                    actorValid: false,
                    itemId: 1,
                    itemValid: false,
                    selfSwitchCh: "B",
                    selfSwitchValid: true,
                    switch1Id: 1,
                    switch1Valid: false,
                    switch2Id: 1,
                    switch2Valid: false,
                    variableId: 1,
                    variableValid: false,
                    variableValue: 0
                },
                directionFix: dFix,
                image: image,
                list: addThrowableList3(),
                moveFrequency: $dataMap.events[eventId].pages[0].moveFrequency,
                moveRoute: $dataMap.events[eventId].pages[0].moveRoute,
                moveSpeed: $dataMap.events[eventId].pages[0].moveSpeed,
                movetype: $dataMap.events[eventId].pages[0].movetype,
                priorityType: $dataMap.events[eventId].pages[0].priorityType,
                stepAnime: $dataMap.events[eventId].pages[0].stepAnime,
                through: $dataMap.events[eventId].pages[0].through,
                trigger: 0,
                walkAnime: $dataMap.events[eventId].pages[0].walkAnime
            };

            // This statement changes the trigger for pages[2]. 
            // if the throwdistance is over 1, the trigger should be autorun.
            // This is because the game player automatically presses the "ok" button on an event that has 
            // been thrown a distance of 1. 
            if (HPDS_Throwable_Plugin._throwableDistance > 1) {
                $dataMap.events[eventId].pages[2].trigger = 3;
            }
        }
    };
    
    // First page list changes self switch "A" to true 
    function addThrowableList1() {
        var list = [
            {code: 123, indent: 0, parameters: ["A", 0]},
            {code: 0, indent: 0, parameters: []}
        ]; 
        return list;
    }

    // Second page list adds the bulk of commands after the event has been activated.
    // This list sets commands that pickup and throw the event. 
    function addThrowableList2() {
        var list = [
            {code: 355, indent: 0, parameters: ["var evt = $gameMap.event(this._eventId);"]},
            {code: 655, indent: 0, parameters: ["evt._x = $gamePlayer._x;"]},
            {code: 655, indent: 0, parameters: ["evt._y = $gamePlayer._y;"]},
            {code: 655, indent: 0, parameters: ["evt._realX = $gamePlayer._realX;"]},
            {code: 655, indent: 0, parameters: ["evt._realY = $gamePlayer._realY;"]},
            {code: 355, indent: 0, parameters: ["if (Input.isTriggered('ok')) {"]},
            {code: 655, indent: 0, parameters: ["var mapId = $gameMap._mapId;"]},
            {code: 655, indent: 0, parameters: ["var eventId = this._eventId;"]},
            {code: 655, indent: 0, parameters: ["var key = [mapId, eventId, 'A'];"]},
            {code: 655, indent: 0, parameters: ["$gameSelfSwitches.setValue(key, false);"]},
            {code: 655, indent: 0, parameters: ["var evt = $gameMap.event(this._eventId);"]},
            {code: 655, indent: 0, parameters: ["var direction = $gamePlayer.direction();"]},
            {code: 655, indent: 0, parameters: ["AudioManager.playSe({name: $dataMap.events[evt._eventId].meta.se, volume: 90, pitch: 100, pan: 0});"]},
            {code: 655, indent: 0, parameters: ["switch(direction) {"]},
            {code: 655, indent: 0, parameters: ["case 2:"]},
            {code: 655, indent: 0, parameters: [HPDS_Throwable_Plugin._throwUp]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["case 4:"]},
            {code: 655, indent: 0, parameters: [HPDS_Throwable_Plugin._throwLeft]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["case 6:"]},
            {code: 655, indent: 0, parameters: [HPDS_Throwable_Plugin._throwRight]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["case 8:"]},
            {code: 655, indent: 0, parameters: [HPDS_Throwable_Plugin._throwDown]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["default:"]},
            {code: 655, indent: 0, parameters: ["}"]},
            {code: 655, indent: 0, parameters: ["key = [mapId, eventId, 'B'];"]},
            {code: 655, indent: 0, parameters: ["$gameSelfSwitches.setValue(key, true);"]},
            {code: 655, indent: 0, parameters: ["evt.refresh();"]},
            {code: 655, indent: 0, parameters: ["}"]},
            {code: 0, indent: 0, parameters: []}
        ];
        return list;
    }

    // Third list.
    // This list is necessary in order to reset the event after it has been thrown. 
    // This list's trigger is changed depending on the throwable distance. 
    // Trigger is either 0 or 3 based in distance.
    function addThrowableList3() {
        var list = [
            {code: 123, indent: 0, parameters: ["B", 1]},
            {code: 0, indent: 0, parameters: []}
        ]; 
        return list;
    }
 })();