import { getSession } from 'next-auth/react'
import type { NextApiRequest, NextApiResponse } from 'next'

// local imports
import { Profile, getProfile, editProfile } from '../../lib/db_accessor'

/**
 * Read profile from database & return to client-side callers
 * @param req request
 * @param res response
 * @returns profile with user data
 */
export async function readProfile(req: NextApiRequest, res: NextApiResponse) : Profile {

  const session = await getSession({req});
  if (!session) {
    return {};
  }

  const profile = await getProfile(session.user.email);
  return profile;

}


/**
 * Handle POST (& if needed, PUT) requests from client-side callers
 * POST: writes profile data to db
 * @param req request
 * @param res response
 * @returns res with status code = 200
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const { username, location, bio } = req.body;

    const session = await getSession({req});
    if (!session) {
      res.status(401).json({err: "User Not Authenticated"});
    }

    const newProfile = await editProfile(session.user.email, {
      username: username,
      location: location,
      bio: bio
    });

    return res.status(200).json({newProfile});

  } else {
    // return error
    return res.status(405).json({err: "Method Not Allowed"});
  }



}
