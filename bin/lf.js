#!/usr/bin/env node

const cmd=require('commander')
const {add,del,ls,init}=require('../commands')
cmd.version(require('../package').version)
cmd.command('ls').description('查看模板').action(()=>{
	ls()
})
cmd.command('add').description('添加模板').action(()=>{
	add()
})
cmd.command('del').description('删除模板').action(()=>{
	del()
})
cmd.command('init [type] [demo]').description('项目初始化').action((type,demo)=>{
	init(type,demo)
})
cmd.parse()