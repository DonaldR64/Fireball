    
    const changeGraphic = (tok,prev) => {
        



    }    
    
    
    
    const registerEventHandlers = () => {
        //on('chat:message', handleInput);
        //on("add:graphic", addGraphic);
        on('change:graphic',changeGraphic);
        //on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===>  <===");
        //log("===> Software Version: " + version + " <===")
        //LoadPage();
        //DefineHexInfo();
        //BuildMap();
        registerEventHandlers();
        sendChat("","API Ready at " + new Date().toLocaleTimeString("en-US", {timeZone: "America/Toronto"}) + " EST");
        log("On Ready Done")
    });
    return {
        // Public interface here
    };