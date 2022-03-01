if (1==1) {
//Veränderungen zu GAP:
//1.PGGT ohne /-P[3]
//in KFILL if (PZZS[2*PNR][1]<=PZZS[2*PNR+1][1])
//in TFIND if (Math.abs(A)<0.00001) return 2; //Rand
//ok neues EGGT normalisiert und gerichtet, bisheriges EGGT ist jetzt PGGT.
//..
//sonst zu machen noch:
//.. in svg-KPLOT noch width und height anpassen
//.. überflüssige Ebenen entfernen
//ok warum in KFILL das if drinbeiben muss, ok ist raus
//.. wie es zu dem U==[0,0,0,0] kommt, parrallel vielleicht?
//.. bei AUFDERKANTE muß wohl ein AUFDERFLAECHE auch mit dazu
//.. wenn sich mehr als 3 Ebenen in einem Punkt schneiden ist nur behelfsweise gelöst
//.. Keil auch nur behelfsmäßig in GERADEXEBENE, bis jetzt nur 2 Ebenen
//.. doppeltes TEbeneASD() vermeiden
//.. und fast übereinanderliegende Ebenen zusammenfassen

Logtext="";
Logflag=false;
Logtext=Logtext+"KONSTRUK_javascript.js laden...\n";
var Testflag=false;

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
  //außerdem, wenn IL gegeben ist, nur die Ebenen in IL auswerten
  //local X,Y,T,ETNR;
  if (P[0]==0&P[1]==0&P[2]==0&P[3]==0) return 3;
  var X=0;
  var Y=0;
  var ETNR=0; //ETNR für ETADR
  for (var i in OBJ[1]) { var T=OBJ[1][i]
  //for (var T of OBJ[1]) { 
    //alert("TFIND\n"+OBJ+"\n"+ETNR+"\n"+P+"\n"+TFIND(OBJ,ETNR,P));
    if (T==TEBN) { STAPEL.push(X); X=TFIND(OBJ,ETNR,P); ETNR=ETNR+1 }
    if (T==TAND) X=Math.max(X,STAPEL.pop());
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
var PGGT=function(E) { //kürzt Punktkoordinaten, gemeinsame Faktoren herausdividieren
  if (E[3]<0) return [E[0]/E[3],E[1]/E[3],E[2]/E[3],1];
  if (E[3]==0) return E;
  if (E[3]>0) return [E[0]/E[3],E[1]/E[3],E[2]/E[3],1];
  }
//alert("PGGT 2.5,2,1.5,1 "+PGGT([10,8,6,4]));
	
var EGGT=function(E) { //kürzt Ebenengleichung, gemeinsame Faktoren herausdividieren
  var len=Math.sqrt(E[0]*E[0]+E[1]*E[1]+E[2]*E[2]);
  return [E[0]/len,E[1]/len,E[2]/len,E[3]/len];
  }
//alert("PGGT 2.5,2,1.5,1 "+PGGT([10,8,6,4]));
	
//4
var Determinant3=function(A) {
  return A[0][0]*A[1][1]*A[2][2]+A[0][1]*A[1][2]*A[2][0]+A[0][2]*A[1][0]*A[2][1]
        -A[0][0]*A[2][1]*A[1][2]-A[0][1]*A[1][0]*A[2][2]-A[0][2]*A[1][1]*A[2][0];
  }
//alert("Determinant -3 "+Determinant3([[1,2,3],[2,3,3],[3,3,3]]));

var DREIEBENEN=function(E1,E2,E3) { //Schnittpunkt dreier Ebenen
  var RET=PGGT([
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

var DREIPUNKTE=function(E1,E2,E3) { //Ebene durch drei Punkte
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

//5
var EBENE=function(P1,P2,P3) { //Objekt Ebene durch drei Punkte P1, P2, P3,
  return [[DREIPUNKTE(P1,P2,P3)],[TEBN],[],[]];
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
    if (P[5]) ; else P[5]=[P[0],P[1],P[2]];
    for (var i=1; i<P[5].length;i++) for (var j=0;j<i;j++) if (MERK12.indexOf("["+[P[5][j],P[5][i]]+"]")==-1) {
      MERK12.push("["+[P[5][j],P[5][i]]+"]");
      var M=[P[5][j],P[5][i]];
      if (j==0&&i==1) M.push(P[5][2]);
      if (j==0&&i>1) M.push(P[5][1]);
      if (j>0) M.push(P[5][0]);
      MERK.push(M);
      }
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
    for (var PNR=0;PNR<OBJ[2].length;PNR++) {
      var P=OBJ[2][PNR];//alert(PNR);
      if (P[5]) ; else P[5]=[P[0],P[1],P[2]];
      for (var i=0; i<P[5].length;i++) for (var j=0;j<i;j++) 
        if (M[0]==P[5][i]&M[1]==P[5][j]||M[1]==P[5][i]&M[0]==P[5][j]) {
          if (j==0&&i==1) PZZT.push([PUNKTWERT(OBJ[0][M[2]],P[3]),PNR,P[5][2]]);
          if (j==0&&i>1) PZZT.push([PUNKTWERT(OBJ[0][M[2]],P[3]),PNR,P[5][1]]);
          if (j>0) PZZT.push([PUNKTWERT(OBJ[0][M[2]],P[3]),PNR,P[5][0]]);
          }
      }
    var PZZS=PZZT.sort(Asort);
    //var PZZR=[PZZS[0]];
    //for (var i=1;i<PZZS.length;i++) if (PZZS[i][0]-PZZS[i-1][0]>=0.0001) PZZR.push(PZZS[i]);
    //PZZS=PZZR;
//    if (Logflag) alert("PZZS="+JSON.stringify(PZZS));
//    if (PZZS.length%2==1) alert("PZZS.length ist ungerade");
    if (Logflag) Logtext=Logtext+"  "+PZZS.length+" PZZS="+JSON.stringify(PZZS)+"\n";
//    for (var PNR=0;PNR<(PZZS.length-1)/2;PNR++) /*if (PZZS[2*PNR][1]<=PZZS[2*PNR+1][1])*/ { //warum geht ohne if nicht?
//      if (Logflag) Logtext=Logtext+"    neue Kante von Punkt P"+PZZS[2*PNR][1]+" bis Punkt P"+PZZS[2*PNR+1][1]+" entlang der Schnittgeraden von Ebene E"+M[0]+" und Ebene E"+M[1]+"\n";
//      OBJ[3].push([PZZS[2*PNR][1],PZZS[2*PNR+1][1],M[0],M[1],PZZS[2*PNR][2],PZZS[2*PNR+1][2]]);
//      }
    for (var PNR=1;PNR<PZZS.length;PNR++) {
      var PNT=[
    (OBJ[2][PZZS[PNR][1]][3][0]+OBJ[2][PZZS[PNR-1][1]][3][0])/2,
    (OBJ[2][PZZS[PNR][1]][3][1]+OBJ[2][PZZS[PNR-1][1]][3][1])/2,
    (OBJ[2][PZZS[PNR][1]][3][2]+OBJ[2][PZZS[PNR-1][1]][3][2])/2,
    1];
      var DU=DURCHGUCKER(OBJ,PNT);
      if (Logflag) Logtext=Logtext+"    PNT=["+PNT+"] DU="+DU+"\n";
      if (DU==2) {
        if (Logflag) Logtext=Logtext+"    neue Kante von Punkt P"+PZZS[PNR-1][1]+" bis Punkt P"+PZZS[PNR][1]+" entlang der Schnittgeraden von Ebene E"+M[0]+" und Ebene E"+M[1]+"\n";
        OBJ[3].push([PZZS[PNR-1][1],PZZS[PNR][1],M[0],M[1],PZZS[PNR-1][2],PZZS[PNR][2]]);
        }
      }
    }
  }
      
KFILL(BALKEN1);
//Logtext=Logtext+JSON.stringify(BALKEN1[0])+"\n";
//Logtext=Logtext+JSON.stringify(BALKEN1[2])+"\n";
if (Logflag) Logtext=Logtext+"Kanten [Punkt1,Punkt2,Ebene1,Ebene2]: "+JSON.stringify(BALKEN1[3])+"\n";

//9
var GERADEXEBENE=function(OBJ1,OBJ2) { //Schnittpunkte der Kanten von OBJ1 mit Ebenen von OBJ2
  //local U,V,W,KANTE,EBENE,ERG,ENR;
  var ERG=[];
  //for (var KANTE of OBJ1[3]) {
  if (OBJ1[0].length==2) {//Keil
    for (var ENR=0;ENR<OBJ2[0].length;ENR++) {
      if (Logflag) Logtext=Logtext+"Kante k"+0+"="+JSON.stringify("...")+" und Ebene e"+JSON.stringify(ENR)+" ";
      var U=DREIEBENEN(OBJ1[0][0],OBJ1[0][1],OBJ2[0][ENR]);
      if (Logflag) Logtext=Logtext+"Schnittpunkt in "+JSON.stringify(U)+" ";
      var W=DURCHGUCKER(OBJ2,U);
      if (Logflag) Logtext=Logtext+"W="+W+" ";
      if (W==2&&Math.abs(U[3])>0.0001) {
        ERG.push([0,1,ENR,U]);
        if (Logflag) Logtext=Logtext+"♥ drin" 
        } else if (Logflag) Logtext=Logtext+"draußen";
      if (Logflag) Logtext=Logtext+"\n";      
      }
    
    }
  for (var iKANTE in OBJ1[3]) { var KANTE=OBJ1[3][iKANTE]
    for (var ENR=0;ENR<OBJ2[0].length;ENR++) { //hier ginge auch in OBJ2[1], ENR nur wegen Print
      if (Logflag) Logtext=Logtext+"Kante k"+iKANTE+"="+JSON.stringify(KANTE)+" und Ebene e"+JSON.stringify(ENR)+" ";
      var U=DREIEBENEN(OBJ1[0][KANTE[2]],OBJ1[0][KANTE[3]],OBJ2[0][ENR]);
      //if U[4]<0 then U:=-U; fi;// ist jetzt PGGT
      if (Math.abs(U[3])<0.0001) {if (Logflag) Logtext=Logtext+"parallel\n"; continue}
      if (Logflag) Logtext=Logtext+"Schnittpunkt in "+JSON.stringify(U)+" ";
      var V=3;
      //var V=DURCHGUCKER(OBJ1,U);
      //var V=DURCHGUCKER(OBJ1,U,[KANTE[3],KANTE[4]]);
      //var F=DURCHGUCKER(OBJ1,U,[KANTE[4],KANTE[5]]);
      //if (Logflag) Logtext=Logtext+"IL=["+[KANTE[4],KANTE[5]]+"] F="+F+" ";
      if ((TFIND(OBJ1,KANTE[4],U)+TFIND(OBJ1,KANTE[4],OBJ1[2][KANTE[1]][3])!=4)&(TFIND(OBJ1,KANTE[5],U)+TFIND(OBJ1,KANTE[5],OBJ1[2][KANTE[0]][3])!=4)) V=2;
      if (Logflag) Logtext=Logtext+"V="+V+" ";
      var W=DURCHGUCKER(OBJ2,U);
      if (Logflag) Logtext=Logtext+"W="+W+" ";
      if ((V==2)&(W==2)) {
      //if ((F<3)&(W==2)) {
        ERG.push([KANTE[2],KANTE[3],ENR,U]);
        if (Logflag) Logtext=Logtext+"♥ drin" 
        } else if (Logflag) Logtext=Logtext+"draußen";
      //if ((F<3)&(V==3)) if (Logflag) Logtext=Logtext+"----------";
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

//10a KDUMP
var markObj=function(cmin,ekp,i,value) {
  alert([cmin,ekp,i,value].join("+"));
  }
var spanObj=function(cmin,ekp,i,value) {
  var ret='<span onclick="markObj('+cmin+','+ekp+','+i+','+value+')">'+"ekp"[ekp]+i+"="+value+"</span>";
  return ret;
  }

//cmin ist globale Variable in MIT_KONSTRUK_FF.html
var KDUMP=function(OBJ) {
  Logtext=Logtext+"  Ebenen: ei=[nx,ny,nz,w]\n";
  for (var i in OBJ[0]) Logtext=Logtext+"    "+spanObj(cmin,0,i,JSON.stringify(OBJ[0][i]))+"\n";
  Logtext=Logtext+"  Verknüpfung: T="+JSON.stringify(OBJ[1])+"\n";
  Logtext=Logtext+"  Punkte pi=[ei,ej,ek,[x,y,z,1]]:\n";
  for (var i in OBJ[2]) Logtext=Logtext+"    "+spanObj(cmin,2,i,JSON.stringify(OBJ[2][i]))+"\n";
  Logtext=Logtext+"  Kanten ki=[pi,pj,ek,el,evon,ebis]:\n";
  for (var i in OBJ[3]) Logtext=Logtext+"    "+spanObj(cmin,1,i,JSON.stringify(OBJ[3][i]))+"\n";
  }

//vor 11 RUMPS:
var dist=function(A,B) { return Math.sqrt((A[0]-B[0])*(A[0]-B[0])+(A[1]-B[1])*(A[1]-B[1])+(A[2]-B[2])*(A[2]-B[2])) }
var dist4=function(A,B) { return Math.sqrt((A[0]-B[0])*(A[0]-B[0])+(A[1]-B[1])*(A[1]-B[1])+(A[2]-B[2])*(A[2]-B[2])+(A[3]-B[3])*(A[3]-B[3])) }
var dist4M=function(A,B) { return Math.sqrt((A[0]+B[0])*(A[0]+B[0])+(A[1]+B[1])*(A[1]+B[1])+(A[2]+B[2])*(A[2]+B[2])+(A[3]+B[3])*(A[3]+B[3])) }

var KEBN=function(OBJ) { //fast gleiche Ebenen finden
  var E=OBJ[0];
  for (var i=0;i<E.length;i++) {
    E[i][4]=i;
    for (var j=0;j<i;j++) {
      if (dist4(E[i],E[i-j-1])<0.0001) E[i][4]=i-j-1;
      if (dist4M(E[i],E[i-j-1])<0.0001) E[i][4]=-(i-j-1)-1;
      }
    }
  }

var KPBN=function(OBJ) { //Ebenen aus Punkten entfernen
  var E=OBJ[0];
  var P=OBJ[2];
  for (var i=0;i<P.length;i++) { var p=P[i];
    var p5neu=[];
    for (var j=0;j<p[5].length;j++) {
      if (p5neu.indexOf(E[p[5][j]][4])==-1) p5neu.push(E[p[5][j]][4]);
      }
    p[5]=p5neu;
    }  
  }

var KASPflag=false;
var KASP=function(OBJ) {//KASP fasst nahe Punkte zusammen:
  var P=OBJ[2];
  if (KASPflag) alert("P="+P.join("\n"));
  for (var i=0;i<P.length;i++) {
    var imin=i;
    P[imin][4]=[];
    if (P[i][5]) ; else P[i][5]=[P[i][0],P[i][1],P[i][2]];
    for (var j=i;j>=0;j--) if (dist(P[j][3],P[i][3])<0.001) imin=j;
    P[imin][4].push(i);
    }
  var Pneu=[];
  for (var i=0;i<P.length;i++) if (P[i][4].length>0) Pneu.push(P[i]);
  //for (var i=0;i<P.length;i++) if ((P[i][4].length%2)!=0) Pneu.push(P[i]);
  var Q=[];
  for (var i=0;i<Pneu.length;i++) for (var j=0;j<Pneu[i][4].length;j++) Q[Pneu[i][4][j]]=i;
  for (var i=0;i<Pneu.length;i++) { //alle bisherigen bestimmenden Ebenen sammeln
    var EL=[]; //Ebenenliste
    for (var j=0;j<Pneu[i][4].length;j++) {
      var PJ=P[Pneu[i][4][j]];//alert(P[5]);
      for (var k=0;k<PJ[5].length;k++) if (EL.indexOf(PJ[5][k])==-1) EL.push(PJ[5][k]);
      }
    //delete Pneu[i][4];
    Pneu[i][5]=EL;
    }
  OBJ[2]=Pneu;
  }

var KANZflag=false;
var KANZ=function(OBJ) {//KASP fasst gleiche Kanten zusammen:
  var P=OBJ[2];
  var K=OBJ[3];
  if (KANZflag) alert("P="+P.join("\n"));
  if (KANZflag) alert("K="+K.join("\n"));
  var Q=[];
  for (var i=0;i<K.length;i++) {
    var imin=i;
    K[imin][6]=[];
    if (K[i][7]) ; else K[i][7]=[K[i][2],K[i][3]];
    for (var j=i;j>=0;j--) if (K[j][0]==K[i][0]&&K[j][1]==K[i][1]||K[j][0]==K[i][1]&&K[j][1]==K[i][0]) imin=j;
    K[imin][6].push(i);
    if (K[imin][7].indexOf(K[i][2])==-1) K[imin][7].push(K[i][2]);
    if (K[imin][7].indexOf(K[i][3])==-1) K[imin][7].push(K[i][3]);
    }
  var KNEU=[];
  for (var i=0;i<K.length;i++) if (K[i][6].length>0&&K[i][0]!=K[i][1]) KNEU.push(K[i].slice());
  OBJ[3]=KNEU;
  for (var i=0;i<OBJ[3].length;i++) {
    delete OBJ[3][i][6];
    OBJ[3][i][7]=OBJ[3][i][7].slice();
    }
  }

//KRED reduziert die Anzahl der Ebenen:
var KRED=function(OBJ) {
  //if (Logflag==true) alert("Hier geht KRED los");
  if (Logflag==true) Logtext=Logtext+"\n\n\nKRED:\n"+OBJ[3].join("\n");
  var verwendet=[];
  var KANTEN=OBJ[3];
  for (var i=0;i<OBJ[2].length;i++) {
    var x=OBJ[2][i];
    //die von P ausgehenden Kanten bestimmen
    var P=OBJ[2][i];
    var KK=[]
    for (var j=0;j<KANTEN.length;j++) if (KANTEN[j][0]==i||KANTEN[j][1]==i) KK.push(j);
    var KKK=[];      
    for (var j=0;j<KK.length;j++) KKK=KKK.concat(KANTEN[KK[j]][7]);
    for (var j=0;j<KKK.length;j++) if (KKK.indexOf(KKK[j],j+1)>-1) verwendet[KKK[j]]=1;
    }
  var T1neu=OBJ[1].slice();
  var sum=0;
  var vsum=0;
  while (sum<OBJ[0].length) {
    while(T1neu[vsum]!=1) vsum=vsum+1;
    if (verwendet[sum]) ; else T1neu[vsum]=0;
    vsum=vsum+1;
    sum=sum+1;
    }
  var Stapel=[];
  var T2neu=[];
  for (var i=0;i<T1neu.length;i++) {
    if (T1neu[i]==0) Stapel.push(0);
    if (T1neu[i]==1) {Stapel.push(1);T2neu.push(1)}
    if (T1neu[i]==3) if (Stapel.pop()==1) {Stapel.push(1);T2neu.push(3)} else Stapel.push(0);
    if (T1neu[i]==2) if (Stapel.pop()==1) if (Stapel.pop()==1) {Stapel.push(1);T2neu.push(2)} else Stapel.push(1);
    }
  OBJ[1]=T2neu;
  var sum=0;
  for (var i=0;i<OBJ[0].length;i++) if (verwendet[i]) {
    OBJ[0][sum]=OBJ[0][i];
    verwendet[i]=sum; 
    sum=sum+1;
    }
  OBJ[0]=OBJ[0].slice(0,sum);
  for (var i=0;i<OBJ[2].length;i++) {
    var x=OBJ[2][i];
//kann raus dann:
    if (verwendet[x[0]]) x[0]=verwendet[x[0]];
    if (verwendet[x[1]]) x[1]=verwendet[x[1]];
    if (verwendet[x[2]]) x[2]=verwendet[x[2]];
    if (x[5]) ; else alert("kein x[5]");
    var xneu=[];
    for (var j=0;j<x[5].length;j++) if (verwendet[x[5][j]]>-1) xneu.push(verwendet[x[5][j]]);
    x[5]=xneu.slice();
    x[0]=x[5][0];
    x[1]=x[5][1];
    x[2]=x[5][2];
    }
  for (var i=0;i<OBJ[3].length;i++) {
    var x=OBJ[3][i];
    if (x[7]) ; else alert("kein x[7]");
    var xneu=[];
    for (var j=0;j<x[7].length;j++) if (verwendet[x[7][j]]>-1) xneu.push(verwendet[x[7][j]]);
    x[7]=xneu;
    x[2]=x[7][0];
    x[3]=x[7][1];
    for (var j=0;j<3;j++) {
      if (x[7].indexOf(OBJ[2][x[0]][j])==-1) x[4]=OBJ[2][x[0]][j];
      if (x[7].indexOf(OBJ[2][x[1]][j])==-1) x[5]=OBJ[2][x[1]][j];
      }
    }
  }

var KENT=function(OBJ) { //Entgraten
  var E=OBJ[0];
  var P=OBJ[2];
  var K=OBJ[3]; 
  var G=[]; //Gratpunkte
  for (var i=0;i<P.length;i++) { //alle Punkte
    var D=[]; //Durchschnittsmenge
    for (var k=0;k<E.length;k++) D.push(k);
    for (var j=0;j<K.length;j++) { //alle Kanten
      if (K[j][0]==i||K[j][1]==i) { //wenn K[j] von P[i] ausgeht
        var Dneu=[]; //neuer Durchschnitt
        for (var k=0;k<K[j][7].length;k++) if (D.indexOf(K[j][7][k])>-1) Dneu.push(K[j][7][k]);
        D=Dneu;
//  if (Logflag==true) alert("Dneu=["+Dneu+"]\n");
        }
      }
    if (Dneu.length>0) G.push(i);
    }
  //if (Logflag==true) alert("Entgraten:\nGratpunkte=["+G+"]\n");
  //jetzt die Gratpunkte entfernen
  var PNEU=[];
  for (var i=0;i<P.length;i++) if (G.indexOf(i)==-1) PNEU.push(P[i].slice());
  OBJ[2]=PNEU;
  //und Kanten neu bestimmen
  //OBJ[3]=[];
  if (Logflag) Logtext=Logtext+"zweites KFILL beendet mit "+DURCHGUCKER(OBJ,[107.5,100,50,1])+"\n";
  }

//11
//so, jetzt nur noch RUMPS:
var RUMPS=function(OBJ1,OBJ2,BIT) { //Schnittkoerper (OBJ1 and OBJ2)
  //local TRU,ERG,P,PNEU;
  if (Logflag) Logtext=Logtext+"OBJ1=\n";
  if (Logflag) KDUMP(OBJ1);
  if (Logflag) Logtext=Logtext+"OBJ2=\n";
  if (Logflag) KDUMP(OBJ2);
  
  //if (Logflag) Logtext=Logtext+"OBJ2="+JSON.stringify(OBJ2)+"\n";
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
    if (PNEU[5]) ; else PNEU[5]=[PNEU[0],PNEU[1],PNEU[2]];
    PNEU[5]=PNEU[5].slice();
    PNEU[0]=PNEU[0]+TRU;
    PNEU[1]=PNEU[1]+TRU;
    PNEU[2]=PNEU[2]+TRU;
    for (var i=0;i<PNEU[5].length;i++) PNEU[5][i]=PNEU[5][i]+TRU;
    if (Logflag) Logtext=Logtext+"OBJ2 P="+JSON.stringify(P)+" drin="+DURCHGUCKER(ERG,P[3])+" als PNEU="+JSON.stringify(PNEU)+"\n";
    if (DURCHGUCKER(ERG,P[3])!=3) ERG[2].push(PNEU);
    }
  //if (Logflag) alert(9);
  if (Logflag) Logtext=Logtext+"Punkte="+JSON.stringify(ERG[2])+"\n";
  if (Logflag) for (var i=0;i<ERG[2].length;i++) Logtext=Logtext+"P"+i+"="+JSON.stringify(ERG[2][i])+"\n";

  KEBN(ERG); //gleiche Ebenen bestimmen
  KASP(ERG); //gleiche Punkte zusammenfassen
  KPBN(ERG); //Ebenen aus Punkten entfernen
  KFILL(ERG);
  KANZ(ERG); //gleiche Kanten zusammenfassen
  //KRED(ERG); Ebenen selbst entfernen nicht mehr
  KENT(ERG); //Entgraten
  KFILL(ERG);
  KANZ(ERG);
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
      for (var k=0;k<4/*A[0].length*/;k++) {//vorübergehend nur k=0,2,3 wegen KEBN()
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
    P[3]=PGGT(DREIEBENEN(OBJ[0][P[0]],OBJ[0][P[1]],OBJ[0][P[2]]));
    //if (P[3][3]<0) P[3]=[-P[4]; fi; //ist jetzt PGGT
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

var KPLOTtext="";
var KPLOT=function(KLISTE) {
  //for (var K of KLISTE) {
  KPLOTtext="";
  var xmin=Infinity;
  var xmax=-Infinity;
  var ymin=Infinity;
  var ymax=-Infinity;
  for (var iK in KLISTE) { var K=KLISTE[iK];
    //for (var KANTE of K[3]) {
    for (var iKANTE in K[3]) { var KANTE=K[3][iKANTE];
      var P1=PUNKT2D(K[2][KANTE[0]][3]);
      var P2=PUNKT2D(K[2][KANTE[1]][3]);
      xmin=Math.min(xmin,P1[0],P2[0]);
      xmax=Math.max(xmax,P1[0],P2[0]);
      ymin=Math.min(ymin,P1[1],P2[1]);
      ymax=Math.max(ymax,P1[1],P2[1]);
      //PD=P2-P1;
      //Logtext=Logtext+"KPLOT von "+JSON.stringify(P1)+" nach "+JSON.stringify(P2)+"\n";
      KPLOTtext=KPLOTtext+'<line x1="'+P1[0]+'" y1="'+P1[1]+'" x2="'+P2[0]+'" y2="'+P2[1]+'"/>\n';
      }
    }
  KPLOTtext='<svg width="100%" height="400" viewBox="'+xmin+" "+ymin+" "+(xmax-xmin)+" "+(ymax-ymin)+'" stroke="blue">\n'+KPLOTtext;
  KPLOTtext=KPLOTtext+'<path id="Eiderdaus" d="M0,0 L40,0 L40,40 Z" fill="orange" fill-rule="evenodd" stroke="none"/></svg>\n';
  }

if (Logflag) KPLOT([REST1]);
var REST2=RUMPS(REST1,SCHNITT2,0);
if (Logflag) KPLOT([REST2]);

//var BALKEN1=QUADER(200,100,150);
var BALKEN2=QUADER(60,60,60); KFILL(BALKEN2);
var C=[[1,0,0,10],[0,1,0,10],[0,0,1,10],[0,0,0,1]];
TRANSFORM(BALKEN2,C);
var REST3=RUMPS(BALKEN1,BALKEN2,1);
if (Logflag) KPLOT([REST3]);
var REST4=RUMPS(REST2,BALKEN2,1);
if (Logflag) KPLOT([REST4]);


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
