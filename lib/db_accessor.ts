import { prisma } from '../client';

// database access functions. if prisma client
// does not find a record in the db, it will return 'null'
// methods in this module check for that scenario and return
// empty objects instead


export interface Profile {
  userId?: string,
  username?: string,
  profileImage?: string,
  location?: string,
  bio?: string
}

export interface EnemyData {
  enemies: Set<string>,
  isEnemy: Set<string>
}

export interface User {
  id: string,
  name?: string,
  email?: string,
  emailVerified?: DateTime,
  image?: string,
  enemies: User[],
  isEnemy: User[]

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
export async function getUsernames(userIds: string[]): Map<string, string> {
  const result = await prisma.profile.findMany({
    select: {
      userId: true,
      username: true
    }
  });
  let users = new Map<string, string>();
  result.forEach((v) => {users.set(v.userId, v.username)})
  return users;
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

  let enemies = new Set();
  let isEnemy = new Set();

  if (result && result.enemies) {
    result.enemies.forEach((v) => {enemies.add(v.id)});
  }
  if (result && result.isEnemy) {
    result.enemies.forEach((v) => {isEnemy.add(v.id)});
  }
  return {enemies: enemies, isEnemy: isEnemy};
}

//get all users
export async function getAllUsers(): Map<string, User> {
  const result = await prisma.user.findMany();

  let users = new Map<string, User>();
  result.forEach((v) => {users.set(v.id, v)})
  return users;
}

//get online users
export async function getAllOnline(): Set<string> {
  const result = await prisma.session.findMany({
    select: {
      userId: true
    }
  })
  let users = new Set<string>();
  result.forEach((v) => {users.add(v.userId)})
  return users;
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

//delete enemies
export async function deleteEnemies(userEmail: string): void {

  const result = await prisma.user.update({
    where: {
      email: userEmail
    },
    data: {
      enemies: {
        set: [],
      }
    }
  })
}

//add enemies (multiple at once)
export async function addEnemies(userEmail: string, currEnemies: string[]): void {

  let newEnemies = [];
  currEnemies.forEach((e, ind) => {
    newEnemies.push({
      where: { id: e },
      create: { id: e },
    });
  });

  const result = await prisma.user.update({
    where: {
      email: userEmail
    },
    data: {
      enemies: {
        connectOrCreate: newEnemies,
      }
    }
  })
}
