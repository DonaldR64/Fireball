NewLeader() {
    //place a leader token on spot, name it etc
    let cID = Nations[this.nation]["PL Character ID"]
    let token = summonToken(cID,HexMap[this.hexLabel].centre,{w: 70,h: 70},0,"objects");
    if (token) {
        outputCard.body.push("[hr]");
        let leader = new Team(token.id);
        leader.Name("Sgt");
        let platoonInfo = state.HoF.platoonInfo[this.platoonID];
        platoonInfo.leader === true;
        let teamIDs = platoonInfo.teamIDs;
        let index = teamIDs.indexOf(platoonInfo.leaderID);
        teamIDs.splice(index,1);
        teamIDs.push(leader.id);
        platoonInfo.leaderID = leader.id;                    
        platoonInfo.teamIDs = teamIDs;
        state.HoF.platoonInfo[this.platoonID] = platoonInfo;
        state.HoF.platoonIDs[leader.id] = actTeam.platoonID;
        leader.token.set({
            aura1_color: "#ffffff",
            aura1_radius: 5,
            aura2_color: "transparent",
            showplayers_aura1: true,
            showplayers_name: true,
            bar3_value: "0/0",
            statusmarkers: "",
            tint_color: "transparent",
            disableSnapping: false,
            disableTokenMenu: false,
        })
        leader.platoonID = this.platoonID;
        leader.token.set("status_" + platoonInfo.marker,true);
        return leader;
    }
}