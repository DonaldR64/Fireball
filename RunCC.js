const RunCC = () => {
    let group = CloseCombats.shift();
    if (group) {
        let highestResult = [0,0];
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
            





        }







    } else {
        NextPhase(true);
    }


}