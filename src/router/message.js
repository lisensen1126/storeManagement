import MessageLayout from '@/components/messages/MsgsLayout'
import MsgsList from '@/components/messages/MsgsList'
import MsgsDetail from '@/components/messages/MsgsDetail'

export default {
  // name: 'order',
  path: 'message',
  component: MessageLayout,
  children: [
    {
      name: 'messageList',
      path: 'messageList',
      component: MsgsList,
      meta: {
        module: 'message',
      },
    },
    {
      name: 'messageDetail',
      path: 'messageDetail',
      component: MsgsDetail,
      meta: {
        module: 'message',
      },
    },
    {
      path: '/',
      redirect: {name: 'messageList'},
    },
  ],
}
