//展示表格
const data=require('../template.json')

const showTable=()=>{
	let table=[]
	for(let i in data){
		let each={name:i,url:data[i]}
		table.push(each)
	}
	console.table(table)
}
const getNameList=()=>{
	let nameList=[]
	for(let i in data){
		let listEach={name:i}
		nameList.push(listEach)
	}
	return nameList
}
const getList=()=>{
	let list=[]
	for(let i in data){
		list.push(i)
	}
	return list
}
module.exports={
	showTable,
	getNameList,
	getList
}