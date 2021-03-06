import DBPost from "../../../db/dbPost";

Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (options) {
        const postId = options.id;
        this.dbPost = new DBPost(postId);
        this.setData({...this.dbPost.getPostItemById()})
        this.addReadingTimes();
        this.setAnimation();
    },

    onReady: function () {
        wx.setNavigationBarTitle({title: this.data.data.title})
    },
    onCollectionTap: function () {
        let data = this.dbPost.collect();
        this.setData({
            'data.collectionStatus': data.collectionStatus,
            'data.collectionNum': data.collectionNum
        });
        wx.showToast({
            title: data.collectionStatus ? "收藏成功" : "取消收藏",
        })
    },
    onUpTap: function () {
        let data = this.dbPost.up();
        this.setData({
            'data.upStatus': data.upStatus,
            'data.upNum': data.upNum
        });
        this.animationUp.scale(2).step();
        this.setData({
            animationUp: this.animationUp.export()
        });
        let _this=this;
        setTimeout(() => {
            _this.animationUp.scale(1).step();
            _this.setData({
                animationUp: _this.animationUp.export()
            })
        }, 400);
    },
    onCommentTap: function (event) {
        const id = event.currentTarget.dataset.postId;
        wx.navigateTo({
            url: `../post-comment/post-comment?id=${id}`
        })
    },
    addReadingTimes: function () {
        this.dbPost.addReadingTimes();
    },
    onMusicTap: function (event) {
        if (this.data.isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl:this.data.data.music.url,
                title:this.data.data.music.title,
                coverImg:this.data.data.music.coverImg
            })
            this.setData({
                isPlayingMusic:true
            })
        }
    },
    onShareAppMessage:function () {
        return {
            title:this.data.data.title,
            path:'/pages/post/post-detail/post-detail'
        }
    },
    setAnimation:function () {
        let animationUp=wx.createAnimation({
            timingFunciton:'ease-in-out',
        });
        this.animationUp=animationUp;
    },
});