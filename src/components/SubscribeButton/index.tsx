import { signIn, useSession } from 'next-auth/client'
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import styles from './styles.module.scss'
import {api} from '../../services/api'
import { getStripeJs } from '../../services/stripe-js';
import { useRouter } from 'next/router';

interface SubscribeButtonProps{
    priceId: string;
}

export default function SubscribeButton({ priceId }:SubscribeButtonProps) {
    const [session] = useSession()
    const router = useRouter()
    async function handleSubscribe(){
        if(!session){
            signIn('github')
            return;
        }

        if(session.activeSubscription) {
            router.push('/posts')
            return;
        }


        try {
            const response = await api.post('/subscribe')

            const {sessionId} = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId});
        } catch (err) {
            alert(err)
        }
    }

    return(
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}