import http = require('http');  
import fs = require('fs');
import qs=require('querystring');
import { resolve } from 'path';

function downloadPage(page:number){
    let json = '';
    //let url = "http://imzhiliao.com:10000/kidscare/saas/diet/food/queryFoodList4Page?pageIndex=" + page + "&pageSize=10&foodCategoryId=&searchParam=&token=b584b56c-20a4-416b-b037-4c2e8c590c7b&schoolId=1101010267";
    let url = "http://imzhiliao.com:10000/kidscare/saas/diet/cookbook/queryCookBookList4Page?pageIndex=" + page + "&pageSize=10&cookCategoryId=&searchParam=&token=b584b56c-20a4-416b-b037-4c2e8c590c7b&schoolId=1101010267";

    var req = http.request(url,function(res){
        res.on("data",function(chunk){
            json += chunk.toString();
        });
        res.on("end",function(){
                fs.writeFile('/media/gu/workspace/com.zhongchen/docs.dev/cookbook/' + page + '.txt',json,function(err){
                if(err){
                    console.error("write file failed");
                }
                else{
                    let str = JSON.stringify(json,null,4);
                    //console.info("str :" + str);
                    console.info("write file " + page + " done");
                    page++;
                    json = '';
                    if(page < 237){
                        downloadPage(page);
                    }
                }
            });
        });
    });
    req.on("error",function(err){
        console.log(err.message);
    });
    req.end();
    return;
}

class httpAsync{
    public static async requestSync(options: http.RequestOptions | string | URL) : Promise<http.IncomingMessage>{
        let promise = new Promise<http.IncomingMessage>(resolve => {
            http.request(options,res => {
                resolve(res);
            })
        })
        return promise;
    }
}

class  Main{
    public static run(): number {
        downloadPage(1);
        console.info("finished");
        return 0;
    }

    public static downloadComponents(dirpath:string):number{
        console.info('downloadComponents');
        let files = fs.readdirSync(dirpath);
        for(let file of files){
            if(!file.endsWith(".txt"))continue;
            let fullpath = dirpath + file;
            let jsonTxt = fs.readFileSync(fullpath,'utf-8');
            let jsonObj = JSON.parse(jsonTxt);
            //console.log(jsonTxt);
            let length = jsonObj['bizData']['rows'].length;
            //console.log(file);
            for(let row of jsonObj['bizData']['rows']){
                let id = row['id'];
                console.log(" id:" + id + " : " + row['dishName'] + " : " + row['cookCategoryId']);

                let post_data = '{style: "", clientInfo: {}, data: {id: ' + id + '}}';//这是需要提交的数据
                let length = post_data.length;
                let content = qs.stringify(post_data);
                let options = {
                    host:'120.55.249.217',
                    path: '/kidscare/saas/diet/cookbook/getDishesInfo?token=b584b56c-20a4-416b-b037-4c2e8c590c7b&schoolId=1101010267',
                    port:10000,
                    method: 'POST',
                    headers:{
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Encoding': 'gzip, deflate',
                        'Accept-Language': 'zh-CN,zh;q=0.9',
                        'Connection': 'keep-alive',
                        'Content-Length': length,
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Host': 'imzhiliao.com:10000',
                        'Origin': 'http://web.imzhiliao.com',
                        'Referer': 'http://web.imzhiliao.com/',
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
                    }
                  };
                  let req = http.request(options, function(res) {
                    //console.log("statusCode: ", res.statusCode);
                    //console.log("headers: ", res.headers);
                    var _data='';
                    res.on('data', function(chunk){
                       _data += chunk;
                    });
                    res.on('end', function(){
                       //console.log("\n--->>\nresult:",_data)
                       fs.writeFile('/media/gu/workspace/com.zhongchen/docs.dev/getDishesInfo/id' + id + '.txt',_data,function(err){
                           let currid = id;
                            if(err){
                                console.error("write id" + currid + " failed");
                            }
                            else{
                                //console.info("str :" + str);
                                console.info("write file id" + currid + " done");
                            }
                        });
                    });
                  });
                  req.write(post_data);
                  req.on("error",function(err){
                      console.log(err.message);
                  });
                  req.end();
            };
        }
        return 0;
    }
}
//Main.run();
Main.downloadComponents('/media/gu/workspace/com.zhongchen/docs.dev/cookbook/');