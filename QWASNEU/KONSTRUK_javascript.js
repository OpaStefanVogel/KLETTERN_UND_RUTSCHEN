if (1==1) {
//Veränderungen zu GAP:
//1.EGGT ohne /-P[3]
//in KFILL if (PZZS[2*PNR][1]<=PZZS[2*PNR+1][1])
//in TFIND if (Math.abs(A)<0.00001) return 2; //Rand
//.. extra EBENE normalisiert und gerichtet, SCHNITT3=-SCHNITT1
//sonst zu machen noch:
//.. in KPLOT noch width und height anpassen
//.. überflüssige Ebenen entfernen
//ok warum in KFILL das if drinbeiben muss, ok ist raus
//.. wie es zu dem U==[0,0,0,0] kommt
//.. bei AUFDERKANTE muß wohl ein AUFDERFLAECHE auch mit dazu

Logtext="";
Logflag=false;
Logtext=Logtext+"KONSTRUK_javascript.js laden...\n";

var TEBN=1;
var TAND=2;
var TNOT=3;

var TSETZ=function(A) {
  if (Math.abs(A)<0.00001) return 2; //Rand
  if (A<0) return 3;  //draussen
  if (A>0) return 1;  //innen
  }
//alert(TSETZ(-7));

//1
var PUNKTWERT=function(EBENE,PUNKT) { //Funktionswert der Ebenengleichung für einen Punkt P
  return PUNKT[0]*EBENE[0]+PUNKT[1]*EBENE[1]+PUNKT[2]*EBENE[2]+PUNKT[3]*EBENE[3];
  }
//alert("PUNKTWERT 1 "+PUNKTWERT([1,0,0,1],[-1,0,0,0]));//-1

var TFIND=function(OBJ,ENR,P) {
  return TSETZ(PUNKTWERT(OBJ[0][ENR],P));
  }
//alert("TFIND 3 "+TFIND([[[1,0,0,1]]],0,[-1,0,0,0]));

//2
var STAPEL=[];
DURCHGUCKER=function(OBJ,P) { // ob P im Inneren oder auf Rand von OBJ
  //local X,Y,T,ETNR;
  if (P[0]==0&P[1]==0&P[2]==0&P[3]==0) return 3;
  var X=0;
  var Y=0;
  var ETNR=0; //ETNR für ETADR
  for (var i in OBJ[1]) { var T=OBJ[1][i]
  //for (var T of OBJ[1]) { 
    //alert("TFIND\n"+OBJ+"\n"+ETNR+"\n"+P+"\n"+TFIND(OBJ,ETNR,P));
    if (T==TEBN) {STAPEL.push(X); X=TFIND(OBJ,ETNR,P); ETNR=ETNR+1}
    if (T==TAND) X=Math.max(X,STAPEL.pop())
    if (T==TNOT) X=4-X;
    //alert(ETNR+" "+T+" "+STAPEL);
    }
  return X;
  }
//alert("DURCHGUCKER 3 "+DURCHGUCKER([[[1,0,0,1]],[TEBN]],[-1,0,0,1]));//3
//alert("DURCHGUCKER 3 "+DURCHGUCKER([[[1,0,0,0],[0,1,0,0],[0,0,1,0],[-1,0,0,100],[0,-1,0,150],[0,0,-1,200]],[TEBN,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND],[],[]],[-1,0,0,1]));//3
//alert("DURCHGUCKER 3 "+DURCHGUCKER([[[0,-1,0,100]],[TEBN]],[0,101,0,1]));//3
//alert(nix);

//3
var EGGT=function(E) { //kürzt Ebenengleichung, gemeinsame Faktoren herausdividieren
  if (E[3]<0) return [E[0]/E[3],E[1]/E[3],E[2]/E[3],1];
  if (E[3]==0) return E;
  if (E[3]>0) return [E[0]/E[3],E[1]/E[3],E[2]/E[3],1];
  }
//alert("EGGT 2.5,2,1.5,1 "+EGGT([10,8,6,4]));
	
//4
var Determinant3=function(A) {
  return A[0][0]*A[1][1]*A[2][2]+A[0][1]*A[1][2]*A[2][0]+A[0][2]*A[1][0]*A[2][1]
        -A[0][0]*A[2][1]*A[1][2]-A[0][1]*A[1][0]*A[2][2]-A[0][2]*A[1][1]*A[2][0];
  }
//alert("Determinant -3 "+Determinant3([[1,2,3],[2,3,3],[3,3,3]]));

var DREIEBENEN=function(E1,E2,E3) { //Schnittpunkt dreier Ebenen
  var RET=EGGT([
    Determinant3( [[E1[1],E1[2],E1[3]],[E2[1],E2[2],E2[3]],[E3[1],E3[2],E3[3]]]),
    -Determinant3([[E1[2],E1[3],E1[0]],[E2[2],E2[3],E2[0]],[E3[2],E3[3],E3[0]]]),
    Determinant3( [[E1[3],E1[0],E1[1]],[E2[3],E2[0],E2[1]],[E3[3],E3[0],E3[1]]]),
    -Determinant3([[E1[0],E1[1],E1[2]],[E2[0],E2[1],E2[2]],[E3[0],E3[1],E3[2]]])
    ]);
  //alert([[E1[0],E1[1],E1[2]],[E2[0],E2[1],E2[2]],[E3[0],E3[1],E3[2]]].join("\n"));
  //alert(RET);
  return RET;
  }
//alert("\nDREIEBENEN:1,2,0,1 "+DREIEBENEN([1,0,0,1],[0,1,0,2],[0,0,1,0]));
//alert("\nDREIEBENEN:0,100,0,1 "+DREIEBENEN([1,0,0,0],[0,0,1,0],[0,-1,0,100]));
//alert(nix);


//5
var EBENE=function(P1,P2,P3) { //Objekt Ebene durch drei Punkte P1, P2, P3,
  return [[DREIEBENEN(P1,P2,P3)],[TEBN],[],[]];
  }

var SCHNITT1=EBENE([1,0,0,1],[0,1,0,1],[0,0,0,1]);
var SCHNITT2=EBENE([100,0,0,1],[200,50,150,1],[200,0,90,1]);
var SCHNITT3=EBENE([100,0,0,1],[200,0,90,1],[200,50,150,1]);
//alert("SCHNITT1 "+SCHNITT1.join("\n"));

//6
var QFILL=function(OBJ) { //Berechnet und ergänzt Koordinatenangabe [ei,ej,ek,[xi,xj,xk,xl]]
  //local i,j,k,n,P;
  OBJ[2]=[];
  OBJ[3]=[];
  var P=0;
  var n=OBJ[0].length;
  for (var i=0;i<n;i++) {
    for (var j=i+1;j<n;j++) {
      for (var k=j+1;k<n;k++) {
        P=DREIEBENEN(OBJ[0][i],OBJ[0][j],OBJ[0][k]);
        if (P[3]<0) P=[-P[0],-P[1],-P[2],-P[3]];
        if (DURCHGUCKER(OBJ,P)!=3) OBJ[2].push([i,j,k,P]);
//alert("xxx\n"+JSON.stringify(OBJ)+"\n-------------\n"+[i,j,k]+"\n"+P+"\n"+DURCHGUCKER(OBJ,P));
        }
      }
    }
  return OBJ;
  }

var PUNKT_A=[0,0,0,1];
var QUADER=function(L,B,H) { //Objekt "Quader"
  return QFILL([
    [[1,0,0,-PUNKT_A[0]],[0,1,0,-PUNKT_A[1]],[0,0,1,-PUNKT_A[2]],
     [-1,0,0,PUNKT_A[0]+L],[0,-1,0,PUNKT_A[1]+B],[0,0,-1,PUNKT_A[2]+H]],
    [TEBN,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND],
    [],[]]);
  }
var BALKEN1=QUADER(200,100,150);
if (Logflag) Logtext=Logtext+"BALKEN1 mit 6 Ebenen und 8 Eckpunkten:\nEbenen="+JSON.stringify(BALKEN1[0])+"\n";
if (Logflag) Logtext=Logtext+"Verknüpfung 1=Ebene, 2=AND, 3=NOT: "+JSON.stringify(BALKEN1[1])+"\n";
if (Logflag) Logtext=Logtext+"Eckpunkte [Ebene1,Ebene2,Ebene3,[x,y,z,1]]: "+JSON.stringify(BALKEN1[2])+"\n";

//alert(DURCHGUCKER(BALKEN1,[0,0,0,1]));
//alert(DURCHGUCKER(BALKEN1,[0,0,1,1]));
//alert(DURCHGUCKER(BALKEN1,[0,1,1,1]));
//alert(DURCHGUCKER(BALKEN1,[1,1,1,1]));
//alert(DURCHGUCKER(BALKEN1,[-1,1,1,1]));
//alert(DURCHGUCKER(BALKEN1,[100,0,0,1]));
//alert(DURCHGUCKER(BALKEN1,[199,99,149,1]));
//alert(DURCHGUCKER(BALKEN1,[200,100,150,1]));
//alert(DURCHGUCKER(BALKEN1,[200,100,151,1]));

//7
//PFILL(...) weglassen

var MERK12=[];
var MERK=[];
var DFILL=function(OBJ) { //füllt eine temporäre separate Liste MERK12 mit Kantenfluchtlinien
  MERK12=[];
  MERK=[];
  //for (P of OBJ[2]) {//alert(JSON.stringify(P));
  for (var iP in OBJ[2]) {var P=OBJ[2][iP]
    if (MERK12.indexOf("["+[P[0],P[1]]+"]")==-1) {MERK12.push("["+[P[0],P[1]]+"]"); MERK.push([P[0],P[1],P[2]])}
    if (MERK12.indexOf("["+[P[1],P[2]]+"]")==-1) {MERK12.push("["+[P[1],P[2]]+"]"); MERK.push([P[1],P[2],P[0]])}
    if (MERK12.indexOf("["+[P[0],P[2]]+"]")==-1) {MERK12.push("["+[P[0],P[2]]+"]"); MERK.push([P[0],P[2],P[1]])}
    }
  }
DFILL(BALKEN1); 
//alert("MERK12="+JSON.stringify(MERK12));
//alert("MERK="+JSON.stringify(MERK));


//8
function Zsort(a,b) {if (a<b) return -1;if (a==b) return 0; return 1}
function Asort(a,b) {if (a[0]<b[0]) return -1;if (a[0]==b[0]) return 0; return 1}

var KFILL=function(OBJ) { //fuellt Kantenliste [pnr1,pnr2,enr1,enr2]
  //local M,PNR,PZZS,PZZT;
  DFILL(OBJ);
//  if (Logflag) alert(99);
  OBJ[3]=[];
  //for (var M of MERK) {
  for (var iM in MERK) { var M=MERK[iM];
//    if (Logflag) alert(iM+" "+MERK.length+" "+JSON.stringify(M));
    if (Logflag) Logtext=Logtext+"Kantenfluchtlinie "+M+"\n";
    var PZZT=[];
    for (var PNR=0;PNR<OBJ[2].length;PNR++) {//alert(PNR);
      if (M[0]==OBJ[2][PNR][0]&M[1]==OBJ[2][PNR][1]) PZZT.push([PUNKTWERT(OBJ[0][M[2]],OBJ[2][PNR][3]),PNR,OBJ[2][PNR][2]]);
      if (M[0]==OBJ[2][PNR][1]&M[1]==OBJ[2][PNR][2]) PZZT.push([PUNKTWERT(OBJ[0][M[2]],OBJ[2][PNR][3]),PNR,OBJ[2][PNR][0]]);
      if (M[0]==OBJ[2][PNR][0]&M[1]==OBJ[2][PNR][2]) PZZT.push([PUNKTWERT(OBJ[0][M[2]],OBJ[2][PNR][3]),PNR,OBJ[2][PNR][1]]);
      }
    PZZS=PZZT.sort(Asort);
//    if (Logflag) alert("PZZS="+JSON.stringify(PZZS));    
    if (Logflag) Logtext=Logtext+"  "+PZZS.length+" PZZS="+JSON.stringify(PZZS)+"\n";
    for (var PNR=0;PNR<(PZZS.length-1)/2;PNR++) /*if (PZZS[2*PNR][1]<=PZZS[2*PNR+1][1])*/ { //warum geht ohne if nicht?
      if (Logflag) Logtext=Logtext+"    neue Kante von Punkt P"+PZZS[2*PNR][1]+" bis Punkt P"+PZZS[2*PNR+1][1]+" entlang der Schnittgeraden von Ebene E"+M[0]+" und Ebene E"+M[1]+"\n";
      OBJ[3].push([PZZS[2*PNR][1],PZZS[2*PNR+1][1],M[0],M[1]]);
      }
    }
  }
      
KFILL(BALKEN1);
//Logtext=Logtext+JSON.stringify(BALKEN1[0])+"\n";
//Logtext=Logtext+JSON.stringify(BALKEN1[2])+"\n";
if (Logflag) Logtext=Logtext+"Kanten [Punkt1,Punkt2,Ebene1,Ebene2]: "+JSON.stringify(BALKEN1[3])+"\n";

//9

var ABSTAND=function(A,B) {
  return Math.sqrt((B[0]-A[0])*(B[0]-A[0])+(B[1]-A[1])*(B[1]-A[1])+(B[2]-A[2])*(B[2]-A[2]));
  }

var AUFDERKANTE=function(A,B,C) {
  var ab=ABSTAND(A,B);
  var bc=ABSTAND(B,C);
  var ac=ABSTAND(A,C);
  if (Math.abs(ab+bc-ac)<0.1) return 2; else return 3;
  }

var GERADEXEBENE=function(OBJ1,OBJ2) { //Schnittpunkte der Kanten von OBJ1 mit Ebenen von OBJ2
  //local U,V,W,KANTE,EBENE,ERG,ENR;
  var ERG=[];
  //for (var KANTE of OBJ1[3]) {
  for (var iKANTE in OBJ1[3]) { var KANTE=OBJ1[3][iKANTE]
    for (var ENR=0;ENR<OBJ2[0].length;ENR++) { //hier ginge auch in OBJ2[1], ENR nur wegen Print
      if (Logflag) Logtext=Logtext+"Kante "+JSON.stringify(KANTE)+" und Ebene "+JSON.stringify(ENR)+" ";
      var U=EGGT(DREIEBENEN(OBJ1[0][KANTE[2]],OBJ1[0][KANTE[3]],OBJ2[0][ENR]));
      //if U[4]<0 then U:=-U; fi;// ist jetzt EGGT
      if (Logflag) Logtext=Logtext+"Schnittpunkt in "+JSON.stringify(U)+" ";
      var V=2;
      //var V=DURCHGUCKER(OBJ1,U);
      //if (Logflag) Logtext=Logtext+"V="+V+" ";
      var W=DURCHGUCKER(OBJ2,U);
      if (Logflag) Logtext=Logtext+"W="+W+" ";
      var AK=AUFDERKANTE(OBJ1[2][KANTE[0]][3],U,OBJ1[2][KANTE[1]][3]);
      if (Logflag) Logtext=Logtext+"AK="+AK+" ";
      if ((V==2)&(W==2)&(AK!=3)) {
        ERG.push([KANTE[2],KANTE[3],ENR,U]);
        if (Logflag) Logtext=Logtext+"drin" } else if (Logflag) Logtext=Logtext+"draußen";
      if (Logflag) Logtext=Logtext+"\n";
      }
    }
  return ERG;
  }
var GX=GERADEXEBENE(BALKEN1,SCHNITT2);
if (Logflag) Logtext=Logtext+"GERADEXEBENE(BALKEN1,SCHNITT2)="+JSON.stringify(GX)+"\n";
if (Logflag) Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,150.0010,1])="+DURCHGUCKER(SCHNITT2,[200,50,150.0010,1])+"\n";
if (Logflag) Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,150.0001,1])="+DURCHGUCKER(SCHNITT2,[200,50,150.0001,1])+"\n";
if (Logflag) Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,150.0000,1])="+DURCHGUCKER(SCHNITT2,[200,50,150.0000,1])+"\n";
if (Logflag) Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,149.9999,1])="+DURCHGUCKER(SCHNITT2,[200,50,149.9999,1])+"\n";
if (Logflag) Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,149.9990,1])="+DURCHGUCKER(SCHNITT2,[200,50,149.9990,1])+"\n";


//10
var SCHNITTPUNKTE=function(OBJ1,OBJ2) { //Schnittpunkte der Kanten eines OBJ mit Ebenen des anderen OBJ
  //local TRU,E,ERG12,ERG21,MERK;
  var TRU=OBJ1[0].length;
  if (Logflag) Logtext=Logtext+"GERADEXEBENE(OBJ1,OBJ2) "+JSON.stringify(TRU)+"\n";
  var ERG12=GERADEXEBENE(OBJ1,OBJ2);
  //for (var E of ERG12) E[2]=E[2]+TRU;
  for (var iE in ERG12) { var E=ERG12[iE]; E[2]=E[2]+TRU}
  if (Logflag) Logtext=Logtext+"ERG12 "+JSON.stringify(ERG12)+"\n";
  if (Logflag) Logtext=Logtext+"GERADEXEBENE(OBJ2,OBJ1) "+JSON.stringify(TRU)+"\n";
  var ERG21=GERADEXEBENE(OBJ2,OBJ1);
  if (Logflag) Logtext=Logtext+"ERG21 "+JSON.stringify(ERG21)+"\n";
  //for (var E of ERG21) { 
  for (var iE in ERG21) { var E=ERG21[iE];
    E[0]=E[0]+TRU; E[1]=E[1]+TRU;
    var MERK=E[2];E[2]=E[1];E[1]=E[0];E[0]=MERK; //sortiert lassen
    }
  return ERG12.concat(ERG21);
  }

var SX=SCHNITTPUNKTE(BALKEN1,SCHNITT2);
if (Logflag) Logtext=Logtext+"SCHNITTPUNKTE(BALKEN1,SCHNITT2)="+JSON.stringify(SX)+"\n";

//11
//so, jetzt nur noch RUMPS:
RUMPS=function(OBJ1,OBJ2,BIT) { //Schnittkoerper (OBJ1 and OBJ2)
  //local TRU,ERG,P,PNEU;
  if (Logflag) Logtext=Logtext+"OBJ1="+JSON.stringify(OBJ1)+"\n";
  if (Logflag) Logtext=Logtext+"OBJ2="+JSON.stringify(OBJ2)+"\n";
  var TRU=OBJ1[0].length;
  var ERG=[];
  ERG[0]=OBJ1[0].slice().concat(OBJ2[0]);
  ERG[1]=OBJ1[1].slice().concat(OBJ2[1]);
  if (BIT) ERG[1].push(TNOT);
  ERG[1].push(TAND);  
  ERG[2]=SCHNITTPUNKTE(OBJ1,OBJ2);
  //if (Logflag) alert(8);
  //for (var P of OBJ1[2]) {
  for (var iP in OBJ1[2]) { var P=OBJ1[2][iP];
    if (Logflag) Logtext=Logtext+"OBJ1 P="+JSON.stringify(P)+" drin="+DURCHGUCKER(ERG,P[3])+"\n";
    if (DURCHGUCKER(ERG,P[3])!=3) ERG[2].push(P.slice());
    }
  //for (var P of OBJ2[2]) {
  for (var iP in OBJ2[2]) { var P=OBJ2[2][iP];
    var PNEU=P.slice();
    PNEU[0]=PNEU[0]+TRU;
    PNEU[1]=PNEU[1]+TRU;
    PNEU[2]=PNEU[2]+TRU;
    if (Logflag) Logtext=Logtext+"OBJ2 P="+JSON.stringify(P)+" drin="+DURCHGUCKER(ERG,P[3])+" als PNEU="+JSON.stringify(PNEU)+"\n";
    if (DURCHGUCKER(ERG,P[3])!=3) ERG[2].push(PNEU);
    }
  //if (Logflag) alert(9);
  if (Logflag) Logtext=Logtext+"Punkte="+JSON.stringify(ERG[2])+"\n";
  if (Logflag) for (var i=0;i<ERG[2].length;i++) Logtext=Logtext+"P"+i+"="+JSON.stringify(ERG[2][i])+"\n";

  KFILL(ERG);
  return ERG;
  }

var REST1=RUMPS(BALKEN1,SCHNITT2,0);
if (Logflag) Logtext=Logtext+"RUMPS(BALKEN1,SCHNITT2,0)="+JSON.stringify(REST1)+"\n";
//var REST2=RUMPS(BALKEN1,SCHNITT2,1);
//Logtext=Logtext+"RUMPS(BALKEN1,SCHNITT2,1)="+JSON.stringify(REST2)+"\n";
//var REST3=RUMPS(BALKEN1,SCHNITT3,0);
//Logtext=Logtext+"RUMPS(BALKEN1,SCHNITT3,0)="+JSON.stringify(REST3)+"\n";


//12
var MMULT=function(A,T) {
  var RET=[];
  var s=0;
  for (var i=0;i<A.length;i++) {
    RET[i]=[];
    for (var j=0;j<T.length;j++) {
      s=0;
      for (var k=0;k<A[0].length;k++) {
        s=s+A[i][k]*T[k][j];
        }
      RET[i][j]=s;
      }
    }
  return RET;
  }

if (Logflag) Logtext=Logtext+"MMULT(A,T)=[[8,11],[13,18]]: "+JSON.stringify(MMULT([[1,2],[2,3]],[[2,3],[3,4]]))+"\n";


var TRANSFORM=function(OBJ,A) {
  OBJ[0]=MMULT(OBJ[0],A);
  //for (var P of OBJ[2]) {
  for (var iP in OBJ[2]) { var P=OBJ[2][iP];
    P[3]=EGGT(DREIEBENEN(OBJ[0][P[0]],OBJ[0][P[1]],OBJ[0][P[2]]));
    //if (P[3][3]<0) P[3]=[-P[4]; fi; //ist jetzt EGGT
    }
  //QFILL(OBJ);
  //KFILL(OBJ);
  return OBJ;
  }

var A=[[1,0,0,-5],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
var B=[[1,0,0,5],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

TRANSFORM(REST1,A);

//TRANSFORM(REST1,B);
var ALPHA=0.1;
CDF=[[Math.cos(ALPHA),Math.sin(ALPHA),0,0],[-Math.sin(ALPHA),Math.cos(ALPHA),0,0],[0,0,1,0],[0,0,0,1]];
FDC=[[Math.cos(ALPHA),-Math.sin(ALPHA),0,0],[Math.sin(ALPHA),Math.cos(ALPHA),0,0],[0,0,1,0],[0,0,0,1]];
//TRANSFORM(REST1,CDF);
//TRANSFORM(BALKEN1,CDF);
//TRANSFORM(BALKEN1,CDF);
//TRANSFORM(BALKEN1,FDC);


//13
var PUNKT2D=function(x) {
  return [x[0]+x[1]/2,x[2]+x[1]/2]; 
  }

var KPLOT=function(KLISTE) {
  Logtext=Logtext+'<svg width="400" height="300" stroke="blue">\n';
  //for (var K of KLISTE) {
  for (var iK in KLISTE) { var K=KLISTE[iK];
    //for (var KANTE of K[3]) {
    for (var iKANTE in K[3]) { var KANTE=K[3][iKANTE];
      var P1=PUNKT2D(K[2][KANTE[0]][3]);
      var P2=PUNKT2D(K[2][KANTE[1]][3]);
      //PD=P2-P1;
      //Logtext=Logtext+"KPLOT von "+JSON.stringify(P1)+" nach "+JSON.stringify(P2)+"\n";
      Logtext=Logtext+'<line x1="'+P1[0]+'" y1="'+P1[1]+'" x2="'+P2[0]+'" y2="'+P2[1]+'"/>\n';
      }
    }
  Logtext=Logtext+'</svg>\n';
  }

KPLOT([REST1]);
var REST2=RUMPS(REST1,SCHNITT2,0);
KPLOT([REST2]);

//var BALKEN1=QUADER(200,100,150);
var BALKEN2=QUADER(60,60,60); KFILL(BALKEN2);
var C=[[1,0,0,10],[0,1,0,10],[0,0,1,10],[0,0,0,1]];
TRANSFORM(BALKEN2,C);
var REST3=RUMPS(BALKEN1,BALKEN2,1);
KPLOT([REST3]);
var REST4=RUMPS(REST2,BALKEN2,1);
KPLOT([REST4]);


//var REST4=RUMPS2(REST2,BALKEN1,0,1);
//KPLOT([REST4]);

/*
REST1:=RUMPS(BALKEN1,SCHNITT2,0);
C:=[[1,0,0,-30],[0,1,0,10],[0,0,1,-10],[0,0,0,1]];
TRANSFORM(REST1,C);
KPLOT([REST1]);
REST4:=RUMPS(BALKEN1,REST1,1);
KPLOT([REST4]);

BALKEN2:=StructuralCopy(BALKEN1);
C:=[[1,0,0,-5],[0,1,0,-5],[0,0,1,-5],[0,0,0,1]];
TRANSFORM(BALKEN2,C);
REST5:=RUMPS(BALKEN1,BALKEN2,1);
KPLOT([REST5]);

TRANSFORM(REST4,C);
TRANSFORM(REST4,CDF);
KPLOT([REST4]);

TRANSFORM(BALKEN1,CDF);
KPLOT([BALKEN1]);

ALPHA:=1;
CCDF:=function(ALPHA)
  local RP,IP,Z;
  Z:=E(DenominatorRat(ALPHA))^NumeratorRat(ALPHA);
  RP:=RealPart(Z);
  IP:=ImaginaryPart(Z);
  return [[RP,-IP,0,0],[IP,RP,0,0],[0,0,1,0],[0,0,0,1]];
  end;

TRANSFORM(REST4,CCDF(1/55));
KPLOT([REST4]);
TRANSFORM(REST4,CCDF(-1/55));
KPLOT([REST4]);
TRANSFORM(REST4,CCDF(1/555));
KPLOT([REST4]);
TRANSFORM(REST4,CCDF(-1/555));
KPLOT([REST4]);







#RA
GRENZ1:=QUADER(100,100,500);
SCHEUNE:=QUADER(8000,5500,6700);
DACHVORN:=EBENE([0,0,3500,1],[0,2250,6700,1],[8000,2250,6700,1]);
DACHHINTEN:=EBENE([8000,2250,6700,1],[0,2250,6700,1],[0,5500,3500,1]);
SCHEUNE:=RUMPS(SCHEUNE,DACHVORN,0);
SCHEUNE:=RUMPS(SCHEUNE,DACHHINTEN,0);
VERSCHIEB(SCHEUNE,3650,1070,-1500);
*/

Logtext=Logtext+"...KONSTRUK_javascript.js soweit geladen\n";

}
