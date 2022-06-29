import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { searchArticleServiceWithFetch } from '../../services/articles'
import ShowArticle from '../../components/user/singleArticle/show'
import Sidebar from '../../components/user/singleArticle/sidebar'
import Comment from '../../components/user/singleArticle/comment'
import PageWrap from '../../components/global/wraps/page'
import ErrorBoundary from '../../components/user/singleArticle/errorBoundary'

export default function SingleArticle ({article = null, isError = false}) {

    const {t, i18n: {language}} = useTranslation()

    return (
        <PageWrap>
            <Head>
                <title>{language === 'fa' ? article?.title : t('singleArticlePage.title')}</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            
            <div className="grid grid-cols-12 gap-6">
                <aside className="xl:col-span-3 lg:col-span-4 col-span-12 lg:order-1 order-2">
                    <Sidebar />
                </aside>

                <main className="xl:col-span-9 lg:col-span-8 col-span-12 lg:order-2 order-1">
                    {
                        isError
                            ?   <ErrorBoundary isError={isError} />
                            :
                                <>
                                    <ShowArticle article={article} />
                                    <Comment />
                                </>
                    }
                </main>
            </div>
        </PageWrap>
    )
}

export async function getServerSideProps ({params: {slug}}) {
    try {
        const {data} = await searchArticleServiceWithFetch('slug', slug)
        if (!data.length) throw ({code: 404})
        return {props: {article: data[0]}}
    } catch (error) {
        return {props: {isError: 'code' in error ? error.code : true}}
    }
}