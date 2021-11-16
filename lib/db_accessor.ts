import { prisma } from '../client';

// database access functions. If prisma client
// does not find a record in the db, it will return 'null'.
// Get methods in this module check for that scenario and return
// empty objects instead


export interface Profile {
  username?: string,
  profileImage?: string,
  location?: string,
  bio?: string
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

export interface EnemyData {
  enemies: Set<string>,
  isEnemy: Set<string>
}

// get user id
export async function getUserId(userEmail: string): string {
  const result = await prisma.user.findUnique({
    where: {
      email: userEmail
    },
    select: {
      id: true
    }
  })
  return result ? result : '';
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

/**
 * Get usernames for list of user ids
 * @param userIds set of ids to fetch data for
 * @returns map of user id --> user name
 */
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

/**
 * Get enemy relations of a user
 * @param userEmail email address of user
 * @returns set of my users + set of users i am enemy of
 */
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

/**
 * Get all existing users
 * @returns map of user id --> user object
 */
export async function getAllUsers(): Map<string, User> {
  const result = await prisma.user.findMany();

  let users = new Map<string, User>();
  result.forEach((v) => {users.set(v.id, v)})
  return users;
}

/**
 * Get online users
 * @returns set of user ids
 */
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

/**
 * Update or create a user profile
 * @param userEmail email of user
 * @param profile new profile with desired fields filled in
 */
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

/**
 * Delete enemies of a user.
 * @param userEmail email of user
 */
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

/**
 * Add enemies for a user. Note that currently, to update an ememy list
 you must delete the existing list via deleteEnemies
 * @param userEmail email of user
 * @param currEnemies list of enemy user ids
 */
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
