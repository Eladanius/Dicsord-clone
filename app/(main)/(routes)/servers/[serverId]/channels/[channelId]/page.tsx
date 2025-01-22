import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface ChannelIdPageProps {
  params: { serverId: string; channelId: string };
}

async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirect('/sign-in');

  const channel = await db.channel.findUnique({ where: { id: (await params).channelId } });
  const member = await db.member.findFirst({
    where: { serverId: channel?.serverId, profileId: profile.id },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div className='bg-white dark:bg-[#313338] !flex !flex-col min-h-screen'>
      <ChatHeader serverId={channel.serverId} name={channel.name} type='channel' />
      <ChatMessages
        name={channel.name}
        member={member}
        chatId={channel.id}
        apiUrl={'/api/messages'}
        socketUrl={'/api/socket/messages'}
        socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
        paramKey={'channelId'}
        paramValue={channel.id}
        type={'channel'}
      />
      <ChatInput
        apiUrl='/api/socket/messages'
        query={{ channelId: channel.id, serverId: channel.serverId }}
        name={channel.name}
        type='channel'
      />
    </div>
  );
}

export default ChannelIdPage;
