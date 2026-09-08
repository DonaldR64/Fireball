const Main = (() => {
    const version = '2026.8.28';
    if (!state.HoF) {state.HoF = {}};

    const pageInfo = {};
    let page2ID;
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI"];

    let HexSize, HexInfo, DIRECTIONS;
    let MapInfo = {};
    let Teams = {};

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
            "platoonmarkers": ["letters_and_numbers0099::4815235","letters_and_numbers0100::4815236","letters_and_numbers0101::4815237","letters_and_numbers0102::4815238","letters_and_numbers0103::4815239","letters_and_numbers0104::4815240","letters_and_numbers0105::4815241","letters_and_numbers0106::4815242","letters_and_numbers0107::4815243","letters_and_numbers0108::4815244"],       
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
            "platoonmarkers": ["letters_and_numbers0197::4815333","letters_and_numbers0198::4815334","letters_and_numbers0199::4815335","letters_and_numbers0200::4815336","letters_and_numbers0201::4815337","letters_and_numbers0202::4815338","letters_and_numbers0203::4815339","letters_and_numbers0204::4815340","letters_and_numbers0205::4815341","letters_and_numbers0206::4815342"],   
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
            "platoonmarkers": ["letters_and_numbers0148::4815284","letters_and_numbers0149::4815285","letters_and_numbers0150::4815286","letters_and_numbers0151::4815287","letters_and_numbers0152::4815288","letters_and_numbers0153::4815289","letters_and_numbers0154::4815290","letters_and_numbers0155::4815291","letters_and_numbers0156::4815292","letters_and_numbers0157::4815293"],
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
            "platoonmarkers": ["letters_and_numbers0050::4815186","letters_and_numbers0051::4815187","letters_and_numbers0052::4815188","letters_and_numbers0053::4815189","letters_and_numbers0054::4815190","letters_and_numbers0055::4815191","letters_and_numbers0056::4815192","letters_and_numbers0057::4815193","letters_and_numbers0058::4815194","letters_and_numbers0059::4815195"],
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



    //terrain that is single object
    //blockLOS - 
    //cover is 1 - soft, 2 - hard, blockLOS - # of hexes past that can be seen, height - stories
    const TerrainInfo = {
        "Trench": {cover: 2, conceal: true, blockLOS: false, height: 0,interCover: 0},
        "Building 1 Storey": {cover: 2, conceal: true, blockLOS: "Past", height: 1},
        "Building 2 Storey": {cover: 2, conceal: true, blockLOS: "Past", height: 2},
        "Orchard": {cover: 1, conceal: "Infantry", blockLOS: false, height: 2, interCover: 1},
        "Woods": {cover: 1, conceal: true, blockLOS: "Past", height: 3},
        "Fields": {cover: "Soft Cover for Stationary Infantry", conceal: "Infantry", blockLOS: false, height: 0, interCover: 0},
        "Gun Pit": {cover: 2, conceal: false, blockLOS: "Past", height: .5},
        "Sniper's Nest": {cover: 2, conceal: true, blockLOS: false, height: 0},
    }

    const EdgeInfo = {
        "Bocage": {cover: "Hard Cover for Infantry/Crewed Weapons, Soft Cover for Vehicles", conceal: true, blockLOS: "1 Hex", height: 2},
        "Hedge": {cover: "Soft Cover for Infantry against Hedge", conceal: "Infantry & Crewed Weapons", blockLOS: false, height: 0},
        "Wall": {cover: 'Hard Cover for Teams against Wall', conceal: "Infantry & Crewed Weapons", blockLOS: false, height: 0},
    }


    //height is #, corresponds to 1 story per #
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

    const polyLine = (vertices,pt1,pt2) => {
        //polygon / line collisions where typically pt1 is shooter and pt2 is target
        let len = (vertices.length - 1);
        let crossings = [];
        //go through each vertices, plus the next to create a line for checking intersection
        for (v=0;v<len;v++) {
            let pt3 = vertices[v];
            let pt4 = vertices[v+1];
            let point = lineLine(pt1,pt2,pt3,pt4);
            if (point) {
                crossings.push(point);
            }
        }
        return crossings;
    }



    function tokenMidPoints(tok) {
        //sends back mid points of longer axis of a token
        let corners = tokenVertices(tok);
        let line = [];
        if (tok.get("height") >= tok.get("width")) {
            line.push(new Point((corners[0].x + corners[1].x)/2,(corners[0].y + corners[1].y)/2));
            line.push(new Point((corners[2].x + corners[3].x)/2,(corners[2].y + corners[3].y)/2))
        } else {
            line.push(new Point((corners[1].x + corners[2].x)/2,(corners[1].y + corners[2].y)/2));
            line.push(new Point((corners[3].x + corners[4].x)/2,(corners[3].y + corners[4].y)/2))
        }
        return line;
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
            this.terrainHeight = 0;
            this.cover = 0;
            this.interCover = 0;
            this.blockLOS = false;
            this.concealment = false;
            this.edges = {};
            this.terrainID = "";
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

    class Team {
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
            let player = (state.HoF.nations.indexOf(nation));
            if (player === -1) {
                if (nation === "Neutral") {
                    player = 2
                } else {
                    state.HoF.nations.push(nation);
                    player = state.HoF.nations.length - 1;
                }
            }
            this.player = player;
            this.token = token;
            this.type = aa.type;
            this.quality = aa.quality;

            let weaponArray = [];
            for (let w=1;w<3;w++) {
                let pre = "weapon" + w;
                let wequipped = aa[pre + "equipped"];
                if (wequipped !== "Equipped") {continue};
                let wname = aa[pre + "name"];
                let wrange = aa[pre + "range"];
                weff = weff.split("-").map(e => parseInt(e));
                if (weff.length === 1) {
                    weff.unshift(0);
                }
                let wrof = parseInt(aa[pre + "rof"]);
                let wat = parseInt(aa[pre + "at"]) || "-";
                let wnotes = aa[pre + "notes"] || " ";
                let weapon = {
                    name: wname,
                    range: wrange, //an array of min/max
                    rof: wrof, //an array of dice
                    at: wat,
                    notes: wnotes,
                }
                weaponArray.push(weapon);
            }
log(weaponArray)




            this.weaponArray = weaponArray;


            this.unitID = state.HoF.unitIDs[id] || "None";
            let index = HexMap[label].tokenIDs.indexOf(id);
            if (index < 0) {
                HexMap[label].tokenIDs.push(id);
            }


            Teams[id] = this;    
    
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

        Morale(reason,number = 1,maxFail = number) {
            if (this.notes.includes("Leader Tag Along")) {
                //auto pass
                outputCard.body.push(this.name +" can Charge into contact, ending its Turn");
                this.notes.splice(this.notes.indexOf("Leader Tag Along"),1);
                return;
            }
            let target = this.morale;
            if (reason === "Rally" && this.recon === false && this.leader === false) {target = 6};
            let leader = this.Leader();
log(leader)
            let codicil = "";
            if (leader && leader.morale < target) {
                target = leader.morale;
                codicil = " [Leader]";
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
            fail = Math.min(maxFail,fail);

            rolls.sort().reverse();
            let line = this.name + ": ";
            _.each(rolls,roll => {
                line += DisplayDice(roll,this.nation,24) + " ";
            })
            line += " vs. " + target + "+" + codicil;
            outputCard.body.push(line);
            if (reason === "Rally") {
                if (fail > 0) {
                    outputCard.body.push(this.name + " fails to Rally");
                } else {
                    outputCard.body.push(this.name + " Rallies");
                    this.SetStatus("Good");
                }
            } else if (reason === "Firing" || reason === "CC") {
                if (fail === 0) {
                    if (status === "Good") {
                        if (reason === "Firing") {
                            if (this.unitID === activeUnitID || this.leader === true) {
                                outputCard.body.push(this.name + " remains in Good Order");
                            } else {
                                outputCard.body.push(this.name + " is Suppressed");
                                this.SetStatus("Suppressed");
                            }
                        } else if (reason === "CC") {
                            if (this.type === "Individual") {
                                outputCard.body.push(this.name + " stays alive and is in Good Order");
                            } else {
                                outputCard.body.push(this.name + " remains in Good Order");
                            }
                        }
                    } else if (status === "Suppressed") {
                        if (reason === "Firing") {
                            outputCard.body.push(this.name + " remains Suppressed");
                        } else if (reason === "CC") {
                            if (this.type === "Individual") {
                                outputCard.body.push(this.name + " stays alive and is in Good Order");
                            } else {
                                outputCard.body.push(this.name + " remains in Good Order");
                            }
                            this.SetStatus("Good");
                        }
                    } else if (status === "Broken") {
                        let word = (reason === "CC") ? " must ":" may ";
                        outputCard.body.push(this.name + " remains Broken and" + word +"make a Rout Move");
                        this.SetAct("Routing");
                    }
                } else if (fail === 1) {
                    if (status === "Good" || status === "Suppressed") {
                        let word = (reason === "CC") ? " must ":" may ";
                        outputCard.body.push(this.name + " is now Broken and"+ word + "make a Rout Move");
                        this.SetStatus("Broken");
                    } else if (status === "Broken") {
                        outputCard.body.push(this.name + " is Eliminated");
                        this.SetStatus("Routed");
                    }
                } else if (fail > 1) {
                    outputCard.body.push(this.name + " is Eliminated");
                    this.SetStatus("Eliminated");
                }
            } else if (reason === "Charge") {
                if (fail === 0) {
                    outputCard.body.push(this.name + " can Charge into contact, ending its Turn");
                    if (this.moved === true) {
                        outputCard.body.push("Its total movement can't be more than " + this.move + "hexes");
                    }

                    if (leader) {
                        if (leader.Act() === "Activated") {
                            outputCard.body.push(leader.name + " may also be Charged if desired");
                        } else {
                            leader.notes.push("Leader Tag Along");
                            outputCard.body.push(leader.name + " when activated, may choose to Charge, without needing a Morale Test");
                        }
                    }
                } else {
                    outputCard.body.push(this.name + " stays where it is, and cannot move any further this Turn");
                }
            } else if (reason === "Sniper") {
                if (fail === 0) {
                    outputCard.body.push("The Sniper stays Hidden");
                } else {
//could maybe modify to be based on # of possible spotters, then give them a spot roll each, stopping if one makes it
                    let roll2 = randomInteger(6);
                    if (roll2 > 2) {
                        outputCard.body.push("The Sniper stays Hidden");
                    } else {
                        outputCard.body.push("The Sniper is Spotted");
                        this.Reveal();
                    }
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

        Act() {
            let active;
            let aura = this.token.get("aura1_color");
            if (aura === "#000000") {
                active = "Activated";
            } else if (aura === "#ffffff") {
                active = "Unactivated";
            } else if (aura === "#00ff00") {
                active = "Active Unit";
            } else if (aura === "#ff0000") {
                active = "Routing";
            }
            return active;
        }

        SetStatus(newStatus) {
            if (newStatus === "Good") {
                this.token.set({
                    tint_color: "transparent",
                })            
            } else if (newStatus === "Broken") {
                this.token.set({
                    tint_color: "#ff0000",
                    aura1_color: "#ff0000",
                })  
                this.token.set(SM.CC,false);
            } else if (newStatus === "Suppressed") {
                this.token.set({
                    tint_color: "#ffff00",
                })  
            } else if (newStatus === "Eliminated") {
                this.token.set("status_dead",true);
            }
        }
            
        SetAct(newAct) {
            if (newAct === "Routing") {
                this.token.set({
                    aura1_color: "#ff0000",
                })
            } else if (newAct === "Activated") {
                this.token.set({
                    aura1_color: "#000000",
                })
            } else if (newAct === "Unactivated") {
                this.token.set({
                    aura1_color: "#ffffff",
                })
            } else if (newAct === "Active Unit") {
                this.token.set({
                    aura1_color: "#00ff00",
                })
            }
        }
            
        Reveal() {
            this.token.set({
                    tint_color: "transparent",
            })
            //twin if not already
        }

        Conceal() {
            this.token.set({
                    tint_color: "#000000",
            })
            //untwin
            //which map ????

        }











        Leader() {
            //returns highest adjacent leader with rank > this
            //if platoon leader only if is in same unit/unitID
            //if in an area, leader has to be in same area ie same building etc
            let leader;
            let leaderRank=0;
            let terrainID = HexMap[this.hexLabel].terrainID || "None";
            _.each(Teams,team => {
                if (team.nation === this.nation && team.leader === true && team.id !== this.id && team.rank > this.rank && team.Status() !== "Broken") {
                    if (team.rank > 1 || (team.rank === 1 && team.unitID === this.unitID)) {
                        let d = team.Distance(this);
                        let terrainID2 = HexMap[team.hexLabel].terrainID || "None";
                        if (d < 2 && terrainID === terrainID2) {
                            if (leaderRank < team.rank) {
                                leader = team;
                                leaderRank = team.rank;
                            }
                        }
                    }
                }
            })
            return leader;
        }

        Followers() {
            //returns adjacent teams that are commanded by a leader
            let terrainID = HexMap[this.hexLabel].terrainID || "None";
            let followers = [];
            _.each(Teams,team => {
                if (team.nation === this.nation && team.id !== this.id && team.rank === 0 && ((this.type.includes("Vehicle") && team.type.includes("Vehicle")) || (this.type.includes("Vehicle") === false && team.type.includes("Vehicle") === false))) {
                    let d = team.Distance(this);
                    let terrainID2 = HexMap[team.hexLabel].terrainID || "None";
                    if (d < 2 && terrainID === terrainID2 && (this.rank > 1 || (this.rank === 1 && this.unitID === team.unitID))) {
                        followers.push(team);
                    }
                }
            })
            return followers;
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

    const AddAbilities = (team) => {
        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: team.charID});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 


        if (team.type !== "Initiative Token" && team.type !== "Marker") {
            //AddAbility("Info","!TokenInfo",team.charID);
            //AddAbility("LOS","!CheckLOS;@{selected|token_id};@{target|token_id}",team.charID);
            AddAbility("Activate Unit","!Activate",team.charID);
        }

        if (team.type === "Initiative Token") {
            AddAbility("Restore Ammo to Unit","!RestoreAmmo;@{target|token_id};Intiative",team.charID);
            AddAbility("Free Activation for Unit","!Activate;@{target|token_id};Initiative",team.charID);
            return;
        }


        let actions = "!Actions;@{selected|token_id};";

        if ((team.leader === true && team.rank > 1) || team.individual === "Forward Observer") {
            AddAbility("Call Artillery",actions + "Call Artillery",team.charID);
        }


//amend for vehicles
        if (team.move > 0) {
            let a = "Move";
            if (team.type.includes("Squad") || team.type === "Infantry Team" || team.rank > 0) {
                a = "?{Move|Normal Move,Move|Charge into Close Combat,Charge}";
            }
            AddAbility("Move",actions + a,team.charID);
        }

        if (team.type.includes("Squad") || team.type === "Infantry Team" || team.rank > 0) {
            AddAbility("0: Close Combat","!CloseCombat",team.charID);
        }


        for (let i=0;i<team.weaponArray.length;i++) {
            let weapon = team.weaponArray[i];
            let j = (i+1)
            AddAbility((i+1) + ": " + weapon.name,actions + "Fire;" + i + ";@{target|token_id}",team.charID);
        }

        AddAbility("Rally",actions + "Rally",team.charID);


        if (team.type === "Weapons Team" || team.type === "Vehicle" || team.type === "Soft Vehicle") {
            AddAbility("Reload",actions + "Reload",team.charID);
        }
        if (team.recon === true || team.type === "Individual" || team.leader === true) {
            AddAbility("Spot",actions + "Spot",team.charID);
        }


    }

    const Reload = (team) => {
        if (randomInteger(6) > 4) {
            outputCard.body.push("Success!");
            outputCard.body.push(team.name + " has reloaded/fixed the weapon jam");
            team.token.set(SM.ammo,false);
        } else {
            outputCard.body.push("[#ff0000]Failure![/#]");
            outputCard.body.push(team.name + " remains Out of Ammo or Jammed"); 
        }
        outputCard.body.push("Its Turn is Done");
        team.SetStatus("Activated");
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
        tablename = nation;
        if (Nations[nation]) {
            tablename = Nations[nation].dice
        }
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        if (!table) {
            table = findObjs({type:'rollabletable', name: "Neutral"})[0];
        }
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
        Teams = {};
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
                let team = new Team(token.get("id"));
            }
        });

        let elapsed = Date.now()-start;
        log(`${c} token${s} checked in ${elapsed/1000} seconds - ` + Object.keys(Teams).length + " placed in Team Array");

    }


    const AddTerrain = () => {
        let start = Date.now();
        //hills defined by lines
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
        });

    
        //Add Token Terrain, Building might be multihex
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        if (page2ID) {
            let tokens2 = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
            for (let i=0;i<tokens2.length;i++) {
                if (tokens.some(t => t.id === token.id)) {
                    continue;
                }
                tokens.push(token);
            }
        }

        _.each(tokens,token => {
            let name = token.get("name") || " ";
            if (name.includes("Map")) {
                return;
            }
            name = name.split("//")[0].trim();
            let terrain = TerrainInfo[name];
            if (terrain) {
                let labels = [];
                if (token.get("width") > 120 || token.get("height") > 120) {
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
                            hex.terrain = name;
                        } else {
                            hex.terrain += ", " + name;
                        }
                        hex.terrainHeight = Math.max(terrain.height,hex.terrainHeight);
                        hex.blockLOS = terrain.blockLOS;
                        let ic = terrain.interCover || 0;
                        hex.interCover = Math.max(ic, hex.interCover);
                        hex.cover = Math.max(terrain.cover,hex.cover);
                        hex.concealment = (terrain.conceal === true) ? true:hex.concealment;
                        if (terrain.blockLOS === "Past") {
                            hex.terrainID = token.id;
                        }
                    }
                })
            }

            let edgeTerrain = EdgeInfo[name];
            if (edgeTerrain) {
                let midPt = new Point(token.get("left"),token.get("top"));
                //find nearest hex to midPt
                let hexLabel = midPt.label();
                //now run through that hexes neighbours and see if midPoint lies between the 2 hexes centres
                let hex1 = HexMap[hexLabel];
                let line2 = tokenMidPoints(token);
                if (hex1) {
                    let neighbourCubes = hex1.cube.neighbours();
                    for (let j=0;j<neighbourCubes.length;j++) {
                        let k = j+3;
                        if (k> 5) {k-=6};
                        let hl2 = neighbourCubes[j].label();
                        let hex2 = HexMap[hl2];
                        if (!hex2) {continue}
                        let intersect = lineLine(line2[0],line2[1],hex1.centre,hex2.centre);
                        if (intersect) {
                            hex1.edges[DIRECTIONS[j]] = name;
                            hex2.edges[DIRECTIONS[k]] = name;
                            break;
                        }
                    }
                }
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
                array = state.HoF.losLines;
            }
            if (lines === "Deploy") {
                array = state.HoF.deployLines;
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
                    state.HoF.losLines.push(line.get("id"))
                } else {
                    state.HoF.deployLines.push(line.get("id"));
                }
            }
        }
    }

    const Lookup = (id) => {
        if (Teams[id]) {
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
        if (!msg.selected) {
            sendChat("","Select a Token First");
            return;
        }
        let id = Lookup(msg.selected[0]._id);
        let team = Teams[id];
        if (!team) {
            sendChat("","Not in Teams");
            return;
        };
        let label = team.hexLabel;
        let hex = HexMap[label];
        SetupCard(team.name,"Info",team.nation);
        let status = team.Status();
        outputCard.body.push("Status: " + status);

        outputCard.body.push("[hr]");
        outputCard.body.push("Hex Label: " + label);
        if (team.Offmap()) {
            outputCard.body.push("Team is Off Map");
        }
        let s = hex.elevation === 1 ? " Storey":" Stories"
        let elevation = hex.elevation === 0 ? "Ground Level":hex.elevation + s;

        outputCard.body.push("Elevation: " + elevation);
        outputCard.body.push("Terrain: " + hex.terrain);
        if (hex.terrainHeight > 0) {
            s = hex.terrainHeight === 1? " Storey":" Stories"
            outputCard.body.push("Terrain Height: " + hex.terrainHeight + s);
        }
        let coverLevels = ["No","Soft","Hard"];
        let cover;
        if (isNaN(hex.cover)) {
            outputCard.body.push("Terrain provides " + hex.cover);
        } else {
            cover = coverLevels[hex.cover];
            outputCard.body.push("Terrain provides " + cover + " Cover");
        }

        if (hex.concealment !== false) {
            let add = (hex.concealment === true) ? "":" for " + hex.concealment + " only";
            outputCard.body.push("Terrain provides Concealment" + add);
        }




        let edgeTerrainTypes = [];
        _.each(DIRECTIONS,a => {
            if (hex.edges[a] !== "Open") {
                outputCard.body.push(a + " Edge: " + hex.edges[a]);
                if (edgeTerrainTypes.includes(hex.edges[a]) === false) {
                    edgeTerrainTypes.push(hex.edges[a]);
                }
            }
        })
        _.each(edgeTerrainTypes,edge => {
                outputCard.body.push("[U]" + edge + "[/u]");
                let edgeInfo = EdgeInfo[edge];
                outputCard.body.push("If LOS Crosses, provides " + edgeInfo.cover);
                if (edgeInfo.conceal !== false) {
                    let add = (edgeInfo.conceal === true) ? "":" for " + edgeInfo.conceal + " only";
                    outputCard.body.push("If LOS Crosses, provides Concealment" + add);
                }
        })



        PrintCard();
    }

    const RollDice = (msg) => {
        PlaySound("Dice");
        let roll = randomInteger(6);
        let playerID = msg.playerid;
        let id,team,player;
        if (msg.selected) {
            id = Lookup(msg.selected[0]._id);
        }
        let nation = "Neutral";

        if (!id && !playerID) {
            return;
        }
        if (id) {
            team = Teams[id];
            if (team) {
                nation = team.nation;
                player = team.player;
            }
        }
        if ((!id || !team) && playerID) {
            nation = state.HoF.players[playerID];
            player = (state.HoF.nations[0] === nation) ? 0:1;
        }

        if (!state.HoF.players[playerID] || state.HoF.players[playerID] === undefined) {
            if (nation !== "Neutral") {    
                state.HoF.players[playerID] = nation;
            } else {
                sendChat("","Click on one of your tokens then select Roll again");
                return;
            }
        } 
        let res = "/direct " + DisplayDice(roll,nation,40);
        sendChat("player|" + playerID,res);
    }

    const UnitNumbers = () => {
        _.each(state.HoF.markers, marker => {
            let el = Teams[marker.id];
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
        activeUnitID = "";
        activeTeamID = "";
        CloseCombats = [];


        RemoveDead();
        BuildMap();

        //clear arrays
        Teams = {};
        UnitArray = {};

        state.HoF = {
            players: {},
            nations: [],
            turn: 0,
            currentPlayer: 2,
            unitNumbers: [],
            unitsLeftToActivate: [0,0],
            deck: [26,26],
            losLines: [],
            markers: [],           
            closeCombat: false,
            unitIDs: {}, //ref by teamID - shows the unitID
            unitMarkers: {}, //ref by unitID - shows the marker
            teams: {}, //ref by unitID, shows all teamIDs in the unit
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
        let turn = state.HoF.turn;
        if (turn === 0) {
            //start of game stuff
            //1st check for any team that start the game visible
            _.each(Teams, team => {
                if (team.name.includes("Sniper's Nest")) {
                    team.token.set({
                        layer: "map",
                        tint_color: "transparent",
                    })
                    let hex = HexMap[team.hexLabel];
                    hex.terrain += ", Sniper's Nest";
                    hex.cover = Math.max(hex.cover,2);
                    hex.concealment = true;
                }




            })


        }
        UnitNumbers();
        turn++;
        state.HoF.currentPlayer = 2;
        state.HoF.turn = turn;
        activeUnitID = "";
        activeTeamID = "";
        state.HoF.unitsLeftToActivate = DeepCopy(state.HoF.unitNumbers);
        SetupCard("Turn " + turn,"","Neutral");
        _.each(Teams,team => {
            team.SetAct("Unactivated");
        })


//start of turn stuff
        PrintCard();
        NextPhase();
    }

    const NextPhase = (ccdone = false) => {
        if (state.HoF.unitsLeftToActivate[0] === 0 && state.HoF.unitsLeftToActivate[1] === 0) {
            NextTurn();
        } else {
            if (activeUnitID) {
                let teamIDs = state.HoF.teams[activeUnitID];
                _.each(teamIDs,teamID => {
                    let team = Teams[teamID];
                    if (team) {
                        team.SetAct("Activated");
                    }
                })
            }

            let currentPlayer = state.HoF.currentPlayer;
            let deck = state.HoF.deck;
            if (currentPlayer === 2) {
                //1st phase of turn
                let card = randomInteger(52);
                currentPlayer = (card < 27) ? 0:1;
            } else {
                currentPlayer = (currentPlayer === 0) ? 1:0;
            }
            state.HoF.currentPlayer = currentPlayer;
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
            let nation = state.HoF.nations[currentPlayer];
            let otherPlayer = (currentPlayer === 0) ? 1:0;
            let unitsLeftToActivate = state.HoF.unitsLeftToActivate[currentPlayer];
            pulled = Math.min(pulled,unitsLeftToActivate);
            let pulledDisplay = pulled;
            let otherSide = state.HoF.unitsLeftToActivate[otherPlayer];
            if (otherSide === 0) {pulled = unitsLeftToActivate};
            if (pulled === unitsLeftToActivate) {
                pulledDisplay = "All Unactivated";
                if (pulled === 1) {
                    pulledDisplay === "Its Remaining";
                }
            }
            state.HoF.deck = deck;
            state.HoF.unitsLeftToActivate[currentPlayer] = (unitsLeftToActivate - pulled);
            let s = (pulled > 1 || pulledDisplay === "All Unactivated") ? "s":"";

            //clear oppfire markers
            _.each(Teams,team => {
                team.token.set(SM.oppfire,false);
            })

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


    const Spot = (team) => {
        let roll = randomInteger(6);
        let revealed = false
        if (roll > 4) {
            let enemies = SpotFunction(team,"closest");
            if (enemies.length > 0) {
                revealed = true;
                _.each(enemies,enemy => {
                    outputCard.body.push(enemy + " Spotted");
                })
            }
        } 
        if (revealed === false) {
            outputCard.body.push("No Enemies Spotted");
        }
        team.spotted = true;
    }

    const EndSpot = (team) => {
        //3 hexes for hidden, LOS if not in concealment
        let enemies = SpotFunction(team,"end");
        if (enemies.length > 0) {
            SetupCard(team.name,"Spot",team.nation);
            _.each(enemies,enemy => {
                outputCard.body.push(enemy + " Spotted");
            })
            PrintCard();
        }
    }

    const SpotFunction = (team,timing) => {
        let closestD = 1000;
        let cutoff = (timing === "end") ? 4:1000;
        let closestTeam;
        let names = [];

        _.each(Teams,team2 => {
            if (team2.nation !== team.nation) {
                if (team2.token.get("tint_color") === "#000000") {
                    let d = team2.Distance(team);
                    let los = LOS(team,team2).los;
                    let concealed = HexMap[team2.hexLabel].concealment;
                    if (d < closestD && d < cutoff && los === true && concealed === true) {
                        closestD = d;
                        closestTeam = team2;
                    }
                    if (concealed === false && los === true) {
                        names.push(team2.name);
                        team2.token.set("tint_color","transparent");
                    }
                }
            }
        })

        //spotting of closest hidden team and its group
        if (closestTeam) {
            let groups = AdjacentTokens();
            let group;
            for (let i=0;i<groups.length;i++) {
                if (groups[i].includes(closestTeam.id)) {
                    group = groups[i];
                    break;
                } 
            }
            if (group.length > 0) {
                _.each(group,id => {
                    let el = Teams[id];
                    if (el.token.get("tint_color") === "#000000") {
                        el.token.set("tint_color","transparent");
                        names.push(el.name);
                    }
                })
            }
        }

        return names
    }

    const Actions = (msg) => {
        let Tag = msg.content.split(";");
        let team = Teams[Lookup(Tag[1])];
        let status = team.Status();
        let act = team.Act();
        let action = Tag[2];
        let weaponNum = Tag[3] || "";
        let weapon;

        let target = Teams[Lookup(Tag[4])];
        if (!team || action === "Fire" && !target) {
            sendChat("","Not in Array");
            return;
        }

        SetupCard(team.name,action,team.nation);

        let errorMsg = [];
        let targetLOS;
        if (action === "Fire") {
            targetLOS = LOS(team,target);
        }

        let toCheck = [team];
        if (team.leader) {
            toCheck.concat(team.Followers());
        } else {
            toCheck.concat(team.Leader());
        }
       //check if team or attached leader is in CC
        for (let i=0;i<toCheck.length;i++) {
            if (toCheck[i].token.get(SM.CC) === true) {
                errorMsg.push("Team is locked in Close Combat and may not take any Actions");
                break;
            }
        }

        if (action === "Fire" && team.unitID !== activeUnitID) {
            action = "Opp Fire";
            if (target.Act() === "Routing") {
                action = "Targeting Fire";
            }
        }
        if (action !== "Opp Fire" && action !== "Targeting Fire" && act === "Unactivated") {
            errorMsg.push("This Unit has not been Activated");
        }

        //if fire, build up the info and check for CC 
        if (action.includes("Fire") && errorMsg.length === 0) {
    //mortars
            weapon = team.weaponArray[weaponNum];
            if (targetLOS.distance < weapon.effRange[0]) {
                errorMsg.push("Target is Under Weapon's Min Range");
            }

            FireInfo = {};
            if (targetLOS.los === true) {
                if (action === "Targeting Fire" && target.token.get(SM.targetfire)) {
                    errorMsg.push(target.name + " has already taken Targeting Fire");
                }
                //single targets for sniper or targeting fire
                if (team.individual === "Sniper" || action === "Targeting Fire") {
                    if (target.token.get(SM.CC) === true) {
                        errorMsg.push(target.name + " is locked in Close Combat and may not be fired at");
                    } else {
                        FireInfo = {
                            weapon: weapon,
                            shooter: team,
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
                        _.each(Teams,team => {
                            if (team.id !== target.id) {
                                let hex = HexMap[team.hexLabel];
                                if (hex.terrainID === terrainID) {
                                    targets.push(team);
                                }
                            }
                        })
                    } else {
                        if (target.leader) {
                            let el = target.Followers()[0];
                            if (el) {
                                targets.unshift(el)
                            }
                        } else {
                            let ld = target.Leader();
                            if (ld) {
                                targets.push(ld);
                            }
                        }
                    }

                    let inCC = false;
                    for (let i=0;i<targets.length;i++) {
                        if (targets[i].token.get(SM.CC) === true) {
                            inCC = targets[i].name;
                            break;
                        } 
                    }

                    if (inCC !== false) {
                        errorMsg.push(inCC + " is locked in Close Combat and may not be fired at");
                    } else {
                        FireInfo = {
                            weapon: weapon,
                            shooter: team,
                            targets: targets,
                            losResult: targetLOS,
                        }
                    }
                } 
            } else {
                errorMsg.push("No LOS to Target");
            }
        }


        
        if (act === "Activated" && action !== "Opp Fire") {
            errorMsg.push("Team already finished its Actions");
        }
        if (action === "Rally" && team.rallied === true) {
            errorMsg.push("Team already Rallied");
        }
        if (action === "Move" && team.moved === true) {
            errorMsg.push("Team already Moved");
        }
        if (action === "Charge" && (team.fired === true || team.spotted === true || team.rallied === true)) {
            errorMsg.push("Team cannot Charge due to other Actions this turn");
        }
        if (action === "Fire" && team.fired === true) {
            errorMsg.push("Team already Fired");
        }
        if (action === "Spot" && team.spotted === true) {
            errorMsg.push("Team already Spotted");
        }
        if (action === "Spot" && team.fired === true && team.recon === true) {
            errorMsg.push("Recon Team cannot Spot if it Fired");
        }
        if (action === "Move" && team.moveOrFire === true && team.fired === true) {
            errorMsg.push("Team Fired");
        }
        if (action === "Fire" && team.moveOrFire === true && team.moved === true) {
            errorMsg.push("Team Moved");
        }
        if (action === "Fire" && team.token.get(SM.ammo) === true && team.type !== "Vehicle") {
            errorMsg.push("Team is Out of Ammo or Jammed");
        }
        if (action === "Fire" && team.spot === true && team.recon === true) {
            errorMsg.push("Recon Team cannot Fire if it Spotted");
        }
        if (action !== "Rally" && status === "Broken") {
            errorMsg.push("Team Broken, can only Rally");
        }
        if (action === "Rally" && status !==  "Broken" && team.leader === false) {
            errorMsg.push("Team not Broken");
        }
        if (action === "Reload" && team.token.get(SM.ammo) === false) {
            errorMsg.push("Team is not Out of Ammo/Jammed");
        }
        if (action === "Opp Fire" && team.token.get(SM.oppfire) === true && weapon.notes.includes("Machinegun") === false) {
            errorMsg.push("Team has already Opp Fired this Phase");
        }
        if (action === "Opp Fire" && status === "Suppressed") {
            errorMsg.push("Suppressed Units may not Fire");
        }
        if (action.includes("Fire") && team.individual.includes("Sniper") && HexMap[team.hexLabel].terrain.includes("Sniper") === false) {
            errorMsg.push("Sniper can only Fire from one of his Prepared Nests");
        }




//Targets moving within a building cannot be hit with opportunity fire, unless the firer is in the same building.

        if (ErrorMsg(errorMsg)) {
            PrintCard();
            return;
        }


        //marks prev team as activated, and if prev moved and hasnt done an 'EndSpot', does that
        if (action !== "Opp Fire" && action !== "Targeting Fire") {
            if (team.id !== activeTeamID) {
                let team2 = Teams[activeTeamID];
                if (team2) {
                    team2.SetAct("Activated");
                    if (team2.moved === true && team2.endSpot === false) {
                        EndSpot(team2);
                        team2.endSpot = true;
                    }            
                }
                activeTeamID = team.id;
            } else {
                if (team.moved === true && team.endSpot === false) {
                    EndSpot(team);
                    team.endSpot = true;
                }
            }
        }

        SetupCard(team.name,action,team.nation); //may have been 'used' already

        switch(action) {
            case 'Charge':
                team.Morale("Charge");
                team.SetStatus("Activated");
                team.SetStatus("Revealed");
                break;
            case 'Move':
                Move(team);
                break;
            case 'Fire':
                Fire();
                break;
            case 'Spot':
                Spot(team);
                break;
            case 'Rally':
                Rally(team);
                break;
            case 'Call Artillery':
                CallArtillery(team);
                break;
            case 'Reload':
                Reload(team);
                break;
            case 'Opp Fire':
                Fire("Opp Fire");
                break;
            case 'Targeting Fire':
                Fire("Targeting Fire");
                break;
        }






        PrintCard();
    }


    const Move = (team) => {
        outputCard.body.push("Team can move up to " + team.move + " hexes");
        let s = (team.crossings === 1) ? "":"s";
        outputCard.body.push("The Team may make " + team.crossings + " crossing" + s);
        team.moved = true;
        let leader = team.Leader();
        if (leader) {
            outputCard.body.push(leader.name + " can Tag Along if desired");
        }
    }




    const Locked = (team) => {
        let teamHex = HexMap[team.hexLabel];
        let neighbourCubes = teamHex.cube.neighbours();
        for (let c=0;c<neighbourCubes.length;c++) {
            let hex = HexMap[neighbourCubes[c].label()];
            if (hex && hex.tokenIDs.length > 0) {
                for (let i=0;i<hex.tokenIDs.length;i++) {
                    let el2 = Teams[hex.tokenIDs[i]];
                    if (el2.nation !== team.nation) {
                        el2.token.set(SM.CC,true);
                    }
                }
            }
        }
    }


    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooter = Teams[Lookup(Tag[1])];
        let target = Teams[Lookup(Tag[2])];

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
        outputCard.body.push("Distance: " + losResult.distance + " hexes");
        outputCard.body.push("[hr]");
        if (losResult.los === false) {
            outputCard.body.push("No LOS due to " + losResult.losReason + " at " + losResult.blockedHexLabel);
        } else {
            coverLevel = [" No "," Soft "," Hard "," Bunker "];
            let cover = Math.max(losResult.cover,losResult.interCover);
            outputCard.body.push("Target has" + coverLevel[cover] + "Cover");
        }


        PrintCard();
    }





    const LOS = (shooter,target) => {
        let shooterHex = HexMap[shooter.hexLabel];
        let targetHex = HexMap[target.hexLabel];
        let distance = shooter.Distance(target);
      
        let shooterHeight = shooterHex.elevation;
        if (shooterHex.terrain.includes("2 Storey") && Infantry.includes(shooter.type)) {
            shooterHeight += 1;
        }
        let targetHeight = targetHex.elevation;
        if (targetHex.terrain.includes("2 Storey") && Infantry.includes(target.type)) {
            targetHeight += 1;
        }
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
            let lastTerrainID;
            let lastTerrain = shooterHex.terrain;
            let lastLabel = shooterHex.label;
            for (let i=0;i<len;i++) {
                let interHex = HexMap[labels[side][i]];

                if (lastTerrainID && lastTerrainID !== interHex.terrainID) {
                    los[side] = false;
                    losReason[side] = lastTerrain;
                    blockedHexLabels[side] = lastLabel;
                    break;   
                }

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
                    let team2 = Teams[interHex.tokenIDs[0]];
                    if (shooter.type.includes("Vehicle") && team2.includes("Vehicle")) {
                        los[side] = false;
                        losReason[side] = team2.name;
                        blockedHexLabels[side] = interHex.label;
                        break;
                    }
                    if ((shooter.type.includes("Infantry") || shooter.type.includes("Weapon") || shooter.type === "Individual") && team2.type !== "Individual") {
                        los[side] = false;
                        losReason[side] = team2.name;
                        blockedHexLabels[side] = interHex.label;
                        break;
                    }
                }

                //Blocking Terrain or Cover Terrain
    
                pt3 = new Point(i+1,0);
                pt4 = new Point(i+1,(interHex.elevation + interHex.terrainHeight));
                line1 = lineLine(pt1,pt2,pt3,pt4); //intersection
            
                if (line1) {
                    interCover[side] = Math.max(interCover[side],interHex.interCover);
                    if (interHex.blockLOS === "Past"){
                        if (interHex.terrainID !== shooterHex.terrainID) {
                            lastTerrainID = interHex.terrainID;
                        }
                    } 
                }

                //edges
                if (i > 1) {
                    let dir = HexMap[labels[side][i-1]].cube.whatDirection(interHex.cube)
                    let edge = HexMap[labels[side][i-1]].edges[dir];
                    if (edge !== "Open") {
                        let edgeInfo = EdgeInfo[edge];
                        if (edgeInfo.blockLOS && i < (len-1)) {
                            los[side] = false;
                            losReason[side] = edge;
                            blockedHexLabels[side] = interHex.label;
                            break;
                        }
                        if (i === len-1) {
                            if (edgeInfo.cover.includes("Hard Cover for Infantry/Crewed Weapons") && target.type.includes("Vehicle") === false) {
                                interCover[side] = 2;
                            }
                            if (edgeInfo.cover.includes("Soft Cover for Infantry") && target.type.includes("Vehicle") === false) {
                                interCover[side] = 1;
                            }
                            if (edgeInfo.cover === 'Hard Cover for Teams against Wall') {
                                interCover[side] = 2;
                            }
                            if (edgeInfo.cover.includes("Soft Cover for Vehicles") && target.type.includes("Vehicle")) {
                                interCover[side] = 1;
                            }
                        }
                    }
                }

                lastTerrain = interHex.terrain;
                lastLabel = interHex.label;
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

        let cover = targetHex.cover;
        if (isNaN(cover)) {
            
            if (cover === "Soft Cover for Stationary Infantry" && Infantry.includes(target.type) && target.token.get(SM.moved) === false) {
                cover = 1;
            } else {cover = 0}
        }



        let result = {
            los: finalLOS,
            losReason: finalLOSReason,
            blockedHexLabel: finalBlockedHexLabel,
            distance: distance,
            interCover: interCoverFinal,
            cover: cover,
            //shooterArcs: shooter.Arcs(target),
            //targetArcs: target.Arcs(shooter),
        }
log(result)
        return result;
    }


    const ErrorMsg = (msgs) => {
        if (msgs.length === 0) {return false};
        _.each(msgs,msg => {
            outputCard.body.push(msg);
        })
        return true;
    }

    const CloseCombat = (msg) => {
        let refTeam = Teams[msg.selected[0]._id];
        let group = AdjacentTokens(msg.selected[0]._id);

        if (refTeam.unitID !== activeUnitID) {
            let err = true;
            let unactivated = (refTeam.token.get("aura1_color") === "#00ff00") ? true:false;
            for (let i=0;i<group.length;i++) {
                let ind = Teams[group[i]];
                if (ind.unitID === activeUnitID) {
                    refTeam = ind;
                    err = false;
                    break;
                }
                if (ind.token.get("aura1_color") === "#00ff00" && unactivated === false) {
                    unactivated = true;
                    refTeam = ind;
                }
            }
            if (err === true && unactivated === false) {
                SetupCard("Neutral","","Neutral");
                outputCard.body.push("One of Teams has to be Active");
                PrintCard();
                return;
            }

        }





        SetupCard(refTeam.nation,"Close Combat",refTeam.nation);



        let highestResult = [0,0];
        let sides = [[],[]];
        let leaders = [false,false]; //leader in good order
        let onlyInd = [true,true]; //only individuals, in which case they get 1 dice
        for (let i=0;i<group.length;i++) {
            let attacker = Teams[group[i]];
            for (let j=0;j<group.length;j++) {
                if (i === j) {continue};
                let defender = Teams[group[j]];
                if (defender.nation !== attacker.nation) {
                    let d = attacker.Distance(defender);
                    if (d < 2) {
                        sides[attacker.player].push(attacker.id);
                        sides[defender.player].push(defender.id);
                        if (attacker.type !== "Individual") {
                            onlyInd[attacker.player] = false;
                        }
                        if (attacker.leader === true && attacker.Status() !== "Broken") {
                            leaders[attacker.player] = true;
                        }
                    }
                }
            }
        }
        //get rid of duplicates
        sides[0] = [... new Set(sides[0])];
        sides[1] = [... new Set(sides[1])];
        //add in any leaders that are 'attached' but not front row
        for (let i=0;i<group.length;i++) {
            let team = Teams[group[i]];
            if (team.leader === false) {continue};
            for (let j=0;j<group.length;j++) {
                if (i === j) {continue};
                let team2 = Teams[group[j]];
                if (team2.nation !== team.nation) {continue}
                let d = team.Distance(team2);
                if (d < 2 && sides[team.player].includes(team2.id)) {
                    sides[team.player].push(team.id);
                    if (team.Status() !== "Broken") {
                        leaders[team.player] = true;
                    }
                    break;
                }
            }
        }
        //get rid of duplicates
        sides[0] = [... new Set(sides[0])];
        sides[1] = [... new Set(sides[1])];
        if (sides[0].length === 0 || sides[0].length === 0) {
            outputCard.body.push("There is no Close Combat Here");
            PrintCard();
            return;
        }
        for (let side = 0;side < 2;side++) {
            outputCard.body.push("[U]" + state.HoF.nations[side] + "[/u]");
            for (let i=0;i<sides[side].length;i++) {
                let team = Teams[sides[side][i]];
                if (team.type === "Individual" && (onlyInd[side] === false || onlyInd[side] === true && i > 0)) {continue};
                let drm = 0;
                let roll = randomInteger(6);
                let tips = ["Roll: " + roll];
                if (leaders[side] === true) {
                    drm++;
                    tips.push("Leader +1");
                }
                if (team.name.includes("SMG")) {
                    drm++;
                    tips.push("SMG +1");
                }
                if (team.name.includes("Engineer") || team.name.includes("Pioneer")) {
                    drm++;
                    tips.push("Engineer +1");
                }
                //Banzai chearge here
                if (team.type.includes("Team")) {
                    drm--;
                    tips.push("Team -1");
                }
                if (team.type === "Individual") {
                    drm--;
                    tips.push("Individual -1");
                }
                if (team.Status() === "Broken") {
                    drm -=2;
                    tips.push("Broken -2");
                }
                if (team.type === "Crewed Weapon") {
                    drm -=2;
                    tips.push("Crewed Weapon -2");
                }
                //enclosed armoured vehicle here
                //open topped vehicle here
                if (team.type === "Soft Vehicle") {
                    tips.push("Soft Vehicle +0");
                }
                //molotov cocktails vs vehicles here
                //grenade bundles / magnetic mines vs vehicles here
                //demo change vs vehicles here

                tips = tips.toString().replaceAll(",","<br>");
                let result = roll + drm;
                result = Math.min(10,Math.max(result,0));
                let tip = '['+ DisplayDice(result,team.nation,24) + ' ](#" class="showtip" title="' + tips + ')';                
                outputCard.body.push(team.name + ": " + tip);
                highestResult[side] = Math.max(highestResult[side],result);
            }
            outputCard.body.push("[hr]");
        }
        let delta = highestResult[0] - highestResult[1];
    
        let winner,loser;
        if (delta > 0) {
            winner = 0;
            loser = 1;
        } else if (delta < 0) {
            winner = 1;
            loser = 0;
        }
        delta = Math.abs(delta);
        if (delta === 0) {
            outputCard.body.push("The Combat ends in a Tie!");
            outputCard.body.push("All Teams remain Locked in Combat");
            _.each(sides,group => {
                _.each(group,ind => {
                    Teams[ind].token.set(SM.CC, true);
                })
            })
        } else {
            outputCard.body.push(state.HoF.nations[winner] + " Wins!");
            outputCard.body.push("[hr]");
            if (onlyInd[winner] === true) {
                outputCard.body.push("They hold off the enemy long enough to get away. They must immediately conduct a rout move, ending the rout move in good-order. They are subject to targeting Fire.");
            } else {
                remaining = CCLoser(sides[loser],delta);
                if (remaining.Routing.length > 0 || remaining["Routing Indiv"].length > 0) {
                    outputCard.body.push("Any Routing Teams are subject to targeting Fire");
                }
                if (remaining.Good.length === 0 && remaining["Good Indiv"].length > 0) {
                    outputCard.body.push("All  Individuals must also make a Rout Move even if in Good Order as there are no remaining Unbroken Troops. They are subject to targeting Fire.")
                }
                if (remaining.Good.length === 0 && remaining["Good Indiv"].length === 0 && remaining.Routing.length === 0 && remaining["Routing Indiv"].length === 0) {
                    outputCard.body.push("All " + state.HoF.nations[loser].short + " Teams were eliminated or Surrendered");
                }
                if (remaining.Good.length > 0) {
                    outputCard.body.push("Remaining Teams stay locked in Close Combat");
                    _.each(remaining.Good,el => {
                        el.token.set(SM.CC,true);
                        Locked(el);
                    })
                }
            }
        }
        PrintCard();
    }

    const CCLoser = (ids,delta) => {
        let remaining = {
            Good: [],
            Routing: [],
            "Good Indiv": [],
            "Routing Indiv": [],
        }
        _.each(ids,id => {
            let team = Teams[id];
            team.Morale("CC",delta);
            outputCard.body.push("[hr]")
            if (team.token.get("status_dead") === false) {
                if (team.type === "Individual") {
                    if (team.Status() === "Broken") {
                        remaining["Routing Indiv"].push(team);
                    } else {
                        remaining["Good Indiv"].push(team);
                    }
                };
                if (team.type !== "Individual") {
                    if (team.Status() === "Broken") {
                        remaining["Routing"].push(team);
                    } else {
                        remaining["Good"].push(team);
                    }
                }
            }
        })

        return remaining;
    }






    const AdjacentTokens = (refTeamID) => {
        const visited = [];
        const groups = [];
        const keys = Object.keys(Teams);
        const ignoreTokens = ["Marker","Initiative Token","Neutral Token"];

        // 1. Helper to find neighbours
        const getneighbours = (current) => {
            let neighbours = [];
            for (let i=0;i<keys.length;i++) {
                let key = keys[i];
                if (key === current) {continue};
                if (ignoreTokens.includes(Teams[key].type)) {
                    continue;
                }
                let d = Teams[key].Distance(Teams[current]);
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

        if (refTeamID) {
            for (let i=0;i<groups.length;i++) {
                let group = groups[i];
                if (group.includes(refTeamID)) {
                    return group;
                }
            }
        } else {
            return groups;
        }
    }



    const SetArmies = () => {
        Teams = {};
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
        let unitMarkers = [0,0];
        let Surnames = DeepCopy(SurnameList);
        let unitNumbers = [0,0];

        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];
            let character = getObj("character", token.get("represents"));   
            if (!character) {continue};
            let team = new Team(token.get("id"));
        }

        let groups = AdjacentTokens();

        for (let i=0;i<groups.length;i++) {
            let group = groups[i];
            let unitID = stringGen();
            let teamMarker = "None";
            let refTeam = Teams[group[0]];
            let groupLetter = "";

            if (refTeam.type === "Marker") {
                let info = {
                    id: team.id,
                    startLoc: team.hexLabel,
                }
                state.HoF.markers.push(info);
                //DuplicateTeam(team);
                continue;
            }

            if (refTeam.type === "Initiative Token" || refTeam.type === "Neutral Token") {
                continue;
            }
            if (refTeam.player < 2) {
                teamMarker = Nations[refTeam.nation].platoonmarkers[unitMarkers[refTeam.player]];
                groupLetter = rowLabels[unitMarkers[refTeam.player]];
                state.HoF.unitMarkers[unitID] = teamMarker;
                unitNumbers[refTeam.player]++;
            };

            let teamIDs = [];
            let num = 0;
            for (let j=0;j<group.length;j++) {
                let team = Teams[group[j]];
                teamIDs.push(team.id);
                let name = team.charName.split(",")[0].trim();
                if (team.type === "Individual") {
                    name = Nations[team.nation][team.individual];
                    let index = randomInteger(Surnames[team.nation].length) - 1;
                    let surname = Surnames[team.nation].splice(index,1);
                    name += " " + surname;
                } else {
                    num++;
                    name += " " + groupLetter + "/" + num;
                }
                let a1c = "#ffffff";
                let tint = "#000000";


                team.token.set({
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
                team.name = name;
                team.unitID = unitID;
                if (teamMarker !== "None") {
                    team.token.set("status_" + teamMarker,true);
                }


                state.HoF.unitIDs[team.id] = unitID;
                AddAbilities(team);
            }
            if (teamMarker !== "None") {
                unitMarkers[refTeam.player]++;
            }
            state.HoF.teams[unitID] = teamIDs;
        }

        sendChat("","Armies Added")
        state.HoF.unitNumbers = unitNumbers;


    }

    const Activate = (msg) => {
        let team = Teams[msg.selected[0]._id];
        if (!team) {return};
        let currentAct = team.Act();
        if (currentAct === "Activated" || currentAct === "Active Unit") {
            sendChat("","Unit already Activated");
            return;
        }
        let lastTeam = Teams[activeTeamID];
        if (lastTeam) {
            lastTeam.SetAct("Activated");
        }
        let teamIDs = state.HoF.teams[team.unitID];
        let title = team.name;
        let newList = [];
        _.each(teamIDs,teamID => {
            team2 = Teams[teamID];
            if (team2) {
                team2.SetAct("Active Unit");
                team2.moved = false;
                team2.fired = false;
                team2.rallied = false;
                team2.spotted = false;
                team2.endSpot = false;
                team2.notes = [];
                if (team2.leader === true) {
                    title = team2.name;
                }
                newList.push(teamID);
            }
        })
        //clear all oppfires
        _.each(Teams,team => {
            team.token.set(SM.oppfire,false);
        })
        SetupCard(title + "'s Unit","",team.nation);
        outputCard.body.push("Unit is now Activated");
        PrintCard();
        activeUnitID = team.unitID;
        state.HoF.teams[team.unitID] = newList;
    }






    const TwinTest = (msg) => {
        let team = Teams[msg.selected[0]._id];
        if (!team) {return};
        DuplicateTeam(team);
        team.maps = [0,1];
    }



    const DuplicateTeam = (team) => {
        let token1 = team.token;
        //create token2
        let token2 = summonToken(team.charID,HexMap[team.hexLabel].centre,{w: team.token.get("width"),h: team.token.get("height")},team.token.get("rotation"),"objects",page2ID);

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

        sendChat("","!twins " + team.id + " " + token2.id);


    }

    const Rally = (team) => {
        if (team.leader === true && team.Status() === "Good") {            
            //leader in good order can rally all adjacent units in command structure
            if (team.rank === 1) {
                _.each(state.HoF.teams[team.unitID],id2 => {
                    let team2 = Teams[id2];
                    if (team2.id !== team.id && team2.Status() === "Broken") {
                        let d = team2.Distance(team);
                        if (d < 2) {
                            outputCard.body.push("[U]" + team2.name + "[/u]")
                            team2.Morale("Rally");
                            outputCard.body.push("[hr]");
                        }
                    }
                })
            } else {
                //co or bat leaders
                _.each(Teams,team2 => {
                    if (team2.nation === team.nation && team2.id !== team.id && team2.Status() === "Broken") {
                        let d = team2.Distance(team);
                        if (d < 2) {
                            outputCard.body.push("[U]" + team2.name + "[/u]")
                            team2.Morale("Rally");
                            outputCard.body.push("[hr]");
                        }
                    }
                })
            }
        } else {
            team.Morale("Rally");
        }
        team.rallied = true;
    }

    const Fire = (fireType = "Active Fire") => {

        let weapon = FireInfo.weapon;
        let shooter = FireInfo.shooter;
        let targets = FireInfo.targets;

        let losResult = FireInfo.losResult;
        let cover = Math.max(losResult.cover,losResult.interCover);
        //mortars???

        let maxRange = weapon.effRange[1];
        let rangedDice = weapon.rangedDice;
        let bonusRange = 0;

        let rangedRolls = [];
        _.each(rangedDice,extra =>  {
            let bits = extra.split("d");
            let num = bits[0] || 1;
            let dice = parseInt(bits[1]);
            for (let i=0;i<num;i++) {
                let roll = randomInteger(dice);
                rangedRolls.push(roll);
                bonusRange += roll;
            }
        })
        let rangedDiceDisplay = rangedDice.toString().replaceAll(","," + ");

        rangedRolls.sort().reverse();
        rangedRolls.toString().replaceAll(","," + ");
        let totalRange = parseInt(maxRange) + parseInt(bonusRange);

        let rangedTip = "Effective Range: " + maxRange;
        rangedTip += "<br>Range Rolls: " + rangedRolls + " [" + rangedDiceDisplay + "]";

        let targetTips = [];

        sendPing(targets[0].token.get("left"),targets[0].token.get("top"),Campaign().get("playerpageid"),null,true);

        SetupCard(shooter.name,fireType,shooter.nation);

        outputCard.body.push("Firing " + weapon.name);

        let whiteDice = weapon.antiInfantry[0];
        let redDice = weapon.antiInfantry[1];

        if (shooter.token.get(SM.ammo) === true && shooter.type.includes("Vehicle")) {
            whiteDice = 0;
            targetTips.push("Vehicle Low on Ammo");
        }

        if ((shooter.type === "Weapons Team" || shooter.type.includes("Vehicle")) && shooter.token.get(SM.ammo) === false) {
            let ammoRoll1 = randomInteger(6);
            let ammoRoll2 = randomInteger(6);
log(ammoRoll1 + " " + ammoRoll2)
            if (ammoRoll1 === 1 && ammoRoll2 < 3) {
                if (shooter.type.includes("Vehicle")) {
                    outputCard.body.push("Weapons Running Low on Ammo or a Weapon Jammed");
                } else {
                    outputCard.body.push("Weapon Jammed or Ran out of Ammo");
                    shooter.token.set(SM.ammo,true);
                }
            }
        }


        if (losResult.distance > totalRange) {
            outputCard.body.push("All Shots Miss due to Distance");


        } else {
            if (targets[0].type.includes("Vehicle") === false) {
                if (fireType === "Targeting Fire") {
                    let roll = randomInteger(6);
                    outputCard.body.push("Roll: " + DisplayDice(roll,Nations[shooter.nation].dice,24));
                    if (roll === 6) {
                        outputCard.body.push(targets[0].name + " is Eliminated!");
                        targets[0].SetStatus("Eliminated");
                    } else {
                        outputCard.body.push(targets[0].name + " survives");
                        targets[0].token.set(SM.targetfire,true);
                    }
                } else {
                    let drm = 0;
                    if (fireType === "Opp Fire" && cover === 0) {
                        targetTips.push("Moving in Open Ground +1");
                        drm++;
                    }
                    if (cover < 2 && targets[0].type === "Individual") {
                        targetTips.push("Individual -1");
                        drm--;
                    }
                    if (cover > 1) {
                        targetTips.push("Target in Hard Cover -1");
                        drm--;
                    }
                    if (losResult.distance <= bonusRange) {
                        targetTips.push("Target within Range Dice +1");
                        drm++;
                    }
                    if (shooter.token.get(SM.oppfire)) {
                        targetTips.push("Machinegun Multiple Opp Fire -1");
                        drm--;
                    }

                    let hits = 0;
                    let whiteRolls = [];
                    let redRolls = [];
                    for (let i=0;i<redDice;i++) {
                        let roll = randomInteger(6);
                        redRolls.push(roll);
                        if (roll === 6) {
                            hits++;
                        }
                    }
                    redRolls = redRolls.sort().reverse();

                    let needRed4 = (weapon.notes.includes("4+ on Red")) ? true:false;
                    if (needRed4) {
                        targetTips.push("White also needs Red 4+");
                    }

                    let finalTip = "";
                    _.each(targetTips,tip => {
                        finalTip += tip + "<br>";
                    })
                    if (targetTips.length > 0) {
                        finalTip += "------------<br>";
                    }
                    finalTip += rangedTip;

                    for (let i=0;i<whiteDice;i++) {
                        let roll = Math.max(1,Math.min(randomInteger(6) + drm,6));
                        whiteRolls.push(roll);
                        if (needRed4 && redRolls.every(num => num < 4)) {
                            continue;
                        }
                        if (roll > 4) {
                            hits++
                        }
                    }
                    whiteRolls = whiteRolls.sort().reverse();
                    whiteDisplay = "";
                    _.each(whiteRolls,roll => {
                        whiteDisplay += DisplayDice(roll,"White",24) + " "; 
                    })
                    redDisplay = "";
                    _.each(redRolls,roll => {
                        redDisplay += DisplayDice(roll,"Red",24) + " "; 
                    })

                    let line = '[Rolls: ](#" class="showtip" title="' + finalTip + ')';   
                    line += whiteDisplay + redDisplay;

                    outputCard.body.push(line);

                    if (hits === 0) {
                        outputCard.body.push("All Shots Miss");
                    } else {
                        let s = hits === 1 ? "":"s";
                        let s2 = targets.length === 1 ? "The Target takes ":"The Targets take ";
                        outputCard.body.push(s2 + hits + " Hit" + s);
                        outputCard.body.push("[hr]")
                        let max = (shooter.individual === "Sniper") ? 1:hits;
                        _.each(targets,target => {
                            target.Morale("Firing",hits,max);
                        })
                    }











                }
            } else {




            }


        }



        if (fireType === "Opp Fire") {
            shooter.token.set(SM.oppfire,true);
        } else if (fireType === "Active Fire") {
            shooter.fired = true;
        }
        if (shooter.individual !== "Sniper") {
            shooter.Reveal();
        } else {
            outputCard.body.push("[hr]");
            shooter.Morale("Sniper");
        }



    }

















    const changeGraphic = (tok,prev) => {
        let team = Teams[tok.id];
        let newLabel = new Point(tok.get("left"),tok.get("top")).toCube().label();
        let prevLabel = new Point(prev.left,prev.top).toCube().label();
        if (team && newLabel !== prevLabel) {
            log(team.name + " moving")
            let index = HexMap[prevLabel].tokenIDs.indexOf(tok.id);
            if (index > -1) {
                HexMap[prevLabel].tokenIDs.splice(index,1);
                HexMap[newLabel].tokenIDs.push(tok.id);
            }
            team.hexLabel = newLabel;
            //opportunity spotting
        } 
        if (team && tok.get("rotation") !== prev.rotation) {
            log(team.name + " turning")
            let phi = Angle(tok.get("rotation"));
            phi = Math.round(phi/30) * 30;
            tok.set("rotation",phi);
        }
    }
    
    const destroyGraphic = (obj) => {
        let id = obj.get("id");
        if (id) {
            let team = Teams[id];
            if (team) {
                log(team.name + " removed from Team Array")
                let index = HexMap[team.hexLabel].tokenIDs.indexOf(id);
                if (index > -1) {
                    HexMap[team.hexLabel].tokenIDs.splice(index,1);
                }
                delete Teams[id];
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
                log(state.HoF);
                log("Team");
                log(Teams)
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
            case '!Actions':
                Actions(msg);
                break;
            case '!Rally':
                Rally(msg);
                break;
            case '!RestoreAmmo':
                RestoreAmmo(msg);
                break;
            case '!Spot':
                Spot(msg);
                break;
            case '!CallArtillery':
                CallArtillery(msg);
                break;
            case '!Fire':
                Fire(msg);
                break;
            case '!CloseCombat':
                CloseCombat(msg);
                break;
            case '!Activate':
                Activate(msg);
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


