import { getSession } from 'next-auth/react'

// local imports
import { editProfile } from '../../lib/db_accessor'

export default async function handle(req, res) {
  const { username, location, bio } = req.body;
  //
  const session = await getSession({req});
  console.log("Sess ", session.user.email);
  const newProfile = await editProfile(session.user.email, {
    username: username,
    location: location,
    bio: bio
  })
  // return res.status(200).json(newProfile);
  console.log("ALL GOOD HERE FOLKS ", newProfile);
  return res.status(200).json({ name: 'John Doe' })

}
