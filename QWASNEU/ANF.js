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




function ANF(OBJ) {
  
  OBJ.ANF=[
//  	 [1,1,1,1,1,1,3,0],
//  	 [1,1,1,1,1,1,0,3],
  	 [1,1,1,1,1,1,3,0,3,0,3,0,3,0],
  	 [1,1,1,1,1,1,3,0,3,0,3,0,0,3],
  	 [1,1,1,1,1,1,3,0,3,0,0,3,3,0],
  	 [1,1,1,1,1,1,3,0,3,0,0,3,0,3],
  	 [1,1,1,1,1,1,3,0,0,3,3,0,3,0],
  	 [1,1,1,1,1,1,3,0,0,3,3,0,0,3],
  	 [1,1,1,1,1,1,3,0,0,3,0,3,3,0],
  	 [1,1,1,1,1,1,3,0,0,3,0,3,0,3],
  	 [1,1,1,1,1,1,0,3,3,0,3,0,3,0],
  	 [1,1,1,1,1,1,0,3,3,0,3,0,0,3],
  	 [1,1,1,1,1,1,0,3,3,0,0,3,3,0],
  	 [1,1,1,1,1,1,0,3,3,0,0,3,0,3],
  	 [1,1,1,1,1,1,0,3,0,3,3,0,3,0],
  	 [1,1,1,1,1,1,0,3,0,3,3,0,0,3],
  	 [1,1,1,1,1,1,0,3,0,3,0,3,3,0],
  	 [1,1,1,1,1,1,0,3,0,3,0,3,0,3],
  	 ];
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
	       if (dr[3]==1) PL.push([dr,[]]);
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
	   	 	 drin=TFIND(OBJ,j,OBJ.PL[i][0]);
	   	 	 if (drin!=OBJ.ANF[c][j]&&OBJ.ANF[c][j]>0&&drin!=2) flag=false;
  	   	 }
	   	 
  	   if (flag) RET[c].push(OBJ.PL[i][0]);
	     }
	   }
	 OBJ.konv=RET;
  }






//---------------
function ANF_Test() {
  ANF(OBJ_X);
  alle_Punkte(OBJ_X);
  //console.log(TFIND(OBJ_X,0,);
  alle_konvexen_Teile(OBJ_X);
  exportiere.innerHTML='cpoints='+JSON.stringify(OBJ_X.konv)+"\n";
  selectText("exportiere");
  console.error(JSON.stringify(OBJ_X.PL.slice(0,2))+'#'+JSON.stringify(OBJ_X.konv));
  }