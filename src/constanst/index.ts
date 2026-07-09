// import EmptyImg from '@/assets/imgs/capture-new/Empty.png'
// import ClockImg from '@/assets/imgs/capture-new/Clock.png'
// import VerseImg from '@/assets/imgs/capture-new/Verse.png'
// import SearchImg from '@/assets/imgs/capture-new/Search.png'
// import CollectionImg from '@/assets/imgs/capture-new/Collection.png'
// import IframeImg from '@/assets/imgs/capture-new/Iframe.png'
// import TodoListImg from '@/assets/imgs/capture-new/TodoList.png'
// import WeatherImg from '@/assets/imgs/capture-new/Weather.png'
// import CountDownImg from '@/assets/imgs/capture-new/CountDown.png'
// import JuejinListImg from '@/assets/imgs/capture-new/JuejinList.png'
// import WeiboListImg from '@/assets/imgs/capture-new/WeiboList.png'
// import GithubTrendingImg from '@/assets/imgs/capture-new/GithubTrending.png'
// import DayImg from '@/assets/imgs/capture-new/Day.png'
// import ZhihuListImg from '@/assets/imgs/capture-new/ZhihuList.png'
// import EditorImg from '@/assets/imgs/capture-new/Editor.png'
// import MovieLinesImg from '@/assets/imgs/capture-new/MovieLines.png'
// import BookmarkImg from '@/assets/imgs/capture-new/Bookmark.png'

export const MATERIAL_LIST_MAP: Record<string, MaterialConstanst> = {
  Empty: {
    label: 'Empty',
    text: 'placeholderBlock',
    img: 'https://cdn.kongfandong.cn/howdz-material/Empty.png?imageView2/2/w/256'
  },
  Clock: {
    label: 'Clock',
    text: 'simpleClock',
    img: 'https://cdn.kongfandong.cn/howdz-material/Clock.png?imageView2/2/w/256'
  },
  Weather: {
    label: 'Weather',
    text: 'weather',
    img: 'https://cdn.kongfandong.cn/howdz-material/Weather.png?imageView2/2/w/256'
  },
  Search: {
    label: 'Search',
    text: 'searchBar',
    img: 'https://cdn.kongfandong.cn/howdz-material/Search.png?imageView2/2/w/256'
  },
  Collection: {
    label: 'Collection',
    text: 'navigationToCollection',
    img: 'https://cdn.kongfandong.cn/howdz-material/Collection.png?imageView2/2/w/256'
  },
  Bookmark: {
    label: 'Bookmark',
    text: 'navigationToBookmark',
    img: 'https://cdn.kongfandong.cn/howdz-material/Bookmark.png?imageView2/2/w/256'
  },
  Verse: {
    label: 'Verse',
    text: 'randomVerse',
    img: 'https://cdn.kongfandong.cn/howdz-material/Verse.png?imageView2/2/w/256'
  },
  MovieLines: {
    label: 'MovieLines',
    text: 'movieLines',
    img: 'https://cdn.kongfandong.cn/howdz-material/MovieLine.png?imageView2/2/w/256'
  },
  Iframe: {
    label: 'Iframe',
    text: 'iframePage',
    img: 'https://cdn.kongfandong.cn/howdz-material/Iframe.png?imageView2/2/w/256'
  },
  Day: {
    label: 'Day',
    text: 'customDayjs',
    img: 'https://cdn.kongfandong.cn/howdz-material/Day.png?imageView2/2/w/256'
  },
  Editor: {
    label: 'Editor',
    text: 'markdownEditor',
    img: 'https://cdn.kongfandong.cn/howdz-material/Editor.png?imageView2/2/w/256'
  },
  DailyHot: {
    label: 'DailyHot',
    text: 'dailyHotList',
    img: 'https://cdn.kongfandong.cn/howdz-material/DailyHot.png?imageView2/2/w/256'
  },
  TodoList: {
    label: 'TodoList',
    text: 'todoList',
    img: 'https://cdn.kongfandong.cn/howdz-material/TodoList.png?imageView2/2/w/256'
  },
  CountDown: {
    label: 'CountDown',
    text: 'countdown',
    img: 'https://cdn.kongfandong.cn/howdz-material/CountDown.png?imageView2/2/w/256'
  },
  WeiboList: {
    label: 'WeiboList',
    text: 'weiboTrending',
    img: 'https://cdn.kongfandong.cn/howdz-material/WeiboList.png?imageView2/2/w/256'
  },
  GithubTrending: {
    label: 'GithubTrending',
    text: 'githubTrending',
    img: 'https://cdn.kongfandong.cn/howdz-material/GithubTrending.png?imageView2/2/w/256'
  },
  ZhihuList: {
    label: 'ZhihuList',
    text: 'zhihuHotList',
    img: 'https://cdn.kongfandong.cn/howdz-material/ZhihuList.png?imageView2/2/w/256'
  },
  JuejinList: {
    label: 'JuejinList',
    text: 'juejinRecommand',
    img: 'https://cdn.kongfandong.cn/howdz-material/JuejinList.png?imageView2/2/w/256'
  }
}

export const BG_IMG_TYPE_MAP = {
  Nature: '自然',
  People: '人物',
  Architecture: '建筑',
  Technology: '科技',
  Animals: '动物'
}

export const DAILY_HOT_CLASSIFY = [
  { label: 'weibo', value: 'weibo' },
  { label: 'zhihu', value: 'zhihu' },
  { label: 'sspai', value: 'sspai' },
  { label: 'bilibili', value: 'bilibili' },
  { label: 'juejinRecommand', value: 'juejin' },
  { label: 'douban', value: 'douban_new' },
  { label: 'baiduTieba', value: 'tieba' },
  { label: 'toutiao', value: 'toutiao' },
  { label: '36kr', value: '36kr' },
  { label: 'baidu', value: 'baidu' },
  { label: 'douyin', value: 'douyin'},
  { label: 'tencentNews', value: 'newsqq' },
  { label: 'neteaseNews', value: 'netease' },
  { label: 'Github', value: 'github'},
  { label: 'V2EX', value: 'v2ex' },
  { label: 'thePaper', value: 'thepaper' }
]