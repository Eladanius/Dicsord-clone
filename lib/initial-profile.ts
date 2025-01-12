import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    throw NextResponse.redirect('/sign-in'); // Мы бросаем исключение для обработки редиректа
  }
  //   if (!user) {
  //     const signInUrl = '/sign-in';
  //     return { redirect: { destination: signInUrl, permanent: false } };
  //   }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) return profile;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
