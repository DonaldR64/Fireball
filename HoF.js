const Main = (() => {
    const version = '2026.9.10';
    if (!state.HoF) {state.HoF = {}};

    const pageInfo = {};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","AB","AC","AD","AE","AF","AG","AH","AI","AJ","AK","AL","AM","AN","AO","AP","AQ","AR","AS","AT","AU","AV","AW","AX","AY","AZ","BA","BB","BC","BD","BE","BF","BG","BH","BI"];

    let HexSize, HexInfo, DIRECTIONS;
    let MapInfo = {};
    let Teams = {};
    let PlatoonMoves = {};

    let SurnameList = {
        Germany: ["Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann","Bauer","Richter","Klein","Wolf","Schroder","Neumann","Schwarz","Braun","Hofmann","Werner","Krause","Konig","Lang","Vogel","Frank","Beck"],
        Soviet: ["Ivanov","Smirnov","Petrov","Sidorov","Popov","Vassiliev","Sokolov","Novikov","Volkov","Alekseev","Lebedev","Pavlov","Kozlov","Orlov","Makarov","Nikitin","Zaitsev","Golubev","Tarasov","Ilyin","Gusev","Titov","Kuzmin","Kiselyov","Belov"],
        USA: ["Smith","Johnson","Williams","Brown","Jones","Wright","Miller","Davis","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Thompson","White","Harris","Clark","Lewis","Robinson","Walker","Young","Allen"],
        UK: ["Smith","Jones","Williams","Taylor","Davies","Brown","Wilson","Evans","Thomas","Johnson","Roberts","Walker","Wright","Robinson","Thompson","White","Hughes","Edwards","Green","Lewis","Wood","Harris","Martin","Jackson","Clarke"],
    }

    let FirstNameList = {
        Germany: ["Hans","Peter","Klaus","Wolfgang","Jürgen","Dieter","Manfred","Uwe","Günter","Horst","Bernd","Karl","Werner","Heinz","Rolf","Rainer","Gerhard","Helmut","Michael","Gerd"],
        Soviet: ["Aleksandr","Mikhail","Artem","Maksim", "Ivan","Dmitrt","Daniil","Matvey","Timofey","Aleksey","Sergey","Andrey","Roman","Mark","Vladimir","Nik","Kirill","Ilya","Egor","Nikolai"],
        USA: ["Jim","Bob","John","Bill","Dick","David","Chuck","Tom","Mike","Ron","Larry","Don","Joe","Gary","George","Ken","Paul","Ed","Jerry","Dennis"],
        UK: ["James","Robert","John","William","Richard","David","Charles","Thomas","Michael","Ronald","Donald","George","Edward","Arthur","Kenneth","Brian","Peter","Alan","Dennis","Raymond"],


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
            "flag": "status_Soviet::6433738",
            "PL Character ID": "-P1AvRfczzbBj0KaUMXb",
            "Sgt": "Serzhánt",
            "Lt": "Leytenant",
            "Cpt": "Kapitán",
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
            "flag":"status_Iron-Cross::7650254",
            "PL Character ID": "",
            "Sgt": "Feldwebel",
            "Lt": "Leutnant",
            "Cpt": "Hauptmann",
            "platoonmarkers": ["letters_and_numbers0197::4815333","letters_and_numbers0198::4815334","letters_and_numbers0199::4815335","letters_and_numbers0200::4815336","letters_and_numbers0201::4815337","letters_and_numbers0202::4815338","letters_and_numbers0203::4815339","letters_and_numbers0204::4815340","letters_and_numbers0205::4815341","letters_and_numbers0206::4815342"],   
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
//needs flag
            "flag": "",
            "PL Character ID": "",
            "Sgt": "Sergeant",
            "Lt": "Lieutenant",
            "Cpt": "Captain",
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
            "flag": "status_USA::6490818",
            "PL Character ID": "",
            "Sgt": "Sergeant",
            "Lt": "Lieutenant",
            "Cpt": "Captain",
            "platoonmarkers": ["letters_and_numbers0050::4815186","letters_and_numbers0051::4815187","letters_and_numbers0052::4815188","letters_and_numbers0053::4815189","letters_and_numbers0054::4815190","letters_and_numbers0055::4815191","letters_and_numbers0056::4815192","letters_and_numbers0057::4815193","letters_and_numbers0058::4815194","letters_and_numbers0059::4815195"],
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
    // blockLOS - # of hexes past that can be seen, height - stories
    const TerrainInfo = {
        "Trench": {cover: true, conceal: true, blockLOS: false, height: 0,interCover: 0, type: "Very Difficult"},
        "Building 1 Storey": {cover: true, conceal: true, blockLOS: 1, height: 1, type: "Very Difficult"},
        "Building 2 Storey": {cover: true, conceal: true, blockLOS: 1, height: 2, type: "Very Difficult"},
        "Woods": {cover: false, conceal: true, blockLOS: 2, height: 3, type: "Difficult"},
        "Fields": {cover: false, conceal: "Infantry", blockLOS: false, height: 0,  type: "Difficult"},
        "Road": {cover: false, conceal: false, blockLOS: false, height: 0,  type: "Road"},
    }

    const EdgeInfo = {
        "Bocage": {cover: true, conceal: true, blockLOS: 1, height: 2},
        "Hedge": {cover: false, conceal: true, blockLOS: false, height: 0},
        "Wall": {cover: true, conceal: true, blockLOS: false, height: 0},
    }


    //height is #, corresponds to 1 story per #
    const HillInfo = {
        "#000000": {name: "Hill 1"},
        "#666666": {name: "Hill 2"},
    }




    const SM = {
        RFP: "status_red",
        directed: "",
        moveup: "",
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
            this.cover = false;
            this.blockLOS = false;
            this.conceal = false;
            this.type = "Open";
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
            this.notes = aa.notes || " ";
            this.command = false;

            let weaponArray = [];
            for (let w=1;w<3;w++) {
                let pre = "weapon" + w;
                let wequipped = aa[pre + "equipped"];
                if (wequipped !== "Equipped") {continue};
                let wname = aa[pre + "name"];
                let wrange = aa[pre + "range"];
                wrange = wrange.split("-").map(e => parseInt(e));
                if (wrange.length === 1) {
                    wrange.unshift(0);
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


            this.platoonID = state.HoF.platoonIDs[id] || "None";
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


        Status() {
            let status = "Ready";
            let tint = this.token.get("tint_color");
            if (tint === "#ff0000") {
                status = "Suppressed";
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
                active = "Active";
            }
            return active;
        }

        SetStatus(newStatus) {
            if (newStatus === "Ready") {
                this.token.set({
                    tint_color: "transparent",
                })            
            } else if (newStatus === "Suppressed") {
                this.token.set({
                    tint_color: "#ff0000",
                })  
            } else if (newStatus === "Killed") {
                this.token.set("status_dead",true);


//move to map layer
            }
        }
            
        SetAct(newAct) {
            if (newAct === "Activated") {
                this.token.set({
                    aura1_color: "#000000",
                })
            } else if (newAct === "Unactivated") {
                this.token.set({
                    aura1_color: "#ffffff",
                })
            } else if (newAct === "Active") {
                this.token.set({
                    aura1_color: "#00ff00",
                })
            }
        }
            
        Check(modifier) {
            let target = 4 + modifier;
            let roll = randomInteger(6);
            let rollDisplay = roll;
            let add;
            if ((this.quality === "Elite" && roll === 1) || (this.quality === "Poor" && roll === 6) ){
                roll = randomInteger(6);
                rollDisplay = roll + "[" + rollDisplay + "]";
                add = this.quality;
            }

            let success = false;
            let noun = "Fails";
            if (roll >= target) {
                success = true;
                noun = "Succeeds"
            }
            let tip = "Roll: " + rollDisplay + " vs. " + target + "+";
            if (add) {
                tip += "<br>Reroll due to " + add;
            }
            tip = '[' + noun + '](#" class="showtip" title="' + tip + ')';   

            let result = {
                tip: tip,
                result: success,
            }
            return result;
        }

        Rally() {
            let status = this.Status();
            if (this.Status() === "Suppressed") {
                //check LOS to enemy, if none to non-small teams, then auto, otherwise can rally check if no RFP
                let enemyInSight = false;
                let rally = false;
                let keys = Object.keys(Teams);
                for (let i=0;i<keys.length;i++) {
                    let id2 = keys[i];
                    if (id2 === this.id) {continue};
                    let team2 = Teams[id2];
                    if (team2.nation === this.nation) {continue};
                    if (team2.type === "Small Team") {continue};
                    let los = LOS(this,team2);
                    if (los.los === true) {
                        enemyInSight = true;
                        break;
                    }
                }
                if (enemyInSight === false) {
                    outputCard.body.push("Team Rallies as out of LOS");
                    rally = true;
                } else {
                    if (this.token.get(SM.RFP) === false) {
                        let rallyCheck = this.Check(0);
                        outputCard.body.push("Rally Check " + rallyCheck.tip);
                        rally = rallyCheck.result;
                    } else {
                        outputCard.body.push("Unable to Rally due to Enemy Fire");
                    }
                }
                if (rally === true) {
                    this.SetStatus("Ready");
                }
                outputCard.body.push("[hr]");
            }
            return status;
        }

        ResolveFire() {
            let startStatus = this.Status();
            if (this.token.get(SM.RFP) === false) {
                return startStatus;
            }
            let rfp = this.token.get("bar3_value").split("/").map(e => parseInt(e));
        
            let finalStatus = DeepCopy(startStatus);

            outputCard.body.push("Enemy Fire Resolution");
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
                outputCard.body.push("Fire (" + noun1 + "): " + res);
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
            this.token.set("bar3_value","0/0");
            this.token.set(SM.RFP,false);
            return finalStatus;
        }

        Name(rank) {
            let surname = SurnameList[this.nation][randomInteger(SurnameList[this.nation].length) - 1];
            let firstName = FirstNameList[this.nation][randomInteger(FirstNameList[this.nation].length) - 1];
            rank = Nations[this.nation][rank];
            let name = rank + " " + firstName + " " + surname;
            this.name = name;
            this.token.set("name",name);
            return name;
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
        let platoonInfo = state.HoF.platoonInfo[team.platoonID];
        if (team.type !== "System Token") {
            let abilityName = "0: Activate ";
            if (team.notes.includes("Leader") || platoonInfo.vehiclePlatoon) {
                extra = "Platoon";
            } else {
                extra = "Team";
            }
            AddAbility(abilityName + extra,"!Activate;" + extra + ";?{Use Hero Point?|No|Yes}",team.charID);


            AddAbility("Move","!Order;Move;@{selected|token_id}",team.charID);

            if (team.notes.includes("Leader") || team.notes.includes("Company Commander")) {
                AddAbility("1: Rally Team","!Command;Rally;@{selected|token_id};@{target|token_id}",team.charID);
                AddAbility("2: Direct Fire","!Command;Direct Fire;@{selected|token_id};@{target|token_id}",team.charID);
                AddAbility("3: Move Up","!Command;Move Up;@{selected|token_id};@{target|token_id}",team.charID);
                if (team.notes.includes("Company Commander")) {
                    AddAbility("4: Command Platoon Leader","!Command;Command Platoon Leader;@{selected|token_id};@{target|token_id}",team.charID);
                    AddAbility("5: Field Promotion","!Command;Field Promotion;@{selected|token_id};@{target|token_id}",team.charID);
                }




            } else {
                AddAbility("Fire","!Order;Fire;@{selected|token_id};@{target|token_id}",team.charID);
            }






        }







    }

    const Command = (msg) => {
        let Tag = msg.content.split(";");
        let ability = Tag[1];
        let leader = Teams[Tag[2]];
        let target = Teams[Tag[3]];

        let losResult = LOS(leader,target);
        SetupCard(leader.name,ability,leader.nation);

        errorMsgs = [];
        
        if (leader.Status() === "Suppressed") {
            errorMsgs.push("Leader is Suppressed");
        }
        if ((ability === "Rally Team" || ability === "Direct Fire") && losResult.distance > 1) {
            errorMsgs.push(ability + " Target must be adjacent");
        }
        if (ability === "Rally Team" && target.Status !== "Suppressed") {
            errorMsgs.push("Target is not Suppressed");
        }
        if (losResult.los === false) {
            errorMsgs.push("Target must be in LOS");
        }
        if (losResult.distance > 4 && ability === "Field Promotion") {
            errorMsgs.push("Target must be within 4 Hexes");
        }
        if (leader.command === true) {
            errorMsgs.push("Leader has already issued a Command this Activation");
        }
        if (leader.platoonID !== target.platoonID && leader.notes.includes("Company Commander") === false) {
            errorMsgs.push("Can only Command Teams in own Platoon");
        }
        if (target.type === "Vehicle") {
            errorMsgs.push("Cannot Command Vehicles");
        }



        if (ErrorMsg(errorMsgs)) {
            PrintCard();
            return;
        }

        if (ability === "Direct Fire") {
            target.token.set(SM.directed,true);
            outputCard.body.push(target.name + " will add +1 to its ROF");
        } else if (ability === "Move Up") {
            target.token.set(SM.moveup,true);
            outputCard.body.push(target.name + " can move an additional 3 Hexes to move up to the Leader");
        } else if (ability === "Rally") {
            let finalStatus = target.ResolveFire();
            if (finalStatus === "Suppressed") {
                let rallyCheck = target.Check(0);
                outputCard.body.push("Rally Check " + rallyCheck.tip);
                if (rallyCheck.result === true) {
                    team.SetStatus("Ready");
                } 
                outputCard.body.push("If the Target Team moves, the Leader can move with it");
            } else if (finalStatus === "Killed") {
                outputCard.body.push("The Target Team Routed and cannot be Rallied");
            }
        } else if (ability === "Command Platoon Leader") {



        } else if (ability === "Field Promotion") {




            
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
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        
        let s = 0;
        tokens.forEach((token) => {
            let character = getObj("character", token.get("represents"));   
            if (character) {
                let team = new Team(token.get("id"));
                s++;
            }
        });


        log(s + " Teams added to Array");

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
                        if (terrain.blockLOS !== false) {
                            hex.blockLOS = Math.max(hex.blockLOS,terrain.blockLOS);
                        }
                        if (terrain.cover === true) {
                            hex.cover = true;
                        }
                        if (terrain.conceal === true) {
                            hex.conceal = true;
                        }
                        if (terrain.conceal === "Infantry" && hex.cover === false) {    
                            hex.conceal = "Infantry";
                        }
                        if (terrain.type === "Difficult" && hex.type === "Open") {
                            hex.type = "Difficult";
                        }
                        if (terrain.type === "Very Difficult") {
                            hex.type = "Very Difficult";
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
    

        //Roads
        _.each(paths,path => {
            if (path.get("stroke").toLowerCase() === "#ffffff") {
                let vertices = translatePoly(path);
                for (let i=0;i<(vertices.length -1);i++) {
                    let pt1 = vertices[i];
                    let pt2 = vertices[i+1];
                    let hex1 = HexMap[pt1.label()];
                    let hex2 = HexMap[pt2.label()];
                    hex1.type += ",Road";
                    hex2.type += ",Road";
                    let interCubes = hex1.cube.linedraw(hex2.cube);
                    _.each(interCubes,cube => {
                        let hex3 = HexMap[cube.label()];
                        hex3.type += ",Road";
                    })
                }
            }   
        })



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


    const TokenInfo = (msg) => {
        if (!msg.selected) {
            sendChat("","Select a Token First");
            return;
        }
        let team = Teams[msg.selected[0]._id];
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
        outputCard.body.push("Movement: " + hex.type);
        if (hex.terrainHeight > 0) {
            s = hex.terrainHeight === 1? " Storey":" Stories"
            outputCard.body.push("Terrain Height: " + hex.terrainHeight + s);
        }
        let cover = (hex.cover === true) ? "":"No ";
        outputCard.body.push("Terrain provides " + cover + "Cover");
        let concealment = (hex.conceal === true) ? "":"No ";
        if (hex.conceal === "Infantry") {
            concealment = "Infantry ";
        }
        outputCard.body.push("Terrain provides " + concealment + "Concealment");

        let edgeTerrainTypes = [];
        _.each(DIRECTIONS,a => {
            if (hex.edges[a] !== "Open") {
                outputCard.body.push(a + " Edge: " + hex.edges[a]);
                if (edgeTerrainTypes.includes(hex.edges[a]) === false) {
                    edgeTerrainTypes.push(hex.edges[a]);
                }
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
            id = msg.selected[0]._id;
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


    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
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
            firstPlayer: 2,
            heroPoints: [0,0],
            orderPoints: [0,0],
            losLines: [],
            platoonMarkers: [0,0], //# of platoons for each player
            platoonIDs: {}, //ref by teamID - shows the platoonID of that TeamID
            platoonInfo: {}, //ref by platoonID - shows the name, marker,all starting teamIDs of that platoonID
        }
        sendChat("","Cleared State/Arrays");
    }


    const RemoveDead = () => {
        let tokens = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map",});
        _.each(tokens,token => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
        })
    }

    const OrderPoints = (nation) => {
        let points = 1;
        //leaders
        let leaders = 0;
        let rolls = [];
        _.each(Teams,team => {
            if (team.nation === nation) {
                if ((team.notes.includes("Leader") || team.notes.includes("Company Commander") && team.token.get(SM.RFP) === false)) {
                    leaders++;
                    let roll = randomInteger(6);
                    rolls.push(roll);
                    if (roll > 3) {
                        points++;
                    }
                }
            }
        })
        //vehicle units
        let vehicles = 0;
        let platoonsInfo = state.HoF.platoonInfo;
        _.each(platoonsInfo,platoonInfo => {
            if (platoonInfo.vehiclePlatoon === true && platoonInfo.nation === nation) {
                let ready = 0;
                let ids = platoonInfo.teamIDs;
                _.each(ids,id => {
                    let team = Teams[id];
                    if (team && team.Status() === "Ready" && team.token.get(SM.RFP) === false) {
                        ready++;
                    }
                })
                let percent = Math.round(ready/ids.length * 100);
                if (percent >= 50) {
                    vehicles++;
                    let roll = randomInteger(6);
                    rolls.push(roll);
                    if (roll > 3) {
                        points++;
                    }
                }
            }
        })
        let tip = "Leaders: " + leaders;
        tip += "<br>Vehicle Units: " + vehicles;
        tip += "<br>Rolls: " + rolls.sort().reverse().toString();
        tip += "<br>Needing 4+";
        tip = '[' + points + '](#" class="showtip" title="' + tip + ')';   

        let heroDice = randomInteger(6);
        let heroPoints;
        if (heroDice === 6) {
            heroPoints = randomInteger(6);
        }

        
        let results = {
            orderPoints: points,
            tip: tip,
            heroPoints: heroPoints,
        }

        return results;

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
        let currentPlayer = state.HoF.currentPlayer === 0 ? 1:0;
        state.HoF.currentPlayer = currentPlayer;
        if (currentPlayer === state.HoF.firstPlayer) {
            turn++;
            state.HoF.turn = turn;
        }
        let currentNation = state.HoF.nations[currentPlayer];
        //hero points
        let heroPoints = state.HoF.heroPoints[currentPlayer];
        if (turn === 1) {
            heroPoints = Math.max(3,randomInteger(6));
        }
        //order points
        let orderPointArray = OrderPoints(currentNation);
        let orderPoints = orderPointArray.orderPoints;
        let heroDie = false;
        if (orderPointArray.heroPoints && turn > 1) {
            heroPoints = orderPointArray.heroPoints;
            heroDie = true;
        }
        state.HoF.heroPoints[currentPlayer] = heroPoints;


        //send hero points as a whisper
        let playerID = getKeyByValue(state.HoF.players,currentNation);
        SetupCard("Hero Points","",currentNation);
        if (heroDie === true) {
            outputCard.body.push("Hero Die Rolled a 6, Hero Points Reset");
            outputCard.body.push("New Hero Points: " + heroPoints);
        } else {
            outputCard.body.push("Current Hero Points: " + heroPoints);
        }
        PrintCard(playerID)

        let tip = orderPointArray.tip;
        SetupCard(currentNation + " Turn","Turn " + turn,currentNation);
        outputCard.body.push("Order Points: " + tip);
        state.HoF.orderPoints[currentPlayer] = orderPoints;
        PrintCard();

        //clear hero markers on all units as new turn
        //if current player, set status to unactivated
        _.each(Teams,team => {
            team.token.set(Nations[team.nation].flag, false);
            team.command = false;
            if (team.player === currentPlayer) {
                team.SetAct("Unactivated");
            } else {
                team.SetAct("Activated");
            }
        })

        _.each(state.HoF.platoonInfo,platoonInfo => {
            if (platoonInfo.leader === "Killed") {
                platoonInfo.leader = false;
            }
        })

    }

    const SetGame = (msg) => {
        let Tag = msg.content.split(";");
        let firstNation = Tag[1];
        let firstPlayer = state.HoF.nations.indexOf(firstNation);
        state.HoF.firstPlayer = firstPlayer;
        state.HoF.currentPlayer = (firstPlayer === 0) ? 1:0; //as is reversed in nextturn routine
log(state.HoF)


        SetupCard("Setup","","Neutral");
        outputCard.body.push("First Player is " + firstNation);
        outputCard.body.push("Each Player should select one of their tokens and click Roll to link their PlayerID");
        PrintCard();

    }




    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooter = Teams[Tag[1]];
        let target = Teams[Tag[2]];

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
            outputCard.body.push("Target is in LOS");
            if (losResult.cover === true || losResult.interCover === true) {
                outputCard.body.push("Target is in Cover");
            }
            if (losResult.conceal === true || losResult.interConceal === true) {
                outputCard.body.push("Target is Concealed");
            }
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
        let interConcealFinal = 0;

        let finalBlockedHexLabel;
        let finalLOSReason = "";
 
        let interCubes = [shooterHex.cube.linedraw(targetHex.cube),shooterHex.cube.linedraw2(targetHex.cube)];
        let labels = [interCubes[0].map((e)=> e.label()), interCubes[1].map((e)=> e.label())];
        let len = labels[0].length;
        let los = [true,true];
        let interCover = [false,false];
        let interConceal = [false,false];
        let losReason = ["",""];
        let blockedHexLabels = ["",""]


        for (let side=0;side<2;side++) {
            let blocking = 0;
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

                //Intervening Friendly Units at same elevation
                if (interHex.tokenIDs.length > 0 && interHex.label !== targetHex.label) {
                    let team2 = Teams[interHex.tokenIDs[0]];
                    if (team2.nation === shooter.nation && shooterHeight === interHex.elevation && team2.platoonID !== shooter.platoonID) {
                        if (shooter.type.includes("Team")  && team2.type.includes( "Team")) {
                            los[side] = false;
                            losReason[side] = team2.name;
                            blockedHexLabels[side] = interHex.label;
                            break;
                        }
                        if (shooter.type.includes("Team") === false && team2.type.includes("Team") === false) {
                            los[side] = false;
                            losReason[side] = team2.name;
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
                    if (interHex.cover === true) {
                        interCover[side] = true;
                    }
                    if (interHex.conceal === true) {
                        interConceal[side] = true;
                    }
                    if (interHex.conceal === "Infantry" && interConceal[side] === false && target.type.includes("Team")) {
                        interConceal[side] = true;
                    }
                    if (interHex.blockLOS === false && blocking > 0){
                        los[side] = false;
                        losReason[side] = "Other Side of " + interHex.terrain;
                        blockedHexLabels[side] = interHex.label;
                        break;
                    } else {
                        blocking++;
                        if (blocking > interHex.block) {
                            los[side] = false;
                            losReason[side] = interHex.terrain;
                            blockedHexLabels[side] = interHex.label;
                            break;
                        }
                    }
                }

                //edges
                if (i > 1) {
                    let dir = HexMap[labels[side][i-1]].cube.whatDirection(interHex.cube)
                    let edge = HexMap[labels[side][i-1]].edges[dir];
                    if (edge !== "Open") {
                        let edgeInfo = EdgeInfo[edge];
                        if (edgeInfo.blockLOS !== false && i < (len-edgeInfo.blockLOS)) {
                            los[side] = false;
                            losReason[side] = edge;
                            blockedHexLabels[side] = interHex.label;
                            break;
                        }
                        if (edge.conceal === true) {
                            interConceal[side] = true;
                        }
                        if (i === len-1) {
                            if (edge.cover === true) {
                                interCover[side] = true;
                            }
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
            if (interCover[0] === true || interCover[1] === true) {
                interCoverFinal = true;
            }
            if (interConceal[0] === true || interConceal[1] === true) {
                interConcealFinal = true;
            }
        } else if (los[0] === false) {
            interCoverFinal = interCover[1];
            interConcealFinal = interConceal[1];
        } else if (los[1] === false) {
            interCoverFinal = interCover[0];
            interConcealFinal = interConceal[0];
        }

        let cover = targetHex.cover;
        let conceal = targetHex.conceal;
        if (conceal === "Infantry" && target.type.includes("Team")) {
            conceal = true;
        }

        let result = {
            los: finalLOS,
            losReason: finalLOSReason,
            blockedHexLabel: finalBlockedHexLabel,
            distance: distance,
            interCover: interCoverFinal,
            interConceal: interConcealFinal,
            cover: cover,
            conceal: conceal,
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

    const QueryHero = (msg) => {
        let playerID = msg.playerid;
        let nation = state.HoF.players[playerID];
        if (!nation) {
            sendChat("","Player not Registered");
            return;
        }
        let player = state.HoF.nations.indexOf(nation);
        let heroPoints = state.HoF.heroPoints[player];
        SetupCard("Hero Points","",nation);
        outputCard.body.push("You have " + heroPoints + " Remaining");
        PrintCard(playerID);
    }












    const AddPlatoon = (msg) => {
        let platoon = [];
        let teamIDs = [];
        let vehiclePlatoon = true;
        for (let i=0;i<msg.selected.length;i++) {
            let token = getObj("graphic",msg.selected[i]._id);
            let character = getObj("character", token.get("represents"));   
            if (!character) {continue};
            let team = new Team(token.get("id"));
            platoon.push(team);
            teamIDs.push(team.id);
            if (team.type !== "Vehicle") {
                vehiclePlatoon = false;
            }
        }
        teamIDs = [... new Set(teamIDs)];

        let platoonMarkerNum = state.HoF.platoonMarkers[platoon[0].player];
        state.HoF.platoonMarkers[platoon[0].player] = platoonMarkerNum + 1;
        let platoonID = stringGen();
        let platoonName = msg.content.split(";")[1];
        let platoonMarker = Nations[platoon[0].nation].platoonmarkers[platoonMarkerNum];
        let platoonLetter = rowLabels[platoonMarkerNum];
        let platoonInfo = {
            name: platoonName,
            marker: platoonMarker,
            teamIDs: teamIDs,
            vehiclePlatoon: vehiclePlatoon,
            nation: platoon[0].nation,
            leader: true,
            leaderID: "",
        }
        state.HoF.platoonInfo[platoonID] = platoonInfo;

        let num = 0;
        _.each(platoon,team => {
            let name;
log(team.notes)
            if (team.notes.includes("Leader")) {
                name = team.Name("Lt");
                platoonInfo.leaderID = team.id;
            } else if (team.notes.includes("Company Commander")) {
                name = team.Name("Cpt");
                platoonInfo.leaderID = team.id;
            } else {
                name = team.charName.split(",")[0].trim();
                num++;
                name += " " + platoonLetter + "/" + num;
            }

            team.token.set({
                name: name,
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
            team.name = name;
            team.platoonID = platoonID;
            team.token.set("status_" + platoonMarker,true);
            state.HoF.platoonIDs[team.id] = platoonID;
            AddAbilities(team);
        });
        sendChat("","Platoon Added")
    }

 
    const Activate = (msg) => {
        let id;
        if (msg.selected) {
            id = msg.selected[0]._id;
        }
        let Tag = msg.content.split(";");
        let playerID = msg.playerid;
        let groupAct = Tag[1];
        let heroPointUsed = Tag[2] === "Yes" ? true:false;
        let actTeam = Teams[id];
        let availableHP = state.HoF.heroPoints[actTeam.player];
        let availableOP = state.HoF.orderPoints[actTeam.player];
        SetupCard(actTeam.name,"Activate",actTeam.nation);
        let errorMsgs = [];

        if (actTeam.player !== state.HoF.currentPlayer && heroPointUsed === false) {
            errorMsgs.push("Activating during other Player's turn requires a Hero Point to be used");
        }
        if (actTeam.Act() === "Activated" && heroPointUsed === false && actTeam.player === state.HoF.currentPlayer) {
            errorMsgs.push(groupAct + " has already Activated; a Hero Point must be Used");
        }
        if (heroPointUsed && availableHP === 0) {
            errorMsgs.push("No Hero Points Available");
        }
        if (actTeam.Act() === "Unactivated" && availableOP === 0 && heroPointUsed === false) {
            errorMsgs.push("No Order Points Remain, a Hero Point must be used");
        }
        if (heroPointUsed && actTeam.token.get(Nations[actTeam.nation].flag)) {
            errorMsgs.push("This " + groupAct + " has already used a Hero Point this turn");
        }
        if (actTeam.Act() === "Active") {
            errorMsgs.push("This Team is already Activated");
        }

        if (ErrorMsg(errorMsgs)) {
            PrintCard();
            return;
        }
        
        //check re Vehicle if can act as a leader
        if (state.HoF.platoonInfo[actTeam.platoonID].vehiclePlatoon === true) {
            let functioning = 0;
            _.each(state.HoF.platoonInfo[actTeam.platoonID].teamIDs,teamID => {
                let t2 = Teams[teamID];
                if (t2 && t2.Status() !== "Suppressed") {
                    functioning++;
                }
            })
            let percent = Math.round(functioning/state.HoF.platoonInfo.teamIDs.length * 100);
            if (percent < 50) {
                state.HoF.platoonInfo[actTeam.platoonID].leader = false;
                groupAct = "Team";
                outputCard.body.push("Due to Casualties/Suppression, only this Team will be Activated");
            }
        }

        //rally activated team, then resolve fire, then proceed
        let status = actTeam.Rally();
        status = actTeam.ResolveFire();

        let teamKilled = false;
        if (status === "Killed") {
            teamKilled = true;
            if (groupAct === "Platoon") {
                state.HoF.platoonInfo[actTeam.platoonID].leader = "Killed";
                if (actTeam.type === "Vehicle") {
                    outputCard.body.push("The Team abandons the vehicle due to damage");
                } else {
                    outputCard.body.push("The Leader's team routs");
                }
            } else {
                if (actTeam.type === "Vehicle") {
                    outputCard.body.push("The Team abandons the vehicle due to damage");
                } else {
                    outputCard.body.push("The Team routs or is unable to fight any further");
                }
            }
        }

        let teams = [actTeam];

log(state.HoF.platoonInfo[actTeam.platoonID].leader)
        //check if missing a PL
        let newLeader = false;
        if (state.HoF.platoonInfo[actTeam.platoonID].vehiclePlatoon === false && state.HoF.platoonInfo[actTeam.platoonID].leader === false && status !== "Killed") {
            let trainingCheck = actTeam.Check(0);
            if (trainingCheck.result === true) {
                //place a leader token on spot, name it etc
                let cID = Nations[actTeam.nation]["PL Character ID"]
                let token = summonToken(cID,HexMap[actTeam.hexLabel].centre,{w: 70,h: 70},0,"objects");
                if (token) {
                    outputCard.body.push("[hr]");
                    let leader = new Team(token.id);
                    leader.Name("Sgt");
                    outputCard.body.push(leader.name + " has assumed Leadership of the Platoon");
                    outputCard.body.push("He immediately activates this Team and any others in LOS");
                    groupAct = "Platoon";
                    let platoonInfo = state.HoF.platoonInfo[actTeam.platoonID];
                    platoonInfo.leader === true;
                    let teamIDs = platoonInfo.teamIDs;
                    let index = teamIDs.indexOf(platoonInfo.leaderID);
                    teamIDs.splice(index,1);
                    teamIDs.push(leader.id);
                    platoonInfo.leaderID = leader.id;                    
                    platoonInfo.teamIDs = teamIDs;
                    state.HoF.platoonInfo[actTeam.platoonID] = platoonInfo;
                    state.HoF.platoonIDs[leader.id] = actTeam.platoonID;
                    state.HoF.platoonInfo[actTeam.platoonID].leader = true;
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
                    leader.platoonID = actTeam.platoonID;
                    leader.token.set("status_" + state.HoF.platoonInfo[actTeam.platoonID].marker,true);
                    newLeader = true;
                    teams.push(leader);
                }
            }

        }


        _.each(Teams,team => {
            if (team.Act() === "Active") {
                team.SetAct("Activated");
            }
        })


        let platoonInfo = state.HoF.platoonInfo[actTeam.platoonID];
        if (groupAct === "Platoon") {
            //activate entire platoon in LOS from team
            let ids = platoonInfo.teamIDs;
            _.each(ids,id2 => {
                if(id2 !== actTeam.id) {
                    let team2 = Teams[id2];
                    if (team2) {
                        let los = LOS(actTeam,team2);
                        if (los.los === true) {
                            teams.push(team2)
                        }
                    }
                }
            })
        }

        teams = [...new Set(teams)];

        //Teams activate in four steps: Declare Orders, Rally (if applicable), Resolve RFPs, then Execute Orders.
        //do the RFPs etc when select Move/Fire on each team individually
        //make all team(s) green aura to signify which can be given orders
        _.each(teams,team => {
            if (heroPointUsed && team.token.get(Nations[team.nation].flag) === false) {
                team.SetAct("Active");
                team.command = false;
                team.token.set(SM.directed, false);
                team.token.set(SM.moveup,false);
                team.token.set(Nations[team.nation].flag,true);
            } else if (team.Act() === "Unactivated") {
                team.SetAct("Active");
                team.command = false;
                team.token.set(SM.directed, false);
                team.token.set(SM.moveup,false);
            }
        })

        if (groupAct === "Team" && teamKilled === false) {
            outputCard.body.push("The Team is Activated and can be given an Order");
        } else if (groupAct === "Platoon") {
            if (platoonInfo.leader === "Killed") {
                outputCard.body.push("Any Teams in LOS are Activated, but only one Team can Move/Fire");
            } else if (newLeader === false) {
                outputCard.body.push("Any Teams in LOS are Activated and can be given an Order");
            }
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

        //roll movement rates for whole unit and save to 'pull out' if any in unit move
        PM();
    }

    const PM = () => {
        PlatoonMoves = {
            infMove: [randomInteger(6),randomInteger(6)].sort(),
            gunMove: [randomInteger(6)],
            vehMove: [randomInteger(6),randomInteger(6),randomInteger(6)].sort(),
        }
    }




    const Order = (msg) => {
        let Tag = msg.content.split(";");
        let order = Tag[1];
        let team = Teams[Tag[2]];
        let target = Tag[3] || ""; //if fire, otherwise blank

        SetupCard(team.name,order,team.nation);
        if (team.Act() !== "Active") {
            outputCard.body.push("Team is not Active");
            PrintCard();
            return;
        }
        //Order Declared, now do rally and resolve RFP
        let status = team.Rally();
        let flag = team.token.get(SM.RFP);
        status = team.ResolveFire();
        team.SetAct("Activated");
        if (status === "Killed") {
            PrintCard();
        } else {
            if (order === "Move") {
                if (flag) {PrintCard()};
                Move(team);
            } else if (order === "Fire") {
                if (status === "Suppressed") {
                    outputCard.body.push("Suppressed Units Cannot Fire");
                    PrintCard();
                } else {
                    if (flag) {PrintCard()};
                    Fire(team,target);
                }
            }
        }

        if (state.HoF.platoonInfo[team.platoonID].leader === "Killed") {
            _.each(Teams,team => {
                if (team.Act() === "Active") {
                    team.SetAct("Activated");
                }
            })
            state.HoF.platoonInfo[team.platoonID].leader = false;
        }

    }



    const Move = (team) => {
        SetupCard(team.name,"",team.nation);
        let subtitle;
        let hex = HexMap[team.hexLabel];
        if ( Object.keys(PlatoonMoves).length === 0) {
            PM();
        }

        if (team.type.includes("Team")) {
            let move = 0;
            _.each(PlatoonMoves.infMove,roll => {
                move += roll;
            })
            subtitle = "Rolls: " + PlatoonMoves.infMove.toString();
            subtitle += "<br>No LOS = 12 Hexes";
            subtitle = '[Movement](#" class="showtip" title="' + subtitle + ')';   
            if (team.notes.includes("Leader")) {
                move = 12;
                subtitle = "Leader: 12 Hexes";
            }
            outputCard.body.push("Movement: [#ff0000]" + move + "+[/#] Hexes");
            outputCard.body.push("The Team is Unaffected by Difficult or Very Difficult Ground");
        } else if (team.type.includes("Gun")) {
            let move = PlatoonMoves.gunMove[0];
            let s = move === 1 ? "":"es"
            subtitle = "Roll: " + move;
            subtitle += "<br>No LOS = 6 Hexes";

            subtitle = '[Movement](#" class="showtip" title="' + subtitle + ')';   
            outputCard.body.push("Movement: [#ff0000]" + move + "+[/#] Hex" + s);
            outputCard.body.push("The Team is  Unaffected by Difficult Ground");
            outputCard.body.push("The Team is unable to enter Very Difficult Ground");
            outputCard.body.push("The Team may not move adjacent to enemy Teams");
        } else if (team.type.includes("Vehicle")) {
            let maxMove = 0;
            for (let i=0;i<3;i++) {
                maxMove += PlatoonMoves.vehMove[i];
            }
            let s = maxMove === 1 ? "":"es"
            let diffMove = maxMove - PlatoonMoves.vehMove[2]; //drop highest;
            let s2 = diffMove === 1 ? "":"es"
            subtitle = "Rolls: " + PlatoonMoves.vehMove.toString();
            subtitle += "<br>No LOS = 18 or 12 Hexes";
            subtitle = '[Movement](#" class="showtip" title="' + subtitle + ')';   

            if (team.notes.includes("Tracked") || team.notes.includes("Half-Tracked")) {
                if (hex.type.includes("Open")) {
                    outputCard.body.push("Movement: [#ff0000]" + maxMove + "+[/#] Hex" + s);
                }
                if (team.notes.includes("Tracked")) {
                    outputCard.body.push("Difficult or Very Difficult Ground: [#ff0000]" + diffMove + "+[/#] Hex" + s2);
                    outputCard.body.push("Very Difficult Ground Requires a Terrain Check");
                } else if (team.notes.includes("Half-Tracked")) {
                    outputCard.body.push("Difficult Ground: [#ff0000]" + diffMove + "+[/#] Hex" + s2);
                    outputCard.body.push("Very Difficult Ground may not be entered");
                }
                if (hex.type.includes("Road")) {
                    outputCard.body.push("Movement entirely on a Road adds 6 Hexes");
                }
            }
            if (team.notes.includes("Wheeled")) {
                if (hex.type.includes("Open")) {
                    outputCard.body.push("Movement: [#ff0000]" + maxMove + "+[/#] Hex" + s);
                }
                outputCard.body.push("Difficult Ground: [#ff0000]" + diffMove + "+[/#] Hex" + s2);
                outputCard.body.push("Difficult Ground also requires a Terrain Check");
                outputCard.body.push("Very Difficult Ground may not be entered");
                if (hex.type.includes("Road")) {
                    outputCard.body.push("Movement entirely on a Road adds 12 Hexes");
                }
            }
            outputCard.body.push("Unless following a road, Vehicles can only Turn in the first 6 Hexes of movement");
            outputCard.body.push("Reversing coses 2 Hexes/1 Hex of movement");




        }

        outputCard.subtitle = subtitle;

        if (team.token.get(SM.moveup)) {
            outputCard.body.push("[hr]");
            outputCard.body.push("The Team may Move Up an additional 3 Hexes")
            team.token.set(SM.moveup,false);
        }

        PrintCard();
    }

    const Fire = (team,target) => {
        SetupCard(team.name,"Fire",team.nation);


        PrintCard();
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
                log("Teams");
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
            case '!AddPlatoon':
                AddPlatoon(msg);
                break;
            case '!NextTurn':
                NextTurn();
                break;
            case '!SetGame':
                SetGame(msg);
                break;
            case '!QueryHero':
                QueryHero(msg);
                break;
            case '!Activate':
                Activate(msg);
                break;
            case '!Order':
                Order(msg);
                break;
            case '!Command':
                Command(msg);
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
        log("===> Hail of Fire <===");
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


