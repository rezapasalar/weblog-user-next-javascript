import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useForm from '../../hooks/useForm'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { initialData, loginSchema } from '../../schemas/login'
import FullScreenCenterWrap from '../../components/global/wraps/fullScreenCenter'
import { InputForm, ButtonLoading } from '../../components/global/form'
import TitleForm from '../../components/user/auth/titleForm'
import { getTheme } from '../../modules/helperFunctions'
import LoginRegisterSwitch from '../../components/user/auth/loginRegisterSwitch'
import TearmPrivacy from '../../components/user/auth/tearmPrivacy'

export default function Login () {

    const {data, errors, setErrors, mapYupErrors, isSubmit, setIsSubmit, inputHandler} = useForm(initialData)

    const router = useRouter()

    const {t, i18n: {language}} = useTranslation()

    useEffect(() => {
        (localStorage?.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? window.document.documentElement.classList.add('dark'): window.document.documentElement.classList.remove('dark')
    }, [])

    const submitHandler = async e => {
        try {
            e.preventDefault()
            setIsSubmit('create')
            await loginSchema(language).validate(data, {abortEarly: false})
            setErrors({})
            toast.success(t('responses.successfulLogin'), {...getTheme()})
            localStorage.isAuth = true
            router.push('/panel')
        } catch (errors) {
            if (errors?.name === 'AxiosError') return toast.error(t('responses.axiosError'), {...getTheme()})
            setErrors(mapYupErrors(errors))
            toast.error(t('responses.formErrors'), {...getTheme()})
        } finally {
            setIsSubmit('')
        }
    }

    return (
        <>
            <Head>
                <title>{t('menu.login')}</title>
                <meta name="description" content="Generated by create next app" />
            </Head>

            <FullScreenCenterWrap>
                
                <div className="bg-white dark:bg-gray-800/50 md:border border-gray-300/80 dark:border-gray-700/60 md:rounded-2xl w-full md:w-[450px] p-6">

                    <TitleForm title={t('menu.login')} />

                    <form onSubmit={submitHandler}>
                        <InputForm label={t('fields.email')} keyname="email" value={data.email} error={errors.email} dir="ltr" inputHandler={inputHandler} />
                        <InputForm label={t('fields.password')} type="password" keyname="password" value={data.password} error={errors.password} dir="ltr" inputHandler={inputHandler} />
                        <ButtonLoading isSubmit={isSubmit} type="submit" widthFull className="mt-6">{t('buttons.login')}</ButtonLoading>
                    </form>

                    <LoginRegisterSwitch to="register" />

                </div>

                <TearmPrivacy />

            </FullScreenCenterWrap>
        </>
    )
}

Login.layout = null