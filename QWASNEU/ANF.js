let FFF = [1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2, 1, 1, 2, 3, 2];
//alert(FFF);
//(1∧2∧3∧4∧5∧6)∧¬(7∧8)∧-(9∧10)∧-(11∧12)∧-(13∧14)∧-(15∧16)∧-(17∧18)∧-(19∧20)∧-(21∧22)
//(1∧2∧3∧4∧5∧6)∧(-7∨-8)∧(-9∨-10)∧(-11∨-12)∧(-13∨-14)∧(-15∨-16)∧(-17∨-18)∧(-19∨-20)∧(-21∨-22)
//((1∧2∧3∧4∧5∧6)∧(-7∨-8)∧(-9∨-10)∧(-11∨-12)∧(-13∨-14)∧(-15∨-16)∧(-17∨-18)∧(-19∨-20)∧-21)∨
//  ((1∧2∧3∧4∧5∧6)∧(-7∨-8)∧(-9∨-10)∧(-11∨-12)∧(-13∨-14)∧(-15∨-16)∧(-17∨-18)∧(-19∨-20)∧-22)



//∨

function ANF(Obj) {
  
  Obj.ANF=[1111];
  }

function alle_Punkte(Obj) {
	 let PL=[];
	 let EL=OBJ_X[0];
	 let xyz=[];
	 for (let i=0;i<EL.length;i++) 
	   for (let j=0;j<i;j++) 
	     for (let k=0;k<j;k++) 
	       PL.push([DREIEBENEN(EL[i],EL[j],EL[k]),[]]);
	 for (let i=0;i<PL.length;i++)
  	 for (let j=0;j<EL.length;j++) PL[i][1].push(TFIND(OBJ_X,j,PL[i][0]));
  
  Obj.alle_Punkte=PL;
  }


//---------------
function ANF_Test() {
  ANF(OBJ_X);
  alle_Punkte(OBJ_X);
  //console.log(TFIND(OBJ_X,);
  console.error(JSON.stringify(OBJ_X.alle_Punkte.slice(0,2)));
  }