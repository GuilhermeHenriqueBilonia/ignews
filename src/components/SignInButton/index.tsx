import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import {signIn, signOut, useSession} from 'next-auth/client'

import styles from './styles.module.scss'



export default function SignInButton() {
    const [session] = useSession();

    console.log(session);

    return session ?
    (
        <button type="button" className={styles.signInButton}>
            <FaGithub color="#04d361" />
            {session.user.name}
            <FiX color="#737380" onClick={() => signOut()} className={styles.closeIcon}/>
        </button>
    ) :
    (
        <button type="button" onClick={() => signIn('github')} className={styles.signInButton}>
            <FaGithub color="#eba417" />
            Sign in with Github
        </button>
    )
}