'use client';

import { cn } from '@/lib/utils';
import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import UserAvatar from '../user-avatar';
import { useParams, useRouter } from 'next/navigation';

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 w-4 h-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 w-4 h-4 text-rose-500' />,
};

function ServerMember({ member, server }: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member?.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 mb-1 transition',
        params?.memberId === member?.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}>
      <UserAvatar src={member?.profile.imageUrl} className='h-8 w-8 md:h-8 md:w-8' />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-300 transition',
          params?.memberId === member?.id && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}>
        {member?.profile.name}
      </p>
      {icon}
    </button>
  );
}

export default ServerMember;
