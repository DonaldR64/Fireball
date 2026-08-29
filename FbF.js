const Main = (() => {
    const version = '2026.8.28';
    if (!state.FbF) {state.FbF = {}};

    const pageInfo = {};
    let page2ID;
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI"];

    let HexSize, HexInfo, DIRECTIONS;
    let MapInfo = {};
    let Elements = {};
    let activeSectionID; //sectionID that just activated
    let activeElementID; //last element that activated

    let SurnameList = {
        Germany: ["Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Bauer","Richter","Klein","Wolf","Schroder","Neumann","Schwarz","Braun","Hofmann","Werner","Krause","Konig","Lang","Vogel","Frank","Beck"],
        Soviet: ["Ivanov","Smirnov","Petrov","Sidorov","Popov","Vassiliev","Sokolov","Novikov","Volkov","Alekseev","Lebedev","Pavlov","Kozlov","Orlov","Makarov","Nikitin","Zaitsev","Golubev","Tarasov","Ilyin","Gusev","Titov","Kuzmin","Kiselyov","Belov"],
        USA: ["Smith","Johnson","Williams","Brown","Jones","Wright","Miller","Davis","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Thompson","White","Harris","Clark","Lewis","Robinson","Walker","Young","Allen"],
        UK: ["Smith","Jones","Williams","Taylor","Davies","Brown","Wilson","Evans","Thomas","Johnson","Roberts","Walker","Wright","Robinson","Thompson","White","Hughes","Edwards","Green","Lewis","Wood","Harris","Martin","Jackson","Clarke"],
    }

    //math constants
    const M = {
        f0: Math.sqrt(3),
        f1: Math.sqrt(3)/2,
        f2: 0,
        f3: 3/2,
        b0: Math.sqrt(3)/3,
        b1: -1/3,
        b2: 0,
        b3: 2/3,
    }

    const DefineHexInfo = () => {
        HexSize = (70 * pageInfo.scale)/M.f0;
        if (pageInfo.type === "hex") {
            HexInfo = {
                size: HexSize,
                pixelStart: {
                    x: 35 * pageInfo.scale,
                    y: HexSize,
                },
                width: 70  * pageInfo.scale,
                height: pageInfo.scale*HexSize,
                xSpacing: 70 * pageInfo.scale,
                ySpacing: 3/2 * HexSize,
                directions: {
                    "Northeast": new Cube(1,-1,0),
                    "East": new Cube(1,0,-1),
                    "Southeast": new Cube(0,1,-1),
                    "Southwest": new Cube(-1,1,0),
                    "West": new Cube(-1,0,1),
                    "Northwest": new Cube(0,-1,1),
                },
                halfToggleX: 35 * pageInfo.scale,
                halfToggleY: 0,
            }
            DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];
        } else if (pageInfo.type === "hexr") {
            //Hex H or Flat Topped
            HexInfo = {
                size: HexSize,
                pixelStart: {
                    x: HexSize,
                    y: 35 * pageInfo.scale,
                },
                width: pageInfo.scale*HexSize,
                height: 70  * pageInfo.scale,
                xSpacing: 3/2 * HexSize,
                ySpacing: 70 * pageInfo.scale,
                directions: {
                    "North": new Cube(0, -1, 1),
                    "Northeast": new Cube(1, -1, 0),
                    "Southeast": new Cube(1,0,-1),
                    "South": new Cube(0,1,-1),
                    "Southwest": new Cube(-1,1,0),
                    "Northwest": new Cube(-1,0,1),
                },
                halfToggleX: 0,
                halfToggleY: 35 * pageInfo.scale,
            }
            DIRECTIONS = ["North","Northeast","Southeast","South","Southwest","Northwest"];
        }
    }

    const Axis = ["Germany","Italy","Japan"];
    const Allies = ["Soviet","USA","UK","Canada"];
    const CharacterCountries = ["Soviet ","US ", "German ","UK "];
    const Ranks = ["Other","Platoon Leader","Company Leader","Battalion Leader"];


    let outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};

    const Nations = {
        "Soviet": {
            "short": "Soviet",
            "image": "https://s3.amazonaws.com/files.d20.io/images/304547168/fMk9mH9WMsr8VSQFg6AZew/thumb.png?1663171370",
            "dice": "Soviet",
            "backgroundColour": "#FFFF00",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#FF0000",
            "borderStyle": "5px ridge",
            "elementmarkers": ["letters_and_numbers0099::4815235","letters_and_numbers0100::4815236","letters_and_numbers0101::4815237","letters_and_numbers0102::4815238","letters_and_numbers0103::4815239","letters_and_numbers0104::4815240","letters_and_numbers0105::4815241","letters_and_numbers0106::4815242","letters_and_numbers0107::4815243","letters_and_numbers0108::4815244"],       
        },
        "Germany": {
            "short": "German",
            "image": "https://s3.amazonaws.com/files.d20.io/images/329415788/ypEgv2eFi-BKX3YK6q_uOQ/thumb.png?1677173028",
            "dice": "Germany",
            "backgroundColour": "#000000",
            "titlefont": "Bokor",
            "fontColour": "#FFFFFF",
            "borderColour": "#000000",
            "borderStyle": "5px double",
            "elementmarkers": ["letters_and_numbers0197::4815333","letters_and_numbers0198::4815334","letters_and_numbers0199::4815335","letters_and_numbers0200::4815336","letters_and_numbers0201::4815337","letters_and_numbers0202::4815338","letters_and_numbers0203::4815339","letters_and_numbers0204::4815340","letters_and_numbers0205::4815341","letters_and_numbers0206::4815342"],   
            "Battalion Leader": "Major ",
            "Company Leader": "Hauptman ",
            "Platoon Leader": "Lt. ",
            "Forward Observer": "Lt. ",
            "Sniper": "Pvt. "
        },
        "UK": {
            "short": "UK",
            "image": "https://s3.amazonaws.com/files.d20.io/images/330506939/YtTgDTM3q7p8m0fJ4-E13A/thumb.png?1677713592",
            "backgroundColour": "#0E2A7A",
            "dice": "UK",
            "titlefont": "Merriweather",
            "fontColour": "#FFFFFF",
            "borderColour": "#BC2D2F",
            "borderStyle": "5px groove",
            "elementmarkers": ["letters_and_numbers0148::4815284","letters_and_numbers0149::4815285","letters_and_numbers0150::4815286","letters_and_numbers0151::4815287","letters_and_numbers0152::4815288","letters_and_numbers0153::4815289","letters_and_numbers0154::4815290","letters_and_numbers0155::4815291","letters_and_numbers0156::4815292","letters_and_numbers0157::4815293"],
        },
        "USA": {
            "short": "US",
            "image": "https://s3.amazonaws.com/files.d20.io/images/327595663/Nwyhbv22KB4_xvwYEbL3PQ/thumb.png?1676165491",
            "backgroundColour": "#FFFFFF",
            "dice": "USA",
            "titlefont": "Arial",
            "fontColour": "#006400",
            "borderColour": "#006400",
            "borderStyle": "5px double",
            "elementmarkers": ["letters_and_numbers0050::4815186","letters_and_numbers0051::4815187","letters_and_numbers0052::4815188","letters_and_numbers0053::4815189","letters_and_numbers0054::4815190","letters_and_numbers0055::4815191","letters_and_numbers0056::4815192","letters_and_numbers0057::4815193","letters_and_numbers0058::4815194","letters_and_numbers0059::4815195"],
            "Battalion Leader": "Lt.Col ",
            "Company Leader": "Captain ",
            "Platoon Leader": "Lt. ",
            "Forward Observer": "Lt. ",
            "Sniper": "Pvt. "

        },



        "Neutral": {
            "image": "",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
            "dice": "UK",
        },

    };

    //cover: 0 = none, 1 = soft, 2 = hard, 3 = bunker
    //move: 0 = open, 1 = broken, 2 = heavy going, 3 = impassable
    //losLevel: 0 = no effect, 1 = lightly obstructs, 2 = fully obstructs => light means 2 hexes, full means only the edge hex
    //height is X * 10 yards
    //hills will be 10/20/30 yards
    const TerrainInfo = {
        "Ploughed Field": {name: "Ploughed Field",height: 0,losLevel:0,cover: 0,move: 1},
        "Tall Crops": {name: "Tall Crops",move: 1, soft: false, cover: 1, coverNote: "None if Moving", losLevel: 1, height: 0.2},
        "Orchard": {name: "Orchard",move: 1, soft: false, cover: 1, losLevel: 1,height: 1},
        "Muddy Ground": {name: "Muddy Ground",move: 1, soft: true, cover: 0, losLevel: 0, height: 0},
        "Woods": {name: "Woods",move: 2, soft: false, cover: 1, losLevel: 2, height: 2},
        "Craters": {name: "Craters",move: 1, soft: false, cover: 1, losLevel: 0, height: 0},
        "Wood Building": {name: "Wood Building",move: 1, soft: false, cover: 1, losLevel: 2, height: 1},
        "Stone Building": {name: "Stone Building",move: 1, soft: false, cover: 2, losLevel: 2, height: 1},
    }
    
    const EdgeInfo = {
        "#5b0f00": {name: "Wall",type: "Minor", cover: 2, height: .2},        
        "#274e13": {name: "Hedge",type: "Minor", cover: 1, height: .2},   
        "#00ff00": {name: "Bocage",type: "Major", cover: 2, height: .5},  
    }

    //height is #
    const HillInfo = {
        "#000000": {name: "Hill 1"},
        "#666666": {name: "Hill 2"},
    }



    const SM = {

    }


    const Capit = (val) => {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const simpleObj = (o) => {
        let p = JSON.parse(JSON.stringify(o));
        return p;
    };

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };

    const tokenImage = (img) => {
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    };

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    };

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const pointInPolygon = (point,vertices) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const translatePoly = (poly) => {
        //translate points in a pathv2 polygon to map points
        let vertices = [];
        let points = JSON.parse(poly.get("points"));
        let centre = new Point(poly.get("x"), poly.get("y"));
        //covert path points from relative coords to actual map coords
        //define 'bounding box;
        let minX = Infinity,minY = Infinity, maxX = 0, maxY = 0;
        _.each(points,pt => {
            minX = Math.min(pt[0],minX);
            minY = Math.min(pt[1],minY);
            maxX = Math.max(pt[0],maxX);
            maxY = Math.max(pt[1],maxY);
        })
        //translate each point back based on centre of box
        let halfW = (maxX - minX)/2 + minX;
        let halfH = (maxY - minY)/2 + minY
        let zeroX = centre.x - halfW;
        let zeroY = centre.y - halfH;
        _.each(points,pt => {
            let x = Math.round(pt[0] + zeroX);
            let y = Math.round(pt[1] + zeroY);
            vertices.push(new Point(x,y));
        })
        return vertices;
    }

    //convert a token to an object with vertices (corners) with final being the first (used for token in token check)
    function tokenVertices(tok) {
      let corners = []
      let tokX = tok.get("left")
      let tokY = tok.get("top")
      let w = tok.get("width")
      let h = tok.get("height")
      let rot = tok.get("rotation") * (Math.PI/180)

      //define the four corners of the target token as new points
          //we will also rotate those corners appropirately around the target tok center
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY-h/2 )))     //Upper right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY+h/2 )))     //Lower right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY+h/2 )))     //Lower left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left

      return corners
    }


    function GetAbsoluteControlPt(controlArray, center, w, h, rot, scaleX, scaleY) {
        let len = controlArray.length;
        let point = new pt(controlArray[len-2], controlArray[len-1]);
        
        //translate relative x,y to actual x,y 
        point.x = scaleX*point.x + center.x - (scaleX * w/2);
        point.y = scaleY*point.y + center.y - (scaleY * h/2);
        
        point = RotatePoint(center.x, center.y, rot, point);
            
        return point;
    }

    function DegreesToRadians(degrees) {
        let pi = Math.PI;
        return degrees * (pi/180);
    }
    
    //cx, cy = coordinates of the center of rotation
    //angle = clockwise rotation angle
    //p = point object
    function RotatePoint(cX,cY,angle, p) {
        //cx, cy = coordinates of the center of rotation
        //angle = clockwise rotation angle
        //p = point object
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        
        // translate point back to origin:
        p.x -= cX;
        p.y -= cY;
        
        // rotate point
        let newX = p.x * c - p.y * s;
        let newY = p.x * s + p.y * c;
        
        // translate point back:
        p.x = Math.round(newX + cX);
        p.y = Math.round(newY + cY);
        return p;
    }


    const PolyHexes = (mapPoints) => {
        //which hexes are in the polygon
        let labels = [];
        _.each(HexMap,hex => {
            let check = pointInPolygon(hex.centre,mapPoints);
            if (check === true) {
                labels.push(hex.label);
            }
        })
        return labels;
    }


    //Retrieve Values from character Sheet Attributes
    const Attribute = (characterID,attributename,max = false) => {
        //Retrieve Values from character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj && max === false) {
            attributevalue = attributeobj.get('current');
        } else if (attributeobj && max === true) {
            attributevalue = attributeobj.get('max');
        }
        return attributevalue;
    };

    const AttributeID = (characterID,attributename) => {
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0];
        return attributeobj.get("id");
    }

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;
            let max = attributes[j].get("max")   
            if (!max || max === "") {max = " "} 
            aa[name + "_max"] = max;
        }
        return aa;
    };

    const AttributeSet = (characterID,attributename,newvalue,max = false) => {
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
        return;
    };

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        };
        toOffset() {
            let cube = this.toCube();
            let offset = cube.toOffset();
            return offset;
        };
        toCube() {
            let x = this.x - HexInfo.pixelStart.x;
            let y = this.y - HexInfo.pixelStart.y;
            let q,r;
            if (pageInfo.type === "hex") {
                q = (M.b0 * x + M.b1 * y) / HexInfo.size;
                r = (M.b3 * y) / HexInfo.size;
            } else if (pageInfo.type === "hexr") {
                q = (M.b3 * x) / HexInfo.size;
                r = (M.b1 * x + M.b0 * y) / HexInfo.size;
            }
            let cube = new Cube(q,r,-q-r).round();
            return cube;
        };
        distance(b) {
            return Math.sqrt(((this.x - b.x) * (this.x - b.x)) + ((this.y - b.y) * (this.y - b.y)));
        }
        label() {
            return this.toCube().label();
        }
    }

    class Offset {
        constructor(col,row) {
            this.col = col;
            this.row = row;
        }
        label() {
            let label = rowLabels[this.row] + (this.col + 1).toString();
            return label;
        }
        toCube() {
            let q,r;
            if (pageInfo.type === "hex") {
                q = this.col - (this.row - (this.row&1))/2;
                r = this.row;
            } else if (pageInfo.type === "hexr") {
                q = this.col;
                r = this.row - (this.col - (this.col&1))/2;
            }
            let cube = new Cube(q,r,-q-r);
            cube = cube.round(); 
            return cube;
        }
        toPoint() {
            let cube = this.toCube();
            let point = cube.toPoint();
            return point;
        }
    };

    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta >= 360) {
            theta -= 360;
        }
        return theta
    }   

    class Cube {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Cube(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        angle(b) {
            //angle between 2 cubes
            let origin = this.toPoint();
            let destination = b.toPoint();

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
        subtract(b) {
            return new Cube(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }

        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        lerp(b, t) {
            return new Cube(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b' incl. hex 'b'
            var N = this.distance(b);
            var a_nudge = new Cube(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Cube(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 1; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }

        linedraw2(b) {
            //returns array of hexes between this hex and hex 'b' incl. hex 'b', nudging other way from above 
            var N = this.distance(b);
            var a_nudge = new Cube(this.q - 1e-06, this.r - 1e-06, this.s + 2e-06);
            var b_nudge = new Cube(b.q - 1e-06, b.r - 1e-06, b.s + 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 1; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }



        label() {
            let offset = this.toOffset();
            let label = offset.label();
            return label;
        }

        spiralToCube(index) {
            if (index === 0) {
                return this;
            } else {
                let radius = (index === 0) ? 0:Math.floor((Math.sqrt(12 * index - 3) + 3) / 6);
                let startIndex = (radius === 0) ? 0: 1 + 3 * radius * (radius - 1);
                let ring = this.ring(radius);
                let pos = index - startIndex;
                return ring[pos];
            }
        }




        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Cube(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }

        ring(radius) {
            let results = [];
            let b = new Cube(-1 * radius,0,1 * radius);  //start at west 
            let cube = this.add(b);
            for (let i=0;i<6;i++) {
                //for each direction
                for (let j=0;j<radius;j++) {
                    results.push(cube);
                    cube = cube.neighbour(DIRECTIONS[i]);
                }
            }
            return results;
        }

        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Cube(qi, ri, si);
        }
        toPoint() {
            let x,y;
            if (pageInfo.type === "hex") {
                x = (M.f0 * this.q + M.f1 * this.r) * HexInfo.size;
                y = 3/2 * this.r * HexInfo.size;
            } else if (pageInfo.type === "hexr") {
                x = 3/2 * this.q * HexInfo.size;
                y = (M.f1 * this.q + M.f0 * this.r) * HexInfo.size;
            }
            x += HexInfo.pixelStart.x;
            y += HexInfo.pixelStart.y;
            let point = new Point(x,y);
            return point;
        }
        toOffset() {
            let col,row;
            if (pageInfo.type === "hex") {
                col = this.q + (this.r - (this.r&1))/2;
                row = this.r;
            } else if (pageInfo.type === "hexr") {
                col = this.q;
                row = this.r + (this.q - (this.q&1))/2;
            }
            let offset = new Offset(col,row);
            return offset;
        }
        whatDirection(b) {
            let delta = new Cube(b.q - this.q,b.r - this.r, b.s - this.s);
            let dir = "Unknown";
            let keys = Object.keys(HexInfo.directions);
            for (let i=0;i<6;i++) {
                let d = HexInfo.directions[keys[i]];
                if (d.q === delta.q && d.r === delta.r && d.s === delta.s) {
                    dir = keys[i];
                }
            }
            return dir
        }

     
    };

    class Hex {
        constructor(point) {
            this.centre = point;
            let offset = point.toOffset();
            this.offset = offset;
            this.terrain = "Open";
            this.tokenIDs = [];
            this.cube = offset.toCube();
            this.label = offset.label();
            this.elevation = 0;
            this.hill = false;
            this.terrainHeight = 0;
            this.move = 0;
            this.soft = false;
            this.cover = 0;
            this.coverNote = "";
            this.losLevel = 0;
            this.edges = {};
            _.each(DIRECTIONS,a => {
                this.edges[a] = "Open";
            });

            HexMap[this.label] = this;
        }

        distance(b) {
            let dist = this.cube.distance(b.cube);
            return dist;
        }




    }

    class Element {
        constructor(id) {
            let token = findObjs({_type:"graphic", id: id})[0];
            let cube = (new Point(token.get("left"),token.get("top"))).toCube();
            let label = cube.label();
            let charID = token.get("represents");
            let char = getObj("character", charID); 

            let aa = AttributeArray(charID);
  
            this.charName = char.get("name");
            let name = token.get("name");
            if (!name || name === "") {
                name = this.charName;
            }
            this.name = name;
            this.hexLabel = label;

            this.id = id;
            this.charID = charID;
            let nation = aa.nation || "Neutral";
            this.nation = nation;
            let player = (state.FbF.nations.indexOf(nation));
            if (player === -1) {
                if (nation === "Neutral") {
                    player = 2
                } else {
                    state.FbF.nations.push(nation);
                    player = state.FbF.nations.length - 1;
                }
            }
            this.player = player;
            this.token = token;
            this.type = aa.type;
            this.individual = aa.individual || " ";
            this.morale = parseInt(aa.morale);
            this.recon = aa.recon === "1" ? true:false;
            let leader = false;
            if (this.type === "Individual" && this.individual.includes("Leader")) {
                leader = true;
            }
            this.leader = leader;
            let rank = 0;
            if (this.leader === true) {
                rank = Ranks.indexOf(this.individual);
            }
            this.rank = rank;

            let weaponArray = [];


log(this.name)
log(this.type)
            this.sectionID = state.FbF.sectionIDs[id] || "None";
            let index = HexMap[label].tokenIDs.indexOf(id);
            if (index < 0) {
                HexMap[label].tokenIDs.push(id);
            }


            Elements[id] = this;    
    
        }

        Offmap() {
            let result = false;
            let pt = HexMap[this.hexLabel].centre;
            if (pt.x < MapInfo.top.x || pt.y < MapInfo.top.y || pt.x > MapInfo.bottom.x || pt.y > MapInfo.bottom.y) {
                result = true;
            }
            return result;
        }

        Facing(b) {

        }

        Morale(reason = "Morale",number = 1) {
            let target = this.morale;
            if (reason === "Rally" && this.recon === false && this.leader === false) {target = 6};
            let leader = this.Leader();
            if (leader) {
                target = leader.morale;
            }
            let status = this.Status();

            let rolls = [];
            let fail = 0;
            let pass = 0;
            for (let i=0;i<number;i++) {
                let roll = randomInteger(6);
                rolls.push(roll);
                if (roll < target || roll === 1) {
                    fail++;
                } else {pass++};
            }
            rolls.sort().reverse();
            let line = "";
            _.each(rolls,roll => {
                line += DisplayDice(roll,this.nation,24) + " ";
            })
            line += " vs. " + target + "+";
            outputCard.body.push(line);
            if (reason === "Rally") {
                if (fail > 0) {
                    outputCard.body.push(this.name + " fails to Rally");
                } else {
                    outputCard.body.push(this.name + " Rallies");
                    this.SetStatus("Good");
                }
            } else if (reason === "Morale") {
                if (fail === 0) {
                    if (status === "Good") {
                        outputCard.body.push(this.name + " is Suppressed");
                        this.SetStatus("Suppressed");
                    } else if (status === "Suppressed") {
                        outputCard.body.push(this.name + " remains Suppressed");
                    } else if (status === "Broken") {
                        outputCard.body.push(this.name + " remains Broken and may make a Rout Move");
                    }
                } else if (fail === 1) {
                    if (status === "Good" || status === "Suppressed") {
                        outputCard.body.push(this.name + " is now Broken and may make a Rout Move");
                        this.SetStatus("Broken");
                    } else if (status === "Broken") {
                        outputCard.body.push(this.name + " is Eliminated");
                        this.SetStatus("Routed");
                    }
                } else if (fail > 1) {
                    outputCard.body.push(this.name + " is Eliminated");
                    this.SetStatus("Routed");
                }
            }

        }

        Status() {
            let status = "Unknown"
            let tint = this.token.get("tint_color");
            if (tint === "transparent" || tint === "#000000") {
                status = "Good";
            }
            if (tint === "#ffff00") {
                status = "Suppressed";
            }
            if (tint === "#ff0000") {
                status = "Broken";
            }
            return status;
        }

        SetStatus(status) {
            if (status === "Good") {
                let tc = this.token.get("tint_color");
                if (tc === "#ffff00" || tc === "#ff0000") {
                    tc = "transparent";
                }
                this.token.set({
                    tint_color: tc,
                    aura1_color: "#00ff00",
                })            
            } else if (status === "Broken") {
                this.token.set({
                    tint_color: "#ff0000",
                    aura1_color: "#ff0000",
                })  
            } else if (status === "Suppressed") {
                this.token.set({
                    tint_color: "#ffff00",
                    aura1_color: "#ffff00",
                })  
            } else if (status === "Routed") {
//destroy


            } else if (status === "Activated") {
                this.token.set({
                    aura1_color: "#000000",
                })
            } else if (status === "Active") {
                this.token.set({
                    aura1_color: "#ffffff",
                })
            }



        }




        Leader() {
            //returns highest adjacent leader with rank > this
            //if platoon leader only if is in same section/sectionID
            let leader;
            let leaderRank=0;
            _.each(Elements,element => {
log(element.name)
log("Leader: " + element.leader)
log("Rank: " + element.rank)
                if (element.nation === this.nation && element.leader === true && element.id !== this.id && element.rank > this.rank) {
                    if (element.rank > 1 || (element.rank === 1 && element.sectionID === this.sectionID)) {
                        let d = element.Distance(this);
                        if (d < 2) {
                            if (leaderRank < element.rank) {
                                leader = element;
                                leaderRank = element.rank;
                            }
                        }
                    }
                }
            })
            return leader;
        }


       

        Distance(b) {
            return HexMap[this.hexLabel].distance(HexMap[b.hexLabel]);
        }



    }


    summonToken = function(cID,point,size,rotation = 0,layer = "map",pID = pageInfo.page.get('id')) {
        let character = getObj("character", cID);
        if (!character) {
            sendChat("","No Character")
            return
        }
        let newToken;
        character.get('defaulttoken',function(defaulttoken){
            const dt = JSON.parse(defaulttoken);
            let img = dt.imgsrc || "";
            img = tokenImage(img);
            if(dt && img){
                dt.imgsrc=img;
                dt.left=point.x;
                dt.top=point.y;
                dt.rotation = rotation;
                dt.pageid = pID;
                dt.layer = layer;
                dt.width = size.w;
                dt.height = size.h;
                newToken = createObj("graphic", dt);
            } else {
                sendChat('','/w gm Cannot create token for <b>'+character.get('name')+'</b>');
            }
        });
        return newToken;
    }

    const AddAbility = (abilityName,action,characterID) => {
        let newObj = createObj("ability", {
            name: abilityName,
            characterid: characterID,
            action: action,
            istokenaction: true,
        })
        if (newObj) {return newObj.id};
    }    

    const AddAbilities = (element) => {
        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: element.charID});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 

        if (element.type !== "Initiative Token" && element.type !== "Marker") {
            AddAbility("Info","!TokenInfo",element.charID);
            AddAbility("LOS","!CheckLOS;@{selected|token_id};@{target|token_id}",element.charID);
            AddAbility("Activate Unit","!Activate;@{selected|token_id}",element.charID);
            AddAbility("Rally","!Rally",element.charID);
        } else if (element.type === "Initiative Token") {
            AddAbility("Restore Ammo to Unit","!RestoreAmmo;@{target|token_id};Intiative",element.charID);
            AddAbility("Free Activation for Unit","!Activate;@{target|token_id};Initiative",element.charID);
        }
        let coreTypes = ["Infantry Squad","Infantry Team","Weapons Team","Crewed Weapon","Vehicle","Soft Vehicle"];
        if (coreTypes.includes(element.type)) {
            //fire
        }
        if (element.type === "Weapons Team" || element.type === "Vehicle" || element.type === "Soft Vehicle") {
            //reload ammo
            AddAbility("Reload/Fix Jam","!RestoreAmmo;@{selected|token_id}",element.charID);
        }









    }

    const RestoreAmmo = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let refElement = Elements[id];
        let initiative = (Tag[2] === "Initiative") ? true:false;
        SetupCard("Reload/Unjam","",refElement.nation);
        if (initiative === false) {
            if (refElement.rallied === true || refElement.moved === true || refElement.fired === true) {
                outputCard.body.push("Element has done other Actions");
                PrintCard();
                return;
            }
            if (randomInteger(6) > 4) {
                outputCard.body.push("Success!");
                outputCard.body.push(refElement.name + " has reloaded/fixed the weapon jam");
                refElement.token.set(SM.ammo,false);
            } else {
                outputCard.body.push("[#ff0000]Failure![/#]");
                outputCard.body.push(refElement.name + " remains Out of Ammo or Jammed"); 
            }
            outputCard.body.push("[hr]");
            outputCard.body.push(refElement.name + "'s Activation is done");
        } else {
            let sectionID = refElement.sectionID;
            let elementIDs = state.FbF.elements[sectionID];
            let sectionName = refElement.name;
            _.each(elementIDs,elementID => {
                let element = Elements[elementID];
                if (element && element.token) {
                    if (element.type === "Individual" && element.individual.includes("Leader")) {
                        sectionName = element.name;
                    }
                    element.token.set(SM.ammo,false);
                }
            })
            outputCard.body.push("All elements in " + sectionName + "'s Unit reload and fix any weapon jams");
        }
        PrintCard();
    }




    const InlineButtons = (array) => {
        let output = "";
        for (let i=0;i<array.length;i++) {
            let info = array[i];
            let inline = true;
            if (i>0 && inline === false) {
                output += '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">';
            }
            let out = "";
            let borderColour = Nations[outputCard.side].borderColour;
            if (inline === false || i===0) {
                out += `<div style="display: table-row; background: #FFFFFF;; ">`;
                out += `<div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
            }
            if (inline === true) {
                out += '<span>     </span>';
            }
            out += `<a style ="background-color: ` + Nations[outputCard.side].backgroundColour + `; padding: 5px;`
            out += `color: ` + Nations[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
            out += `border-color: ` + borderColour + `; font-family: Tahoma; font-size: x-small; `;
            out += `"href = "` + info.action + `">` + info.phrase + `</a>`
            
            if (inline === false || i === (array.length - 1)) {
                out += `</div></span></div></div>`;
            }
            output += out;
        }
        return output;
    }

    const ButtonInfo = (phrase,action,inline = false) => {
        //inline - has to be true in any buttons to have them in same line -  starting one to ending one
        let info = {
            phrase: phrase,
            action: action,
            inline: inline,
        }
        outputCard.buttons.push(info);
    };

    const SetupCard = (title,subtitle,side) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.side = side;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    };

    const DisplayDice = (roll,nation,size) => {
        roll = roll.toString();
        tablename = (!Nations[nation]) ? "Neutral":Nations[nation].dice
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];   
        if (!obj) {return "NA"}
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };

    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.side || !Nations[outputCard.side]) {
            outputCard.side = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Nations[outputCard.side].borderStyle + " " + Nations[outputCard.side].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: center; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Nations[outputCard.side].backgroundColour + `; `;
        output += `background-image: url(` + Nations[outputCard.side].image + `), url(` + Nations[outputCard.side].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: center,center; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: center;"><span style="`;
        output += `font-family: ` + Nations[outputCard.side].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Nations[outputCard.side].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Nations[outputCard.side].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Nations[outputCard.side].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Nations[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Nations[outputCard.side].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack,fontcolour;
                if (line.includes("[F]")) {
                    let ind1 = line.indexOf("[F]") + 3;
                    let ind2 = line.indexOf("[/f]");
                    let fac = line.substring(ind1,ind2);
                    if (Nations[fac]) {
                        lineBack = Nations[fac].backgroundColour;
                        fontcolour = Nations[fac].fontColour;
                    }
                    line = line.replace("[F]" + fac + "[/f]","");

                } else {
                    lineBack = (i % 2 === 0) ? "#D3D3D3": "#EEEEEE";
                    fontcolour = "#000000";
                }
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color:` + fontcolour + `; `;
                out += `"> <div style='text-align: center; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let info = outputCard.buttons[i];
                let inline = info.inline;
                if (i>0 && inline === false) {
                    output += '<hr style="width:95%; align:center; margin:0px 0px 5px 5px; border-top:2px solid $1;">';
                }
                let out = "";
                let borderColour = Nations[outputCard.side].borderColour;
                
                if (inline === false || i===0) {
                    out += `<div style="display: table-row; background: #FFFFFF;; ">`;
                    out += `<div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                    out += `"><span style="line-height: normal; color: #000000; `;
                    out += `"> <div style='text-align: center; display:block;'>`;
                }
                if (inline === true) {
                    out += '<span>     </span>';
                }
                out += `<a style ="background-color: ` + Nations[outputCard.side].backgroundColour + `; padding: 5px;`
                out += `color: ` + Nations[outputCard.side].fontColour + `; text-align: center; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a>`
                
                if (inline === false || i === (outputCard.buttons.length - 1)) {
                    out += `</div></span></div></div>`;
                }
                output += out;
            }

        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",side: "",body: [],buttons: [],};
    }

    //related to building hex map
    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;
        pageInfo.type = pageInfo.page.get("grid_type");
        let page2 = findObjs({_type: "page"}).filter((e) => e.get("name").includes("Copy of " + pageInfo.name))[0];
        if (page2) {
            page2ID = page2.id;
        }
        log("Page2 ID: " + page2ID)
    }

    const BuildMap = () => {
        let startTime = Date.now();
        HexMap = {};

        let startX = HexInfo.pixelStart.x;
        let startY = HexInfo.pixelStart.y;
        let halfToggleX = HexInfo.halfToggleX;
        let halfToggleY = HexInfo.halfToggleY;
        if (pageInfo.type === "hex") {
            for (let j = startY; j <= pageInfo.height;j+=HexInfo.ySpacing){
                for (let i = startX;i<= pageInfo.width;i+=HexInfo.xSpacing) {
                    let point = new Point(i,j);     
                    let hex = new Hex(point);
                }
                startX += halfToggleX;
                halfToggleX = -halfToggleX;
            }
        } else if (pageInfo.type === "hexr") {
            for (let i=startX;i<=pageInfo.width;i+=HexInfo.xSpacing) {
                for (let j=startY;j<=pageInfo.height;j+=HexInfo.ySpacing) {
                    let point = new Point(i,j);     
                    let hex = new Hex(point);
                }
                startY += halfToggleY;
                halfToggleY = -halfToggleY;
            }
        }
        AddTerrain();    
        AddTokens();
        DefineMap();
        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
    };

    const DefineMap = () => {
        let map = findObjs({_type: "graphic",_subtype: "token",layer: "map"}).filter((e) => e.get("name").includes("Map"))[0];
        let w = map.get("width")/2;
        let h = map.get("height")/2;
        let x = map.get("left");
        let y = map.get("top");
        MapInfo.top = new Point(x-w,y-h);
        MapInfo.bottom = new Point(x+w,y+h);
        MapInfo.centre = new Point(x,y);
    }
     
    const AddTokens = () => {
        Elements = {};
        //create an array of all tokens on both maps
        let start = Date.now();
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        let tokens2 = [];
        if (page2ID) {
            tokens2 = findObjs({
                _pageid: page2ID,
                _type: "graphic",
                _subtype: "token",
                layer: "objects",
            });
            //skip twinned tokens
            let twinKeys = Object.keys(state.Twins.twins) || [];
            let twinValues = Object.values[state.Twins.twins] || [];
            for (let i=0;i<tokens2.length;i++) {
                let token = tokens2[i];
                if (twinKeys.includes(token.id) || twinValues.includes(token.id)) {
                    continue;
                }
                tokens.push(token);
            }
        }

        let c = tokens.length + tokens2.length;
        let s = (c===1) ? '':'s';    
        
        tokens.forEach((token) => {
            let character = getObj("character", token.get("represents"));   
            if (character) {
                let element = new Element(token.get("id"));
            }
        });

        let elapsed = Date.now()-start;
        log(`${c} token${s} checked in ${elapsed/1000} seconds - ` + Object.keys(Elements).length + " placed in Element Array");

    }


    const AddTerrain = () => {
        let start = Date.now();
        //hills defined by lines, hedges and walls same
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "pathv2",layer: "map",});
        _.each(paths,path => {
            let colour = path.get("stroke").toLowerCase();
            let hill = HillInfo[colour];
            if (hill) {
                let height = parseInt(hill.name.replace(/[^\d]/g,""));
                let vertices = translatePoly(path);
                let labels = PolyHexes(vertices);
                _.each(labels,label => {
                    HexMap[label].elevation = Math.max(HexMap[label].elevation,height);
                    HexMap[label].hill = true;
                })
            }
            let edge = EdgeInfo[path.get("stroke").toLowerCase()];
            if (edge) {
                let vertices = translatePoly(path);
                //work through pairs of vertices
                for (let i=0;i<(vertices.length -1);i++) {
                    let pt1 = vertices[i];
                    let pt2 = vertices[i+1];
                    let midPt = new Point((pt1.x + pt2.x)/2,(pt1.y + pt2.y)/2);
                    //find nearest hex to midPt
                    let hexLabel = midPt.label();
                    //now run through that hexes neighbours and see what intersects with original line to identify the 2 neighbouring hexes
                    let hex1 = HexMap[hexLabel];
                    if (!hex1) {continue}
                    let pt3 = hex1.centre;
                    let neighbourCubes = hex1.cube.neighbours();
                    for (let j=0;j<neighbourCubes.length;j++) {
                        let k = j+3;
                        if (k> 5) {k-=6};
                        let hl2 = neighbourCubes[j].label();
                        let hex2 = HexMap[hl2];
                        if (!hex2) {continue}
                        let pt4 = hex2.centre;
                        let intersect = lineLine(pt1,pt2,pt3,pt4);
                        if (intersect) {
                            hex1.edges[DIRECTIONS[j]] = path.get("stroke").toLowerCase();
                            hex2.edges[DIRECTIONS[k]] = path.get("stroke").toLowerCase();
                        }
                    }
                }
            }
        });
        //Add Token Terrain, Building might be multihex
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        _.each(tokens,token => {
            let name = token.get("name") || " ";
            if (name.includes("Map")) {
                return;
            }
            name = name.split("//")[0].trim();
            let terrain = TerrainInfo[name];
            if (terrain) {
                let labels = [];
                if (token.get("width") > 250 || token.get("height") > 210) {
                    let vertices = tokenVertices(token);
                    labels = PolyHexes(vertices);
                } else {
                    let centre = new Point(token.get("left"),token.get('top'));
                    labels = [centre.toCube().label()];
                }
                _.each(labels,label => {
                    let hex = HexMap[label];
                    if (hex) {
                        if (hex.terrain === "Open") {
                            hex.terrain = terrain.name;
                        }
                        hex.terrainHeight = terrain.height;
                        hex.losLevel = terrain.losLevel;
                        hex.cover = terrain.cover;
                        hex.move = terrain.move;
                        hex.coverNote = terrain.coverNote || "";
                        hex.soft = terrain.soft;
                    }
                })
            }    
        });
        







        let elapsed = Date.now()-start;
        log(`Terrain added in ${elapsed/1000} seconds`);

    }





    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };





    const RemoveLines2 = () => {
            RemoveLines()
    }


    const RemoveLines = (which = ["LOS","Deploy"]) => {
        _.each(which,lines => {
            let array;
            if (lines === "LOS") {
                array = state.FbF.losLines;
            }
            if (lines === "Deploy") {
                array = state.FbF.deployLines;
            }
            if (array) {
                for (let i=0;i<array.length;i++) {
                    let id = array[i];
                    let path = findObjs({_type: "pathv2", id: id})[0];
                    if (path) {
                        path.remove();
                    }
                }
                array = [];
            }
        })
    }


    const DrawLine = (set,colour = "#ff0000",type = "Deploy") => {
        let a = set[0],b = set[1];
        //define centre, then a and b change into points
        let left = Math.min(a[0],b[0]);
        let bottom = Math.min(a[1],b[1]);
        let x = Math.abs(a[0] - b[0])/2 + left;
        let y = Math.abs(a[1] - b[1])/2 + bottom;
        let points = [];
        points.push([a[0] - left,a[1] - bottom]);
        points.push([b[0] - left,b[1] - bottom]);
        points = JSON.stringify(points);

        let layer = (type === "LOS") ? "map":"map";

        let page = getObj('page',Campaign().get('playerpageid'));
        if(page) {
            let line = createObj('pathv2',{
                layer: layer,
                pageid: page.id,
                shape: "pol",
                stroke: colour,
                stroke_width: 7,
                x: x,
                y: y,
                points: points,
            });
            if (line) {
                toFront(line);
                if (type === "LOS") {
                    state.FbF.losLines.push(line.get("id"))
                } else {
                    state.FbF.deployLines.push(line.get("id"));
                }
            }
        }
    }

    const Lookup = (id) => {
        if (Elements[id]) {
            return id;
        } else {
            let keys = Object.keys(state.Twins.twins);
            if (keys.includes(id)) {
                return state.Twins.twins[id];
            }
            let id2 = keys.find((key) => state.Twins.twins[key] === id);
            return id2;
        }
    }



    const TokenInfo = (msg) => {
        let id = Lookup(msg.selected[0]._id);
        let element = Elements[id];
        if (!element) {
            sendChat("","Not in Elements");
            return;
        };
        let label = element.hexLabel;
        let hex = HexMap[label];
        SetupCard(element.name,"Info",element.nation);
        let status = element.Status();
        outputCard.body.push("Status: " + status);

        outputCard.body.push("[hr]");
        outputCard.body.push("Hex Label: " + label);
        if (element.Offmap()) {
            outputCard.body.push("Element is Off Map");
        }
        outputCard.body.push("Elevation: " + (hex.elevation * 30) + " feet");
        outputCard.body.push("Terrain: " + hex.terrain);
        outputCard.body.push("Terrain Height: " + (hex.terrainHeight * 30) + " feet");
        _.each(DIRECTIONS,a => {
            if (hex.edges[a] !== "Open") {
                outputCard.body.push(a + " Edge: " + EdgeInfo[hex.edges[a]].name);
            }
        })

        PrintCard();
    }

    const RollDice = (msg) => {
        PlaySound("Dice");
        let roll = randomInteger(6);
        let playerID = msg.playerid;
        let id,element,player;
        if (msg.selected) {
            id = Lookup(msg.selected[0]._id);
        }
        let nation = "Neutral";

        if (!id && !playerID) {
            return;
        }
        if (id) {
            element = Elements[id];
            if (element) {
                nation = element.nation;
                player = element.player;
            }
        }
        if ((!id || !element) && playerID) {
            nation = state.FbF.players[playerID];
            player = (state.FbF.nations[0] === nation) ? 0:1;
        }

        if (!state.FbF.players[playerID] || state.FbF.players[playerID] === undefined) {
            if (nation !== "Neutral") {    
                state.FbF.players[playerID] = nation;
            } else {
                sendChat("","Click on one of your tokens then select Roll again");
                return;
            }
        } 
        let res = "/direct " + DisplayDice(roll,nation,40);
        sendChat("player|" + playerID,res);
    }

    const UnitNumbers = () => {
        _.each(state.FbF.markers, marker => {
            let el = Elements[marker.id];
            let hex = HexMap[marker.startLoc];
            el.token.set({
                left: hex.centre.x,
                top: hex.centre.y,
            })
            el.hexLabel = hex.label;
        })
    }





    const ClearState = (msg) => {
        let Tag = msg.content.split(";");
        LoadPage();

        RemoveDead();
        BuildMap();

        //clear arrays
        Elements = {};
        SectionArray = {};

        state.FbF = {
            players: {},
            nations: [],
            turn: 0,
            currentPlayer: 2,
            unitNumbers: [],
            unitsLeftToActivate: [0,0],
            deck: [26,26],
            losLines: [],
            markers: [],           
            sectionIDs: {}, //ref by elementID - shows the sectionID
            sectionMarkers: {}, //ref by sectionID - shows the marker
            elements: {}, //ref by sectionID, shows all elementIDs in the section
        }
        sendChat("","Cleared State/Arrays");
    }


    const RemoveDead = () => {
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        if (page2ID) {
            let tokens2 = findObjs({_pageid: page2ID,_type: "graphic",_subtype: "token",layer: "map",});
            tokens = tokens.concat(tokens2);
        }
        _.each(tokens,token => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
        })
    }





    //line line collision where line1 is pt1 and 2, line2 is pt 3 and 4
    const lineLine = (pt1,pt2,pt3,pt4) => {
        //calculate the direction of the lines
        uA = ( ((pt4.x-pt3.x)*(pt1.y-pt3.y)) - ((pt4.y-pt3.y)*(pt1.x-pt3.x)) ) / ( ((pt4.y-pt3.y)*(pt2.x-pt1.x)) - ((pt4.x-pt3.x)*(pt2.y-pt1.y)) );
        uB = ( ((pt2.x-pt1.x)*(pt1.y-pt3.y)) - ((pt2.y-pt1.y)*(pt1.x-pt3.x)) ) / ( ((pt4.y-pt3.y)*(pt2.x-pt1.x)) - ((pt4.x-pt3.x)*(pt2.y-pt1.y)) );
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            intersection = {
                x: (pt1.x + (uA * (pt2.x-pt1.x))),
                y: (pt1.y + (uA * (pt2.y-pt1.y)))
            }
            return intersection;
        }
        return;
    }

    const NextTurn = () => {
        let turn = state.FbF.turn;
        if (turn === 0) {
            //start of game stuff

        }
        UnitNumbers();
        turn++;
        state.FbF.currentPlayer = 2;
        state.FbF.turn = turn;
        state.FbF.unitsLeftToActivate = DeepCopy(state.FbF.unitNumbers);
        SetupCard("Turn " + turn,"","Neutral");
        _.each(Elements,element => {
            if (element.Status() !== "Broken") {
                element.SetStatus("Good");
            }
        })


//start of turn stuff
        PrintCard();
        NextPhase();
    }

    const NextPhase = () => {
        if (state.FbF.unitsLeftToActivate[0] === 0 && state.FbF.unitsLeftToActivate[1] === 0) {
            NextTurn();
        } else {
//set the previous sections auras to black to indicate they've activated
            let currentPlayer = state.FbF.currentPlayer;
            let deck = state.FbF.deck;
            if (currentPlayer === 2) {
                //1st phase of turn
                let card = randomInteger(52);
                currentPlayer = (card < 27) ? 0:1;
            } else {
                currentPlayer = (currentPlayer === 0) ? 1:0;
            }
            state.FbF.currentPlayer = currentPlayer;
            deck[currentPlayer]--;
            let pulled = 1;
            let nextCard;
            do {
                let roll = randomInteger(deck[0] + deck[1]);
                if (currentPlayer === 0 && roll <= deck[0]) {
                    pulled++;
                    deck[0]--;
                    nextCard = true;
                } else if (currentPlayer === 1 && roll > deck[0]) {
                    pulled++;
                    deck[1]--;
                    nextCard = true;
                } else {
                    nextCard = false;
                }
            } while (nextCard === true);
            let nation = state.FbF.nations[currentPlayer];
            let otherPlayer = (currentPlayer === 0) ? 1:0;
            let unitsLeftToActivate = state.FbF.unitsLeftToActivate[currentPlayer];
            pulled = Math.min(pulled,unitsLeftToActivate);
            let pulledDisplay = pulled;
            let otherSide = state.FbF.unitsLeftToActivate[otherPlayer];
            if (otherSide === 0) {pulled = unitsLeftToActivate};
            if (pulled === unitsLeftToActivate) {
                pulledDisplay = "All Unactivated";
                if (pulled === 1) {
                    pulledDisplay === "Its Remaining";
                }
            }
            state.FbF.deck = deck;
            state.FbF.unitsLeftToActivate[currentPlayer] = (unitsLeftToActivate - pulled);
            let s = (pulled > 1 || pulledDisplay === "All Unactivated") ? "s":"";


            SetupCard(Nations[nation].short + " Phase","",nation);
            let line = "";
            for (let i=0;i<pulled;i++) {
                line += DisplayDice(6,nation,24);
                if (i>0) {line += " "};
            }
            outputCard.body.push(line);
            outputCard.body.push(Nations[nation].short + " Player may activate " + pulledDisplay + " Unit" + s);
            if (pulledDisplay === "All Unactivated" && otherSide === 0) {
                outputCard.body.push("This will end the current Turn");
            }
            PrintCard();
        }
    }

    const Activate = (msg) => {
        let Tag = msg.content.split(";");
        let id = Tag[1];
        let initiative = Tag[2] === "Initiative" ? true:false;
        let refElement = Elements[id];
        if (!refElement) {
            sendChat("","Not in Array");
            return;
        }
        if (refElement.sectionID === activeSectionID) {
            sendChat("","Is Currently Activated");
            return;
        }
        if (refElement.token.get("aura1_color") === "#000000" && initiative === false) {
            sendChat("","Unit has already Activated this turn");
            sendChat("","An Initiative Chip could be used");
            return;
        }




        let elementIDs = state.FbF.elements[activeSectionID];
        _.each(elementIDs,elementID => {
            let element = Elements[elementID];
            if (element && element.token) {
                element.token.set("aura1_color","#000000");
            }
            element.moved = false;
            element.fired = false;
            element.rallied = false;
        })




        let sectionID = refElement.sectionID;
        elementIDs = state.FbF.elements[sectionID];
        let sectionName = refElement.name;
        _.each(elementIDs,elementID => {
            let element = Elements[elementID];
            if (element && element.token) {
                if (element.type === "Individual" && element.individual.includes("Leader")) {
                    sectionName = element.name;
                }
                let status = element.Status();
                let aura = "#ffffff";
                let tint = (element.token.get("tint_color") === "#000000") ? "#000000":"transparent";
                if (status === "Broken") {
                    aura = "#ff0000";
                    tint = "#ff0000";
                }
                element.token.set({
                    tint_color: tint,
                    aura1_color: aura,
                })
            }
        })

        activeSectionID = sectionID;
        SetupCard("Activation","",refElement.nation);
        outputCard.body.push(sectionName + "'s Unit is activated")
        if (initiative === true) {
            outputCard.body.push("An Initiative Token was Used");
        }
        PrintCard();
    }






    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooter = Elements[Lookup(Tag[1])];
        let target = Elements[Lookup(Tag[2])];

        if (!shooter) {
            sendChat("","Not valid shooter");
            return;
        }
        if (!target) {
            sendChat("","Not valid target");
            return;
        }
        if (shooter.id == target.id) {
            sendChat("","Selected Same Token");
            return;
        }
        SetupCard(shooter.name,"Line of Sight",shooter.nation);

        let losResult = LOS(shooter,target);
        outputCard.body.push("Distance: " + losResult.distance * 30 + " feet");
        outputCard.body.push("[hr]");
        if (losResult.los === false) {
            outputCard.body.push("No LOS due to " + losResult.losReason + " at " + losResult.blockedHexLabel);
        } else {
            coverLevel = [" No "," Soft "," Hard "," Bunker "];
            outputCard.body.push("Target has" + coverLevel[losResult.cover] + "Cover");
        }

        PrintCard();
    }





    const LOS = (shooter,target) => {
        let blockers = [];
        let shooterHex = HexMap[shooter.hexLabel];
        let targetHex = HexMap[target.hexLabel];
        let distance = shooter.Distance(target);
      
        let shooterHeight = shooterHex.elevation;
        let targetHeight = targetHex.elevation;

        let pt1 = new Point(0,shooterHeight);
        let pt2 = new Point(distance,targetHeight);
        let pt3,pt4,line1;

        let finalLOS = true;
        let interCoverFinal = 0;
        let finalBlockedHexLabel;
        let finalLOSReason = "";
 
        let interCubes = [shooterHex.cube.linedraw(targetHex.cube),shooterHex.cube.linedraw2(targetHex.cube)];
        let labels = [interCubes[0].map((e)=> e.label()), interCubes[1].map((e)=> e.label())];

        let len = labels[0].length;
        let los = [true,true];
        let interCover = [0,0];
        let losReason = ["",""];
        let blockedHexLabels = ["",""]

        for (let side=0;side<2;side++) {
            let losLevel = 0;
            let minorObs = 0;
            for (let i=0;i<len;i++) {
                let interHex = HexMap[labels[side][i]];
                //Hills
                if (interHex.hill === true) {
                    if (interHex.elevation > shooterHeight && interHex.elevation > targetHeight) {
                        los[side] = false;
                        losReason[side] = "Hill";
                        blockedHexLabels[side] = interHex.label;
                        break;
                    }
                }
                //Intervening Units
                if (interHex.tokenIDs.length > 0 && interHex.label !== targetHex.label) {
                    let element2 = Elements[interHex.tokenIDs[0]];
                    if (element2 && blockers.includes(element2.type)) {
                        let h = .3
                        pt3 = new Point(i+1,0);
                        pt4 = new Point(i+1,(interHex.elevation + h));
                        line1 = lineLine(pt1,pt2,pt3,pt4); //intersection
                        if (line1) {
                            los[side] = false;
                            losReason[side] = element2.name;
                            blockedHexLabels[side] = interHex.label;
                            break;
                        }
                    }
                }
                //Blocking Terrain or Cover Terrain
                pt3 = new Point(i+1,0);
                pt4 = new Point(i+1,(interHex.elevation + interHex.terrainHeight));
                line1 = lineLine(pt1,pt2,pt3,pt4); //intersection
                if (line1) {
                    losLevel += interHex.losLevel;
                    if (losLevel > 1 && interHex.label !== targetHex.label) {
                        los[side] = false;
                        losReason[side] = "Terrain";
                        blockedHexLabels[side] = interHex.label;
                        break;
                    }
                    interCover[side] = Math.max(interCover[side],interHex.cover);
                }
                //edges
                if (i > 1) {
                    let dir = HexMap[labels[side][i-1]].cube.whatDirection(interHex.cube)
                    let edge = HexMap[labels[side][i-1]].edges[dir];
                    if (edge !== "Open") {
                        let obstacle = EdgeInfo[edge];
                        if (obstacle.type === "Minor") {
                            minorObs++;
                            if (minorObs > 3) {
                                los[side] = false;
                                losReason[side] = obstacle.name;
                                blockedHexLabels[side] = interHex.label;
                                break;
                            }
                            interCover[side] = Math.max(interCover[side],obstacle.cover);
                        } else if (obstacle.type === "Major") {
                            los[side] = false;
                            losReason[side] = obstacle.name;
                            blockedHexLabels[side] = interHex.label;
                            break;
                        }
                    }
                }



            }
        }

        if (los[0] === false && los[1] === false) {
            finalLOS = false;
            finalLOSReason = losReason[0];
            finalBlockedHexLabel = blockedHexLabels[0];
            if (losReason[0] !== losReason[1]) {
                finalLOSReason += " / " + losReason[1];
                finalBlockedHexLabel += " / " + blockedHexLabel[1];
            }
            finalLOSReason = "Blocked by " + finalLOSReason;
        }

        if (shooter.Offmap() === true) {
            finalLOS = false;
            finalLOSReason = "Shooter is Offmap";
        }
        if (target.Offmap() === true) {
            finalLOS = false;
            finalLOSReason = "Target is Offmap";
        }

        if (los[0] === true && los[1] === true) {
            interCoverFinal = Math.min(interCover[0],interCover[1]);
        } else if (los[0] === false) {
            interCoverFinal = interCover[1];
        } else if (los[1] === false) {
            interCoverFinal = interCover[0];
        }


        let result = {
            los: finalLOS,
            losReason: finalLOSReason,
            blockedHexLabel: finalBlockedHexLabel,
            distance: distance,
            cover: interCoverFinal,
            //shooterArcs: shooter.Arcs(target),
            //targetArcs: target.Arcs(shooter),
        }

        return result;
    }


    const ErrorMsg = (msgs) => {
        if (msgs.length === 0) {return false};
        _.each(msgs,msg => {
            outputCard.body.push(msg);
        })
        return true;
    }


    const AdjacentTokens = () => {

        const visited = [];
        const groups = [];
        const keys = Object.keys(Elements);
log("Keys")
log(keys)

        // 1. Helper to find neighbours
        const getneighbours = (current) => {
            let neighbours = [];
            for (let i=0;i<keys.length;i++) {
                let key = keys[i];
                if (key === current) {continue};
                let d = Elements[key].Distance(Elements[current]);
                if (d < 2) {
                    neighbours.push(key);
                }
            }
            return neighbours;
        };

        // 2. Traverse the map to find connected clusters
        for (const key of keys) {
            if (visited.includes(key)) continue;
            const group = [];
            const queue = [key];
            visited.push(key);

            while (queue.length > 0) {
                const current = queue.shift();
                group.push(current);
                for (const neighbour of getneighbours(current)) {
                    if (visited.includes(neighbour) === false) {
                        visited.push(neighbour);
                        queue.push(neighbour);
                    }
                }
            }

            groups.push(group);
        }

        return groups; //will be groups of keys / ids
    }



    const SetArmies = () => {
        Elements = {};
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        if (page2ID) {
            let tokens2 = findObjs({
                _pageid: page2ID,
                _type: "graphic",
                _subtype: "token",
                layer: "objects",
            });
            //skip twinned tokens
            let twinKeys = Object.keys(state.Twins.twins) || [];
            let twinValues = Object.values[state.Twins.twins] || [];
            for (let i=0;i<tokens2.length;i++) {
                let token = tokens2[i];
                if (twinKeys.includes(token.id) || twinValues.includes(token.id)) {
                    continue;
                }
                tokens.push(token);
            }
        }
        let sectionMarkers = [0,0];
        let Surnames = DeepCopy(SurnameList);
        let unitNumbers = [0,0];

        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];
            let character = getObj("character", token.get("represents"));   
            if (!character) {continue};
            let element = new Element(token.get("id"));
        }

        let groups = AdjacentTokens();

        for (let i=0;i<groups.length;i++) {
            let group = groups[i];
            let sectionID = stringGen();
            let elementMarker = "None";
            let refElement = Elements[group[0]];

            if (refElement.player < 2 && refElement.type !== "Initiative Token" && refElement.type !== "Marker") {
                elementMarker = Nations[refElement.nation].elementmarkers[sectionMarkers[refElement.player]];
                state.FbF.sectionMarkers[sectionID] = elementMarker;
                unitNumbers[refElement.player]++;
            };

            let elementIDs = [];
            for (let j=0;j<group.length;j++) {
                let element = Elements[group[j]];
                elementIDs.push(element.id);
                let name = element.charName.split(",")[0].trim();
                if (element.type === "Individual") {
                    name = Nations[element.nation][element.individual];
                    let index = randomInteger(Surnames[element.nation].length) - 1;
                    let surname = Surnames[element.nation].splice(index,1);
                    name += " " + surname;
                }
                let a1c = (element.type === "Marker" || element.type === "Initiative Token") ? "":"#00ff00";
                let tint = (element.type === "Marker" || element.type === "Initiative Token") ? "transparent":"#000000";


                element.token.set({
                    name: name,
                    aura1_color: a1c,
                    aura1_radius: 5,
                    aura2_color: "transparent",
                    showplayers_aura1: true,
                    tooltip: "",
                    show_tooltip: true,
                    showplayers_tooltip: true,
                    showplayers_name: true,
                    statusmarkers: "",
                    tint_color: tint,
                    disableSnapping: false,
                    disableTokenMenu: true,
                })
                element.name = name;
                element.sectionID = sectionID;
                if (elementMarker !== "None") {
                    element.token.set("status_" + elementMarker,true);
                }


                state.FbF.sectionIDs[element.id] = sectionID;
                AddAbilities(element);

                if (element.type === "Marker") {
                    let info = {
                        id: element.id,
                        startLoc: element.hexLabel,
                    }
                    state.FbF.markers.push(info);
                    DuplicateElement(element);
                }
            }
            if (elementMarker !== "None") {
                sectionMarkers[refElement.player]++;
            }
            state.FbF.elements[sectionID] = elementIDs;
        }

        sendChat("","Armies Added")
        state.FbF.unitNumbers = unitNumbers;


    }




    const TwinTest = (msg) => {
        let element = Elements[msg.selected[0]._id];
        if (!element) {return};
        DuplicateElement(element);
        element.maps = [0,1];
    }



    const DuplicateElement = (element) => {
        let token1 = element.token;
        //create token2
        let token2 = summonToken(element.charID,HexMap[element.hexLabel].centre,{w: element.token.get("width"),h: element.token.get("height")},element.token.get("rotation"),"objects",page2ID);

        let props = [
            'left', 'top', 'width', 'height', 'rotation', 'layer', 'isdrawing',
            'flipv', 'fliph', 'bar1_value', 'bar1_max', 'bar1_link',
            'bar2_value', 'bar2_max', 'bar2_link', 'bar3_value', 'bar3_max',
            'bar3_link', 'aura1_radius', 'aura1_color', 'aura1_square',
            'aura2_radius', 'aura2_color', 'aura2_square', 'tint_color',
            'statusmarkers', 'showplayers_name', 'showplayers_bar1',
            'showplayers_bar2', 'showplayers_bar3', 'showplayers_aura1',
            'showplayers_aura2', 'playersedit_name', 'playersedit_bar1',
            'playersedit_bar2', 'playersedit_bar3', 'playersedit_aura1',
            'playersedit_aura2', 'light_radius', 'light_dimradius',
            'light_otherplayers', 'light_hassight', 'light_angle',
            'light_losangle', 'lastmove'
        ];

        if (token2) {
            token2.set(_.reduce(props,function(m,p){
                    m[p]=token1.get(p);
                    return m;
            },{}));
        }

        sendChat("","!twins " + element.id + " " + token2.id);


    }

    const Rally = (msg) => {
        let element = Elements[msg.selected[0]._id];
        SetupCard(element.name,"Rally",element.nation);
        if (element.rallied === true) {
            outputCard.body.push("Element already Rallied");
            PrintCard();
            return;
        }
        if (element.leader === true && element.Status() === "Good") {            
            //leader in good order can rally all adjacent units in command structure
            if (element.rank === 1) {
                _.each(state.FbF.elements[element.sectionID],id2 => {
                    let element2 = Elements[id2];
                    if (element2.id !== element.id && element2.Status() === "Broken") {
                        let d = element2.Distance(element);
                        if (d < 2) {
                            outputCard.body.push("[U]" + element2.name + "[/u]")
                            element2.Morale("Rally");
                            outputCard.body.push("[hr]");
                        }
                    }
                })
            } else {
                //co or bat leaders
                _.each(Elements,element2 => {
                    if (element2.nation === element.nation && element2.id !== element.id && element2.Status() === "Broken") {
                        let d = element2.Distance(element);
                        if (d < 2) {
                            outputCard.body.push("[U]" + element2.name + "[/u]")
                            element2.Morale("Rally");
                            outputCard.body.push("[hr]");
                        }
                    }
                })
            }
        } else {
            SetupCard(element.name,"Rally",element.nation);
            element.Morale("Rally");
        }
        element.rallied = true;
        LastElement(element);
        PrintCard();
    }



    const LastElement = (element) => {
        if (element.sectionID === activeSectionID && state.FbF.turn > 0) {
            let lastElement = Elements[activeElementID];
            if (lastElement && lastElement !== activeElementID) {
                lastElement.SetStatus("Activated");
            }
            activeElementID = element.id;
        }
    }









    const changeGraphic = (tok,prev) => {
        let element = Elements[tok.id];
        let newLabel = new Point(tok.get("left"),tok.get("top")).toCube().label();
        let prevLabel = new Point(prev.left,prev.top).toCube().label();
        if (element && newLabel !== prevLabel) {
            log(element.name + " moving")
            let index = HexMap[prevLabel].tokenIDs.indexOf(tok.id);
            if (index > -1) {
                HexMap[prevLabel].tokenIDs.splice(index,1);
                HexMap[newLabel].tokenIDs.push(tok.id);
            }
            element.hexLabel = newLabel;
            LastElement(element);
            element.moved = true;
        } 
        if (element && tok.get("rotation") !== prev.rotation) {
            log(element.name + " turning")
            let phi = Angle(tok.get("rotation"));
            phi = Math.round(phi/30) * 30;
            tok.set("rotation",phi);
        }
    }
    
    const destroyGraphic = (obj) => {
        let id = obj.get("id");
        if (id) {
            let element = Elements[id];
            if (element) {
                log(element.name + " removed from Element Array")
                let index = HexMap[element.hexLabel].tokenIDs.indexOf(id);
                if (index > -1) {
                    HexMap[element.hexLabel].tokenIDs.splice(index,1);
                }
                delete Elements[id];
            }
        }
    }






    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
        RemoveLines(["LOS"]);
        switch(args[0]) {
            case '!Dump':
                log(HexMap)
                log("State");
                log(state.FbF);
                log("Element");
                log(Elements)
                break;
            case '!ClearState':
                ClearState(msg);
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!CheckLOS':
                CheckLOS(msg);
                break;
            case '!Roll':
                RollDice(msg);
                break;
            case '!SetArmies':
                SetArmies(msg);
                break;
            case '!TwinTest':
                TwinTest(msg);
                break;
            case '!NextPhase':
                NextPhase();
                break;
            case '!Activate':
                Activate(msg);
                break;
            case '!Rally':
                Rally(msg);
                break;
            

        }
    };

   



    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        //on("add:graphic", addGraphic);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===> Fireball Forward <===");
        log("===> Software Version: " + version + " <===")
        LoadPage();
        DefineHexInfo();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready at " + new Date().toLocaleTimeString("en-US", {timeZone: "America/Toronto"}) + " EST");
        log("On Ready Done")
    });
    return {
        // Public interface here
    };






})();


