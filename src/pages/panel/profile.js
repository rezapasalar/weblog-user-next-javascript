import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux'
import useForm from '../../hooks/useForm'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { setUserInfo } from '../../store/slices/global'
import { PageWrap, ColumnGridWrap, InputForm, DateBirthForm, ButtonLoading } from '../../components/global/form'
import { initialData, profileSchema } from '../../schemas/profile'
import { searchUserService } from '../../services/users'
import { getTheme } from '../../modules/helperFunctions'

export default function Profile () {

    const {userInfo} = useSelector(state => state.global)

    const dispatch = useDispatch()

    const {t, i18n: {language}} = useTranslation()

    const {data, setData, errors, setErrors, mapYupErrors, isSubmit, setIsSubmit, inputHandler} = useForm(initialData)

    useEffect(() => {
        searchUserService('email', userInfo.email).then(({data: {data: resData}}) => {
            setData(resData[0])
        })
    }, [])

    const submitHandler = async e => {
        try {
            e.preventDefault()
            setIsSubmit('update')
            await profileSchema(language).validate(data, {abortEarly: false})
            await update()
            setErrors({})
            toast.success(t('responses.successfulSave'), {...getTheme()})
        } catch (errors) {
            if (errors?.name === 'AxiosError') return toast.error(t('responses.axiosError'), {...getTheme()})
            setErrors(mapYupErrors(errors))
            toast.error(t('responses.formErrors'), {...getTheme()})
        } finally {
            setIsSubmit('')
        }
    }

    const update = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const {updateUserService} = await import('../../services/users')
                await updateUserService(data)
                dispatch(setUserInfo(data))
                return resolve()
            } catch (err) {
                return reject(err)
            }
        })
    }

    const getDir = () => language === 'fa' ? 'rtl' : 'ltr'

    return (
        <PageWrap variant="panel">
            <Head>
                <title>{t('menu.profile')}</title>
                <meta name="description" content="Generated by create next app" />
            </Head>

            <form onSubmit={submitHandler}>
                <ColumnGridWrap>
                    <InputForm dir={getDir()} label={t('fields.name')} keyname="name" value={data.name} error={errors.name} inputHandler={inputHandler} />
                    <InputForm dir={getDir()} label={t('fields.family')} keyname="family" value={data.family} error={errors.family} inputHandler={inputHandler} />
                </ColumnGridWrap>

                <ColumnGridWrap>
                    <DateBirthForm label={t('fields.dateBirth')} value={{day: data.day, month: data.month, year: data.year}} selected={{day: 3, month: 'دی', year: '1365'}} error={errors.dateBirth} inputHandler={inputHandler} />
                    <InputForm dir="ltr" label={t('fields.code')} keyname="code" value={data.code} error={errors.code} inputHandler={inputHandler} />
                </ColumnGridWrap>

                <ColumnGridWrap>
                    <InputForm dir="ltr" label={t('fields.mobile')} keyname="mobile" value={data.mobile} error={errors.mobile} inputHandler={inputHandler} />
                    <InputForm dir="ltr" disabled label={t('fields.email')} keyname="email" value={data.email} error={errors.email} inputHandler={inputHandler} />
                </ColumnGridWrap>

                <div className={`${language === 'fa' ? 'text-left' : 'text-right'} space-x-reverse space-x-3 mt-6`}>
                    <ButtonLoading label={t('buttons.save')} isSubmit={isSubmit} type="submit" size="md" />
                </div>
            </form>
        </PageWrap>
    )
}

Profile.layout = 'panel'