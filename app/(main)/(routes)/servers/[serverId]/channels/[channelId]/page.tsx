import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import MobileToggle from '@/components/mobile-toggle';
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
      <div className='flex-1'>Future Messages</div>
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
