const {createCorpus}=require("ksana-corpus-builder");
const fs=require("fs");
const sourcepath="xml/";
const maxfile=0;
var files=require("./filelist")(maxfile);
//for (var i=0;i<22;i++) files.shift();
//files.length=3;

const bookStart=function(){
	noteReset.call(this);
}
const bookEnd=function(){
}

const body=function(tag,closing){
	closing?this.stop():this.start();
}
const onToken=function(token){
	//console.log(token);
	//return null for stop words
	//return " " for empty token, increase tpos but no inverted is created
	return token;
}

const fileStart=function(fn,i){
	const at=fn.lastIndexOf("/");
	console.log(fn)
	fn=fn.substr(at+1);
	fn=fn.substr(0,fn.length-4);//remove .xml
	var kpos=this.kPos;
	if (this.kPos) kpos=this.nextLineStart(this.kPos); //this.kPos point to last char of previos file
	this.putField("file",fn,kpos);
}

const bigrams={};
//require("./bigrams").split(" ").forEach((bi)=>bigrams[bi]=true);

var options={name:"yinshun",inputFormat:"xml",bitPat:"yinshun",
maxTextStackDepth:3,
textOnly:true,autostart:false, removePunc:true,bigrams}; //set textOnly not to build inverted
var corpus=createCorpus(options);

const {char,g,mapping}=require("./eudc");
const {div,div1,div2,div3,div4,head,title,divfinalize}=require("./div");
const {p,lb,list,item}=require("./format");
const {note,ptr,ref,noteReset}=require("./note");
const {choice,sic,corr,orig,reg}=require("./choice");
const finalize=function(){
	divfinalize.call(this);
}
corpus.setHandlers(
	//open tag handlers
	{body,list,item,div,div1,div2,div3,div4,p,lb,title,head,mapping,char,g,note,
		choice,corr,sic,orig,reg,ptr,ref}, 
	//end tag handlers
	{body,list,div,div1,div2,div3,div4,head,title,mapping,char,note,
		choice,corr,sic,orig,reg,ref},  
	//other handlers
	{bookStart,bookEnd,onToken,fileStart,finalize}  
);

files.forEach(fn=>corpus.addFile(sourcepath+fn));

corpus.writeKDB("yinshun.cor",function(byteswritten){
	console.log(byteswritten,"bytes written")
});

console.log(corpus.totalPosting,corpus.tPos);