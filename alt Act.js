
        ResolveFire(startStatus) {
            //let rfp = this.token.get("bar3_value").split("/").map(e => parseInt(e));
            let rfp = this.token.get(SM.RFP);
            if (rfp === true) {
                rfp = 1
            } else {
                rfp = parseInt(rfp);
            }

            let cover = this.token.get("bar1_value") === "Cover" ? true:false;
            let finalStatus = this.Status();

/////here


            let noun1 = startStatus === "Suppressed" ? "Suppressed":"No Cover";
            let noun2 = startStatus === "Suppressed" ? "Suppressed":"Cover";
            let qualityReroll = false;

            if (this.type === "Vehicle") {
                rfp[1] += rfp[0];
                rfp[0] = 0;
                noun2 = "Vehicle";
                qualityReroll = true; //doesnt get
            }
            let rolls = [];
            let tip = "";

//change below to only one routine, and vary based on
//cover, no cover, suppressed state at beggining
//pass back results as finalStatus and a tip that displays fire rolls etc



            for (let i=0;i<rfp[0];i++) {
                let roll = randomInteger(6);
                rolls.push(roll);
                if (this.quality === "Elite" && qualityReroll === false && roll === 1) {
                    roll = randomInteger(6);
                    rolls[rolls.length - 1] = roll + "r";
                    qualityReroll = true;
                    tip += "<br>Elite Reroll";
                }
                if (this.quality === "Poor" && qualityReroll === false && roll === 6) {
                    roll = randomInteger(6);
                    rolls[rolls.length - 1] = roll + "r";
                    qualityReroll = true;
                    tip += "<br>Poor Reroll";
                }
                if (startStatus === "Suppressed") {
                    if (roll < 2) {finalStatus = "Killed"};
                    if ((roll === 2 || roll === 3) && finalStatus !== "Killed") {finalStatus = "Suppressed"};
                } else {
                    if (roll < 3) {finalStatus = "Killed"};
                    if (roll === 3 && finalStatus !== "Killed") {finalStatus = "Suppressed"};
                }
            }
            if (rolls.length > 0) {
                rolls.sort().reverse();
                tip = "Rolls: " + rolls.toString() + tip;
                if (startStatus === "Suppressed") {
                    tip += "<br>Suppressed<br>Killed on 1<br>Otherwise Suppressed";
                } else {
                    tip += "<br>Killed on 1 or 2<br>Suppressed on 3";
                }
                let res = '[' + finalStatus + '](#" class="showtip" title="' + tip + ')';  
            }
            rolls = [];

            let reroll = false;
            tip = "";
            for (let i=0;i<rfp[1];i++) {
                let roll = randomInteger(6);
                rolls.push(roll);
                if (this.quality === "Elite" && qualityReroll === false && roll === 1) {
                    roll = randomInteger(6);
                    rolls[rolls.length - 1] = roll + "r";
                    qualityReroll = true;
                    tip += "<br>Elite Reroll";
                }
                if (this.quality === "Poor" && qualityReroll === false && roll === 6) {
                    roll = randomInteger(6);
                    rolls[rolls.length - 1] = roll + "r";
                    qualityReroll = true;
                    tip += "<br>Poor Reroll";
                }
                if (startStatus === "Suppressed" && this.type !== "Vehicle" && roll === 1 && reroll === false) {
                    roll = randomInteger(6);
                    rolls[roll.length - 1] = roll + "r";
                    reroll = true;
                    tip += "<br>Suppressed in Cover Reroll"
                } 
                if (roll < 2) {finalStatus = "Killed"};
                if ((roll === 2 || roll === 3) && finalStatus !== "Killed") {finalStatus = "Suppressed"};
            }
            if (rolls.length > 0) {
                rolls.sort();rolls.reverse();
                tip = "Rolls: " + rolls.toString() + tip + "<br>Killed on 1<br>Suppressed on 2 or 3";
                let res = '[' + finalStatus + '](#" class="showtip" title="' + tip + ')';  
                outputCard.body.push("Fire (" + noun2 + "): " + res);
            }

            this.SetStatus(finalStatus);
            this.token.set(SM.RFP,false);


            let result = {
                finalStatus: "",
                tip: "",
            }



            return result;
        }
