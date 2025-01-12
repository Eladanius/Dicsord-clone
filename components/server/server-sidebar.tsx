import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';
import { ScrollArea } from '../ui/scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 w-4 h-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 w-4 h-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 w-4 h-4' />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 w-4 h-4 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 w-4 h-4 text-rose-500' />,
};

async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();

  if (!profile) return redirect('/sign-in');

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: { orderBy: { createdAt: 'asc' } },
      members: { include: { profile: true }, orderBy: { role: 'asc' } },
    },
  });

  if (!server) return redirect('/');

  const textChannel: typeof server.channels = [];
  const audioChannel: typeof server.channels = [];
  const videoChannel: typeof server.channels = [];
  const members = server?.members.filter((member) => member.profileId !== profile.id);
  const role = server?.members.find((member) => member.profileId === profile.id)?.role;

  for (const channel of server?.channels) {
    switch (channel.type) {
      case ChannelType.TEXT:
        textChannel.push(channel);
        continue;
      case ChannelType.AUDIO:
        audioChannel.push(channel);
        continue;
      case ChannelType.VIDEO:
        videoChannel.push(channel);
        continue;
    }
  }

  return (
    <div className='flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannel.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannel.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannel.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textChannel?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              label='Text Channels'
            />
            {textChannel.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!audioChannel?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              label='Voice Channels'
            />
            {audioChannel.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!videoChannel?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              label='Video Channels'
            />
            {videoChannel.map((channel) => (
              <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
            ))}
          </div>
        )}
        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection sectionType='members' role={role} label='Members' server={server} />
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ServerSidebar;
