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
import { EnemyData, getEnemies, getAllUsers,
  getAllOnline, getUserId, getUsernames }  from '../lib/db_accessor'

type props = {
  userId: string,
  usernames:
  allUsers: string[],
  onlineUsers: string[],
  enemies: string[],
  isEnemyOf: string[],

}


export const getServerSideProps: getServerSideProps = async ({ req, res}) => {

  // confirm that user is logged in
  const session = await getSession({req});
  if (!session) {
    res.statusCode = 403;
    return {
      props: {
        userId: null,
        allUsers: [],
        onlineUsers: [],
        enemies: [],
        isEnemyOf: []
      }};
  }

  const userId = await getUserId(session.user.email);
  const allUsers = await getAllUsers();
  const onlineUsers = await getAllOnline();
  const enemies = await getEnemies(session.user.email);
  return {
    props: {
      userId: userId,
      allUsers : allUsers,
      onlineUsers : onlineUsers,
      enemies: enemies.enemies,
      isEnemyOf: enemies.isEnemy
    }
  }

}





const EnemyList: NextPage = (props) => {

  const { data: session, status } = useSession();

  console.log("PROPS: ", props);

  // const [username, setUsername ] =  useState(props.profile.username);
  // const [location, setLocation ] =  useState(props.profile.location);
  // const [bio, setBio ] = useState(props.profile.bio);


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
                <label >ha</label>

              </p>

              <p>
                <label>location: </label>
                <label>ha </label>

              </p>
              <p>
                bio:
              </p>
              <p>
                ha
              </p>
              <p>
                <button onClick={() => Router.push("/edit_enemies")}>
                  <a>make enemies</a>
                </button>

              </p>

            </div>


        </main>
      </div>
    )

  }


}

export default EnemyList
