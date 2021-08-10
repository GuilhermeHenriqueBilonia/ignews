import { GetStaticProps } from 'next';
import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import {RichText} from 'prismic-dom'
import styles from './styles.module.scss'
import Link from 'next/link';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostProps {
    posts: Post[];
}

export default function Posts({posts}:PostProps){
    return (
        <>
            <Head>
                <title> posts | ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.post}>
                    {posts.map(post => (
                        <Link href={`posts/${post.slug}`} key={post.slug}>
                            <a>
                                <time>{post.updatedAt}</time>

                                <strong>{post.title}</strong>

                                <p>
                                    {post.excerpt}
                                </p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'publication')
    ], {
        fetch: ['publication.title', 'publication.content'],
        pageSize: 100,
    })

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            })
        }
    })

    console.log(posts)

    return {
        props: {posts}
    }
}