import { prisma } from '../client';

// database access functions. if prisma client
// does not find a record in the db, it will return 'null'
// methods in this module check for that scenario and return
// empty objects instead


export interface Profile {
  userId? : string,
  username?: string,
  profileImage?: string,
  location?: string,
  bio?: string
}

export interface EnemyData {
  enemies: string[],
  isEnemy: string[]
}

export async function getUserId(userEmail: string): string {
  const result = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    select: {
      id: true
    }
  })
  return result;
}

//get profile data
export async function getProfile(userEmail: string): Profile {
  const result = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    include: {
      profile: true
    }
  })

  // construct empty profile if none exists
  if (result && result.profile) {
    return result.profile;
  } else {
    return {
      username: '',
      profileImage: '',
      location: '',
      bio: ''
    }
  }
}

//get user names
export async function getUsernames(userIds: string[]): Profile {
  const result = await prisma.profile.findMany({
    select: {
      userId: true,
      username: true
    }
  })
  return result;
}

//get enemies
export async function getEnemies(userEmail: string): EnemyData {
  const result = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    select: {
      enemies: true,
      isEnemy: true
    }
  })
  let enemies = result ? result : {enemies: [], isEnemy: []}
  return result
}

//get all users
export async function getAllUsers(): string[] {
  const result = await prisma.user.findMany();
  return result
}

//get online users
export async function getAllOnline(): string[] {
  const result = await prisma.session.findMany({
    select: {
      id: true
    }
  })
  return result
}

//edit profile data -- all at once, or individual fields
export async function editProfile(userEmail: string, profile: Profile): void {
  const result = await prisma.user.update({
    where: {
      email: userEmail
    },
    data: {
      profile: {
        upsert: {
          create: profile,
          update: profile,
        },
      },
    }
  })
}

//edit enemies (multiple at once)
export async function editEnemies(userEmail: string, enemies: string[]): void {
  const result = await prisma.user.upsert({
    where: {
      email: userEmail
    },
    update: {
      enemies: enemies
    },
    create: {
      enemies: enemies
    }
  })
}
