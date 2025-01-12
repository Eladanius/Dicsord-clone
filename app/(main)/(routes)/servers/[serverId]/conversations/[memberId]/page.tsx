import ChatHeader from '@/components/chat/chat-header';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface MemberIdPageProps {
  params: { memberId: string; serverId: string };
}

async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();
  if (!profile) return redirect('/sign-in');

  const currentMember = await db.member.findFirst({
    where: { serverId: (await params).serverId, profileId: profile.id },
    include: { profile: true },
  });

  if (!currentMember) return redirect('/');

  const conversation = await getOrCreateConversation(currentMember.id, (await params).memberId);

  if (!conversation) return redirect(`/servers/${(await params).serverId}`);

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        serverId={(await params).serverId}
        name={otherMember.profile.name}
        type='conversation'
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
}

export default MemberIdPage;
