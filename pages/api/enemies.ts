import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'

// local imports
import { User, getEnemies, getAllUsers, getAllOnline,
  getUserId, getUsernames, addEnemies, deleteEnemies }  from '../../lib/db_accessor'


export interface Enemy {
  userData: User,
  username: string,
  isOnline: boolean,
  isMyEnemy: boolean,
  iAmEnemiesOf: boolean
}

export interface EnemyReturnData {
  allEnemies: Enemy[],
  allIds: string[]
}


export async function processEnemies(req: NextApiRequest, res: NextApiResponse) : EnemyReturnData {

  // validate authentication
  const session = await getSession({req});
  if (!session) {
    res.status(401).json({err: "User Not Authenticated"});
    return [];
  }

  // fetch data
  const userId = await getUserId(session.user.email);
  const allUsers = await getAllUsers();
  const usernames = await getUsernames();
  const onlineUsers = await getAllOnline();
  const enemyData = await getEnemies(session.user.email);


  // create enemy object with relevant features + list of user ids
  let allEnemies : Enemy[] = [];
  let allIds : string[] = [];

  allUsers.forEach((val, key) => {
    allEnemies.push({
      userData: val,
      username: usernames.has(key) ? usernames.get(key) : 'ANON',
      isOnline: onlineUsers.has(key),
      isMyEnemy: enemyData.enemies.has(key),
      iAmEnemiesOf: enemyData.isEnemy.has(key)
    });
    allIds.push(val.id);
  })

  return { allEnemies: allEnemies, allIds: allIds };
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  console.error(" I AM HERE ");

    if (req.method === 'POST') {
      const { enemies } = req.body;

      const session = await getSession({req});
      if (!session) {
        res.status(401).json({err: "User Not Authenticated"});
      }

      await deleteEnemies(session.user.email);

      if (enemies.length > 0) {
        const newEnemies = await addEnemies(session.user.email, enemies);
      }

      return res.status(200).json();

    }  else {
      // return error
      return res.status(405).json({err: "Method Not Allowed"});
    }



  }
