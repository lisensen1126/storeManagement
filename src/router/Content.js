import ContentLayout from '@/components/content/ContentLayout'
import ContentList from '@/components/content/ContentList'
import ContentListBoss from '@/components/content/ContentListBoss'
import ContentDetailBoss from '@/components/content/ContentDetailBoss'
import ContentCreate from '@/components/content/ContentCreate'
import ContentEdit from '@/components/content/ContentEdit'

export default {
  path: 'content',
  component: ContentLayout,
  children: [{
    name: 'contentList',
    path: 'contentList',
    component: ContentList,
    meta: {
      module: 'content',
      keepAlive: true,
      isOutside: false,
      isPreserve: false,
    },
  }, {
    name: 'contentListBoss',
    path: 'contentListBoss',
    component: ContentListBoss,
    meta: {
      module: 'content',
      keepAlive: true,
      isOutside: false,
      isPreserve: false,
    },
  }, {
    name: 'contentCreate',
    path: 'contentList/contentCreate',
    component: ContentCreate,
    meta: {
      module: 'content',
      isSlibing: true,
    },
  }, {
    name: 'contentEdit',
    path: 'contentList/contentEdit',
    component: ContentEdit,
    meta: {
      module: 'content',
      isSlibing: true,
    },
  }, {
    name: 'contentDetailBoss',
    path: 'contentListBoss/contentDetailBoss',
    component: ContentDetailBoss,
    meta: {
      module: 'content',
      isSlibing: true,
    },
  }, {
    path: '/',
    redirect: {name: 'contentList'},
  }],
}
