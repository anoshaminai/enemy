import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'

// local imports
import { EnemyData, getEnemies, getAllUsers,
  getAllOnline, getUserId, getUsernames }  from '../../lib/db_accessor'

type Data = {
  msg: string
}

export default async function handle(req: NextApiRequest,
    res: NextApiResponse<Data>) => {

    if (req.method === 'POST') {
      // TODO: implement post

      // const { username, location, bio } = req.body;
      // //
      // const session = await getSession({req});
      // console.log("Sess ", session.user.email);
      // const newProfile = await editProfile(session.user.email, {
      //   username: username,
      //   location: location,
      //   bio: bio
      // })
      //
      // console.log("ALL GOOD HERE FOLKS ", newProfile);
      // return res.status(200).json({newProfile});

    } else if (req.method === 'GET') {

      const session = await getSession({req});
      if (!session) {
        return res.status(403).json({name: 'invalid'})
      } else {
        res.status(200).json({ name: 'John Doe' })
      }
    } else {
      // return error
      return res.status(405).json({err: "Method Not Allowed"});
    }



  }
