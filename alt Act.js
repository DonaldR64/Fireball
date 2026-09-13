const Activate = (msg) => {
    let id;
    if (msg.selected) {
        id = msg.selected[0]._id;
    }
    let Tag = msg.content.split(";");
    let playerID = msg.playerid;
    let platoonAct = Tag[1] === "Platoon" ? true:false;
    let heroPointUsed = Tag[2] === "Yes" ? true:false;
    let actTeam = Teams[id];
    let availableHP = state.HoF.heroPoints[actTeam.player];
    let availableOP = state.HoF.orderPoints[actTeam.player];
    let errorMsgs = [];
    let actTeamAct = actTeam.Act();

    //check if any of the prev. active teams are out of LOS and therefore can rally
    //and make any shown as active inactive
    let lastUnitFlag = false;
    _.each(Teams,team2 => {
        if (team2.Act() === "Active") {
            team2.SetAct("Activated");
            if (team2.Status() === "Suppressed") {
                let status = team2.Rally("EndAct");
                if (status === "Ready") {
                    if (lastUnitFlag === false) {
                        SetupCard("Last Activation","",team2.nation);
                        lastUnitFlag = true;
                    }
                    outputCard.body.push(team2.name + " Rallied")
                }
            }
        }
    })
    if (lastUnitFlag) {PrintCard()};

    if (actTeam.player !== state.HoF.currentPlayer && heroPointUsed === false) {
        errorMsgs.push("Activating during other Player's turn requires a Hero Point to be used");
    }
    if (actTeamAct === "Activated" && heroPointUsed === false && actTeam.player === state.HoF.currentPlayer) {
        errorMsgs.push(groupAct + " has already Activated; a Hero Point must be Used");
    }
    if (heroPointUsed && availableHP === 0) {
        errorMsgs.push("No Hero Points Available");
    }
    if (actTeamAct === "Unactivated" && availableOP === 0 && heroPointUsed === false) {
        errorMsgs.push("No Order Points Remain, a Hero Point must be used");
    }
    if (heroPointUsed && actTeam.token.get(Nations[actTeam.nation].flag)) {
        errorMsgs.push("This " + groupAct + " has already used a Hero Point this turn");
    }
    if (actTeamAct === "Active") {
        errorMsgs.push("This Team is already Activated");
    }

    if (errorMsgs.length > 0) {
        SetupCard(actTeam.name,"Activate",actTeam.nation);
        ErrorMsg(errorMsgs)
        PrintCard();
        return;
    }

    let platoonInfo = state.HoF.platoonInfo[actTeam.platoonID];

    SetupCard(platoonInfo.name,"Activate",actTeam.nation);

    //check re Vehicle if can act as a leader
    if (platoonInfo.vehiclePlatoon === true) {
        let functioning = 0;
        _.each(platoonInfo.teamIDs,teamID => {
            let t2 = Teams[teamID];
            if (t2 && t2.Status() !== "Suppressed") {
                functioning++;
            }
        })
        let percent = Math.round(functioning/platoonInfo.teamIDs.length * 100);
        if (percent < 50) {
            state.HoF.platoonInfo[actTeam.platoonID].leader = false;
            platoonAct = "Team";
            if (functioning > 1) {
                outputCard.body.push("Due to Casualties/Suppression, only this Team will be Activated");
            }
        }
    }

    //check if missing a PL, will be a single team activating initially if yes
    //need a flag to prevent doing RR twice
    let actTeamResolved = false;
    if (platoonInfo.vehiclePlatoon === false && platoonInfo.leader === "Killed") {
        let line = actTeam.RR();
        actTeamResolved = true;
        let actStatus = actTeam.Status();
        if (actStatus !== "Killed") {
            let trainingCheck = actTeam.Check(0)
            if (trainingCheck.result === true) {
                actTeam.SetStatus("Ready");
                let leader = actTeam.NewLeader();
                if (!leader) {
                    outputCard.body.push("Leader Should have been Created");
                } else {
                    platoonAct = "Platoon";
                    outputCard.body.push("[hr]");
                    outputCard.body.push(leader.name + " has assumed Leadership of the Platoo n, rallying this Team");
                    outputCard.body.push("He immediately activates this Team and any others in LOS");
                    outputCard.body.push("[hr]");
                }
            } else if (line) {
                outputCard.body.push(line);
                outputCard.body.push("[hr]");
            }
        }
    }

    let actTeams = [actTeam];
    if (platoonAct === "Platoon") {
        //activate entire platoon in LOS from team
        let ids = platoonInfo.teamIDs;
        _.each(ids,id2 => {
            let team2 = Teams[id2];
            if (team2) {
                let los = LOS(actTeam,team2);
                if (los.los === true) {
                    if (heroPointUsed && team2.token.get(Nations[team2.nation].flag) === false) {
                        team2.SetAct("Active");
                        team2.command = false;
                        team2.token.set(SM.directed, false);
                        team2.token.set(SM.moveup,false);
                        team2.token.set(Nations[team.nation].flag,true);
                        actTeams.push(team2)
                    } else if (team2.Act() === "Unactivated") {
                        team2.SetAct("Active");
                        team2.command = false;
                        team2.token.set(SM.directed, false);
                        team2.token.set(SM.moveup,false);
                        actTeams.push(team2)
                    }
                }
            }
        })
    }
    actTeams = [...new Set(actTeams)];

    //run through each team, doing rally, RFP resolution on each
    let fireOutput = [];
    let leaderKilled = false;
    let singleTeamKilled = false;
    for (let i=0;i<actTeams.length;i++) {
        let team = actTeams[i];
        if (team.id === actTeam.id && actTeamResolved) {continue};//already done
        let line = team.RR();
        if (line) {fireOutput.push(line)};
        let teamStatus = team.Status();
        if (teamStatus === "Killed") {
            if (actTeams.length === 1) {
                singleTeamKilled = true;
            } else if (team.id === platoonInfo.leaderID) {
                leaderKilled = true;
            }
        }
    }
    if (fireOutput.length > 0) {
        _.each(fireOutput,line => {
            outputCard.body.push(line);
        })
        outputCard.body.push("[hr]");
    }

    if (leaderKilled === true) {
        outputCard.body.push("Any Teams in LOS are Activated, but only one Team can Move/Fire");
        outputCard.body.push("[hr]");
    }

    if (singleTeamKilled === false) {
        //info on movement
        //MovementInfo(platoonInfo);
    }

    if (heroPointUsed === false) {
        availableOP--;
        state.HoF.orderPoints[actTeam.player] = availableOP;
        outputCard.body.push("[hr]");
        outputCard.body.push("Remaining Order Points: " + availableOP);
    }
    PrintCard();

    if (heroPointUsed) {
        availableHP--;
        state.HoF.heroPoints[actTeam.player] = availableHP;
        SetupCard("Hero Points","",actTeam.nation);
        outputCard.body.push("Remaining: " + availableHP);
        PrintCard(playerID);
    }










}