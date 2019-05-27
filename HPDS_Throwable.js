//=============================================================================
// HPDS_Throwable.js
//=============================================================================

/**
 * @plugindesc A plugin that allows the user to pickup and throw items.
 * @author HPDS
 * v1.0.0
 *
 */

 (function() {
    

    // This section checks note tags for game events.
    // Start with alias of Game_Event.prototype.initialize.
    var _Game_Event_Init = Game_Event.prototype.initialize;

    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_Init.call(this, mapId, eventId);
      
        /**
         * As each Game_Event is initialized, its note can be accessed from the 
         * $dataMap.events[eventId] variable. Compare it with RegEx(s) in order to
         * parse note tags.
         */
        // let tagRegex = /<\s*test\s*>/ig;
        let tagRegex = /<\s*throwable\s*>/ig;
        let tagRead = tagRegex.exec($dataMap.events[eventId].note);
        // if (tagRead != null) {

        // The section above regarding the regEx is no longer used. Now, 
        // the meta functionality is used. 
        if($dataMap.events[eventId].meta.throwable) {
            // save original event variables
            var image = $dataMap.events[eventId].pages[0].image;
            var dFix = $dataMap.events[eventId].pages[0].directionFix;
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
            console.log($dataMap.events[eventId]);
        }
    };
    
    // ETC functions
    function addTestMessage() {
        var list = [
            {code: 101, indent: 0, parameters: ['Actor1', 0, 0, 2]},
            {code: 401, indent: 0, parameters: ["From inside plugin."]}
        ];
        return list;
    }

    // First page list changes self switch "A" to true 
    function addThrowableList1() {
        var list = [
            {code: 123, indent: 0, parameters: ["A", 0]},
            {code: 0, indent: 0, parameters: []}
        ]; 
        return list;
    }
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
            {code: 655, indent: 0, parameters: ["console.log(direction);"]},
            {code: 655, indent: 0, parameters: ["switch(direction) {"]},
            {code: 655, indent: 0, parameters: ["case 2:"]},
            {code: 655, indent: 0, parameters: ["console.log('facing down.');"]},
            {code: 655, indent: 0, parameters: ["evt.jump(0,1);"]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["case 4:"]},
            {code: 655, indent: 0, parameters: ["console.log('facing left.');"]},
            {code: 655, indent: 0, parameters: ["evt.jump(-1,0);"]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["case 6:"]},
            {code: 655, indent: 0, parameters: ["console.log('facing right.');"]},
            {code: 655, indent: 0, parameters: ["evt.jump(1,0);"]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["case 8:"]},
            {code: 655, indent: 0, parameters: ["console.log('facing up.');"]},
            {code: 655, indent: 0, parameters: ["evt.jump(0,-1);"]},
            {code: 655, indent: 0, parameters: ["break;"]},
            {code: 655, indent: 0, parameters: ["default:"]},
            {code: 655, indent: 0, parameters: ["console.log('default')"]},
            {code: 655, indent: 0, parameters: ["}"]},
            {code: 655, indent: 0, parameters: ["key = [mapId, eventId, 'B'];"]},
            {code: 655, indent: 0, parameters: ["$gameSelfSwitches.setValue(key, true);"]},
            {code: 655, indent: 0, parameters: ["evt.refresh();"]},
            // {code: 655, indent: 0, parameters: ["evt._x = $gamePlayer._x + 1;"]},
            // {code: 655, indent: 0, parameters: ["evt._y = $gamePlayer._y;"]},
            {code: 655, indent: 0, parameters: ["}"]},
            {code: 0, indent: 0, parameters: []}
        ];
        return list;
    }

    function addThrowableList3() {
        var list = [
            {code: 123, indent: 0, parameters: ["B", 1]},
            {code: 0, indent: 0, parameters: []}
        ]; 
        return list;
    }
 })();

/**
 * {code: 655, indent: 0, parameters: [""]},
 * var direction = $gamePlayer.direction();
 * console.log(direction);
 * switch(direction) {
 * case 2:
 * console.log('facing down.');
 * $gameMap.event(this._eventId).jump(0,1);
 * break;
 * case 4:
 * console.log('facing left.');
 * break;
 * case 6:
 * console.log('facing right.');
 * break;
 * case 8:
 * console.log('facing up.');
 * break;
 * }
 * 
 */