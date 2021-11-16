import { getSession } from 'next-auth/react'

// local imports
import { editProfile } from '../../lib/db_accessor'

export default async function handle(req, res) {

  if (req.method === 'POST') {
    const { username, location, bio } = req.body;
    //
    const session = await getSession({req});

    const newProfile = await editProfile(session.user.email, {
      username: username,
      location: location,
      bio: bio
    })

    console.log("ALL GOOD HERE FOLKS ", newProfile);
    return res.status(200).json({newProfile});

  } else {
    // return error
    return res.status(405).json({err: "Method Not Allowed"});
  }



}
