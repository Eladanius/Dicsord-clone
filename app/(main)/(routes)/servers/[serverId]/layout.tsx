import ServerSidebar from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const profile = await currentProfile();

  if (!profile) return redirect('/sign-in');

  const server = await db.server.findUnique({
    where: { id: (await params).serverId, members: { some: { profileId: profile.id } } },
  });

  if (!server) return redirect('/');

  return (
    <div className='h-full'>
      <div className='hidden md:!flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <ServerSidebar serverId={(await params).serverId} />
      </div>
      <main className='md:pl-60 h-full'>{children}</main>
    </div>
  );
}

export default ServerIdLayout;
