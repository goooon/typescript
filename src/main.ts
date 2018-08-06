import http = require('http');  
import fs = require('fs');
// https://zeit.co/blog/async-and-await
let finished = false;

function sleep (time:number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
function onResponse(res:any){

    
}
function getPage(page:number){
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
                    console.info("write file " + page + " done");
                    page++;
                    json = '';
                    if(page < 237){
                        getPage(page);
                    }
                    else{
                        finished = true;
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
  
class  Main{
    public static run(): number {
        
       //let destDir = '/media/gu/workspace/com.zhongchen/docs.dev/ingredients';
        let json = '';
        let i = 0;
        //let url = "http://imzhiliao.com:10000/kidscare/saas/diet/food/queryFoodList4Page?pageIndex=" + i + "&pageSize=10&foodCategoryId=&searchParam=&token=b584b56c-20a4-416b-b037-4c2e8c590c7b&schoolId=1101010267";
        //let url = "http://imzhiliao.com:10000/kidscare/saas/diet/cookbook/queryCookBookList4Page?pageIndex=" + i + "&pageSize=10&cookCategoryId=&searchParam=&token=b584b56c-20a4-416b-b037-4c2e8c590c7b&schoolId=1101010267";
        getPage(1);

        //for(;;){
            //sleep(1000);
            //if(finished)break;
        //}
        console.info("finished");
        return 0;
    }
}
Main.run();