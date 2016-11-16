module.exports = {
	"login_api" : "http://localhost:1103/login",   //登录，登出
	"ruser_api" : "http://localhost:1103/reg/user",   //注册,查看账号密码
	"rpassword_api" : "http://localhost:1103/reg/password",   //改密码
	"information_api" : "http://localhost:1103/user/information",   //个人信息
	"oldpayword_api" : "http://localhost:1103/user/oldpayword",   //原支付密码验证
	"reppayword_api" : "http://localhost:1103/user/payword",   //支付密码
	"nickname_api" : "http://localhost:1103/user/nickname",   //昵称
	"balance_api" : "http://localhost:1103/user/balance",   //余额
	"notice_api" : "http://localhost:1103/user/notice",   //通知
	"collect_api" : "http://localhost:1103/user/collect/:_vid",   //收藏(_vid为视频id)
	"image_api" : "http://localhost:1103/user/image",   //设置，获取，删除头像
	"repimage_api" : "http://localhost:1103/user/image/replace",   //更换头像
	"usersvideo_api" : "http://localhost:1103/user/video/",   //上传视频
	"video_api" : "http://localhost:1103/user/video",   //上传视频路径
	"detail_api" : "http://localhost:1103/user/video/detail/:_vid"   //上传，获取，删除视频详情(_vid为视频id)
}