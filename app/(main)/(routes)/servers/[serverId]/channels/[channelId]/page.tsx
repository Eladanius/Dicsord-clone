import ChatHeader from '@/components/chat/chat-header';
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
    where: { serverId: (await params).serverId, profileId: profile.id },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader serverId={(await params).serverId} name={channel.name} type='channel' />
    </div>
  );
}

export default ChannelIdPage;
