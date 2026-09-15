
    const Fire = (msg) => {
        let Tag = msg.content.split(";");
        let team1 = Teams[Tag[1]];
        let teams = [team1];
        let target = Teams[Tag[2]];
        let type = Tag[3];
        let indirect = type === "Indirect" ? true:false;

        let shooterName = team1.name;
        if (team1.squadMate) {
            let team2 = Teams[team1.squadMate];
            if (team2) {
                teams.push(team2);
            }
            shooterName = shooter1.name.split(",")[0];
        }

        SetupCard(shooterName,"Direct Fire",shooter1.nation);
        let shooterMsgs = [];
        let shooters = [];

        for (let i=0;i<teams.length;i++) {
            let shooter = teams[i];
            let losResult = LOS(shooter,target);
            if (losResult.los === false) {
                shooterMsgs.push(shooter.name + " has no LOS");
                continue;
            };
            if (shooter.Act() !== "Active") {
                shooterMsgs.push(shooter.name + " is not Active");
                continue;
            }
            if (shooter.Status() === "Suppressed") {
                shooterMsgs.push(shooter.name + " is Suppressed");
                continue;
            }
            let nonWeapons = [];
            let weapons = [];
            for (let i=0;i<shooter.weaponArray.length;i++) {
                let weapon = shooter.weaponArray[i];
                if (losResult.distance < weapon.range[0]) {
                    nonWeapons.push(weapon.name + " - less than Minimum Range");
                    continue;
                }
                if (losResult.distance > (weapon.range[1] * 2)) {
                    nonWeapons.push(weapon.name + " - beyond twice Eff Range");
                    continue;
                }
                if (losResult.forwardArc === false && ((shooter.type === "Vehicle" && weapon.notes.includes("Hull")) || shooter.type === "Gun")){
                    nonWeapons.push(weapon.name + " - target is not in Forward Arc");
                    continue;
                }
            }
            if (weapons.length === 0) {
                shooterMsgs.concat(nonWeapons);
                continue;
            }
            let info = {
                team: shooter,
                weapons: weapons,
            }
            shooters.push(info);
        }

        if (shooters.length === 0) {
            ErrorMsg(shooterMsgs);
            PrintCard();
            return;
        }

        //all shooters fire, add up hits
        let hits = []; //an array of weapon hits, keeps ability to apply at etc in next part

        for (let i=0;i<shooters.length;i++) {
            let shooter = shooters[i].team;
            let weapons = shooters[i].weapons;
            if (shooters.length > 1) {
                outputCard.body.push("[U]" + shooter.name + "[/u]");
            }
            _.each(weapons,weapon => {
                let wtip = "";
                let wrolls = [];
                let target = 4;
                let whits = 0;
                if (target.type !== "Vehicle") {
                    if (weapon.at !== "-") {
                        wtip += "<br>HE Round";
                    } else if (losResult.conceal || losResult.interConceal) {
                        wtip += "<br>Concealment +1";
                        target++;                
                    }
                }
                if (losResult.distance > weapon.range[1]) {
                    wtip  += "<br>Long Range +1";
                    target++;
                }
                for (let i=0;i<weapon.rof;i++) {
                    let roll = randomInteger(6);
                    wrolls.push(roll);
                    if (roll >= target) {
                        hits.push(weapon)
                        whits++;
                    }
                }
                wrolls.sort().reverse().toString();
                let tip = "Rolls: " + wrolls + " vs. " + target + "+" + wtip;
                let s = (whits === 1) ? "":"s";
                if (whits > 0) {
                    tip = '[' + whits + '](#" class="showtip" title="' + tip + ')';   
                } else {
                    tip = '[No](#" class="showtip" title="' + tip + ')';   
                }
                outputCard.body.push(weapon.name + ": " + tip + " Hit" + s);
            })
            




        }

        outputCard.body.push("[hr]");
/*
        //build array of possible targets
        let targets = [target];
        let keys = Object.keys(Teams);
        for (let i=0;i<keys.length;i++) {
            let team2 = Teams[keys[i]];
            if (team2.id === target.id || team2.nation !== target.nation) {
                continue;
            }
            let dist = target.distance(team2);
            if (dist > 4) {continue};




        }




        //distribute hits

*/












        PrintCard();
    }


