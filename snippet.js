    if (action === "Fire" && errorMsg.length === 0) {
//mortars
        FireInfo = {};
        if (targetLOS.los === true) {
            if (element.individual === "Sniper") {
                if (CCCheck(target) === true) {
                    errorMsg.push(target.name + " is locked in Close Combat and may not be fired at");
                } else {
                    FireInfo = {
                        shooter: element,
                        targets: [target],
                        losResult: targetLOS,
                    }
                }
            } else {
                let targets = [target];
                //is target in a building ? If so, ALL in building added
                if (HexMap[target.hexLabel].terrain.includes("Building")) {
                    let terrainID = HexMap[target.hexLabel].terrainID;
                    let targets = [];
                    _.each(Elements,element => {
                        if (element.id !== target.id) {
                            let hex = HexMap[element.hexLabel];
                            if (hex.terrainID === terrainID) {
                                targets.push(element);
                            }
                        }
                    })
                } else {
                    if (target.leader === true) {
                        let follower = target.Followers()[0];
                        if (follower) {
                            targets.unshift(follower);
                        }
                    } else {
                        let leader = target.Leader();
                        if (leader) {
                            targets.push(leader);
                        }
                    }
                }
                let inCC = false;
                for (let i=0;i<targets.length;i++) {
                    if (CCCheck(targets[i]) === true) {
                        inCC = targets[i].name;
                        break;
                    } 
                }
                if (inCC === false) {
                    FireInfo = {
                        shooter: element,
                        targets: targets,
                        losResult: targetLOS,
                    }
                } else {
                    errorMsg.push(inCC + " is locked in Close Combat and may not be fired at");
                }
            } 
        } else {
            errorMsg.push("No LOS to Target");
        }
    }

