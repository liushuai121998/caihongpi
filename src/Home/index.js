import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    newsList: [],
    footerAdShow: false,
    modalShow: false,
    dateNow: '',
    footerAd: {}
  },
  onInit() {
    this.getData()
    //   this.queryFooterAd()
    this.dateNow = this.$app.$def.parseTime(Date.now(), '{y}-{m}-{d}')
    this.insertAd()
    this.queryFooterAd()
  },
  async getData() {
    const $appDef = this.$app.$def
    const {data} = await $appDef.$http.get(`/caihongpi/index?key=${$appDef.key}`)
    if(data.code === 200) {
      this.newsList = data.newslist
    }
  },
  onShow() {
  },
  longPress(item, e) {
    clipboard.set({
      text: `${item.content}`,
      success () {
        prompt.showToast({
          message: '复制成功'
        })
      }
    })
  },
  hideFooterAd() {
      this.footerAdShow = false
      this.nativeAd && this.nativeAd.destroy()
  },
  queryFooterAd() {
    if(!ad.createNativeAd) {
      return 
    }
    //   原生广告
    this.nativeAd = ad.createNativeAd({
        adUnitId: 'da67f8883c804c988b957e65db454df9'
    })
    this.nativeAd.load()
    this.nativeAd.onLoad((res) => {
      this.footerAd = res.adList[0]
      this.footerAdShow = true
    })
  },
  reportAdClick() {
    this.nativeAd && this.nativeAd.reportAdClick({
        adId: this.footerAd.adId
    })
  },
  reportAdShow() {
    this.nativeAd && this.nativeAd.reportAdShow({
        adId: this.footerAd.adId
    })
  },
//   插屏广告
  insertAd() {
    if(ad.createInterstitialAd) {
      this.interstitialAd = ad.createInterstitialAd({
          adUnitId: 'b917d6268003443895d0124f3a8ae2b5'
      })
      this.interstitialAd.onLoad(()=> {
          this.interstitialAd.show();
      })
    }
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
  },
  closeModal() {
      this.modalShow = false
  }
})