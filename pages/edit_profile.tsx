import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Router from 'next/router'
import React, { useState } from 'react'
import { useSession , getSession } from 'next-auth/react'

// local imports
import styles from '../styles/Home.module.css'
import Header from "../components/Header";
import { Profile, getProfile, getEnemies }  from '../lib/db_accessor'

type props = {
  profile: Profile,
  enemies: string[]
}

export const getServerSideProps: getServerSideProps = async ({ req, res}) => {

  // confirm that user is logged in
  const session = await getSession({req});
  if (!session) {
    res.statusCode = 403;
    return { props: { profile: {}, enemies: [] } };
  }

  // get profile data
  const profile = await getProfile(session.user.email);
  const enemies = await getEnemies(session.user.email);
  return {
    props: {
      profile : profile,
      enemies: enemies
    }
  }

}



const EditProfile: NextPage = (props) => {

  const { data: session, status } = useSession();
  const profile = props.profile;
  const enemies = props.enemies;
  console.log("PROPS: ", props);

  const [username, setUsername ] =  useState(props.profile.username);
  const [location, setLocation ] =  useState(props.profile.location);
  const [bio, setBio ] = useState(props.profile.bio);

  const [inEditMode, setInEditMode ] = useState(false);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { username, location, bio };
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status !== 200) {
        console.error("request error: ", res);
      }

      await Router.push('/profile');
    } catch (error) {
      console.error(error);
    }
  }



  if (!session) {
    return <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <p className={styles.description}>
          you need to be logged in to view this page
          < /p>

        <p className={styles.description}>
          coming soon
        </p>

      </main>
    </div>
  }
  else {
    return (
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>

          <div>
            <form onSubmit={submitData}>
              <p>
                <label for='username'>username: </label>
                <input
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  type="text"
                  value={username}
                />
              </p>

              <p>
                <label for='location'>location: </label>
                <input
                  autoFocus
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="location"
                  type="text"
                  value={location}
                />
              </p>
              <p>
                bio:
              </p>
              <p>
                <textarea
                  cols={50}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="bio"
                  rows={8}
                  value={bio}
                />
              </p>
              <p>
                <input type="submit" value="update" />
                <button onClick={() => Router.push("/profile")}>
                  <a>cancel</a>
                </button>
              </p>

            </form>
            </div>


        </main>
      </div>
    )
  }


}

export default EditProfile
