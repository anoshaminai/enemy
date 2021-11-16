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
import { Profile }  from '../lib/db_accessor'
import { readProfile } from './api/profile'

type props = {
  profile: Profile,
}

export const getServerSideProps: getServerSideProps = async ({ req, res}) => {

  // get profile data
  const profile = await readProfile(req, res);
  return {
    props: {
      profile : profile
    }
  }

}



const Profile: NextPage = (props) => {

  const { data: session, status } = useSession();

  console.log("PROPS: ", props);

  const [username, setUsername ] =  useState(props.profile.username);
  const [location, setLocation ] =  useState(props.profile.location);
  const [bio, setBio ] = useState(props.profile.bio);


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
  } else {
    return (
      <div className={styles.container}>
        <Header />

        <main className={styles.main}>

          <div>

              <p>
                <label >username: </label>
                <label >{username}</label>

              </p>

              <p>
                <label>location: </label>
                <label>{location} </label>

              </p>
              <p>
                bio:
              </p>
              <p>
                {bio}
              </p>
              <p>
                <button onClick={() => Router.push("/edit_profile")}>
                  <a>edit</a>
                </button>

              </p>

            </div>


        </main>
      </div>
    )

  }


}

export default Profile
