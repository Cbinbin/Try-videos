# Try-videos
The task is about the operation of the video

补充:
该项目需与(mongodb://cvideo:video123@ds155097.mlab.com:55097/trying)连接
------------------------------------------------------
已添加token认证

# 注册

### 注册手机号密码
    POST   http://localhost:1103/reg/user    
------------------------------------------------------
    {
        "phone" : ${phone},    //号码(Number,首位不能为零)
        "userpassword" : ${userpassword}    //密码(String)
    }

    >> 返回json
    {
      "_id" : "***",
      "phone" : "***",
      "userpassword" : "***"
    }
### 删除账号密码
    DELETE   http://localhost:1103/reg/user/:_id
----
    >> 返回 status: 'delete'
### 登录更换密码(需token)
    PATCH   http://localhost:1103/reg/password?token=${token}
------------------------------------------------------
    {
        "oldpassword" : ${oldpassword},    //原密码(String)
        "userpassword" : ${userpassword}    //新密码(String)
    }

    >> 返回 message: '密码更改成功'

# 登录
### 登录
    POST   http://localhost:1103/login
------------------------------------------------------
    {
        "phone" : ${phone},    //号码(Number)
        "userpassword" : ${userpassword}    //密码(String)
    }

    >>  返回token的值及其他信息
        [{"token" : ${token},
         {
          "_id" : "***",
          "phone" : ***,
          "userpassword" : "***"
         },
         {
          "headprturl" : "***"
         },
         {
          "nickname" : "***",
          "headPortrait" : "***",
          "phone" : "***",
          "paypassword" : "***",
          "balance" : ***,
          "paidVideos" : [],
          "collects" : [],
          "notices" : []
         }
        ]  


# 头像
### 上传图片
    POST   http://localhost:1103/user/image?token=${token}    
    
    //文件将保存在项目public/images中,以url保存入数据库
    //注意 key : {photofile}

    >>  返回图片路径及id
    {
        "_id" : "***",
        "headprturl" : "***"
    }

### 获取头像路径
    GET   http://localhost:1103/user/image?token=${token}

    //通过取到的路径去找到图片
    >>  返回头像路径及id
    {
        "_id" : "***",
        "headprturl" : "***"
    }
### 更换头像
    PATCH   http://localhost:1103/user/image/replace?token=${token}

    //和上传图片一样,只不过原来的图片就没了

    >>  返回头像路径及id
    {
        "_id" : "***",
        "headprturl" : "***"
    }
### 删除头像
    DELETE   http://localhost:1103/user/image/:_id    /_id为注册后返回用户的id/
    
    //删除即连同文件,不可恢复

# 个人信息
### 添加个人信息
    POST   http://localhost:1103/user/information?token=${token}
-----------------------------------------------------
    {
        "nickname" : ${nickname},    //昵称(String)
        "paypassword" : ${paypassword},    //支付密码(String)
        "balance" : ${balance},    //余额(Number)
        //"paidVideos" : ${paidVideos},    //支付视频(Array)  [存的只是视频id]
        //"notices" : ${notices},    //通知(Array)  [存的只是通知id]
        //"collects" : ${collects}    //收藏(Array)  [存的只是收藏id]
        //下面两个不需要用到的
    }

    >> 返回 status: '信息已保存'

### 查看个人信息
    GET   http://localhost:1103/user/information/:_id    /_id为注册后返回用户的id/
    >>  返回个人信息及id
    {
        "nickname" : "***",
        "headPortrait" : "***",
        "phone" : "***",
        "paypassword" : "***",
        "balance" : ***,
        "paidVideos" : "***",
        "collects" : "***",
        "notices" : "***"
    }

## 支付密码
### 1.旧支付密码验证
    POST   http://localhost:1103/user/oldpayword?token=${token}
------------------------------------------------------
    {
        "paypassword" : ${paypassword}    //原支付密码(String)
    }
    >>  返回 message: '继续下一步'
### 2.更改支付密码
    PATCH   http://localhost:1103/user/payword?token=${token}
------------------------------------------------------
    {
        "paypassword" : ${paypassword}    //新支付密码(String)
    }
    >>  返回 message: '已更改支付密码'

## 昵称
### 改昵称
    PATCH   http://localhost:1103/user/nickname?token=${token}
------------------------------------------------------
    {
        "nickname" : ${nickname}    //昵称(String)
    }
    >>  返回 message: '已更改昵称'

## 余额
### 改余额
    PATCH   http://localhost:1103/user/balance?token=${token}
------------------------------------------------------
    {
        "balance" : ${balance}    //余额(Number)
    }
    >>  返回 message: '已更改余额'
### 查余额
    GET   http://localhost:1103/user/balance?token=${token}

    >>  返回余额
    {
        "balance" : "***"
    }
## 通知
### 提交新通知
    POST   http://localhost:1103/user/notice?token=${token}
------------------------------------------------------
    {
        "videoId" : ${videoId},    //视频ID(String)
        "outlay" : ${outlay},    //支付收入数目(Number)
        "costTF" : ${costTF},    //花费 收入判断(Boolean)
        "operaTF" : ${operaTF},    //视频操作 或 花费判断(Boolean)
        "rmoveTF" : ${rmoveTF},    //上传 删除判断(Boolean)
        "IrrelevantTF" : ${IrrelevantTF},    //其他信息 或 相关信息判断(Boolean)
        "other" : ${other}    //其他信息(String)
    }
    >>  返回 message: '通知已更新'
### 获取用户全部通知
    GET   http://localhost:1103/user/allnotices?token=${token}

    >>  返回全部通知
    {
        {
            "_id" : "***",
            "videoId" : "***",
            "videoTitle" : "***",
            "payor" : "***",
            "payorId" : "***",
            "outlay" : ***,
            "costTF" : "***",
            "operaTF" : "***",
            "rmoveTF" : "***",
            "IrrelevantTF" : "***",
            "other" : "***"
        },
        {...},
        ...
    }
### 删除全部通知
    DELETE   http://localhost:1103/user/allnotices?token=${token}

## 收藏
### 添加收藏
    POST   http://localhost:1103/user/collect/:_vid?token=${token}    /_vid为视频id/
    >>  返回 message: '已添加进收藏'
### 获取用户全部收藏
    GET   http://localhost:1103/user/allcollect?token=${token}

    >>  返回全部收藏
    {
        {
            "_id" : "***",
            "collector" : "***",    // 收藏者
            "author" : "***",    //作者
            "videoTitle" : "***",    //视频名
            "vdo_id" : "***"    //视频id
        },
        {...},
        ...
    }

### 获取单个收藏
    GET   http://localhost:1103/user/collect/:_cid?token=${token}    /_cid为收藏视频保存的id/

    >>  返回收藏信息及视频信息
    [
        {
            "_id" : "***",    //收藏的id
            "collector" : "***",    // 收藏者
            "author" : "***",    //作者
            "videoTitle" : "***",    //视频名
            "cost" : ***,    //支付费用
            "vdo_id" : "***"    //视频id
        },
        {
            "_id" : "***",    //视频id
            "uploader" : "***",    //上传者
            "title" : "***",    //标题
            "introduction" : "***",    //简介
            "price" : ***,    //价格
            "paidppnumber" : ***,    //付款人数
            "concernednumber" : ***    //收藏人数
        }
    ]
### 清除单个收藏
    DELETE   http://localhost:1103/user/collect/:_cid?token=${token}
### 清除所有收藏
    DELETE   http://localhost:1103/user/allcollectes?token=${token}

### 支付视频
    POST   http://localhost:1103/user/pay/:_vid?token=${token}    /_vid为视频id/
----
    "cost" : ***,    //支付费用
    //cost > 0　才会改变视频信息中的　paidppnumber　和　paidPerson

# 视频
### 上传视频
    POST   http://localhost:1103/user/video?token=${token}    
    //文件将保存在项目public/videos中,以url保存入数据库
    //注意 key : {videofile} 
    >>  返回视频路径及id
    {
        "_id" : "***",
        "videourl" : "***"
    }

### 上传帧图
    POST   http://localhost:1103/user/videophoto/:_vid?token=${token}
    //文件将保存在项目public/vidphotos中,以url保存入数据库
    //注意 key : {vidphotofile}
    >>  返回帧图路径及id
    {
        "_id" : "***",
        "videoPhotoUrl" : "***"
    }

### 替换帧图
    PATCH   http://localhost:1103/user/videophoto/:_vid/replace?token=${token}
    //跟上传一样
    >>  返回帧图路径及id
    {
        "_id" : "***",
        "videoPhotoUrl" : "***"
    }
    
### 设置视频信息(先上传帧图,否则会报错)
    POST   http://localhost:1103/user/video/detail/:_vid?token=${token}    /_vid为视频的id/
------------------------------------------------------
    {
        "uploader" : ${uploader},    //上传者(string)
        "title" : ${title},    //标题(string)
        "introduction" : ${introduction},    //简介(string)
        "price" : ${price},    //价格(Number)
        "paidPerson" : ${paidPerson},    //付款人ID(Array)
        "cocerPerson" : ${cocerPerson},    //收藏人ID(Array)
        "paidppnumber" : ${paidppnumber},    //付款人数(Number)
        "concernednumber" : ${concernednumber}    //收藏人数(Number)
    }
    >>  返回 status: '信息已以相同id保存'
### 删除视频及信息
    DELETE   http://localhost:1103/user/video/detail/:_vid?token=${token}    /_vid为视频的id/
### 获取全部视频信息
    GET   http://localhost:1103/user/video/all/detail
    >>  返回全部视频信息
    {   
        {
            "_id" : "***",    //视频id
            "uploader" : "***",    //上传者
            "title" : "***",    //标题
            "introduction" : "***",    //简介
            "price" : ***,    //价格
            "paidPerson" : "***",    //付款人ID
            "cocerPerson" : "***",    //收藏人名字
            "paidppnumber" : ***,    //付款人数
            "concernednumber" : ***    //收藏人数
        },
        {...},
        ...
    }