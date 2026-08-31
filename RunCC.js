const RunCC = () => {
    let group = CloseCombats.shift();
    if (group) {
        SetupCard("Close Combat","","Neutral");
        let highestResult = [0,0];
        let sides = [[],[]];
        let leaders = [false,false]
        for (let i=0;i<group.length;i++) {
            let attacker = Elements[group[i]];
            //check has a defender
            let defender = false;
            for (let j=0;j<group.length;j++) {
                if (i === j) {continue};
                let el2 = Elements[group[j]];
                if (el2.nation !== attacker.nation) {
                    defender = true;
                    break;
                }
            }
            if (defender === false) {continue};
            sides[attacker.player].push(attacker.id);
            if (attacker.leader === true && attacker.Status() !== "Broken") {
                leaders[attacker.player] = true;
            }
        }
        for (let side = 0;side < 2;side++) {
            outputCard.body.push("[U]" + Element[sides[side]].nation + "[/u]");
            for (let i=0;i<sides[side].length;i++) {
                let element = Elements[sides[side][i]];
                let drm = 0;
                let roll = randomInteger(6);
                let tips = ["Roll" + roll];
                if (leaders[side] === true) {
                    drm++;
                    tips.push("Leader in Combat");
                }
                if (element.name.includes("SMG")) {
                    drm++;
                    tips.push("SMG +1");
                }
                if (element.name.includes("Engineer") || element.name.includes("Pioneer")) {
                    drm++;
                    tips.push("Engineer +1");
                }
                //Banzai chearge here
                if (element.type.includes("Team")) {
                    drm--;
                    tips.push("Team -1");
                }
                if (element.Status() === "Broken") {
                    drm -=2;
                    tips.push("Broken -2");
                }
                if (element.type === "Crewed Weapon") {
                    drm -=2;
                    tips.push("Crewed Weapon -2");
                }
                //enclosed armoured vehicle here
                //open topped vehicle here
                if (element.type === "Soft Vehicle") {
                    tips.push("Soft Vehicle +0");
                }
                //molotov cocktails vs vehicles here
                //grenade bundles / magnetic mines vs vehicles here
                //demo change vs vehicles here

                tips = tips.toString().replaceAll(",","<br>");
                let result = roll + drm;
                let tip = '['+ result + ' ](#" class="showtip" title="' + tips + ')';                
                outputCard.body.push(element.name + ": " + tip);
                highestResult[side] = Math.max(highestResult[side],result);
            }
            outputCard.body.push("[hr]");
        }
        let delta = highestResult[0] - highestResult[1];
        let remaining = ["All"];
        if (delta > 0) {
            outputCard.body.push(state.FbF.nations[0] + " Wins!");

        } else if (delta < 0) {
            outputCard.body.push(state.FbF.nations[1] + " Wins!");

        } else {
            outputCard.body.push("The Combat ends in a Tie!");
            remaining = ["Good"];
        }
        if (remaining.includes("Only Individuals")) {
            outputCard.body.push("All Individuals must also take a Rout Move even if in Good Order");
        }
        if (remaining.includes("Routing")) {
            outputCard.body.push("Any Routing Elements are subject to Targetting Fire");
        }
        if (remaining.includes("Good")) {
            outputCard.body.push("The remaining Elements remain Locked in Combat");
        }
        if (CloseCombats.length > 0) {
            ButtonInfo("Next Close Combat","!RunCC");
        } else {
            ButtonInfo("Next Phase","!RunCC");
        }
        PrintCard();
    } else {
        NextPhase(true);
    }


}