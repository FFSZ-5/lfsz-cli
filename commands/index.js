#!/usr/bin/env node
const inquirer =require('inquirer') 
const fs = require('fs')
const templateList = require('../template.json')
const symbols = require('log-symbols')
const chalk = require('chalk')
const download=require('download-git-repo')
const ora=require('ora')
const { showTable ,getNameList,getList} = require('../units')
chalk.level = 1
const add=()=>{
  let question = [
    {
      name: 'name',
      type: 'input',
      message: '请输入模板名称：',
      validate(val) {
        if (!val) {
          return 'Name is required!'
        } else if (templateList[val]) {
          return 'Template has already existed!'
        } else {
          return true
        }
      }
    },
    {
      name: 'url',
      type: 'input',
      message: '请输入模板地址：',
      validate(val) {
        if (val === '') return 'The url is required!'
        return true
      }
    }
  ]

  inquirer.prompt(question).then((answers) => {
    let { name, url } = answers
    templateList[name] = url.replace(/[\u0000-\u0019]/g, '') // 过滤 unicode 字符
    fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(templateList), 'utf-8', (err) => {
      if (err) console.log(chalk.red(symbols.error), chalk.red(err))
      console.log('\n')
      console.log(chalk.green(symbols.success), chalk.green('添加模板成功！！\n'))
      console.log(chalk.green('模板列表如下:  \n'))
      showTable()
    })
  })
}
const del=()=>{
  let question = [
    {
      name: 'name',
      type: 'checkbox',
      message: '选择删除的模板（多选）：',
      choices:getNameList()
    },
    {
      name:'isDelete',
      type:'confirm',
      message:'是否删除',
    }
  ]
  inquirer.prompt(question).then((answers) => {
    let { name,isDelete}= answers
    if(name.length>0&&isDelete){
      for(let i of name){
        delete templateList[i]
      }
      fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(templateList), 'utf-8', (err) => {
        if (err) console.log(chalk.red(symbols.error), chalk.red(err))
        console.log('\n')
        console.log(chalk.green(symbols.success), chalk.green(`删除${chalk.blue(name)}成功！！\n`))
        console.log(chalk.green('模板列表如下: \n'))
        showTable()
      })
    }else{
      console.log(chalk.yellow('取消删除！！'))
    }
    
  })
}
const ls=()=>{
  showTable()
}
const init=(type,demo)=>{
  if(type){
    if(!templateList[type]){
      console.log(chalk.red(`没有${chalk.blue(type)}模板`));
    }else{
      let url=templateList[type]
      console.log(chalk.yellow('开始拉取代码'));
      const spinner=ora('拉取:'+url)
      spinner.start()
      setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'Loading rainbows';
      }, 1000);
      download(`direct:${url}`,demo?`./${demo}`:'./demo',{clone:true},(err)=>{
        if(err){
          spinner.fail()
          console.log(chalk.red(symbols.error),chalk.red(`拉取失败：${err}`))
          return
        }
        spinner.succeed()
        console.log(chalk.green(symbols.success),chalk.green('拉取成功'));
      })
    }
  }else{
    if(templateList.length<1){
      console.log(chalk.red(`没有模板`));
    }else{
      let question=[
        {
          type:"list",
          message:"请选择一个脚手架：",
          name:"cliName",
          default:getList()[0],
          choices:getList(),
        },
          {
            name:'isInit',
            type:'confirm',
            message:'是否创建',
          }
      ]
      inquirer.prompt(question).then(answers=>{
        let {cliName,isInit}=answers
        if(isInit){
          let url=templateList[cliName]
          console.log(chalk.yellow('开始拉取代码'));
          const spinner=ora('拉取:'+url)
          spinner.start()
          download(`direct:${url}`,"./demo",{clone:true},(err)=>{
            if(err){
              spinner.fail()
              console.log(chalk.red(symbols.error),chalk.red(`拉取失败：${err}`))
              return
            }
            spinner.succeed()
            console.log(chalk.green(symbols.success),chalk.green('拉取成功'));
          })
        }else{
          console.log(chalk.yellow('取消创建'));
        }
      })
    }
    
  }
}
module.exports={
  add,
  del,
  ls,
  init
}