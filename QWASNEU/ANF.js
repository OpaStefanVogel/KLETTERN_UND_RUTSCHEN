let FFF = [1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2];
//alert(FFF);
//(1∧2∧3∧4∧5∧6)∧¬(7∧8)∧-(9∧10)∧-(11∧12)∧-(13∧14)∧-(15∧16)∧-(17∧18)∧-(19∧20)∧-(21∧22)
//(1∧2∧3∧4∧5∧6)∧(-7∨-8)∧(-9∨-10)∧(-11∨-12)∧(-13∨-14)∧(-15∨-16)∧(-17∨-18)∧(-19∨-20)∧(-21∨-22)
//((1∧2∧3∧4∧5∧6)∧(-7∨-8)∧(-9∨-10)∧(-11∨-12)∧(-13∨-14)∧(-15∨-16)∧(-17∨-18)∧(-19∨-20)∧-21)∨
//  ((1∧2∧3∧4∧5∧6)∧(-7∨-8)∧(-9∨-10)∧(-11∨-12)∧(-13∨-14)∧(-15∨-16)∧(-17∨-18)∧(-19∨-20)∧-22)

//Beispiel8:
//T = [1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2]


//ANF1=[[a*b*c]+[d*e*f]] und ANF2=[[g*h*k]+[p*q*r]]
//ANF1*ANF2=[[a*b*c*g*h*k]+[a*b~c*p*q*r]+[d*e*f*g*h*k]+[d*e*f*ü*q*r]]
//-ANF2=[-[g*h*k]*-[p*q*r]]=[[-g+-h+-k]*[-p+-q+-r]]
//     =[[-g*-p]+[-g*-q]+[-g*-r]+[-h*-p]+[-h*-q]+[-h*-r]+[-k*-p]+[-k*-q]+[-k*-r]];

let and_tab=[[0,1,2,3],[1,1,2,2],[2,2,2,2],[3,2,2,3]];
let not_tab=[0,3,2,1];

function ANF_new(OBJ,i,r) {
	   
	 let RET=[];
	 for (let i=0;i<OBJ[0].length;i++) RET[i]=0;
	 RET[i]=r;
	 return [RET];
  }

function ANF_and(OBJ,ANF1,ANF2) {
	 let RET=[];
	 let R=[];
	 for (let i=0;i<ANF1.length;i++) for (let j=0;j<ANF2.length;j++) {
	 	 R=[];
	 	 for (let k=0;k<ANF1[i].length;k++) R[k]=and_tab[ANF1[i][k]][ANF2[j][k]];
	 	 RET.push(R)
  	 }
  return RET;
  }

function ANF_not(OBJ,ANF1) {
 	if (ANF1.length>1) alert('ERROR: ANF1.length>1 ist noch nicht drin');
	 let RET = [];
	 let R = [];
	 for (let i=0;i<ANF1.length;i++) {
	//  	for (let j = 0; j < ANF2.length; j++) {
	 		R = [];
	 		for (let k = 0;k<ANF1[i].length;k++) if(ANF1[i][k]>0) R.push(ANF_new(OBJ,k,not_tab[ANF1[i][k]])[0]);
		 	RET.push(R)
		  }
	 return R;
  }

function ANF(OBJ) {
  
	 let STAPEL=[];
	 let T=OBJ[1];
	 let enr=0;
	 let ANF1=[];
	 let ANF2=[];
	 for (let v=0;v<T.length;v++) {
	 	 
	 	 if (T[v]==1) {STAPEL.push(ANF_new(OBJ,enr,1));enr=enr+1}
	 	 if (T[v]==2) {
	 	 	 ANF2=STAPEL.pop();
	 	 	 ANF1=STAPEL.pop();
	 	 	 STAPEL.push(ANF_and(OBJ,ANF1,ANF2));
	 	 	 }
	 	 if (T[v]==3) {
	 	 	 ANF1=STAPEL.pop();
	 	 	 STAPEL.push(ANF_not(OBJ,ANF1));
	 	 	 }
    console.log(JSON.stringify(STAPEL));
	   }

  OBJ.ANF=STAPEL[0];
  }

function alle_Punkte(OBJ) {
	 let PL=[];
	 let EL=OBJ[0];
	 let xyz=[];
	 let dr=0;
	 for (let i=0;i<EL.length;i++) 
	   for (let j=0;j<i;j++) 
	     for (let k=0;k<j;k++) {
	     	 dr=DREIEBENEN(EL[i], EL[j], EL[k]);
	       if (dr[3]==1&&DURCHGUCKER(OBJ,dr)<3) PL.push([dr,[]]);
	       }
	 for (let i=0;i<PL.length;i++)
  	 for (let j=0;j<EL.length;j++) PL[i][1].push(TFIND(OBJ,j,PL[i][0]));
  
  OBJ.PL=PL;
  }

function alle_konvexen_Teile(OBJ) {
	 let RET=[];
	 let RET0=[];
	 let flag=true;
	 let drin=0;
	 for (let c=0;c<OBJ.ANF.length;c++) {
	   RET[c]=[];
	   for (let i=0;i<OBJ.PL.length;i++) {
	   	 flag=true;
	   	 for (let j=0;j<OBJ.ANF[c].length;j++) {
	   	 	 drin=PL[i][1][j];//TFIND(OBJ,j,OBJ.PL[i][0]);
	   	 	 if (drin!=OBJ.ANF[c][j]&&OBJ.ANF[c][j]>0&&drin!=2) flag=false;
  	   	 }
	   	 
  	   if (flag) RET[c].push(i);
	     }
	   }
	 OBJ.konv=RET;
  }






//---------------
function ANF_Test(OBJ) {
  ANF(OBJ);
  alle_Punkte(OBJ);
  //console.log(TFIND(OBJ_X,0,);
  alle_konvexen_Teile(OBJ);
  exportiere.innerHTML='//insgesamt '+OBJ.PL.length+' Punkte und '+OBJ.konv.length+' konvexe Teile:\nPL='+JSON.stringify(OBJ.PL.map(function(i){return i[0]}))+';\ncpoints='+JSON.stringify(OBJ.konv)+";\n";
  selectText("exportiere");
  console.error('kein Fehler alles gut: '+JSON.stringify(OBJ.PL.slice(0,2))+'#'+JSON.stringify(OBJ.konv.slice(0,2)));
  }