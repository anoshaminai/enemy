import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'

// local imports
import { Profile, EnemyData, getEnemies, getAllUsers,
  getAllOnline, getUserId, getUsernames, editEnemies }  from '../../lib/db_accessor'

type Data = {
  msg: string
}

export interface Enemy {
  username: string,
  isOnline: boolean,
  isMyEnemy: boolean,
  iAmEnemiesOf: boolean
}


export async function processEnemies(req: NextApiRequest, res: NextApiResponse) : Enemy[] {
  const session = await getSession({req});
  if (!session) {
    // res.statusCode = 403;
    return [];
  }

  const userId = await getUserId(session.user.email);
  const allUsers = await getAllUsers();
  const usernames = await getUsernames();
  const onlineUsers = await getAllOnline();
  const enemyData = await getEnemies(session.user.email);
  // console.error("EM ", session.user.email)
  //
  // console.error("UID : ", userId);
  // console.error("ALL USERS :", allUsers);
  // console.error("USERNAMES :", usernames);
  // console.error("ONLINE :", onlineUsers);
  // console.error("ENEMIES ", enemyData.enemies);
  // console.error("is en ", enemyData.isEnemy);
  //
  // allUsers.forEach((val, key) => {console.error("val: ", val, ", key: ", key)});

  let allEnemies : Enemy[] = [];
  allUsers.forEach((val, key) => {
    allEnemies.push({
      userData: val,
      username: usernames.has(key) ? usernames.get(key) : 'ANON',
      isOnline: onlineUsers.has(key),
      isMyEnemy: enemyData.enemies.has(key),
      iAmEnemiesOf: enemyData.isEnemy.has(key)
    })
  })

  return allEnemies;


}

export default async function handle(req, res) {

    if (req.method === 'POST') {
      const { enemies } = req.body;

      const session = await getSession({req});
      console.log("Sess ", session.user.email);

      const finalData = await editEnemies(session.user.email, enemies);

      console.log("ALL GOOD HERE FOLKS ", finalData);
      return res.status(200).json({finalData});
    }  else {
      // return error
      return res.status(405).json({err: "Method Not Allowed"});
    }



  }
