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
  if (Math.abs(A)<0.000005) return 2; //Rand
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
//      if (j==0&&i==1) M.push(P[5][2]);
//      if (j==0&&i>1) M.push(P[5][1]);
//      if (j>0) M.push(P[5][0]);
      let weiter_suchen=true;
      for (let kk=0;kk<P[5].length;kk++) if (weiter_suchen) {
        let punkt=DREIEBENEN(OBJ[0][M[0]],OBJ[0][M[1]],OBJ[0][P[5][kk]]);
        if (kk!=i&&kk!=j&&punkt[3]>0.5) {//nochmal ohne kk!=j&&kk!=i schauen warum da bei j==0 i==1 kk==0 punkt[3]==1 ist
          M.push(P[5][kk]);
          weiter_suchen=false;
          if (M[2]==M[0]) alert(M+'\n'+punkt+'\n'+P[5]+'\n'+[j,i,kk]);
          }
        }
      if (M.length>2) MERK.push(M); //wie kann hier M.length==2 sein? Bei NUT_UND_FEDER
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
  if (Logflag) Logtext=Logtext+"starte KFILL(OBJ)\n";
//  if (Logflag) alert("starte KFILL(OBJ)\n");
//  if (Logflag) OBJ[2][0][5]=[4,10,15,16];//bei NUT_UND_FEDER_defekt♥
  if (Logflag) KDUMP(OBJ);
  for (let ii=0;ii<OBJ[2].length;ii++) {
    let P=OBJ[2][ii];
    if (P[6]&&P[6].length>0) {
      for (jj=0;jj<P[6].length;jj++) {
        if (P[5].indexOf(P[6][jj])==-1) P[5].push(P[6][jj]);
        }
      P[5]=P[5].sort(Zsort);//war zwischendurch .slice().sort(Zsort)
      }
    //delete P[6];
    }
  //local M,PNR,PZZS,PZZT;
//  if (Logflag) alert("starte DFILL(OBJ)\n");
  DFILL(OBJ);
  if (Logflag) Logtext=Logtext+'MERK=\n'+MERK.join('\n')+'\n';
//  if (Logflag) alert('MERK=\n'+MERK.join('\n')+'\n');
  if (Logflag) Logtext=Logtext+'MERK12=\n'+MERK12.join('\n')+'\n';
//  if (Logflag) alert('MERK12=\n'+MERK12.join('\n'));
  OBJ[3]=[];
  //for (var M of MERK) {
  for (var iM in MERK) { var M=MERK[iM];
    if (Logflag) Logtext=Logtext+"Kantenfluchtlinie "+M+"\n";
    var PZZT=[];
    for (var PNR=0;PNR<OBJ[2].length;PNR++) {
      var P=OBJ[2][PNR];//alert(PNR);
//      if (Logflag) alert(iM+" "+MERK.length+" Kantenfluchtlinie "+JSON.stringify(M)+' PNR='+PNR+';\nP='+JSON.stringify(P));
      if (P[5]) ; else P[5]=[P[0],P[1],P[2]];
      for (var i=0; i<P[5].length;i++) for (var j=0;j<i;j++) 
        if ((M[0]==P[5][i]&&M[1]==P[5][j])||(M[1]==P[5][i]&&M[0]==P[5][j])) {
          if (j==0&&i==1) PZZT.push([PUNKTWERT(OBJ[0][M[2]],P[3]),PNR,P[5][2],P[5]]);
          if (j==0&&i>1) PZZT.push([PUNKTWERT(OBJ[0][M[2]],P[3]),PNR,P[5][1],P[5]]);
          if (j>0) PZZT.push([PUNKTWERT(OBJ[0][M[2]],P[3]),PNR,P[5][0],P[5]]);
          }
      }
    var PZZS=PZZT.sort(Asort);
//    if (Logflag) alert("PZZS="+JSON.stringify(PZZS));
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
  if (Logflag) KDUMP(OBJ);
  if (Logflag) Logtext=Logtext+"return aus KFILL(OBJ)\n";
  }
      
KFILL(BALKEN1);
//Logtext=Logtext+JSON.stringify(BALKEN1[0])+"\n";
//Logtext=Logtext+JSON.stringify(BALKEN1[2])+"\n";
if (Logflag) Logtext=Logtext+"Kanten [Punkt1,Punkt2,Ebene1,Ebene2]: "+JSON.stringify(BALKEN1[3])+"\n";

//9
var dist=function(A,B) { return Math.sqrt((A[0]-B[0])*(A[0]-B[0])+(A[1]-B[1])*(A[1]-B[1])+(A[2]-B[2])*(A[2]-B[2])) }//war vor 11
var dist4=function(A,B) { return Math.sqrt((A[0]-B[0])*(A[0]-B[0])+(A[1]-B[1])*(A[1]-B[1])+(A[2]-B[2])*(A[2]-B[2])+(A[3]-B[3])*(A[3]-B[3])) }
var dist4M=function(A,B) { return Math.sqrt((A[0]+B[0])*(A[0]+B[0])+(A[1]+B[1])*(A[1]+B[1])+(A[2]+B[2])*(A[2]+B[2])+(A[3]+B[3])*(A[3]+B[3])) }

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
        ERG.push([0,1,ENR,U,,,[0,1]]);//[0,1]
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
//      if ((TFIND(OBJ1,KANTE[4],U)+TFIND(OBJ1,KANTE[4],OBJ1[2][KANTE[1]][3])!=4)&(TFIND(OBJ1,KANTE[5],U)+TFIND(OBJ1,KANTE[5],OBJ1[2][KANTE[0]][3])!=4)) V=2; //ging nicht mehr in Beispiel "Flächen" weil KANTE[4] und KANTE[5] nicht stimmt, jetzt mit udist4
      if ((dist4(U,OBJ1[2][KANTE[1]][3])<=dist4(OBJ1[2][KANTE[0]][3],OBJ1[2][KANTE[1]][3])+0.00001)&&(dist4(U,OBJ1[2][KANTE[0]][3])<=dist4(OBJ1[2][KANTE[0]][3],OBJ1[2][KANTE[1]][3])+0.00001)) V=2;
      if (Logflag) Logtext=Logtext+"V="+V+" ";
      var W=DURCHGUCKER(OBJ2,U);
      if (Logflag) Logtext=Logtext+"W="+W+" ";
      if ((V==2)&(W==2)) {
      //if ((F<3)&(W==2)) {
        let KX=[];
        //if (KANTE[7]) KX=KANTE[7].slice();
        let KY1=OBJ1[2][KANTE[0]][5];
        let KY2=OBJ1[2][KANTE[1]][5];
        for (let j=0;j<KY1.length;j++) if (KY2.indexOf(KY1[j])>-1) KX.push(KY1[j]);
        ERG.push([KANTE[2],KANTE[3],ENR,U,,,KX]);
        if (Logflag) Logtext=Logtext+"♥ drin mit ["+KY1+']&cap;['+KY2+']=['+KX+']';
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
  for (var iE in ERG12) { var E=ERG12[iE]; E[2]=E[2]+TRU; if (E[6].length) E[6].push(E[2])}
  if (Logflag) Logtext=Logtext+"ERG12 "+JSON.stringify(ERG12)+"\n";
  if (Logflag) Logtext=Logtext+"GERADEXEBENE(OBJ2,OBJ1) "+JSON.stringify(TRU)+"\n";
  var ERG21=GERADEXEBENE(OBJ2,OBJ1);
  if (Logflag) Logtext=Logtext+"ERG21 "+JSON.stringify(ERG21)+"\n";
  //for (var E of ERG21) { 
  for (var iE in ERG21) { var E=ERG21[iE];
    E[0]=E[0]+TRU; E[1]=E[1]+TRU; if (E[6].length) {for (let ii=0;ii<E[6].length;ii++) E[6][ii]=E[6][ii]+TRU; E[6].push(E[2])}
    var MERK=E[2];E[2]=E[1];E[1]=E[0];E[0]=MERK; //sortiert lassen
    }
  if (Logflag) Logtext=Logtext+"ERG12+21 "+JSON.stringify(ERG12.concat(ERG21))+"\n";
  return ERG12.concat(ERG21);
  }

var SX=SCHNITTPUNKTE(BALKEN1,SCHNITT2);
if (Logflag) Logtext=Logtext+"SCHNITTPUNKTE(BALKEN1,SCHNITT2)="+JSON.stringify(SX)+"\n";

//10a KDUMP
var markObj=function(cmin,ekp,i,value) {
  alert([cmin,ekp,i,value].join("+"));
  }
var spanObj=function(cmin,ekp,i,value) {
  var ret='<span onclick="markObj('+cmin+','+ekp+','+i+','+value+')">'+"etpk"[ekp]+i+"="+value+"</span>";
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
  for (var i in OBJ[3]) Logtext=Logtext+"    "+spanObj(cmin,3,i,JSON.stringify(OBJ[3][i]))+"\n";
  }

//vor 11 RUMPS:
var KEBN=function(OBJ) { //fast gleiche Ebenen finden
  var E=OBJ[0];
  for (var i=0;i<E.length;i++) {
    E[i][4]=i;
    for (var j=0;j<i;j++) {
      if (dist4(E[i],E[i-j-1])<0.0001) E[i][4]=i-j-1;
      if (dist4M(E[i],E[i-j-1])<0.0001) E[i][4]=i-j-1;//-(i-j-1)-1;
      }
    }
  }

var KASP=function(OBJ) {//KASP fasst nahe Punkte zusammen:
  var E=OBJ[0];
  var P=OBJ[2];
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
  //var Q=[];
  //for (var i=0;i<Pneu.length;i++) for (var j=0;j<Pneu[i][4].length;j++) Q[Pneu[i][4][j]]=i;
  for (var i=0;i<Pneu.length;i++) { //alle bisherigen bestimmenden Ebenen sammeln
    var EL=[]; //Ebenenliste
    for (var j=0;j<Pneu[i][4].length;j++) {
      var PJ=P[Pneu[i][4][j]];//alert(P[5]);
      for (var k=0;k<PJ[5].length;k++) if (EL.indexOf(PJ[5][k])==-1) EL.push(PJ[5][k]);
      }
    //delete Pneu[i][4];
    Pneu[i][5]=EL;
    }
  for (var i=0;i<Pneu.length;i++) { var p=Pneu[i]; //fast gleiche Ebenen zusammenfassen
    var p5neu=[];
    for (var j=0;j<p[5].length;j++) {
      if (p5neu.indexOf(E[p[5][j]][4])==-1) p5neu.push(E[p[5][j]][4]);
      }
    p[5]=p5neu;
    }  
  for (var i=0;i<Pneu.length;i++) { //die besten Ebenen für P[i][0..2] herauspicken
    Pneu[i][5]=Pneu[i][5].sort(Zsort); //vorerst die vor dem Schneiden soweit möglich 
    Pneu[i][0]=Pneu[i][5][0];
    Pneu[i][1]=Pneu[i][5][1];
    Pneu[i][2]=Pneu[i][5][2];
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

/* nur aufheben:
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
*/

/* auch aufheben:
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
*/

var MADD=function(p1,p2) {return [p1[0]+p2[0],p1[1]+p2[1],p1[2]+p2[2],1]}

var MSCAL=function(s,v) { //Produkt Skalar mit Vektor
  return [s*v[0],s*v[1],s*v[2],1];
  }

var PDOT=function(a,b) { //Dotprodukt
  return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  }

var sign=1;
var KREUZ=function(a,b) { //Kreuzprodukt
  return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0],1];
  }
//    p3=[16,18,23,[193.0224597294723,101.13086532308243,1552.2459729472316,1],[5,25],[16,18,23]]
//    p17=[9,14,16,[193.01715769148177,101.12927041360496,1551.7157691481762,1],[21],[9,14,16]]
//    p18=[12,14,16,[193.62132746752474,101.12927041360491,1612.1327467524716,1],[22],[12,14,16]]
//    p21=[21,23,25,[193.6262250321179,101.13086532308239,1612.6225032117907,1],[26],[21,23,16]]
//    k9=[3,21,16,23,18,21,null,[16,23]]
//    k32=[17,18,14,16,9,12,null,[14,16]]

//alert(Math.atan2(0,0.1));//0
//alert(Math.atan2(0,-0.1));//pi
//alert(Math.atan2(Math.sin(0.123),Math.cos(0.123)));//0.123

var KRWG=function(OBJ) { //Kanten mit nur 1 bestimmende Ebene entfernen
  var E=OBJ[0];
  var P=OBJ[2];
  var K=OBJ[3];
  var W=[]; //zu entfernende Kanten
  var eps=0.001;
  var eps2=0.00001;
  var KNEU=[];
  for (var i=0;i<K.length;i++) {
    var p1=P[K[i][0]][3];
    var p2=P[K[i][1]][3];
    var M=[(p1[0]+p2[0])/2,(p1[1]+p2[1])/2,(p1[2]+p2[2])/2]; //Kantenmittelpunkt
    var d=dist(p1,p2);
    var V=[(p2[0]-p1[0])/d*eps,(p2[1]-p1[1])/d*eps,(p2[2]-p1[2])/d*eps]; //Kantentangente*eps
    if (Logflag) Logtext=Logtext+"KRWG "+i+" d="+d+" ["+K[i][7]+"] V="+V+"\n";

    var eneu=[]; //verwendete Ebenen
    //if (K[i][7].length>2) alert(K[i][7]);
    var EL=[];//zu sortierende Liste der Richtungsvektoren
    for (var j=0;j<K[i][7].length;j++) EL.push([0,KREUZ(V,E[K[i][7][j]]),-1,-1,K[i][7][j]]);
    if (Logflag) {Logtext=Logtext+"  EL0=\n"; for (let j=0;j<EL.length;j++) Logtext=Logtext+"    ["+EL[j][0]+',['+EL[j][1]+'],'+EL[j].slice(2)+']\n'}
    for (var j=0;j<K[i][7].length;j++) EL.push([-EL[j][0],MSCAL(-1,EL[j][1].slice()),-1,-1,EL[j][4]]);//oder ohne slice
    if (Logflag) {Logtext=Logtext+"  EL1=\n"; for (let j=0;j<EL.length;j++) Logtext=Logtext+"    ["+EL[j][0]+',['+EL[j][1]+'],'+EL[j].slice(2)+']\n'}
    for (var j=0;j<EL.length;j++) {
      var KR=KREUZ(EL[0][1],EL[j][1]);//♦
      let sign=1;
      if (PDOT(KR,V)<0) sign=-1;//♦oder bei >0, noch herausfinden
      EL[j][0]=Math.atan2(dist(KR,[0,0,0])*sign,PDOT(EL[0][1],EL[j][1]))*180/Math.PI;
      EL[j][6]='♦';
      EL[j][7]=PDOT(KR,V);
      EL[j][8]=dist(KR,[0,0,0])*sign;
      EL[j][9]=PDOT(EL[0][1],EL[j][1]);
      EL[j][10]=KR;
      }
//    if (Logflag) {Logtext=Logtext+"  EL2=\n"; for (let j=0;j<EL.length;j++) Logtext=Logtext+"    ["+EL[j][0]+',['+EL[j][1]+'],'+EL[j].slice(2)+']; KR='+EL[j][10]+'\n'}
    if (Logflag) {Logtext=Logtext+"  EL2=\n"; for (let j=0;j<EL.length;j++) Logtext=Logtext+"    "+JSON.stringify(EL[j])+'\n'}
    EL.sort(Asort).reverse();
    EL.push(EL[0]);
    for (var j=0;j<EL.length-1;j++) {
      var DG=DURCHGUCKER(OBJ,MADD(M,MSCAL(0.5,MADD(EL[j][1],EL[j+1][1]))));
      EL[j][2]=DG;
      EL[j+1][3]=DG;
      }
    //if (K[i][7].length>2) alert(EL.join("\n"));
    if (Logflag) {Logtext=Logtext+"  EL=\n"; for (let j=0;j<EL.length;j++) Logtext=Logtext+"    ["+EL[j][0]+',['+EL[j][1]+'],'+EL[j].slice(2)+']\n'}
    for (var j=0;j<EL.length-1;j++) if (EL[j][2]!=EL[j][3]&&eneu.indexOf(EL[j][4])==-1) eneu.push(EL[j][4]);
    if (Logflag) Logtext=Logtext+"  eneu=["+eneu+"]\n";
    //if (K[i][7].length>2) alert("eneu=["+eneu+"]");
/*
    var eneu=[]; //verwendete Ebenen
    for (var j=0;j<K[i][7].length;j++) {
      var ekij=E[K[i][7][j]];
      if (
        (DURCHGUCKER(OBJ,MADD(MSCAL(+eps2,ekij),MADD(M,KREUZ(V,ekij))))!=
         DURCHGUCKER(OBJ,MADD(MSCAL(-eps2,ekij),MADD(M,KREUZ(V,ekij)))))||
        (DURCHGUCKER(OBJ,MADD(MSCAL(+eps2,ekij),MADD(M,KREUZ(ekij,V))))!=
         DURCHGUCKER(OBJ,MADD(MSCAL(-eps2,ekij),MADD(M,KREUZ(ekij,V)))))) eneu.push(K[i][7][j]);
      if (Logflag) Logtext=Logtext+"  E"+K[i][7][j]+" VxE=["+KREUZ(V,ekij)+"] "+eneu.length
        +" "+DURCHGUCKER(OBJ,MADD(MSCAL(+eps2,ekij),MADD(M,KREUZ(V,ekij))))
        +" "+DURCHGUCKER(OBJ,MADD(MSCAL(-eps2,ekij),MADD(M,KREUZ(V,ekij))))
        +" "+DURCHGUCKER(OBJ,MADD(MSCAL(+eps2,ekij),MADD(M,KREUZ(ekij,V))))
        +" "+DURCHGUCKER(OBJ,MADD(MSCAL(-eps2,ekij),MADD(M,KREUZ(ekij,V))))
        +"\n";
      }
*/
    //K[i][7]=eneu;//rausgenommen bei der Fehlersuche Button NUT_UND_FEDER_defekt
    if (eneu.length>1) KNEU.push(K[i]);
    }
  OBJ[3]=KNEU;K=KNEU;
  for (var i=0;i<E.length;i++) E[i][5]=0;
  for (var i=0;i<K.length;i++) for (var j=0;j<K[i][7].length;j++) E[K[i][7][j]][5]=E[K[i][7][j]][5]+1;
  }

var KPWG=function(OBJ) { //Punkte mit nur 2 oder 1 oder 0 Kanten entfernen
  var Punktliste=[];
  var Kantenliste=[];
  for (var iP in OBJ[2]) { var P=OBJ[2][iP];
    var Kantenliste=[];
    for (var iK in OBJ[3]) { var K=OBJ[3][iK];
      if (K[0]==iP) Kantenliste.push([iK,0]);
      if (K[1]==iP) Kantenliste.push([iK,1]);
      }
    if (Kantenliste.length==2) {
      Punktliste.push(iP);
      OBJ[3][Kantenliste[0][0]][Kantenliste[0][1]]=OBJ[3][Kantenliste[1][0]][1-Kantenliste[1][1]];
      OBJ[3].splice([Kantenliste[1][0]],1);
      //alert(iP);
      }
    if (Kantenliste.length==1) {
      Punktliste.push(iP);
      //alert("war noch nie dagewesen: nur eine Kante zu P"+iP);
      OBJ[3].splice([Kantenliste[0][0]],1);
      }
    if (Kantenliste.length==0) {
      Punktliste.push(iP);
      }
    }
  if (Punktliste.length>0) {//alert(Punktliste);
    var neue_Punktliste=[];
    var neue_Punktnummern=[];
    for (var iP in OBJ[2]) if (Punktliste.indexOf(iP)==-1) {
      neue_Punktnummern[iP]=neue_Punktliste.length;
      neue_Punktliste.push(OBJ[2][iP]);
      }
    //alert(neue_Punktnummern);
    OBJ[2]=neue_Punktliste;
    //alert(neue_Punktliste.join("\n"));
    for (var iK in OBJ[3]) { var K=OBJ[3][iK];
      K[0]=neue_Punktnummern[K[0]];
      K[1]=neue_Punktnummern[K[1]];
      }
    //alert(OBJ[3].join("\n"));
    }
  for (var i in OBJ[0]) OBJ[0][i][5]=0;
  for (var i in OBJ[3]) for (var j in OBJ[3][i][7]) OBJ[0][OBJ[3][i][7][j]][5]+=1;
  }

//11 so, jetzt nur noch RUMPS:
var RUMPS=function(OBJ1,OBJ2,BIT) { //Schnittkoerper (OBJ1 and OBJ2)
  //local TRU,ERG,P,PNEU;
  if (Logflag) Logtext=Logtext+"OBJ1=\n";
  if (Logflag) KDUMP(OBJ1);
  if (Logflag) Logtext=Logtext+"OBJ2=\n";
  if (Logflag) KDUMP(OBJ2);
  
  //if (Logflag) Logtext=Logtext+"OBJ2="+JSON.stringify(OBJ2)+"\n";
  var TRU=OBJ1[0].length;
  var ERG=[];
  ERG[0]=OBJ1[0].slice().concat(OBJ2[0]); for (var i=0;i<ERG[0].length;i++) ERG[0][i]=ERG[0][i].slice();
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
    //if (iP==0) alert(P.join('\n')+'\n\n'+TRU);
    var PNEU=P.slice();
    if (PNEU[5]) ; else PNEU[5]=[PNEU[0],PNEU[1],PNEU[2]];
    PNEU[5]=PNEU[5].slice();
    PNEU[0]=PNEU[0]+TRU;
    PNEU[1]=PNEU[1]+TRU;
    PNEU[2]=PNEU[2]+TRU;
    if (PNEU[6]) {PNEU[6]=PNEU[6].slice(); for (let i=0;i<PNEU[6].length;i++) PNEU[6][i]=PNEU[6][i]+TRU;}//♥
    for (var i=0;i<PNEU[5].length;i++) PNEU[5][i]=PNEU[5][i]+TRU;
    //if (iP==0) alert(PNEU.join('\n')+'\nX\n'+TRU);
    if (Logflag) Logtext=Logtext+"OBJ2 P="+JSON.stringify(P)+" drin="+DURCHGUCKER(ERG,P[3])+" als PNEU="+JSON.stringify(PNEU)+"\n";
    if (DURCHGUCKER(ERG,P[3])!=3) ERG[2].push(PNEU);
    }
  //if (Logflag) alert(9);
  if (Logflag) Logtext=Logtext+"Punkte="+JSON.stringify(ERG[2])+"\n";
  if (Logflag) for (var i=0;i<ERG[2].length;i++) Logtext=Logtext+"P"+i+"="+JSON.stringify(ERG[2][i])+"\n";

  KEBN(ERG); //gleiche Ebenen bestimmen
  KASP(ERG); //gleiche Punkte zusammenfassen
  KFILL(ERG);
  KANZ(ERG); //gleiche Kanten zusammenfassen
  if (Logflag) Logtext=Logtext+"nach KANZ(ERG):\n";
  if (Logflag) KDUMP(ERG);
//  KENT(ERG); //Entgraten
//  KFILL(ERG);
//  KANZ(ERG);
  KRWG(ERG); //Kanten mit nur 1 bestimmende Ebene entfernen
  if (Logflag) Logtext=Logtext+"nach KRWG(ERG):\n";
  if (Logflag) KDUMP(ERG);
  KPWG(ERG); //Punkte mit nur 2 Kanten entfernen
  if (Logflag) Logtext=Logtext+"nach KPWG(ERG):\n";
  if (Logflag) KDUMP(ERG);
  if (Logflag) Logtext=Logtext+"nach return RUMPS(OBJ1,OBJ2,bit):\n";
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
  var neu=MMULT(OBJ[0],A);
  for (var i in OBJ[0]) {
    if (OBJ[0][i][4]>=0) neu[i][4]=OBJ[0][i][4];
    if (OBJ[0][i][5]>=0) neu[i][5]=OBJ[0][i][5];
    }
  OBJ[0]=neu;
  //for (var P of OBJ[2]) {
  for (var iP in OBJ[2]) { var P=OBJ[2][iP];
    //if (Logflag) Logtext=Logtext+"TRANSFORM i="+iP+"\n"+OBJ[0][P[0]]+"\n"+OBJ[0][P[1]]+"\n"+OBJ[0][P[2]]+"\n";
    P[3]=PGGT(DREIEBENEN(OBJ[0][P[0]],OBJ[0][P[1]],OBJ[0][P[2]]));
    //if (Logflag) Logtext=Logtext+iP+" "+P[3]+"\n";
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
  xmin=xmin-10; ymin=ymin-10; xmax=xmax+10; ymax=ymax+10;
  KPLOTtext='<svg width="100%" height="400" viewBox="'+xmin+" "+ymin+" "+(xmax-xmin)+" "+(ymax-ymin)+'" stroke="blue">\n'+KPLOTtext;
  KPLOTtext=KPLOTtext+'<path id="Eiderdaus" d="M-100,-100 L-40,-100 L-40,-40 Z" fill="orange" fill-rule="evenodd" stroke="none"/>'
    +'<circle id="svg_p" cx="-77" cy="-33" r="5" stroke="fuchsia" stroke-dasharray="0.5,1.5" stroke-width="4" fill="none">'
      +'<animate attributeName="stroke-dashoffset" from="0" to="4" dur="1" additive="sum" repeatCount="indefinite"/>'
      +'</circle>'
    +'<line id="svg_k" x1="-100" y1="-100" x2="-200" y2="-300" stroke="fuchsia" stroke-dasharray="0.5,1.5" stroke-width="4" fill="none">'
      +'<animate attributeName="stroke-dashoffset" from="0" to="4" dur="1" additive="sum" repeatCount="indefinite"/>'
      +'</line>'
    +'</svg>\n';
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
