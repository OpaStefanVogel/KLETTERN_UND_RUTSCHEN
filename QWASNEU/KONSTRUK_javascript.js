if (1==0) {
//Veränderungen zu GAP:
//1.EGGT ohne /-P[3]
//in KFILL if (PZZS[2*PNR][1]<=PZZS[2*PNR+1][1])
//in TFIND if (Math.abs(A)<0.00001) return 2; //Rand
//.. extra EBENE normalisiert und gerichtet, SCHNITT3=-SCHNITT1
//sonst zu machen noch:
//.. in KPLOT noch width und height anpassen
//.. überflüssige Ebenen entfernen
//ok warum in KFILL das if drinbeiben muss, ok ist raus

Logtext="";
Logtext=Logtext+"KONSTRUK_javascript.js laden...\n";

/*GAP
#Read("Installation_für_Spartan3/QWASNEU/KONSTRUK(GAP)");
#Aufpassen! Veränderungen gegenüber KONSTRUK:
#PTTZ ein Punkt mehr
#VMITT kann wohl raus
#ok PUNKTWERT wohl andere Variablenübergabe 
#TFIND auch
#DRAUFGUCKER jetzt auch (war weil ich das spätzer hinzugebastelt habe
#ok ohne DRAUFGUCKER,!!!f
#.. Size(7) geht nicht!!!
#ok RUMPS geht!!!!!! Suuuuuuuperrrrrr!
#ok [0,0,0,0 ist raus!!!!
#ok PUNKTWERT nur (EBENE,PUNKT) machen ok ist auch drin!!!
#ok TOP=7 raus ok
#ok vierte Koordinate geht durch
#ok super!!!! DREIEBENEN jetzt auch für EBENE aus drei Punkten
#ok zusätzlich, vierte Punktkoordinate 1 ergänzen
#ok das muss dann später mit in EBENE0 eingehen als rechen
#ok in DREIEBENEN ist schon ein Anfang und sogar fertig
#ok aber noch Vorzeichen von +++- in ++++ umwechseln irgendwie...auch ok 
#ok in EGGT wann *-1 nur? wegen der Ebenenrichtung...richtig, gar nicht!
#.. und dann Transform und Plot...
#ok TEND ist auch raus
#ok DREIEBENEN ist noch -+-+ und nicht +-+-, ok ist egal
#ok ist gut jetzt, eventuell mal noch QFILL2 ok ist drin!
#ok hab xgap laufen...
#mal merken:
#REST1[3] sind die Eckpunkte und deren definierenden Ebenen
#REST1[1] sind dann die Ebenen
#REST1[2] Verknüpfung der Ebenen: 1=Ebene, 2=and, 3=not
#REST1[4] sind die Kanten, 
#bestehend aus zwei Eckpunkten und zwei definierenden Ebenen
#weiter also mit der PLOT-Funktion
#in DURCHGUCKER STAPEL rein
#in RUMPS TRU dazuzählen bei OBJ2
#in SCHNITTPUNKT aufsteigende Ebenenreihenfolge erhalten
#DURCHGUCKER jetzt einfacher durch 1=innen, 2=Rand, 3=aussen
#..in KFILL momentan alle Kanten zeichnen, da ist noch was...



TEBN:=1; TAND:=2; TNOT:=3; 

TSETZ:=function(A) 
  if A<0 then return 3; fi; #draussen
  if A=0 then return 2; fi; #Rand
  if A>0 then return 1; fi; #innen
  end;
*/

var TEBN=1;
var TAND=2;
var TNOT=3;

var TSETZ=function(A) {
  if (Math.abs(A)<0.00001) return 2; //Rand
  if (A<0) return 3;  //draussen
  if (A>0) return 1;  //innen
  }
//alert(TSETZ(-7));

/*GAP
PUNKTWERT:=function(EBENE,PUNKT) #Funktionswert der Ebenengleichung für einen Punkt P
  return PUNKT[1]*EBENE[1]+PUNKT[2]*EBENE[2]+PUNKT[3]*EBENE[3]+PUNKT[4]*EBENE[4];
  end;

TFIND:=function(OBJ,ENR,P) 
  return TSETZ(PUNKTWERT(OBJ[1][ENR],P)); end;
*/

var PUNKTWERT=function(EBENE,PUNKT) { //Funktionswert der Ebenengleichung für einen Punkt P
  return PUNKT[0]*EBENE[0]+PUNKT[1]*EBENE[1]+PUNKT[2]*EBENE[2]+PUNKT[3]*EBENE[3];
  }
//alert("PUNKTWERT 1 "+PUNKTWERT([1,0,0,1],[-1,0,0,0]));//-1

var TFIND=function(OBJ,ENR,P) {
  return TSETZ(PUNKTWERT(OBJ[0][ENR],P));
  }
//alert("TFIND 3 "+TFIND([[[1,0,0,1]]],0,[-1,0,0,0]));

/*GAP
STAPEL:=[];
DURCHGUCKER:=function(OBJ,P) # ob P im Inneren oder auf Rand von OBJ
  local X,Y,T,ETNR;
  X:=0; Y:=0; ETNR:=1; #ETNR für ETADR
  for T in OBJ[2] do
    if T=TEBN then Add(STAPEL,X); X:=TFIND(OBJ,ETNR,P); ETNR:=ETNR+1; fi; 
    if T=TAND then X:=Maximum(X,Remove(STAPEL)); fi;
    if T=TNOT then X:=4-X; fi;
#Print("\n",T," ",X);
    od;
  return X;
  end;
*/

var STAPEL=[];
DURCHGUCKER=function(OBJ,P) { // ob P im Inneren oder auf Rand von OBJ
  //local X,Y,T,ETNR;
  var X=0;
  var Y=0;
  var ETNR=0; //ETNR für ETADR
  for (var T of OBJ[1]) {
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

/*GAP
EGGT1:=function(E)#kürzt Ebenengleichung, gemeinsame Faktoren herausdividieren
  local G,N,H;
  G:=Gcd(NumeratorRat(E[1]),NumeratorRat(E[2]),NumeratorRat(E[3]),NumeratorRat(E[4]));
  N:=Gcd(DenominatorRat(E[1]),DenominatorRat(E[2]),DenominatorRat(E[3]),DenominatorRat(E[4]));
  return E/G*N;
  end;
EGGT:=function(E)#kürzt Ebenengleichung, gemeinsame Faktoren herausdividieren
  local G,N,H;
#  G:=Gcd(NumeratorRat(E[1]),NumeratorRat(E[2]),NumeratorRat(E[3]),NumeratorRat(E[4]));
#  N:=Gcd(DenominatorRat(E[1]),DenominatorRat(E[2]),DenominatorRat(E[3]),DenominatorRat(E[4]));
#  return E/G*N;
#  return E/Gcd(Rationals,E[1],E[2],E[3],E[4]);
  if E[4]<0 then return E/-E[4]; fi;
  if E[4]=0 then return E; fi;
  if E[4]>0 then return E/E[4]; fi;
  end;
*/

var EGGT=function(E) { //kürzt Ebenengleichung, gemeinsame Faktoren herausdividieren
  if (E[3]<0) return [E[0]/E[3],E[1]/E[3],E[2]/E[3],1];
  if (E[3]==0) return E;
  if (E[3]>0) return [E[0]/E[3],E[1]/E[3],E[2]/E[3],1];
  }
//alert("EGGT 2.5,2,1.5,1 "+EGGT([10,8,6,4]));
	
/*GAP
DREIEBENEN:=function(E1,E2,E3) #Schnittpunkt dreier Ebenen
  local RET;
  RET:=EGGT([
    Determinant([E1{[2,3,4]},E2{[2,3,4]},E3{[2,3,4]}]),
    -Determinant([E1{[3,4,1]},E2{[3,4,1]},E3{[3,4,1]}]),
    Determinant([E1{[4,1,2]},E2{[4,1,2]},E3{[4,1,2]}]),
    -Determinant([E1{[1,2,3]},E2{[1,2,3]},E3{[1,2,3]}])
    ]);
  #Probe:Print("\nDREIEBENEN:",[E1,E2,E3],RET,[E1,E2,E3]*RET);
  return RET;
  end;

EBENE:=function(P1,P2,P3)#Objekt Ebene durch drei Punkte P1, P2, P3,
  return [[DREIEBENEN(P1,P2,P3)],[TEBN],[],[]];
  end;

SCHNITT2:=EBENE([100,0,0,1],[200,50,150,1],[200,0,90,1]);
SCHNITT3:=EBENE([100,0,0,1],[200,0,90,1],[200,50,150,1]);
*/
var Determinant3=function(A) {
  return A[0][0]*A[1][1]*A[2][2]+A[0][1]*A[1][2]*A[2][0]+A[0][2]*A[1][0]*A[2][1]
        -A[0][0]*A[2][1]*A[1][2]-A[0][1]*A[1][0]*A[2][2]-A[0][2]*A[1][1]*A[2][0];
  }
//alert("Determinant3 -3 "+Determinant3([[1,2,3],[2,3,3],[3,3,3]]));

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


/*GAP
EBENE:=function(P1,P2,P3)#Objekt Ebene durch drei Punkte P1, P2, P3,
  return [[DREIEBENEN(P1,P2,P3)],[TEBN],[],[]];
  end;

SCHNITT2:=EBENE([100,0,0,1],[200,50,150,1],[200,0,90,1]);
SCHNITT3:=EBENE([100,0,0,1],[200,0,90,1],[200,50,150,1]);
*/

var EBENE=function(P1,P2,P3) { //Objekt Ebene durch drei Punkte P1, P2, P3,
  return [[DREIEBENEN(P1,P2,P3)],[TEBN],[],[]];
  }

var SCHNITT1=EBENE([1,0,0,1],[0,1,0,1],[0,0,0,1]);
var SCHNITT2=EBENE([100,0,0,1],[200,50,150,1],[200,0,90,1]);
var SCHNITT3=EBENE([100,0,0,1],[200,0,90,1],[200,50,150,1]);
//alert("SCHNITT1 "+SCHNITT1.join("\n"));

/*GAP
QFILL:=function(OBJ) #Berechnet und ergänzt Koordinatenangabe
  local i,j,k,n,P;
  OBJ[3]:=[];OBJ[4]:=[];
  n:=Size(OBJ[1]);
  for i in [1..n] do
    for j in [i+1..n] do
      for k in [j+1..n] do
        P:=DREIEBENEN(OBJ[1][i],OBJ[1][j],OBJ[1][k]);
        if P[4]<0 then P:=-P; fi;
        if DURCHGUCKER(OBJ,P)<>3 then Add(OBJ[3],[i,j,k,P]);
          #:Print("\ngefunden: ",i," ",j," ",k," ",P," ",DURCHGUCKER(OBJ,P));
          fi;
        od;
      od;
    od;
  return OBJ;
  end;

QUADER:=function(L,B,H) #Objekt "Quader"
  return QFILL([
    [[1,0,0,0],[0,1,0,0],[0,0,1,0],
     [-1,0,0,L],[0,-1,0,B],[0,0,-1,H]],
    [TEBN,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND],
    [],[]]);
  end;
BALKEN1:=QUADER(200,100,150);

DURCHGUCKER(BALKEN1,[0,0,0,-1]);
DURCHGUCKER(BALKEN1,[0,0,1,1]);
DURCHGUCKER(BALKEN1,[0,1,1,1]);
DURCHGUCKER(BALKEN1,[1,1,1,1]);
DURCHGUCKER(BALKEN1,[-1,1,1,1]);
DURCHGUCKER(BALKEN1,[100,0,0,1]);
*/

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

var QUADER=function(L,B,H) { //Objekt "Quader"
  return QFILL([
    [[1,0,0,0],[0,1,0,0],[0,0,1,0],
     [-1,0,0,L],[0,-1,0,B],[0,0,-1,H]],
    [TEBN,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND,TEBN,TAND],
    [],[]]);
  }
var BALKEN1=QUADER(200,100,150);
Logtext=Logtext+"BALKEN1 mit 6 Ebenen und 8 Eckpunkten:\nEbenen="+JSON.stringify(BALKEN1[0])+"\n";
Logtext=Logtext+"Verknüpfung 1=Ebene, 2=AND, 3=NOT: "+JSON.stringify(BALKEN1[1])+"\n";
Logtext=Logtext+"Eckpunkte [Ebene1,Ebene2,Ebene3,[x,y,z,1]]: "+JSON.stringify(BALKEN1[2])+"\n";

//alert(DURCHGUCKER(BALKEN1,[0,0,0,1]));
//alert(DURCHGUCKER(BALKEN1,[0,0,1,1]));
//alert(DURCHGUCKER(BALKEN1,[0,1,1,1]));
//alert(DURCHGUCKER(BALKEN1,[1,1,1,1]));
//alert(DURCHGUCKER(BALKEN1,[-1,1,1,1]));
//alert(DURCHGUCKER(BALKEN1,[100,0,0,1]));
//alert(DURCHGUCKER(BALKEN1,[199,99,149,1]));
//alert(DURCHGUCKER(BALKEN1,[200,100,150,1]));
//alert(DURCHGUCKER(BALKEN1,[200,100,151,1]));

/*GAP
PFILL:=function(OBJ) #Berechnet und ergänzt Koordinatenangabe
  local i,j,k,n,P;
  n:=Size(OBJ[1]);
  for P in OBJ[3] do
    P[4]:=DREIEBENEN(OBJ[1][P[1]],OBJ[1][P[2]],OBJ[1][P[3]]);
    if P[4][4]<0 then P[4]:=-P[4]; fi;
    od;
  return OBJ;
  end;

PFILL(BALKEN1);
Print("\nÄÄÄ");

MERK12:=[];MERK:=[];
DFILL:=function(OBJ) #füllt eine temporäre separate Liste MERK12 mit Kantenfluchtlinien
  MERK12:=[];MERK:=[];
  for P in OBJ[3] do
    if not([P[1],P[2]] in MERK12) then
      Add(MERK12,[P[1],P[2]]);Add(MERK,[P[1],P[2],P[3]]); fi;
    if not([P[2],P[3]] in MERK12) then
      Add(MERK12,[P[2],P[3]]);Add(MERK,[P[2],P[3],P[1]]); fi;
    if not([P[1],P[3]] in MERK12) then
      Add(MERK12,[P[1],P[3]]);Add(MERK,[P[1],P[3],P[2]]); fi;
    od;
  end;
DFILL(BALKEN1); MERK12; MERK;
*/

//PFILL(...) weglassen

var MERK12=[];
var MERK=[];
var DFILL=function(OBJ) { //füllt eine temporäre separate Liste MERK12 mit Kantenfluchtlinien
  MERK12=[];
  MERK=[];
  for (P of OBJ[2]) {//alert(JSON.stringify(P));
    if (MERK12.indexOf("["+[P[0],P[1]]+"]")==-1) {MERK12.push("["+[P[0],P[1]]+"]"); MERK.push([P[0],P[1],P[2]])}
    if (MERK12.indexOf("["+[P[1],P[2]]+"]")==-1) {MERK12.push("["+[P[1],P[2]]+"]"); MERK.push([P[1],P[2],P[0]])}
    if (MERK12.indexOf("["+[P[0],P[2]]+"]")==-1) {MERK12.push("["+[P[0],P[2]]+"]"); MERK.push([P[0],P[2],P[1]])}
    }
  }
DFILL(BALKEN1); 
//alert("MERK12="+JSON.stringify(MERK12));
//alert("MERK="+JSON.stringify(MERK));


/*GAP
KFILL:=function(OBJ) #fuellt Kantenliste [pnr1,pnr2,enr1,enr2]
  local M,PNR,PZZS,PZZT;
  DFILL(OBJ);OBJ[4]:=[];
  for M in MERK do
    Print("\nKantenfluchtlinie ",M);
    PZZT:=[];
    for PNR in [1..Size(OBJ[3])] do
      #:Print(PNR," ");
      if (M[1]=OBJ[3][PNR][1] and M[2]=OBJ[3][PNR][2]) then
        Add(PZZT,[PUNKTWERT(OBJ[1][M[3]],OBJ[3][PNR][4]),PNR,OBJ[3][PNR][3]]);
        fi;
      if (M[1]=OBJ[3][PNR][2] and M[2]=OBJ[3][PNR][3]) then
        Add(PZZT,[PUNKTWERT(OBJ[1][M[3]],OBJ[3][PNR][4]),PNR,OBJ[3][PNR][1]]);
        fi;
      if (M[1]=OBJ[3][PNR][1] and M[2]=OBJ[3][PNR][3]) then
        Add(PZZT,[PUNKTWERT(OBJ[1][M[3]],OBJ[3][PNR][4]),PNR,OBJ[3][PNR][2]]);
        fi;
      od;
    PZZS:=SortedList(PZZT);
    Print(PZZS);
#    for PNR in [1..Size(PZZS)-1] do
#      Print("\nVorkante ",PZZS[PNR][2]," ",PZZS[PNR+1][2]," ");
#      if PUNKTWERT(OBJ[1][PZZS[PNR+1][3]],OBJ[3][PZZS[PNR][2]][4])>=0 then
#        Print("drin sind ",M[1]," ",M[2]," ");
#        Add(OBJ[4],[PZZS[PNR][2],PZZS[PNR+1][2],M[1],M[2]]);
#        fi;
#      od;
    for PNR in [1..Size(PZZS)/2] do
      Print("\nVorkante ",PZZS[PNR][2]," ",PZZS[PNR+1][2]," ");
      Print("drin sind ",M[1]," ",M[2]," ");
      Add(OBJ[4],[PZZS[2*PNR-1][2],PZZS[2*PNR][2],M[1],M[2]]);
      od;
#    for PNR in [1..Size(PZZS)-1] do
#      Print("\nVorkante ",PZZS[PNR][2]," ",PZZS[PNR+1][2]," ");
#      Print("drin sind ",M[1]," ",M[2]," ");
#      Add(OBJ[4],[PZZS[PNR][2],PZZS[PNR+1][2],M[1],M[2]]);
#      od;
    od;
  end;
      
KFILL(BALKEN1);BALKEN1;
*/

function Zsort(a,b) {if (a<b) return -1;if (a==b) return 0; return 1}
function Asort(a,b) {if (a[0]<b[0]) return -1;if (a[0]==b[0]) return 0; return 1}

var KFILL=function(OBJ) { //fuellt Kantenliste [pnr1,pnr2,enr1,enr2]
  //local M,PNR,PZZS,PZZT;
  DFILL(OBJ);
  OBJ[3]=[];
  for (var M of MERK) {
    Logtext=Logtext+"Kantenfluchtlinie "+M+"\n";
    var PZZT=[];
    for (var PNR=0;PNR<OBJ[2].length;PNR++) {//alert(PNR);
      if (M[0]==OBJ[2][PNR][0]&M[1]==OBJ[2][PNR][1]) PZZT.push([PUNKTWERT(OBJ[0][M[2]],OBJ[2][PNR][3]),PNR,OBJ[2][PNR][2]]);
      if (M[0]==OBJ[2][PNR][1]&M[1]==OBJ[2][PNR][2]) PZZT.push([PUNKTWERT(OBJ[0][M[2]],OBJ[2][PNR][3]),PNR,OBJ[2][PNR][0]]);
      if (M[0]==OBJ[2][PNR][0]&M[1]==OBJ[2][PNR][2]) PZZT.push([PUNKTWERT(OBJ[0][M[2]],OBJ[2][PNR][3]),PNR,OBJ[2][PNR][1]]);
      }
    PZZS=PZZT.sort(Asort);
    Logtext=Logtext+"  PZZS="+JSON.stringify(PZZS)+"\n";
    for (var PNR=0;PNR<PZZS.length/2;PNR++) /*if (PZZS[2*PNR][1]<=PZZS[2*PNR+1][1])*/ { //warum geht ohne if nicht?
      Logtext=Logtext+"    neue Kante "+PZZS[2*PNR][1]+" "+PZZS[2*PNR+1][1]+" drin sind "+M[0]+" "+M[1]+"\n";
      OBJ[3].push([PZZS[2*PNR][1],PZZS[2*PNR+1][1],M[0],M[1]]);
      }
    }
  }
      
KFILL(BALKEN1);
//Logtext=Logtext+JSON.stringify(BALKEN1[0])+"\n";
//Logtext=Logtext+JSON.stringify(BALKEN1[2])+"\n";
Logtext=Logtext+"Kanten [Punkt1,Punkt2,Ebene1,Ebene2]: "+JSON.stringify(BALKEN1[3])+"\n";
/*GAP
GERADEXEBENE:=function(OBJ1,OBJ2) #Schnittpunkte der Kanten von OBJ1 mit Ebenen von OBJ2
  local U,V,W,KANTE,EBENE,ERG,ENR;
  ERG:=[];
  for KANTE in OBJ1[4] do
    for ENR in [1..Size(OBJ2[1])] do #hier ginge auch in OBJ2[1], ENR nur wegen Print
    #
Print("\nKante ",KANTE," und Ebene ",ENR," ");
    U:=DREIEBENEN(OBJ1[1][KANTE[3]],OBJ1[1][KANTE[4]],OBJ2[1][ENR]);
    if U[4]<0 then U:=-U; fi;
    #
Print(U," ");
    V:=DURCHGUCKER(OBJ1,U);
    #Print(V," ");
    W:=DURCHGUCKER(OBJ2,U);
    #Print(W," ");
    if V<>3 and W<>3 then
      Add(ERG,[KANTE[3],KANTE[4],ENR,U]);
      Print("drin"); else Print("draußen");
      fi;
    od; od;
  return ERG;
  end;
GERADEXEBENE(BALKEN1,SCHNITT2);
*/
var GERADEXEBENE=function(OBJ1,OBJ2) { //Schnittpunkte der Kanten von OBJ1 mit Ebenen von OBJ2
  //local U,V,W,KANTE,EBENE,ERG,ENR;
  var ERG=[];
  for (var KANTE of OBJ1[3]) {
    for (var ENR=0;ENR<OBJ2[0].length;ENR++) { //hier ginge auch in OBJ2[1], ENR nur wegen Print
      Logtext=Logtext+"Kante "+JSON.stringify(KANTE)+" und Ebene "+JSON.stringify(ENR)+" ";
      var U=EGGT(DREIEBENEN(OBJ1[0][KANTE[2]],OBJ1[0][KANTE[3]],OBJ2[0][ENR]));
      //if U[4]<0 then U:=-U; fi;// ist jetzt EGGT
      Logtext=Logtext+"Schnittpunkt in "+JSON.stringify(U)+" ";
      var V=DURCHGUCKER(OBJ1,U);
      Logtext=Logtext+"V="+V+" ";
      var W=DURCHGUCKER(OBJ2,U);
      Logtext=Logtext+"W="+W+" ";
      if ((V!=3)&(W!=3)) {
        ERG.push([KANTE[2],KANTE[3],ENR,U]);
        Logtext=Logtext+"drin" } else Logtext=Logtext+"draußen";
      Logtext=Logtext+"\n";
      }
    }
  return ERG;
  }
var GX=GERADEXEBENE(BALKEN1,SCHNITT2);
Logtext=Logtext+"GERADEXEBENE(BALKEN1,SCHNITT2)="+JSON.stringify(GX)+"\n";
Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,150.0010,1])="+DURCHGUCKER(SCHNITT2,[200,50,150.0010,1])+"\n";
Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,150.0001,1])="+DURCHGUCKER(SCHNITT2,[200,50,150.0001,1])+"\n";
Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,150.0000,1])="+DURCHGUCKER(SCHNITT2,[200,50,150.0000,1])+"\n";
Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,149.9999,1])="+DURCHGUCKER(SCHNITT2,[200,50,149.9999,1])+"\n";
Logtext=Logtext+"DURCHGUCKER(SCHNITT2,[200,50,149.9990,1])="+DURCHGUCKER(SCHNITT2,[200,50,149.9990,1])+"\n";


/*GAP
SCHNITTPUNKTE:=function(OBJ1,OBJ2) #Schnittpunkte der Kanten eines OBJ mit Ebenen des anderen OBJ
  local TRU,E,ERG12,ERG21,MERK;
  TRU:=Size(OBJ1[1]);
  ERG12:=GERADEXEBENE(OBJ1,OBJ2);
  for E in ERG12 do E[3]:=E[3]+TRU; od;
  ERG21:=GERADEXEBENE(OBJ2,OBJ1);
  for E in ERG21 do 
    E[1]:=E[1]+TRU; E[2]:=E[2]+TRU;
    MERK:=E[3];E[3]:=E[2];E[2]:=E[1];E[1]:=MERK;#sortiert lassen
      od;
  return Concatenation(ERG12,ERG21);
  end;

SCHNITTPUNKTE(BALKEN1,SCHNITT2);
*/

var SCHNITTPUNKTE=function(OBJ1,OBJ2) { //Schnittpunkte der Kanten eines OBJ mit Ebenen des anderen OBJ
  //local TRU,E,ERG12,ERG21,MERK;
  var TRU=OBJ1[0].length;
  Logtext=Logtext+"GERADEXEBENE(OBJ1,OBJ2) "+JSON.stringify(TRU)+"\n";
  var ERG12=GERADEXEBENE(OBJ1,OBJ2);
  Logtext=Logtext+"GERADEXEBENE(OBJ2,OBJ1) "+JSON.stringify(TRU)+"\n";
  for (var E of ERG12) E[2]=E[2]+TRU;
  var ERG21=GERADEXEBENE(OBJ2,OBJ1);
  for (var E of ERG21) { 
    E[0]=E[0]+TRU; E[1]=E[1]+TRU;
    var MERK=E[2];E[2]=E[1];E[1]=E[0];E[0]=MERK; //sortiert lassen
    }
  return ERG12.concat(ERG21);
  }

var SX=SCHNITTPUNKTE(BALKEN1,SCHNITT2);
Logtext=Logtext+"SCHNITTPUNKTE(BALKEN1,SCHNITT2)="+JSON.stringify(SX)+"\n";
/*GAP
#so, jetzt nur noch RUMPS:
RUMPS:=function(OBJ1,OBJ2,BIT) #Schnittkoerper (OBJ1 and OBJ2)
  local TRU,ERG,P,PNEU;
  TRU:=Size(OBJ1[1]);
  ERG:=[];
  ERG[1]:=Concatenation(OBJ1[1],OBJ2[1]);
  ERG[2]:=Concatenation(OBJ1[2],OBJ2[2]);
  if BIT<>0 then Add(ERG[2],TNOT); fi;
  Add(ERG[2],TAND);
  ERG[3]:=SCHNITTPUNKTE(OBJ1,OBJ2);
  for P in OBJ1[3] do
    #Print(P,"\n",P[4],"\n",DURCHGUCKER(ERG,P[4]));
    if DURCHGUCKER(ERG,P[4])<>3 then Add(ERG[3],StructuralCopy(P)); fi;
    od;
  for P in OBJ2[3] do
    PNEU:=StructuralCopy(P);
    PNEU[1]:=PNEU[1]+TRU;
    PNEU[2]:=PNEU[2]+TRU;
    PNEU[3]:=PNEU[3]+TRU;
    if DURCHGUCKER(ERG,P[4])<>3 then Add(ERG[3],PNEU); fi;
    od;
  KFILL(ERG);
  return ERG;
  end;

REST1:=RUMPS(BALKEN1,SCHNITT2,0);
Print(REST1);
REST2:=RUMPS(BALKEN1,SCHNITT2,1);
Print(REST2);
REST3:=RUMPS(BALKEN1,SCHNITT3,0);
Print(REST3);
REST2=REST3;
GAP*/

//so, jetzt nur noch RUMPS:
RUMPS=function(OBJ1,OBJ2,BIT) { //Schnittkoerper (OBJ1 and OBJ2)
  //local TRU,ERG,P,PNEU;
  var TRU=OBJ1[0].length;
  var ERG=[];
  ERG[0]=OBJ1[0].slice().concat(OBJ2[0]);
  ERG[1]=OBJ1[1].slice().concat(OBJ2[1]);
  if (BIT) ERG[1].push(TNOT);
  ERG[1].push(TAND);
  ERG[2]=SCHNITTPUNKTE(OBJ1,OBJ2);
  for (var P of OBJ1[2]) {
    Logtext=Logtext+"OBJ1 P="+JSON.stringify(P)+" drin="+DURCHGUCKER(ERG,P[3])+"\n";
    if (DURCHGUCKER(ERG,P[3])!=3) ERG[2].push(P.slice());
    }
  for (var P of OBJ2[2]) {
    var PNEU=P.slice();
    PNEU[0]=PNEU[0]+TRU;
    PNEU[1]=PNEU[1]+TRU;
    PNEU[2]=PNEU[2]+TRU;
    Logtext=Logtext+"OBJ2 P="+JSON.stringify(P)+" drin="+DURCHGUCKER(ERG,P[3])+" als PNEU="+JSON.stringify(PNEU)+"\n";
    if (DURCHGUCKER(ERG,P[3])!=3) ERG[2].push(PNEU);
    }
  Logtext=Logtext+"Punkte="+JSON.stringify(ERG[2])+"\n";
  KFILL(ERG);
  return ERG;
  }

var REST1=RUMPS(BALKEN1,SCHNITT2,0);
Logtext=Logtext+"RUMPS(BALKEN1,SCHNITT2,0)="+JSON.stringify(REST1)+"\n";
//var REST2=RUMPS(BALKEN1,SCHNITT2,1);
//Logtext=Logtext+"RUMPS(BALKEN1,SCHNITT2,1)="+JSON.stringify(REST2)+"\n";
//var REST3=RUMPS(BALKEN1,SCHNITT3,0);
//Logtext=Logtext+"RUMPS(BALKEN1,SCHNITT3,0)="+JSON.stringify(REST3)+"\n";


/*GAP
TRANSFORM:=function(OBJ,A)
  local P;
  OBJ[1]:=StructuralCopy(OBJ[1])*A;
  for P in OBJ[3] do
    P[4]:=DREIEBENEN(OBJ[1][P[1]],OBJ[1][P[2]],OBJ[1][P[3]]);
    if P[4][4]<0 then P[4]:=-P[4]; fi;
    od;
#  QFILL(OBJ);
#  KFILL(OBJ);
  return OBJ;
  end;
Print("\nAEAEAE");

A:=[[1,0,0,-5],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
B:=[[1,0,0,5],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

TRANSFORM(BALKEN1,A);
TRANSFORM(BALKEN1,B);
Print("\nÄÄÄ");
CDF:=[[1/2*Sqrt(3),-1/2,0,0],[1/2,1/2*Sqrt(3),0,0],[0,0,1,0],[0,0,0,1]];
FDC:=[[1/2*Sqrt(3),1/2,0,0],[-1/2,1/2*Sqrt(3),0,0],[0,0,1,0],[0,0,0,1]];
TRANSFORM(BALKEN1,CDF);
TRANSFORM(BALKEN1,CDF);
TRANSFORM(BALKEN1,CDF);
TRANSFORM(BALKEN1,FDC);
TRANSFORM(BALKEN1,FDC);
TRANSFORM(BALKEN1,FDC);

#TRANSFORM(RUMPS1,CDF);
GAP*/

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

Logtext=Logtext+"MMULT(A,T)=[[8,11],[13,18]]: "+JSON.stringify(MMULT([[1,2],[2,3]],[[2,3],[3,4]]))+"\n";


var TRANSFORM=function(OBJ,A) {
  OBJ[0]=MMULT(OBJ[0],A);
  for (var P of OBJ[2]) {
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
TRANSFORM(REST1,CDF);
//TRANSFORM(BALKEN1,CDF);
//TRANSFORM(BALKEN1,CDF);
//TRANSFORM(BALKEN1,FDC);


/*GAP
####PLOT-Funktion
grafik:=GraphicSheet("HALLO",400,400);
GRAFIKINHALT:=[];
RATMACH:=function(X) 
  local RET,Y,i,CON;
  if IsRat(X) or IsFloat(X) then RET:=Float(X); else
    CON:=Conductor(X);
    Y:=ExtRepOfObj(X);
    RET:=0;
    for i in [1..Size(Y)] do
      RET:=RET+Y[i]*Cos(2*FLOAT.PI*(i-1)/CON);
      od;
    fi;
  return RET;
  end;

PUNKT2D:=function(x)
  local X1,X2,X3;
  X1:=RATMACH(x[1]);
  X2:=RATMACH(x[2]);
  X3:=RATMACH(x[3]);
  return [X1+X2/2,X3+X2/2]; 
  end;

KPLOT:=function(KLISTE)
  local KANTE,PUNKT,P1,P2,PD;
#  FastUpdate(grafik,true);#wirkt nich
  while GRAFIKINHALT<>[] do Delete(grafik,Remove(GRAFIKINHALT)); od;
  for K in KLISTE do
    for KANTE in K[4] do
      P1:=PUNKT2D(K[3][KANTE[1]][4]);
      P2:=PUNKT2D(K[3][KANTE[2]][4]);
      PD:=P2-P1;
#      Print(P1,P2,PD,"\n");
      Add(GRAFIKINHALT,Line(grafik,10+Int(P1[1]),210-Int(P1[2]),Int(PD[1]),-Int(PD[2])));
      od;
    od;
#  FastUpdate(grafik,false);
  end;
*/

var PUNKT2D=function(x) {
  return [x[0]+x[1]/2,x[2]+x[1]/2]; 
  }

var KPLOT=function(KLISTE) {
  Logtext=Logtext+'<svg width="400" height="300" stroke="blue">\n';
  for (var K of KLISTE) {
    for (var KANTE of K[3]) {
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
document.getElementById("Log").innerHTML='<span style="white-space:pre; font-family:monospace">'+Logtext+"</span>";


}